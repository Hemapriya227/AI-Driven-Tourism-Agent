import { ChevronDown, Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-end items-center p-6 gap-6 bg-transparent">
      {/* Currency / Language Switcher */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-5 h-5 overflow-hidden rounded-full border border-slate-200 shadow-sm">
          <img 
            src="https://flagcdn.com/us.svg" 
            alt="USD" 
            className="w-full h-full object-cover" 
          />
        </div>
        <span className="text-xs font-black text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-tighter">
          USD
        </span>
        <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
      </div>

      {/* Login Button - Matching the Orange from your image */}
      <button className="bg-[#EF8E17] text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-[#d97e12] hover:scale-105 active:scale-95 transition-all">
        Login
      </button>
    </header>
  );
}