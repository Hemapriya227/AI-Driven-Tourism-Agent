import { Map, Plane, Hotel, HelpCircle } from 'lucide-react';

export default function BentoLanding({ onStart }) {
  return (
    <div className="max-w-5xl mx-auto mt-12 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-itera-amber mb-3 uppercase tracking-tighter">Begin Your Next Adventure 🪁</h1>
        <p className="text-slate-500 font-medium max-w-xl">Share your details, and ITERA will orchestrate your plan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-100">
        {/* ACTION CARD */}
        <button 
          onClick={onStart}
          className="md:col-span-4 bg-[#FDE78E] rounded-[40px] p-8 flex flex-col justify-between hover:scale-[1.02] transition-all text-left shadow-sm border border-[#f3dd7a]"
        >
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Build Itinerary</h3>
            <p className="text-xs font-bold text-slate-700/60 uppercase mt-1">Tailored for You</p>
          </div>
          <Map className="w-16 h-16 self-center text-slate-900/20" />
        </button>

        {/* STATIC CARDS */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-[#B4C6F0] rounded-4xl p-6 flex justify-between items-center opacity-60">
            <h4 className="text-xl font-black uppercase tracking-tighter">Flights</h4>
            <Plane className="text-slate-900/20" />
          </div>
          <div className="flex-1 bg-[#CDB4DB] rounded-4xl p-6 flex justify-between items-center opacity-60">
            <h4 className="text-xl font-black uppercase tracking-tighter">Hotels</h4>
            <Hotel className="text-slate-900/20" />
          </div>
        </div>

        <div className="md:col-span-4 bg-white rounded-[40px] p-8 flex flex-col justify-between border border-slate-200">
          <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Not sure?</h3>
          <HelpCircle className="w-16 h-16 self-center text-slate-100" />
        </div>
      </div>
    </div>
  );
}