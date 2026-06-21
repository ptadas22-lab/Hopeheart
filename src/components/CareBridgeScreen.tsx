import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorQuestion } from '../types';

interface CareBridgeScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: string) => void;
  savedQuestions: DoctorQuestion[];
  onAddQuestion: (text: string) => void;
  onDeleteQuestion: (id: string) => void;
}

type SubScreen = 'suggestions' | 'questions';

interface SupportCategory {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  bestFor: string[];
  availableSupport: {
    title: string;
    description: string;
    actionText: string;
    targetPath: string;
    illustration: 'breathing' | 'circle' | 'watering' | 'cane' | 'lantern';
  }[];
  externalResources: {
    name: string;
    description: string;
    link: string;
    badge: string;
    boundary: string;
    mode: string;
    illustration: 'breathing' | 'circle' | 'watering' | 'cane' | 'lantern';
  }[];
}

const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: 'anxiety',
    name: 'Anxiety',
    emoji: '🧠',
    tagline: 'Manage racing thoughts, stress, and anxiety in safe peer spaces.',
    bestFor: ['Overthinking', 'Panic', 'Social anxiety', 'Stress management'],
    availableSupport: [
      {
        title: '🤝 Anxiety Peer Listeners',
        description: 'Talk 1-on-1 with volunteers who listen without judgment and help you slow down.',
        actionText: 'Find Listener →',
        targetPath: 'safe-listener',
        illustration: 'breathing'
      },
      {
        title: '🎪 Anxiety Support Circles',
        description: 'Join group chat rooms centered on stress and overthinking support.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'circle'
      },
      {
        title: '🧡 HopeBuddy Grounding',
        description: 'Open HopeBuddy to do a quick 4-second breathing pause exercise.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home',
        illustration: 'watering'
      }
    ],
    externalResources: [
      {
        name: 'Crisis Text Line',
        description: 'Free, 24/7 confidential text support for panic and anxiety. Text HOME to 741741.',
        link: 'https://www.crisistextline.org',
        badge: 'Immediate Help',
        boundary: 'External Helpline • 100% Free',
        mode: 'Text Support',
        illustration: 'breathing'
      },
      {
        name: 'BetterHelp Therapy',
        description: 'Matches you with licensed professional counselors specializing in anxiety.',
        link: 'https://www.betterhelp.com',
        badge: 'Professional Therapy',
        boundary: 'External Resource • Paid Directory',
        mode: 'Online Therapy',
        illustration: 'breathing'
      },
      {
        name: 'NAMI Anxiety Guide',
        description: 'Educational resources, guides on panic attacks, and family help guides.',
        link: 'https://www.nami.org',
        badge: 'Resource Finder',
        boundary: 'External Directory • Free Info',
        mode: 'Directories & Guides',
        illustration: 'circle'
      }
    ]
  },
  {
    id: 'parkinsons',
    name: "Living with Parkinson's",
    emoji: '🧓',
    tagline: 'Emotional comfort and caregiver support for movement challenges.',
    bestFor: ['Daily emotional support', 'Caregiver support', 'Movement challenges'],
    availableSupport: [
      {
        title: '🤝 Caregiver Listeners',
        description: 'Connect with understanding peers who know the daily path of caregiver support.',
        actionText: 'Find Listener →',
        targetPath: 'safe-listener',
        illustration: 'cane'
      },
      {
        title: '🎪 Parkinson\'s Circles',
        description: 'Join rooms where families share somatic tremor tips and emotional wins.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'circle'
      },
      {
        title: '🧡 HopeBuddy Pacing',
        description: 'Check in on daily energy pacing levels with your companion.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home',
        illustration: 'watering'
      }
    ],
    externalResources: [
      {
        name: "Parkinson's Foundation Line",
        description: 'Call 1-800-4PD-INFO for free resources, clinical directory finders, and local guidance.',
        link: 'https://www.parkinson.org',
        badge: 'National Helpline',
        boundary: 'External Helpline • 100% Free',
        mode: 'Phone Support',
        illustration: 'cane'
      },
      {
        name: 'Family Caregiver Alliance',
        description: 'Offers caregiver checklists, online classes, and regional advocacy groups.',
        link: 'https://www.caregiver.org',
        badge: 'Caregiver Support',
        boundary: 'External Directory • Free Help',
        mode: 'Toolkits & Groups',
        illustration: 'circle'
      },
      {
        name: 'Davis Phinney Foundation',
        description: 'Resources and tools focused on living active, healthy daily lives with Parkinson\'s.',
        link: 'https://www.davisphinneyfoundation.org',
        badge: 'Living Tools',
        boundary: 'External Resource • Free Info',
        mode: 'Action Guides',
        illustration: 'cane'
      }
    ]
  },
  {
    id: 'hallucinations',
    name: 'Hallucinations',
    emoji: '👀',
    tagline: 'Non-judgmental grounding, confusion assistance, and safety tips.',
    bestFor: ['Visual hallucinations', 'Confusion', 'Fear management', 'Caregiver awareness'],
    availableSupport: [
      {
        title: '🤝 Grounding Companions',
        description: 'Talk to peer volunteers trained in quiet reality validation and soothing presence.',
        actionText: 'Find Listener →',
        targetPath: 'safe-listener',
        illustration: 'lantern'
      },
      {
        title: '🎪 Quiet Sharing Circles',
        description: 'Slow-paced rooms for talking through confusion, visual shifts, or fears.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'circle'
      },
      {
        title: '🧡 HopeBuddy Reassurance',
        description: 'Interactive reality-grounding scripts when feeling confused or disoriented.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home',
        illustration: 'watering'
      }
    ],
    externalResources: [
      {
        name: 'Lewy Body Dementia Line',
        description: 'Call 800-539-9767 for specialized counseling on hallucinations and confusion.',
        link: 'https://www.lbda.org',
        badge: 'Support Line',
        boundary: 'External Support • Free Info',
        mode: 'Helpline Call',
        illustration: 'lantern'
      },
      {
        name: 'Mental Health America Guide',
        description: 'Resource guides explaining visual hallucinations and sensory shifts.',
        link: 'https://www.mhanational.org',
        badge: 'Guides & Articles',
        boundary: 'External Resource • Free Info',
        mode: 'Educational Guides',
        illustration: 'lantern'
      },
      {
        name: 'Geriatric Psychiatry Finder',
        description: 'Search directory for licensed medical professionals in cognitive changes.',
        link: 'https://www.psychologytoday.com',
        badge: 'Specialist Finder',
        boundary: 'External Directory • Insurance',
        mode: 'Medical Directory',
        illustration: 'lantern'
      }
    ]
  },
  {
    id: 'emotional-recovery',
    name: 'Emotional Recovery',
    emoji: '🌱',
    tagline: 'Rebuild after burnout, grief, loneliness, and life transitions.',
    bestFor: ['Loneliness', 'Burnout', 'Grief and life changes'],
    availableSupport: [
      {
        title: '🤝 Grief Support Listeners',
        description: 'Connect with listeners who hold a gentle, comforting space for grief.',
        actionText: 'Find Listener →',
        targetPath: 'safe-listener',
        illustration: 'breathing'
      },
      {
        title: '🎪 Burnout & Loss Circles',
        description: 'Weekly sharing circles for mutual recovery during life transitions.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'circle'
      },
      {
        title: '🧡 HopeBuddy Rest Check',
        description: 'Empathetic guidance that celebrates tiny wins and self-care recovery checks.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home',
        illustration: 'watering'
      }
    ],
    externalResources: [
      {
        name: 'GriefShare Network',
        description: 'Search directory for local recovery groups facilitated by professionals.',
        link: 'https://www.griefshare.org',
        badge: 'Recovery Directory',
        boundary: 'External Registry • Search Free',
        mode: 'Local Groups',
        illustration: 'circle'
      },
      {
        name: 'Burnout Recovery Guide',
        description: 'Self-assessments, stress reduction worksheets, and counselor directories.',
        link: 'https://www.mhanational.org',
        badge: 'Burnout Info',
        boundary: 'External Resource • Free Guides',
        mode: 'Worksheets & Tips',
        illustration: 'watering'
      },
      {
        name: 'Crisis Response Line',
        description: 'Text HOME to 741741 to instantly talk about heavy burnout or grief.',
        link: 'https://www.crisistextline.org',
        badge: '24/7 Helpline',
        boundary: 'External Helpline • 100% Free',
        mode: 'Text / Call Line',
        illustration: 'breathing'
      }
    ]
  }
];

interface Situation {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  catId: string;
  recommendations: { text: string; target: string }[];
}

const SITUATIONS: Situation[] = [
  { 
    id: 'overthinking', 
    label: 'Overthinking', 
    emoji: '😰', 
    desc: 'Racing thoughts, worry, or stress.',
    catId: 'anxiety',
    recommendations: [
      { text: '🤝 Talk to a calm listener', target: 'safe-listener' },
      { text: '🧘 Try a grounding exercise', target: 'home' },
      { text: '🌍 Explore anxiety resources', target: 'doctor-suggestions' }
    ]
  },
  { 
    id: 'lonely', 
    label: 'Feeling Lonely', 
    emoji: '🥺', 
    desc: 'You want someone safe to talk to.',
    catId: 'emotional-recovery',
    recommendations: [
      { text: '🤝 Talk to a warm listener', target: 'safe-listener' },
      { text: '🎪 Join a community room', target: 'support-rooms' },
      { text: '🌍 Explore recovery resources', target: 'doctor-suggestions' }
    ]
  },
  { 
    id: 'exhausted', 
    label: 'Feeling Exhausted', 
    emoji: '😴', 
    desc: 'Low energy, burnout, or emotional tiredness.',
    catId: 'emotional-recovery',
    recommendations: [
      { text: '🤝 Talk to a patient listener', target: 'safe-listener' },
      { text: '🧘 Take a slow pause', target: 'home' },
      { text: '🌍 Explore burnout tips', target: 'doctor-suggestions' }
    ]
  },
  { 
    id: 'parkinsons', 
    label: "Living with Parkinson's", 
    emoji: '🧓', 
    desc: 'Emotional support for daily challenges.',
    catId: 'parkinsons',
    recommendations: [
      { text: '🤝 Join Parkinson’s support circle', target: 'support-rooms' },
      { text: '👨‍👩‍👧 Caregiver resources', target: 'doctor-suggestions' },
      { text: '🌍 External support guides', target: 'doctor-suggestions' }
    ]
  },
  { 
    id: 'supporting-someone', 
    label: 'Supporting Someone', 
    emoji: '👨‍👩‍👧', 
    desc: 'Caregiver stress, worry, or responsibility.',
    catId: 'parkinsons',
    recommendations: [
      { text: '🤝 Talk to a caregiver listener', target: 'safe-listener' },
      { text: '🎪 Join caregiver support circle', target: 'support-rooms' },
      { text: '🌍 Explore caregiver toolkits', target: 'doctor-suggestions' }
    ]
  },
  { 
    id: 'confusing', 
    label: 'Confusing Experiences', 
    emoji: '👀', 
    desc: 'Seeing, hearing, or sensing things that feel hard to explain.',
    catId: 'hallucinations',
    recommendations: [
      { text: '🤝 Find a patient listener', target: 'safe-listener' },
      { text: '🛡️ Safety guidance', target: 'ai-safety' },
      { text: '🌍 External resources', target: 'doctor-suggestions' }
    ]
  },
  { 
    id: 'hurt', 
    label: 'Feeling Hurt', 
    emoji: '💔', 
    desc: 'Difficult emotions, rejection, grief, or pain.',
    catId: 'emotional-recovery',
    recommendations: [
      { text: '🤝 Connect with an empathetic listener', target: 'safe-listener' },
      { text: '🎪 Find a recovery circle', target: 'support-rooms' },
      { text: '🌍 Explore grief guides', target: 'doctor-suggestions' }
    ]
  },
  { 
    id: 'support-general', 
    label: 'I just want support', 
    emoji: '🌱', 
    desc: 'Not sure what to choose, but I want a safe space.',
    catId: 'emotional-recovery',
    recommendations: [
      { text: '🤝 Start an anonymous chat', target: 'safe-listener' },
      { text: '🎪 Join a supportive room', target: 'support-rooms' },
      { text: '🌍 Explore emotional resources', target: 'doctor-suggestions' }
    ]
  }
];

// Helper: 5 situations for small Card illustrations
function CardIllustration({ type }: { type: 'breathing' | 'circle' | 'watering' | 'cane' | 'lantern' }) {
  const isBreathing = type === 'breathing';
  const isCircle = type === 'circle';
  const isWatering = type === 'watering';
  const isCane = type === 'cane';
  const isLantern = type === 'lantern';

  return (
    <div className="w-24 flex flex-col items-center justify-center select-none text-center">
      <div className="w-20 h-16 flex items-center justify-center relative overflow-visible">
        {/* Breathing Illustration */}
        {isBreathing && (
          <svg width="60" height="50" viewBox="0 0 120 100" className="overflow-visible">
            <motion.circle 
              cx="60" cy="50" r="32" 
              fill="none" stroke="#FF7527" strokeWidth="2.5" opacity="0.3"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <motion.g
              animate={{ scale: [0.94, 1.04, 0.94], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ transformOrigin: "60px 85px" }}
            >
              {/* Ears */}
              <path d="M 33 22 C 30 10, 48 10, 52 20 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="2.5" />
              <path d="M 87 22 C 90 10, 72 10, 68 20 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="2.5" />
              {/* Body */}
              <rect x="20" y="20" width="80" height="66" rx="28" fill="#ffa552" stroke="#2B1D12" strokeWidth="3" />
              <rect x="22" y="22" width="76" height="62" rx="26" fill="#ffa552" />
              {/* Peaceful Eyes */}
              <path d="M 38 48 Q 43 44 48 48" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 72 48 Q 77 44 82 48" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
              {/* Smile */}
              <path d="M 55 58 Q 60 60 65 58" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
          </svg>
        )}

        {/* 3 Buddies Sitting Circle */}
        {isCircle && (
          <svg width="74" height="50" viewBox="0 0 140 100" className="overflow-visible">
            <motion.g
              animate={{ rotate: [-1.5, 1.5, -1.5] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              style={{ transformOrigin: "70px 85px" }}
            >
              {/* Left Buddy */}
              <g transform="translate(10, 25) scale(0.8)">
                <rect x="15" y="15" width="45" height="55" rx="16" fill="#dddbd0" stroke="#2B1D12" strokeWidth="2.8" />
                <rect x="17" y="17" width="41" height="51" rx="14" fill="#dddbd0" />
                <path d="M 28 38 Q 32 35 36 38" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
                <path d="M 46 38 Q 50 35 54 38" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
              </g>
              {/* Right Buddy */}
              <g transform="translate(75, 25) scale(0.8)">
                <rect x="15" y="15" width="45" height="55" rx="16" fill="#ffe3d1" stroke="#2B1D12" strokeWidth="2.8" />
                <rect x="17" y="17" width="41" height="51" rx="14" fill="#ffe3d1" />
                <path d="M 28 38 Q 32 35 36 38" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
                <path d="M 46 38 Q 50 35 54 38" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
              </g>
              {/* Center Main Buddy */}
              <g transform="translate(45, 15)">
                <rect x="15" y="15" width="50" height="60" rx="18" fill="#ffa552" stroke="#2B1D12" strokeWidth="3" />
                <rect x="17" y="17" width="46" height="56" rx="16" fill="#ffa552" />
                <path d="M 28 38 Q 32 35 36 38" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 48 38 Q 52 35 56 38" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 37 49 Q 41 51 45 49" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
              </g>
            </motion.g>
          </svg>
        )}

        {/* Watering Plant */}
        {isWatering && (
          <svg width="74" height="50" viewBox="0 0 140 100" className="overflow-visible">
            <motion.g
              animate={{ y: [0, -1.5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 85px" }}
            >
              {/* Body */}
              <rect x="15" y="20" width="70" height="60" rx="24" fill="#ffa552" stroke="#2B1D12" strokeWidth="2.8" />
              <rect x="17" y="22" width="66" height="56" rx="22" fill="#ffa552" />
              {/* Peaceful Eyes */}
              <path d="M 30 45 A 4 4 0 0 1 40 45" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 60 45 A 4 4 0 0 1 70 45" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
              {/* Arm & Tilted Watering Can */}
              <path d="M 80 55 Q 92 50 96 55" fill="none" stroke="#EA713E" strokeWidth="5.5" strokeLinecap="round" />
              <g transform="translate(93, 50) rotate(15)">
                <rect x="0" y="0" width="12" height="9" rx="1.5" fill="#BAAE9C" stroke="#2B1D12" strokeWidth="1.5" />
                <path d="M 12 5 L 18 2" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
              </g>
              {/* Falling Droplets */}
              <g transform="translate(112, 60)">
                <motion.circle cx="0" cy="0" r="1" fill="#4AA0E6" animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
                <motion.circle cx="3" cy="4" r="1" fill="#4AA0E6" animate={{ y: [-3, 7, -3], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4, ease: "linear" }} />
              </g>
            </motion.g>
            {/* Growing plant */}
            <g transform="translate(112, 75)">
              <path d="M 5,10 L 5,0" stroke="#7BA655" strokeWidth="2" />
              <motion.g 
                style={{ transformOrigin: "5px 10px" }}
                animate={{ scale: [0.85, 1.15, 0.85] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <circle cx="2" cy="2" r="2" fill="#90C467" />
                <circle cx="8" cy="1" r="2" fill="#90C467" />
              </motion.g>
            </g>
          </svg>
        )}

        {/* Supporting Cane */}
        {isCane && (
          <svg width="74" height="50" viewBox="0 0 140 100" className="overflow-visible">
            <motion.g
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{ transformOrigin: "70px 85px" }}
            >
              {/* Left Buddy */}
              <g transform="translate(15, 20)">
                <rect x="15" y="15" width="45" height="55" rx="16" fill="#ffa552" stroke="#2B1D12" strokeWidth="3" />
                <rect x="17" y="17" width="41" height="51" rx="14" fill="#ffa552" />
                <path d="M 26 38 A 3 3 0 0 1 32 38" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
                <path d="M 44 38 A 3 3 0 0 1 50 38" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
                {/* Arm support */}
                <path d="M 55 45 Q 68 45 74 48" fill="none" stroke="#EA713E" strokeWidth="5" strokeLinecap="round" />
              </g>
              {/* Right Buddy with walking cane */}
              <g transform="translate(68, 30)">
                <rect x="15" y="10" width="38" height="45" rx="12" fill="#dddbd0" stroke="#2B1D12" strokeWidth="2.8" />
                <rect x="17" y="12" width="34" height="41" rx="10" fill="#dddbd0" />
                <path d="M 24 25 A 2.5 2.5 0 0 1 29 25" fill="none" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 38 25 A 2.5 2.5 0 0 1 43 25" fill="none" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
                {/* Cane */}
                <path d="M 12 35 L 5 55" stroke="#8A6E58" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 12 35 Q 14 32 11 30" fill="none" stroke="#8A6E58" strokeWidth="2.5" strokeLinecap="round" />
                {/* Arm holding cane */}
                <path d="M 19 28 Q 11 32 12 35" fill="none" stroke="#BAAE9C" strokeWidth="4.5" strokeLinecap="round" />
              </g>
            </motion.g>
          </svg>
        )}

        {/* Lantern Blinking */}
        {isLantern && (
          <svg width="60" height="50" viewBox="0 0 120 100" className="overflow-visible">
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ transformOrigin: "60px 85px" }}
            >
              {/* Ears */}
              <path d="M 33 22 C 30 10, 48 10, 52 20 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="2.5" />
              <path d="M 87 22 C 90 10, 72 10, 68 20 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="2.5" />
              {/* Body */}
              <rect x="20" y="20" width="80" height="66" rx="28" fill="#ffa552" stroke="#2B1D12" strokeWidth="3" />
              <rect x="22" y="22" width="76" height="62" rx="26" fill="#ffa552" />
              {/* Blinking Eyes */}
              <g>
                <motion.ellipse 
                  cx="40" cy="46" rx="6.5" ry="6.5" fill="#2B1D12"
                  animate={{ scaleY: [1, 1, 0, 1, 1, 1] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                  style={{ transformOrigin: "40px 46px" }}
                />
                <motion.ellipse 
                  cx="76" cy="46" rx="6.5" ry="6.5" fill="#2B1D12"
                  animate={{ scaleY: [1, 1, 0, 1, 1, 1] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                  style={{ transformOrigin: "76px 46px" }}
                />
              </g>
              {/* Arm & Lantern */}
              <path d="M 98 62 C 104 68 107 74 107 78" fill="none" stroke="#EA713E" strokeWidth="6" strokeLinecap="round" />
              <g transform="translate(102, 72)">
                <rect x="-5" y="5" width="10" height="15" rx="1.5" fill="#FFAE00" stroke="#2B1D12" strokeWidth="1.8" />
                <motion.circle 
                  cx="0" cy="12" r="2.5" fill="#FFF200"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              </g>
            </motion.g>
          </svg>
        )}
      </div>

      {/* 3. Dynamic Caption */}
      <span className="text-[7.5px] font-bold text-gray-400 mt-1 italic leading-tight select-none px-1 w-24">
        {isBreathing && "Breathe with me for a moment."}
        {isCircle && "Sharing together."}
        {isWatering && "Small steps count too."}
        {isCane && "You don't have to navigate this journey alone."}
        {isLantern && "Let's bring clarity to confusing moments."}
      </span>
    </div>
  );
}

// 5. Contextual HopeBuddy animation inside the hero section
function HeroMascot({ activeCategoryId }: { activeCategoryId: string }) {
  const isAnxious = activeCategoryId === 'anxiety';
  const isParkinsons = activeCategoryId === 'parkinsons';
  const isHallucinations = activeCategoryId === 'hallucinations';
  const isRecovery = activeCategoryId === 'emotional-recovery';
  
  return (
    <div className="w-28 h-28 bg-white/70 border border-[#E9E4D9] rounded-full shadow-inner flex items-center justify-center p-2.5 relative overflow-visible select-none">
      {/* Soft halo behind mascot */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-orange-50/40"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      <svg width="76" height="76" viewBox="0 0 150 150" className="overflow-visible relative z-10">
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ transformOrigin: "75px 110px" }}
        >
          {/* Hump Ears */}
          <path d="M 40 28 C 36 12, 60 12, 66 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M 110 28 C 114 12, 90 12, 84 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          
          {/* Rounded Bean Body */}
          <rect x="24" y="26" width="102" height="86" rx="36" fill="#ffa552" stroke="#2B1D12" strokeWidth="4" />
          <rect x="26" y="28" width="98" height="82" rx="34" fill="#ffa552" />
          
          {/* Eyes depending on category */}
          {isAnxious && (
            <>
              {/* Closed peaceful eyes */}
              <path d="M 48 62 Q 54 57 60 62" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 90 62 Q 96 57 102 62" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          
          {(isParkinsons || isHallucinations) && (
            <>
              {/* Happy eyes */}
              <path d="M 46 64 A 6 6 0 0 1 58 64" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 92 64 A 6 6 0 0 1 104 64" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
          
          {isRecovery && (
            <>
              {/* Sparkle open eyes */}
              <circle cx="53" cy="62" r="7.5" fill="#2B1D12" />
              <circle cx="97" cy="62" r="7.5" fill="#2B1D12" />
              <circle cx="51" cy="59" r="2.5" fill="white" />
              <circle cx="95" cy="59" r="2.5" fill="white" />
            </>
          )}
          
          {/* Smile */}
          <path d="M 69 75 Q 75 79 81 75" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Cheeks */}
          <circle cx="42" cy="71" r="5.5" fill="#FFA5A5" opacity="0.8" />
          <circle cx="108" cy="71" r="5.5" fill="#FFA5A5" opacity="0.8" />
          
          {/* Waving Arm */}
          <motion.path 
            d="M 126 80 Q 140 56 142 46" 
            fill="none" stroke="#EA713E" strokeWidth="8" strokeLinecap="round"
            animate={{ rotate: [0, 15, -10, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            style={{ transformOrigin: "126px 80px" }}
          />
          <path d="M 23 82 Q 13 88 20 95" fill="none" stroke="#EA713E" strokeWidth="7.5" strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  );
}

export default function CareBridgeScreen({
  onBack,
  onNavigateTo,
  savedQuestions,
  onAddQuestion,
  onDeleteQuestion,
}: CareBridgeScreenProps) {
  const [subScreen, setSubScreen] = useState<SubScreen>('suggestions');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('anxiety');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string>('overthinking');
  const [questionInput, setQuestionInput] = useState<string>('');

  const handleAddQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    onAddQuestion(questionInput.trim());
    setQuestionInput('');
  };

  const handleOpenResource = (resource: { name: string; link: string }) => {
    alert(`You are now leaving HopeHeart to visit ${resource.name}. Keep supporting yourself safely!`);
  };

  const exampleQuestions = [
    'How do I talk about visual confusion episodes?',
    'What daily exercises help support tremor cycles?',
    'What should I do when overthinking turns into panic?',
    'Are there local support groups for caregivers near me?',
    'How do I identify burnout triggers before they scale?'
  ];

  const activeCategory = SUPPORT_CATEGORIES.find(cat => cat.id === activeCategoryId) || SUPPORT_CATEGORIES[0];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none scrollbar-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={() => {
            if (subScreen === 'suggestions') {
              onBack();
            } else {
              setSubScreen('suggestions');
            }
          }}
          id="btn-back-carebridge"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subScreen === 'suggestions' && 'Support Resources'}
          {subScreen === 'questions' && 'Professional Question List'}
        </span>
        <button 
          onClick={() => setSubScreen('questions')}
          className="relative px-3 py-1.5 bg-[#FFF2EA] hover:bg-[#FFE3D1] rounded-xl flex items-center gap-1 text-[11px] font-display font-black text-[#FF7527] transition-all cursor-pointer"
        >
          <span>📋</span> Question List
          {savedQuestions.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold font-mono">
              {savedQuestions.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {subScreen === 'suggestions' && (
            <motion.div
              key="suggestions-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* 1. Redesigned Hero Header Section */}
              <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/20 border border-emerald-100/70 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 md:max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                    🌍 Support Resources
                  </div>
                  <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[26px] leading-tight">
                    🧡 What are you going through today?
                  </h2>
                  <p className="text-[13px] text-gray-600 font-semibold leading-relaxed">
                    Start with what feels closest. HopeHeart will guide you to support spaces, listeners, and resources.
                  </p>
                </div>
                <div className="shrink-0 flex items-center justify-center md:justify-end">
                  <HeroMascot activeCategoryId={activeCategoryId} />
                </div>
              </div>

              {/* Onboarding Assistant / Tell Us What's Happening */}
              <div className="bg-white border border-[#EDE9DE] p-6 rounded-[32px] shadow-xs space-y-5">
                <div className="space-y-1">
                  <h3 className="text-[16px] font-display font-black text-[#2B1D12] flex items-center gap-1.5">
                    🫶 Tell us what’s happening
                  </h3>
                  <p className="text-[12.5px] text-gray-500 font-semibold leading-normal">
                    You don’t need the perfect category. Choose what feels closest.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SITUATIONS.map((btn) => {
                    const isSelected = selectedSymptomId === btn.id;
                    return (
                      <motion.button
                        key={btn.id}
                        onClick={() => {
                          setSelectedSymptomId(btn.id);
                          setActiveCategoryId(btn.catId);
                        }}
                        whileHover={{ scale: 1.015, y: -0.5 }}
                        whileTap={{ scale: 0.985 }}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer min-h-[120px] ${
                          isSelected 
                            ? 'bg-[#FFF2EA] border-[#FF7527] shadow-2xs ring-1 ring-[#FF7527]/10' 
                            : 'bg-[#FCFAF5] border-gray-200 hover:bg-[#FAF6EE] hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl p-1 bg-white rounded-lg shadow-2xs shrink-0 select-none">{btn.emoji}</span>
                          <span className="text-[13px] font-display font-black text-gray-800 block leading-tight">
                            {btn.label}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                          {btn.desc}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Recommended for you panel */}
                {selectedSymptomId && (
                  <div className="bg-[#FCFAF5] border border-[#E9E4D9] rounded-2xl p-4.5 space-y-2.5">
                    <h4 className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
                      ✨ Recommended for you
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {SITUATIONS.find(s => s.id === selectedSymptomId)?.recommendations.map((rec, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (rec.target !== 'doctor-suggestions') {
                              onNavigateTo(rec.target);
                            }
                          }}
                          type="button"
                          className="p-3 bg-white hover:bg-[#FFF2EA] border border-gray-200 hover:border-[#FF7527]/30 text-gray-700 hover:text-[#FF7527] rounded-xl text-[12px] font-bold transition-all text-left flex items-center justify-between cursor-pointer active:scale-95"
                        >
                          <span className="truncate">{rec.text}</span>
                          <span className="text-[10px] text-gray-400">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 214 people supporting banner */}
                <div className="pt-2 border-t border-gray-50 flex items-center">
                  <div className="inline-flex items-center gap-2 bg-[#F2FAF6] border border-green-200/60 px-4 py-2 rounded-full text-green-800 text-[11.5px] font-bold shadow-2xs">
                    <span className="text-[12px]">🟢</span>
                    <span>214 people are supporting each other right now</span>
                  </div>
                </div>
              </div>

              {/* 2. Category switcher directly below the hero section */}
              <div className="space-y-3.5 bg-white border border-[#EDE9DE] p-5 rounded-[28px] shadow-xs">
                <div className="space-y-1">
                  <h4 className="text-[14px] font-display font-black text-[#2B1D12] flex items-center gap-1.5">
                    Or explore by support path
                  </h4>
                  <p className="text-[12px] text-gray-500 font-semibold block leading-tight">
                    Choose the journey that feels closest to your current experience.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-0.5">
                  {SUPPORT_CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        // Auto-highlight corresponding symptom button
                        if (cat.id === 'anxiety') {
                          setSelectedSymptomId('overthinking');
                        } else if (cat.id === 'parkinsons') {
                          setSelectedSymptomId('parkinsons');
                        } else if (cat.id === 'hallucinations') {
                          setSelectedSymptomId('confusing');
                        } else if (cat.id === 'emotional-recovery') {
                          if (selectedSymptomId !== 'lonely' && selectedSymptomId !== 'exhausted') {
                            setSelectedSymptomId('lonely');
                          }
                        }
                      }}
                      whileHover={{ scale: 1.02, y: -0.5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4.5 py-3 rounded-xl transition-all cursor-pointer font-display font-bold text-[12.5px] flex items-center gap-2.5 ${
                        activeCategoryId === cat.id 
                          ? 'bg-[#1E1E1A] text-white shadow-xs' 
                          : 'bg-[#FCFAF5] text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <div className="text-left leading-tight">
                        <span className="block">{cat.name}</span>
                        <span className={`block text-[9.5px] ${activeCategoryId === cat.id ? 'text-orange-200' : 'text-gray-400'} font-mono font-medium mt-0.5`}>
                          {cat.id === 'anxiety' && '→ 24 active circles'}
                          {cat.id === 'parkinsons' && '→ 18 caregiver groups'}
                          {cat.id === 'hallucinations' && '→ 8 safe spaces'}
                          {cat.id === 'emotional-recovery' && '→ 36 communities'}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 3. Dynamic Category Details and Cards Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white border border-[#EDE9DE] rounded-[32px] p-6 space-y-6 shadow-xs"
                >
                  {/* Header info without the static/redundant mascot - kept clean and card-focused */}
                  <div className="border-b border-gray-100 pb-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-[#FCFAF5] border border-gray-150 shadow-inner">
                        {activeCategory.emoji}
                      </span>
                      <div>
                        <h3 className="font-display font-black text-[#2B1D12] text-[20px]">
                          {activeCategory.name} Support
                        </h3>
                        <p className="text-[12.5px] text-gray-500 font-semibold italic">
                          {activeCategory.tagline}
                        </p>
                      </div>
                    </div>

                    {/* BEST FOR */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Best For
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCategory.bestFor.map((item, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-[#FCFAF5] border border-gray-150 rounded-lg text-gray-650 font-semibold text-[11.5px]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AVAILABLE SUPPORT (HOPEHEART) */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-display font-black text-gray-800 text-[15px] flex items-center gap-1.5">
                        🧡 Available Support on HopeHeart
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Empathetic peer-to-peer assistance and companion check-ins within our community boundaries.
                      </p>
                    </div>

                    {/* Card grid with small top-right illustrations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeCategory.availableSupport.map((support, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#FCFAF5] border border-gray-150 rounded-2xl p-4.5 flex flex-row items-stretch justify-between gap-3 hover:shadow-2xs transition-all min-h-[170px]"
                        >
                          <div className="flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <h5 className="font-display font-bold text-[13.5px] text-gray-800">
                                {support.title}
                              </h5>
                              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                                {support.description}
                              </p>
                            </div>
                            <button
                              onClick={() => onNavigateTo(support.targetPath)}
                              className="w-full py-1.5 bg-white border border-gray-200 hover:border-[#FF7527]/45 hover:text-[#FF7527] transition-all text-gray-600 font-display font-bold text-[11px] rounded-lg cursor-pointer text-center"
                            >
                              {support.actionText}
                            </button>
                          </div>
                          
                          {/* 1. Small illustration area at the top-right */}
                          <div className="w-24 shrink-0 flex items-center justify-center border-l border-gray-100 pl-2">
                            <CardIllustration type={support.illustration} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Trusted External Resources Section */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <h4 className="font-display font-black text-emerald-800 text-[15px] flex items-center gap-1.5">
                        🌍 Trusted External Resources
                      </h4>
                      <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                        These are external organizations verified by HopeHeart.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeCategory.externalResources.map((res, idx) => (
                        <div 
                          key={idx}
                          className="bg-white border border-[#EDE9DE] rounded-2xl p-4.5 flex flex-row items-stretch justify-between gap-3 hover:shadow-2xs transition-all min-h-[220px]"
                        >
                          <div className="flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                                  {res.badge}
                                </span>
                                <span className="text-[10px] font-semibold text-gray-400">
                                  {res.mode}
                                </span>
                              </div>
                              <h5 className="font-display font-black text-gray-800 text-[14px]">
                                {res.name}
                              </h5>
                              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                                {res.description}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="text-[9.5px] bg-[#FCFAF5] rounded-lg border border-gray-100 p-2 font-semibold text-gray-400">
                                {res.boundary}
                              </div>
                              <button
                                onClick={() => handleOpenResource(res)}
                                className="w-full py-2 bg-[#FAF8F5] border border-gray-200 hover:bg-[#FF7527] hover:text-white transition-all text-gray-700 font-display font-extrabold text-[12px] rounded-xl cursor-pointer"
                              >
                                Open Resource →
                              </button>
                            </div>
                          </div>

                          {/* 1. Small illustration area at the top-right */}
                          <div className="w-24 shrink-0 flex items-center justify-center border-l border-gray-100 pl-2">
                            <CardIllustration type={res.illustration} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Today at HopeHeart & Visual Journey Indicator */}
              <div className="bg-[#FEFAF3] border border-[#EDE9DE] p-6 rounded-[32px] shadow-xs space-y-6">
                <div className="space-y-1">
                  <h3 className="text-[16px] font-display font-black text-gray-850 flex items-center gap-1.5">
                    🧡 Today at HopeHeart
                  </h3>
                  <p className="text-[12.5px] text-gray-500 font-semibold leading-normal">
                    Real support happening right now. You are sharing this space with understanding peers.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center">
                  {[
                    { label: 'checked in today', count: '214', emoji: '🟢', bg: 'bg-green-50/70 border-green-100/60 text-green-800' },
                    { label: 'discussing anxiety', count: '34', emoji: '🧠', bg: 'bg-[#FFF2EA] border-[#FFE3D1] text-[#FF7527]' },
                    { label: "supporting Parkinson's caregivers", count: '12', emoji: '🧓', bg: 'bg-amber-50/70 border-amber-100/60 text-amber-800' },
                    { label: 'exploring hallucination support', count: '6', emoji: '👀', bg: 'bg-blue-50/70 border-blue-100/60 text-blue-800' },
                    { label: 'celebrating small wins', count: '18', emoji: '🌱', bg: 'bg-emerald-50/70 border-emerald-100/60 text-emerald-800' }
                  ].map((act, index) => (
                    <div 
                      key={index} 
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[12.5px] font-bold shadow-2xs hover:scale-[1.01] transition-transform ${act.bg}`}
                    >
                      <span>{act.emoji}</span>
                      <span><strong>{act.count}</strong> {act.label}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Journey Indicator */}
                <div className="pt-5 border-t border-[#EDE9DE] space-y-3">
                  <div className="text-center">
                    <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                      Your Supportive Journey Map
                    </span>
                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                      HopeHeart guides you step-by-step from reflection to continuous safety. Click any step to visit.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 py-1">
                    {[
                      { name: 'Check-In', emoji: '🧡', targetPath: 'home' },
                      { name: 'Community', emoji: '🤝', targetPath: 'support-rooms' },
                      { name: 'Resources', emoji: '🌍', targetPath: 'doctor-suggestions' },
                      { name: 'Safety', emoji: '🛡️', targetPath: 'ai-safety' }
                    ].map((step, idx, arr) => {
                      const isCurrent = step.targetPath === 'doctor-suggestions';
                      return (
                        <div key={idx} className="flex items-center gap-1.5 sm:gap-3">
                          <motion.button
                            onClick={() => {
                              if (!isCurrent) onNavigateTo(step.targetPath);
                            }}
                            whileHover={isCurrent ? {} : { scale: 1.03, y: -0.5 }}
                            whileTap={isCurrent ? {} : { scale: 0.98 }}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[12px] font-display font-bold transition-all ${
                              isCurrent 
                                ? 'bg-[#1E1E1A] text-white border-[#1E1E1A] shadow-xs' 
                                : 'bg-white text-gray-650 border-[#EDE9DE] hover:bg-[#FCFAF5] hover:border-gray-300 cursor-pointer'
                            }`}
                          >
                            <span>{step.emoji}</span>
                            <span>{step.name}</span>
                          </motion.button>

                          {idx < arr.length - 1 && (
                            <span className="text-gray-300 font-bold select-none">
                              →
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Safe Boundary Reminders Box */}
              <div className="bg-[#FEFBF7] border border-amber-100/70 rounded-3xl p-5 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">🛡️</span>
                  <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
                    Safe Boundary Reminders
                  </span>
                </div>
                <ul className="text-[12px] text-gray-600 space-y-1.5 font-semibold list-disc list-inside px-1">
                  <li>HopeHeart must not diagnose conditions.</li>
                  <li>HopeHeart must not provide medication advice.</li>
                  <li>HopeHeart only provides peer emotional support, communities, and external resources.</li>
                </ul>
              </div>

              {/* Core Creed Card */}
              <div className="bg-[#FEFAF0] border-2 border-dashed border-[#F3E2C4] p-5 rounded-3xl text-center">
                <span className="font-mono text-[9px] font-extrabold text-[#FF7527] uppercase tracking-widest block mb-1">
                  Our Code of Practice
                </span>
                <p className="text-[13.5px] font-bold text-gray-700">
                  "Community supports. AI protects. Professionals provide care."
                </p>
              </div>
            </motion.div>
          )}

          {subScreen === 'questions' && (
            <motion.div
              key="questions-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto bg-white border border-[#E9E4D9] rounded-3xl p-6 md:p-8 space-y-6 shadow-xs"
            >
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="font-display font-black text-gray-800 text-[20px] md:text-[22px] tracking-tight leading-none">
                  Professional Question List
                </h3>
                <p className="text-[13px] text-gray-500 font-semibold">
                  Write down what you want to ask during your upcoming general practitioner or specialist appointment. We keep it ready for you!
                </p>
              </div>

              {/* Core add form */}
              <form onSubmit={handleAddQuestion} className="flex gap-2.5">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Ask about symptoms, daily grounding exercises, tremors, or stress..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Save Question
                </button>
              </form>

              {/* Sample Helper suggestions */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Quick examples (click to auto-add)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onAddQuestion(q)}
                      className="bg-[#FCFAF5] hover:bg-[#FFF2EA] border border-[#EEE9DD] text-gray-600 hover:text-[#FF7527] text-[11.5px] font-semibold px-3 py-1.5 rounded-xl text-left transition-colors cursor-pointer"
                    >
                      ➕ {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Questions Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                  Your Active Saved Questions Checklist ({savedQuestions.length})
                </span>
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-thin">
                  {savedQuestions.length === 0 ? (
                    <div className="text-center py-8 bg-[#FCFAF5] border border-dashed border-[#ECE6D9] rounded-2xl">
                      <span className="text-[28px]">📜</span>
                      <p className="text-[12px] text-gray-500 font-semibold mt-2">
                        Your professional checklist is empty. Save questions above!
                      </p>
                    </div>
                  ) : (
                    savedQuestions.map((q) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start justify-between gap-3 p-3.5 bg-white border border-[#EEE9DD] rounded-xl text-[12.5px] text-gray-700"
                      >
                        <div className="flex-1 font-semibold leading-relaxed select-all">
                          • {q.text}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              alert(`Sent question: "${q.text}" mock-shared with your verified care provider!`);
                            }}
                            className="bg-[#F2FAF6] text-emerald-700 hover:bg-emerald-100 text-[10px] font-display font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer"
                          >
                            Share with Professional
                          </button>
                          <button
                            onClick={() => onDeleteQuestion(q.id)}
                            className="text-gray-400 hover:text-red-500 font-mono font-bold text-[15px] px-1.5 cursor-pointer leading-none"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-[#FAF7F0] border border-[#ECE6D9] p-4 rounded-2xl">
                <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                  💡 <strong>Tip:</strong> Keep this list open on your screen when talking face-to-face with your physician or therapist so that no important concerns are left unaddressed!
                </p>
              </div>

              <button
                onClick={() => setSubScreen('suggestions')}
                className="w-full py-3 bg-[#1e1e1a] text-white font-display font-black text-[14px] rounded-xl cursor-pointer"
              >
                Back to Resources Grid
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
export { CareBridgeScreen };
