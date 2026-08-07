import React from 'react';
import BreathingExercise from './BreathingExercise';
import GroundingExercise from './GroundingExercise';
import BreakTimer from './BreakTimer';

interface QuickReliefSectionProps {
  onActivityOpened: (id: string) => void;
  searchQuery: string;
  activeExercise: string | null;
  setActiveExercise: (id: string | null) => void;
}

interface ReliefCard {
  id: string;
  title: string;
  desc: string;
  icon: string;
  bgClass: string;
}

const CARDS: ReliefCard[] = [
  { id: 'breathing', title: 'Breathing Exercise', desc: 'Inhale, hold, exhale to center yourself.', icon: '🌬', bgClass: 'bg-[#EEF3FA] text-[#1E3A8A]' },
  { id: 'grounding', title: 'Grounding (5-4-3-2-1)', desc: 'Connect with your immediate surroundings.', icon: '🧘', bgClass: 'bg-[#FFE8C8] text-[#78350F]' },
  { id: 'calm-sounds', title: 'Calm Sounds', desc: 'Listen to soothing, relaxing soundscapes.', icon: '🎵', bgClass: 'bg-[#F2E9FF] text-[#4C1D95]' },
  { id: 'break-timer', title: 'Take a Short Break', desc: 'Take 1, 3, or 5 minutes just to pause.', icon: '☕', bgClass: 'bg-[#FFF2D8] text-[#5C3E00]' }
];

export default function QuickReliefSection({
  onActivityOpened,
  searchQuery,
  activeExercise,
  setActiveExercise
}: QuickReliefSectionProps) {
  const filtered = CARDS.filter(card => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return card.title.toLowerCase().includes(term) ||
           card.desc.toLowerCase().includes(term);
  });

  const handleStart = (id: string) => {
    setActiveExercise(id);
    onActivityOpened(id);
  };

  const handleComplete = () => {
    setActiveExercise(null);
  };

  if (activeExercise) {
    return (
      <div className="space-y-4 text-left animate-in fade-in duration-300 select-none">
        <button
          onClick={() => setActiveExercise(null)}
          type="button"
          className="flex items-center gap-1.5 text-[12.5px] font-display font-black text-[#FF7527] hover:text-[#E96630] cursor-pointer"
        >
          <span>←</span> Back to Relief Grid
        </button>

        {activeExercise === 'breathing' && (
          <BreathingExercise onComplete={handleComplete} />
        )}
        {activeExercise === 'grounding' && (
          <GroundingExercise onComplete={handleComplete} />
        )}
        {activeExercise === 'break-timer' && (
          <BreakTimer onComplete={handleComplete} />
        )}
        {activeExercise === 'calm-sounds' && (
          <div className="w-full text-center space-y-5 select-none p-6 bg-[#FFFDF9] border border-[#F1E7D8]/80 rounded-[28px] py-10 animate-in fade-in duration-200">
            <span className="text-[48px] block animate-pulse">🎵</span>
            <div className="space-y-1">
              <h4 className="font-display font-black text-[#2B1D12] text-[17.5px]">Calm Sounds</h4>
              <p className="text-[12.5px] text-gray-500 font-semibold max-w-xs mx-auto leading-relaxed">
                Coming Soon. Ambient soundscapes are being prepared to offer custom background tracks.
              </p>
            </div>
            <button
              onClick={() => setActiveExercise(null)}
              type="button"
              className="py-2.5 px-6 bg-[#2B1D12] text-white rounded-xl text-[12px] font-display font-black cursor-pointer"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    );
  }

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3.5 select-none text-left">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
        Quick Relief
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((card) => (
          <div
            key={card.id}
            className="bg-white/85 border border-[#EDE9DE] rounded-[26px] p-5 text-left shadow-3xs flex items-start gap-4 hover:border-[#FFB27A]/40 transition-all min-h-[128px] relative group"
          >
            <span className={`w-14 h-14 rounded-full ${card.bgClass} border border-white flex items-center justify-center text-[26px] shrink-0 shadow-3xs select-none`}>
              {card.icon}
            </span>
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="space-y-0.5">
                <span className="block font-display font-black text-[#2B1D12] text-[16px] leading-tight">
                  {card.title}
                </span>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed line-clamp-2">
                  {card.desc}
                </p>
              </div>
              
              <button
                onClick={() => handleStart(card.id)}
                type="button"
                className="py-1.5 px-4 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
