import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Compass, Shield, Zap, MapPin, Clock, Loader2, X, DollarSign } from 'lucide-react';

export default function OnboardingModal({ onComplete, loading }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    destination: '', duration: 5, startTime: '09:00', endTime: '21:00',
    budgetMax: 2500, persona: 'Explorer', accommodation: 'Boutique Hotel',
    interests: [], isReligious: false, startDate: '', endDate: '', timePeriod: 'AM'
  });

  const next = () => step < 4 ? setStep(step + 1) : onComplete(form);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-bg-beige/90 backdrop-blur-xl p-6">
      <motion.div layout className="w-full max-w-xl glass-panel rounded-[56px] p-12 relative overflow-hidden shadow-2xl border border-white bg-white/80">
        <div className="absolute top-0 left-0 h-1.5 bg-itera-indigo/10 w-full">
          <motion.div className="h-full bg-itera-indigo" animate={{ width: `${(step / 4) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          // Update Step 1 in OnboardingModal.jsx to include Arrival Date
        {step === 1 && (
            <motion.div key="s1" className="space-y-8">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Where & When?</h2>
              <input 
                className="w-full p-6 bg-slate-50 rounded-[28px] outline-none font-bold text-xl" 
                placeholder="Destination" 
                onChange={e => setForm({...form, destination: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-3xl">
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Arrival Date</p>
                  <input 
                    type="date" 
                    className="bg-transparent font-bold w-full outline-none" 
                    onChange={e => setForm({...form, startDate: e.target.value})}
                  />
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-3xl">
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Duration</p>
                  <select 
                    className="bg-transparent font-bold w-full outline-none"
                    value={form.duration}
                    onChange={e => setForm({...form, duration: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d} Days</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">The Vibe</h2>
              <div className="grid gap-3">
                {['Explorer', 'Safe', 'Risk-Taker'].map(p => (
                  <button key={p} onClick={() => setForm({...form, persona: p})} className={`p-6 rounded-4xl border-2 text-left transition-all ${form.persona === p ? 'border-itera-indigo bg-itera-indigo/5' : 'border-transparent bg-slate-50'}`}>
                    <p className="font-black uppercase text-xs">{p}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            // Step 3 in OnboardingModal.jsx
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase text-slate-400 ml-4">Stay Optimization Style</p>
              <select 
                className="w-full p-5 bg-white rounded-[24px] font-bold border-2 border-slate-100 outline-none focus:border-itera-indigo"
                value={form.accommodation}
                onChange={e => setForm({...form, accommodation: e.target.value})}
              >
                <option value="Boutique Hotel">Boutique Hotel</option>
                <option value="Luxury Hotel">Luxury Hotel</option>
                <option value="Budget Hostel">Budget Hostel</option>
                <option value="Modern Apartment">Modern Apartment</option>
              </select>
            </div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-6">
              <div className="w-24 h-24 bg-itera-indigo/10 rounded-full flex items-center justify-center mx-auto"><Zap size={48} className="text-itera-indigo" /></div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Ready?</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">${form.budgetMax} Budget // {form.duration} Days</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={next} disabled={loading} className="w-full bg-itera-indigo text-white mt-12 py-6 rounded-4xl font-black flex justify-center items-center gap-4 hover:bg-slate-900 transition-all shadow-xl disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : (step === 4 ? "LAUNCH SQUAD" : "CONTINUE")} <ArrowRight size={24} />
        </button>
      </motion.div>
    </div>
  );
}