import { MoodConfig } from '../types';

interface MoodScreenProps {
  onBack: () => void;
  selectedMood: MoodConfig;
  checkinCount: number;
}

export default function MoodScreen({ onBack, selectedMood, checkinCount }: MoodScreenProps) {
  const lastMood = localStorage.getItem('hopeheart_last_checkin_mood') || selectedMood.label;
  const lastDate = localStorage.getItem('hopeheart_last_checkin_date');
  const recentMood = lastMood || 'Not checked in yet';
  const patternText = checkinCount > 1
    ? `You have checked in ${checkinCount} times. Notice what helps you feel steady, one day at a time.`
    : 'Start with one gentle check-in. Patterns become clearer after a few reflections.';

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Mood</span>
        <span className="text-[20px] select-none">🌤️</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 space-y-3 text-center">
          <span className="text-[36px] block">{selectedMood.emoji}</span>
          <div>
            <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Today's mood</span>
            <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">{selectedMood.label}</h2>
          </div>
          <p className="text-[12.5px] text-gray-500 font-semibold italic leading-relaxed">“{selectedMood.tagline}”</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="hh-surface rounded-3xl p-4 space-y-2">
            <h3 className="font-display font-black text-gray-800 text-[14px]">Recent check-in</h3>
            <p className="text-[13px] text-gray-600 font-semibold">{recentMood}</p>
            <p className="text-[11px] text-gray-400 font-bold">{lastDate ? `Saved on ${lastDate}` : 'No date saved yet'}</p>
          </div>
          <div className="hh-surface rounded-3xl p-4 space-y-2">
            <h3 className="font-display font-black text-gray-800 text-[14px]">Mood pattern</h3>
            <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">{patternText}</p>
          </div>
        </div>

        <div className="bg-[#FFF8EE] border border-orange-100 rounded-2xl p-4 text-center">
          <p className="text-[12px] text-[#A16207] font-bold leading-relaxed">This is for self-reflection, not diagnosis.</p>
        </div>
      </div>
    </div>
  );
}
