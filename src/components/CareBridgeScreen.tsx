import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorQuestion } from '../types';

interface CareBridgeScreenProps {
  onBack: () => void;
  savedQuestions: DoctorQuestion[];
  onAddQuestion: (text: string) => void;
  onDeleteQuestion: (id: string) => void;
}

type SubScreen = 'suggestions' | 'questions';

interface Resource {
  name: string;
  category: '🧠 Mental Wellness' | '🩺 Medical Specialists' | '🌱 Long-Term Support';
  description: string;
  boundary: string;
  badge: string;
  link: string;
  mode: string;
}

const RESOURCES_DATA: Resource[] = [
  // 🧠 Mental Wellness
  {
    name: 'Talkspace Therapy',
    category: '🧠 Mental Wellness',
    description: 'Online therapy platform connecting you with licensed therapists for text, audio, and video support.',
    boundary: 'External resource • Subscription options',
    badge: 'Online Support',
    link: 'https://www.talkspace.com',
    mode: 'Text & Video Chat'
  },
  {
    name: 'Crisis Text Line',
    category: '🧠 Mental Wellness',
    description: 'Free, 24/7, confidential text support for people in crisis. Text HOME to 741741.',
    boundary: 'External resource • 100% Free',
    badge: 'Immediate Help',
    link: 'https://www.crisistextline.org',
    mode: 'Text Support'
  },
  {
    name: 'BetterHelp Online',
    category: '🧠 Mental Wellness',
    description: 'Professional online therapy platform matching you with credentialed, experienced counselors.',
    boundary: 'External resource • Subscription options',
    badge: 'Professional Therapy',
    link: 'https://www.betterhelp.com',
    mode: 'Virtual Sessions'
  },

  // 🩺 Medical Specialists
  {
    name: 'General Practitioner Directory',
    category: '🩺 Medical Specialists',
    description: 'Search engines to find local verified general medical practitioners for physical health check-ups and advice.',
    boundary: 'External resource • Insurance eligible',
    badge: 'Clinic Finder',
    link: 'https://www.zocdoc.com',
    mode: 'Clinic Appointments'
  },
  {
    name: 'Clinical Psychiatry Registry',
    category: '🩺 Medical Specialists',
    description: 'External directories of psychiatrists for clinical diagnostic medical evaluations and prescription oversight.',
    boundary: 'External resource • Clinic consultations',
    badge: 'Medication Care',
    link: 'https://www.psychologytoday.com',
    mode: 'In-person / Online'
  },
  {
    name: 'Neurological Somatic Directory',
    category: '🩺 Medical Specialists',
    description: 'Specialized clinical directories to search for motor coordination, motor assessment, or somatic tremor specialists.',
    boundary: 'External resource • Medical evaluation',
    badge: 'Specialist Search',
    link: 'https://www.neurology.org',
    mode: 'Clinic Visits'
  },

  // 🌱 Long-Term Support
  {
    name: 'NAMI Peer Networks',
    category: '🌱 Long-Term Support',
    description: 'National Alliance on Mental Illness support directories offering free peer groups, advocacy, and education.',
    boundary: 'External resource • 100% Free',
    badge: 'Grassroots Community',
    link: 'https://www.nami.org',
    mode: 'Community Groups'
  },
  {
    name: 'Support Groups Central',
    category: '🌱 Long-Term Support',
    description: 'Virtual peer support groups facilitated by trained leaders for anxiety, depression, recovery, and wellness.',
    boundary: 'External resource • Free & low cost',
    badge: 'Facilitated Sharing',
    link: 'https://www.supportgroupscentral.com',
    mode: 'Video Groups'
  },
  {
    name: 'Caregiver Support Alliance',
    category: '🌱 Long-Term Support',
    description: 'Resources, checklists, and support networks for individuals caring for family members with chronic medical needs.',
    boundary: 'External resource • 100% Free',
    badge: 'Caregiver Support',
    link: 'https://www.familycaregiver.org',
    mode: 'Intake Resources'
  }
];

export default function CareBridgeScreen({
  onBack,
  savedQuestions,
  onAddQuestion,
  onDeleteQuestion,
}: CareBridgeScreenProps) {
  const [subScreen, setSubScreen] = useState<SubScreen>('suggestions');
  const [filterType, setFilterType] = useState<'🧠 Mental Wellness' | '🩺 Medical Specialists' | '🌱 Long-Term Support'>('🧠 Mental Wellness');
  const [questionInput, setQuestionInput] = useState<string>('');

  const handleAddQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    onAddQuestion(questionInput.trim());
    setQuestionInput('');
  };

  const handleOpenResource = (resource: Resource) => {
    alert(`You are now leaving HopeHeart to visit ${resource.name}. Keep supporting yourself safely!`);
  };

  const exampleQuestions = [
    'Why do I feel anxious often?',
    'What should I do when panic starts?',
    'Do I need therapy?',
    'Should I meet a specialist?',
    'What support options are right for me?'
  ];

  const filteredResources = RESOURCES_DATA.filter(res => res.category === filterType);

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
          {subScreen === 'questions' && 'Doctor Question List'}
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
                    Sometimes emotional support is not enough. HopeHeart can help you discover external professional resources when you feel ready.
                  </p>
                  <p className="text-[11.5px] text-gray-400 italic">
                    HopeHeart does not diagnose you. These are resource directories, not medical decisions.
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

              {/* Resource Filter Categories */}
              <div className="space-y-2.5">
                <label className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Select Resource Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['🧠 Mental Wellness', '🩺 Medical Specialists', '🌱 Long-Term Support'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-display font-bold text-[12.5px] ${
                        filterType === type 
                          ? 'bg-[#1E1E1A] text-white shadow-xs' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredResources.map((res, idx) => (
                  <motion.div
                    key={res.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-[#EDE9DE] rounded-3xl p-5 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                          {res.badge}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400">
                          {res.mode}
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-gray-800 text-[16px] leading-tight">
                        {res.name}
                      </h4>
                      <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed">
                        {res.description}
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      <div className="text-[11px] bg-[#FCFAF5] rounded-xl border border-gray-100 p-2.5 font-semibold text-gray-500">
                        {res.boundary}
                      </div>
                      <button
                        onClick={() => handleOpenResource(res)}
                        className="w-full py-2.5 bg-[#FAF8F5] border border-gray-200 hover:bg-[#FF7527] hover:text-white transition-all text-gray-700 font-display font-extrabold text-[12.5px] rounded-xl cursor-pointer"
                      >
                        Open Resource →
                      </button>
                    </div>
                  </motion.div>
                ))}
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
                  Save Questions for Doctor
                </h3>
                <p className="text-[13px] text-gray-500 font-semibold">
                  Write down what you want to ask during your upcoming general practitioner appointment. We keep it ready for you!
                </p>
              </div>

              {/* Core add form */}
              <form onSubmit={handleAddQuestion} className="flex gap-2.5">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Ask about symptoms, pills, dosage, or anxiety triggers..."
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

              {/* Active Questions Container */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                  Your Active Saved Questions Checklist ({savedQuestions.length})
                </span>
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-thin">
                  {savedQuestions.length === 0 ? (
                    <div className="text-center py-8 bg-[#FCFAF5] border border-dashed border-[#ECE6D9] rounded-2xl">
                      <span className="text-[28px]">📜</span>
                      <p className="text-[12px] text-gray-500 font-semibold mt-2">
                        Your clinical clipboard is empty. Save questions above!
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
                  💡 <strong>Tip:</strong> Keep this list open on your phone screen when talking face-to-face with your physician so that no important bodily symptoms are left unaddressed!
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
