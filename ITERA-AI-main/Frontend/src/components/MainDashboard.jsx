import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItineraryCard from './ItineraryCard';
import AgentSensors from './AgentSensors';
import ChatBar from './ChatBar';
import { X, ArrowRight, Loader2 } from 'lucide-react';

export default function MainDashboard({ profile, onReset }) {
  const [itinerary, setItinerary] = useState([]);
  const [reachedIndex, setReachedIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weather, setWeather] = useState({ desc: "Syncing...", temp: "24°C" });
  const [messages, setMessages] = useState([{ role: 'agent', content: `Welcome to ${profile.destination}. I am monitoring live sensors.` }]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.post('http://127.0.0.1:8000/plan', profile);
        setItinerary(res.data.itinerary || []);
        setWeather({ desc: res.data.weather, temp: "28°C" });
      } catch (e) { console.error("Agent failed to respond."); }
      finally { setLoading(false); }
    };
    fetchPlan();
  }, [profile]);

  const handleChat = async (msg, mode) => {
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
        const res = await axios.post('http://127.0.0.1:8000/chat', { 
            message: msg, 
            current_itinerary: itinerary, 
            last_reached_index: reachedIndex,
            mode: mode // <--- SENDS THE MANUAL MODE
        });

        if (res.data.type === "replan") {
            setItinerary(res.data.new_itinerary);
            setMessages(prev => [...prev, { role: 'agent', content: "Itinerary re-orchestrated. I have adjusted the remaining nodes." }]);
        } else {
            setMessages(prev => [...prev, { role: 'agent', content: res.data.answer }]);
        }
    } catch (e) {
        console.error("Agent failed to respond.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 bg-bg-beige">
      <div className="lg:col-span-8">
        <h1 className="text-8xl font-black uppercase tracking-tighter mb-8 leading-none">{profile.destination}</h1>
        <AgentSensors weather={weather} />
        
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="font-black text-xs uppercase tracking-widest text-slate-400">Agents Thinking...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {itinerary.map((item, idx) => (
              <ItineraryCard 
                key={idx} item={item} 
                isReached={idx <= reachedIndex} 
                onReached={() => setReachedIndex(idx)} 
                onMapOpen={setSelectedLocation} 
              />
            ))}
          </div>
        )}
      </div>

      {/* PERSISTENT CHAT SIDEBAR */}
      <div className="lg:col-span-4 sticky top-12 h-150 bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden border-4 border-white">
        <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Live Agent Concierge</span>
          <button onClick={onReset} className="text-[8px] font-bold text-slate-300 uppercase hover:text-red-500">Reset</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-3xl text-xs font-bold leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ChatBar onSend={handleChat} loading={loading} />


      {/* INTEGRATED MAP DRAWER */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedLocation(null)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-8 border-b flex justify-between items-center bg-white">
              <h3 className="text-3xl font-black tracking-tighter uppercase">{selectedLocation.title}</h3>
              <button onClick={() => setSelectedLocation(null)}><X size={32} /></button>
            </div>
            <iframe width="100%" height="100%" src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDs0gVoe558C8ECTEzkl7yPDeY87yhsTDw&q=${encodeURIComponent(selectedLocation.loc)}`}></iframe>
          </div>
        </div>
      )}
    </div>
  );
}