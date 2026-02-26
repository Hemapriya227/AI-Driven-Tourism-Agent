import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin, Clock, Zap, DollarSign } from 'lucide-react';

export default function TimelineRail({ items = [], onCardClick, onReached, lastReachedIndex }) {
  
  if (!items || items.length === 0) return null;

  return (
    <div className="absolute left-10 top-32 bottom-28 w-[400px] z-20 pointer-events-none">
      <div className="h-full overflow-y-auto no-scrollbar pointer-events-auto px-4 pb-20">
        <div className="flex flex-col gap-8">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              const isReached = idx <= lastReachedIndex;
              const isOutdoor = item.type?.toLowerCase().includes('outdoor');

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: isReached ? 0.95 : 1,
                    filter: isReached ? 'grayscale(100%)' : 'grayscale(0%)'
                  }}
                  onClick={() => onCardClick(item)}
                  className={`relative glass-panel p-8 rounded-[48px] transition-all duration-500 cursor-pointer border-2 ${
                    isReached 
                      ? 'bg-white/40 border-transparent opacity-60' 
                      : isOutdoor 
                        ? 'border-transparent hover:border-emerald-400 bg-white/90 shadow-xl'
                        : 'border-transparent hover:border-itera-indigo bg-white/90 shadow-xl'
                  }`}
                >
                  {/* TOP ROW: TIME & PRICE */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
                      <Clock size={12} className="text-itera-indigo" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {item.time || "09:00 AM"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-1.5 rounded-2xl shadow-lg">
                      <DollarSign size={10} className="text-itera-amber" />
                      <span className="text-[10px] font-black">{item.price || "$0"}</span>
                    </div>
                  </div>

                  {/* HEADER */}
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.85] mb-4 text-slate-900">
                    {item.title}
                  </h3>

                  {/* SUBTITLE: LOCATION */}
                  <div className="flex items-center gap-2 text-slate-400 mb-6">
                    <MapPin size={14} className="text-itera-indigo" />
                    <span className="text-[10px] font-bold uppercase truncate">{item.loc}</span>
                  </div>

                  {/* AGENT LOGIC BOX */}
                  {!isReached && item.logic && (
                    <div className="mb-6 p-4 bg-itera-indigo/5 rounded-2xl border border-itera-indigo/10">
                      <p className="text-[8px] font-black uppercase tracking-tighter text-itera-indigo mb-1 flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> // SQUAD_REASONING
                      </p>
                      <p className="text-[10px] font-bold text-slate-600 italic">
                        "{item.logic}"
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onReached(idx);
                    }}
                    className={`w-full py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                      isReached 
                        ? 'bg-slate-200 text-slate-400 cursor-default' 
                        : 'bg-itera-indigo text-white hover:bg-slate-900'
                    }`}
                  >
                    {isReached ? "Activity Locked" : "Mark as Reached"}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}