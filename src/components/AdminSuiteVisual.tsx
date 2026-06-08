import React from "react";
import { motion } from "motion/react";
import { Shield, CheckCircle2, Lock, Eye } from "lucide-react";

export default function AdminSuiteVisual() {
  return (
    <div className="relative w-full h-32 flex items-center justify-center overflow-visible mb-6">
      {/* Immersive security grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.06] rounded-xl" />
      
      {/* Outer Verification Orbit Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Ring A: Clockwise */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          className="absolute w-28 h-28 rounded-full border border-dashed border-slate-350/45"
        />

        {/* Ring B: Counter-Clockwise */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
          className="absolute w-24 h-24 rounded-full border border-slate-300/30 border-t-slate-800"
        />

        {/* Dynamic scan line sweep */}
        <motion.div
          animate={{
            y: [-35, 35, -35],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="absolute w-20 h-[1.5px] bg-slate-550/40 blur-[1px]"
        />
      </div>

      {/* Central Defensive Vault Node */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          shadow: ["0 4px 6px -1px rgb(0 0 0/0.1)", "0 10px 15px -3px rgb(0 0 0/0.1)", "0 4px 6px -1px rgb(0 0 0/0.1)"]
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        className="relative z-10 w-16 h-16 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-white border border-slate-700/50 shadow-lg"
      >
        {/* Secure padlock lock indicators */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-1.5 -right-1.5 bg-amber-500 p-1 rounded-full border border-white text-slate-950"
        >
          <Lock size={10} fill="currentColor" />
        </motion.div>

        <Shield size={26} className="text-slate-200 drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]" />
      </motion.div>

      {/* Blinking Live Audit Indicator Grid (Top Right) */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 text-[8px] font-mono text-slate-400 font-extrabold select-none bg-white/60 px-2 py-1 rounded border border-slate-150">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>FSSAI VERIFIED</span>
        </div>
        <div className="flex items-center gap-1 opacity-75">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>GSTIN OK</span>
        </div>
      </div>

      {/* ESG Offset Check (Left Side info stamp) */}
      <div className="absolute left-2 bottom-2 z-10 flex items-center gap-1 text-[8.5px] font-mono text-emerald-600 font-bold bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-100/60">
        <CheckCircle2 size={10} />
        <span>AUDIT SECURE</span>
      </div>
    </div>
  );
}
