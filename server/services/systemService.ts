import { Router } from "express";
import { getDbStatus, DbService } from "../db";

const router = Router();

// Simulated System gateway response
router.get("/status", async (req, res) => {
  const dbStatus = getDbStatus();
  
  // Calculate database collections volumes
  const listingsCount = (await DbService.getListings()).length;
  const ordersCount = (await DbService.getOrders()).length;
  const notificationsCount = (await DbService.getNotifications()).length;

  res.json({
    gateway: {
      status: "ONLINE",
      version: "v2.4.0-micro",
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      cpuLoad: parseFloat((2.5 + Math.random() * 8.5).toFixed(1)),
      memoryUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
    database: {
      ...dbStatus,
      collections: {
        listings: listingsCount,
        orders: ordersCount,
        notifications: notificationsCount
      }
    },
    services: [
      {
        id: "srv-catalog",
        name: "Surplus Catalog Microservice",
        endpoint: "/api/rescue-food/listings",
        port: 3001,
        status: "ONLINE",
        latencyMs: Math.floor(15 + Math.random() * 10),
        engine: dbStatus.type === "mongodb" ? "MongoDB Native Model" : "In-Memory Map Core",
      },
      {
        id: "srv-orders",
        name: "Reservation & POS Checkout",
        endpoint: "/api/rescue-food/order",
        port: 3002,
        status: "ONLINE",
        latencyMs: Math.floor(25 + Math.random() * 15),
        engine: dbStatus.type === "mongodb" ? "MongoDB Client Adapter" : "Local RAM Array",
      },
      {
        id: "srv-notify",
        name: "Email Notification Dispatch",
        endpoint: "/api/rescue-food/notifications",
        port: 3004,
        status: "ONLINE",
        latencyMs: Math.floor(8 + Math.random() * 6),
        engine: "Gmail API Email Dispatch",
      },
    ],
    logs: [
      `[${new Date().toLocaleTimeString()}] [Gateway] Routing incoming request to API reverse-proxy orchestrator.`,
      `[${new Date().toLocaleTimeString()}] [${dbStatus.type === "mongodb" ? "MongoDB Cluster" : "Memory Database"}] Active transaction completed successfully.`,
      `[${new Date().toLocaleTimeString()}] [System] Garbage collection complete. 0 memory leaks identified.`
    ]
  });
});

export default router;
