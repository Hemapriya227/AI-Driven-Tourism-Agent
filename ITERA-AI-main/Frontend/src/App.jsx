import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, History as HistoryIcon, Loader2, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Component Imports
import MapCanvas from './components/MapCanvas';
import TimelineRail from './components/TimelineRail';
import SensorBar from './components/SensorBar';
import ChatInterface from './components/ChatInterface';
import OnboardingModal from './components/OnboardingModal';
import HistoryDrawer from './components/HistoryDrawer';
import ConciergeDrawer from './components/ConciergeDrawer'; // NEW COMPONENT

export default function App() {
  // --- UI STATE ---
  const [view, setView] = useState('onboarding'); 
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false); // NEW STATE
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Sourcing Agents...");

  // --- DATA STATE ---
  const [itinerary, setItinerary] = useState([]);
  const [insights, setInsights] = useState([]); 
  const [destCenter, setDestCenter] = useState(null); 
  const [profile, setProfile] = useState(null);
  const [lastReachedIndex, setLastReachedIndex] = useState(-1);
  const [efficiency, setEfficiency] = useState("35%");

  // --- ACTION: GENERATE PLAN (POST /plan) ---
  const handleOnboarding = async (formData) => {
    setLoading(true);
    setProfile(formData);
    setStatusMsg(`Calculating Transit from India to ${formData.destination}...`);
    
    try {
      const res = await axios.post('http://localhost:8000/plan', formData);
      
      if (res.data.status === "success") {
        setItinerary(res.data.itinerary || []);
        setInsights(res.data.insights || []);
        setDestCenter(res.data.center);
        setEfficiency(res.data.efficiency_metric || "38%");
        setView('dashboard');
      }
    } catch (err) {
      console.error("Plan Generation Failed:", err);
      alert("Squad Error: The Backend failed to negotiate the plan. Check terminal.");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION: SELF-HEALING CHAT (POST /chat) ---
  const handleChat = async (message) => {
    setLoading(true);
    setStatusMsg("Squad Re-Sequencing Journey...");
    try {
      const res = await axios.post('http://localhost:8000/chat', {
        message,
        current_itinerary: itinerary,
        last_reached_index: lastReachedIndex
      });

      if (res.data.type === 'replan') {
        setItinerary(res.data.new_itinerary);
      } else {
        // Fallback if the bot just wants to talk instead of replan
        alert(`ITERA Assistant: ${res.data.answer}`);
      }
    } catch (err) {
      console.error("Chat Coordination Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION: STATE MACHINE POINTER ---
  const toggleReached = (idx) => {
    setLastReachedIndex(idx);
    const updated = itinerary.map((item, i) => ({
      ...item,
      reached: i <= idx
    }));
    setItinerary(updated);
  };

  // --- ACTION: RESET (NEW JOURNEY) ---
  const handleNewJourney = () => {
    setItinerary([]);
    setInsights([]);
    setDestCenter(null);
    setProfile(null);
    setLastReachedIndex(-1);
    setIsConciergeOpen(false);
    setView('onboarding');
  };

  // --- ACTION: LOAD FROM HISTORY ---
  const handleSelectHistory = (pastJourney) => {
    setItinerary(pastJourney.json_data || []);
    setInsights(pastJourney.insights || []);
    if (pastJourney.center_lat && pastJourney.center_lon) {
      setDestCenter({ lat: pastJourney.center_lat, lon: pastJourney.center_lon });
    }
    setView('dashboard');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#F2F1ED] text-slate-900 font-sans">
      
      {/* LAYER 0: THE GEOSPATIAL BACKGROUND */}
      <MapCanvas 
        itinerary={itinerary} 
        lastReachedIndex={lastReachedIndex}
        destinationCenter={destCenter}
      />

      {/* LAYER 1: MULTI-FUNCTION SIDEBAR */}
      <aside className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        <button 
          onClick={handleNewJourney}
          className="p-4 glass-panel rounded-2xl hover:text-itera-indigo hover:scale-110 transition-all shadow-xl group bg-white/80"
          title="New Journey"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
        
        <button 
          onClick={() => setIsConciergeOpen(true)}
          className={`p-4 glass-panel rounded-2xl hover:scale-110 transition-all shadow-xl bg-white/80 ${isConciergeOpen ? 'text-itera-indigo ring-2 ring-itera-indigo' : ''}`}
          title="Ask Concierge"
        >
          <MessageCircle size={24} />
        </button>

        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="p-4 glass-panel rounded-2xl hover:text-itera-indigo hover:scale-110 transition-all shadow-xl bg-white/80"
          title="Past Journeys"
        >
          <HistoryIcon size={24} />
        </button>
      </aside>

      {/* LAYER 2: DASHBOARD HUD (Visible after plan) */}
      <AnimatePresence>
        {view === 'dashboard' && (
          <>
            <SensorBar 
              profile={profile} 
              efficiency={efficiency} 
              insights={insights}
              itinerary={itinerary}
            />
            
            <TimelineRail 
              items={itinerary} 
              onReached={toggleReached}
              lastReachedIndex={lastReachedIndex}
              onCardClick={(poi) => console.log("Focusing POI:", poi)}
            />

            <ChatInterface 
              onSend={handleChat} 
              loading={loading} 
            />
          </>
        )}
      </AnimatePresence>

      {/* LAYER 3: DRAWERS & MODALS */}
      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onSelect={handleSelectHistory} 
      />

      <ConciergeDrawer 
        isOpen={isConciergeOpen} 
        onClose={() => setIsConciergeOpen(false)} 
        itinerary={itinerary}
      />

      {view === 'onboarding' && (
        <OnboardingModal 
          onComplete={handleOnboarding} 
          loading={loading} 
        />
      )}

      {/* GLOBAL LOADING OVERLAY */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-lg flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-itera-indigo/10 rounded-full" />
                <Loader2 className="absolute top-0 animate-spin text-itera-indigo" size={64} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-itera-indigo animate-pulse">
                  {statusMsg}
                </p>
                <p className="text-[7px] font-bold text-slate-400 uppercase mt-2">
                  Analyzing India-to-Target Logistics via TOON v1.2
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}