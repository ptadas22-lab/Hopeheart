import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MoodConfig, ScreenId } from '../types';
import { MascotFace } from './Logo';
import { saveHomeMoodCheckIn } from '../services/homeCheckins';
import { getOrComputeNextAction, completeAction, skipAction, loadMayaDailyState } from '../services/maya/mayaAgent';

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

const SUPPORTIVE_MESSAGES = [
  "You're safe here.",
  "One small step is enough today.",
  "You don't need to have everything figured out.",
  "Thank you for checking in.",
  "Let's be gentle with ourselves today.",
  "Breathe. You're already doing something kind for yourself."
];

function getDailySupportiveMessage(): string {
  try {
    const todayStr = new Date().toDateString();
    const storedDate = localStorage.getItem('hopeheart_support_message_date');
    const storedMsg = localStorage.getItem('hopeheart_support_message');

    if (storedDate === todayStr && storedMsg && SUPPORTIVE_MESSAGES.includes(storedMsg)) {
      return storedMsg;
    }

    const randomIndex = Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length);
    const selectedMsg = SUPPORTIVE_MESSAGES[randomIndex];

    localStorage.setItem('hopeheart_support_message_date', todayStr);
    localStorage.setItem('hopeheart_support_message', selectedMsg);

    return selectedMsg;
  } catch (e) {
    const day = new Date().getDate();
    return SUPPORTIVE_MESSAGES[day % SUPPORTIVE_MESSAGES.length];
  }
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Calm' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😔', label: 'Low' },
  { emoji: '😟', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Overwhelmed' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Frustrated' },
  { emoji: '😶', label: 'Numb' },
  { emoji: '❤️', label: 'Hopeful' }
];

const SUPPORTIVE_CAPTIONS: Record<string, string> = {
  Calm: "It's good to notice peaceful moments.",
  Peaceful: "It's good to notice peaceful moments.",
  Okay: "It is okay to have quiet, ordinary days.",
  Low: "Thank you for checking in.",
  Anxious: "You're not alone in this feeling.",
  Tired: "Rest is an important part of healing.",
  Overwhelmed: "Take things one small breath at a time.",
  Sad: "Your feelings are valid and allowed to be here.",
  Frustrated: "It's okay to feel upset. Be gentle with yourself.",
  Numb: "No pressure to feel anything else right now.",
  Hopeful: "Hold onto this feeling."
};

interface SupportCardConfig {
  title: string;
  message: string;
  primaryButton: {
    label: string;
    action: (onNavigateTo: (screenId: string) => void, onClose: () => void) => void;
  };
  secondaryButton?: {
    label: string;
    action: (onNavigateTo: (screenId: string) => void, onClose: () => void) => void;
  };
  emoji: string;
}

const SUPPORT_CARDS_DATA: Record<string, SupportCardConfig> = {
  Calm: {
    emoji: '😊',
    title: "You're doing well today 🌼",
    message: "Take a moment to appreciate this peaceful feeling. Small moments of calm matter.",
    primaryButton: {
      label: "Continue",
      action: (_, onClose) => onClose()
    }
  },
  Peaceful: {
    emoji: '😌',
    title: "Peace is worth protecting 🌿",
    message: "You deserve moments like this. Carry this feeling with you today.",
    primaryButton: {
      label: "Continue",
      action: (_, onClose) => onClose()
    }
  },
  Okay: {
    emoji: '🙂',
    title: "One step at a time 💛",
    message: "Not every day needs to be extraordinary. Showing up is enough.",
    primaryButton: {
      label: "Continue",
      action: (_, onClose) => onClose()
    }
  },
  Low: {
    emoji: '😔',
    title: "Thank you for checking in 🌱",
    message: "Would writing one small thought help you today?",
    primaryButton: {
      label: "Write Journal",
      action: (onNavigateTo, onClose) => {
        onNavigateTo(ScreenId.MySpace);
        onClose();
      }
    },
    secondaryButton: {
      label: "Maybe Later",
      action: (_, onClose) => onClose()
    }
  },
  Anxious: {
    emoji: '😟',
    title: "Let's slow down together 🌬",
    message: "Would a two-minute breathing exercise help?",
    primaryButton: {
      label: "Start Breathing",
      action: (onNavigateTo, onClose) => {
        onNavigateTo(ScreenId.FeelGood);
        onClose();
      }
    },
    secondaryButton: {
      label: "Skip",
      action: (_, onClose) => onClose()
    }
  },
  Tired: {
    emoji: '😴',
    title: "Rest is productive too ☁️",
    message: "Your body and mind deserve kindness.",
    primaryButton: {
      label: "Take a Break",
      action: (onNavigateTo, onClose) => {
        onNavigateTo(ScreenId.FeelGood);
        onClose();
      }
    },
    secondaryButton: {
      label: "Maybe Later",
      action: (_, onClose) => onClose()
    }
  },
  Overwhelmed: {
    emoji: '😤',
    title: "You don't have to carry everything alone 🤍",
    message: "Focus on just one small thing right now.",
    primaryButton: {
      label: "Grounding Exercise",
      action: (onNavigateTo, onClose) => {
        onNavigateTo(ScreenId.FeelGood);
        onClose();
      }
    },
    secondaryButton: {
      label: "Later",
      action: (_, onClose) => onClose()
    }
  },
  Sad: {
    emoji: '😢',
    title: "You're not alone 💛",
    message: "It's okay to feel this way.",
    primaryButton: {
      label: "Comfort Resources",
      action: (onNavigateTo, onClose) => {
        onNavigateTo(ScreenId.DoctorSuggestions);
        onClose();
      }
    },
    secondaryButton: {
      label: "Later",
      action: (_, onClose) => onClose()
    }
  },
  Frustrated: {
    emoji: '😠',
    title: "Take one slow breath 🌿",
    message: "Strong feelings will pass.",
    primaryButton: {
      label: "Breathing Exercise",
      action: (onNavigateTo, onClose) => {
        onNavigateTo(ScreenId.FeelGood);
        onClose();
      }
    },
    secondaryButton: {
      label: "Later",
      action: (_, onClose) => onClose()
    }
  },
  Numb: {
    emoji: '😶',
    title: "Thank you for being here 🌼",
    message: "Sometimes simply checking in is enough.",
    primaryButton: {
      label: "Gentle Reflection",
      action: (onNavigateTo, onClose) => {
        onNavigateTo(ScreenId.MySpace);
        onClose();
      }
    },
    secondaryButton: {
      label: "Later",
      action: (_, onClose) => onClose()
    }
  },
  Hopeful: {
    emoji: '❤️',
    title: "Hold onto this feeling ✨",
    message: "Hope grows stronger when we notice it.",
    primaryButton: {
      label: "Continue",
      action: (_, onClose) => onClose()
    }
  }
};

interface SupportJourneyCardProps {
  mood: string;
  onClose: () => void;
  onNavigateTo: (screenId: string) => void;
}

function SupportJourneyCard({ mood, onClose, onNavigateTo }: SupportJourneyCardProps) {
  const config = SUPPORT_CARDS_DATA[mood];
  if (!config) return null;

  return (
    <div className="journey-card-animate flex flex-col items-center text-center space-y-4 p-5 rounded-[28px] bg-gradient-to-br from-[#FFFDF9] to-[#FFF3EA] border border-[#F4E7D8]/80 shadow-3xs relative overflow-hidden w-full">
      <style>
        {`
          @keyframes journeyFadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .journey-card-animate {
            animation: journeyFadeIn 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .btn-hover-scale {
            transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), 
                        box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), 
                        background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
          }
          .btn-hover-scale:hover {
            transform: translateY(-1.5px);
          }
          .btn-hover-scale:active {
            transform: scale(0.97);
          }
          @media (prefers-reduced-motion: reduce) {
            .journey-card-animate {
              animation: none !important;
              transform: none !important;
            }
            .btn-hover-scale {
              transition: none !important;
              transform: none !important;
            }
          }
        `}
      </style>
      {/* Background soft glowing blur */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-100/40 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-rose-100/40 rounded-full blur-xl pointer-events-none" />

      {/* Close button at top corner */}
      <button
        onClick={onClose}
        type="button"
        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/80 border border-gray-150 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center text-[10px] font-black cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7527]"
        aria-label="Close support card"
      >
        ✕
      </button>

      {/* Emoji bubble */}
      <div className="w-14 h-14 rounded-full bg-white border border-[#F1E7D8] flex items-center justify-center text-[28px] shadow-3xs select-none">
        {config.emoji}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="font-display font-black text-[#2B1D12] text-[17px] leading-snug">
          {config.title}
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          {config.message}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-xs pt-1">
        {config.secondaryButton && (
          <button
            onClick={() => config.secondaryButton!.action(onNavigateTo, onClose)}
            type="button"
            className="w-full sm:w-auto flex-1 px-4 py-2 bg-white/80 hover:bg-white border border-[#F6CBB0] text-[#B95825] rounded-xl text-[12px] font-display font-black cursor-pointer btn-hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7527]"
          >
            {config.secondaryButton.label}
          </button>
        )}
        <button
          onClick={() => config.primaryButton.action(onNavigateTo, onClose)}
          type="button"
          className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12px] font-display font-black cursor-pointer btn-hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-3xs"
        >
          {config.primaryButton.label}
        </button>
      </div>
    </div>
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
  const [currentMood, setCurrentMood] = useState<string>("");
  const [isSavingHomeCheckIn, setIsSavingHomeCheckIn] = useState(false);
  const [homeCheckInStatus, setHomeCheckInStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showShortcutSheet, setShowShortcutSheet] = useState(false);

  const [mayaAction, setMayaAction] = useState<any>(null);
  const [mayaState, setMayaState] = useState<any>(null);
  const [completionFeedback, setCompletionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const nextAct = getOrComputeNextAction();
    const st = loadMayaDailyState();
    setMayaAction(nextAct);
    setMayaState(st);
  }, [selectedMood]);

  const handleCompleteMayaAction = (id: string) => {
    const nextAct = completeAction(id);
    const st = loadMayaDailyState();
    
    const feedbacks = [
      "Nice. One small step done. 🌱",
      "Good job taking a moment for yourself.",
      "That's enough for now. I'll help you with the next step later."
    ];
    const randMsg = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    setCompletionFeedback(randMsg);
    setMayaState(st);
    
    setTimeout(() => {
      setCompletionFeedback(null);
      setMayaAction(nextAct);
    }, 3000);
  };

  const handleSkipMayaAction = (id: string) => {
    const nextAct = skipAction(id);
    const st = loadMayaDailyState();
    setMayaAction(nextAct);
    setMayaState(st);
  };
  const [showMoodReminderCard, setShowMoodReminderCard] = useState(hasCheckedInToday);
  const [selectedReminderPanel, setSelectedReminderPanel] = useState<{ title: string; message: string } | null>(null);
  const [dailyMessage] = useState(getDailySupportiveMessage);
  const isFirstRender = useRef(true);
  const [savedMoodSupport, setSavedMoodSupport] = useState<string | null>(null);

  const getGreetingName = () => {
    if (!userName) return 'Friend';
    const trimmed = userName.trim();
    if (!trimmed) return 'Friend';
    const lower = trimmed.toLowerCase();
    if (lower === 'companion' || lower === 'voice47' || lower === 'googlebuddy') {
      return 'Friend';
    }
    return trimmed;
  };
  const greetingName = getGreetingName();

  const getHomeMoodLabel = (moodId: string) => {
    return moodId || 'Calm';
  };

  const getMoodReminderLine = (moodId: string) => {
    const lower = moodId.toLowerCase();
    if (lower === 'anxious') return 'First, help your body feel a little safer.';
    if (lower === 'sad' || lower === 'low') return 'Start with one small thing that still feels like you.';
    if (lower === 'tired') return 'Choose something easy. Rest counts too.';
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
    setSavedMoodSupport(currentMood);
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const map: Record<string, string> = {
      calm: 'Calm',
      peaceful: 'Peaceful',
      okay: 'Okay',
      low: 'Low',
      sad: 'Sad',
      anxious: 'Anxious',
      tired: 'Tired',
      overwhelmed: 'Overwhelmed',
      frustrated: 'Frustrated',
      numb: 'Numb',
      hopeful: 'Hopeful'
    };
    const mapped = map[selectedMood.id.toLowerCase()];
    if (mapped) {
      setCurrentMood(mapped);
    }
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
            <h2 className="font-display font-black text-[#2B1D12] text-[15px] leading-tight">Hi, {greetingName} 🌼</h2>
            <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">{dailyMessage}</p>
          </div>
        </div>
      </div>

      {/* Maya Wellness Agent Card */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-5">
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF8F2] to-[#FFF0E8] border border-orange-100 rounded-[28px] p-5 shadow-3xs relative select-none">
          <div className="flex items-center justify-between pb-3.5 border-b border-orange-100/50">
            <div className="flex items-center gap-2">
              <span className="text-lg font-display font-black text-[#2B1D12]">Maya 🌱</span>
              <span className="bg-orange-100 text-[#FF7527] text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold">
                Wellness Agent
              </span>
            </div>
            {mayaState && (
              <span className="text-[11px] font-mono font-extrabold text-gray-500 uppercase tracking-wider">
                {mayaState.completedActionIds.length} of 4 today
              </span>
            )}
          </div>

          {completionFeedback ? (
            <div className="py-6 text-center space-y-2 animate-in fade-in duration-300">
              <span className="text-[32px] block">🎉</span>
              <p className="text-[14px] text-gray-700 font-bold text-center">
                {completionFeedback}
              </p>
            </div>
          ) : mayaAction ? (
            <div className="pt-4 space-y-4">
              <p className="text-[12.5px] text-gray-500 font-semibold italic">
                "Here's your next small step."
              </p>
              
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-2xl bg-white border border-[#F1E7D8] flex items-center justify-center text-[24px] shrink-0 shadow-3xs">
                  {mayaAction.type === 'challenge' && '🥣'}
                  {mayaAction.type === 'break_timer' && '☕'}
                  {mayaAction.type === 'calm_sounds' && '🎵'}
                  {mayaAction.type === 'article' && '📚'}
                  {mayaAction.type === 'sleep' && '🌙'}
                  {mayaAction.type === 'breathing' && '🌬️'}
                  {mayaAction.type === 'community' && '🤝'}
                  {mayaAction.type === 'rest' && '🛌'}
                </span>
                <div className="space-y-1 flex-1">
                  <h4 className="font-display font-black text-[#2B1D12] text-[15px] leading-tight">
                    {mayaAction.title}
                  </h4>
                  <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                    {mayaAction.description}
                  </p>
                  <p className="text-[11px] text-[#A05412] font-semibold leading-relaxed pt-1">
                    Why: {mayaAction.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    let targetScreen = mayaAction.type === 'challenge' || mayaAction.type === 'article' || mayaAction.type === 'sleep'
                      ? ScreenId.DoctorSuggestions
                      : mayaAction.type === 'community'
                        ? ScreenId.Community
                        : ScreenId.FeelGood;
                    onNavigateTo(targetScreen);
                  }}
                  type="button"
                  className="flex-1 py-2 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
                >
                  Start
                </button>
                <button
                  onClick={() => handleCompleteMayaAction(mayaAction.id)}
                  type="button"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
                >
                  Done
                </button>
                <button
                  onClick={() => handleSkipMayaAction(mayaAction.id)}
                  type="button"
                  className="py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
                >
                  Not now
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4 text-[13px] font-semibold">
              Maya is loading your path...
            </p>
          )}
        </div>
      </div>

      {/* Main soft mood card */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-5">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FFFDF9] via-[#FFF3EA] to-[#FFEAF3] border border-orange-100/70 shadow-3xs px-5 py-6 sm:px-7 sm:py-7 text-center">
          <div className="absolute -top-14 -right-12 w-36 h-36 bg-[#FFB98A]/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-[#F8C8DC]/25 rounded-full blur-2xl" />
          <div className="relative space-y-4 max-w-xl mx-auto">
            <div className="space-y-2">
              <div className="relative w-28 h-20 mx-auto mb-2 shrink-0">
                <svg className="w-full h-full select-none" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#FFF4D4" />
                      <stop offset="50%" stopColor="#FFB072" />
                      <stop offset="100%" stopColor="#FF7B54" />
                    </radialGradient>
                    <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFE0C2" stopOpacity="0.6" />
                      <stop offset="60%" stopColor="#FFD2AC" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#FFFDF9" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heart-glow-grad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF8B8B" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FF8B8B" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="cloud-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#FFF0E5" />
                    </linearGradient>
                    <linearGradient id="cloud-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#FFEAEA" />
                    </linearGradient>
                  </defs>
                  <style>
                    {`
                      .sunrise-group {
                        transform-origin: 60px 52px;
                        animation: breathe 4.5s ease-in-out infinite;
                      }
                      .heart-glow {
                        transform-origin: 60px 42px;
                        animation: heartPulse 4.5s ease-in-out infinite;
                      }
                      .cloud-l {
                        transform-origin: 32px 50px;
                        animation: floatL 7s ease-in-out infinite;
                      }
                      .cloud-r {
                        transform-origin: 88px 46px;
                        animation: floatR 8s ease-in-out infinite;
                      }
                      @keyframes breathe {
                        0%, 100% {
                          transform: scale(0.96);
                        }
                        50% {
                          transform: scale(1.04);
                        }
                      }
                      @keyframes heartPulse {
                        0%, 100% {
                          transform: scale(0.9);
                          opacity: 0.4;
                        }
                        50% {
                          transform: scale(1.25);
                          opacity: 0.95;
                        }
                      }
                      @keyframes floatL {
                        0%, 100% {
                          transform: translate(0px, 0px);
                        }
                        50% {
                          transform: translate(-3px, -1px);
                        }
                      }
                      @keyframes floatR {
                        0%, 100% {
                          transform: translate(0px, 0px);
                        }
                        50% {
                          transform: translate(3px, 1.5px);
                        }
                      }
                      @media (prefers-reduced-motion: reduce) {
                        .sunrise-group, .heart-glow, .cloud-l, .cloud-r {
                          animation: none !important;
                          transform: none !important;
                        }
                      }
                    `}
                  </style>
                  <circle className="sunrise-group" cx="60" cy="52" r="30" fill="url(#sun-glow)" />
                  <circle className="sunrise-group" cx="60" cy="52" r="18" fill="url(#sun-gradient)" />
                  <circle className="heart-glow" cx="60" cy="42" r="10" fill="url(#heart-glow-grad)" />
                  <path className="sunrise-group" d="M60 47.5 C 58.2 45.2, 55.5 45.2, 55.5 42.5 C 55.5 40.2, 58.0 40.2, 60 42.0 C 62.0 40.2, 64.5 40.2, 64.5 42.5 C 64.5 45.2, 61.8 45.2, 60 47.5 Z" fill="#FF5E5B" />
                  <path className="cloud-l" d="M 20,54 h 22 a 5,5 0 0,0 4.5,-7 a 6,6 0 0,0 -10.5,-3 a 5,5 0 0,0 -8,-1 a 5,5 0 0,0 -4,5 a 4,4 0 0,0 -4,6 Z" fill="url(#cloud-grad-left)" opacity="0.95" />
                  <path className="cloud-r" d="M 76,50 h 18 a 4,4 0 0,0 3.6,-5.6 a 5,5 0 0,0 -8.8,-2.4 a 4,4 0 0,0 -6.4,-0.8 a 4,4 0 0,0 -3.2,4 a 3.2,3.2 0 0,0 -3.2,4.8 Z" fill="url(#cloud-grad-right)" opacity="0.9" />
                </svg>
              </div>
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
        {savedMoodSupport ? (
          <SupportJourneyCard 
            mood={savedMoodSupport} 
            onClose={() => {
              setSavedMoodSupport(null);
              setCurrentMood("");
            }} 
            onNavigateTo={onNavigateTo}
          />
        ) : (
          <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-3 border border-[#F4E7D8]/80">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Private mood check-in</span>
                <h3 className="font-display font-black text-gray-800 text-[15px] leading-tight">Choose the closest feeling.</h3>
              </div>
              <span className="text-[12px] text-gray-400 font-bold">Private to you</span>
            </div>
            <style>
              {`
                .mood-button {
                  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                              box-shadow 180ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                              border-color 180ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                              background-color 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .mood-button:active {
                  transform: scale(0.95);
                }
                .mood-button-selected {
                  transform: scale(1.06);
                  box-shadow: 0 4px 14px rgba(249, 115, 22, 0.18);
                }
                @media (prefers-reduced-motion: reduce) {
                  .mood-button {
                    transition: none !important;
                    transform: none !important;
                  }
                  .mood-button-selected {
                    transform: none !important;
                    box-shadow: none !important;
                  }
                }
              `}
            </style>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = currentMood === mood.label;
                return (
                  <button
                    key={mood.label}
                    onClick={() => {
                      setCurrentMood(mood.label);
                      setHomeCheckInStatus(null);
                      setShowMoodReminderCard(false);
                      setSelectedReminderPanel(null);
                    }}
                    type="button"
                    aria-pressed={isSelected}
                    className={`py-3 px-2 border rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer mood-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7527] focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'border-[#FF7527] bg-[#FFF2EA] text-[#FF7527] font-bold mood-button-selected'
                        : 'border-[#F1E7D8] bg-[#FFFDF9] text-gray-600 hover:border-orange-200 hover:bg-[#FFFDF9]/80'
                    }`}
                  >
                    <span className="text-[24px] filter drop-shadow-sm select-none" role="img" aria-label={mood.label}>{mood.emoji}</span>
                    <span className="text-[11px] font-display font-black tracking-tight">{mood.label}</span>
                  </button>
                );
              })}
            </div>
            {currentMood && SUPPORTIVE_CAPTIONS[currentMood] && (
              <div className="py-1 text-center transition-all duration-200">
                <p className="text-[12.5px] text-[#B95825] font-semibold italic">
                  "{SUPPORTIVE_CAPTIONS[currentMood]}"
                </p>
              </div>
            )}
            <button
              onClick={handleSaveHomeCheckIn}
              type="button"
              disabled={!currentMood || isSavingHomeCheckIn}
              className="w-full py-2.5 bg-[#2B1D12] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
        )}
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
              { icon: '🌉', title: 'CareBridge Circle', text: 'Connect trusted people privately to your journey.', action: () => onNavigateTo(ScreenId.CareBridge) },
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
