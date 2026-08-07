import React, { useState, useEffect } from 'react';

export interface SafetyPlan {
  warningSigns: string;
  copingStrategies: string;
  contacts: string;
  safePlaces: string;
  professionalResources: string;
}

interface SafetyPlanCardProps {
  onSavePlan: (plan: SafetyPlan) => void;
}

export default function SafetyPlanCard({ onSavePlan }: SafetyPlanCardProps) {
  const [warningSigns, setWarningSigns] = useState('');
  const [copingStrategies, setCopingStrategies] = useState('');
  const [contacts, setContacts] = useState('');
  const [safePlaces, setSafePlaces] = useState('');
  const [professionalResources, setProfessionalResources] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const key = 'hopeheart_safety_plan';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWarningSigns(parsed.warningSigns || '');
        setCopingStrategies(parsed.copingStrategies || '');
        setContacts(parsed.contacts || '');
        setSafePlaces(parsed.safePlaces || '');
        setProfessionalResources(parsed.professionalResources || '');
      } catch (e) {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = {
      warningSigns: warningSigns.trim(),
      copingStrategies: copingStrategies.trim(),
      contacts: contacts.trim(),
      safePlaces: safePlaces.trim(),
      professionalResources: professionalResources.trim()
    };
    onSavePlan(plan);
    setSaveStatus('Safety Plan saved safely.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
          Personal Safety Plan
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Prepare a safety plan to guide yourself and your support circle through difficult moments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#EDE9DE] rounded-[28px] p-5 space-y-4 shadow-3xs">
        <div className="space-y-1">
          <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
            1. My Warning Signs
          </label>
          <textarea
            rows={2}
            value={warningSigns}
            onChange={(e) => setWarningSigns(e.target.value)}
            placeholder="e.g. feeling isolated, racing thoughts, lack of sleep..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527] resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
            2. Helpful Coping Strategies
          </label>
          <textarea
            rows={2}
            value={copingStrategies}
            onChange={(e) => setCopingStrategies(e.target.value)}
            placeholder="e.g. 5-4-3-2-1 grounding, walk in park, breathing reset..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527] resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
            3. People I Can Contact
          </label>
          <textarea
            rows={2}
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            placeholder="e.g. Sister Emily (555-0199), Dr. Green (555-0210)..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527] resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
            4. Places that Help Me Feel Safe
          </label>
          <textarea
            rows={2}
            value={safePlaces}
            onChange={(e) => setSafePlaces(e.target.value)}
            placeholder="e.g. quiet bedroom corner, community center library, local botanic garden..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527] resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
            5. Professional Support Resources
          </label>
          <textarea
            rows={2}
            value={professionalResources}
            onChange={(e) => setProfessionalResources(e.target.value)}
            placeholder="e.g. National Suicide Prevention Lifeline (988), local hospital clinic..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527] resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          Save Safety Plan
        </button>

        {saveStatus && (
          <p className="text-center text-[12px] text-emerald-600 font-extrabold">
            ✓ {saveStatus}
          </p>
        )}
      </form>
    </div>
  );
}
