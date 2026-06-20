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
    name: 'Anxiety Support',
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
    name: "Parkinson's Support",
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
    name: 'Hallucination Support',
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
              {/* Hero Header */}
              <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/20 border border-emerald-100/70 rounded-3xl p-5 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 md:max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                    🧑‍⚕️ Verified External Resources
                  </div>
                  <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[26px] leading-snug">
                    Professional Resources
                  </h2>
                  <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium">
                    Sometimes emotional support is not enough.
                    <br />
                    HopeHeart can help you discover external professional resources when you feel ready.
                  </p>
                </div>
                <div className="shrink-0 flex items-center justify-end">
                  <div className="bg-white border border-emerald-100 rounded-3xl p-4 shadow-inner flex flex-col items-center justify-center text-center w-36">
                    <span className="text-[28px] mb-1">🛡️</span>
                    <span className="text-[9.5px] uppercase tracking-wider font-mono font-black text-[#FF7527] leading-tight">
                      Safe Resource Verification
                    </span>
                  </div>
                </div>
              </div>

              {/* Condition-based Category Selectors */}
              <div className="space-y-2.5">
                <label className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Select Support Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUPPORT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-display font-bold text-[12.5px] ${
                        activeCategoryId === cat.id 
                          ? 'bg-[#1E1E1A] text-white shadow-xs' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Category Card */}
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#EDE9DE] rounded-[32px] p-6 space-y-6 shadow-xs"
              >
                {/* Header info */}
                <div className="border-b border-gray-100 pb-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-[#FCFAF5] border border-gray-150 shadow-inner">
                      {activeCategory.emoji}
                    </span>
                    <div>
                      <h3 className="font-display font-black text-[#2B1D12] text-[20px]">
                        {activeCategory.name}
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

                {/* EXTERNAL PROFESSIONAL RESOURCES */}
                <div className="space-y-3 pt-2">
                  <div>
                    <h4 className="font-display font-black text-emerald-800 text-[15px] flex items-center gap-1.5">
                      🩺 External Professional Resources
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Verified directories, specialized helplines, and clinical consultation channels.
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
