import { MapPin, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function ItineraryCard({ item, onReached, isReached, onMapOpen }) {
  const isOutdoor = item.type?.toLowerCase().includes('outdoor');
  
  return (
    <div className={`group p-8 rounded-[48px] mb-6 transition-all duration-500 border-2 flex flex-col md:flex-row justify-between items-center gap-6 ${
      isReached ? 'bg-slate-50 border-slate-200 opacity-60' : isOutdoor ? 'bg-[#E7F3EF] border-transparent hover:border-emerald-400' : 'bg-[#E7EBF3] border-transparent hover:border-blue-400'
    }`}>
      <div className="flex-1 cursor-pointer w-full" onClick={() => onMapOpen(item)}>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isReached ? 'bg-slate-200' : isOutdoor ? 'bg-emerald-200 text-emerald-900' : 'bg-blue-200 text-blue-900'}`}>{item.time}</span>
        <h3 className={`text-5xl font-black tracking-tighter leading-none italic my-3 ${isReached ? 'text-slate-400' : 'text-slate-900'}`}>{item.title}</h3>
        <div className="flex items-center gap-2 text-slate-500 font-bold"><MapPin size={18} /> <span className="text-xl underline decoration-slate-200 underline-offset-8 uppercase tracking-tighter">{item.loc}</span></div>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button onClick={(e) => { e.stopPropagation(); onReached(); }} className={`flex-1 md:flex-none px-8 py-4 rounded-full font-black text-xs uppercase transition-all ${isReached ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 border hover:border-indigo-600'}`}>
          {isReached ? 'Reached' : 'Mark Reached'}
        </button>
        <button onClick={() => onMapOpen(item)} className="p-5 bg-white rounded-full text-slate-200 group-hover:text-indigo-600 shadow-sm transition-all group-hover:-rotate-45"><ChevronRight size={32} strokeWidth={3} /></button>
      </div>
    </div>
  );
}