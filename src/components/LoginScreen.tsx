import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { MascotSitting } from './Logo';

interface LoginScreenProps {
  onLoginSuccess: (nickname: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [nickname, setNickname] = useState('');
  const [passcode, setPasscode] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !passcode || !agreed) return;
    onLoginSuccess(nickname.trim());
  };

  const allowed = [
    'Feelings',
    'Personal stories',
    'Kind words',
    'Lived experiences',
    'Community support',
    'Caregiver support',
    'Hopeful moments'
  ];

  const prohibited = [
    'Prescriptions',
    'Medicine advice',
    'Dosage advice',
    'Diagnosis',
    'Treatment instructions',
    'Fake cure claims',
    'Judgment or abuse'
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between p-5 md:p-8 font-sans select-none w-full">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center space-y-6 py-4">
        
        {/* Onboarding Progress Header */}
        <div className="text-center space-y-1.5">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 mx-auto mb-2"
          >
            <MascotSitting size={64} />
          </motion.div>
          <h1 className="font-display font-black text-[#2B1D12] text-[22px] md:text-[28px] tracking-tight leading-tight">
            🔒 Enter HopeHeart Safely
          </h1>
          <p className="text-[13px] text-gray-500 font-semibold max-w-md mx-auto">
            Choose an anonymous nickname and password. We verify rules to keep this space safe.
          </p>
        </div>

        {/* Form and Rules Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Credentials Form (5 cols on md) */}
          <form onSubmit={handleSubmit} className="md:col-span-5 bg-white border border-[#EDE9DE] p-5 rounded-3xl space-y-4 shadow-2xs">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Anonymous Login
            </span>
            
            <div className="space-y-1">
              <label className="text-[11.5px] font-bold text-gray-650 block">Nickname / Email</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter nickname..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11.5px] font-bold text-gray-650 block">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                required
              />
            </div>

            {/* Checkbox agreement */}
            <label className="flex items-start gap-2.5 pt-2 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#FF7527] focus:ring-[#FF7527]/30 cursor-pointer accent-[#FF7527]"
              />
              <span className="text-[11.5px] text-gray-500 font-semibold leading-tight">
                I agree to the Community Promises and Safe Space Rules listed on the right.
              </span>
            </label>

            <button
              type="submit"
              disabled={!nickname.trim() || !passcode || !agreed}
              className={`w-full py-3 text-white font-display font-bold text-[14.5px] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                nickname.trim() && passcode && agreed
                  ? 'bg-[#FF7527] hover:bg-[#E55D13]'
                  : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              Continue to Profile
              <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          {/* Guidelines Board (7 cols on md) */}
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Allowed Card */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-display font-extrabold text-emerald-800 text-[13.5px] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">✓</span>
                  Allowed Space
                </h3>
                <ul className="space-y-1.5 text-[12px] font-semibold text-gray-600">
                  {allowed.map((item, id) => (
                    <li key={id} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prohibited Card */}
              <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-2xs">
                <h3 className="font-display font-extrabold text-red-800 text-[13.5px] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-800 text-[10px] flex items-center justify-center font-bold">×</span>
                  Not Allowed Here
                </h3>
                <ul className="space-y-1.5 text-[12px] font-semibold text-gray-600">
                  {prohibited.map((item, id) => (
                    <li key={id} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Core Mandate Banner */}
            <div className="bg-amber-50/50 border border-amber-100/60 p-4 rounded-2xl text-center shadow-3xs">
              <span className="text-[9px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block mb-0.5">
                OUR CORE MANDATE
              </span>
              <p className="font-display font-extrabold text-gray-700 text-[13px] sm:text-[14px]">
                People support people. AI keeps the space safe. Professionals provide medical care.
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding Progress Indicator */}
        <div className="w-full max-w-md mx-auto mt-6 pt-4 border-t border-[#EDE9DE]/65 flex flex-col items-center gap-1 select-none">
          <span className="text-[9.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-widest">
            Step 2 of 3
          </span>
          <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-400">
            <span>Welcome</span>
            <span>→</span>
            <span className="text-[#FF7527] font-black">Login</span>
            <span>→</span>
            <span>Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}
