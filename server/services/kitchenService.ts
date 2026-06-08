import { Router } from "express";
import { DbService, IKitchen, INotification } from "../db";
import { sendEmailNotification } from "./emailNotificationService";
import { getGoogleAccessToken } from "../tokenStore";

const router = Router();

// Simulated internal security logging
router.use((req, res, next) => {
  res.setHeader("X-Microservice-Origin", "Partner-Kitchen-Gateway");
  next();
});

// 1. Get all kitchens
router.get("/", async (req, res) => {
  try {
    const list = await DbService.getKitchens();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve partner kitchens", details: err.message });
  }
});

// 2. Get specific kitchen by Google verified Gmail
router.get("/gmail/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const list = await DbService.getKitchens();
    const match = list.find(k => k.gmail.toLowerCase() === email.toLowerCase() || k.id.toLowerCase() === email.toLowerCase());
    
    if (match) {
      res.json(match);
    } else {
      // Return 200 OK with notFound status instead of 404 to avoid scary red browser console log errors
      res.json({ notFound: true, registered: false, error: "Kitchen registration not found for verified Gmail." });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed checking kitchen status", details: err.message });
  }
});

// 3. Register a new kitchen (Distributor)
router.post("/register", async (req, res) => {
  try {
    const { name, phone, address, fssai, gstin, businessHours, image, gmail } = req.body;

    if (!name || !phone || !address || !fssai || !gstin || !businessHours || !gmail) {
      return res.status(400).json({ error: "Missing required registration details" });
    }

    const cleanGmail = gmail.trim().toLowerCase();
    const emailSlug = cleanGmail.replace(/[^a-z0-9]/g, "");
    const nameSlug = name.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").toLowerCase();
    const id = `rest-dynamic-${nameSlug}-${emailSlug}`;

    const newKitchen: IKitchen = {
      id,
      name,
      phone,
      address,
      rating: 4.8,
      ordersPlaced: 0,
      registrationDate: new Date().toISOString(),
      fssai,
      gstin,
      businessHours,
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      approved: "pending",
      gmail: cleanGmail
    };

    const saved = await DbService.registerKitchen(newKitchen);

    // Store notification in DB for records
    const notif: INotification = {
      id: `notif-reg-${Date.now()}`,
      title: "New Kitchen Registered",
      message: `"${name}" (${cleanGmail}) submitted registration for verification with FSSAI: ${fssai}. Check operations panel.`,
      type: "warning",
      timestamp: new Date().toISOString()
    };
    await DbService.addNotification(notif);

    // Email admin about new registration
    sendEmailNotification({
      title: "New Kitchen Registration Submitted",
      message: `A new kitchen "${name}" (${cleanGmail}) has submitted registration for verification.\n\nFSSAI: ${fssai}\nGSTIN: ${gstin}\nPhone: ${phone}\nAddress: ${address}\n\nPlease review and approve/reject from the Admin Operations Dashboard.`,
      type: "warning",
      recipientRole: "admin"
    }, getGoogleAccessToken());

    // Email the kitchen owner about their submission
    sendEmailNotification({
      title: "Registration Received — Under Review",
      message: `Thank you for registering "${name}" on bacha kulcha! Your FSSAI credentials (${fssai}) are now under review by our compliance team. You will receive an email notification once the audit is complete.`,
      type: "info",
      recipientRole: "kitchen",
      kitchenId: id
    }, getGoogleAccessToken());

    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: "Attempt to register kitchen database failed", details: err.message });
  }
});

// 4. Approve kitchen registration
router.post("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const kitchen = await DbService.updateKitchenApproval(id, "approved");

    if (!kitchen) {
      return res.status(404).json({ error: "Kitchen not found" });
    }

    // Store notification in DB for records
    const winNotif: INotification = {
      id: `notif-app-${Date.now()}`,
      title: "Kitchen Approved",
      message: `Verified licensing accepted! "${kitchen.name}" is now online and authorised to host surplus buffets.`,
      type: "success",
      timestamp: new Date().toISOString()
    };
    await DbService.addNotification(winNotif);

    // Email the kitchen about approval
    sendEmailNotification({
      title: "Your Kitchen Has Been Approved! 🎉",
      message: `Congratulations! "${kitchen.name}" has been approved and is now ACTIVE on bacha kulcha.\n\nYour merchant console listing privileges have been fully activated. You are now authorized to register leftover specialties, customize dynamic price curves, and receive dynamic on-demand reservations from customer users!`,
      type: "success",
      recipientRole: "kitchen",
      kitchenId: id
    }, getGoogleAccessToken());

    // Notify admin about the action
    sendEmailNotification({
      title: "Kitchen Approval Confirmed",
      message: `Kitchen "${kitchen.name}" (${kitchen.gmail}) has been approved and is now active on the platform.`,
      type: "success",
      recipientRole: "admin"
    }, getGoogleAccessToken());

    res.json({ success: true, kitchen });
  } catch (err: any) {
    res.status(500).json({ error: "Approval pipeline failed", details: err.message });
  }
});

// 5. Reject kitchen registration
router.post("/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const kitchen = await DbService.updateKitchenApproval(id, "rejected", reason || "Regulatory mismatch");

    if (!kitchen) {
      return res.status(404).json({ error: "Kitchen not found" });
    }

    // Store notification in DB for records
    const failNotif: INotification = {
      id: `notif-[#notif-reject-${Date.now()}]`,
      title: "Kitchen Rejected",
      message: `"${kitchen.name}" registration was rejected: ${reason || "GSTIN or Licensing checklist mismatch"}.`,
      type: "alert",
      timestamp: new Date().toISOString()
    };
    await DbService.addNotification(failNotif);

    // Email the kitchen about rejection
    sendEmailNotification({
      title: "Kitchen Verification — Action Required",
      message: `Your commercial outlet registration for "${kitchen.name}" has been SUSPENDED/REJECTED.\n\nReason: ${reason || "GSTIN or Licensing checklist mismatch"}\n\nOur compliance team reviews registrations to ensure all FSSAI licensing, GSTIN tax credentials, and hygiene standards meet strict regulatory mandates. Please update your registration credentials with valid documents and resubmit for verification.`,
      type: "alert",
      recipientRole: "kitchen",
      kitchenId: id
    }, getGoogleAccessToken());

    // Notify admin about the action
    sendEmailNotification({
      title: "Kitchen Registration Rejected",
      message: `Kitchen "${kitchen.name}" (${kitchen.gmail}) was rejected.\nReason: ${reason || "GSTIN or Licensing checklist mismatch"}`,
      type: "alert",
      recipientRole: "admin"
    }, getGoogleAccessToken());

    res.json({ success: true, kitchen });
  } catch (err: any) {
    res.status(500).json({ error: "Rejection response failed", details: err.message });
  }
});

export default router;
