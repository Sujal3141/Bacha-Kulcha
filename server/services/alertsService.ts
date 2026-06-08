import { Router } from "express";
import { DbService } from "../db";

const router = Router();

// Simulated Alerts Microservice latency & origin header
router.use((req, res, next) => {
  res.setHeader("X-Microservice-Origin", "Alert-Broadcast-Warning-Service");
  res.setHeader("X-Microservice-Instance-ID", "inst-alerts-2m5t");
  setTimeout(next, Math.floor(Math.random() * 12 + 5));
});

// 1. Get notifications
router.get("/", async (req, res) => {
  try {
    const list = await DbService.getNotifications();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to read notifications stream", details: err.message });
  }
});

export default router;
