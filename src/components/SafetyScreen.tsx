import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SafetyScreenProps {
  onBack: () => void;
}

type TabId = 'ai-protection' | 'guidelines' | 'report' | 'emergency';

export default function SafetyScreen({ onBack }: SafetyScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>('ai-protection');
  const [reportTarget, setReportTarget] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTarget.trim() || !reportDetails.trim()) return;
    alert(`Thank you for helping keep HopeHeart safe. Our AI safety moderators will review the report for ${reportTarget} immediately.`);
    setReportTarget('');
    setReportDetails('');
  };

  const allowedItems = [
    { text: 'Feelings', desc: 'Anxiety, hurt, grief, numbness, loneliness, or emotional burden.' },
    { text: 'Stories', desc: 'Sharing your unique journey, daily triumphs, and healing paths.' },
    { text: 'Kind words', desc: 'Empathetic validation, active supportive listening, & companionship.' },
    { text: 'Lived experiences', desc: 'Peer-to-peer discussions of chronic conditions or caregiver life.' },
  ];

  const blockedItems = [
    { text: 'Prescriptions', desc: 'Naming drugs, suggesting script adjustments, or drug combinations.' },
    { text: 'Diagnosis', desc: 'Claiming health outcomes, matching symptoms to specific conditions.' },
    { text: 'Medicine advice', desc: 'Dosages, pharmaceutical recommendations, or side-effect treatments.' },
    { text: 'Cure claims', desc: 'Cure promises, holistic instructions that replace verified care.' },
    { text: 'Judgment', desc: 'Criticism, trauma comparison, or demeaning peer input.' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FCFAF5] font-sans select-none overflow-y-auto scrollbar-thin w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3 px-4 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={onBack}
          id="btn-back-safety"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[15px]">
          Safety Hub
        </span>
        <div className="w-9 h-9 flex items-center justify-center text-[18px]">
          🛡️
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6 flex-1 max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="font-display font-black text-[#2B1D12] text-[20px] leading-tight">
            How HopeHeart Protects You
          </h2>
          <p className="text-[12px] text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
            We combine active peer filters, reporting tools, and guidelines to maintain clinical boundaries.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-[#EDE9DE] pb-4">
          {[
            { id: 'ai-protection', label: '🤖 AI Protection' },
            { id: 'guidelines', label: '📜 Guidelines' },
            { id: 'report', label: '🚩 Report User' },
            { id: 'emergency', label: '📞 Emergency' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-4 py-2.5 rounded-xl text-[12.5px] font-display font-bold border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1E1E1A] text-white border-[#1E1E1A] shadow-xs'
                  : 'bg-white text-gray-650 border-[#EDE9DE] hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'ai-protection' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="bg-[#FAF8F3] border border-orange-100 p-4 rounded-2xl">
                  <h3 className="font-display font-bold text-orange-700 text-[14px] mb-1">
                    Automated Content Filter
                  </h3>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    Our safety filters analyze messages in real-time. If medical prescriptions, dosage information, or clinical diagnosis claims are detected, the system blocks transmission and suggests seeking verified care.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Allowed Card */}
                  <div className="bg-white border border-[#CDE1D7] rounded-2xl p-4.5 shadow-2xs">
                    <h4 className="font-display font-extrabold text-emerald-800 text-[13px] uppercase mb-2 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">✓</span>
                      Allowed
                    </h4>
                    <ul className="space-y-2 text-[11.5px] text-gray-600 font-semibold">
                      {allowedItems.map((item, i) => (
                        <li key={i}>
                          <strong>{item.text}</strong>: {item.desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Blocked Card */}
                  <div className="bg-white border border-red-200 rounded-2xl p-4.5 shadow-2xs">
                    <h4 className="font-display font-extrabold text-red-800 text-[13px] uppercase mb-2 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-800 text-[10px] flex items-center justify-center font-bold">×</span>
                      Blocked
                    </h4>
                    <ul className="space-y-2 text-[11.5px] text-gray-600 font-semibold">
                      {blockedItems.map((item, i) => (
                        <li key={i}>
                          <strong>{item.text}</strong>: {item.desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'guidelines' && (
              <motion.div
                key="guidelines"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white border border-[#EDE9DE] p-5 rounded-3xl space-y-4 shadow-3xs"
              >
                <h3 className="font-display font-black text-gray-800 text-[16px]">
                  HopeHeart Code of Conduct
                </h3>
                <ul className="space-y-2.5 text-[12.5px] text-gray-650 font-semibold leading-relaxed list-disc list-inside">
                  <li><strong>Absolute Anonymity:</strong> Do not share phone numbers, social media handles, or home addresses in chats.</li>
                  <li><strong>No Prescribing or Diagnosing:</strong> Refrain from telling peers what medication to take or telling them they have a medical condition.</li>
                  <li><strong>Caregiver Validation:</strong> Celebrate the journey of caregivers supporting someone with Parkinson's or emotional exhaustion.</li>
                  <li><strong>Zero Tolerance for Abuse:</strong> Judgmental behavior, bullying, or inappropriate content results in immediate moderation blocks.</li>
                </ul>

                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl text-center">
                  <p className="font-display font-bold text-gray-700 text-[13px]">
                    "Community supports. AI protects. Professionals provide care."
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'report' && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white border border-[#EDE9DE] p-5 rounded-3xl shadow-3xs"
              >
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-gray-850 text-[15px] mb-1">
                      Flag a Safety Concern
                    </h3>
                    <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
                      Report users attempting clinical diagnosis, prescribing, or acting inappropriately.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                      Target User / Chat Room Name
                    </label>
                    <input
                      type="text"
                      value={reportTarget}
                      onChange={(e) => setReportTarget(e.target.value)}
                      placeholder="e.g. Voice123 or Anxiety Circle..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                      Details of Concern
                    </label>
                    <textarea
                      rows={3}
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Describe what occurred (attempts to prescribe, harassment, etc.)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-bold text-[14px] rounded-xl cursor-pointer"
                  >
                    Submit Safety Report
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'emergency' && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-white border border-[#EDE9DE] p-5 rounded-3xl shadow-3xs space-y-4"
              >
                <div>
                  <h3 className="font-display font-black text-gray-850 text-[15px] mb-1">
                    Emergency Support Pathways
                  </h3>
                  <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
                    HopeHeart is a peer-to-peer emotional space. If you are facing a medical emergency, threat of self-harm, or severe cognitive distress, please seek immediate real-world help:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: '🚨 Local emergency number', desc: 'Call your local emergency number immediately.' },
                    { title: '🏥 Nearby hospital / emergency care', desc: 'Go to the nearest hospital or urgent care clinic for direct physical evaluation.' },
                    { title: '👨‍👩‍👧 Trusted family contact', desc: 'Reach out to a family member, local caregiver, or trusted neighbor right away.' },
                    { title: '🌍 Verified crisis helpline directory', desc: 'Consult local public directories for verified state-supported emotional hotlines.' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-[#FCFAF5] border border-gray-150 rounded-xl space-y-1">
                      <h4 className="font-display font-extrabold text-[12.5px] text-gray-800 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-center text-[10.5px] text-amber-800 font-semibold">
                  ⚠️ <strong>Disclaimer:</strong> HopeHeart does not offer diagnostic evaluations or crisis helpline intervention services. Keep yourself safe first.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
