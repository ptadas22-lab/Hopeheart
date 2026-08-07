import React, { useState } from 'react';

export default function EmergencySupportCard() {
  const [expandedSection, setExpandedSection] = useState<'crisis' | 'helplines' | 'plan' | null>(null);

  const toggleSection = (section: 'crisis' | 'helplines' | 'plan') => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="bg-[#FEF6F5] border border-red-100 rounded-[28px] p-5 text-left shadow-3xs space-y-4 select-none">
      <div className="flex items-start gap-3.5">
        <span className="w-12 h-12 rounded-2xl bg-white border border-red-100 flex items-center justify-center text-[24px] shrink-0 shadow-3xs select-none">
          🛡️
        </span>
        <div className="space-y-1.5 flex-1">
          <h4 className="font-display font-black text-red-900 text-[16px] leading-tight">
            Emergency Support
          </h4>
          <p className="text-[12px] text-red-700/90 font-semibold leading-relaxed">
            If you're in immediate danger or think you may act on thoughts of harming yourself, contact your local emergency services immediately.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Accordion 1: I'm in Crisis */}
        <div className="border border-red-100 bg-white rounded-2xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('crisis')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
            aria-expanded={expandedSection === 'crisis'}
          >
            <span className="font-display font-black text-[#2B1D12] text-[13.5px] flex items-center gap-2">
              <span>🚨</span> I'm in Crisis
            </span>
            <span className="text-gray-400 font-bold text-[14px]">
              {expandedSection === 'crisis' ? '−' : '+'}
            </span>
          </button>
          
          {expandedSection === 'crisis' && (
            <div className="px-4 pb-4 text-[12.5px] text-gray-600 font-semibold leading-relaxed border-t border-red-50/50 pt-2.5 animate-in fade-in duration-200">
              <p className="mb-2">Please pause. Take three slow, long breaths out. You do not need to figure everything out right now.</p>
              <p>Tell yourself: <strong className="text-red-700">"This feeling is extremely painful, but it is temporary. I am safe in this room right now."</strong> Reach out to someone you trust, or use the helplines below.</p>
            </div>
          )}
        </div>

        {/* Accordion 2: Helplines */}
        <div className="border border-red-100 bg-white rounded-2xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('helplines')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
            aria-expanded={expandedSection === 'helplines'}
          >
            <span className="font-display font-black text-[#2B1D12] text-[13.5px] flex items-center gap-2">
              <span>☎</span> Helplines
            </span>
            <span className="text-gray-400 font-bold text-[14px]">
              {expandedSection === 'helplines' ? '−' : '+'}
            </span>
          </button>

          {expandedSection === 'helplines' && (
            <div className="px-4 pb-4 text-[12.5px] text-gray-600 font-semibold leading-relaxed border-t border-red-50/50 pt-2.5 space-y-2 animate-in fade-in duration-200">
              <div className="flex justify-between items-center bg-red-50/40 p-2 rounded-xl border border-red-100/50">
                <div>
                  <span className="font-black text-[#2B1D12]">National Suicide & Crisis Lifeline</span>
                  <p className="text-[11px] text-gray-500">Call or text anytime (US/Canada)</p>
                </div>
                <a href="tel:988" className="bg-[#FF5555] text-white py-1 px-3 rounded-lg font-black text-[11px] hover:bg-red-600 transition-all shrink-0">Call 988</a>
              </div>
              <div className="flex justify-between items-center bg-red-50/40 p-2 rounded-xl border border-red-100/50">
                <div>
                  <span className="font-black text-[#2B1D12]">Crisis Text Line</span>
                  <p className="text-[11px] text-gray-500">Text HOME to 741741</p>
                </div>
                <a href="sms:741741?&body=HOME" className="bg-gray-700 text-white py-1 px-3 rounded-lg font-black text-[11px] hover:bg-black transition-all shrink-0">Text HOME</a>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: My Safety Plan */}
        <div className="border border-red-100 bg-white rounded-2xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('plan')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
            aria-expanded={expandedSection === 'plan'}
          >
            <span className="font-display font-black text-[#2B1D12] text-[13.5px] flex items-center gap-2">
              <span>❤️</span> My Safety Plan
            </span>
            <span className="text-gray-400 font-bold text-[14px]">
              {expandedSection === 'plan' ? '−' : '+'}
            </span>
          </button>

          {expandedSection === 'plan' && (
            <div className="px-4 pb-4 text-[12.5px] text-gray-600 font-semibold leading-relaxed border-t border-red-50/50 pt-2.5 space-y-2 animate-in fade-in duration-200">
              <p>You can create a personal safety plan to remember what helps in difficult moments:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-500">
                <li><strong className="text-gray-700">My triggers:</strong> Notice changes in mood, feeling lonely or overwhelmed.</li>
                <li><strong className="text-gray-700">My coping:</strong> Use the breathing or grounding exercises in this Hub.</li>
                <li><strong className="text-gray-700">My support:</strong> Call a trusted family member, close peer, or support contact.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
