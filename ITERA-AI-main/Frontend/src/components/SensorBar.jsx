import React, { useMemo } from 'react';
import { ShieldCheck, BarChart3, Cloud, Info, DollarSign, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SensorBar({ insights = [], itinerary = [], profile }) {
  
  // --- 1. FINANCIAL CALCULATIONS ---
  const { totalSpent, transitCost } = useMemo(() => {
    // Calculate total spend on activities from the itinerary
    const spent = itinerary.reduce((sum, item) => {
      const p = parseInt(item.price?.replace(/[^0-9]/g, '')) || 0;
      return sum + p;
    }, 0);

    // Extract the AI-estimated transit cost from India
    const transitNode = insights.find(i => i.category === "Transit_Cost");
    const tCost = parseInt(transitNode?.value?.replace(/[^0-9]/g, '')) || 0;

    return { totalSpent: spent, transitCost: tCost };
  }, [itinerary, insights]);

  const budgetMax = profile?.budgetMax || 2500;
  const remainingBudget = budgetMax - transitCost;

  // --- 2. SENSOR DATA DEFINITION ---
  const sensors = [
    { icon: <Cloud size={16} />, label: "Environment", val: "Sunny / 22°C" },
    { 
      icon: <Plane size={16} />, 
      label: "Transit (India)", 
      val: `$${transitCost}`,
      color: "text-itera-indigo"
    },
    { 
      icon: <DollarSign size={16} />, 
      label: "Journey Budget", 
      val: `$${totalSpent} / $${remainingBudget}`,
      highlight: totalSpent > remainingBudget ? "text-red-500" : "text-itera-indigo"
    },
    { icon: <BarChart3 size={16} />, label: "Optimization", val: "35% Verified" }
  ];

  return (
    <div className="absolute top-8 right-10 z-30 flex flex-col items-end gap-4 pointer-events-none">
      
      {/* SECTION A: AGENT INTELLIGENCE STACK (The Judge's Quotes) */}
      <div className="flex flex-col gap-3 w-80">
        <AnimatePresence mode="popLayout">
          {insights.filter(i => i.category !== "Transit_Cost").map((insight, idx) => (
            <motion.div 
              key={insight.category || idx}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
              className="glass-panel p-5 rounded-[32px] pointer-events-auto border-l-4 border-itera-indigo shadow-2xl bg-white/90"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 text-itera-indigo bg-itera-indigo/10 p-2 rounded-xl h-fit">
                  <Info size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-itera-indigo mb-1">
                    {insight.category?.replace(/_/g, ' ') || "Squad Insight"}
                  </p>
                  
                  <p className="text-[11px] font-bold text-slate-700 leading-snug">
                    {insight.content}
                  </p>

                  {insight.value && (
                    <div className="mt-3 bg-itera-indigo/5 px-3 py-1 rounded-full text-[9px] font-black text-itera-indigo uppercase w-fit border border-itera-indigo/10">
                      Metric: {insight.value}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SECTION B: SYSTEM STATUS BAR (The Horizontal HUD) */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex gap-1 glass-panel p-1.5 rounded-full pointer-events-auto bg-white/70 shadow-lg border border-white/50"
      >
        {sensors.map((s, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-2 border-r last:border-0 border-slate-200/50">
            <span className={s.color || "text-itera-indigo"}>{s.icon}</span>
            <div className="flex flex-col">
              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{s.label}</p>
              <p className={`text-[10px] font-bold leading-none ${s.highlight || "text-slate-900"}`}>{s.val}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* SQUAD STATUS INDICATOR */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Squad Monitoring Active</p>
      </div>

    </div>
  );
}