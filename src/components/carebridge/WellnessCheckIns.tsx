import React from 'react';

interface WellnessCheckInsProps {
  frequency: string;
  onChangeFrequency: (freq: string) => void;
}

const OPTIONS = [
  { id: 'only-choose', label: 'Only When I Choose', desc: 'No automatic updates. Share check-ins manually whenever you feel comfortable.' },
  { id: 'weekly', label: 'Weekly Summary', desc: 'Send a quiet, private summary of my weekly check-ins every Sunday.' },
  { id: 'monthly', label: 'Monthly Summary', desc: 'Send a quiet, private summary of my monthly check-ins on the first of each month.' },
  { id: 'never', label: 'Never Share', desc: 'Never send updates to my trusted circle. Stays fully private on this device.' }
];

export default function WellnessCheckIns({
  frequency,
  onChangeFrequency
}: WellnessCheckInsProps) {
  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
          Wellness Sharing Schedule
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Decide how often your trusted contacts receive summary updates. You can change this anytime.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const selected = frequency === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChangeFrequency(opt.id)}
              type="button"
              className={`p-4 border rounded-[22px] text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                selected
                  ? 'bg-orange-50 border-[#FF7527] text-[#2B1D12]'
                  : 'bg-white border-gray-200 text-[#2B1D12] hover:bg-[#FFF8F2]'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selected ? 'border-[#FF7527]' : 'border-gray-300'
                }`}>
                  {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#FF7527]" />}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="block font-display font-black text-[14px]">
                  {opt.label}
                </span>
                <p className="text-[12px] text-gray-500 font-semibold leading-normal">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
