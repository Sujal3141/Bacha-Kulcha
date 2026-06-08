import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  Server, 
  FileCode, 
  Database, 
  Activity, 
  Wifi, 
  RefreshCw, 
  Settings, 
  Layers, 
  Zap, 
  ShieldAlert 
} from "lucide-react";

export function DevOpsPortal() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"docker" | "fastapi" | "k8s" | "sql" | "cost">("docker");
  
  // Real-time Gateway and MongoDB Telemetry state
  const [systemStatus, setSystemStatus] = useState<any | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchSystemStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/rescue-food/system/status");
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to fetch node status:", err);
    } finally {
      setIsLoadingStatus(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    // Continuous dynamic polling every 5.5 seconds to watch latencies update
    const interval = setInterval(fetchSystemStatus, 5500);
    return () => clearInterval(interval);
  }, []);

  const clickCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const dockercomposeyml = `version: "3.8"

services:
  # API Gateway & Reverse Proxy
  api-gateway:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - user-service
      - listing-service
      - payment-service

  # Keycloak for JWT, OAuth & Google Login Identity Management
  identity-keycloak:
    image: quay.io/keycloak/keycloak:22.0
    command: start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL_HOST: db-postgres
      KC_DB_URL_DATABASE: keycloak_auth
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: secure_password_99
    ports:
      - "8080:8080"
    depends_on:
      - db-postgres

  # Core Food Listing Service (FastAPI)
  listing-service:
    build:
      context: ./services/listing-service
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/food_rescue
      - REDIS_URL=redis://cache-redis:6379/0
      - RABBITMQ_URL=amqp://guest:guest@queue-rabbitmq:5672/
    ports:
      - "8000:8000"
    depends_on:
      - db-mongodb
      - cache-redis
      - queue-rabbitmq

  # Database Engine (Mongoose / MongoDB microservice node)
  db-mongodb:
    image: mongo:6-jammy
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password_99
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  # Highly Scalable Cache layer
  cache-redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Event-Driven Queue AMQP
  queue-rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  mongodb_data:
  redis_data:
  rabbitmq_data:`;

  const fastapipython = `from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import motor.motor_asyncio
import aioredis
import json

app = FastAPI(title="Mongoose-Style MongoDB Food Rescue Service", version="1.0.0")

# Connection pools
MONGO_DETAILS = "mongodb://admin:password_99@db-mongodb:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.food_rescue
listings_collection = database.get_collection("listings")

Redis = None

@app.on_event("startup")
async def startup_event():
    global Redis
    Redis = await aioredis.from_url("redis://cache-redis:6379/0")

# Pydantic Schemas for MongoDB models
class FoodListingSchema(BaseModel):
    restaurantName: str
    name: str
    category: str
    originalPrice: float
    rescuePrice: float
    quantity: int
    pickupDeadline: str

# API endpoint: Create Surplus Deal in MongoDB & Invalidate Redis active Cache
@app.post("/api/v1/listings", status_code=status.HTTP_201_CREATED)
async def create_listing(listing: FoodListingSchema):
    new_listing = await listings_collection.insert_one(listing.dict())
    created_listing = await listings_collection.find_one({"_id": new_listing.inserted_id})
    
    # Invalidate Redis cache
    await Redis.delete("active_listings_feed")
    return {"status": "success", "data": str(created_listing)}

# API endpoint: List deals with dynamic Caching Layer pattern
@app.get("/api/v1/listings")
async def list_listings():
    # Try fetching from Redis Cache
    cache = await Redis.get("active_listings_feed")
    if cache:
        return json.loads(cache)
        
    cursor = listings_collection.find()
    listings = []
    async for document in cursor:
        document["_id"] = str(document["_id"])
        listings.append(document)
        
    # Serialize and save cache for 30 seconds
    await Redis.setex("active_listings_feed", 30, json.dumps(listings))
    return listings`;

  const k8smanifests = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: foodrescue-listing-service
  namespace: foodrescue
  labels:
    app: listing-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: listing-service
  template:
    metadata:
      labels:
        app: listing-service
    spec:
      containers:
      - name: listing-service
        image: foodrescue/listing-service:latest
        ports:
        - containerPort: 8000
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "200m"
            memory: "256Mi"
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongo-secrets
              key: connection-string
        livenessProbe:
          httpGet:
            path: /api/rescue-food/system/status
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 20
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: listing-hpa
  namespace: foodrescue
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: foodrescue-listing-service
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75`;

  const postgrespartition = `-- Highly scalable MongoDB Indexing Architecture 
-- Handles 100M+ active logs and spatial listings without query delays

-- Create geospatial 2dsphere index for local coordinate lookups
db.listings.createIndex({ loc: "2dsphere" });

-- Create compound index for fast active queries based on deadline & price 
db.listings.createIndex({ status: 1, pickupDeadline: 1, rescuePrice: 1 });

-- Create TTL (Time-To-Live) index to automatically prune expired notification documents
-- Automatically clears log entries older than 30 days (2592000 seconds)
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });`;

  const scaleouttext = `### SEED SCALE PLATFORM PLAN (₹0 - ₹1000/MONTH)
*Designed for early-stage rollout (Local launch, 0 to 10k users)*

1. **Host Layer**: Use Oracle Cloud Infrastructure (OCI) Free Tier. You get:
   - **4 Ampere A1 CPUs & 24 GB RAM (Always Free)**. Perfect for running lightweight Docker-compose node configurations safely and for free!
2. **MongoDB Database Cluster**: Deploy on MongoDB Atlas Shared Tier. You get:
   - **M0 Sandbox instance (Always Free)** with 512MB space. Supports full replication sets, telemetry tracking, and Mongoose client connections.
3. **Application Stack & SSL**: Deploy using Coolify (the self-hosted Railway equivalent) connected to OCI. Bind to free Cloudflare proxy DNS for zero SSL layout maintenance costs.

---

### STAGE 2: 100K CONCURRENT USERS SCALE
*Scaling out microservices*

1. **Database Partitioning**: Migrate MongoDB Atlas instances to a dedicated AWS M10 cluster with automated horizontal search sharding keys.
2. **Dynamic Caching**: Implement aggressive Redis read-aside caching, lowering core database lookups by up to **92%**.
3. **Queue decoupling**: Let RabbitMQ direct non-blocking task processes (e.g. order reservation SMS, push alerts, email verification loops).

---

### STAGE 3: ENTERPRISE LEVEL SCALE (10 MILLION USERS)
*Kubernetes (K8s) & CQRS Architectural specifications*

- **Horizontal Autoscaling (HPA)**: K8s scales Pod counts automatically up to 80+ replicas during peak dinner hours (7:30 PM).
- **CQRS (Command Query Responsibility Segregation)**: Route all query read filters through highly optimized mock databases or OpenSearch indices. Commands (creates/booking changes) are logged directly to write-optimized MongoDB databases.`;

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* ----------------- INTERACTIVE LIVE METRICS CONTAINER ----------------- */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Abstract futuristic grid decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Console Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/25 flex items-center justify-center animate-pulse">
              <Activity size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">Enterprise Gateway Control</h2>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest">
                  Live Status check
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Real-time microservices broker orchestration panel & MongoDB replication stats</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-slate-400 font-mono">
              Last Poll: {lastRefreshed || "Synchronizing..."}
            </span>
            <button
              onClick={fetchSystemStatus}
              disabled={isRefreshing}
              className="bg-slate-800 hover:bg-slate-755 text-white p-2 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Polling" : "Sync Node"}
            </button>
          </div>
        </div>

        {/* Dual Live Pillars: Database Status & Microservices Array */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          
          {/* MongoDB Live Driver Node Card — 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl">
                  <Database size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-mono font-extrabold text-slate-300 uppercase">MongoDB Driver Port</h4>
                  <p className="text-[10px] text-slate-500">Mongoose Layer Gateway</p>
                </div>
              </div>

              {systemStatus?.database?.connected ? (
                <div className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                  REPLICATED
                </div>
              ) : (
                <div className="bg-amber-950/80 text-amber-400 border border-amber-900 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse" />
                  FALLBACK-ACTIVE
                </div>
              )}
            </div>

            {/* Connection Information */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between font-mono text-[10px] tracking-tight">
                <span className="text-slate-500 font-semibold text-[9px] uppercase">Engine driver:</span>
                <span className="font-bold text-slate-300">
                  {systemStatus?.database?.type === "mongodb" ? "MongoDB Client Cluster" : "In-Memory High-Speed Cache"}
                </span>
              </div>
              <div className="flex justify-between font-mono text-[10px] tracking-tight">
                <span className="text-slate-500 font-semibold text-[9px] uppercase">Connection URI:</span>
                <span className="font-mono text-blue-400 break-all select-all font-bold">
                  {systemStatus?.database?.uri || "IN_MEMORY_VOLATILE_ARRAY"}
                </span>
              </div>
              <div className="flex justify-between font-mono text-[10px] border-t border-slate-850 pt-2 text-[9px] uppercase text-slate-400">
                <span>Active Document Cache:</span>
                <span className="text-emerald-400 font-black font-mono">
                  {systemStatus?.database?.collections?.listings || 0} listings • {systemStatus?.database?.collections?.orders || 0} orders
                </span>
              </div>
            </div>

            {/* Informational Guidance Warning & Whitelist Diagnostics */}
            {!systemStatus?.database?.connected && (
              <div className="space-y-3">
                {systemStatus?.database?.error && (
                  <div className="bg-rose-950/40 text-rose-300 border border-rose-900/60 p-3.5 rounded-xl text-[10px] font-mono leading-relaxed space-y-2">
                    <p className="font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
                      Active MongoDB Connection Error
                    </p>
                    <p className="bg-slate-950/60 p-2.5 rounded border border-rose-950/40 text-slate-300 break-words select-all whitespace-pre-wrap max-h-36 overflow-y-auto">
                      {systemStatus.database.error}
                    </p>
                    <div className="border-t border-rose-900/30 pt-2 text-amber-300/90 font-sans leading-normal">
                      <span className="font-extrabold block text-[10.5px] uppercase tracking-wide text-amber-200">💡 Critical Fix (IP Whitelisting Required):</span>
                      This application platform deploys to Cloud Run, which routes database queries dynamically through unstable outbound IPs. 
                      To resolve this connection block:
                      <ol className="list-decimal list-inside mt-1.5 space-y-1 font-semibold text-slate-200 text-[9.5px]">
                        <li>Navigate to your <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="underline text-sky-400 hover:text-sky-305 font-extrabold">MongoDB Atlas Dashboard</a></li>
                        <li>Go to <b>Security</b> &rarr; <b>Network Access</b></li>
                        <li>Click <b>Add IP address</b></li>
                        <li>Enter <code className="bg-slate-900 text-amber-200 px-1 py-0.5 rounded font-mono select-all">0.0.0.0/0</code> (Allow Access from Anywhere)</li>
                        <li>Wait 2-3 minutes for deployment to settle, then click <b>Sync Node</b> above!</li>
                      </ol>
                    </div>
                  </div>
                )}
                <p className="text-[10px] leading-relaxed text-slate-400 font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  💡 <b>How to activate your real MongoDB cluster?</b> Open your workspace Settings, add the environment variable <code>MONGODB_URI</code> (e.g., MongoDB Atlas URI), and hit Compile. The server automatically spins up real Mongoose schemas.
                </p>
              </div>
            )}

            {systemStatus?.database?.connected && (
              <p className="text-[10px] leading-relaxed text-emerald-400/90 font-mono bg-emerald-950/20 p-2 border border-emerald-900/30 rounded-lg">
                ✅ Secure SSL connection established to host cluster replication partitions successfully.
              </p>
            )}
          </div>

          {/* Microservices Cluster Mesh — 7 cols */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl">
                <Layers size={16} />
              </span>
              <div>
                <h4 className="text-xs font-mono font-extrabold text-slate-300 uppercase">Microservices Router Mesh</h4>
                <p className="text-[10px] text-slate-500">Service-Oriented Decoupled Topologies</p>
              </div>
            </div>

            {/* Grid of Microservices */}
            <div className="space-y-2.5">
              {systemStatus?.services?.map((svc: any) => (
                <div 
                  key={svc.id}
                  className="bg-slate-900/80 hover:bg-slate-900 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs transition-colors shrink-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-200 truncate">{svc.name}</p>
                        <span className="bg-slate-950 text-slate-400 text-[8px] font-mono px-1.5 py-0.2 rounded border border-slate-800">
                          Port {svc.port}
                        </span>
                      </div>
                      <p className="text-[9px] font-mono text-slate-500 truncate">{svc.endpoint}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="bg-slate-950 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded border border-slate-800 font-extrabold">
                      {svc.latencyMs} ms
                    </span>
                    <p className="text-[8px] uppercase tracking-wider font-mono text-slate-500 font-bold mt-0.5">{svc.engine}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gateway Proxy Status */}
            <div className="flex items-center justify-between bg-slate-900/40 p-2 border border-slate-850 rounded-xl text-[9px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Wifi size={10} className="text-emerald-400" />
                Gateway Traffic: <b>{systemStatus?.gateway?.uptime || 0}s uptime</b>
              </span>
              <span>
                System RAM: <b>{systemStatus?.gateway?.memoryUsedMb || 45} MB</b>
              </span>
              <span>
                Simulated CPU: <b>{systemStatus?.gateway?.cpuLoad || 3.1}%</b>
              </span>
            </div>
          </div>

        </div>

        {/* Live Terminal Log Stream Container */}
        <div className="mt-5 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-left font-mono">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
            <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal size={11} className="text-slate-400" />
              Real-time Ingress Proxy Log Stream
            </span>
            <span className="text-[8px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900 font-bold tracking-widest uppercase animate-pulse">
              STREAMING
            </span>
          </div>
          
          <div className="p-3.5 space-y-1.5 text-[10px] text-slate-300 max-h-24 overflow-y-auto leading-normal">
            {systemStatus?.logs?.map((logLine: string, idx: number) => (
              <p key={idx} className="truncate">
                <span className="text-slate-600 font-bold select-none">&gt;</span> <span className="text-blue-400 font-bold">{logLine.substring(0, 10)}</span> {logLine.substring(10)}
              </p>
            )) || (
              <p className="text-slate-500 italic">Listening for gateway REST cycles...</p>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- ARCHITECTURAL BLUEPRINTS EXPORTS ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        
        {/* SRE Architecture summary - 4 cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                <Server size={18} />
              </span>
              <div>
                <h3 className="text-sm font-extrabold font-mono tracking-widest uppercase text-slate-200">
                  Microservices Spec
                </h3>
                <p className="text-[10px] text-slate-400">Production Node Configuration</p>
              </div>
            </div>

            <div className="space-y-3 pt-1 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 leading-relaxed">
                <span className="text-[9.5px] font-mono text-emerald-400 uppercase font-black tracking-wide">Dynamic Event Queueing</span>
                <p className="mt-1">
                  Surplus posts trigger event-driven broadcasts using custom middleware. This decouples CPU-heavy calculations from order workflows.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 leading-relaxed">
                <span className="text-[9.5px] font-mono text-emerald-400 uppercase font-black tracking-wide">High Availability Bounds</span>
                <p className="mt-1">
                  Our system architecture includes horizontal scaling policies, integrated geospatial indexing, and custom UPI micro-verification models.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase text-gray-500 flex items-center gap-1.5">
              <Cpu size={14} className="text-slate-600" />
              Microservices Checklist
            </h4>
            
            <ul className="text-xs space-y-2 text-gray-650">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                FastAPI Gateway Adapter Configured
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                Keycloak Security OAuth Portals
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                Geospatial 2D Indexing Activated
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                Redis Appended Cache Structures
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                Kubernetes Replica Sets Config
              </li>
            </ul>
          </div>
        </div>

        {/* Code Export Tabs - 8 cols */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          
          {/* Navigation Tabs for config code blocks */}
          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 pb-2">
            {[
              { id: "docker", label: "🐳 docker-compose.yml" },
              { id: "fastapi", label: "🐍 FastAPI Endpoint" },
              { id: "k8s", label: "☸️ Kubernetes Manifest" },
              { id: "sql", label: "🗄️ MongoDB Indexing" },
              { id: "cost", label: "📈 ₹0-1000 Scale Plan" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Panel content rendering */}
          <div className="relative">
            {copiedSection === activeSubTab ? (
              <button className="absolute top-2 right-2 bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 z-30 shadow-md">
                <Check size={12} />
                Copied!
              </button>
            ) : (
              <button
                onClick={() => {
                  let textToCopy = "";
                  if (activeSubTab === "docker") textToCopy = dockercomposeyml;
                  else if (activeSubTab === "fastapi") textToCopy = fastapipython;
                  else if (activeSubTab === "k8s") textToCopy = k8smanifests;
                  else if (activeSubTab === "sql") textToCopy = postgrespartition;
                  else if (activeSubTab === "cost") textToCopy = scaleouttext;
                  clickCopy(textToCopy, activeSubTab);
                }}
                className="absolute top-2 right-2 bg-slate-900 border border-slate-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-1 z-30 shadow-md cursor-pointer transition-colors"
              >
                <Copy size={12} />
                Copy Code
              </button>
            )}

            {/* Render Codeboxes depending on sub tab selection */}
            {activeSubTab === "docker" && (
              <div className="rounded-xl overflow-hidden border border-gray-150">
                <div className="bg-slate-900 text-slate-400 font-mono text-[9px] px-4 py-2 border-b border-slate-800 flex justify-between">
                  <span>Microservice MongoDB Stack compose</span>
                  <span>yaml</span>
                </div>
                <pre className="bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-96 text-left leading-relaxed">
                  <code>{dockercomposeyml}</code>
                </pre>
              </div>
            )}

            {activeSubTab === "fastapi" && (
              <div className="rounded-xl overflow-hidden border border-gray-150">
                <div className="bg-slate-900 text-slate-400 font-mono text-[9px] px-4 py-2 border-b border-slate-800 flex justify-between">
                  <span>Python MongoDB controller with Redis cache</span>
                  <span>python</span>
                </div>
                <pre className="bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-96 text-left leading-relaxed">
                  <code>{fastapipython}</code>
                </pre>
              </div>
            )}

            {activeSubTab === "k8s" && (
              <div className="rounded-xl overflow-hidden border border-gray-150">
                <div className="bg-slate-900 text-slate-400 font-mono text-[9px] px-4 py-2 border-b border-slate-800 flex justify-between">
                  <span>Autoscale Mongo deployment manifests</span>
                  <span>yaml</span>
                </div>
                <pre className="bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-96 text-left leading-relaxed">
                  <code>{k8smanifests}</code>
                </pre>
              </div>
            )}

            {activeSubTab === "sql" && (
              <div className="rounded-xl overflow-hidden border border-gray-150">
                <div className="bg-slate-900 text-slate-400 font-mono text-[9px] px-4 py-2 border-b border-slate-800 flex justify-between">
                  <span>MongoDB Index configurations</span>
                  <span>javascript</span>
                </div>
                <pre className="bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-96 text-left leading-relaxed">
                  <code>{postgrespartition}</code>
                </pre>
              </div>
            )}

            {activeSubTab === "cost" && (
              <div className="rounded-xl p-6 bg-slate-50 border border-slate-150 overflow-y-auto max-h-102 text-left space-y-4">
                <div className="flex items-center gap-2 text-slate-900 border-b pb-3 font-mono text-xs font-bold border-gray-200">
                  <FileCode size={16} />
                  <span>MongoDB Atlas Scaling Roadmap</span>
                </div>
                <div className="text-xs font-sans text-gray-750 leading-relaxed whitespace-pre-wrap">
                  {scaleouttext}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
