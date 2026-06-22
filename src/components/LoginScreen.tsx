import { useState } from 'react';
import { motion } from 'motion/react';
import { MascotSitting } from './Logo';

interface LoginScreenProps {
  onLoginSuccess: (nickname: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleLogin = (provider: 'google' | 'email' | 'guest') => {
    if (!agreed) {
      setShowWarning(true);
      return;
    }
    
    // Set a default mock nickname based on selection
    let mockName = 'Voice47';
    if (provider === 'google') mockName = 'GoogleBuddy';
    if (provider === 'email') mockName = 'EmailBuddy';
    
    onLoginSuccess(mockName);
  };

  const handleContainerClick = () => {
    if (!agreed) {
      setShowWarning(true);
    }
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
    <div className="flex flex-col min-h-full bg-transparent justify-between p-5 md:p-8 font-sans select-none w-full">
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
            🔒 Enter a Safe Space
          </h1>
          <p className="text-[13px] text-gray-500 font-semibold max-w-md mx-auto leading-relaxed">
            Choose how you want to continue. Your safety and privacy come first.
          </p>
        </div>

        {/* Form and Rules Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Login Buttons Column */}
          <div className="md:col-span-5 bg-white border border-[#EDE9DE] p-6 rounded-3xl space-y-5 shadow-2xs">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              CHOOSE HOW TO ENTER
            </span>
            
            {/* Login options wrapped to intercept click warning when disabled */}
            <div onClick={handleContainerClick} className="space-y-2.5">
              {/* Guest */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogin('guest');
                }}
                disabled={!agreed}
                className={`w-full py-3.5 px-4 rounded-xl font-display font-bold text-[13.5px] transition-all flex items-center justify-center gap-2.5 ${
                  agreed
                    ? 'bg-[#EBF5FF] border border-[#C2E0FF] text-blue-800 hover:bg-[#D6EBFF] cursor-pointer shadow-3xs'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed pointer-events-none'
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogin('google');
                }}
                disabled={!agreed}
                className={`w-full py-3.5 px-4 rounded-xl font-display font-bold text-[13.5px] transition-all flex items-center justify-center gap-2.5 ${
                  agreed
                    ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-3xs'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed pointer-events-none'
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
                Continue with Google
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogin('email');
                }}
                disabled={!agreed}
                className={`w-full py-3.5 px-4 rounded-xl font-display font-bold text-[13.5px] transition-all flex items-center justify-center gap-2.5 ${
                  agreed
                    ? 'bg-white border border-[#FF7527]/30 text-gray-700 hover:border-[#FF7527]/60 hover:bg-[#FFFDF9] cursor-pointer shadow-3xs'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed pointer-events-none'
                }`}
              >
                <svg className={`w-4 h-4 shrink-0 fill-none stroke-current ${agreed ? 'text-[#FF7527]' : 'text-gray-400'}`} strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Continue with Email
              </button>
            </div>
            
            {/* Agreement Checkbox (Moved to the bottom of the login card) */}
            <div className="p-3.5 bg-[#FAF8F4] border border-[#EFEBE0] rounded-2xl select-none space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) setShowWarning(false);
                  }}
                  className="mt-0.5 w-4.5 h-4.5 rounded border-gray-300 text-[#FF7527] focus:ring-[#FF7527]/30 cursor-pointer accent-[#FF7527]"
                />
                <span className="text-[12px] text-gray-650 font-semibold leading-tight">
                  I agree to the Safe Space Rules
                </span>
              </label>
              <div className="pl-7">
                <button
                  type="button"
                  onClick={() => alert("Terms & Conditions:\n\n1. HopeHeart is strictly for peer-to-peer emotional support.\n2. Do not share or ask for prescriptions, medical diagnoses, or clinical advice.\n3. Be kind, empathetic, and respectful of other members.\n4. AI monitoring keeps this space safe and anonymous.")}
                  className="text-[11px] text-[#FF7527] font-bold hover:underline cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>

            {/* Small helper line below the checkbox */}
            <p className="text-[10px] text-center text-gray-400 font-semibold leading-normal">
              By continuing, you agree that HopeHeart is for emotional support only.
            </p>

            {/* Warning Message (Only visible when user tries to continue without checking the box) */}
            {showWarning && !agreed && (
              <p className="text-[11.5px] text-center text-red-500 font-bold leading-normal">
                Please agree to the Safe Space Rules to continue.
              </p>
            )}
          </div>

          {/* Guidelines Column */}
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
                      <span className="text-emerald-500 shrink-0 text-[12px]">⭐</span>
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
                    <li key={id} className="flex items-center gap-2">
                      <span className="text-red-500 shrink-0 font-bold text-[12px]">✦</span>
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
              <p className="font-display font-extrabold text-gray-700 text-[13px] sm:text-[14px] leading-relaxed">
                People support people. AI helps keep the space safe. Professionals provide medical care.
              </p>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
