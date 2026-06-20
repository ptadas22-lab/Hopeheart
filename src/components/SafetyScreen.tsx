import { motion } from 'motion/react';

interface SafetyScreenProps {
  onBack: () => void;
}

export default function SafetyScreen({ onBack }: SafetyScreenProps) {
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
    <div className="flex flex-col h-full bg-[#FCFAF5] font-sans select-none overflow-y-auto scrollbar-thin">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3 px-4 border-b border-[#E9E4D9] bg-white sticky top-0 z-20">
        <button 
          onClick={onBack}
          id="btn-back-safety"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12]"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[15px]">
          AI Safe Protections
        </span>
        <div className="w-9 h-9 flex items-center justify-center text-[18px]">
          🛡️
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1 pb-10">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[22px] mx-auto shadow-inner animate-pulse">
            🤖
          </div>
          <h2 className="font-display font-black text-[#2B1D12] text-[19px] leading-tight pt-1">
            HopeHeart keeps support safe
          </h2>
          <p className="text-[12px] text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
            Our real-time safe listener networks use specialized AI safety filtering to keep clinical boundaries clean and secure.
          </p>
        </div>

        {/* Dynamic visual representation of guardrails */}
        <div className="space-y-4">
          
          {/* ALLOWED SECTION */}
          <div className="bg-white border border-[#CDE1D7] rounded-3xl p-4.5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[12px] font-bold">
                ✓
              </span>
              <h3 className="font-display font-extrabold text-emerald-800 text-[14.5px] uppercase tracking-wide">
                Allowed in Communities
              </h3>
            </div>
            <div className="space-y-2.5">
              {allowedItems.map((item, i) => (
                <div key={i} className="flex gap-2.5 items-start pl-1">
                  <span className="text-[13px] text-emerald-600 mt-0.5">•</span>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-gray-800 leading-none">{item.text}</h4>
                    <p className="text-[11px] text-gray-500 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCKED SECTION */}
          <div className="bg-white border border-red-200 rounded-3xl p-4.5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[12px] font-bold">
                ×
              </span>
              <h3 className="font-display font-extrabold text-red-800 text-[14.5px] uppercase tracking-wide">
                Blocked / Filtered
              </h3>
            </div>
            <div className="space-y-2.5 font-sans">
              {blockedItems.map((item, i) => (
                <div key={i} className="flex gap-2.5 items-start pl-1">
                  <span className="text-[13px] text-red-500 mt-0.5">•</span>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-gray-800 leading-none">{item.text}</h4>
                    <p className="text-[11px] text-gray-500 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Explanation text */}
        <div className="p-4 bg-amber-50/50 border border-[#F3E2C4]/80 rounded-2xl space-y-1.5 text-[11px] text-amber-900 leading-relaxed font-semibold">
          <h4 className="uppercase tracking-wider font-mono text-[10px] text-amber-800 font-extrabold">How filters are triggered:</h4>
          <p>
            When typing in community chat boards or listener matching screens, our Safety model intercepts messages containing names of clinical medications, specific chemical compounds (milligrams/dosages), or instructional prescription claims.
          </p>
          <p>
            It keeps the community centered on emotions, and instantly reminds you to consult medical clinicians for physical treatment.
          </p>
        </div>

        {/* CTA to check Care Bridge screen */}
        <div className="bg-[#FAF8F3] border border-gray-100 p-4 rounded-xl text-center">
          <p className="text-[11px] text-gray-500 leading-normal font-semibold">
            Remember: <span className="text-gray-800">Only verified clinicians hold prescribing licenses.</span> Always use Professional Resources for professional support pathways.
          </p>
        </div>

      </div>
    </div>
  );
}
export { SafetyScreen };
