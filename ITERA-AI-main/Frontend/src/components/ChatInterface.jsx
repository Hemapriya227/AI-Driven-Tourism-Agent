import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface({ onSend, loading }) {
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg.trim() || loading) return;
    onSend(msg);
    setMsg("");
  };

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-6">
      <form 
        onSubmit={handleSubmit}
        className="glass-panel rounded-4xl p-2 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
      >
        <div className="p-3 bg-itera-indigo/5 rounded-2xl text-itera-indigo">
          <Sparkles size={20} />
        </div>
        
        <input 
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="I'm running late / It's raining / Suggest a cafe..."
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-slate-300"
        />

        <button 
          disabled={loading}
          className="bg-itera-indigo text-white p-4 rounded-2xl hover:bg-slate-900 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>
      
      <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">
        AI Monitor Agent is analyzing your journey in real-time
      </p>
    </div>
  );
}