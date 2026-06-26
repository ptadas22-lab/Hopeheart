import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MoodConfig, ScreenId } from '../types';
import { MascotFace } from './Logo';
import { saveHomeMoodCheckIn } from '../services/homeCheckins';

interface DashboardScreenProps {
  userName: string;
  selectedMood: MoodConfig;
  onNavigateTo: (screenId: string) => void;
  todayQuote: string;
  onRefreshQuote: () => void;
  onMoodSelected: (moodId: string) => void | Promise<void>;
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
  const [isSavingHomeCheckIn, setIsSavingHomeCheckIn] = useState(false);
  const [homeCheckInStatus, setHomeCheckInStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showShortcutSheet, setShowShortcutSheet] = useState(false);
  const [showMoodReminderCard, setShowMoodReminderCard] = useState(hasCheckedInToday);
  const [selectedReminderPanel, setSelectedReminderPanel] = useState<{ title: string; message: string } | null>(null);

  const getHomeMoodLabel = (moodId: string) => {
    const moodLabels: Record<string, string> = {
      calm: 'Calm',
      sad: 'Low',
      low: 'Low',
      anxious: 'Anxious',
      tired: 'Tired'
    };

    return moodLabels[moodId] || 'Calm';
  };

  const getMoodReminderLine = (moodId: string) => {
    if (moodId === 'anxious') return 'First, help your body feel a little safer.';
    if (moodId === 'sad' || moodId === 'low') return 'Start with one small thing that still feels like you.';
    if (moodId === 'tired') return 'Choose something easy. Rest counts too.';
    return 'Save this calm moment or explore gently.';
  };

  const handleSaveHomeCheckIn = async () => {
    if (isSavingHomeCheckIn) return;

    setIsSavingHomeCheckIn(true);
    setHomeCheckInStatus(null);

    const moodLabel = getHomeMoodLabel(currentMood);
    const result = await saveHomeMoodCheckIn({ moodId: currentMood, moodLabel });

    if (!result.ok) {
      setHomeCheckInStatus({ type: 'error', message: "Couldn’t save right now. Please try again." });
      setIsSavingHomeCheckIn(false);
      return;
    }

    setHomeCheckInStatus({ type: 'success', message: 'Your check-in is saved safely.' });
    setShowMoodReminderCard(true);
    setSelectedReminderPanel(null);

    try {
      await onMoodSelected(currentMood);
    } finally {
      setIsSavingHomeCheckIn(false);
    }
  };

  const handleContinueLastPrivateSpace = () => {
    if (localStorage.getItem('hopeheart_has_explored_resources') === 'true') {
      onNavigateTo(ScreenId.DoctorSuggestions);
      return;
    }

    if (localStorage.getItem('hopeheart_has_joined_room') === 'true') {
      onNavigateTo(ScreenId.Community);
      return;
    }

    onNavigateTo(ScreenId.MySpace);
  };

  const reminderActions = [
    {
      title: 'Favourite food',
      text: 'Think of something you love eating.',
      icon: '🍲',
      action: () => setSelectedReminderPanel({ title: 'Favourite food', message: 'Maybe order or prepare something that feels comforting today.' })
    },
    {
      title: 'Comfort music',
      text: 'Play something that feels familiar.',
      icon: '🎧',
      action: () => setSelectedReminderPanel({ title: 'Comfort music', message: 'Play something familiar for a few minutes.' })
    },
    {
      title: 'Save a memory',
      text: 'Write one small moment from today.',
      icon: '📝',
      action: () => onNavigateTo(ScreenId.MySpace)
    },
    {
      title: 'Join quiet circles',
      text: 'Explore gently, only if you want.',
      icon: '🌙',
      action: () => onNavigateTo(ScreenId.Community)
    },
    {
      title: 'Chat only if you want',
      text: 'No pressure. You control the pace.',
      icon: '💬',
      action: () => onNavigateTo(ScreenId.HopeBuddyChat)
    }
  ];

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

      {/* Soft greeting card below the fixed app header */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-5">
        <div className="bg-white/70 border border-[#F1E7D8] rounded-[24px] px-4 py-3 flex items-center gap-3 shadow-3xs backdrop-blur-xs">
          <div className="w-9 h-9 rounded-full bg-[#FFF2EA] border border-orange-100 flex items-center justify-center overflow-hidden shrink-0">
            <MascotFace size={30} />
          </div>
          <div className="space-y-0.5">
            <h2 className="font-display font-black text-[#2B1D12] text-[15px] leading-tight">Hi, {userName || 'GoogleBuddy'} 🌼</h2>
            <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">You’re safe here.</p>
          </div>
        </div>
      </div>

      {/* Main soft mood card */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-5">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FFFDF9] via-[#FFF3EA] to-[#FFEAF3] border border-orange-100/70 shadow-3xs px-5 py-6 sm:px-7 sm:py-7 text-center">
          <div className="absolute -top-14 -right-12 w-36 h-36 bg-[#FFB98A]/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-[#F8C8DC]/25 rounded-full blur-2xl" />
          <div className="relative space-y-4 max-w-xl mx-auto">
            <div className="space-y-2">
              <span className="text-[30px] block">🌤️</span>
              <h1 className="font-display font-black text-[#2B1D12] text-[24px] sm:text-[29px] leading-tight">How is your heart today?</h1>
              <p className="text-[12.5px] sm:text-[13px] text-gray-500 font-semibold leading-relaxed">No need to explain. Just check in with yourself.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  const card = document.getElementById('hopebuddy-checkin-card');
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                type="button"
                className="px-5 py-2.5 bg-[#F9733D] hover:bg-[#E96630] text-white rounded-full text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
              >
                Check in gently
              </button>
              <button
                onClick={() => setShowShortcutSheet(true)}
                type="button"
                className="px-5 py-2.5 bg-white/80 hover:bg-white border border-[#F6CBB0] text-[#B95825] rounded-full text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
              >
                I need something small
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShortcutSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2B1D12]/30 backdrop-blur-[3px] flex items-end justify-center p-0 sm:p-5"
            onClick={() => setShowShortcutSheet(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 230 }}
              className="w-full sm:max-w-md max-h-[58vh] overflow-y-auto bg-[#FFFDF9] border border-orange-100 rounded-t-[30px] sm:rounded-[30px] p-5 shadow-xl space-y-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="w-11 h-1.5 rounded-full bg-[#EADFC9] mx-auto" />
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="font-display font-black text-[#2B1D12] text-[19px] leading-tight">What would help right now?</h2>
                  <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Pick one small step. No pressure.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShortcutSheet(false)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center text-[12px] font-black cursor-pointer"
                  aria-label="Close options"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Feel better', description: 'Small steps to lift your mood.', icon: '✨', action: () => onNavigateTo(ScreenId.FeelGood) },
                  { title: 'Write privately', description: 'Let it out in a safe space.', icon: '📝', action: () => onNavigateTo(ScreenId.MySpace) },
                  { title: 'Remember myself', description: 'Reconnect with what matters.', icon: '💛', action: () => onNavigateTo(ScreenId.MySpace) },
                  { title: 'Get help', description: 'Reach out when you need support.', icon: '🛡️', action: () => onNavigateTo(ScreenId.AISafety) }
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      setShowShortcutSheet(false);
                      item.action();
                    }}
                    className="min-h-[112px] rounded-2xl bg-[#FFF8F2] hover:bg-[#FFF2EA] border border-orange-100/80 shadow-3xs flex items-start gap-3 text-left cursor-pointer transition-all active:scale-[0.98] p-3.5 group"
                  >
                    <span className="w-10 h-10 rounded-full bg-white border border-orange-100 flex items-center justify-center text-[21px] leading-none shrink-0">{item.icon}</span>
                    <span className="flex-1 min-w-0 space-y-1">
                      <span className="block text-[13px] font-display font-black text-gray-800 leading-tight">{item.title}</span>
                      <span className="block text-[11.5px] text-gray-500 font-semibold leading-relaxed">{item.description}</span>
                    </span>
                    <span className="text-[14px] text-gray-300 group-hover:text-[#FF7527] transition-colors pt-1">→</span>
                  </button>
                ))}
              </div>

              <div className="bg-white/75 border border-orange-100/70 rounded-2xl p-3.5 space-y-2 text-left shadow-3xs">
                <div className="space-y-1">
                  <h3 className="text-[12.5px] font-display font-black text-gray-800 leading-tight">Community is optional.</h3>
                  <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                    Browse quietly if you want. You’re in control. No pressure to post or reply.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowShortcutSheet(false);
                    onNavigateTo(ScreenId.Community);
                  }}
                  className="text-[11.5px] font-display font-black text-[#C75414] hover:underline cursor-pointer"
                >
                  Browse optional community →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Hidden anchor card for detailed mood check-in */}
      <div id="hopebuddy-checkin-card" className="mx-4 sm:mx-6 md:mx-8 mt-5">
        <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-3 border border-[#F4E7D8]/80">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Private mood check-in</span>
              <h3 className="font-display font-black text-gray-800 text-[15px] leading-tight">Choose the closest feeling.</h3>
            </div>
            <span className="text-[12px] text-gray-400 font-bold">Private to you</span>
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
                  onClick={() => {
                    setCurrentMood(mood.id);
                    setHomeCheckInStatus(null);
                    setShowMoodReminderCard(false);
                    setSelectedReminderPanel(null);
                  }}
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
            onClick={handleSaveHomeCheckIn}
            type="button"
            disabled={isSavingHomeCheckIn}
            className="w-full py-2.5 bg-[#2B1D12] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSavingHomeCheckIn ? 'Saving…' : 'Save check-in'}
          </button>
          {homeCheckInStatus && (
            <p
              role="status"
              className={`text-[11.5px] font-bold leading-relaxed text-center ${
                homeCheckInStatus.type === 'success' ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {homeCheckInStatus.message}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showMoodReminderCard && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mx-4 sm:mx-6 md:mx-8 mt-5"
          >
            <div className="hh-surface rounded-[28px] p-4 sm:p-5 border border-[#F4E7D8]/80 space-y-4 bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF4EA]">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">After your check-in</span>
                <h3 className="font-display font-black text-[#2B1D12] text-[18px] leading-tight">HopeHeart reminder for you today</h3>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">You don’t have to talk right now. Do one small thing that reminds you of yourself.</p>
                <p className="text-[12.5px] text-[#B95825] font-display font-black leading-relaxed">{getMoodReminderLine(currentMood)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {reminderActions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={item.action}
                    className="min-h-[104px] rounded-[22px] bg-white/80 hover:bg-[#FFF8F2] border border-orange-100/80 shadow-3xs p-3 text-left cursor-pointer transition-all active:scale-[0.98] flex flex-col gap-2"
                  >
                    <span className="text-[24px] leading-none">{item.icon}</span>
                    <span className="font-display font-black text-[#2B1D12] text-[12.5px] leading-tight">{item.title}</span>
                    <span className="text-[11px] text-gray-500 font-semibold leading-relaxed">{item.text}</span>
                  </button>
                ))}
              </div>

              {selectedReminderPanel && (
                <div className="rounded-[22px] bg-[#FFF8F2] border border-orange-100/80 p-3.5 text-left space-y-1.5">
                  <h4 className="font-display font-black text-[#2B1D12] text-[13.5px] leading-tight">{selectedReminderPanel.title}</h4>
                  <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">{selectedReminderPanel.message}</p>
                </div>
              )}

              <p className="text-[11px] text-gray-400 font-bold leading-relaxed text-center">HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calm lower Home cards */}
      <div className="max-w-4xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-24 sm:pb-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => onNavigateTo(ScreenId.MySpace)}
            type="button"
            className="hh-surface rounded-[24px] p-4 text-left transition-all cursor-pointer hover:bg-[#FFF8F2] space-y-2"
          >
            <div className="space-y-1">
              <h4 className="font-display font-black text-gray-800 text-[13.5px] leading-tight">Today’s gentle suggestion</h4>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">Write one line about what your heart needs today.</p>
            </div>
            <span className="text-[11px] font-display font-black text-[#C75414]">Open My Space →</span>
          </button>

          <button
            onClick={handleContinueLastPrivateSpace}
            type="button"
            className="hh-surface rounded-[24px] p-4 text-left transition-all cursor-pointer hover:bg-[#FFF8F2] space-y-2"
          >
            <div className="space-y-1">
              <h4 className="font-display font-black text-gray-800 text-[13.5px] leading-tight">Continue where you left off</h4>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">Return to your last private space when you’re ready.</p>
            </div>
            <span className="text-[11px] font-display font-black text-[#C75414]">Continue →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            onClick={() => onNavigateTo(ScreenId.MySpace)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[28px] text-left transition-all cursor-pointer space-y-3"
          >
            <span className="text-[28px] block">📝</span>
            <div className="space-y-1">
              <h4 className="font-display font-black text-gray-800 text-[15px] leading-tight">My Space</h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Write privately and keep your thoughts safe.</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => onNavigateTo(ScreenId.MySpace)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[28px] text-left transition-all cursor-pointer space-y-3"
          >
            <span className="text-[28px] block">🌸</span>
            <div className="space-y-1">
              <h4 className="font-display font-black text-gray-800 text-[15px] leading-tight">Memories</h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Save moments that remind you who you are.</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => onNavigateTo(ScreenId.Community)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[28px] text-left transition-all cursor-pointer space-y-3"
          >
            <span className="text-[28px] block">🤝</span>
            <div className="space-y-1">
              <h4 className="font-display font-black text-gray-800 text-[15px] leading-tight">Optional Community</h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Connect only when you feel ready.</p>
            </div>
          </motion.button>
        </div>

        <div className="mt-4 hh-surface rounded-[24px] p-4 border border-[#F1E7D8] bg-white/70 space-y-3">
          <div className="space-y-0.5">
            <h3 className="font-display font-black text-gray-800 text-[14px] leading-tight">Need help or information?</h3>
            <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">Support, safety, and privacy are always nearby.</p>
          </div>
          <div className="divide-y divide-orange-100/60">
            {[
              { icon: '🛟', title: 'Customer Support', text: 'Reach out if you need help using HopeHeart.', action: () => onNavigateTo(ScreenId.CustomerSupport) },
              { icon: '🛡️', title: 'Safety Guide', text: 'Know what HopeHeart can and cannot do.', action: () => onNavigateTo(ScreenId.AISafety) },
              { icon: '📚', title: 'Comfort Resources', text: 'Read gentle support when you feel ready.', action: () => onNavigateTo(ScreenId.DoctorSuggestions) },
              { icon: '🔒', title: 'Privacy & Data Protection', text: 'Manage your privacy and data choices.', action: () => onNavigateTo(ScreenId.PrivacySettings) }
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                className="w-full py-3 flex items-center gap-3 text-left cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-[#FFF8F2] border border-orange-100 flex items-center justify-center text-[15px] shrink-0">{item.icon}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display font-black text-gray-800 text-[12.5px] leading-tight">{item.title}</span>
                  <span className="block text-[11px] text-gray-500 font-semibold leading-relaxed">{item.text}</span>
                </span>
                <span className="text-[14px] text-gray-300 group-hover:text-[#FF7527] transition-colors">→</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onNavigateTo(ScreenId.AISafety)}
          type="button"
          className="mt-4 w-full py-3 bg-white/60 hover:bg-[#FFF8F2] border border-orange-100/70 rounded-2xl text-[12px] font-display font-black text-[#B95825] cursor-pointer transition-all"
        >
          🛡️ Safety is always available
        </button>

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
