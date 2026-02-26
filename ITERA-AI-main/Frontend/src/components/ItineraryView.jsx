import React from 'react';
import Timeline from './Timeline';
import AgentSensors from './AgentSensors';

export default function ItineraryView({ profile, itinerary, loading }) {
  return (
    <div className="max-w-4xl mx-auto">
      <AgentSensors weather={{ desc: "Analyzing Context", temp: "24°C" }} />
      
      <div className="mb-16">
        <h1 className="text-8xl font-black tracking-tighter uppercase text-slate-900 leading-[0.8] mb-6">
          {profile?.destination || "Orchestrating..."}
        </h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
          {profile?.startDate} — {profile?.endDate} // {profile?.persona}
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-[10px] tracking-[0.4em] text-indigo-600 uppercase animate-pulse">
            Agents Negotiating Plan...
          </p>
        </div>
      ) : (
        <Timeline items={itinerary} />
      )}
    </div>
  );
}