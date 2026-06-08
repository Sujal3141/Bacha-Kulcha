import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { FirestoreDb, checkFirestoreConnection, isFirestoreAvailable, firestoreConnectionError } from "./firebase";

// Interface for unified data operations
export interface IFoodListing {
  id: string;
  restaurantName: string;
  name: string;
  category: string;
  originalPrice: number;
  rescuePrice: number;
  savings: number;
  quantity: number;
  pickupDeadline: string;
  distance: number;
  image: string;
  rating: number;
  co2Saved: number;
  waterSaved: number;
  aiDemandTrend: "High" | "Moderate" | "Low";
  status: "available" | "claimed" | "expired";
  lat: number;
  lng: number;
  paymentId: string;
  phone?: string;
}

export interface IOrder {
  id: string;
  listingId: string;
  foodName: string;
  restaurantName: string;
  price: number;
  quantity: number;
  pickupDeadline: string;
  status: "Reserved" | "Picked Up" | "Delivered";
  otp: string;
  timestamp: string;
  paymentMethod: string;
  fulfillmentMethod: string;
  deliveryFee: number;
  packingFee: number;
  taxes: number;
  totalPaid: number;
  deliveryAddress: string;
  distance: number;
  paymentRef: string;
  paymentVerified: boolean;
  customerLat?: number;
  customerLng?: number;
  kitchenLat?: number;
  kitchenLng?: number;
  kitchenPhone?: string;
  feedbackRating?: number;
  feedbackText?: string;
  feedbackImages?: string[];
}

export interface IReport {
  id: string;
  orderId: string;
  restaurantName: string;
  issues: string[];
  message: string;
  timestamp: string;
}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "alert" | "warning";
  timestamp: string;
}

export interface IGlobalStats {
  mealsSaved: number;
  co2Saved: number;
  waterSaved: number;
  moneyRecovered: number;
}

export interface IKitchen {
  id: string;
  name: string;
  phone: string;
  address: string;
  rating: number;
  ordersPlaced: number;
  registrationDate: string;
  fssai: string;
  gstin: string;
  businessHours: string;
  image: string;
  approved: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  gmail: string;
  lat?: number;
  lng?: number;
}

// Global In-Memory Fallback Store (replaces server local variables)
let inMemoryListings: IFoodListing[] = [];
let inMemoryOrders: IOrder[] = [];
let inMemoryReports: IReport[] = [];
let inMemoryNotifications: INotification[] = [
  {
    id: "notif-welcome",
    title: "Eco-Rescue Initialized",
    message: "System running smoothly. Post high-yield surplus inventory or configure MongoDB credentials.",
    type: "info",
    timestamp: new Date().toISOString()
  }
];
let inMemoryStats: IGlobalStats = {
  mealsSaved: 0,
  co2Saved: 0,
  waterSaved: 0,
  moneyRecovered: 0
};

let inMemoryKitchens: IKitchen[] = [
  {
    id: "rest-heritage",
    name: "The Heritage Kulcha House",
    phone: "9876543210",
    address: "Bazar Bansanwala, Inside Katra Ahluwalia, Amritsar",
    rating: 4.8,
    ordersPlaced: 124,
    registrationDate: "2026-01-15T08:00:00Z",
    fssai: "11521008000452",
    gstin: "03AABCU1234F1Z1",
    businessHours: "08:00 AM - 04:00 PM",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80",
    approved: "approved",
    gmail: "heritage.kulcha@gmail.com",
    lat: 28.6120,
    lng: 77.2030
  },
  {
    id: "rest-spice",
    name: "Spice of India",
    phone: "9876543211",
    address: "Block H, Connaught Place, New Delhi",
    rating: 4.6,
    ordersPlaced: 89,
    registrationDate: "2026-02-10T10:00:00Z",
    fssai: "13322005000109",
    gstin: "07AAACR5678B1Z2",
    businessHours: "11:00 AM - 11:59 PM",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    approved: "approved",
    gmail: "spice.india@gmail.com",
    lat: 28.6145,
    lng: 77.2115
  },
  {
    id: "rest-bakery",
    name: "Organic Royal Bakery",
    phone: "9876543212",
    address: "Khan Market, New Delhi",
    rating: 4.7,
    ordersPlaced: 43,
    registrationDate: "2026-03-01T09:00:00Z",
    fssai: "12221001000673",
    gstin: "07AABCF4321C1Z3",
    businessHours: "07:00 AM - 09:00 PM",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80",
    approved: "approved",
    gmail: "royal.bakery@gmail.com",
    lat: 28.6250,
    lng: 77.2210
  },
  {
    id: "rest-salad",
    name: "Connaught Gourmet Salad Lab",
    phone: "9876543213",
    address: "Scindia House, Connaught Circus, New Delhi",
    rating: 4.5,
    ordersPlaced: 56,
    registrationDate: "2026-03-24T08:30:00Z",
    fssai: "10018011005051",
    gstin: "07AABCS9876D1Z4",
    businessHours: "10:00 AM - 10:00 PM",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    approved: "approved",
    gmail: "salad.lab@gmail.com",
    lat: 28.6310,
    lng: 77.2085
  }
];

const BACKUP_FILE = path.join(process.cwd(), "data_rescue_backup.json");

// Save helper for local fallback persistence
function saveLocalFallback() {
  try {
    const data = {
      listings: inMemoryListings,
      orders: inMemoryOrders,
      reports: inMemoryReports,
      notifications: inMemoryNotifications,
      stats: inMemoryStats,
      kitchens: inMemoryKitchens
    };
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local fallback backup:", err);
  }
}

// Load helper for local fallback persistence
function loadLocalFallback() {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const fileContent = fs.readFileSync(BACKUP_FILE, "utf-8");
      if (fileContent.trim()) {
        const data = JSON.parse(fileContent);
        if (data.listings) inMemoryListings = data.listings;
        if (data.orders) inMemoryOrders = data.orders;
        if (data.reports) inMemoryReports = data.reports;
        if (data.notifications) inMemoryNotifications = data.notifications;
        if (data.stats) inMemoryStats = data.stats;
        if (data.kitchens) {
          const loadedKitchens = data.kitchens as IKitchen[];
          // Merge loaded kitchens with dynamic priority so configured/updated credentials and statuses are not lost
          const mergedKitchens = [...inMemoryKitchens];
          for (const lk of loadedKitchens) {
            const idx = mergedKitchens.findIndex(mk => mk.id === lk.id || mk.gmail.toLowerCase() === lk.gmail.toLowerCase());
            if (idx !== -1) {
              mergedKitchens[idx] = lk;
            } else {
              mergedKitchens.push(lk);
            }
          }
          inMemoryKitchens = mergedKitchens;
        }
        console.log("💾 Loaded local fallback backup database successfully from", BACKUP_FILE);
      }
    } else {
      saveLocalFallback();
    }
  } catch (err) {
    console.error("Failed to load local fallback backup:", err);
  }
}

// Perform initial local fallback reading
loadLocalFallback();

// Seeder check routine on Firebase/Firestore startup
async function seedFirebase() {
  console.log("🌱 Checking Firestore Database for seeding default records...");
  const active = await checkFirestoreConnection();
  if (!active) {
    console.log("⚠️ Firestore seeding routine skipped: Cloud Firestore API is not enabled/active on this project.");
    return;
  }
  try {
    // 1. Seed Stats if it doesn't exist
    const statsDoc = await FirestoreDb.get<IGlobalStats>("stats", "global");
    if (!statsDoc) {
      await FirestoreDb.set<IGlobalStats>("stats", "global", inMemoryStats);
      console.log("🌱 Seeded initial stats ledger to Firestore successfully!");
    } else {
      // Sync local stats with Firestore stats so the server cache is aligned
      inMemoryStats = statsDoc;
    }

    // 2. Check and seed default approved partner kitchens
    for (const kit of inMemoryKitchens) {
      const exists = await FirestoreDb.get<IKitchen>("kitchens", kit.id);
      if (!exists) {
        await FirestoreDb.set<IKitchen>("kitchens", kit.id, kit);
        console.log(`🌱 Seeded default approved kitchen: ${kit.name} to Firestore!`);
      }
    }

    // 3. Seed welcome notifications if empty
    const notifs = await FirestoreDb.list<INotification>("notifications");
    if (!notifs || notifs.length === 0) {
      for (const notif of inMemoryNotifications) {
        await FirestoreDb.set<INotification>("notifications", notif.id, notif);
      }
      console.log("🌱 Seeded default operation notifications to Firestore!");
    }
  } catch (err) {
    console.warn("⚠️ Firestore seeding routine bypassed or offline:", err);
  }
}

// Background trigger Firestore database pre-seeding immediately on boot
setTimeout(seedFirebase, 100);

// --- MongoDB / Mongoose Strategy ---
let isConnectedToMongo = false;
let mongoConnectionError: string | null = null;

// Connect to MongoDB
export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("⚠️ MONGODB_URI not detected in environment variables. Falling back to in-memory database strategy.");
    isConnectedToMongo = false;
    return;
  }

  try {
    // Attempt Mongoose connection with timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedToMongo = true;
    mongoConnectionError = null;
    console.log("⚡ MongoDB Connected Successfully to the primary cluster!");
    
    // Asynchronously seed default datasets to MongoDB if they don't exist yet
    setTimeout(seedDefaultData, 200);
  } catch (err: any) {
    isConnectedToMongo = false;
    mongoConnectionError = err.message || "Failed to establish connection";
    console.error("❌ MongoDB connection error:", err);
  }
}

// Define Mongoose Schemas (only used if MongoDB is active)
const ListingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  restaurantName: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  rescuePrice: { type: Number, required: true },
  savings: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pickupDeadline: { type: String, required: true },
  distance: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  co2Saved: { type: Number, required: true },
  waterSaved: { type: Number, required: true },
  aiDemandTrend: { type: String, enum: ["High", "Moderate", "Low"], required: true },
  status: { type: String, enum: ["available", "claimed", "expired"], required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  paymentId: { type: String, required: true },
  phone: { type: String }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  listingId: { type: String, required: true },
  foodName: { type: String, required: true },
  restaurantName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pickupDeadline: { type: String, required: true },
  status: { type: String, enum: ["Reserved", "Picked Up", "Delivered"], required: true },
  otp: { type: String, required: true },
  timestamp: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  fulfillmentMethod: { type: String, required: true },
  deliveryFee: { type: Number, required: true },
  packingFee: { type: Number, required: true },
  taxes: { type: Number, required: true },
  totalPaid: { type: Number, required: true },
  deliveryAddress: { type: String },
  distance: { type: Number, required: true },
  paymentRef: { type: String, required: true },
  paymentVerified: { type: Boolean, required: true },
  customerLat: { type: Number },
  customerLng: { type: Number },
  kitchenLat: { type: Number },
  kitchenLng: { type: Number },
  kitchenPhone: { type: String },
  feedbackRating: { type: Number },
  feedbackText: { type: String },
  feedbackImages: { type: [String] }
}, { timestamps: true });

const ReportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  restaurantName: { type: String, required: true },
  issues: { type: [String], required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["success", "info", "alert", "warning"], required: true },
  timestamp: { type: String, required: true }
}, { timestamps: true });

const StatsSchema = new mongoose.Schema({
  mealsSaved: { type: Number, default: 0 },
  co2Saved: { type: Number, default: 0 },
  waterSaved: { type: Number, default: 0 },
  moneyRecovered: { type: Number, default: 0 }
});

const KitchenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, required: true, default: 4.5 },
  ordersPlaced: { type: Number, required: true, default: 0 },
  registrationDate: { type: String, required: true },
  fssai: { type: String, required: true },
  gstin: { type: String, required: true },
  businessHours: { type: String, required: true },
  image: { type: String, required: true },
  approved: { type: String, enum: ["pending", "approved", "rejected"], required: true, default: "pending" },
  rejectionReason: { type: String },
  gmail: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number }
}, { timestamps: true });

const ListingModel = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);
const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
const StatsModel = mongoose.models.Stats || mongoose.model("Stats", StatsSchema);
const KitchenModel = mongoose.models.Kitchen || mongoose.model("Kitchen", KitchenSchema);
const ReportModel = mongoose.models.Report || mongoose.model("Report", ReportSchema);

// Connection Status API payload details
export function getDbStatus() {
  return {
    connected: isFirestoreAvailable || isConnectedToMongo,
    type: isFirestoreAvailable ? "firestore" : isConnectedToMongo ? "mongodb" : "in-memory",
    error: isFirestoreAvailable ? null : (firestoreConnectionError || mongoConnectionError),
    firestore: {
      active: isFirestoreAvailable,
      error: firestoreConnectionError
    },
    mongodb: {
      connected: isConnectedToMongo,
      error: mongoConnectionError
    },
    uri: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 15)}...` : undefined
  };
}

// Unified Database APIs using either Driver falling back gracefully
export const DbService = {
  // ---- Listings API ----
  getListings: async (): Promise<IFoodListing[]> => {
    try {
      const list = await FirestoreDb.list<IFoodListing>("listings");
      if (list && list.length > 0) {
        // Sort listings so order is stable
        inMemoryListings = list;
        return list;
      }
    } catch (err) {
      console.warn("⚠️ Firebase getListings offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const list = await (ListingModel as any).find({}).sort({ createdAt: -1 });
        return list.map((item: any) => item.toObject());
      } catch (err) {
        console.error("MongoDB read error, fallback to in-memory:", err);
      }
    }
    return inMemoryListings;
  },

  addListing: async (listing: IFoodListing): Promise<IFoodListing> => {
    try {
      await FirestoreDb.set<IFoodListing>("listings", listing.id, listing);
    } catch (err) {
      console.warn("⚠️ Firebase addListing offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const newDoc = new (ListingModel as any)(listing);
        await newDoc.save();
      } catch (err) {
        console.error("MongoDB write error:", err);
      }
    }
    const idx = inMemoryListings.findIndex(l => l.id === listing.id);
    if (idx !== -1) {
      inMemoryListings[idx] = listing;
    } else {
      inMemoryListings.unshift(listing);
    }
    saveLocalFallback();
    return listing;
  },

  editListing: async (id: string, updates: Partial<IFoodListing>): Promise<IFoodListing | null> => {
    try {
      await FirestoreDb.update<IFoodListing>("listings", id, updates);
    } catch (err) {
      console.warn("⚠️ Firebase editListing offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        await (ListingModel as any).findOneAndUpdate({ id }, { $set: updates });
      } catch (err) {
        console.error("MongoDB update error:", err);
      }
    }
    const idx = inMemoryListings.findIndex(l => l.id === id);
    if (idx !== -1) {
      inMemoryListings[idx] = { ...inMemoryListings[idx], ...updates };
      saveLocalFallback();
      return inMemoryListings[idx];
    }
    return null;
  },

  deleteListing: async (id: string): Promise<boolean> => {
    try {
      await FirestoreDb.delete("listings", id);
    } catch (err) {
      console.warn("⚠️ Firebase deleteListing offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        await (ListingModel as any).deleteOne({ id });
      } catch (err) {
        console.error("MongoDB delete error:", err);
      }
    }
    const idx = inMemoryListings.findIndex(l => l.id === id);
    if (idx !== -1) {
      inMemoryListings.splice(idx, 1);
      saveLocalFallback();
      return true;
    }
    return false;
  },

  // ---- Orders API ----
  getOrders: async (): Promise<IOrder[]> => {
    try {
      const list = await FirestoreDb.list<IOrder>("orders");
      if (list && list.length > 0) {
        inMemoryOrders = list;
        return list;
      }
    } catch (err) {
      console.warn("⚠️ Firebase getOrders offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const raw = await (OrderModel as any).find({}).sort({ createdAt: -1 });
        return raw.map((o: any) => o.toObject());
      } catch (err) {
        console.error("MongoDB read orders fail, fall back:", err);
      }
    }
    return inMemoryOrders;
  },

  createOrder: async (order: IOrder): Promise<IOrder> => {
    try {
      await FirestoreDb.set<IOrder>("orders", order.id, order);
    } catch (err) {
      console.warn("⚠️ Firebase createOrder offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const doc = new (OrderModel as any)(order);
        await doc.save();
      } catch (err) {
        console.error("MongoDB create order fail:", err);
      }
    }
    const idx = inMemoryOrders.findIndex(o => o.id === order.id);
    if (idx !== -1) {
      inMemoryOrders[idx] = order;
    } else {
      inMemoryOrders.unshift(order);
    }
    saveLocalFallback();
    return order;
  },

  completeOrder: async (orderId: string): Promise<IOrder | null> => {
    try {
      await FirestoreDb.update<IOrder>("orders", orderId, { status: "Delivered" });
    } catch (err) {
      console.warn("⚠️ Firebase completeOrder offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        await (OrderModel as any).findOneAndUpdate({ id: orderId }, { $set: { status: "Delivered" } });
      } catch (err) {
        console.error("MongoDB update order fail:", err);
      }
    }
    const order = inMemoryOrders.find(o => o.id === orderId);
    if (order) {
      order.status = "Delivered";
      saveLocalFallback();
      return order;
    }
    return null;
  },

  updateOrderFeedback: async (orderId: string, updates: Partial<IOrder>): Promise<IOrder | null> => {
    try {
      await FirestoreDb.update<IOrder>("orders", orderId, updates);
    } catch (err) {
      console.warn("⚠️ Firebase updateOrderFeedback offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        await (OrderModel as any).findOneAndUpdate({ id: orderId }, { $set: updates });
      } catch (err) {
        console.error("MongoDB update order feedback fail:", err);
      }
    }
    const order = inMemoryOrders.find(o => o.id === orderId);
    if (order) {
      Object.assign(order, updates);
      saveLocalFallback();
      return order;
    }
    return null;
  },

  // ---- Reports API ----
  getReports: async (): Promise<IReport[]> => {
    try {
      const list = await FirestoreDb.list<IReport>("reports");
      if (list && list.length > 0) {
        inMemoryReports = list;
        return list;
      }
    } catch (err) {
      console.warn("⚠️ Firebase getReports offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const raw = await (ReportModel as any).find({}).sort({ createdAt: -1 });
        return raw.map((r: any) => r.toObject());
      } catch (err) {
        console.error("MongoDB read reports fail, fall back:", err);
      }
    }
    return inMemoryReports;
  },

  createReport: async (report: IReport): Promise<IReport> => {
    try {
      await FirestoreDb.set<IReport>("reports", report.id, report);
    } catch (err) {
      console.warn("⚠️ Firebase createReport offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const doc = new (ReportModel as any)(report);
        await doc.save();
      } catch (err) {
        console.error("MongoDB create report fail:", err);
      }
    }
    inMemoryReports.unshift(report);
    saveLocalFallback();
    return report;
  },

  // ---- Notifications API ----
  getNotifications: async (): Promise<INotification[]> => {
    try {
      const list = await FirestoreDb.list<INotification>("notifications");
      if (list && list.length > 0) {
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        inMemoryNotifications = list;
        return list;
      }
    } catch (err) {
      console.warn("⚠️ Firebase getNotifications offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const notifs = await (NotificationModel as any).find({}).sort({ createdAt: -1 }).limit(25);
        return notifs.map((n: any) => n.toObject());
      } catch (err) {
        console.error("MongoDB read notif fail, fall back:", err);
      }
    }
    return inMemoryNotifications;
  },

  addNotification: async (notif: INotification): Promise<INotification> => {
    try {
      await FirestoreDb.set<INotification>("notifications", notif.id, notif);
    } catch (err) {
      console.warn("⚠️ Firebase addNotification offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const doc = new (NotificationModel as any)(notif);
        await doc.save();
      } catch (err) {
        console.error("MongoDB save notif fail:", err);
      }
    }
    const idx = inMemoryNotifications.findIndex(n => n.id === notif.id);
    if (idx !== -1) {
      inMemoryNotifications[idx] = notif;
    } else {
      inMemoryNotifications.unshift(notif);
    }
    saveLocalFallback();
    return notif;
  },

  // ---- Stats API ----
  getStats: async (): Promise<IGlobalStats> => {
    try {
      const stat = await FirestoreDb.get<IGlobalStats>("stats", "global");
      if (stat) {
        inMemoryStats = stat;
        return stat;
      }
    } catch (err) {
      console.warn("⚠️ Firebase getStats offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const doc = await (StatsModel as any).findOne({});
        if (doc) {
          return {
            mealsSaved: doc.mealsSaved,
            co2Saved: doc.co2Saved,
            waterSaved: doc.waterSaved,
            moneyRecovered: doc.moneyRecovered
          };
        }
      } catch (err) {
        console.error("MongoDB read stats fail, fall back:", err);
      }
    }
    return inMemoryStats;
  },

  updateStats: async (quantity: number, priceSavings: number): Promise<IGlobalStats> => {
    inMemoryStats.mealsSaved += quantity;
    inMemoryStats.co2Saved += quantity * 2.5;
    inMemoryStats.waterSaved += quantity * 100;
    inMemoryStats.moneyRecovered += priceSavings;
    saveLocalFallback();

    try {
      await FirestoreDb.set<IGlobalStats>("stats", "global", inMemoryStats);
    } catch (err) {
      console.warn("⚠️ Firebase updateStats offline/skipped:", err);
    }

    if (isConnectedToMongo) {
      try {
        const doc = await (StatsModel as any).findOne({});
        if (doc) {
          doc.mealsSaved += quantity;
          doc.co2Saved += quantity * 2.5;
          doc.waterSaved += quantity * 100;
          doc.moneyRecovered += priceSavings;
          await doc.save();
        }
      } catch (err) {
        console.error("MongoDB stats update fail:", err);
      }
    }
    return inMemoryStats;
  },

  // ---- Kitchens API ----
  getKitchens: async (): Promise<IKitchen[]> => {
    try {
      const list = await FirestoreDb.list<IKitchen>("kitchens");
      if (list && list.length > 0) {
        inMemoryKitchens = list;
        return list;
      }
    } catch (err) {
      console.warn("⚠️ Firebase getKitchens offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const raw = await (KitchenModel as any).find({}).sort({ createdAt: -1 });
        return raw.map((k: any) => k.toObject());
      } catch (err) {
        console.error("MongoDB getKitchens fail, fall back:", err);
      }
    }
    return inMemoryKitchens;
  },

  registerKitchen: async (kitchen: IKitchen): Promise<IKitchen> => {
    try {
      await FirestoreDb.set<IKitchen>("kitchens", kitchen.id, kitchen);
    } catch (err) {
      console.warn("⚠️ Firebase registerKitchen offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        const existing = await (KitchenModel as any).findOne({
          $or: [{ id: kitchen.id }, { gmail: kitchen.gmail }]
        });
        if (existing) {
          existing.set({ ...kitchen });
          await existing.save();
        } else {
          const doc = new (KitchenModel as any)(kitchen);
          await doc.save();
        }
      } catch (err) {
        console.error("MongoDB registerKitchen fail:", err);
      }
    }
    const idx = inMemoryKitchens.findIndex(k => k.id === kitchen.id || k.gmail.toLowerCase() === kitchen.gmail.toLowerCase());
    if (idx !== -1) {
      inMemoryKitchens[idx] = kitchen;
    } else {
      inMemoryKitchens.unshift(kitchen);
    }
    saveLocalFallback();
    return kitchen;
  },

  updateKitchenApproval: async (id: string, status: "approved" | "rejected", reason?: string): Promise<IKitchen | null> => {
    try {
      const updates: any = { approved: status };
      if (reason) updates.rejectionReason = reason;
      await FirestoreDb.update<IKitchen>("kitchens", id, updates);
    } catch (err) {
      console.warn("⚠️ Firebase updateKitchenApproval offline/skipped:", err);
    }
    if (isConnectedToMongo) {
      try {
        await (KitchenModel as any).findOneAndUpdate(
          { id },
          { $set: { approved: status, rejectionReason: reason } }
        );
      } catch (err) {
        console.error("MongoDB updateKitchenApproval fail:", err);
      }
    }
    const kitchen = inMemoryKitchens.find(k => k.id === id);
    if (kitchen) {
      kitchen.approved = status;
      if (reason) kitchen.rejectionReason = reason;
      saveLocalFallback();
      return kitchen;
    }
    return null;
  }
};

// Seeder check routine on MongoDB startup
async function seedDefaultData() {
  if (!isConnectedToMongo) return;
  try {
    // 1. Seed Stats if collection is empty
    const statsCount = await (StatsModel as any).countDocuments();
    if (statsCount === 0) {
      const statsDoc = new (StatsModel as any)(inMemoryStats);
      await statsDoc.save();
      console.log("🌱 Seeded initial stats ledger config to MongoDB.");
    }

    // 2. Check and upsert each default kitchen so they are never lost
    for (const defaultKitchen of inMemoryKitchens) {
      const exists = await (KitchenModel as any).findOne({ id: defaultKitchen.id });
      if (!exists) {
        const doc = new (KitchenModel as any)(defaultKitchen);
        await doc.save();
        console.log(`🌱 Seeded default approved kitchen: ${defaultKitchen.name}`);
      }
    }

    // 3. Seed Notifications if collection is empty
    const notifCount = await (NotificationModel as any).countDocuments();
    if (notifCount === 0) {
      await (NotificationModel as any).insertMany(inMemoryNotifications);
      console.log("🌱 Seeded default operation notifications to MongoDB.");
    }
  } catch (err) {
    console.error("❌ Pre-seeding database checklist failed:", err);
  }
}
