import React, { useState } from 'react';

export default function SafetyNotice() {
  const [activeGuide, setActiveGuide] = useState<'emergency' | 'crisis' | 'guidelines' | null>(null);

  const handleToggle = (type: 'emergency' | 'crisis' | 'guidelines') => {
    setActiveGuide((prev) => (prev === type ? null : type));
  };

  return (
    <div className="bg-[#FAF9F6] border border-[#EDE9DE] rounded-[28px] p-5 text-left shadow-3xs space-y-4 select-none">
      <div className="flex items-start gap-3.5">
        <span className="w-12 h-12 rounded-2xl bg-white border border-[#EADFC9] flex items-center justify-center text-[24px] shrink-0 shadow-3xs select-none">
          🛡️
        </span>
        <div className="space-y-1">
          <h4 className="font-display font-black text-[#2B1D12] text-[15px] leading-tight">
            Safety Notice
          </h4>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
            HopeHeart is a supportive community, not emergency medical care. If you are in crisis, please seek immediate help.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={() => handleToggle('emergency')}
          type="button"
          className="py-1.5 px-3.5 bg-white border border-[#F1E7D8] text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
        >
          Emergency Help
        </button>
        <button
          onClick={() => handleToggle('crisis')}
          type="button"
          className="py-1.5 px-3.5 bg-white border border-[#F1E7D8] text-[#FF7527] hover:bg-[#FFF8F2] hover:border-[#FFB27A] rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
        >
          Crisis Resources
        </button>
        <button
          onClick={() => handleToggle('guidelines')}
          type="button"
          className="py-1.5 px-3.5 bg-white border border-[#F1E7D8] text-gray-700 hover:bg-gray-50 rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
        >
          Safety Guidelines
        </button>
      </div>

      {activeGuide && (
        <div className="bg-white border border-[#EDE9DE]/50 rounded-2xl p-4 text-[12px] text-gray-600 font-semibold leading-relaxed animate-in fade-in duration-200 space-y-2">
          {activeGuide === 'emergency' && (
            <p>If you are in immediate danger of self-harm or medical emergency, please call your local emergency services (e.g. <strong className="text-red-700">911</strong> in the US, <strong className="text-red-700">999</strong> in the UK, or <strong className="text-red-700">112</strong> in Europe) immediately.</p>
          )}

          {activeGuide === 'crisis' && (
            <div>
              <p className="mb-2">Help is always available. You do not have to carry this weight alone:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-500">
                <li><strong className="text-gray-700">National Suicide Prevention:</strong> Call or text 988 (US/Canada).</li>
                <li><strong className="text-gray-700">Crisis Text Line:</strong> Text HOME to 741741.</li>
              </ul>
            </div>
          )}

          {activeGuide === 'guidelines' && (
            <div>
              <p className="mb-2">To keep this community safe and welcoming for everyone:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-500">
                <li><strong className="text-gray-700">Be Kind:</strong> Offer gentle support, not criticism or judgment.</li>
                <li><strong className="text-gray-755">Protect Privacy:</strong> Do not share personal emails, phone numbers, or addresses.</li>
                <li><strong className="text-gray-700">No Medical Advice:</strong> Share personal stories, not diagnosis or prescription guidance.</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
