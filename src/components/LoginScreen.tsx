import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotSitting } from './Logo';
import { saveSafeRulesConsent } from '../lib/supabaseClient';

interface LoginScreenProps {
  onLoginSuccess: (nickname: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const handleLogin = async (provider: 'google' | 'email' | 'guest') => {
    if (!agreed) return;
    
    // Save consent status securely in Supabase with localStorage backup fallback
    await saveSafeRulesConsent(provider);
    
    // Set a default mock nickname based on selection
    let mockName = 'Voice47';
    if (provider === 'google') mockName = 'GoogleBuddy';
    if (provider === 'email') mockName = 'EmailBuddy';
    
    onLoginSuccess(mockName);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent justify-between p-5 md:p-8 font-sans select-none w-full">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center space-y-6 py-4">
        
        {/* Onboarding Header */}
        <div className="text-center space-y-1.5">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 mx-auto mb-2"
          >
            <MascotSitting size={64} />
          </motion.div>
          <h1 className="font-display font-black text-[#2B1D12] text-[22px] md:text-[28px] tracking-tight leading-tight">
            Welcome to HopeHeart
          </h1>
          <p className="text-[13px] text-gray-500 font-semibold max-w-md mx-auto leading-relaxed">
            A safe, private, and peer-to-peer emotional support space.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: 3 Compact Helper Cards */}
          <div className="space-y-4">
            {/* Card 1: Share safely */}
            <div className="hh-surface rounded-2.5xl p-4.5 flex items-start gap-4 text-left shadow-3xs">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 text-[#FF7527] text-[20px] shrink-0 border border-orange-100/50">
                🧡
              </div>
              <div className="space-y-0.5">
                <h3 className="font-display font-black text-gray-800 text-[13.5px]">
                  Share safely
                </h3>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Talk about feelings, loneliness, stress, or support needs.
                </p>
              </div>
            </div>

            {/* Card 2: Meet support */}
            <div className="hh-surface rounded-2.5xl p-4.5 flex items-start gap-4 text-left shadow-3xs">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-700 text-[20px] shrink-0 border border-blue-100/50">
                👥
              </div>
              <div className="space-y-0.5">
                <h3 className="font-display font-black text-gray-800 text-[13.5px]">
                  Meet support
                </h3>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Connect with listeners, rooms, and resources.
                </p>
              </div>
            </div>

            {/* Card 3: Stay protected */}
            <div className="hh-surface rounded-2.5xl p-4.5 flex items-start gap-4 text-left shadow-3xs">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 text-[20px] shrink-0 border border-emerald-100/50">
                🛡️
              </div>
              <div className="space-y-0.5">
                <h3 className="font-display font-black text-gray-800 text-[13.5px]">
                  Stay protected
                </h3>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  HopeHeart blocks unsafe medical advice and harmful content.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Safety Promise & Login actions */}
          <div className="hh-surface rounded-3xl p-5 md:p-6 space-y-4 shadow-2xs">
            
            {/* Compact Safety Promise Card */}
            <div className="p-4 bg-[#FFFDF9] border border-[#EDE9DE]/60 rounded-2xl text-left space-y-1.5">
              <span className="text-[11px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">
                Before you enter
              </span>
              <h4 className="font-display font-black text-gray-800 text-[13.5px]">
                HopeHeart is a safe emotional support space.
              </h4>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                You can share feelings, stories, and lived experiences. Please do not share prescriptions, diagnosis, dosage advice, cure claims, or harmful comments.
              </p>
            </div>

            {/* Agreement Checkbox & Modal Link */}
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-left select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4.5 h-4.5 rounded border-gray-300 text-[#FF7527] focus:ring-[#FF7527]/30 cursor-pointer accent-[#FF7527]"
                />
                <span className="text-[12.5px] text-gray-650 font-bold leading-snug">
                  I understand HopeHeart is for emotional support only.
                </span>
              </label>
              <div className="pl-7 text-left">
                <button
                  type="button"
                  onClick={() => setShowRulesModal(true)}
                  className="text-[11.5px] text-[#FF7527] font-display font-black hover:underline cursor-pointer flex items-center gap-1"
                >
                  📖 View full safe rules
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-150/40 my-3.5" />

            {/* Login options (Google, Email, Guest - disabled unless checkbox is active) */}
            <div className="space-y-2.5">
              {/* Guest */}
              <button
                type="button"
                onClick={() => handleLogin('guest')}
                disabled={!agreed}
                className={`w-full py-3 px-4 rounded-xl font-display font-black text-[13px] transition-all flex items-center justify-center gap-2.5 ${
                  agreed
                    ? 'bg-[#EBF5FF] border border-[#C2E0FF] text-blue-800 hover:bg-[#D6EBFF] cursor-pointer shadow-3xs active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                <svg className={`w-4 h-4 shrink-0 fill-none stroke-current ${agreed ? 'text-blue-500' : 'text-gray-400'}`} strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Continue as Guest
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={() => handleLogin('google')}
                disabled={!agreed}
                className={`w-full py-3 px-4 rounded-xl font-display font-black text-[13px] transition-all flex items-center justify-center gap-2.5 ${
                  agreed
                    ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-3xs active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill={agreed ? "#4285F4" : "currentColor"}
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill={agreed ? "#34A853" : "currentColor"}
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill={agreed ? "#FBBC05" : "currentColor"}
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill={agreed ? "#EA4335" : "currentColor"}
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google (Demo)
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() => handleLogin('email')}
                disabled={!agreed}
                className={`w-full py-3 px-4 rounded-xl font-display font-black text-[13px] transition-all flex items-center justify-center gap-2.5 ${
                  agreed
                    ? 'bg-white border border-[#FF7527]/30 text-gray-700 hover:border-[#FF7527]/60 hover:bg-[#FFFDF9] cursor-pointer shadow-3xs active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                <svg className={`w-4 h-4 shrink-0 fill-none stroke-current ${agreed ? 'text-[#FF7527]' : 'text-gray-400'}`} strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Continue with Email (Demo)
              </button>
            </div>

            {/* Helper disclaimer */}
            <p className="text-[10px] text-center text-gray-400 font-semibold leading-normal">
              HopeHeart is strictly for peer emotional support. We do not diagnose, treat, or replace professional therapy.
            </p>
          </div>

        </div>
      </div>

      {/* Full Safe Rules Modal Overlay */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulesModal(false)}
              className="absolute inset-0"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md hh-surface rounded-[32px] p-6 z-10 space-y-5 text-center"
            >
              <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                <span className="font-display font-black text-[15px] text-gray-800 flex items-center gap-1.5">
                  🛡️ HopeHeart Safe Rules
                </span>
                <button
                  onClick={() => setShowRulesModal(false)}
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-655 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                {/* Allowed List */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-2.5xl p-4.5 space-y-2">
                  <span className="text-[11px] font-mono font-black text-emerald-805 uppercase tracking-wider block">
                    Allowed:
                  </span>
                  <ul className="space-y-1.5 text-[11.5px] font-bold text-gray-650">
                    {[
                      'Feelings',
                      'Personal stories',
                      'Kind words',
                      'Lived experiences',
                      'Caregiver support',
                      'Emotional sharing'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-500 leading-none mr-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Blocked List */}
                <div className="bg-red-50/40 border border-red-100 rounded-2.5xl p-4.5 space-y-2">
                  <span className="text-[11px] font-mono font-black text-red-805 uppercase tracking-wider block">
                    Blocked:
                  </span>
                  <ul className="space-y-1.5 text-[11.5px] font-bold text-gray-650">
                    {[
                      'Prescriptions',
                      'Dosage advice',
                      'Diagnosis',
                      'Cure claims',
                      'Medicine changes',
                      'Abuse or judgement'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-red-500 leading-none mr-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-xs"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
