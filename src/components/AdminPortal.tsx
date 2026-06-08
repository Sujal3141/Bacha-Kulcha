import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, AlertCircle, TrendingUp, CheckCircle, Flame, DownloadCloud, Landmark, ChevronDown, ChevronUp, Search, ShieldAlert, Clock, MapPin, Check, X } from "lucide-react";
import { FoodListing } from "../types";

interface AdminPortalProps {
  listings: FoodListing[];
  notifications: any[];
  onTriggerAutoPrice: () => void;
  orders: any[];
  kitchens?: any[];
  onApproveKitchen?: (id: string) => void;
  onRejectKitchen?: (id: string, reason: string) => void;
}

export function AdminPortal({ listings, notifications, onTriggerAutoPrice, orders, kitchens = [], onApproveKitchen, onRejectKitchen }: AdminPortalProps) {
  const [kitchenTab, setKitchenTab] = useState<"pending" | "approved" | "rejected" | "all">("all");
  const [kitchenSearch, setKitchenSearch] = useState("");
  const [expandedKitchen, setExpandedKitchen] = useState<string | null>(null);
  const [kitchenInAction, setKitchenInAction] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "revoke" | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const complianceIssues = [
    { id: "fssai", label: "Invalid/Expired FSSAI License", detail: "14-digit FSSAI licensing identification credential is expired or lookup failed." },
    { id: "gstin", label: "GSTIN Tax Record Mismatch", detail: "Registered GSTIN commercial trade identifiers face database name mismatch." },
    { id: "hygiene", label: "Critical Hygiene & Safety Violations", detail: "Kitchen workspace failed sanitary checks reported under state compliance guidelines." },
    { id: "pricing", label: "Dynamic Price Curve Spams", detail: "Consistently attempting pricing models outside permitted local parameters." },
    { id: "delivery", label: "Fulfillment SLA Failure Tracker", detail: "Frequent custom reservation non-fulfillment warnings or service delays." }
  ];

  // Auto-set the tab to "pending" if there are any awaiting verification
  useEffect(() => {
    const hasPending = kitchens && kitchens.some(k => k.approved === "pending");
    if (hasPending) {
      setKitchenTab("pending");
    }
  }, [kitchens]);

  const [partnerStatus, setPartnerStatus] = useState([
    { name: "Spice of India", type: "Restaurant", count: 8, status: "Verified", riskScore: "Low" },
    { name: "Levain Bakery", type: "Bakery", count: 12, status: "Verified", riskScore: "Low" },
    { name: "Hotel Grand Banquet", type: "Super Host", count: 15, status: "Verified", riskScore: "Low" },
    { name: "Organic Delights", type: "Healthy Kitchen", count: 5, status: "Verified", riskScore: "Low" },
    { name: "Downtown Banquet Center", type: "Exhibition Hall", count: 0, status: "Awaiting Audit", riskScore: "Medium" }
  ]);

  const [fraudAlerts, setFraudAlerts] = useState([
    { id: "frd-1", restaurant: "Downtown Banquet Center", issue: "Irregular pricing model (₹600 set as ₹590 rescue)", severity: "Medium", status: "Open" },
    { id: "frd-2", restaurant: "StreetFood Hub", issue: "Expired listing remaining online after deadline", severity: "Low", status: "Resolved" }
  ]);

  const approvePartner = (partnerName: string) => {
    setPartnerStatus(prev => prev.map(p => {
      if (p.name === partnerName) {
        return { ...p, status: "Verified", riskScore: "Low" };
      }
      return p;
    }));
  };

  const resolveAlert = (id: string) => {
    setFraudAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: "Resolved" };
      }
      return a;
    }));
  };

  // Dynamic metric calculations
  const outletSet = new Set(listings.map(l => l.restaurantName));
  const activeOutletsCount = 420 + outletSet.size;

  const totalSavings = listings.reduce((sum, l) => sum + (l.savings || 0), 0);
  const avgSavingsValue = listings.length ? Math.round(totalSavings / listings.length) : 274;

  const totalRevenueGenerated = orders.reduce((sum, o) => sum + (o.totalPaid || o.price || 0), 0);
  const platformFee = 84100 + totalRevenueGenerated * 0.05;
  const platformFeeStr = platformFee >= 1000 
    ? `₹${(platformFee / 1000).toFixed(1)}K` 
    : `₹${platformFee.toFixed(0)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Visual Analytics Grid Charts section - 8 cols */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Core Administrative Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-sans tracking-wide">Live Active Outlets</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-extrabold text-slate-900">{activeOutletsCount}</span>
              <span className="text-xs font-sans text-emerald-600 font-semibold">+18% m-o-m</span>
            </div>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-sans tracking-wide">Avg Savings / Portion</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-extrabold text-slate-900">₹{avgSavingsValue}</span>
              <span className="text-xs font-sans text-emerald-600 font-semibold">82% Drop</span>
            </div>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-sans tracking-wide">Platform Revenue Fee</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-mono font-extrabold text-slate-900">{platformFeeStr}</span>
              <span className="text-xs font-sans text-slate-500 font-semibold">5% take rate</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Interactive Multi-Day growth graph */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
            <div>
              <h3 className="text-sm font-sans font-extrabold text-gray-900 flex items-center gap-1.5">
                <TrendingUp size={16} className="text-emerald-500" />
                Rescued Food Value Trend (Weekly Prev. Run)
              </h3>
              <p className="text-[11px] text-gray-400">INR value of surplus food recovered instead of landfills</p>
            </div>
            
            <button className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border text-gray-600 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer">
              <DownloadCloud size={13} />
              Export CSV
            </button>
          </div>

          {/* Elegant SVG Chart representing platform growth and value prevented */}
          <div className="w-full h-56 relative">
            <svg viewBox="0 0 500 150" className="w-full h-full text-emerald-600 font-sans text-[9px] font-mono select-none">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="490" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="60" x2="490" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="100" x2="490" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="130" x2="490" y2="130" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Weekly Trend Line graph */}
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                points="40,110 110,95 180,80 250,90 320,60 390,40 460,25"
                className="transition-all duration-300"
              />

              {/* Shaded Area fill */}
              <polygon
                fill="currentColor"
                fillOpacity="0.08"
                points="40,110 110,95 180,80 250,90 320,60 390,40 460,25 460,130 40,130"
              />

              {/* Data circles */}
              <circle cx="40" cy="110" r="4" fill="currentColor" />
              <circle cx="110" cy="95" r="4" fill="currentColor" />
              <circle cx="180" cy="80" r="4" fill="currentColor" />
              <circle cx="250" cy="90" r="4" fill="currentColor" />
              <circle cx="320" cy="60" r="4" fill="currentColor" />
              <circle cx="390" cy="40" r="4" fill="currentColor" />
              <circle cx="460" cy="25" r="4" fill="currentColor" />

              {/* Axis labels */}
              <text x="35" y="142" fill="#94a3b8">Mon</text>
              <text x="105" y="142" fill="#94a3b8">Tue</text>
              <text x="175" y="142" fill="#94a3b8">Wed</text>
              <text x="245" y="142" fill="#94a3b8">Thu</text>
              <text x="315" y="142" fill="#94a3b8">Fri</text>
              <text x="385" y="142" fill="#94a3b8">Sat</text>
              <text x="455" y="142" fill="#94a3b8">Sun</text>

              {/* Y Axis text Labels */}
              <text x="5" y="23" fill="#94a3b8">₹12k</text>
              <text x="5" y="63" fill="#94a3b8">₹8k</text>
              <text x="5" y="103" fill="#94a3b8">₹4k</text>
            </svg>
          </div>
        </div>

        {/* Dynamic Registered Kitchens & Compliance Audit Hub */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-4">
            <div>
              <h3 className="text-sm font-sans font-extrabold text-[#111] flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                Kitchen Registration &amp; Compliance Audit Hub
              </h3>
              <p className="text-[11px] text-gray-400">Inspect FSSAI / GSTIN credentials and authorize kitchen console privileges</p>
            </div>
            {/* Search Input bar */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search by name, FSSAI, email..."
                value={kitchenSearch}
                onChange={(e) => setKitchenSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-gray-200 focus:border-emerald-500 rounded-xl focus:outline-none transition-colors font-sans text-gray-700"
              />
            </div>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { id: "all", label: "All Submissions", count: kitchens.length, bg: "bg-slate-100 text-slate-700 border-slate-200" },
              { id: "pending", label: "Awaiting Audit", count: kitchens.filter(k => k.approved === "pending").length, bg: "bg-amber-50 text-amber-800 border-amber-250", dotColor: "bg-amber-500" },
              { id: "approved", label: "Approved (Active)", count: kitchens.filter(k => k.approved === "approved").length, bg: "bg-emerald-50 text-emerald-800 border-emerald-250" },
              { id: "rejected", label: "Declined", count: kitchens.filter(k => k.approved === "rejected").length, bg: "bg-rose-50 text-rose-800 border-rose-200" }
            ].map(tab => {
              const isActive = kitchenTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setKitchenTab(tab.id as any);
                    setExpandedKitchen(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-sans font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? `${tab.bg} shadow-xs ring-1 ring-emerald-500/10` 
                      : "bg-white text-gray-500 hover:text-gray-800 border-gray-200"
                  }`}
                >
                  {tab.dotColor && <span className={`h-1.5 w-1.5 rounded-full ${tab.dotColor} animate-pulse shrink-0`} />}
                  <span>{tab.label}</span>
                  <span className={`text-[10px] ${isActive ? "bg-black/5" : "bg-gray-100"} px-1.5 py-0.5 rounded-md font-mono`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List of matched kitchens */}
          <div className="space-y-3">
            {(() => {
              const filtered = kitchens.filter(k => {
                const matchesTab = kitchenTab === "all" || k.approved === kitchenTab;
                if (!matchesTab) return false;

                const q = kitchenSearch.toLowerCase().trim();
                if (!q) return true;

                return (
                  k.name.toLowerCase().includes(q) ||
                  k.gmail.toLowerCase().includes(q) ||
                  k.fssai.includes(q) ||
                  k.gstin.toLowerCase().includes(q) ||
                  (k.phone && k.phone.includes(q))
                );
              });

              if (filtered.length === 0) {
                return (
                  <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-slate-50/50">
                    <p className="text-gray-400 text-xs font-mono">No kitchen registrations found matching current filters.</p>
                  </div>
                );
              }

              return filtered.map(kitchen => {
                const isExpanded = expandedKitchen === kitchen.id;
                
                let badgeStyle = "bg-amber-50 text-amber-705 border-amber-200";
                let badgeText = "fssai verification pending";
                if (kitchen.approved === "approved") {
                  badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-250";
                  badgeText = "verified active";
                } else if (kitchen.approved === "rejected") {
                  badgeStyle = "bg-rose-50 text-rose-700 border-rose-250";
                  badgeText = "declined checklist mismatch";
                }

                return (
                  <div key={kitchen.id} className="bg-slate-50/40 border border-gray-200/80 rounded-xl hover:border-gray-300 transition-colors">
                    {/* Header bar of kitchen item */}
                    <div 
                      onClick={() => setExpandedKitchen(isExpanded ? null : kitchen.id)}
                      className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
                          <img 
                            src={kitchen.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"} 
                            alt={kitchen.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-sans font-extrabold text-[#111] flex items-center gap-2">
                            {kitchen.name}
                            <span className={`text-[9px] font-mono border rounded px-1.5 py-0.5 font-bold uppercase ${badgeStyle}`}>
                              {badgeText}
                            </span>
                          </h4>
                          <p className="text-[10px] font-mono text-gray-400 mt-1">
                            {kitchen.gmail} • Registered {kitchen.registrationDate ? new Date(kitchen.registrationDate).toLocaleDateString() : "Pending"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-[10.5px] font-mono text-slate-500 font-semibold hidden md:inline">
                          FSSAI: {kitchen.fssai.substring(0, 5)}...
                        </span>
                        <button 
                          type="button"
                          className="p-1 px-2 border border-gray-200 bg-white hover:bg-slate-50 rounded-lg text-gray-500 hover:text-gray-800 transition-colors text-[10px] font-bold flex items-center gap-0.5"
                        >
                          {isExpanded ? (
                            <>Hide Details <ChevronUp size={13} /></>
                          ) : (
                            <>View Details <ChevronDown size={13} /></>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable details panel */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-150/70 pt-4 bg-white/80 rounded-b-xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Left Column: Contact & Licensing */}
                          <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-gray-100">
                            <h5 className="font-sans font-bold text-gray-700 border-b border-gray-200 pb-1 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[9.5px]">
                              <ShieldCheck size={12} className="text-emerald-500" />
                              Contact &amp; Licensing Authentication
                            </h5>
                            <p className="text-[#333] flex justify-between"><span className="text-gray-400 font-medium">Verified Email:</span> <span className="font-mono text-slate-800 font-bold">{kitchen.gmail}</span></p>
                            <p className="text-[#333] flex justify-between"><span className="text-gray-400 font-medium">Customer Support Phone:</span> <span className="font-mono text-slate-800 font-bold">{kitchen.phone}</span></p>
                            <p className="text-[#333] flex justify-between"><span className="text-gray-400 font-medium">14-Digit FSSAI License:</span> <span className="font-mono font-extrabold text-emerald-850 bg-emerald-50/40 px-1 py-0.5 rounded border border-emerald-100">{kitchen.fssai}</span></p>
                            <p className="text-[#333] flex justify-between"><span className="text-gray-400 font-medium">GSTIN Tax Registration:</span> <span className="font-mono font-bold text-blue-800 bg-[#4285f4]/5 px-1 py-0.5 rounded border border-[#4285f4]/15">{kitchen.gstin}</span></p>
                          </div>

                          {/* Right Column: Operations & Location */}
                          <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-gray-100">
                            <h5 className="font-sans font-bold text-gray-700 border-b border-gray-200 pb-1 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[9.5px]">
                              <Clock size={12} className="text-emerald-500" />
                              Storefront Operations
                            </h5>
                            <p className="text-[#333] flex justify-between"><span className="text-gray-400 font-medium">Operational/Business Hours:</span> <span className="font-mono font-bold text-slate-800">{kitchen.businessHours}</span></p>
                            <p className="text-[#333] flex flex-col gap-1"><span className="text-gray-400 font-medium">Physical Street Location:</span> <span className="font-sans font-semibold text-slate-800 leading-normal flex items-start gap-1"><MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />{kitchen.address}</span></p>
                          </div>
                        </div>

                        {/* Rejection Log if state is rejected */}
                        {kitchen.approved === "rejected" && (
                          <div className="p-3 bg-rose-50 border border-rose-250 rounded-xl text-rose-800 text-xs flex gap-2 items-start">
                            <ShieldAlert size={16} className="text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold font-sans">Verification Failed Checklist</p>
                              <p className="font-mono text-[11px] mt-1 text-rose-700">{kitchen.rejectionReason || "Mismatching outlet name under GSTIN verification check."}</p>
                            </div>
                          </div>
                        )}

                        {/* Custom Inline Confirmation State Box */}
                        {kitchenInAction === kitchen.id && actionType && (
                          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 mt-2 mb-2 space-y-3">
                            {actionType === "approve" && (
                              <>
                                <p className="text-xs text-slate-700 font-semibold font-sans">
                                  Are you sure you want to <strong>approve</strong> and authorize the kitchen <span className="text-slate-900 font-bold">"{kitchen.name}"</span>? This will grant high-access listing privileges on the active seller command portal.
                                </p>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setKitchenInAction(null);
                                      setActionType(null);
                                    }}
                                    className="bg-white hover:bg-slate-105-70 border border-gray-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onApproveKitchen) {
                                        onApproveKitchen(kitchen.id);
                                      }
                                      setKitchenInAction(null);
                                      setActionType(null);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
                                  >
                                    <Check size={13} /> Confirm &amp; Authorize Store
                                  </button>
                                </div>
                              </>
                            )}

                            {(actionType === "reject" || actionType === "revoke") && (
                              <div className="space-y-4">
                                <p className="text-xs text-slate-700 font-bold font-sans flex items-center gap-1.5">
                                  <ShieldAlert size={14} className="text-red-500" />
                                  Specify Audit {actionType === "reject" ? "Decline" : "Revocation"} Checklist for <span className="text-slate-900 font-extrabold font-sans">"{kitchen.name}"</span>:
                                </p>
                                
                                <div className="space-y-2 bg-slate-100/60 p-3 rounded-lg border border-slate-200">
                                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-extrabold mb-1">Select Compliance Violations:</p>
                                  {complianceIssues.map((issue) => {
                                    const isChecked = selectedIssues.includes(issue.id);
                                    return (
                                      <label key={issue.id} className="flex items-start gap-2.5 p-2 rounded hover:bg-white transition-colors cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedIssues(prev => [...prev, issue.id]);
                                            } else {
                                              setSelectedIssues(prev => prev.filter(x => x !== issue.id));
                                            }
                                          }}
                                          className="mt-0.5 accent-red-605 rounded"
                                        />
                                        <div>
                                          <p className="text-xs font-bold text-slate-800 leading-tight">{issue.label}</p>
                                          <p className="text-[10px] font-mono text-slate-500 leading-normal mt-0.5">{issue.detail}</p>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>

                                <div className="space-y-1">
                                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Additional Specific Comments:</p>
                                  <input
                                    type="text"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder={actionType === "reject" ? "e.g., FSSAI certificate upload blurry" : "e.g., Routine hygiene verification compliance failure"}
                                    className="w-full bg-white border border-gray-350 rounded-lg p-2 text-xs focus:outline-none focus:border-red-500 font-sans"
                                  />
                                </div>

                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setKitchenInAction(null);
                                      setActionType(null);
                                      setCustomReason("");
                                      setSelectedIssues([]);
                                    }}
                                    className="bg-white hover:bg-slate-100 border border-gray-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      let finalReason = "";
                                      if (selectedIssues.length > 0) {
                                        const labels = selectedIssues.map(id => complianceIssues.find(i => i.id === id)?.label);
                                        finalReason = `${actionType === "reject" ? "Registration Declined" : "Access Revoked"}: [${labels.join(", ")}]`;
                                        if (customReason.trim()) {
                                          finalReason += ` - Note: ${customReason.trim()}`;
                                        }
                                      } else {
                                        finalReason = customReason.trim() || (actionType === "reject" ? "GSTIN or Licensing checklist mismatch" : "Access Revoked under regulatory grounds");
                                      }

                                      if (onRejectKitchen) {
                                        onRejectKitchen(kitchen.id, finalReason);
                                      }
                                      setKitchenInAction(null);
                                      setActionType(null);
                                      setCustomReason("");
                                      setSelectedIssues([]);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                                  >
                                    Decline &amp; Revoke Access Email
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Compliance Action Controls */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-end border-t border-gray-100">
                          {kitchenInAction !== kitchen.id && (
                            <>
                              {kitchen.approved === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setKitchenInAction(kitchen.id);
                                      setActionType("reject");
                                      setCustomReason("Mismatching FSSAI database record");
                                    }}
                                    className="bg-stone-50 hover:bg-stone-100 border border-gray-200 text-stone-600 font-bold px-4 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                                  >
                                    Decline Registration
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setKitchenInAction(kitchen.id);
                                      setActionType("approve");
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-1.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1 justify-center"
                                  >
                                    <Check size={14} /> Approve Store Access
                                  </button>
                                </>
                              )}

                              {kitchen.approved === "approved" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setKitchenInAction(kitchen.id);
                                    setActionType("revoke");
                                    setCustomReason("Regulatory non-compliance audit");
                                  }}
                                  className="bg-stone-50 hover:bg-red-50 hover:text-red-700 border border-gray-200 hover:border-red-200 text-stone-600 font-bold px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <X size={13} /> Revoke Database Access
                                </button>
                              )}

                              {kitchen.approved === "rejected" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setKitchenInAction(kitchen.id);
                                    setActionType("approve");
                                  }}
                                  className="bg-emerald-650 hover:bg-emerald-700 text-white font-extrabold px-5 py-1.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1 justify-center"
                                >
                                  <Check size={14} /> Approve Application
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Brand partners Approvals management */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-sans font-bold text-gray-800 mb-4 flex items-center gap-1">
            <Landmark size={16} className="text-slate-600" />
            Merchant Partner Security Directory
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                  <th className="py-2">Merchant Outlet</th>
                  <th className="py-2">Scale Channel</th>
                  <th className="py-2">Verification Registry</th>
                  <th className="py-2 text-right">Risk Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {partnerStatus.map(p => (
                  <tr key={p.name} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold">{p.name}</td>
                    <td className="py-3 text-gray-500">{p.type}</td>
                    <td className="py-3">
                      {p.status === "Verified" ? (
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          ✓ Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => approvePartner(p.name)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer"
                        >
                          Approve Brand
                        </button>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-mono text-[10px] font-bold ${
                        p.riskScore === "Low" ? "text-emerald-600" : "text-amber-600 animate-pulse"
                      }`}>
                        {p.riskScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fraud Alert Logs & Real-time Live Notifications ticker - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Anti-Fraud Engine alerts panel */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-sans font-extrabold text-sm text-rose-950 flex items-center gap-1.5 mb-4">
            <AlertCircle size={18} className="text-rose-600" />
            Integrity &amp; Anti-Fraud Log
          </h3>

          <div className="space-y-4">
            {fraudAlerts.map(alert => (
              <div key={alert.id} className="p-3.5 bg-white border border-rose-200/60 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-rose-700 font-extrabold uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Alert {alert.id}
                  </span>
                  
                  <span className={`text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full ${
                    alert.status === "Resolved" 
                      ? "bg-slate-100 text-slate-500" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {alert.status}
                  </span>
                </div>

                <p className="text-xs font-bold font-sans text-gray-900 leading-snug">{alert.restaurant}</p>
                <p className="text-[11px] font-sans text-gray-500 leading-normal">{alert.issue}</p>

                {alert.status === "Open" && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="mt-2 text-[10px] font-sans font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    Flag as Audited / Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Email Notification Status */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-800">
              Email Notification System
            </h3>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl space-y-1 text-xs border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 font-bold font-mono text-[10px]">
                <span>✉️</span>
                <span>ACTIVE — PERSONALIZED EMAIL DISPATCH</span>
              </div>
              <p className="text-gray-600 font-sans leading-snug mt-1">
                All platform notifications are now dispatched directly via email to the respective recipient — admins, partner kitchens, and users each receive personalized, branded notifications in their inbox.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl text-xs border border-emerald-100 space-y-2">
              <p className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Notification Channels:</p>
              <div className="space-y-1.5 text-gray-600 font-sans">
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span> Admin: Order alerts, new registrations, AI pricing updates</p>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0"></span> Kitchen Partners: Order confirmations, approval/rejection status</p>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0"></span> Users: Order confirmations, pickup reminders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
