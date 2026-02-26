import React, { useState } from 'react';
import { ArrowRight, MessageSquare, Zap } from 'lucide-react';

export default function ChatBar({ onSend, loading }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("CHAT"); // CHAT or REPLAN

  const handleSubmit = () => {
    if (input.trim() && !loading) {
      onSend(input, mode); // Pass mode to the handler
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-12 left-0 right-0 px-12 z-40">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-2xl rounded-[40px] p-3 shadow-2xl border border-white flex flex-col gap-3">
        
        {/* THE MODE TOGGLE */}
        <div className="flex gap-2 px-3 pt-2">
          <button 
            onClick={() => setMode("CHAT")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
              mode === "CHAT" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}
          >
            <MessageSquare size={12} /> Concierge
          </button>
          <button 
            onClick={() => setMode("REPLAN")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
              mode === "REPLAN" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}
          >
            <Zap size={12} fill={mode === "REPLAN" ? "currentColor" : "none"} /> Re-Orchestrate
          </button>
        </div>

        <div className="flex items-center px-4 py-1 gap-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={mode === "CHAT" ? "Ask a question..." : "Report a disruption (e.g. It is raining)"}
            className="flex-1 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-300"
          />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`p-4 rounded-full transition-all shadow-lg ${
                mode === "REPLAN" ? "bg-indigo-600" : "bg-slate-900"
            } text-white`}
          >
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}