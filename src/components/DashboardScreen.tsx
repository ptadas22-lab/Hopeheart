import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MoodConfig } from '../types';
import { MascotFace } from './Logo';

interface DashboardScreenProps {
  userName: string;
  selectedMood: MoodConfig;
  onNavigateTo: (screenId: string) => void;
  todayQuote: string;
  onRefreshQuote: () => void;
}

export default function DashboardScreen({
  userName,
  selectedMood,
  onNavigateTo,
}: DashboardScreenProps) {
  const [showToast, setShowToast] = useState(true);

  // Auto-dismiss the welcome toast after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] overflow-y-auto font-sans select-none scrollbar-none w-full relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-sm"
          >
            <div className="bg-[#1E1E1A] text-white px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-800">
              <span className="text-xl shrink-0">🧡</span>
              <p className="text-[12px] sm:text-[12.5px] font-semibold leading-normal text-left text-gray-200">
                Welcome, {userName} 👋 HopeBuddy is ready when you need support.
              </p>
              <button 
                onClick={() => setShowToast(false)}
                className="ml-auto text-gray-400 hover:text-white text-xs cursor-pointer flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upper Brand / User bar */}
      <div className="pt-4 pb-3 px-5 flex items-center justify-between border-b border-[#EFEBE0] bg-white sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-[#FF7527] bg-[#FFEFE5] flex items-center justify-center p-0.5 overflow-hidden">
              <MascotFace size={34} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <span className="text-[10px] text-[#FF7527] font-extrabold uppercase font-mono tracking-wider block leading-none mb-0.5">User Status</span>
            <h3 className="font-display font-extrabold text-[#2B1D12] text-[16px] leading-tight">
              Hi, {userName} 🌟
            </h3>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-4xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Component 1: 🧡 HopeBuddy Check-In Card */}
          <div className="bg-white border border-[#EDE9DE] rounded-[32px] p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧡</span>
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] tracking-wider uppercase">
                  HopeBuddy Companion
                </span>
              </div>
              <h2 className="font-display font-black text-gray-800 text-[20px] md:text-[22px] leading-tight">
                You're feeling <span className="text-[#FF7527]">{selectedMood.label}</span> today.
              </h2>
              <p className="text-[12.5px] text-gray-500 font-semibold italic leading-relaxed">
                "{selectedMood.tagline}"
              </p>
            </div>

            <div className="py-2 flex items-center justify-center">
              <div className="p-3 bg-[#FFFDF9] border border-dashed border-[#EDE9DE] rounded-2xl shadow-inner">
                <Mascot expression={selectedMood.buddyExpression} size={120} />
              </div>
            </div>

            <p className="text-[11.5px] text-center text-gray-400 font-medium leading-normal">
              HopeBuddy changes gently based on your mood check-ins.
            </p>
          </div>

          {/* Components 2, 3, 4: Support Navigation Cards Grid */}
          <div className="flex flex-col justify-between gap-4">
            
            {/* Component 2: 🤝 Community Card */}
            <motion.button
              onClick={() => onNavigateTo('safe-listener')}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 p-5 bg-white border border-[#EDE9DE] rounded-3xl text-left transition-all cursor-pointer shadow-3xs flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[22px] shrink-0 shadow-inner">
                🤝
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Community Support
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Talk anonymously 1-on-1 with a trusted listener, or join group circles.
                </p>
              </div>
            </motion.button>

            {/* Component 3: 🌍 Resources Card */}
            <motion.button
              onClick={() => onNavigateTo('doctor-suggestions')}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 p-5 bg-white border border-[#EDE9DE] rounded-3xl text-left transition-all cursor-pointer shadow-3xs flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[22px] shrink-0 shadow-inner">
                🌍
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Trusted Resources
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Discover verified external help lines, specialists, and save questions.
                </p>
              </div>
            </motion.button>

            {/* Component 4: 🛡️ Safety Card */}
            <motion.button
              onClick={() => onNavigateTo('ai-safety')}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 p-5 bg-white border border-[#EDE9DE] rounded-3xl text-left transition-all cursor-pointer shadow-3xs flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[22px] shrink-0 shadow-inner">
                🛡️
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Safety Guardrails
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Learn about anonymous rules, AI moderation protection, and community boundaries.
                </p>
              </div>
            </motion.button>

          </div>

        </div>
      </div>
    </div>
  );
}
