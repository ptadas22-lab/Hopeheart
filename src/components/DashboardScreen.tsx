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
  const [activeMoodLift, setActiveMoodLift] = useState<string | null>(null);

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


  const funnyMoodLiftCards = [
    { emoji: '🐧', title: 'Tiny penguin energy', body: 'Imagine a penguin confidently waddling into Monday like it has a meeting to lead.' },
    { emoji: '🍞', title: 'Toast update', body: 'A piece of toast finally popped up and said, “I needed space, but I’m ready now.”' },
    { emoji: '🧦', title: 'Sock mystery', body: 'One sock is always missing because it joined a tiny laundry adventure club.' }
  ];

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

      {/* Calm mood focus hero */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-5">
        <div className="hh-hero-surface rounded-[34px] p-6 sm:p-7 space-y-4 text-center border border-[#F4E7D8]/80">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-[34px] block">🌤️</span>
            <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Daily Mood Check-in</span>
            <h1 className="font-display font-black text-[#2B1D12] text-[24px] sm:text-[30px] leading-tight">How are you feeling right now?</h1>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 font-semibold leading-relaxed">Start with yourself. No pressure to share, explain, or talk before you are ready.</p>
          </div>
          <button
            onClick={() => {
              const card = document.getElementById('hopebuddy-checkin-card');
              if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            type="button"
            className="px-5 py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
          >
            Open mood check-in
          </button>
        </div>
      </div>

      {/* Dynamic Checkin Feedback Banner */}
      {checkinFeedback && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-5">
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
          <div className="bg-gradient-to-r from-[#FFFDF9] to-[#FDFBF7] border border-[#ECE6D9] rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[24px] shrink-0">🌤️</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-gray-800 text-[13px]">
                  Daily Mood Check-in
                </h4>
                <p className="text-[11px] text-gray-555 font-semibold leading-relaxed">
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

      {/* Mood Lift: softer first step before heavier support */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
        <div className="hh-surface rounded-[32px] p-6 sm:p-7 space-y-5 border border-[#F4E7D8]/80">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Support without pressure</span>
              <h3 className="font-display font-black text-[#2B1D12] text-[18px] leading-tight">Mood Lift</h3>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">You don’t have to talk. Start with what feels easiest.</p>
            </div>
            <span className="text-[28px] self-start sm:self-auto">🌤️</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'smile', label: 'Make me smile', emoji: '😊' },
              { id: 'calm', label: 'Calm my mind', emoji: '🫧' },
              { id: 'sound', label: 'Play calming hum', emoji: '🎵' },
              { id: 'write', label: 'Write privately', emoji: '📝' },
              { id: 'memory', label: 'Save a good memory', emoji: '🌼' },
              { id: 'read', label: 'Read something gentle', emoji: '📚' },
              { id: 'strengths', label: 'Remember my strengths', emoji: '💛' },
              { id: 'like', label: 'Do something I like', emoji: '✨' }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (option.id === 'sound') {
                    setActiveMoodLift('sound');
                    if (isHumming) {
                      stopWebAudioHum();
                    } else {
                      startWebAudioHum();
                    }
                    return;
                  }
                  if (option.id === 'calm') {
                    onNavigateTo(ScreenId.Mood);
                    return;
                  }
                  if (option.id === 'write' || option.id === 'memory' || option.id === 'strengths') {
                    onNavigateTo(ScreenId.MySpace);
                    return;
                  }
                  if (option.id === 'read') {
                    onNavigateTo(ScreenId.DoctorSuggestions);
                    return;
                  }
                  setActiveMoodLift(activeMoodLift === option.id ? null : option.id);
                }}
                className={`min-h-[104px] rounded-2xl border px-3 py-4 text-center transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                  activeMoodLift === option.id
                    ? 'bg-[#FFF2EA] border-[#FF7527]/40 text-[#C75414] shadow-3xs'
                    : 'bg-[#FFFDF9] border-gray-150 text-gray-650 hover:border-orange-200 hover:bg-[#FFF8F2]'
                }`}
              >
                <span className="text-[22px] leading-none block">{option.emoji}</span>
                <span className="text-[11px] sm:text-[11.5px] font-display font-black leading-snug block max-w-[120px] mx-auto">{option.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {(activeMoodLift === 'smile' || activeMoodLift === 'like') && (
              <motion.div
                key="mood-lift-smile"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
              >
                {funnyMoodLiftCards.map((card) => (
                  <div key={card.title} className="bg-white/80 border border-orange-100/70 rounded-2xl p-3.5 space-y-1.5">
                    <span className="text-[22px]">{card.emoji}</span>
                    <h4 className="font-display font-black text-gray-800 text-[13px]">{card.title}</h4>
                    <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeMoodLift === 'sound' && (
              <motion.div
                key="mood-lift-sound"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="bg-[#FFFDF9] border border-orange-100/70 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-display font-black text-gray-800 text-[13px]">HopeBuddy hum</h4>
                  <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                    {isHumming ? 'A gentle hum is playing for a few seconds.' : 'Tap Calming sound again when you want the gentle hum.'}
                  </p>
                  {audioError && <p className="text-[11px] text-red-600 font-semibold mt-1">⚠️ {audioError}</p>}
                </div>
                <button
                  type="button"
                  onClick={isHumming ? stopWebAudioHum : startWebAudioHum}
                  className="px-4 py-2 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95"
                >
                  {isHumming ? 'Stop hum' : 'Play hum'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 💛 Gentle support path stepper */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
        <div className="bg-white/70 border border-[#EDE9DE] rounded-[24px] p-4 space-y-3 shadow-3xs backdrop-blur-xs select-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Support without pressure</span>
              <h4 className="font-display font-black text-gray-800 text-[14px]">
                Your gentle support path
              </h4>
            </div>
            <p className="text-[11.5px] text-gray-550 font-semibold leading-relaxed">
              Start privately. Connect only when you feel ready.
            </p>
          </div>

          {/* Steps Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {[
              {
                step: 1,
                label: 'Mood Check-in',
                emoji: '🌤️',
                done: hasCheckedInToday,
                desc: 'Notice how you feel.'
              },
              {
                step: 2,
                label: 'Feel Good',
                emoji: '🌤️',
                done: localStorage.getItem('hopeheart_has_reflected') === 'true' || activeMoodLift !== null,
                desc: 'Try something light first.'
              },
              {
                step: 3,
                label: 'My Space',
                emoji: '🌼',
                done: (localStorage.getItem('hopeheart_private_diary') && JSON.parse(localStorage.getItem('hopeheart_private_diary') || '[]').length > 0) || (localStorage.getItem('hopeheart_positive_memories') && JSON.parse(localStorage.getItem('hopeheart_positive_memories') || '[]').length > 0),
                desc: 'Write privately or save memories.'
              },
              {
                step: 4,
                label: 'Optional Community',
                emoji: '🤝',
                done: localStorage.getItem('hopeheart_has_joined_room') === 'true' || localStorage.getItem('hopeheart_has_matched_listener') === 'true',
                desc: 'Browse quietly or connect when ready.'
              }
            ].map((st) => {
              return (
                <div key={st.step} className={`p-2.5 rounded-2xl border transition-all flex flex-col justify-between gap-1 ${
                  st.done
                    ? 'bg-[#EAF7F0] border-emerald-200 text-emerald-800'
                    : 'bg-[#FCFBF8] border-gray-150 text-gray-500'
                }`}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[12px] font-mono font-bold uppercase tracking-wider block">Step {st.step}</span>
                    <span className="text-[14px]">
                      {st.done ? '✅' : st.emoji}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h5 className="font-display font-black text-[12px] leading-tight text-gray-800">
                      {st.label}
                    </h5>
                    <p className="text-[10px] text-gray-550 font-semibold leading-normal">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile Completion Gentle Reminder Banner */}
      {isProfileIncomplete && showReminder && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
          <div className="bg-gradient-to-r from-[#FFF5F0]/85 to-[#FAF5FF]/85 border border-[#FFD3B6]/40 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[20px] shrink-0">🔔</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-gray-800 text-[13.5px]">
                  Personalize your safe space
                </h4>
                <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                  Add a few details so HopeHeart can feel more personal to you.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowReminder(false)}
                type="button"
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95"
              >
                Add later
              </button>
              <button
                onClick={onOpenProfileModal}
                type="button"
                className="px-3.5 py-1.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95 shadow-3xs"
              >
                Personalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Bento Grid */}
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">

          {/* Component 1: 🧡 HopeBuddy Check-In Card */}
          <div id="hopebuddy-checkin-card" className="hh-hero-surface rounded-[36px] p-6 sm:p-7 flex flex-col justify-between space-y-5 col-span-1 sm:col-span-2 lg:col-span-3">
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧡</span>
                  <span className="text-[11px] font-mono font-extrabold text-[#FF7527] tracking-wider uppercase">
                    Daily Mood Check-in
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-bold">Private to you</span>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="font-display font-black text-[#2B1D12] text-[23px] sm:text-[28px] leading-tight">How are you feeling right now?</h2>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Choose the closest feeling. You can keep it private and move at your own pace.</p>
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

          {/* Component 3: 🌤️ Feel Good Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.FeelGood)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF2EA] border border-orange-100 flex items-center justify-center text-[30px] shrink-0">🌤️</div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">Feel Good</h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Smile, hum, write, remember strengths, or do something small you like.</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">Try Something Light →</span>
          </motion.button>

          {/* Component 3: 🌼 My Space Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.MySpace)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF2EA] border border-orange-100 flex items-center justify-center text-[30px] shrink-0">🌼</div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  My Space
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Private diary, memories, Remember Me, and gentle resources in one place.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              Open My Space →
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
                  Comfort Resources
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Read gentle emotional information when you are ready. Small steps only.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              Read When Ready →
            </span>
          </motion.button>

          {/* Remember Me Strength Reminder Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.MySpace)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[30px] block">💛</span>
              <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">Remember Me</h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Keep strengths, interests, comforts, safe places, and survival memories close.</p>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">Remember My Strengths →</span>
          </motion.button>

          {/* Optional Community Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.Community)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[30px] block">🤝</span>
              <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">Optional Community</h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Connect only when you feel ready. You can also just browse quietly.</p>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">Browse Quietly →</span>
          </motion.button>

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

        {/* Safe Platform Boundary Disclaimer Footer */}
        <div className="mt-8 mb-6 text-center max-w-2xl mx-auto px-4">
          <p className="text-[11px] text-gray-400 font-bold leading-normal">
            HopeHeart provides emotional support, peer listening, and resources. It does not provide medical diagnosis, prescriptions, therapy, emergency care, or crisis intervention.
          </p>
        </div>
      </div>
    </div>
  );
}
