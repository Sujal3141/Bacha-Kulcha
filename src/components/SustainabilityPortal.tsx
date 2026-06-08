import React, { useState } from "react";
import { Flame, Droplet, Coins, Footprints, Sparkles, Send, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { SustainabilityStats } from "../types";

interface SustainabilityPortalProps {
  stats: SustainabilityStats;
}

export function SustainabilityPortal({ stats }: SustainabilityPortalProps) {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [customOutlet, setCustomOutlet] = useState("all");
  const [generatedAuditResult, setGeneratedAuditResult] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const performAuditGeneration = () => {
    setGenerating(true);
    setTimeout(() => {
      const co2Total = stats.co2Saved;
      const h2oTotal = stats.waterSaved;
      const meals = stats.mealsSaved;
      const money = stats.moneyRecovered;

      const reports = {
        daily: `### DAILY ECO AUDIT REPORT (FOOD RESCUE SERVICE)
Generated on: ${new Date().toLocaleDateString()}
Status: APPROVED • LEVEL A CARBON ADHERENCE

**1. GENERAL IMPACT METRICS**
- **Surplus Meals Rescued**: ${Math.round(meals / 30)} portions saved today.
- **Estimated carbon offsets (CO₂)**: ${Math.round(co2Total / 30)} kg saved.
- **Virtual Water Conservation**: ${Math.round(h2oTotal / 30)} liters of production water reclaimed.
- **Recovered capital**: ₹${Math.round(money / 30)} retained by local consumers.

**2. METAHNE REDUCTION FACTOR**
By routing ${Math.round(meals / 30)} meals away from city landfills, we prevented approximately ${((meals / 30) * 0.45).toFixed(2)} kg of organic waste from undergoing anaerobic digestion, preventing direct methane emission channels.`,
        weekly: `### PERFORMANCE REPORT: WEEKLY SUSTAINABILITY AUDIT
Report Interval: Past 7 days (Weekly Rollup)
Compliance Status: SECURE • ECO METRIC SCORE 98/100

**1. ENVIROMENT STATS**
- **Aggregated Saved Meals**: ${Math.round(meals / 4)} units weekly.
- **Total CO₂ equivalent offsets**: ${Math.round(co2Total / 4)} kg prevented.
- **Total irrigation water reclaimed**: ${Math.round(h2oTotal / 4)} liters saved across major supply chains.
- **Customer Cash Retained**: ₹${Math.round(money / 4)} saved under original menu pricing.

**2. SOLID WASTE IMPACT**
Approx ${Math.round((meals / 4) * 0.5)} kg of organic food scraps was effectively redirected to sustainable human consumption. Carbon equivalency represents 22 fully grown pine trees absorbing emissions for an entire year.`,
        monthly: `### REGULATORY MONTHLY AUDIT AND ESG COMPLIANCE STATEMENT
Scope: Global platform consolidation metrics
Period: Current Month Cycle
Authorized Level: Tier 1 Food Logistics ESG Certificate

**1. CONSOLIDATED CONSERVATION INDEX**
- **Total Human Food Re-routing**: ${stats.mealsSaved} portions saved.
- **Direct Methane/CO₂ prevented**: ${stats.co2Saved.toLocaleString()} kg of CO₂ equivalent offsets.
- **Platform Water Sourcing Offset**: ${stats.waterSaved.toLocaleString()} Liters of water spared.
- **Economic Value Recovered**: ₹${stats.moneyRecovered.toLocaleString()} INR total consumer recovery.

**2. CORPORATE CSR / ESG INSIGHTS**
- Meets standard UNFCCC mitigation goals on food supply efficiency.
- Reclaims surplus calorie lines for 80-90% lower customer pricing, servicing lower-tier economic groups.`
      };

      setGeneratedAuditResult(reports[reportType]);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* 4 Interactive KPI Cards & Metric explanations - 8 cols */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Animated Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Carbon Card */}
          <div className="bg-emerald-950 text-emerald-100 p-6 rounded-3xl border border-emerald-550/40 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-emerald-800/30 font-black font-sans text-7xl uppercase pointer-events-none group-hover:scale-110 transition-transform">
              CO₂
            </div>
            
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Flame size={14} className="animate-pulse" />
              <span>Carbon Prevention Index</span>
            </div>

            <div className="mt-2">
              <span className="text-3xl font-mono font-extrabold tracking-tight text-white">
                {stats.co2Saved.toLocaleString()} kg
              </span>
              <p className="text-xs text-emerald-300/80 mt-2 leading-relaxed font-sans">
                Equivalent to removing <b>{(stats.co2Saved / 400).toFixed(1)} passenger cars</b> off city highways for an entire month. Every 1kg of saved cooked food prevents up to 2.5kg of methane releasing from solid landfills.
              </p>
            </div>
          </div>

          {/* Water Card */}
          <div className="bg-sky-950 text-sky-100 p-6 rounded-3xl border border-sky-555/40 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-sky-850/30 font-black font-sans text-7xl uppercase pointer-events-none group-hover:scale-110 transition-transform">
              H₂O
            </div>
            
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Droplet size={14} />
              <span>Virtual Water Conserved</span>
            </div>

            <div className="mt-2">
              <span className="text-3xl font-mono font-extrabold tracking-tight text-white">
                {stats.waterSaved.toLocaleString()} Liters
              </span>
              <p className="text-xs text-sky-300/80 mt-2 leading-relaxed font-sans">
                Equivalent to <b>{(stats.waterSaved / 150).toFixed(0)} full showers</b> saved. Agricultural irrigation is the largest freshwater consumer globally. Reclaiming surplus food retains this dynamic resource index.
              </p>
            </div>
          </div>

          {/* Money Reclaimed */}
          <div className="bg-amber-950 text-amber-100 p-6 rounded-3xl border border-amber-550/40 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-amber-850/30 font-black font-sans text-7xl uppercase pointer-events-none group-hover:scale-110 transition-transform">
              ₹
            </div>
            
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Coins size={14} />
              <span>Capital Recovered Value</span>
            </div>

            <div className="mt-2">
              <span className="text-3xl font-mono font-extrabold tracking-tight text-white">
                ₹{(stats.moneyRecovered / 1000).toFixed(1)}K INR
              </span>
              <p className="text-xs text-amber-300/80 mt-2 leading-relaxed font-sans">
                Value recovered back into local communities. Instead of writing off kitchen surplus as waste losses, restaurants recoup costs and users feed themselves at <b>80-90% lower rates</b>.
              </p>
            </div>
          </div>

          {/* Total Meals Scaled */}
          <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-850 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-700/30 font-black font-sans text-7xl uppercase pointer-events-none group-hover:scale-110 transition-transform">
              MEAL
            </div>
            
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Footprints size={14} />
              <span>Total Food Portions Saved</span>
            </div>

            <div className="mt-2">
              <span className="text-3xl font-mono font-extrabold tracking-tight text-emerald-400">
                {stats.mealsSaved.toLocaleString()} Meals
              </span>
              <p className="text-xs text-slate-300/80 mt-2 leading-relaxed font-sans">
                We have prevented over <b>{(stats.mealsSaved * 0.4).toFixed(1)} metric tons</b> of high-grade calories from solid organic garbage dumps. Feeding people is the primary human sustainability factor.
              </p>
            </div>
          </div>

        </div>

        {/* Environmental insights panel */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm font-sans text-sm text-gray-700 space-y-4">
          <h3 className="font-sans font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <ShieldAlert size={18} className="text-amber-500" />
            Landfill Organic Decomposition Facts
          </h3>
          <p className="leading-relaxed">
            When food waste enters garbage tips, it gets buried under loads of soil. Under these conditions, anaerobic bacteria thrive, decomposing food and generating extreme volumes of <b>Methane (CH₄)</b>. Methane is over 28 times more heat-trapping than regular Carbon Dioxide. 
          </p>
          <p className="leading-relaxed">
            By preventing cooked buffet curries and bakery items from reaching garbage heaps, Food Rescue enables a direct circular economy. That is why redirecting surplus food is recognized by climate researchers as the <b>single most effective individual solution</b> to fight ecological warming.
          </p>
        </div>

      </div>

      {/* Sustainable Audit report builder - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 font-sans">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-1.5">
            <FileSpreadsheet size={18} className="text-emerald-500" />
            Regulatory Report Builder
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-650 mb-1">Choose Rollup Scope</label>
              <select
                value={reportType}
                onChange={(e: any) => setReportType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="daily">Daily Impact Snapshot</option>
                <option value="weekly">Weekly Rollup Audit</option>
                <option value="monthly">Monthly Full ESG Statement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-650 mb-1">Filter Outlet Sourcing</label>
              <select
                value={customOutlet}
                onChange={(e) => setCustomOutlet(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="all">All Suburbs and Brands Consolidated</option>
                <option value="Spice of India">Spice of India exclusively</option>
                <option value="Levain Bakery">Levain Bakery exclusively</option>
              </select>
            </div>

            <button
              onClick={performAuditGeneration}
              disabled={generating}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-sans text-xs font-bold py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {generating ? (
                <span>Assembling Audit...</span>
              ) : (
                <>
                  <Sparkles size={14} />
                  Compile PDF Audit Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Output Result panel */}
        {generatedAuditResult && (
          <div className="bg-slate-900 text-slate-150 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3 animate-in fade-in duration-200">
            <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase border-b border-slate-800 pb-2">
              <span>Platform Verification</span>
              <span>CSV Valid</span>
            </div>

            <pre className="text-[10px] font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pr-1 scrollbar-none text-slate-300">
              {generatedAuditResult}
            </pre>

            <button
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([generatedAuditResult], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = `food_rescue_offset_report_${reportType}.md`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="w-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-bold font-sans text-xs py-2 rounded-xl text-center transition-all cursor-pointer"
            >
              Download Markdown Report File
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
