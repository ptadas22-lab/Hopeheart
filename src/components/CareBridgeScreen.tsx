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
  }[];
  externalResources: {
    name: string;
    description: string;
    link: string;
    badge: string;
    boundary: string;
    mode: string;
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
        targetPath: 'safe-listener'
      },
      {
        title: '🎪 Anxiety Support Circles',
        description: 'Join group chat rooms centered on stress and overthinking support.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms'
      },
      {
        title: '🧡 HopeBuddy Grounding',
        description: 'Open HopeBuddy to do a quick 4-second breathing pause exercise.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home'
      }
    ],
    externalResources: [
      {
        name: 'Crisis Text Line',
        description: 'Free, 24/7 confidential text support for panic and anxiety. Text HOME to 741741.',
        link: 'https://www.crisistextline.org',
        badge: 'Immediate Help',
        boundary: 'External Helpline • 100% Free',
        mode: 'Text Support'
      },
      {
        name: 'BetterHelp Therapy',
        description: 'Matches you with licensed professional counselors specializing in anxiety.',
        link: 'https://www.betterhelp.com',
        badge: 'Professional Therapy',
        boundary: 'External Resource • Paid Directory',
        mode: 'Online Therapy'
      },
      {
        name: 'NAMI Anxiety Guide',
        description: 'Educational resources, guides on panic attacks, and family help guides.',
        link: 'https://www.nami.org',
        badge: 'Resource Finder',
        boundary: 'External Directory • Free Info',
        mode: 'Directories & Guides'
      }
    ]
  },
  {
    id: 'parkinsons',
    name: "Parkinson's",
    emoji: '🧓',
    tagline: 'Emotional comfort and caregiver support for movement challenges.',
    bestFor: ['Daily emotional support', 'Caregiver support', 'Movement challenges'],
    availableSupport: [
      {
        title: '🤝 Caregiver Listeners',
        description: 'Connect with understanding peers who know the daily path of caregiver support.',
        actionText: 'Find Listener →',
        targetPath: 'safe-listener'
      },
      {
        title: '🎪 Parkinson\'s Circles',
        description: 'Join rooms where families share somatic tremor tips and emotional wins.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms'
      },
      {
        title: '🧡 HopeBuddy Pacing',
        description: 'Check in on daily energy pacing levels with your companion.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home'
      }
    ],
    externalResources: [
      {
        name: "Parkinson's Foundation Line",
        description: 'Call 1-800-4PD-INFO for free resources, clinical directory finders, and local guidance.',
        link: 'https://www.parkinson.org',
        badge: 'National Helpline',
        boundary: 'External Helpline • 100% Free',
        mode: 'Phone Support'
      },
      {
        name: 'Family Caregiver Alliance',
        description: 'Offers caregiver checklists, online classes, and regional advocacy groups.',
        link: 'https://www.caregiver.org',
        badge: 'Caregiver Support',
        boundary: 'External Directory • Free Help',
        mode: 'Toolkits & Groups'
      },
      {
        name: 'Davis Phinney Foundation',
        description: 'Resources and tools focused on living active, healthy daily lives with Parkinson\'s.',
        link: 'https://www.davisphinneyfoundation.org',
        badge: 'Living Tools',
        boundary: 'External Resource • Free Info',
        mode: 'Action Guides'
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
        targetPath: 'safe-listener'
      },
      {
        title: '🎪 Quiet Sharing Circles',
        description: 'Slow-paced rooms for talking through confusion, visual shifts, or fears.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms'
      },
      {
        title: '🧡 HopeBuddy Reassurance',
        description: 'Interactive reality-grounding scripts when feeling confused or disoriented.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home'
      }
    ],
    externalResources: [
      {
        name: 'Lewy Body Dementia Line',
        description: 'Call 800-539-9767 for specialized counseling on hallucinations and confusion.',
        link: 'https://www.lbda.org',
        badge: 'Support Line',
        boundary: 'External Support • Free Info',
        mode: 'Helpline Call'
      },
      {
        name: 'Mental Health America Guide',
        description: 'Resource guides explaining visual hallucinations and sensory shifts.',
        link: 'https://www.mhanational.org',
        badge: 'Guides & Articles',
        boundary: 'External Resource • Free Info',
        mode: 'Educational Guides'
      },
      {
        name: 'Geriatric Psychiatry Finder',
        description: 'Search directory for licensed medical professionals in cognitive changes.',
        link: 'https://www.psychologytoday.com',
        badge: 'Specialist Finder',
        boundary: 'External Directory • Insurance',
        mode: 'Medical Directory'
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
        targetPath: 'safe-listener'
      },
      {
        title: '🎪 Burnout & Loss Circles',
        description: 'Weekly sharing circles for mutual recovery during life transitions.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms'
      },
      {
        title: '🧡 HopeBuddy Rest Check',
        description: 'Empathetic guidance that celebrates tiny wins and self-care recovery checks.',
        actionText: 'Open HopeBuddy →',
        targetPath: 'home'
      }
    ],
    externalResources: [
      {
        name: 'GriefShare Network',
        description: 'Search directory for local recovery groups facilitated by professionals.',
        link: 'https://www.griefshare.org',
        badge: 'Recovery Directory',
        boundary: 'External Registry • Search Free',
        mode: 'Local Groups'
      },
      {
        name: 'Burnout Recovery Guide',
        description: 'Self-assessments, stress reduction worksheets, and counselor directories.',
        link: 'https://www.mhanational.org',
        badge: 'Burnout Info',
        boundary: 'External Resource • Free Guides',
        mode: 'Worksheets & Tips'
      },
      {
        name: 'Crisis Response Line',
        description: 'Text HOME to 741741 to instantly talk about heavy burnout or grief.',
        link: 'https://www.crisistextline.org',
        badge: '24/7 Helpline',
        boundary: 'External Helpline • 100% Free',
        mode: 'Text / Call Line'
      }
    ]
  }
];

// Contextual Mascot Animation 1: Anxiety
function AnxietyIllustration() {
  return (
    <div className="flex flex-col items-center justify-center p-2.5 bg-[#FCFAF5] rounded-2xl border border-gray-150/60 shadow-inner w-36 h-36">
      <svg width="86" height="76" viewBox="0 0 150 150" className="overflow-visible">
        {/* Breathing halo ring */}
        <motion.circle 
          cx="75" cy="72" r="52" 
          fill="none" stroke="#FF7527" strokeWidth="4" opacity="0.3"
          animate={{ scale: [0.75, 1.25, 0.75], opacity: [0.25, 0.65, 0.25] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        {/* Body doing breathing motion */}
        <motion.g
          animate={{ scale: [0.93, 1.05, 0.93], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ transformOrigin: "75px 110px" }}
        >
          {/* Feet */}
          <rect x="52" y="112" width="16" height="8" rx="3" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" />
          <rect x="82" y="112" width="16" height="8" rx="3" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" />
          
          {/* Hump Ears */}
          <path d="M 40 28 C 36 12, 60 12, 66 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M 110 28 C 114 12, 90 12, 84 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          
          {/* Rounded Bean Body */}
          <rect x="24" y="26" width="102" height="86" rx="36" fill="#ffa552" stroke="#2B1D12" strokeWidth="4" />
          <rect x="26" y="28" width="98" height="82" rx="34" fill="#ffa552" />
          
          {/* Closed peaceful eyes */}
          <path d="M 48 62 Q 54 57 60 62" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 90 62 Q 96 57 102 62" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Pink Cheeks */}
          <circle cx="42" cy="70" r="6" fill="#FFA5A5" opacity="0.8" />
          <circle cx="108" cy="70" r="6" fill="#FFA5A5" opacity="0.8" />
          
          {/* Peaceful small mouth */}
          <path d="M 70 74 Q 75 77 80 74" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Yoga pose arms: resting outward */}
          <path d="M 23 85 C 10 90 15 99 28 95" fill="none" stroke="#EA713E" strokeWidth="8" strokeLinecap="round" />
          <path d="M 127 85 C 140 90 135 99 122 95" fill="none" stroke="#EA713E" strokeWidth="8" strokeLinecap="round" />
        </motion.g>
      </svg>
      <span className="text-[9px] font-bold text-gray-500 mt-1 italic text-center leading-none select-none">
        "Breathe with me for a moment."
      </span>
    </div>
  );
}

// Contextual Mascot Animation 2: Parkinson's
function ParkinsonsIllustration() {
  return (
    <div className="flex flex-col items-center justify-center p-2.5 bg-[#FCFAF5] rounded-2xl border border-gray-150/60 shadow-inner w-36 h-36">
      <svg width="96" height="76" viewBox="0 0 180 150" className="overflow-visible">
        {/* Swaying Support group */}
        <motion.g
          animate={{ rotate: [-2, 2, -2], y: [0, -1.5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ transformOrigin: "90px 125px" }}
        >
          {/* Buddy 1 (Supportive Orange) */}
          <g transform="translate(15, 12)">
            {/* Hump Ears */}
            <path d="M 33 42 C 30 30, 48 30, 52 40 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3" />
            <path d="M 77 42 C 80 30, 62 30, 58 40 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3" />
            {/* Body */}
            <rect x="25" y="40" width="60" height="70" rx="20" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" />
            <rect x="27" y="42" width="56" height="66" rx="18" fill="#ffa552" />
            {/* Comfortable Curved Eyes */}
            <path d="M 40 68 A 4 4 0 0 1 48 68" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 62 68 A 4 4 0 0 1 70 68" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
            {/* Smile */}
            <path d="M 51 76 Q 55 79 59 76" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
            {/* Supportive Arm hugging the other buddy */}
            <path d="M 80 80 Q 95 80 102 85" fill="none" stroke="#EA713E" strokeWidth="6.5" strokeLinecap="round" />
          </g>

          {/* Buddy 2 (Smaller Gray/Somatic Buddy with walking cane) */}
          <g transform="translate(85, 26)">
            {/* Walking Cane */}
            <path d="M 22 75 L 14 104" stroke="#8A6E58" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 22 75 Q 25 71 21 68 Q 16 68 18 72" fill="none" stroke="#8A6E58" strokeWidth="3.5" strokeLinecap="round" />

            {/* Body */}
            <rect x="25" y="30" width="50" height="55" rx="16" fill="#dddbd0" stroke="#2B1D12" strokeWidth="3" />
            <rect x="27" y="32" width="46" height="51" rx="14" fill="#dddbd0" />
            {/* Comfort eyes */}
            <path d="M 38 52 A 3 3 0 0 1 44 52" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M 56 52 A 3 3 0 0 1 62 52" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
            {/* Small smile */}
            <path d="M 46 60 Q 50 62 54 60" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
            {/* Arm holding cane */}
            <path d="M 27 60 Q 20 68 22 75" fill="none" stroke="#BAAE9C" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        </motion.g>
      </svg>
      <span className="text-[8.5px] font-bold text-gray-500 mt-1 italic text-center leading-tight select-none">
        "You don't have to navigate this journey alone."
      </span>
    </div>
  );
}

// Contextual Mascot Animation 3: Hallucination
function HallucinationIllustration() {
  return (
    <div className="flex flex-col items-center justify-center p-2.5 bg-[#FCFAF5] rounded-2xl border border-gray-150/60 shadow-inner w-36 h-36">
      <svg width="86" height="76" viewBox="0 0 150 150" className="overflow-visible">
        {/* Blinking Buddy holding a lantern */}
        <motion.g
          animate={{ y: [0, -2.5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ transformOrigin: "75px 110px" }}
        >
          {/* Hump Ears */}
          <path d="M 40 28 C 36 12, 60 12, 66 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M 110 28 C 114 12, 90 12, 84 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Body */}
          <rect x="24" y="26" width="102" height="86" rx="36" fill="#ffa552" stroke="#2B1D12" strokeWidth="4" />
          <rect x="26" y="28" width="98" height="82" rx="34" fill="#ffa552" />

          {/* Eyes with periodic blink animation */}
          <g>
            <motion.ellipse 
              cx="53" cy="62" rx="8.5" ry="8.5" fill="#2B1D12"
              animate={{ scaleY: [1, 1, 0, 1, 1, 1] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              style={{ transformOrigin: "53px 62px" }}
            />
            <motion.ellipse 
              cx="97" cy="62" rx="8.5" ry="8.5" fill="#2B1D12"
              animate={{ scaleY: [1, 1, 0, 1, 1, 1] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              style={{ transformOrigin: "97px 62px" }}
            />
            {/* Shines */}
            <circle cx="55" cy="59" r="3" fill="white" />
            <circle cx="99" cy="59" r="3" fill="white" />
          </g>

          {/* Smile */}
          <path d="M 69 75 Q 75 78 81 75" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />

          {/* Arm holding lantern */}
          <path d="M 126 80 C 135 88 138 96 138 102" fill="none" stroke="#EA713E" strokeWidth="7.5" strokeLinecap="round" />

          {/* Glowing Lantern */}
          <g transform="translate(132, 95)">
            {/* Light Cone beam */}
            <motion.polygon 
              points="-32,32 25,62 55,62 -5,32" 
              fill="#FFF200" opacity="0.16"
              animate={{ opacity: [0.12, 0.2, 0.12] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            {/* Lantern frame */}
            <rect x="-8" y="10" width="14" height="20" rx="3" fill="#FFAE00" stroke="#2B1D12" strokeWidth="2.2" />
            <circle cx="-1" cy="20" r="4.5" fill="#FFFDBF" />
            <motion.circle 
              cx="-1" cy="20" r="3" fill="#FFF200"
              animate={{ scale: [1, 1.25, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            <line x1="-1" y1="4" x2="-1" y2="10" stroke="#2B1D12" strokeWidth="2.2" />
          </g>
        </motion.g>
      </svg>
      <span className="text-[8.5px] font-bold text-gray-500 mt-1 italic text-center leading-tight select-none">
        "Let's bring clarity to confusing moments."
      </span>
    </div>
  );
}

// Contextual Mascot Animation 4: Emotional Recovery
function EmotionalRecoveryIllustration() {
  return (
    <div className="flex flex-col items-center justify-center p-2.5 bg-[#FCFAF5] rounded-2xl border border-gray-150/60 shadow-inner w-36 h-36">
      <svg width="96" height="76" viewBox="0 0 160 150" className="overflow-visible">
        {/* Watering plant buddy */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ transformOrigin: "70px 110px" }}
        >
          {/* Hump Ears */}
          <path d="M 35 28 C 31 12, 55 12, 61 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M 105 28 C 109 12, 85 12, 79 26 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Body */}
          <rect x="19" y="26" width="102" height="86" rx="36" fill="#ffa552" stroke="#2B1D12" strokeWidth="4" />
          <rect x="21" y="28" width="98" height="82" rx="34" fill="#ffa552" />

          {/* Peaceful closed curved eyes */}
          <path d="M 43 62 A 5 5 0 0 1 55 62" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 85 62 A 5 5 0 0 1 97 62" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
          {/* Smile */}
          <path d="M 64 73 Q 70 76 76 73" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />

          {/* Arm holding watering can */}
          <path d="M 120 78 Q 130 74 135 80" fill="none" stroke="#EA713E" strokeWidth="7" strokeLinecap="round" />

          {/* Watering can (tilted) */}
          <g transform="translate(130, 75) rotate(15)">
            <rect x="0" y="0" width="15" height="12" rx="2" fill="#BAAE9C" stroke="#2B1D12" strokeWidth="2" />
            <path d="M 15 6 L 22 2" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M -5 6 Q -10 6 -8 2 Q -6 -2 0 1" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Water droplets */}
          <g transform="translate(150, 85)">
            <motion.circle cx="0" cy="5" r="1.5" fill="#4AA0E6" animate={{ y: [0, 15, 0], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
            <motion.circle cx="3" cy="10" r="1.5" fill="#4AA0E6" animate={{ y: [-5, 10, -5], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4, ease: "linear" }} />
            <motion.circle cx="-3" cy="8" r="1.5" fill="#4AA0E6" animate={{ y: [-2, 13, -2], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.8, ease: "linear" }} />
          </g>
        </motion.g>

        {/* Plant and Pot in bottom right */}
        <g transform="translate(140, 105)">
          {/* Pot */}
          <polygon points="0,15 16,15 13,30 3,30" fill="#D3A27F" stroke="#2B1D12" strokeWidth="2.2" />
          {/* Plant Stem */}
          <path d="M 8,15 L 8,0" stroke="#7BA655" strokeWidth="3" strokeLinecap="round" />
          
          {/* Leaves with growing scale animation */}
          <motion.g
            animate={{ scale: [0.85, 1.15, 0.85] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ transformOrigin: "8px 15px" }}
          >
            {/* Leaf 1 */}
            <path d="M 8,5 Q 0,0 2,-4 Q 6,-3 8,5" fill="#90C467" stroke="#2B1D12" strokeWidth="1.5" />
            {/* Leaf 2 */}
            <path d="M 8,8 Q 16,3 14,-1 Q 10,0 8,8" fill="#90C467" stroke="#2B1D12" strokeWidth="1.5" />
          </motion.g>
        </g>
      </svg>
      <span className="text-[9px] font-bold text-gray-500 mt-1 italic text-center leading-none select-none">
        "Small steps count too."
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
          {subScreen === 'suggestions' && 'Professional Resources'}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* 1. Redesigned Hero Header Section */}
              <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/20 border border-emerald-100/70 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 md:max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                    🧑‍⚕️ Verified External Resources
                  </div>
                  <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[26px] leading-tight">
                    🧡 What kind of support do you need today?
                  </h2>
                  <div className="text-[12.5px] md:text-[13.5px] text-gray-650 leading-relaxed font-semibold space-y-1.5">
                    <p className="text-[#FF7527] font-extrabold uppercase font-mono tracking-wider text-[11.5px]">
                      Anxiety • Parkinson's • Hallucinations • Emotional Recovery
                    </p>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      HopeHeart helps you find the right space without overwhelming you.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-center md:justify-end">
                  <HeroMascot activeCategoryId={activeCategoryId} />
                </div>
              </div>

              {/* 2. Category switcher directly below the hero section */}
              <div className="space-y-2.5 bg-white border border-[#EDE9DE] p-4.5 rounded-[24px] shadow-xs">
                <label className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Select Support Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUPPORT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-display font-bold text-[12.5px] flex items-center gap-1.5 ${
                        activeCategoryId === cat.id 
                          ? 'bg-[#1E1E1A] text-white shadow-xs' 
                          : 'bg-[#FCFAF5] text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.emoji}</span> <span>{cat.name}</span>
                    </button>
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
                  {/* Header info */}
                  <div className="border-b border-gray-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
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

                    {/* Contextual Mascot Illustration */}
                    <div className="shrink-0 flex items-center justify-center">
                      {activeCategory.id === 'anxiety' && <AnxietyIllustration />}
                      {activeCategory.id === 'parkinsons' && <ParkinsonsIllustration />}
                      {activeCategory.id === 'hallucinations' && <HallucinationIllustration />}
                      {activeCategory.id === 'emotional-recovery' && <EmotionalRecoveryIllustration />}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeCategory.availableSupport.map((support, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#FCFAF5] border border-gray-150 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:shadow-2xs transition-shadow"
                        >
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
                      ))}
                    </div>
                  </div>

                  {/* 4. Renamed: External Professional Resources -> Trusted External Resources */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <h4 className="font-display font-black text-emerald-800 text-[15px] flex items-center gap-1.5">
                        🌍 Trusted External Resources
                      </h4>
                      <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                        These are external organizations verified by HopeHeart.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeCategory.externalResources.map((res, idx) => (
                        <div 
                          key={idx}
                          className="bg-white border border-[#EDE9DE] rounded-2xl p-4.5 flex flex-col justify-between space-y-4 hover:shadow-2xs transition-shadow"
                        >
                          <div className="space-y-2.5">
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
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

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
