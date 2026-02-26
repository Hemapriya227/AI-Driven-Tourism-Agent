import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, ChevronRight } from 'lucide-react';
import { supabase } from '../db/supabase_client'; // Ensure this path is correct

export default function HistoryDrawer({ isOpen, onClose, onSelect }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const fetchHistory = async () => {
    const { data } = await supabase.from('itineraries').select('*').order('created_at', { ascending: false });
    setHistory(data || []);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-70 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">History</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              {history.length === 0 ? (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No past journeys found.</p>
              ) : (
                history.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { onSelect(item.json_data); onClose(); }}
                    className="group p-6 rounded-3xl border border-slate-100 hover:border-itera-indigo hover:bg-itera-indigo/5 transition-all cursor-pointer"
                  >
                    <p className="text-[10px] font-black text-itera-indigo uppercase mb-1">{new Date(item.created_at).toLocaleDateString()}</p>
                    <h4 className="text-xl font-black uppercase tracking-tight group-hover:text-itera-indigo transition-colors">{item.destination}</h4>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.json_data.length} Nodes</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-itera-indigo" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}