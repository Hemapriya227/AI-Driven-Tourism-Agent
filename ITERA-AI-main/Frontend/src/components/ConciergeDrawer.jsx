import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function ConciergeDrawer({ isOpen, onClose, itinerary }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([{ role: 'assistant', text: "I'm your ITERA Concierge. Ask me about local cafes, culture, or tips!" }]);

  const handleAsk = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setChat([...chat, { role: 'user', text: userMsg }]);

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        message: userMsg,
        current_itinerary: itinerary,
        last_reached_index: -1 // Concierge doesn't need state index
      });
      setChat(prev => [...prev, { role: 'assistant', text: res.data.answer }]);
    } catch (e) {
      setChat(prev => [...prev, { role: 'assistant', text: "I'm having trouble reaching the squad." }]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: -400 }} animate={{ x: 0 }} exit={{ x: -400 }}
          className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[70] shadow-2xl flex flex-col border-r border-slate-100"
        >
          <div className="p-6 border-b flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <Sparkles className="text-itera-indigo" size={18} />
              <h2 className="font-black uppercase text-sm tracking-tighter">Concierge</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all"><X size={20}/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed ${
                  msg.role === 'user' ? 'bg-itera-indigo text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t">
            <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <input 
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder="Ask about cafes..."
                className="flex-1 bg-transparent outline-none px-2 text-xs"
              />
              <button onClick={handleAsk} className="bg-itera-indigo text-white p-2 rounded-xl">
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}