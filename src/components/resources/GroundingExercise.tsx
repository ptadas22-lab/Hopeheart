import React, { useState } from 'react';

interface GroundingExerciseProps {
  onComplete: () => void;
}

const STEPS = [
  {
    step: 5,
    title: "👁️ 5 Sights",
    instruction: "Look around you and name 5 things you can see.",
    placeholder: "Name 5 things in your room, office, or outside...",
    count: 5
  },
  {
    step: 4,
    title: "✋ 4 Physical Feelings",
    instruction: "Pay attention to your body and notice 4 things you can touch.",
    placeholder: "e.g. hair, chair, ground beneath your boots, cold air...",
    count: 4
  },
  {
    step: 3,
    title: "👂 3 Sounds",
    instruction: "Listen quietly and identify 3 distinct sounds you hear.",
    placeholder: "e.g. clock ticking, distant traffic, hum of computer...",
    count: 3
  },
  {
    step: 2,
    title: "👃 2 Smells",
    instruction: "Sniff the air and name 2 scents you can smell.",
    placeholder: "e.g. soap, coffee, fresh air, wood...",
    count: 2
  },
  {
    step: 1,
    title: "❤️ 1 Positive Thought",
    instruction: "Recall or think of 1 positive thing about yourself or the present moment.",
    placeholder: "e.g. 'I am safe here', 'I am doing my best'...",
    count: 1
  }
];

export default function GroundingExercise({ onComplete }: GroundingExerciseProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(-1); // -1 means introductory screen
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  const activeStep = STEPS[currentStepIdx];

  const handleStart = () => {
    setCurrentStepIdx(0);
    setCheckedItems(new Array(STEPS[0].count).fill(false));
  };

  const handleToggleItem = (idx: number) => {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const allChecked = checkedItems.every(Boolean) && checkedItems.length > 0;

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setCheckedItems(new Array(STEPS[nextIdx].count).fill(false));
    } else {
      // Completed the 5-4-3-2-1 sequence!
      setCurrentStepIdx(-1);
      onComplete();
    }
  };

  const handleCancel = () => {
    setCurrentStepIdx(-1);
  };

  return (
    <div className="w-full text-left space-y-4 select-none p-5 bg-[#FFFDF9] border border-[#F1E7D8]/80 rounded-[28px]">
      {currentStepIdx === -1 ? (
        <div className="text-center py-6 space-y-6">
          <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[32px] mx-auto select-none">
            🧘
          </div>
          <div className="space-y-1">
            <h4 className="font-display font-black text-[#2B1D12] text-[17px]">
              🧘 5-4-3-2-1 Grounding Exercise
            </h4>
            <p className="text-[12.5px] text-gray-500 max-w-sm mx-auto leading-relaxed font-semibold">
              This exercise brings your focus back to the present moment by engaging all five of your senses.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="py-3 px-8 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-98 shadow-3xs"
          >
            Start Grounding
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-gray-150 pb-2">
            <h4 className="font-display font-black text-[#2B1D12] text-[16px]">
              🧘 Sensory Grounding
            </h4>
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
              Step {currentStepIdx + 1} of 5
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[14.5px] font-display font-black text-[#FF7527] block">
              {activeStep.title}
            </span>
            <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
              {activeStep.instruction}
            </p>
          </div>

          <div className="space-y-2.5">
            {checkedItems.map((checked, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleItem(idx)}
                className={`w-full p-3 border rounded-xl text-[13px] font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                  checked
                    ? 'bg-emerald-50/50 border-emerald-200 text-[#0F5132]'
                    : 'bg-white hover:bg-[#FFFBF7] border-gray-200 text-[#2B1D12]'
                }`}
              >
                <span>
                  {checked ? '✓ ' : '• '} Item {idx + 1}
                </span>
                {checked && <span className="text-[14px]">🌱</span>}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!allChecked}
              className="py-2.5 px-6 bg-[#FF7527] hover:bg-[#E96630] disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95"
            >
              {currentStepIdx === STEPS.length - 1 ? 'Finish' : 'Next Step'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
