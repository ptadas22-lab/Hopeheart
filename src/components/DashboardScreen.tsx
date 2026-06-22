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
  onMoodSelected: (moodId: string) => void;
}

// 1. Community Support Illustration (Anxious person holding phone, listening chat bubble)
function CommunityIllustration() {
  return (
    <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#FFF2EA" />
      <circle cx="50" cy="50" r="40" fill="#FFFDF9" stroke="#FFE4D6" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="42" cy="38" r="7" fill="#E08C5E" />
      {/* Hair */}
      <path d="M34 38c0-5 3-9 8-9s8 4 8 9c0 1-1 3-2 4h-12c-1-1-2-3-2-4z" fill="#4A3B32" />
      {/* Body */}
      <path d="M26 68c0-10 6-16 16-16s16 6 16 16H26z" fill="#D36B3B" />
      {/* Phone */}
      <rect x="52" y="46" width="10" height="18" rx="2" fill="#2B1D12" />
      <rect x="53" y="48" width="8" height="14" rx="1" fill="#FFF" />
      <circle cx="57" cy="63" r="0.8" fill="#FF7527" />
      {/* Hand */}
      <path d="M48 58c1-1 4 0 5 2l-2 3c-1 0-2-1-3-1l-2-2c1-1 1-2 2-2z" fill="#E08C5E" />
      {/* Soft chat bubble showing listening status */}
      <path d="M62 38c0-6 7-10 15-10s15 4 15 10c0 5-6 9-13 10l-4 4v-4c-7-1-13-5-13-10z" fill="#EBF5FF" stroke="#C2E0FF" strokeWidth="1" />
      {/* Heart inside bubble */}
      <path d="M77 39c-1-1-2.5 0-2.5 0s1.2 1.8 2.5 2.8c1.3-1 2.5-2.8 2.5-2.8s-1.5-1-2.5 0z" fill="#FF7527" />
    </svg>
  );
}

// 2. Trusted Resources Illustration (Person calmly reading guide/map, floating cards)
function ResourcesIllustration() {
  return (
    <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#EAF7F0" />
      <circle cx="50" cy="50" r="40" fill="#FFFDF9" stroke="#D1EFE0" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="32" r="7" fill="#E08C5E" />
      <path d="M44 32c0-5 3-8 6-8s6 3 6 8c0 1 0 2-1 3H45c-1-1-1-2-1-3z" fill="#6B5B52" />
      {/* Body */}
      <path d="M36 68c0-8 6-13 14-13s14 5 14 13H36z" fill="#3D9B75" />
      {/* Map/Guide */}
      <path d="M38 52h24l4 12H34l4-12z" fill="#FAF6EE" stroke="#A89C85" strokeWidth="1.2" />
      <line x1="43" y1="56" x2="57" y2="56" stroke="#C7BDAB" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="41" y1="60" x2="59" y2="60" stroke="#C7BDAB" strokeWidth="1.5" strokeLinecap="round" />
      {/* Floating resources */}
      <rect x="18" y="24" width="12" height="16" rx="2" fill="#FFF" stroke="#FF7527" strokeWidth="0.8" transform="rotate(-15, 18, 24)" />
      <rect x="68" y="20" width="14" height="18" rx="2" fill="#FFF" stroke="#3D9B75" strokeWidth="0.8" transform="rotate(10, 68, 20)" />
      <circle cx="75" cy="26" r="1" fill="#EAF7F0" stroke="#3D9B75" strokeWidth="0.5" transform="rotate(10, 68, 20)" />
    </svg>
  );
}

// 3. Safety Guardrails Illustration (Person inside soft protective shield with lock/symbols)
function SafetyIllustration() {
  return (
    <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#FFF8EE" />
      {/* Head */}
      <circle cx="50" cy="46" r="7" fill="#E08C5E" />
      {/* Body */}
      <path d="M36 78c0-8 6-14 14-14s14 6 14 14H36z" fill="#9C7752" />
      {/* Shield */}
      <path d="M50 20c15 0 25 5 25 18 0 16-16 28-25 32C41 66 25 54 25 38c0-13 10-18 25-18z" fill="#FFE5D6" fillOpacity="0.2" stroke="#FF7527" strokeWidth="2.2" strokeLinejoin="round" />
      {/* Lock */}
      <rect x="44" y="38" width="12" height="9" rx="1.5" fill="#2B1D12" />
      <path d="M47 38v-3c0-1.6 1.3-3 3-3s3 1.4 3 3v3" stroke="#2B1D12" strokeWidth="1.5" fill="none" />
      {/* Checkmarks */}
      <circle cx="21" cy="30" r="3" fill="#3D9B75" />
      <path d="M20 30l0.7 0.7 1.5-1.5" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="79" cy="48" r="3" fill="#3D9B75" />
      <path d="M78 48l0.7 0.7 1.5-1.5" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// 4. Help & Support Illustration (Agent with headset and help screen frame)
function SupportIllustration() {
  return (
    <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#F1F6FE" />
      <circle cx="50" cy="50" r="40" fill="#FFFDF9" stroke="#D6E5FF" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="38" r="7.5" fill="#E08C5E" />
      {/* Headset */}
      <path d="M42 38a8 8 0 0 1 16 0" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="41.5" cy="38" r="1.5" fill="#2B1D12" />
      <circle cx="58.5" cy="38" r="1.5" fill="#2B1D12" />
      <path d="M58.5 38c0 4-3 5-3 5" fill="none" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body */}
      <path d="M34 72c0-9 7-15 16-15s16 6 16 15H34z" fill="#4B6EAF" />
      {/* Chat frame */}
      <rect x="25" y="52" width="50" height="28" rx="4" fill="#FAF6EE" stroke="#BACAE6" strokeWidth="1.2" />
      <circle cx="30" cy="56" r="1.2" fill="#FF7527" />
      <circle cx="34" cy="56" r="1.2" fill="#FFC72C" />
      <circle cx="38" cy="56" r="1.2" fill="#28C840" />
      {/* Chat bubble */}
      <rect x="42" y="62" width="28" height="12" rx="3" fill="#EBF5FF" />
      <circle cx="48" cy="68" r="1" fill="#4B6EAF" />
      <circle cx="54" cy="68" r="1" fill="#4B6EAF" />
      <circle cx="60" cy="68" r="1" fill="#4B6EAF" />
    </svg>
  );
}

export default function DashboardScreen({
  userName,
  selectedMood,
  onNavigateTo,
  onMoodSelected,
}: DashboardScreenProps) {
  const [showToast, setShowToast] = useState(true);
  const [currentMood, setCurrentMood] = useState(selectedMood.id);

  // Auto-dismiss the welcome toast after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Sync state if selected mood changes externally
  useEffect(() => {
    setCurrentMood(selectedMood.id);
  }, [selectedMood.id]);

  return (
    <div className="flex flex-col min-h-full bg-transparent overflow-y-auto font-sans select-none scrollbar-none w-full relative">
      
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
                type="button"
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

      {/* Main Layout Bento Grid */}
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Component 1: 🧡 HopeBuddy Check-In Card */}
          <div className="bg-white border border-[#EDE9DE] rounded-[32px] p-6 shadow-xs flex flex-col justify-between space-y-4 col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧡</span>
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] tracking-wider uppercase">
                  HopeBuddy Companion
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-3 bg-[#FFFDF9] border border-dashed border-[#EDE9DE] rounded-2xl shadow-inner shrink-0">
                  <Mascot expression={selectedMood.buddyExpression} size={110} />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h2 className="font-display font-black text-gray-800 text-[19px] md:text-[21px] leading-tight">
                    You're feeling <span className="text-[#FF7527]">{selectedMood.label}</span> today.
                  </h2>
                  <p className="text-[12.5px] text-gray-500 font-semibold italic leading-relaxed">
                    "{selectedMood.tagline}"
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-[#EDE9DE] space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
                  Daily Check-In
                </span>
                <span className="text-[13px] font-display font-black text-gray-700">
                  How are you feeling now?
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'calm', label: 'Calm', emoji: '😊' },
                  { id: 'sad', label: 'Low', emoji: '😔' },
                  { id: 'anxious', label: 'Anxious', emoji: '😰' },
                  { id: 'tired', label: 'Tired', emoji: '😴' }
                ].map((mood) => {
                  const isSelected = currentMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setCurrentMood(mood.id)}
                      type="button"
                      className={`py-2 px-1 border rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF7527] bg-[#FFF2EA] text-[#FF7527] font-bold shadow-3xs'
                          : 'border-gray-150 bg-[#FCFBF8] text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[20px]">{mood.emoji}</span>
                      <span className="text-[10px] font-bold">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  onMoodSelected(currentMood);
                  alert("Mood check-in updated successfully! HopeBuddy expressions synchronized.");
                }}
                type="button"
                className="w-full py-2.5 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                Update Check-In
              </button>
            </div>
          </div>

          {/* Component 2: 🛡️ Safety Guardrails Card */}
          <motion.button
            onClick={() => onNavigateTo('ai-safety')}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 bg-white border border-[#EDE9DE] rounded-[32px] text-left transition-all cursor-pointer shadow-3xs flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <SafetyIllustration />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Safety Guardrails
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  AI helps keep conversations safe, respectful, and free from medical advice.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              View Rules & Guide →
            </span>
          </motion.button>

          {/* Component 3: 🤝 Community Support Card */}
          <motion.button
            onClick={() => onNavigateTo('safe-listener')}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 bg-white border border-[#EDE9DE] rounded-[32px] text-left transition-all cursor-pointer shadow-3xs flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <CommunityIllustration />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Community Support
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Find peer listeners and support circles where people listen without judgement.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              Enter Safe Space →
            </span>
          </motion.button>

          {/* Component 4: 🌍 Trusted Resources Card */}
          <motion.button
            onClick={() => onNavigateTo('doctor-suggestions')}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 bg-white border border-[#EDE9DE] rounded-[32px] text-left transition-all cursor-pointer shadow-3xs flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <ResourcesIllustration />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Trusted Resources
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Explore support pathways, external resources, and saved care questions.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              Explore Resources →
            </span>
          </motion.button>

          {/* Component 5: 🛟 Help & Support Card */}
          <div
            className="p-5 bg-white border border-[#EDE9DE] rounded-[32px] text-left shadow-3xs flex flex-col justify-between gap-4 col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <SupportIllustration />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  🛟 Help & Support
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Need help using HopeHeart? Contact support or report an issue.
                </p>
              </div>
            </div>
            <button
              onClick={() => alert("Contact Support:\n\nOur emotional support team is available 24/7. Drop us a message at support@hopeheart.org or report navigation/safety concerns directly.")}
              type="button"
              className="w-full py-2.5 bg-[#FAF8F4] hover:bg-[#FFF2EA] hover:text-[#FF7527] border border-[#ECE6D9] hover:border-[#FF7527] text-gray-700 rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95 text-center mt-1"
            >
              Contact Support
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
