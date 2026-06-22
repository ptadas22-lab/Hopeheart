import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MoodConfig, ScreenId } from '../types';
import { MascotFace } from './Logo';

interface DashboardScreenProps {
  userName: string;
  selectedMood: MoodConfig;
  onNavigateTo: (screenId: string) => void;
  todayQuote: string;
  onRefreshQuote: () => void;
  onMoodSelected: (moodId: string) => void;
  onShareCheckIn?: () => void;
  isProfileIncomplete: boolean;
  onOpenProfileModal: () => void;
  previousMood: string | null;
  hasCheckedInToday: boolean;
  checkinFeedback: string | null;
  onClearCheckinFeedback: () => void;
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
  todayQuote,
  onRefreshQuote,
  onMoodSelected,
  onShareCheckIn,
  isProfileIncomplete,
  onOpenProfileModal,
  previousMood,
  hasCheckedInToday,
  checkinFeedback,
  onClearCheckinFeedback,
}: DashboardScreenProps) {
  const [showToast, setShowToast] = useState(true);
  const [showReminder, setShowReminder] = useState(true);
  const [dismissedReminder, setDismissedReminder] = useState(false);
  const [currentMood, setCurrentMood] = useState(selectedMood.id);

  // HopeBuddy Song states
  const [isSongCardExpanded, setIsSongCardExpanded] = useState(false);
  const [isHumming, setIsHumming] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('hopeheart_music_muted') === 'true';
  });
  const [audioError, setAudioError] = useState<string | null>(null);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const humTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getLyricsForMoodId = (moodId: string): string => {
    const lyricsMap: Record<string, string> = {
      anxious: "Breathe in slow, I’m here with you,\nOne small step will carry you through.",
      sad: "Even quiet days still matter,\nYour heart can rest, not shatter.",
      hurt: "Even quiet days still matter,\nYour heart can rest, not shatter.",
      lonely: "Even quiet days still matter,\nYour heart can rest, not shatter.",
      tired: "Rest your mind, soften the day,\nYou don’t have to rush your way.",
      'need-support': "One thing now, then one thing more,\nYou are safe on this small shore.",
      calm: "Keep this peace, soft and bright,\nCarry it gently through the night.",
      hopeful: "Hold that little light today,\nHope can grow in a gentle way."
    };
    return lyricsMap[moodId] || lyricsMap['calm'];
  };

  const stopWebAudioHum = () => {
    setIsHumming(false);
    
    if (humTimerRef.current) {
      clearTimeout(humTimerRef.current);
      humTimerRef.current = null;
    }

    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.warn('[WebAudio] Error cleaning up audio:', e);
    }
  };

  const startWebAudioHum = async () => {
    setAudioError(null);
    stopWebAudioHum();

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        setAudioError("Your browser does not support AudioContext.");
        return;
      }

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (!isMuted) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // Softer 220 Hz tone (A3)

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime); // Low safe gain

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillatorRef.current = osc;
        gainNodeRef.current = gainNode;

        osc.start();
      }

      setIsHumming(true);

      // Stop automatically after 8 seconds
      humTimerRef.current = setTimeout(() => {
        stopWebAudioHum();
      }, 8000);
    } catch (err) {
      console.warn('[WebAudio] Browser blocked play action:', err);
      setAudioError("Your browser blocked sound. Tap Play again or check volume.");
      setIsHumming(false);
    }
  };

  // Stop humming when mood changes or song card is closed
  useEffect(() => {
    stopWebAudioHum();
  }, [currentMood, isSongCardExpanded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebAudioHum();
    };
  }, []);

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
      <div className="pt-4 pb-3 px-5 flex items-center justify-between hh-header-surface sticky top-0 z-10">
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

      {/* Profile Completion Gentle Reminder Banner */}
      {isProfileIncomplete && showReminder && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
          <div className="bg-gradient-to-r from-[#FFF5F0] to-[#FAF5FF] border border-[#FFD3B6]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[24px] shrink-0">🔔</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-gray-800 text-[13.5px]">
                  Complete your Safe Profile
                </h4>
                <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                  Add a few details so HopeHeart can match you better.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowReminder(false)}
                type="button"
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95"
              >
                Later
              </button>
              <button
                onClick={onOpenProfileModal}
                type="button"
                className="px-3.5 py-1.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95 shadow-3xs"
              >
                Complete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Checkin Feedback Banner */}
      {checkinFeedback && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
          <div className="bg-gradient-to-r from-[#F0FDF4] to-[#F5FFF6] border border-[#BBF7D0]/50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[24px] shrink-0">🌱</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-[#166534] text-[13.5px]">
                  Daily Reflection Saved
                </h4>
                <p className="text-[11.5px] text-[#1E3A1E] font-semibold leading-relaxed">
                  {checkinFeedback}
                </p>
              </div>
            </div>
            <button
              onClick={onClearCheckinFeedback}
              type="button"
              className="w-7 h-7 rounded-full border border-[#BBF7D0] flex items-center justify-center text-gray-500 hover:text-[#166534] text-xs font-bold cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Daily Mood Check-In Reminder Banner */}
      {previousMood && !hasCheckedInToday && !dismissedReminder && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
          <div className="bg-gradient-to-r from-[#FFFDF9] to-[#FDFBF7] border border-[#ECE6D9] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[24px] shrink-0">🌤️</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-gray-800 text-[13.5px]">
                  Daily Mood Check-in
                </h4>
                <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                  Last time, you felt <span className="font-bold text-[#FF7527]">{previousMood}</span>. How are you feeling today?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDismissedReminder(true)}
                type="button"
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95"
              >
                Later
              </button>
              <button
                onClick={() => {
                  const card = document.getElementById('hopebuddy-checkin-card');
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                type="button"
                className="px-3.5 py-1.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95 shadow-3xs"
              >
                Check in now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Bento Grid */}
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Component 1: 🧡 HopeBuddy Check-In Card */}
          <div id="hopebuddy-checkin-card" className="hh-hero-surface rounded-[32px] p-5 flex flex-col justify-between space-y-4 col-span-1 sm:col-span-2 lg:col-span-2">
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
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onMoodSelected(currentMood);
                  }}
                  type="button"
                  className="flex-1 py-2.5 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
                >
                  Update Check-In
                </button>
                <button
                  onClick={onShareCheckIn}
                  type="button"
                  className="px-4 py-2.5 bg-[#FFF2EA] hover:bg-[#FFE4E6] text-[#FF7527] border border-[#FF7527]/20 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                  title="Share Check-In Card"
                >
                  <span>📸</span> Share
                </button>
              </div>

              {/* HopeBuddy Song Section (shows when a mood is selected) */}
              {currentMood && (
                <div className="mt-3 pt-3 border-t border-dashed border-[#EDE9DE] flex flex-col items-center">
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => setIsSongCardExpanded(!isSongCardExpanded)}
                      type="button"
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF2EA] hover:bg-[#FFEAE1] text-[#FF7527] border border-[#FF7527]/15 rounded-full text-[12px] font-bold cursor-pointer transition-all active:scale-95 hover:scale-[1.02]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#FF7527] text-white flex items-center justify-center text-[10px] shadow-3xs font-sans">🎵</span>
                      <span>HopeBuddy Song</span>
                      <span className="text-[10px] text-[#FF7527]/70 transition-transform duration-200" style={{ transform: isSongCardExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </button>
                    {isHumming && (
                      <div className="flex items-center gap-1.5 animate-pulse text-[11px] font-semibold text-gray-500">
                        <span className="inline-block animate-bounce text-xs font-sans" style={{ animationDelay: '0.1s' }}>🎵</span>
                        <span className="inline-block animate-bounce text-xs font-sans" style={{ animationDelay: '0.3s' }}>🎶</span>
                        <span>Humming...</span>
                      </div>
                    )}
                  </div>

                  {isSongCardExpanded && (
                    <div className="w-full mt-3 bg-[#FFFDF9]/80 border border-[#EDE9DE]/50 rounded-2xl p-4 text-center relative overflow-hidden space-y-3 shadow-3xs">
                      <div>
                        <h4 className="font-display font-black text-gray-800 text-[13px] leading-tight mb-0.5">
                          “HopeBuddy has a little song for you”
                        </h4>
                        <p className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">
                          Based on your mood today.
                        </p>
                      </div>

                      <p className="text-[12.5px] text-gray-600 font-semibold italic whitespace-pre-line leading-relaxed px-2 py-1">
                        {getLyricsForMoodId(currentMood)}
                      </p>

                      {audioError && (
                        <div className="py-1.5 px-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[11px] font-semibold text-center leading-normal">
                          ⚠️ {audioError}
                        </div>
                      )}

                      {isHumming && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="py-1.5 px-3 bg-[#FFEFE5] text-[#FF7527] border border-[#FF7527]/10 rounded-xl text-[11.5px] font-bold"
                        >
                          {isMuted ? 'HopeBuddy is muted 🎵' : 'HopeBuddy is humming for you 🎵'}
                        </motion.div>
                      )}

                      {/* Song card actions */}
                      <div className="flex flex-wrap gap-2 pt-1 justify-center">
                        <button
                          onClick={() => {
                            if (isHumming) {
                              stopWebAudioHum();
                            } else {
                              startWebAudioHum();
                            }
                          }}
                          type="button"
                          className="py-1.5 px-3.5 bg-white border border-gray-250 text-gray-700 font-display font-black text-[11.5px] rounded-xl cursor-pointer hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-1.5 shadow-3xs"
                        >
                          <span>{isHumming ? '⏹️ Stop hum' : '🎵 Play HopeBuddy hum'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const nextMuted = !isMuted;
                            setIsMuted(nextMuted);
                            localStorage.setItem('hopeheart_music_muted', nextMuted ? 'true' : 'false');
                            if (nextMuted) {
                              stopWebAudioHum();
                            }
                          }}
                          type="button"
                          className="py-1.5 px-3.5 bg-white border border-gray-250 text-gray-700 font-display font-black text-[11.5px] rounded-xl cursor-pointer hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-1.5 shadow-3xs"
                        >
                          <span>{isMuted ? '🔊 Unmute' : '🔇 Mute'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Component 2: 🛡️ Safety Guardrails Card */}
          <motion.button
            onClick={() => onNavigateTo('ai-safety')}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
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
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
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
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
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
            className="p-5 hh-surface rounded-[32px] text-left flex flex-col justify-between gap-4 col-span-1 sm:col-span-2 lg:col-span-1"
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
              onClick={() => onNavigateTo(ScreenId.CustomerSupport)}
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
