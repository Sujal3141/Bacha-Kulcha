import { Router } from "express";
import { DbService, IOrder } from "../db";
import { sendEmailNotification } from "./emailNotificationService";
import { getGoogleAccessToken } from "../tokenStore";

const router = Router();

// Simulated Transaction Service latency & header telemetry
router.use((req, res, next) => {
  res.setHeader("X-Microservice-Origin", "Checkout-Transaction-Order-Service");
  res.setHeader("X-Microservice-Instance-ID", "inst-checkout-77v9");
  setTimeout(next, Math.floor(Math.random() * 25 + 10)); // Simulated processing delay
});

// 1. Get orders list
router.get("/", async (req, res) => {
  try {
    const list = await DbService.getOrders();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read order history records", details: err.message });
  }
});

// 1.5. Get reports list
router.get("/reports", async (req, res) => {
  try {
    const list = await DbService.getReports();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read reports", details: err.message });
  }
});

// 2. Reserve listing / Create Order
router.post("/", async (req, res) => {
  const { 
    listingId, 
    quantity, 
    paymentMethod,
    fulfillmentMethod,
    deliveryFee,
    packingFee,
    taxes,
    totalPaid,
    deliveryAddress,
    paymentRef,
    paymentVerified,
    customerLat,
    customerLng,
    kitchenLat,
    kitchenLng,
    kitchenPhone
  } = req.body;
  
  try {
    const listings = await DbService.getListings();
    const listing = listings.find(l => l.id === listingId);

    if (!listing) {
      return res.status(404).json({ error: "Listing item was not found" });
    }

    if (listing.status !== "available" || listing.quantity < quantity) {
      return res.status(400).json({ error: "Selected item is sold out or expired!" });
    }

    // Update remaining inventory quantity
    const finalQty = listing.quantity - quantity;
    const finalStatus = finalQty <= 0 ? "claimed" : "available";
    await DbService.editListing(listing.id, { quantity: finalQty, status: finalStatus });

    const totalPrice = listing.rescuePrice * quantity;
    const orderId = "order-" + Math.floor(100000 + Math.random() * 900000);
    const calculatedTotalPaid = totalPaid ? Number(totalPaid) : totalPrice;

    const newOrder: IOrder = {
      id: orderId,
      listingId: listing.id,
      foodName: listing.name,
      restaurantName: listing.restaurantName,
      price: totalPrice,
      quantity,
      pickupDeadline: listing.pickupDeadline,
      status: "Reserved",
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      timestamp: new Date().toISOString(),
      paymentMethod: paymentMethod || "UPI",
      fulfillmentMethod: fulfillmentMethod || "pickup",
      deliveryFee: deliveryFee ? Number(deliveryFee) : 0,
      packingFee: packingFee ? Number(packingFee) : 0,
      taxes: taxes ? Number(taxes) : 0,
      totalPaid: calculatedTotalPaid,
      deliveryAddress: deliveryAddress || "",
      distance: listing.distance,
      paymentRef: paymentRef || `SANDBOX-UTR-${Math.floor(100000000000 + Math.random() * 899999999999)}`,
      paymentVerified: paymentVerified !== undefined ? Boolean(paymentVerified) : true,
      customerLat: customerLat ? Number(customerLat) : 28.6139,
      customerLng: customerLng ? Number(customerLng) : 77.2090,
      kitchenLat: kitchenLat ? Number(kitchenLat) : (listing.lat || 28.6139),
      kitchenLng: kitchenLng ? Number(kitchenLng) : (listing.lng || 77.2090),
      kitchenPhone: kitchenPhone || listing.phone || "9876543210"
    };

    const savedOrder = await DbService.createOrder(newOrder);

    // Save eco savings stats & increment metrics
    const priceSavings = (listing.originalPrice - listing.rescuePrice) * quantity;
    const latestStats = await DbService.updateStats(quantity, priceSavings);

    // Broadcast automated system notification (stored in DB for records)
    await DbService.addNotification({
      id: "notif-" + Date.now(),
      title: "Food Secured Successfully!",
      message: `You rescued ${quantity}x ${listing.name} from ${listing.restaurantName}. Show pickup QR code at counter!`,
      type: "success",
      timestamp: new Date().toISOString()
    });

    // Email the relevant kitchen about the new order
    const kitchens = await DbService.getKitchens();
    const matchedKitchen = kitchens.find(k => 
      k.name.toLowerCase() === listing.restaurantName.toLowerCase()
    );
    if (matchedKitchen) {
      sendEmailNotification({
        title: "New Order Received! 🎉",
        message: `A customer has ordered ${quantity}x ${listing.name} (₹${listing.rescuePrice} each) from your kitchen.

Order ID: ${orderId}
Pickup Deadline: ${listing.pickupDeadline}
QR Code: RESCUE-${orderId}-${listing.id}

Please prepare the order for pickup.`,
        type: "success",
        recipientRole: "kitchen",
        kitchenId: matchedKitchen.id
      }, getGoogleAccessToken());
    }

    // Email admin about the transaction
    sendEmailNotification({
      title: "Order Transaction Completed",
      message: `New order ${orderId}: ${quantity}x ${listing.name} from ${listing.restaurantName} at ₹${totalPrice}. Payment method: ${paymentMethod || "UPI"}.`,
      type: "info",
      recipientRole: "admin"
    }, getGoogleAccessToken());

    res.json({ success: true, order: savedOrder, stats: latestStats });
  } catch (err: any) {
    res.status(500).json({ error: "Order process failure", details: err.message });
  }
});

// 3. Complete pickup
router.post("/complete", async (req, res) => {
  const { orderId } = req.body;
  try {
    const updatedOrder = await DbService.completeOrder(orderId);
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order details not found" });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    res.status(500).json({ error: "Complete pickup failed", details: err.message });
  }
});

// 4. Verify OTP
router.post("/:id/verify-otp", async (req, res) => {
  const { otp } = req.body;
  try {
    const orders = await DbService.getOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    const completed = await DbService.completeOrder(order.id);
    res.json({ success: true, order: completed });
  } catch (err: any) {
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
});

// 5. Submit Feedback
router.post("/:id/feedback", async (req, res) => {
  const { rating, text, images } = req.body;
  try {
    const updated = await DbService.updateOrderFeedback(req.params.id, {
      feedbackRating: Number(rating),
      feedbackText: text,
      feedbackImages: images || []
    });
    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Feedback failed", details: err.message });
  }
});

// 6. Submit Report
router.post("/:id/report", async (req, res) => {
  const { issues, message, restaurantName } = req.body;
  try {
    const report = await DbService.createReport({
      id: "rep-" + Date.now(),
      orderId: req.params.id,
      restaurantName,
      issues: issues || [],
      message,
      timestamp: new Date().toISOString()
    });
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ error: "Report failed", details: err.message });
  }
});

export default router;
