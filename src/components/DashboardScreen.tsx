import { motion } from 'motion/react';
import Mascot from './Mascot';
import { MoodConfig } from '../types';
import { MascotFace } from './Logo';

interface DashboardScreenProps {
  userName: string;
  selectedMood: MoodConfig;
  onNavigateTo: (screenId: string) => void;
  onTriggerCheck: () => void;
  todayQuote: string;
  onRefreshQuote: () => void;
}

export default function DashboardScreen({
  userName,
  selectedMood,
  onNavigateTo,
  onTriggerCheck,
  todayQuote,
  onRefreshQuote,
}: DashboardScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-[#FAF8F3] overflow-y-auto font-sans select-none scrollbar-none w-full">
      {/* Upper Brand / User bar (Always full-width but padded internally) */}
      <div className="pt-4 pb-3 px-5 flex items-center justify-between border-b border-[#EFEBE0] bg-white sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-[#FF7527] bg-[#FFEFE5] flex items-center justify-center p-0.5 overflow-hidden">
              <MascotFace size={34} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#FF7527] font-extrabold uppercase font-mono tracking-wider">User Status</span>
            </div>
            <h3 className="font-display font-extrabold text-[#2B1D12] text-[16px] leading-tight">
              Hi, {userName} 🌟
            </h3>
          </div>
        </div>

        {/* Info button */}
        <button
          onClick={() => onNavigateTo('safety')}
          id="btn-nav-safety"
          className="px-4 py-2 rounded-full border border-orange-100 bg-orange-50 hover:bg-orange-100/50 transition-all text-orange-700 font-display font-bold text-[11.5px] flex items-center gap-1.5 cursor-pointer"
        >
          🛡️ AI Protected
        </button>
      </div>

      {/* Main Responsive Layout Wrapper */}
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          
          {/* LEFT COLUMN: User state & Mascot companion card (Spans 5 cols on md) */}
          <div className="md:col-span-5 space-y-5">
            {/* Greeting HUD Message */}
            <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 shadow-xs">
              <div className="text-[11px] font-mono font-extrabold text-[#FF7527] tracking-wider mb-1">CURRENT HEART STATE</div>
              <h1 className="font-display font-black text-gray-800 text-[22px] md:text-[24px] leading-tight">
                Your heart feels <span className="text-[#FF7527]">{selectedMood.label}</span> today.
              </h1>
              <p className="text-[13px] text-gray-500 font-semibold leading-relaxed mt-2 italic">
                "{selectedMood.tagline}"
              </p>
            </div>

            {/* Mascot Companion interactive Card */}
            <div className="bg-[#FFFDF9] border border-[#EDE9DE] rounded-3xl p-6 shadow-sm text-center flex flex-col items-center space-y-4">
              <div className="p-3 rounded-2xl bg-[#FCFBF8] border border-gray-100 shadow-inner">
                <Mascot expression={selectedMood.buddyExpression} size={150} />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-gray-800 text-[15px]">
                  HopeHeart Mascot
                </h4>
                <p className="text-[12px] text-gray-500 font-medium">
                  Your emotional state alters the counselor companion's avatar.
                </p>
              </div>
              <button
                onClick={onTriggerCheck}
                id="btn-update-mood-left"
                className="w-full py-3 hover:bg-[#FF7527] hover:text-white border border-[#FF7527] text-[#FF7527] rounded-xl text-[13px] font-display font-bold transition-all cursor-pointer bg-white"
              >
                Change Today's Feeling
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Support Options (Spans 7 cols on md) */}
          <div className="md:col-span-7 space-y-5">
            {/* Quick Title header */}
            <div className="pb-1 hidden md:block">
              <h2 className="font-display font-black text-[20px] text-[#2B1D12]">
                Support & Connection
              </h2>
              <p className="text-[13px] text-gray-500 mt-1">
                Warm support is closer than you think. Find help in your own way.
              </p>
            </div>

            {/* Companion Search Hero banner */}
            <button
              onClick={() => onNavigateTo('trusted-listener')}
              id="dahsboard-card-listener"
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#FF7527] to-[#FFA14E] text-white p-6 rounded-3xl shadow-[0_8px_20px_rgba(255,117,39,0.22)] active:scale-[0.99] transition-all text-left group cursor-pointer"
            >
              <div className="absolute right-2 top-2 opacity-15 text-white select-none pointer-events-none">
                <svg className="w-24 h-24 stroke-current" fill="none" strokeWidth="1" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0012 20c-1.11 0-2.18-.157-3.18-.453A11.411 11.411 0 003 19.128v-.109c0-1.113.285-2.16.786-3.07M15 19.128v.109a11.386 11.386 0 003-3.07M9 19.128v-.003c0-1.113.285-2.16.786-3.07M9 19.128v.109A11.386 11.386 0 0112 20c1.11 0 2.18-.157 3.18-.453M9 19.128v.109a11.386 11.386 0 01-3-3.07" />
                </svg>
              </div>
              
              <span className="inline-block px-2.5 py-1 bg-white/20 rounded-full font-mono text-[10px] uppercase tracking-wide font-extrabold mb-3">
                Community Supported
              </span>
              <h3 className="font-display font-black text-[22px] tracking-tight leading-tight">
                Find a Trusted Listener
              </h3>
              <p className="text-[13.5px] text-white/95 font-medium mt-2 leading-relaxed">
                Talk to someone safe when your heart feels heavy. No judgment. No pressure.
              </p>
              <div className="mt-5 flex items-center gap-1 text-[13px] font-bold text-white uppercase font-mono tracking-wider bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl w-fit transition-all">
                Find Listener
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>

            {/* Split cards for professional and rooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Join Support Room */}
              <button
                onClick={() => onNavigateTo('support-rooms')}
                id="dashboard-card-rooms"
                className="p-5 bg-white hover:bg-[#FAF7F0] border border-[#EDE9DE] rounded-3xl text-left transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[20px] mb-3 shadow-inner">
                  🎪
                </div>
                <h4 className="font-display font-extrabold text-gray-800 text-[15px] leading-tight">
                  Join Support Room
                </h4>
                <p className="text-[11.5px] text-gray-500 font-medium mt-1 leading-relaxed">
                  Hop into quiet, focused sharing spaces with kindred spirits.
                </p>
              </button>

              {/* Card 2: Care Bridge Pro */}
              <button
                onClick={() => onNavigateTo('care-bridge')}
                id="dashboard-card-pro"
                className="p-5 bg-white hover:bg-[#FAF7F0] border border-[#EDE9DE] rounded-3xl text-left transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[20px] mb-3 shadow-inner">
                  🩺
                </div>
                <h4 className="font-display font-extrabold text-gray-800 text-[15px] leading-tight">
                  Talk to Professional
                </h4>
                <p className="text-[11.5px] text-gray-500 font-medium mt-1 leading-relaxed">
                  Medical & therapy guidance from certified clinicians.
                </p>
              </button>
            </div>

            {/* Daily Wisdom card */}
            <div className="bg-[#FEFAF0] border-2 border-dashed border-[#F3E2C4] p-5 rounded-3xl relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#F7EACD]/90">
                <span className="text-[11px] font-mono font-extrabold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                  ✨ Today's Hope
                </span>
                <button
                  onClick={onRefreshQuote}
                  title="Refresh Wisdom"
                  className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer text-amber-700"
                >
                  <svg className="w-3.5 h-3.5 stroke-current cursor-pointer" fill="none" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>
              <p className="text-[13.5px] text-gray-700 font-semibold italic leading-relaxed text-center py-1 select-all">
                "{todayQuote}"
              </p>
              <div className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest pt-2.5">
                Tap the button to reveal another message of warmth
              </div>
            </div>

            {/* Safety Trust Badge */}
            <div className="bg-white py-4 px-5 rounded-2xl border border-orange-100/70 text-center text-[12.5px] text-[#FF7527] font-bold leading-relaxed shadow-xs">
              Community supports. AI protects. Doctors treat.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export { DashboardScreen };
