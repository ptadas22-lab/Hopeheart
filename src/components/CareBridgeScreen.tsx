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
    illustration: 
      | 'anxiety-listener'
      | 'support-circle'
      | 'hopebuddy-grounding'
      | 'crisis-phone'
      | 'therapy-professional'
      | 'guide-folder'
      | 'parkinsons-support'
      | 'hallucination-grounding'
      | 'emotional-recovery';
    caption?: string;
  }[];
  externalResources: {
    name: string;
    description: string;
    link: string;
    badge: string;
    boundary: string;
    mode: string;
    illustration: 
      | 'anxiety-listener'
      | 'support-circle'
      | 'hopebuddy-grounding'
      | 'crisis-phone'
      | 'therapy-professional'
      | 'guide-folder'
      | 'parkinsons-support'
      | 'hallucination-grounding'
      | 'emotional-recovery';
    caption?: string;
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
        illustration: 'anxiety-listener',
        caption: 'Someone is ready to listen.'
      },
      {
        title: '🎪 Anxiety Support Circles',
        description: 'Join group chat rooms centered on stress and overthinking support.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'support-circle',
        caption: 'Share with people who understand.'
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
        illustration: 'crisis-phone',
        caption: 'Support is one text away.'
      },
      {
        name: 'BetterHelp Therapy',
        description: 'Matches you with licensed professional counselors specializing in anxiety.',
        link: 'https://www.betterhelp.com',
        badge: 'Professional Therapy',
        boundary: 'External Resource • Paid Directory',
        mode: 'Online Therapy',
        illustration: 'therapy-professional',
        caption: 'Connect with professionals online.'
      },
      {
        name: 'NAMI Anxiety Guide',
        description: 'Educational resources, guides on panic attacks, and family help guides.',
        link: 'https://www.nami.org',
        badge: 'Resource Finder',
        boundary: 'External Directory • Free Info',
        mode: 'Directories & Guides',
        illustration: 'guide-folder',
        caption: 'Explore guides & directories.'
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
        illustration: 'parkinsons-support',
        caption: 'Walking together with care.'
      },
      {
        title: '🎪 Parkinson\'s Circles',
        description: 'Join rooms where families share somatic tremor tips and emotional wins.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'support-circle',
        caption: 'Share with people who understand.'
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
        illustration: 'parkinsons-support',
        caption: 'Walking together with care.'
      },
      {
        name: 'Family Caregiver Alliance',
        description: 'Offers caregiver checklists, online classes, and regional advocacy groups.',
        link: 'https://www.caregiver.org',
        badge: 'Caregiver Support',
        boundary: 'External Directory • Free Help',
        mode: 'Toolkits & Groups',
        illustration: 'guide-folder',
        caption: 'Explore guides & directories.'
      },
      {
        name: 'Davis Phinney Foundation',
        description: 'Resources and tools focused on living active, healthy daily lives with Parkinson\'s.',
        link: 'https://www.davisphinneyfoundation.org',
        badge: 'Living Tools',
        boundary: 'External Resource • Free Info',
        mode: 'Action Guides',
        illustration: 'parkinsons-support',
        caption: 'Walking together with care.'
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
        illustration: 'hallucination-grounding',
        caption: 'Soothing presence and clarity.'
      },
      {
        title: '🎪 Quiet Sharing Circles',
        description: 'Slow-paced rooms for talking through confusion, visual shifts, or fears.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'support-circle',
        caption: 'Share with people who understand.'
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
        illustration: 'hallucination-grounding',
        caption: 'Soothing presence and clarity.'
      },
      {
        name: 'Mental Health America Guide',
        description: 'Resource guides explaining visual hallucinations and sensory shifts.',
        link: 'https://www.mhanational.org',
        badge: 'Guides & Articles',
        boundary: 'External Resource • Free Info',
        mode: 'Educational Guides',
        illustration: 'guide-folder',
        caption: 'Explore guides & directories.'
      },
      {
        name: 'Geriatric Psychiatry Finder',
        description: 'Search directory for licensed medical professionals in cognitive changes.',
        link: 'https://www.psychologytoday.com',
        badge: 'Specialist Finder',
        boundary: 'External Directory • Insurance',
        mode: 'Medical Directory',
        illustration: 'therapy-professional',
        caption: 'Connect with professionals online.'
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
        illustration: 'emotional-recovery',
        caption: 'Nurturing recovery at your own pace.'
      },
      {
        title: '🎪 Burnout & Loss Circles',
        description: 'Weekly sharing circles for mutual recovery during life transitions.',
        actionText: 'Join Circle →',
        targetPath: 'support-rooms',
        illustration: 'support-circle',
        caption: 'Share with people who understand.'
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
        illustration: 'emotional-recovery',
        caption: 'Nurturing recovery at your own pace.'
      },
      {
        name: 'Burnout Recovery Guide',
        description: 'Self-assessments, stress reduction worksheets, and counselor directories.',
        link: 'https://www.mhanational.org',
        badge: 'Burnout Info',
        boundary: 'External Resource • Free Guides',
        mode: 'Worksheets & Tips',
        illustration: 'emotional-recovery',
        caption: 'Nurturing recovery at your own pace.'
      },
      {
        name: 'Crisis Response Line',
        description: 'Text HOME to 741741 to instantly talk about heavy burnout or grief.',
        link: 'https://www.crisistextline.org',
        badge: '24/7 Helpline',
        boundary: 'External Helpline • 100% Free',
        mode: 'Text / Call Line',
        illustration: 'crisis-phone',
        caption: 'Support is one text away.'
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

function getResourceIcon(illustration: string): string {
  switch (illustration) {
    case 'crisis-phone': return '📞';
    case 'therapy-professional': return '🩺';
    case 'guide-folder': return '📂';
    case 'parkinsons-support': return '🧓';
    case 'hallucination-grounding': return '👁️';
    case 'emotional-recovery': return '🌱';
    default: return '📁';
  }
}

function StoryBookIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <rect x="4" y="6" width="56" height="36" rx="4" fill="#FEFAF0" stroke="#2B1D12" strokeWidth="1.8" />
      <path d="M 32 6 L 32 42" stroke="#2B1D12" strokeWidth="1.8" strokeDasharray="2 2" />
      <line x1="10" y1="14" x2="26" y2="14" stroke="#FF7527" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="22" x2="24" y2="22" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="28" x2="20" y2="28" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="16" x2="54" y2="16" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="24" x2="50" y2="24" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CaregiverIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <circle cx="20" cy="18" r="6" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="1.8" />
      <path d="M 10 38 C 10 28, 30 28, 30 38" fill="#7BA655" stroke="#2B1D12" strokeWidth="1.8" />
      <circle cx="42" cy="15" r="5" fill="#FFE3D1" stroke="#2B1D12" strokeWidth="1.8" />
      <path d="M 34 38 C 34 30, 50 30, 50 38" fill="#E2DCD0" stroke="#2B1D12" strokeWidth="1.8" />
      <path d="M 24 24 Q 30 21, 36 24" fill="none" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SavedFolderIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <path d="M 6 40 L 6 12 C 6 10, 8 8, 10 8 L 22 8 L 26 14 L 54 14 C 56 14, 58 16, 58 18 L 58 40 C 58 42, 56 44, 54 44 L 10 44 C 8 44, 6 42, 6 40 Z" fill="#FFF2EA" stroke="#2B1D12" strokeWidth="1.8" />
      <path d="M 32 24 C 32 24, 28 20, 26 22 C 24 24, 28 28, 32 30 C 36 28, 40 24, 38 22 C 36 20, 32 24, 32 24 Z" fill="#FF7527" stroke="#2B1D12" strokeWidth="1" />
    </svg>
  );
}

function DirectoryIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <rect x="6" y="8" width="52" height="32" rx="4" fill="#EBF5FF" stroke="#2B1D12" strokeWidth="1.8" />
      <circle cx="20" cy="20" r="4" fill="#3B82F6" stroke="#2B1D12" strokeWidth="1.5" />
      <circle cx="44" cy="28" r="4" fill="#10B981" stroke="#2B1D12" strokeWidth="1.5" />
      <path d="M 20 20 L 44 28" stroke="#2B1D12" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M 32 16 L 30 28" stroke="#2B1D12" strokeWidth="1.5" />
      <circle cx="31" cy="22" r="3" fill="#FF7527" stroke="#2B1D12" strokeWidth="1.2" />
    </svg>
  );
}

function EduGuidesIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <rect x="12" y="8" width="36" height="34" rx="3" fill="#FCFAF5" stroke="#2B1D12" strokeWidth="1.8" />
      <rect x="18" y="4" width="36" height="34" rx="3" fill="#FFF" stroke="#2B1D12" strokeWidth="1.8" />
      <line x1="26" y1="12" x2="44" y2="12" stroke="#7BA655" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="26" y1="20" x2="40" y2="20" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="26" x2="36" y2="26" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmergencyIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      {/* Base circle background */}
      <circle cx="24" cy="28" r="14" fill="#FDF2F2" stroke="#2B1D12" strokeWidth="1.8" />
      
      {/* Phone receiver */}
      <path d="M 18 28 C 20 22, 28 22, 30 28" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="15" y="24" width="6" height="8" rx="2.2" fill="#DC2626" stroke="#2B1D12" strokeWidth="1.2" />
      <rect x="27" y="24" width="6" height="8" rx="2.2" fill="#DC2626" stroke="#2B1D12" strokeWidth="1.2" />

      {/* Speech bubble */}
      <path d="M 36 10 H 52 C 54 10, 56 12, 56 14 C 56 17, 54 19, 52 19 H 44 L 40 23 V 19 C 38 19, 36 17, 36 14 C 36 12, 38 10, 36 10 Z" fill="#FFF2EA" stroke="#2B1D12" strokeWidth="1.5" strokeLinejoin="round" />
      
      {/* Speech bubble helper lines/dots */}
      <circle cx="41" cy="14" r="1" fill="#FF7527" />
      <circle cx="45" cy="14" r="1" fill="#FF7527" />
      <circle cx="49" cy="14" r="1" fill="#FF7527" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <circle cx="32" cy="24" r="18" fill="#FFF2EA" />
      <path d="M 22 26 Q 26 20 32 24 Q 38 28 42 22" stroke="#FF7527" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 24 24 Q 28 28 34 24 Q 40 20 42 24" stroke="#FF7527" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CirclesIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <circle cx="32" cy="24" r="16" fill="none" stroke="#2B1D12" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="32" cy="8" r="4.5" fill="#FF7527" stroke="#2B1D12" strokeWidth="1.2" />
      <circle cx="18" cy="28" r="4.5" fill="#7BA655" stroke="#2B1D12" strokeWidth="1.2" />
      <circle cx="46" cy="28" r="4.5" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="1.2" />
    </svg>
  );
}

function QuestionListIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <rect x="20" y="8" width="24" height="32" rx="3" fill="#FCFAF5" stroke="#2B1D12" strokeWidth="1.8" />
      <rect x="26" y="4" width="12" height="6" rx="1.5" fill="#FF7527" stroke="#2B1D12" strokeWidth="1.5" />
      <line x1="26" y1="16" x2="38" y2="16" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="26" y1="24" x2="38" y2="24" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="26" y1="32" x2="34" y2="32" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CrisisPhoneIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <circle cx="32" cy="24" r="18" fill="#F4FAF6" />
      <path d="M 22,28 C 24,20, 34,12, 42,20" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="18" y="22" width="8" height="10" rx="2" fill="#FF7527" stroke="#2B1D12" strokeWidth="1.2" />
      <rect x="38" y="14" width="8" height="10" rx="2" fill="#FF7527" stroke="#2B1D12" strokeWidth="1.2" />
    </svg>
  );
}

function TherapyIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <circle cx="32" cy="24" r="18" fill="#EBF5FF" />
      <path d="M 24 24 Q 32 18, 40 24" fill="none" stroke="#7BA655" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3.5" fill="#2B1D12" />
      <circle cx="40" cy="24" r="3.5" fill="#2B1D12" />
    </svg>
  );
}

function GuideFolderIcon() {
  return (
    <svg viewBox="0 0 64 48" className="w-12 h-10 select-none opacity-85">
      <rect x="10" y="12" width="44" height="28" rx="3" fill="#FCFAF5" stroke="#2B1D12" strokeWidth="1.8" />
      <path d="M 10 16 L 24 16 L 28 22 L 54 22 L 54 40 L 10 40 Z" fill="#FFF2EA" stroke="#2B1D12" strokeWidth="1.8" />
    </svg>
  );
}

function CareQuestionsIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-20 h-16 select-none opacity-90 shrink-0">
      {/* Background soft circle */}
      <circle cx="50" cy="40" r="32" fill="#FFF8F4" />
      
      {/* Soft heart icon */}
      <path d="M 75 18 C 73 15, 68 15, 66 18 C 64 15, 59 15, 57 18 C 55 21, 57 26, 66 31 C 75 26, 77 21, 75 18 Z" fill="#FFE4D6" stroke="#2B1D12" strokeWidth="1" />
      
      {/* Clipboard/Checklist */}
      <rect x="25" y="15" width="34" height="46" rx="3" fill="#FFF" stroke="#2B1D12" strokeWidth="1.8" />
      <rect x="34" y="11" width="16" height="7" rx="1.5" fill="#FF7527" stroke="#2B1D12" strokeWidth="1.5" />
      
      {/* Small checklist lines and question card shapes */}
      <line x1="32" y1="24" x2="44" y2="24" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="30" x2="50" y2="30" stroke="#7BA655" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="36" x2="46" y2="36" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Person holding it (hands) */}
      <path d="M 12 55 C 16 46, 24 46, 28 55" fill="#E2DCD0" stroke="#2B1D12" strokeWidth="1.8" />
      <circle cx="28" cy="50" r="4.5" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="1.5" />
      <circle cx="56" cy="48" r="4.5" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="1.5" />
    </svg>
  );
}

const QUESTION_CATEGORIES = [
  "All",
  "Anxiety",
  "Parkinson’s",
  "Confusing Experiences",
  "Caregiver",
  "Emotional Recovery"
];

const HELP_QUESTION_IDEAS = [
  {
    text: "How can I explain what I am feeling clearly?",
    categories: ["All", "Anxiety", "Emotional Recovery", "Confusing Experiences"]
  },
  {
    text: "What should I ask when I feel overwhelmed?",
    categories: ["All", "Anxiety", "Emotional Recovery"]
  },
  {
    text: "How can I talk about confusing experiences safely?",
    categories: ["All", "Confusing Experiences"]
  },
  {
    text: "Are there local support groups for caregivers?",
    categories: ["All", "Caregiver", "Parkinson’s"]
  },
  {
    text: "What can help me prepare before speaking to a professional?",
    categories: ["All", "Anxiety", "Parkinson’s", "Confusing Experiences", "Caregiver", "Emotional Recovery"]
  }
];

function getResourceIconComponent(illustration: string) {
  switch (illustration) {
    case 'crisis-phone': return <CrisisPhoneIcon />;
    case 'therapy-professional': return <TherapyIcon />;
    case 'guide-folder': return <GuideFolderIcon />;
    case 'parkinsons-support': return <CaregiverIcon />;
    case 'hallucination-grounding': return <SavedFolderIcon />;
    case 'emotional-recovery': return <EduGuidesIcon />;
    default: return <GuideFolderIcon />;
  }
}

const ANONYMOUS_STORIES = [
  {
    title: "Finding my grounding",
    category: "Anxiety",
    story: "During a severe anxiety episode last week, my thoughts were racing. I checked in and started active listening with Priya. Having someone comfort me without diagnostic advice allowed my nervous system to slow down step-by-step. Sharing without judgment is a quiet victory.",
    author: "Anonymous Peer"
  },
  {
    title: "A caregiver's quiet pause",
    category: "Caregiving",
    story: "Caring for a spouse with daily Parkinson's tremors takes immense emotional energy. I felt so lonely and exhausted. Joining the caregiver Corner room helped me connect with others who understand the exact weight of this role. We share coping wins daily.",
    author: "Anonymous Member"
  },
  {
    title: "Grounding through confusion",
    category: "Hallucinations",
    story: "When I experience visual shifts and confusing episodes, fear escalates quickly. The quiet companion grounding in the community helped me focus on reality-grounding details. It's safe to slow down, and I am learning to trust my space again.",
    author: "Anonymous Friend"
  }
];


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



function AnxietyPathIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-16 overflow-visible mx-auto">
      <circle cx="50" cy="40" r="24" fill="#FFF2EA" />
      <g transform="translate(30, 20)">
        <path d="M 5,45 Q 20,25 35,45 Z" fill="#FF7527" stroke="#2B1D12" strokeWidth="2" />
        <circle cx="20" cy="18" r="8" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2" />
        <rect x="23" y="26" width="6" height="12" rx="1" fill="#333" stroke="#2B1D12" strokeWidth="1.2" />
      </g>
      <path d="M 62,22 Q 68,16 75,22" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ParkinsonsPathIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-16 overflow-visible mx-auto">
      <circle cx="50" cy="40" r="24" fill="#F2FAF6" />
      <g transform="translate(24, 20)">
        <path d="M 5,45 Q 18,22 30,45 Z" fill="#8A6E58" stroke="#2B1D12" strokeWidth="2" />
        <circle cx="18" cy="16" r="7.5" fill="#FFE3D1" stroke="#2B1D12" strokeWidth="2" />
        <line x1="28" y1="28" x2="33" y2="45" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g transform="translate(44, 18)">
        <path d="M 5,47 Q 18,22 30,47 Z" fill="#7BA655" stroke="#2B1D12" strokeWidth="2" />
        <circle cx="18" cy="16" r="7.5" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2" />
      </g>
    </svg>
  );
}

function HallucinationsPathIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-16 overflow-visible mx-auto">
      <circle cx="50" cy="40" r="24" fill="#F0ECE1" />
      <g transform="translate(28, 20)">
        <path d="M 5,45 Q 20,25 35,45 Z" fill="#8B5CF6" stroke="#2B1D12" strokeWidth="2" />
        <circle cx="20" cy="18" r="8" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2" />
      </g>
      <circle cx="68" cy="38" r="9" fill="#FFF2EA" opacity="0.6" />
      <g transform="translate(63, 31)">
        <rect x="0" y="3" width="10" height="14" rx="2" fill="#FFE3D1" stroke="#2B1D12" strokeWidth="1.5" />
        <line x1="5" y1="0" x2="5" y2="3" stroke="#2B1D12" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function RecoveryPathIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-16 h-16 overflow-visible mx-auto">
      <circle cx="50" cy="40" r="24" fill="#EBF5FF" />
      <g transform="translate(24, 20)">
        <path d="M 5,45 Q 20,25 35,45 Z" fill="#10B981" stroke="#2B1D12" strokeWidth="2" />
        <circle cx="20" cy="18" r="8" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2" />
      </g>
      <g transform="translate(62, 32)">
        <line x1="5" y1="20" x2="5" y2="10" stroke="#8A6E58" strokeWidth="2.2" />
        <path d="M 5,10 Q 12,2 15,10" fill="none" stroke="#7BA655" strokeWidth="1.5" />
        <path d="M 5,14 Q -2,7 2,15" fill="none" stroke="#7BA655" strokeWidth="1.5" />
      </g>
    </svg>
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
  const [viewingStories, setViewingStories] = useState<boolean>(false);
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState<string>('All');

  const handleAddQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    onAddQuestion(questionInput.trim());
    setQuestionInput('');
  };

  const handleOpenResource = (resource: { name: string; link: string }) => {
    alert(`You are now leaving HopeHeart to visit ${resource.name}. Keep supporting yourself safely!`);
  };

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
          {subScreen === 'questions' && 'My Care Questions'}
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

              {/* Onboarding Assistant / Tell Us What's Happening */}
              <div className="bg-white border border-[#EDE9DE] p-6 rounded-[32px] shadow-xs space-y-5">
                <div className="space-y-1">
                  <h3 className="text-[16px] font-display font-black text-[#2B1D12] flex items-center gap-1.5">
                    🫶 Tell us what’s happening
                  </h3>
                  <p className="text-[12.5px] text-gray-550 font-semibold leading-normal">
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

              {/* Explore by support path */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-[15px] font-display font-black text-[#2B1D12] flex items-center gap-1.5">
                    Explore by support path
                  </h4>
                  <p className="text-[12.5px] text-gray-550 font-semibold block leading-tight">
                    Choose the journey that feels closest to your current experience.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SUPPORT_CATEGORIES.map((cat) => {
                    const isSelected = activeCategoryId === cat.id;
                    const pathDescription = 
                      cat.id === 'anxiety' ? '24 active circles' :
                      cat.id === 'parkinsons' ? '18 caregiver groups' :
                      cat.id === 'hallucinations' ? '8 safe spaces' :
                      '36 communities';

                    return (
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
                        className={`p-4 border rounded-[24px] text-center flex flex-col justify-between gap-3.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#1E1E1A] border-[#1E1E1A] text-white shadow-xs' 
                            : 'bg-white border-gray-200 text-gray-650 hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <div className="space-y-1 text-center">
                          <span className="text-[14px] font-display font-black block">
                            {cat.emoji} {cat.name}
                          </span>
                          <span className={`text-[10.5px] font-bold block ${isSelected ? 'text-orange-200' : 'text-gray-400'}`}>
                            {pathDescription}
                          </span>
                        </div>

                        {/* Custom path SVGs */}
                        <div className="py-1">
                          {cat.id === 'anxiety' && <AnxietyPathIllustration />}
                          {cat.id === 'parkinsons' && <ParkinsonsPathIllustration />}
                          {cat.id === 'hallucinations' && <HallucinationsPathIllustration />}
                          {cat.id === 'emotional-recovery' && <RecoveryPathIllustration />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Dynamic Category Details and Cards Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  id="active-category-details-area"
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
                      <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                        Empathetic peer-to-peer assistance and checklist tools within our community boundaries.
                      </p>
                    </div>

                    {/* Card grid for compact Available Support */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        // 1. Peer Listener (from activeCategory)
                        {
                          title: activeCategory.availableSupport[0].title,
                          description: activeCategory.availableSupport[0].description,
                          actionText: activeCategory.availableSupport[0].actionText,
                          targetPath: activeCategory.availableSupport[0].targetPath,
                          icon: <HandshakeIcon />
                        },
                        // 2. Support Circle (from activeCategory)
                        {
                          title: activeCategory.availableSupport[1].title,
                          description: activeCategory.availableSupport[1].description,
                          actionText: activeCategory.availableSupport[1].actionText,
                          targetPath: activeCategory.availableSupport[1].targetPath,
                          icon: <CirclesIcon />
                        },
                        // 3. Question List
                        {
                          title: '📋 Question List',
                          description: 'Save and manage questions to ask your doctor or specialist.',
                          actionText: 'Open Checklist →',
                          targetPath: 'questions_checklist',
                          icon: <QuestionListIcon />
                        },
                        // 4. Personal Stories
                        {
                          title: '📖 Personal Stories',
                          description: 'Read anonymous shared experiences from people who went through similar emotions.',
                          actionText: 'Read Stories →',
                          targetPath: 'personal_stories',
                          icon: <StoryBookIcon />
                        },
                        // 5. Caregiver Guides
                        {
                          title: '👨‍👩‍👧 Caregiver Guides',
                          description: 'Helpful emotional support guides for family members, friends, and caregivers.',
                          actionText: 'View Guides →',
                          targetPath: 'caregiver_guides',
                          icon: <CaregiverIcon />
                        },
                        // 6. Saved Resources
                        {
                          title: '🔖 Saved Resources',
                          description: 'Keep useful questions, stories, guides, and external resources in one private place.',
                          actionText: 'View Saved →',
                          targetPath: 'saved_resources',
                          icon: <SavedFolderIcon />
                        }
                      ].map((support, idx) => {
                        return (
                          <div 
                            key={idx}
                            className="bg-white border border-[#EDE9DE] rounded-2xl p-4 flex flex-row items-stretch justify-between gap-3 hover:shadow-2xs transition-all"
                          >
                            <div className="flex-1 flex flex-col justify-between space-y-3">
                              <div className="space-y-1.5">
                                <h5 className="font-display font-black text-[14px] text-gray-800 flex items-center gap-1.5 leading-tight">
                                  {support.title}
                                </h5>
                                <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                                  {support.description}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (support.targetPath === 'questions_checklist') {
                                    setSubScreen('questions');
                                  } else if (support.targetPath === 'personal_stories') {
                                    setViewingStories(true);
                                  } else if (support.targetPath === 'caregiver_guides') {
                                    alert("Opening HopeHeart Caregiver Guides: Checklists, communication tips, and emotional grounding tools for families.");
                                  } else if (support.targetPath === 'saved_resources') {
                                    alert("Saved Resources Checklist: 3 peer conversation bookmarks, 1 grounding guide, and 2 emergency directories saved securely.");
                                  } else {
                                    onNavigateTo(support.targetPath);
                                  }
                                }}
                                className="w-full py-2 bg-[#FCFAF5] hover:bg-[#FFF2EA] border border-[#EDE9DE] hover:border-[#FF7527]/30 text-gray-700 hover:text-[#FF7527] transition-all font-display font-extrabold text-[11.5px] rounded-xl cursor-pointer text-center"
                              >
                                {support.actionText}
                              </button>
                            </div>
                            
                            <div className="w-14 shrink-0 flex items-center justify-center border-l border-gray-100 pl-2 self-center">
                              {support.icon}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Trusted External Resources Section */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <h4 className="font-display font-black text-emerald-800 text-[15px] flex items-center gap-1.5">
                        🌍 Trusted External Resources
                      </h4>
                      <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                        These are external organizations verified by HopeHeart.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        ...activeCategory.externalResources.map(res => ({
                          name: res.name,
                          badge: res.badge,
                          mode: res.mode,
                          description: res.description,
                          boundary: res.boundary,
                          actionText: 'Open Resource →',
                          targetLink: res.link,
                          icon: getResourceIconComponent(res.illustration),
                          note: null
                        })),
                        // Card 4
                        {
                          name: 'Professional Directory',
                          badge: 'Directory',
                          mode: 'Search Finder',
                          description: 'Explore verified external directories for professional support.',
                          boundary: 'External Directory • Free Search',
                          actionText: 'Open Directory →',
                          targetLink: 'https://www.psychologytoday.com',
                          icon: <DirectoryIcon />,
                          note: null
                        },
                        // Card 5
                        {
                          name: 'Educational Guides',
                          badge: 'Guides',
                          mode: 'PDF / Info',
                          description: "Read simple guides about anxiety, grief, Parkinson's support, hallucination support, and recovery.",
                          boundary: 'MHA & NAMI Guides • 100% Free',
                          actionText: 'View Guides →',
                          targetLink: 'https://www.mhanational.org',
                          icon: <EduGuidesIcon />,
                          note: null
                        },
                        // Card 6
                        {
                          name: 'Emergency Help',
                          badge: 'Immediate Help',
                          mode: '24/7 Crisis',
                          description: 'Find urgent help guidance and crisis support options.',
                          boundary: 'Call / Text 988 • 100% Free',
                          actionText: 'View Help Options →',
                          targetLink: 'https://988lifeline.org',
                          icon: <EmergencyIcon />,
                          note: 'For immediate danger, contact your local emergency service.'
                        }
                      ].map((res, idx) => (
                        <div 
                          key={idx}
                          className="bg-white border border-[#EDE9DE] rounded-2xl p-4 flex flex-row items-stretch justify-between gap-3 hover:shadow-2xs transition-all"
                        >
                          <div className="flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded-md uppercase">
                                  {res.badge}
                                </span>
                                <span className="text-[10px] font-semibold text-gray-400">
                                  {res.mode}
                                </span>
                              </div>
                              <h5 className="font-display font-black text-gray-800 text-[13.5px] leading-tight">
                                {res.name}
                              </h5>
                              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                                {res.description}
                              </p>
                              {res.note && (
                                <p className="text-[10px] text-red-500 font-bold leading-normal italic mt-1">
                                  ⚠️ {res.note}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="text-[9.5px] bg-[#FCFAF5] rounded-lg border border-gray-150 p-2 font-semibold text-gray-400 leading-normal">
                                {res.boundary}
                              </div>
                              <button
                                onClick={() => handleOpenResource({ name: res.name, link: res.targetLink })}
                                className="w-full py-2 bg-[#FCFAF5] hover:bg-emerald-50 border border-gray-200 hover:border-emerald-250 text-gray-700 hover:text-[#065f46] font-display font-extrabold text-[11.5px] rounded-xl cursor-pointer transition-all text-center"
                              >
                                {res.actionText}
                              </button>
                            </div>
                          </div>

                          <div className="w-14 shrink-0 flex items-center justify-center border-l border-gray-100 pl-2 self-center">
                            {res.icon}
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

              {/* Personal Stories Modal */}
              <AnimatePresence>
                {viewingStories && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-[#EDE9DE] rounded-[32px] shadow-xl w-full max-w-lg overflow-hidden relative z-50 text-left"
                    >
                      {/* Modal Header */}
                      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FCFAF5]">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📖</span>
                          <div>
                            <h4 className="font-display font-black text-[#2B1D12] text-[18px]">
                              Personal Stories
                            </h4>
                            <p className="text-[12px] font-bold text-gray-400">
                              Anonymized community lived experiences
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setViewingStories(false)}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 cursor-pointer text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                        <p className="text-[12px] text-gray-450 font-semibold italic text-center px-4 leading-normal">
                          "Stories are shared by members anonymously to foster connection and understanding. No personal contact details or medical advice are included."
                        </p>

                        <div className="space-y-4">
                          {ANONYMOUS_STORIES.map((item, idx) => (
                            <div key={idx} className="bg-[#FCFAF5] border border-gray-150 rounded-2xl p-4.5 space-y-2.5">
                              <div className="flex justify-between items-center">
                                <span className="px-2.5 py-0.5 bg-[#FFF2EA] text-[#FF7527] border border-[#FFE4D6] rounded-full text-[10px] font-extrabold uppercase">
                                  {item.category}
                                </span>
                                <span className="text-[11px] text-gray-400 font-bold">
                                  {item.author}
                                </span>
                              </div>
                              <h5 className="font-display font-black text-gray-800 text-[14px]">
                                {item.title}
                              </h5>
                              <p className="text-[12.5px] text-gray-600 italic font-semibold leading-relaxed">
                                "{item.story}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="p-5 border-t border-gray-100 bg-[#FCFAF5] flex gap-3">
                        <button
                          onClick={() => {
                            setViewingStories(false);
                            onNavigateTo('share-safely');
                          }}
                          className="flex-1 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[13px] font-display font-black transition-colors cursor-pointer text-center"
                        >
                          Share Your Story
                        </button>
                        <button
                          onClick={() => setViewingStories(false)}
                          className="px-6 py-3 bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 rounded-xl text-[13px] font-display font-black transition-all cursor-pointer text-center"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
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
              {/* Header card with text on left, warm illustration on right */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-gray-100 pb-5">
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-display font-black text-gray-800 text-[20px] md:text-[22px] tracking-tight leading-none">
                    My Care Questions
                  </h3>
                  <p className="text-[13px] text-gray-500 font-semibold leading-relaxed">
                    Save questions you may want to ask a professional, caregiver, or trusted support person. Everything stays private unless you choose to share it.
                  </p>
                </div>
                <div className="shrink-0 bg-[#FFF8F4] p-3.5 rounded-2xl border border-orange-100/60 shadow-2xs self-center">
                  <CareQuestionsIllustration />
                </div>
              </div>

              {/* Core add form */}
              <form onSubmit={handleAddQuestion} className="flex gap-2.5">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Write a question about how you feel, what you need, or what you want to understand..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Save Question
                </button>
              </form>

              {/* Sample Helper suggestions with category filtering chips */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Helpful question ideas
                </span>
                
                {/* Category chips */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {QUESTION_CATEGORIES.map((cat) => {
                    const isSelected = selectedQuestionCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedQuestionCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition-all cursor-pointer select-none active:scale-95 ${
                          isSelected 
                            ? 'bg-[#FF7527] border-[#FF7527] text-white font-extrabold shadow-3xs' 
                            : 'bg-white border-[#EDE9DE] text-gray-650 hover:bg-[#FCFAF5] hover:border-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Filtered questions list */}
                <div className="flex flex-col gap-1.5">
                  {HELP_QUESTION_IDEAS.filter(q => q.categories.includes(selectedQuestionCategory)).map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onAddQuestion(q.text)}
                      className="bg-[#FCFAF5] hover:bg-[#FFF2EA] border border-[#EEE9DD] text-gray-650 hover:text-[#FF7527] text-[12px] font-semibold px-4 py-2.5 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>➕ {q.text}</span>
                      <span className="text-[10px] text-gray-400 font-normal">Add to list</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Questions Section */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                    Saved Questions ({savedQuestions.length})
                  </span>
                  <span className="text-[10.5px] text-gray-450 font-semibold italic flex items-center gap-1">
                    🔒 Your questions stay private unless you choose to share them.
                  </span>
                </div>
                
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-thin">
                  {savedQuestions.length === 0 ? (
                    <div className="text-center py-8 bg-[#FCFAF5] border border-dashed border-[#ECE6D9] rounded-2xl">
                      <span className="text-[28px]">📓</span>
                      <p className="text-[12px] text-gray-500 font-semibold mt-2">
                        Your question notebook is empty. Save or tap ideas above!
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
                            Share Question
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
                  💡 <strong>Tip:</strong> Keep this private list open on your screen when talking face-to-face with your support circle, doctor, or caregiver so that nothing is forgotten.
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
