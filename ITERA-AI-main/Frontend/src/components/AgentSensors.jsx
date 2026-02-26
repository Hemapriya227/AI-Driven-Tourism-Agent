import { Cloud, Clock, ShieldCheck } from 'lucide-react';
export default function AgentSensors({ weather }) {
  return (
    <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
      {[ { icon: <Cloud />, label: "Weather", val: weather.desc },
         { icon: <Clock />, label: "Status", val: "Tracking Active" },
         { icon: <ShieldCheck />, label: "Squad", val: "Orchestrator Online" }
      ].map((s, i) => (
        <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-max">
          <div className="p-2 bg-slate-50 text-indigo-600 rounded-2xl">{s.icon}</div>
          <div><p className="text-[8px] font-black uppercase text-slate-400">{s.label}</p><p className="text-xs font-bold text-slate-800">{s.val}</p></div>
        </div>
      ))}
    </div>
  );
}