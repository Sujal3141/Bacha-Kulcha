import React from "react";
import { motion } from "motion/react";
import { Store, CloudLightning, ArrowUp, RefreshCw } from "lucide-react";

export default function PartnerKitchenVisual() {
  return (
    <div className="relative w-full h-32 flex flex-col justify-between overflow-hidden mb-6 bg-slate-50/50 rounded-2xl border border-slate-100 p-3.5 shadow-inner">
      {/* Upper Panel: Status & live count indicator */}
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span className="text-[9px] font-mono font-bold tracking-widest text-sky-600 uppercase">Live Index Synchronizer</span>
        </div>
        <div className="flex items-center gap-1 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 text-[8px] font-mono text-sky-600 font-extrabold uppercase">
          <RefreshCw size={8} className="animate-spin-slow" />
          <span>Real-time</span>
        </div>
      </div>

      {/* Middle Panel: Visualized Inventory bars (Shelves or Rack) with mini surpluses */}
      <div className="flex flex-col gap-2 my-2 relative z-10 w-full">
        {/* Rack Item A */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-medium text-slate-500">
            <span>Amritsari Kulchas</span>
            <span className="font-bold text-sky-600 font-mono">14 Portions Active</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"
            />
          </div>
        </div>

        {/* Rack Item B */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-medium text-slate-500">
            <span>Artisan Cake Surplus</span>
            <span className="font-bold text-emerald-600 font-mono">5 Portions Left</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "35%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Upload Animation: Sparkles, arrows floating upwards */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Syncing Arrow float */}
        <motion.div
          animate={{
            y: [24, -40],
            opacity: [0, 1, 0],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="absolute text-sky-500/80"
        >
          <ArrowUp size={20} />
        </motion.div>

        {/* Dynamic upload halo */}
        <motion.div
          animate={{
            scale: [0.9, 1.2, 0.9],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-sky-400/25 rounded-full blur-md"
        />
      </div>

      {/* Small float overlays */}
      <div className="absolute right-3 top-10 pointer-events-none text-sky-300">
        <CloudLightning size={14} className="opacity-40 animate-pulse" />
      </div>
    </div>
  );
}
