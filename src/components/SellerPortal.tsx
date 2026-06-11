import React, { useState, useEffect } from "react";
import { PlusCircle, Sparkles, Sliders, Info, Flame, AlertTriangle, HelpCircle, Check, Loader2 } from "lucide-react";
import { FoodListing } from "../types";

interface SellerPortalProps {
  onListingAdded: () => void;
  listings: FoodListing[];
  onTriggerAutoPrice: () => void;
  sellerRestaurantName?: string;
}

export function SellerPortal({ onListingAdded, listings, onTriggerAutoPrice, sellerRestaurantName, orders = [] }: SellerPortalProps & { orders?: import('../types').Order[] }) {
  // Tabs
  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");
  
  // Active Orders state
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  // New listing state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("cooked");
  const [originalPrice, setOriginalPrice] = useState("");
  const [rescuePrice, setRescuePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupHours, setPickupHours] = useState("4"); // default 4 hours from now
  const [imageFile, setImageFile] = useState<string | null>(null);
  
  const [restaurantName, setRestaurantName] = useState(() => {
    return sellerRestaurantName || "Spice of India";
  });

  useEffect(() => {
    if (sellerRestaurantName) {
      setRestaurantName(sellerRestaurantName);
    }
  }, [sellerRestaurantName]);

  useEffect(() => {
    const formatted = restaurantName.toLowerCase().replace(/\s+/g, "");
    setPaymentId(`${formatted}@upi`);
  }, [restaurantName]);

  // Dynamic state
  const [paymentId, setPaymentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Edit & Delete listing state
  const [editingListing, setEditingListing] = useState<FoodListing | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (lst: FoodListing) => {
    setEditingListing(lst);
    setName(lst.name);
    setCategory(lst.category);
    setOriginalPrice(String(lst.originalPrice));
    setRescuePrice(String(lst.rescuePrice));
    setQuantity(String(lst.quantity));
    setPaymentId(lst.paymentId || "");
    setPickupHours("4");
    setImageFile(lst.image?.startsWith("data:") ? lst.image : null);
    setSuccessMsg("");
    // Scroll form into view
    const element = document.getElementById("restaurant-selector-badge") || document.getElementById("restaurant-selector");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEdit = () => {
    setEditingListing(null);
    setName("");
    setOriginalPrice("");
    setRescuePrice("");
    setQuantity("");
    setPickupHours("4");
    setImageFile(null);
    setAiReport(null);
  };

  const handleDelete = async (id: string) => {
    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/rescue-food/listings/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setSuccessMsg("Listing successfully deleted!");
        if (editingListing?.id === id) {
          handleCancelEdit();
        }
        onListingAdded();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setSuccessMsg("Failed to delete listing.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // Target Slider Simulation
  const [hoursToExpirySlider, setHoursToExpirySlider] = useState(4);

  // Generate dynamic recommendation
  const simulatePriceRecommendation = (original: number, hours: number) => {
    let discount = 0.4;
    if (hours <= 1) discount = 0.9;
    else if (hours <= 3) discount = 0.7;
    else if (hours <= 6) discount = 0.4;
    
    return {
      price: Math.max(15, Math.round(original * (1 - discount))),
      discountPercent: Math.round(discount * 100)
    };
  };

  const currentSimulation = simulatePriceRecommendation(
    originalPrice ? Number(originalPrice) : 300,
    hoursToExpirySlider
  );

  const handleVerifyOtp = async (orderId: string) => {
    const otp = otpInputs[orderId];
    if (!otp) return;
    try {
      const res = await fetch(`/api/rescue-food/orders/${orderId}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp })
      });
      if (res.ok) {
        alert("OTP Verified! Order marked as Delivered.");
        setOtpInputs({ ...otpInputs, [orderId]: "" });
        onListingAdded();
      } else {
        const data = await res.json();
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to verify OTP.");
    }
  };

  // Run AI analysis with Gemini
  const handleAiAnalysis = async () => {
    if (!name) {
      alert("Please enter a food name first to run AI prediction model!");
      return;
    }
    setAiAnalyzing(true);
    setAiReport(null);
    try {
      const res = await fetch("/api/rescue-food/ai/analyze-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          originalPrice: originalPrice ? Number(originalPrice) : 300,
          quantity: quantity ? Number(quantity) : 5,
          hoursToExpiry: Number(pickupHours)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiReport(data);
        // Automatically populate helper rescue price suggestions
        if (data.recommendedRescuePrice) {
          setRescuePrice(String(data.recommendedRescuePrice));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Submit Listing Or Update Listing
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !originalPrice || !rescuePrice || !quantity) {
      alert("Please fill in all blanks.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingListing) {
        // Edit mode
        const res = await fetch("/api/rescue-food/listings/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingListing.id,
            name,
            originalPrice,
            rescuePrice,
            quantity,
            pickupHours: Number(pickupHours),
            category,
            paymentId,
            image: imageFile
          })
        });
        if (res.ok) {
          setSuccessMsg("Listing updated successfully!");
          handleCancelEdit();
          onListingAdded();
          setTimeout(() => setSuccessMsg(""), 3000);
        } else {
          const data = await res.json();
          alert(data.error || "Failed to update listing");
        }
      } else {
        // Create mode
        let kitchenLat = null;
        let kitchenLng = null;
        try {
          const coords = await new Promise<{lat: number; lng: number}>((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
              );
            } else {
              reject(new Error("Geolocation not supported"));
            }
          });
          kitchenLat = coords.lat;
          kitchenLng = coords.lng;
        } catch (err) {
          console.warn("Could not capture kitchen geolocation", err);
        }

        const deadline = new Date(Date.now() + Number(pickupHours) * 60 * 60 * 1000).toISOString();
        const res = await fetch("/api/rescue-food/listings/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            restaurantName,
            category,
            originalPrice,
            rescuePrice,
            quantity,
            pickupDeadline: deadline,
            paymentId,
            image: imageFile,
            lat: kitchenLat,
            lng: kitchenLng
          })
        });
        if (res.ok) {
          setSuccessMsg("Listed successfully!");
          setName("");
          setOriginalPrice("");
          setRescuePrice("");
          setQuantity("");
          setPickupHours("4");
          setImageFile(null);
          setAiReport(null);
          onListingAdded();
          setTimeout(() => setSuccessMsg(""), 3000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sellerSpecificListings = [...listings]
    .filter(l => l.restaurantName === restaurantName)
    .sort((a, b) => {
      if (a.status === "available" && b.status !== "available") return -1;
      if (a.status !== "available" && b.status === "available") return 1;
      if (a.status === "available" && b.status === "available") {
        return new Date(a.pickupDeadline).getTime() - new Date(b.pickupDeadline).getTime();
      }
      return 0;
    });
  const sellerOrders = orders.filter(o => o.restaurantName === restaurantName && o.status !== "Cancelled");

  return (
    <div className="flex flex-col gap-6">
      {/* Top Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab("inventory")}
          className={`pb-2 px-4 font-bold ${activeTab === "inventory" ? "border-b-2 border-[#e23744] text-[#e23744]" : "text-slate-500 hover:text-slate-700"}`}
        >
          Inventory Management
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={`pb-2 px-4 font-bold ${activeTab === "orders" ? "border-b-2 border-[#e23744] text-[#e23744]" : "text-slate-500 hover:text-slate-700"}`}
        >
          Active Orders & OTP Verify
        </button>
      </div>

      {activeTab === "inventory" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Upload Surplus Meal Form - 7 cols */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] p-6 hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.04)] transition-all duration-400">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
            <div>
              <h2 className="text-md font-sans font-extrabold text-gray-900 flex items-center gap-2">
                <PlusCircle size={20} className="text-[#e23744]" />
                Onboard Surplus Food Item
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Instantly broadcast fresh leftovers or unsold buffet batches to Zomato Rescue</p>
            </div>

            {/* Select Restaurant Identity */}
            {sellerRestaurantName ? (
              <div 
                className="bg-blue-50 text-blue-700 border border-blue-200 rounded-xl px-3 py-1.5 text-xs font-sans font-extrabold flex items-center gap-1.5 shadow-sm"
                id="restaurant-selector-badge"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                {restaurantName}
              </div>
            ) : (
              <select
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-sans font-semibold focus:outline-none focus:border-emerald-500"
                id="restaurant-selector"
              >
                <option value="Spice of India">Spice of India (Restaurant)</option>
                <option value="Levain Bakery">Levain Bakery (Bakery)</option>
                <option value="Hotel Grand Banquet">Hotel Grand Banquet</option>
                <option value="Organic Delights">Organic Delights (Cafe)</option>
              </select>
            )}
          </div>

          {editingListing && (
            <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs py-3 px-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-150">
              <span className="flex items-center gap-1.5 font-sans font-semibold">
                <Sliders size={14} className="text-amber-600 animate-spin" />
                Active Edit Mode: Modifying <b>{editingListing.name}</b>
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-amber-900 hover:text-amber-950 font-bold underline text-[11px]"
              >
                Cancel Edit
              </button>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-3 px-4 rounded-xl flex items-center gap-2">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-750 mb-1">Select Outlet Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  id="listing-category"
                >
                  <option value="cooked">🍲 Cooked Food / Buffet</option>
                  <option value="bakery">🥐 Bread &amp; Bakery items</option>
                  <option value="grocery">🛒 Produce &amp; Groceries</option>
                  <option value="dessert">🧁 Cake &amp; Slices</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-750 mb-1">Available Quantity / Portions</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 8"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-750 mb-1">Food / Package Name</label>
              <input
                type="text"
                placeholder="e.g. Assorted Butter Naan & Garlic Chicken Gravy portions"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                required
                id="listing-name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-750 mb-1">Item Photo (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 file:cursor-pointer cursor-pointer transition-all"
                    id="listing-image"
                  />
                </div>
                {imageFile && (
                  <div className="shrink-0 h-12 w-16 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 shadow-sm">
                    <img src={imageFile} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-750 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  placeholder="₹300"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-750 mb-1">Hours to pickup</label>
                <select
                  value={pickupHours}
                  onChange={(e) => setPickupHours(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="1">1 Hour Remaining</option>
                  <option value="2">2 Hours Remaining</option>
                  <option value="4">4 Hours Remaining</option>
                  <option value="6">6 Hours Remaining</option>
                  <option value="12">12 Hours Remaining</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-750 mb-1 leading-3">Rescue Offer (₹)</label>
                <input
                  type="number"
                  placeholder="₹30"
                  value={rescuePrice}
                  onChange={(e) => setRescuePrice(e.target.value)}
                  className="w-full bg-gray-50 border border-emerald-300 bg-emerald-50 text-emerald-800 rounded-xl px-3.5 py-1.5 text-xs font-mono font-black focus:outline-none focus:border-emerald-500"
                  required
                  id="listing-rescue-price"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-750 mb-1">
                Receiver UPI Code (For Directly Sourcing Surcharges)
              </label>
              <input
                type="text"
                placeholder="e.g. spiceofindia@ybl"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className="w-full bg-white border border-rose-200 text-rose-800 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs font-bold font-mono focus:outline-none"
                required
                id="listing-payment-id"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ⚠️ Required: Senders will route direct booking micro-payments to this address. Verify carefully.
              </p>
            </div>

            {/* AI Assistant Analyzer Trigger */}
            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Dynamic Pricing AI Assistant</h4>
                  <p className="text-[10px] text-gray-400">Recommends pricing model based on remaining shelf-life</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiAnalysis}
                disabled={aiAnalyzing}
                className="bg-[#e23744] hover:bg-[#cb202d] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                id="ai-analyze-btn"
              >
                {aiAnalyzing ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    Auto Price
                  </>
                )}
              </button>
            </div>

            {/* Large Gemini feedback analysis panel */}
            {aiReport && (
              <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl space-y-3 border border-emerald-500/30 animate-in slide-in-from-top-4 duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>Gemini AI Prediction Trend Analysis</span>
                </div>
                
                <p className="text-xs text-emerald-300 leading-normal font-medium">
                  {aiReport.aiPriceRecommendationExplanation}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono border-t border-emerald-800/60">
                  <div>
                    Estimated Demand: <b className="text-white">{aiReport.aiDemandTrend} ({aiReport.demandConfidencePercentage}% confidence)</b>
                  </div>
                  <div>
                    Formula Metric: <b className="text-white">CO₂ savings {aiReport.co2ReductionKg}kg</b>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-400 font-sans leading-snug">
                  📌 {aiReport.salesPredictionFormulaInsight}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {editingListing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs font-bold py-3 rounded-xl border border-gray-200 transition-all cursor-pointer"
                  id="cancel-edit-btn"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#e23744] text-white font-sans text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer"
                id="list-surplus-submit"
              >
                {editingListing 
                  ? (isSubmitting ? "Updating Listing..." : "Save Listing Changes")
                  : (isSubmitting ? "Uploading Portions..." : "Publish Surplus Offer To Live Feed")
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Dynamic Pricing AI active branch metrics */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Current Active outlet metrics */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] p-5 hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.04)] transition-all duration-400 font-sans">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-gray-400">
              Active Surplus Deals From {restaurantName}
            </h3>
            <button
              onClick={onTriggerAutoPrice}
              className="border border-[#e23744] hover:bg-[#e23744] hover:text-white text-[#e23744] font-sans text-[10px] font-bold px-2 py-1 rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Re-calculate Live Listings (Hourly Drop)"
            >
              <Sparkles size={12} />
              Auto-Drop Price
            </button>
          </div>

          {sellerSpecificListings.length === 0 ? (
            <p className="text-xs text-gray-400 font-sans py-4">No active listings currently out for rescue in this kitchen.</p>
          ) : (
            <div className="space-y-3">
              {sellerSpecificListings.map(lst => (
                <div 
                  key={lst.id} 
                  className={`p-3.5 rounded-xl border flex flex-col gap-2.5 transition-all ${
                    editingListing?.id === lst.id 
                      ? "bg-amber-50/50 border-amber-300 shadow-sm animate-pulse" 
                      : "bg-gray-50 border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h4 className="font-sans font-bold text-xs text-gray-800 break-words leading-snug">{lst.name}</h4>
                      <p className="text-[10px] text-gray-450 font-mono mt-1">
                        Qty: <b className="text-gray-700">{lst.quantity} items</b> • Rescue: <b className="text-emerald-700">₹{lst.rescuePrice}</b> <span className="line-through text-gray-400 text-[9px]">(₹{lst.originalPrice})</span>
                      </p>
                    </div>
                    <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                      lst.status === "available" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {lst.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200/50 pt-2 gap-2 flex-wrap">
                    <span className="text-[9px] font-mono text-gray-400">
                      ⌚ Expires: {new Date(lst.pickupDeadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(lst)}
                        className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                          editingListing?.id === lst.id
                            ? "bg-amber-100 border-amber-300 text-amber-800"
                            : "bg-white border-gray-200 text-gray-655 hover:bg-slate-100 shadow-xs"
                        }`}
                        id={`edit-btn-${lst.id}`}
                      >
                        {editingListing?.id === lst.id ? "Editing" : "Edit"}
                      </button>
                      
                      {confirmDeleteId === lst.id ? (
                        <div className="flex items-center gap-1 bg-rose-50/50 p-0.5 px-1.5 rounded-lg border border-rose-100">
                          <span className="text-[10px] text-rose-700 font-semibold">Delete?</span>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[10.5px] bg-white hover:bg-slate-100 text-gray-600 font-bold px-2 py-0.5 rounded border border-gray-150 cursor-pointer"
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(lst.id)}
                            disabled={isDeletingId === lst.id}
                            className="text-[10.5px] bg-red-600 hover:bg-red-700 text-white font-extrabold px-2 py-0.5 rounded cursor-pointer"
                          >
                            {isDeletingId === lst.id ? "..." : "Yes"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(lst.id)}
                          disabled={isDeletingId === lst.id}
                          className="text-[10px] font-bold px-3 py-1 rounded-lg border border-rose-150 text-rose-600 bg-white hover:bg-rose-50 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          id={`delete-btn-${lst.id}`}
                        >
                          {isDeletingId === lst.id ? "..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-slate-800">Active Orders</h2>
          {sellerOrders.length === 0 ? (
            <p className="text-slate-500">No active orders yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellerOrders.map(order => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{order.foodName}</h3>
                      <p className="text-sm text-slate-500">Qty: {order.quantity} | Total: ₹{order.totalPaid}</p>
                    </div>
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {order.status !== "Delivered" && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <input 
                        type="text" 
                        maxLength={4}
                        placeholder="Enter 4-digit OTP" 
                        value={otpInputs[order.id] || ""}
                        onChange={(e) => setOtpInputs({ ...otpInputs, [order.id]: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#e23744] flex-1"
                      />
                      <button 
                        onClick={() => handleVerifyOtp(order.id)}
                        className="bg-[#e23744] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm shrink-0 cursor-pointer"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
