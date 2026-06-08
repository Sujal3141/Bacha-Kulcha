import React from "react";
import { motion } from "motion/react";
import { ShoppingBag, Flame, TrendingDown, Target } from "lucide-react";

export default function CustomerRescueVisual() {
  const floatTags = [
    { text: "90% OFF", bg: "bg-rose-500", textCol: "text-white", x: -44, y: -34, delay: 0 },
    { text: "₹35", bg: "bg-amber-500", textCol: "text-white", x: 48, y: -42, delay: 0.6 },
    { text: "FRESH RESCUE", bg: "bg-emerald-500", textCol: "text-white", x: -62, y: 38, delay: 1.2 },
    { text: "SAVED!", bg: "bg-sky-500", textCol: "text-white", x: 50, y: 34, delay: 1.8 },
  ];

  return (
    <div className="relative w-full h-32 flex items-center justify-center overflow-visible mb-6">
      {/* Dynamic Laser Radar Scan (Target / Rescue motif) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="absolute w-24 h-24 rounded-full border border-rose-500/30"
        />
        <motion.div
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.08, 0.25, 0.08],
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute w-32 h-32 rounded-full border border-dashed border-rose-400/20"
        />
        {/* Soft warmth radial glow */}
        <div className="absolute w-36 h-36 bg-gradient-to-r from-[#e23744]/10 to-transparent blur-2xl rounded-full" />
      </div>

      {/* Main Animated Shopping Bag Node */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, -3, 3, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeInOut",
        }}
        className="relative z-10 w-16 h-16 bg-gradient-to-tr from-[#e23744] to-rose-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-[#e23744]/30"
      >
        {/* Interactive hot-streak emblem */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-1.5 -right-1.5 bg-amber-400 p-1 rounded-full shadow-md text-amber-950 border border-white"
        >
          <Flame size={12} fill="currentColor" />
        </motion.div>

        <ShoppingBag size={28} className="drop-shadow-sm text-white" />
      </motion.div>

      {/* Floating Discount Badges / High-end rescue markers */}
      {floatTags.map((tag, idx) => (
        <motion.div
          key={idx}
          initial={{ x: tag.x, y: tag.y, opacity: 0, scale: 0.8 }}
          animate={{
            x: tag.x,
            y: [tag.y, tag.y - 8, tag.y],
            opacity: 1,
            scale: 1,
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 3 + idx * 0.5,
              ease: "easeInOut",
              delay: tag.delay,
            },
            opacity: { duration: 0.6, delay: 0.2 },
            scale: { duration: 0.6, delay: 0.2 },
          }}
          className={`absolute text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-full ${tag.bg} ${tag.textCol} shadow-sm uppercase tracking-wider select-none border border-white/20`}
        >
          <div className="flex items-center gap-1">
            {idx === 0 && <TrendingDown size={9} />}
            {idx === 2 && <Target size={9} />}
            <span>{tag.text}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
