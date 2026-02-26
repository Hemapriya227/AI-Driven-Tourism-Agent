import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component Imports - Ensure these filenames exist in src/components/
import Header from './Header';
import BentoLanding from './BentoLanding';
import Onboarding from './Onboarding';
import Timeline from './Timeline';
import ChatBar from './ChatBar';
import AgentSensors from './AgentSensors';
import { X } from 'lucide-react';

export default function App() {
  // 1. App State Management
  const [view, setView] = useState('landing'); // 'landing' | 'onboarding' | 'itinerary'
  const [profile, setProfile] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // For integrated Map Drawer

  // 2. Start Onboarding Flow
  const handleStartPlanning = () => setView('onboarding');

  // 3. Handle Onboarding Completion & API Call
  const handleOnboardingComplete = async (userData) => {
    setProfile(userData);
    setView('itinerary');
    setLoading(true);

    try {
      // Sync with your Backend PlanRequest model
      const res = await axios.post('http://127.0.0.1:8000/plan', {
        destination: userData.destination,
        startDate: userData.startDate,
        endDate: userData.endDate,
        startTime: userData.startTime,
        timePeriod: userData.timePeriod,
        budget: userData.budget,
        persona: userData.persona,
        isReligious: userData.isReligious,
        duration: 3 // Fallback for your backend logic
      });

      if (res.data.status === "success") {
        setItinerary(res.data.itinerary || []);
      }
    } catch (err) {
      console.error("Agentic Squad connection failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Chatbot Interaction (Self-Heal & Chat)
  const handleChatInput = async (message) => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/chat', {
        message: message,
        current_itinerary: itinerary,
        last_reached_index: -1, // You can add logic to track reached nodes here
        profile: profile
      });

      if (res.data.type === "replan") {
        setItinerary(res.data.new_itinerary);
      } else {
        // If it's just a chat answer, you could add it to a message state
        console.log("Agent Response:", res.data.answer);
      }
    } catch (err) {
      console.error("Chat agent failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-linear-to-br from-[#fdf4f7] to-white text-slate-900 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR */}
      <Sidebar onHome={() => setView('landing')} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* TOP HEADER */}
        <Header />

        <main className="flex-1 overflow-y-auto px-16 py-8 no-scrollbar pb-40">
          
          {/* VIEW 1: Bento Landing Page */}
          {view === 'landing' && (
            <BentoLanding onStart={handleStartPlanning} />
          )}

          {/* VIEW 2: Integrated Onboarding Form */}
          {view === 'onboarding' && (
            <div className="max-w-xl mx-auto mt-10">
              <Onboarding onComplete={handleOnboardingComplete} />
            </div>
          )}

          {/* VIEW 3: Itinerary Results & Agent Status */}
          {view === 'itinerary' && (
            <div className="max-w-4xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <AgentSensors weather={{ desc: "Analyzing Context", temp: "--" }} />
              
              <h1 className="text-8xl font-black tracking-tighter uppercase mb-16 leading-[0.8]">
                {profile?.destination}
              </h1>

              {loading ? (
                <div className="flex flex-col items-center py-20 gap-4">
                   <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                   <p className="font-black text-xs tracking-[0.3em] text-indigo-600 uppercase">Orchestrating...</p>
                </div>
              ) : (
                <Timeline 
                    items={itinerary} 
                    onCardClick={(loc) => setSelectedLocation(loc)} 
                />
              )}
            </div>
          )}
        </main>

        {/* FLOATING CHAT BAR (Shown in Itinerary view) */}
        {view === 'itinerary' && (
          <ChatBar onSend={handleChatInput} loading={loading} />
        )}
      </div>

      {/* INTEGRATED MAP DRAWER (Inside Application) */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedLocation(null)} />
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-3xl font-black tracking-tighter uppercase">{selectedLocation.title}</h3>
              <button onClick={() => setSelectedLocation(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={32} />
              </button>
            </div>
            <div className="flex-1 bg-slate-50">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_KEY&q=${encodeURIComponent(selectedLocation.loc + " " + selectedLocation.title)}`}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}