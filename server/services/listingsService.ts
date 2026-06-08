import { Router } from "express";
import { DbService, IFoodListing } from "../db";
import { sendEmailNotification } from "./emailNotificationService";
import { getGoogleAccessToken } from "../tokenStore";

const router = Router();

// Simulated Inventory Service latency & header telemetry
router.use((req, res, next) => {
  res.setHeader("X-Microservice-Origin", "Surplus-Catalog-Inventory-Service");
  res.setHeader("X-Microservice-Instance-ID", "inst-catalog-1a2c");
  // Simulate standard internal gateway proxy relay latency
  setTimeout(next, Math.floor(Math.random() * 20 + 5));
});

// 1. Get listings
router.get("/", async (req, res) => {
  try {
    const list = await DbService.getListings();
    const now = new Date();
    let modified = false;

    // Evaluate expired deadlines
    for (const item of list) {
      if (new Date(item.pickupDeadline) < now && item.status === "available") {
        item.status = "expired";
        await DbService.editListing(item.id, { status: "expired" });
        modified = true;
      }
    }

    const finalList = modified ? await DbService.getListings() : list;
    res.json(finalList);
  } catch (err: any) {
    res.status(500).json({ error: "Inventory service retrieval failed", details: err.message });
  }
});

// 2. Add listing
router.post("/add", async (req, res) => {
  const { name, restaurantName, originalPrice, rescuePrice, quantity, pickupDeadline, category, paymentId, lat, lng, image } = req.body;
  
  if (!name || !originalPrice || !rescuePrice || !quantity || !pickupDeadline || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const oPrice = Number(originalPrice);
  const rPrice = Number(rescuePrice);
  const qty = Number(quantity);
  
  const co2Val = qty * 2.5;
  const waterVal = qty * 100;
  const dist = parseFloat((Math.random() * 3 + 0.3).toFixed(1));

  // Determine locations & phone
  const kitchens = await DbService.getKitchens();
  const kMatch = kitchens.find(k => 
    k.name.toLowerCase() === String(restaurantName || "").trim().toLowerCase() ||
    k.id.toLowerCase() === String(restaurantName || "").trim().toLowerCase()
  );

  let finalLat = lat ? Number(lat) : (kMatch?.lat || 28.6139);
  let finalLng = lng ? Number(lng) : (kMatch?.lng || 77.2090);
  let finalPhone = kMatch?.phone || "9876543210";

  if (!lat || !lng) {
    if (!kMatch) {
      const nameNorm = String(restaurantName || "").trim();
      if (nameNorm === "Spice of India") {
        finalLat = 28.6139; finalLng = 77.2090;
      } else if (nameNorm === "Levain Bakery") {
        finalLat = 28.6280; finalLng = 77.2210;
      } else if (nameNorm === "Hotel Grand Banquet") {
        finalLat = 28.5850; finalLng = 77.1950;
      } else if (nameNorm === "Organic Delights") {
        finalLat = 28.6350; finalLng = 77.2450;
      } else {
        finalLat = 28.6139 + (Math.random() - 0.5) * 0.04;
        finalLng = 77.2090 + (Math.random() - 0.5) * 0.04;
      }
    }
  }

  const finalPaymentId = paymentId ? String(paymentId) : (restaurantName ? restaurantName.toLowerCase().replace(/\s+/g, '') + "@upi" : "merchant@upi");

  const newListing: IFoodListing = {
    id: "lst-" + Date.now(),
    restaurantName: restaurantName || "Partner Restaurant",
    name,
    category,
    originalPrice: oPrice,
    rescuePrice: rPrice,
    savings: oPrice - rPrice,
    quantity: qty,
    pickupDeadline: new Date(pickupDeadline).toISOString(),
    distance: dist,
    image: image || category,
    rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
    co2Saved: co2Val,
    waterSaved: waterVal,
    aiDemandTrend: (qty > 10 ? "Moderate" : "High"),
    status: "available",
    lat: finalLat,
    lng: finalLng,
    paymentId: finalPaymentId,
    phone: finalPhone
  };

  try {
    const saved = await DbService.addListing(newListing);

    // Broadcast system notification
    const notificationId = "notif-" + Date.now();
    await DbService.addNotification({
      id: notificationId,
      title: "New Surplus Deal!",
      message: `${restaurantName || "Partner"} has listed ${qty}x ${name} at ₹${rPrice}! Save food before it expires.`,
      type: "success",
      timestamp: new Date().toISOString()
    });

    // Email admin about new listing
    sendEmailNotification({
      title: "New Surplus Listing Published",
      message: `${restaurantName || "Partner"} has listed ${qty}x ${name} at ₹${rPrice} (original ₹${oPrice}). Save food before it expires!`,
      type: "success",
      recipientRole: "admin"
    }, getGoogleAccessToken());

    res.json({ success: true, listing: saved });
  } catch (err: any) {
    res.status(500).json({ error: "Add listing service transaction failed", details: err.message });
  }
});

// 3. Edit listing
router.post("/edit", async (req, res) => {
  const { id, name, originalPrice, rescuePrice, quantity, pickupHours, category, paymentId, image } = req.body;
  
  if (!id || !name || !originalPrice || !rescuePrice || !quantity || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const oPrice = Number(originalPrice);
  const rPrice = Number(rescuePrice);
  const qty = Number(quantity);

  const updates: Partial<IFoodListing> = {
    name,
    category,
    originalPrice: oPrice,
    rescuePrice: rPrice,
    savings: oPrice - rPrice,
    quantity: qty,
    image: image || category
  };

  if (paymentId) {
    updates.paymentId = paymentId;
  }

  if (pickupHours) {
    updates.pickupDeadline = new Date(Date.now() + Number(pickupHours) * 60 * 60 * 1000).toISOString();
  }

  // Adjust available status
  if (qty > 0) {
    updates.status = "available";
  }

  try {
    const updated = await DbService.editListing(id, updates);
    if (!updated) {
      return res.status(404).json({ error: "Listing not found or failed update" });
    }
    res.json({ success: true, listing: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Edit listing update failed", details: err.message });
  }
});

// 4. Delete listing
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const success = await DbService.deleteListing(id);
    if (!success) {
      return res.status(404).json({ error: "Listing not found on current node" });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Delete operation failed", details: err.message });
  }
});

// 5. Dynamic pricing optimizer algorithm
router.post("/auto-price-ai", async (req, res) => {
  try {
    const list = await DbService.getListings();
    const now = new Date();
    
    for (const item of list) {
      if (item.status === "available") {
        const deadline = new Date(item.pickupDeadline);
        const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

        const updates: Partial<IFoodListing> = {};

        if (hoursRemaining <= 0) {
          updates.status = "expired";
        } else if (hoursRemaining < 2) {
          updates.rescuePrice = Math.max(15, Math.ceil(item.originalPrice * 0.1));
          updates.aiDemandTrend = "High";
          updates.savings = item.originalPrice - updates.rescuePrice;
        } else if (hoursRemaining < 4) {
          updates.rescuePrice = Math.max(25, Math.ceil(item.originalPrice * 0.2));
          updates.aiDemandTrend = "High";
          updates.savings = item.originalPrice - updates.rescuePrice;
        } else if (hoursRemaining < 6) {
          updates.rescuePrice = Math.max(35, Math.ceil(item.originalPrice * 0.3));
          updates.aiDemandTrend = "Moderate";
          updates.savings = item.originalPrice - updates.rescuePrice;
        } else {
          updates.rescuePrice = Math.max(50, Math.ceil(item.originalPrice * 0.4));
          updates.savings = item.originalPrice - updates.rescuePrice;
        }

        if (Object.keys(updates).length > 0) {
          await DbService.editListing(item.id, updates);
        }
      }
    }

    // Capture execution audit log
    await DbService.addNotification({
      id: "notif-" + Date.now(),
      title: "AI Optimization Complete",
      message: "Dynamic Pricing AI Service adjusted active listings based on instant kitchen metrics.",
      type: "alert",
      timestamp: new Date().toISOString()
    });

    // Email admin about AI pricing run
    sendEmailNotification({
      title: "AI Dynamic Pricing Complete",
      message: "The Dynamic Pricing AI Service has adjusted active listings based on instant kitchen metrics, pickup deadlines, and demand trends. Review updated prices in the Operations Dashboard.",
      type: "info",
      recipientRole: "admin"
    }, getGoogleAccessToken());

    const refreshedList = await DbService.getListings();
    res.json({ success: true, listings: refreshedList });
  } catch (err: any) {
    res.status(500).json({ error: "Pricing service optimizer failed", details: err.message });
  }
});

export default router;
