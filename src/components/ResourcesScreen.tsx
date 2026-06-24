interface ResourcesScreenProps {
  onBack: () => void;
}

const RESOURCE_CATEGORIES = [
  'Anxiety',
  'Stress',
  'Loneliness',
  'Overthinking',
  'Sleep & rest',
  'Grounding exercises',
  'Breathing exercises',
  'Self-kindness'
];

export default function ResourcesScreen({ onBack }: ResourcesScreenProps) {
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
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Resources</span>
        <span className="text-[20px] select-none">📚</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 space-y-2 text-center">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Read when you are ready</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Small steps only. No pressure. You are not being forced to talk.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RESOURCE_CATEGORIES.map((category) => (
            <div key={category} className="hh-surface rounded-2xl p-4 space-y-2">
              <h3 className="font-display font-black text-gray-800 text-[14px]">{category}</h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">A gentle place to learn, pause, and choose one small next step for yourself.</p>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF8EE] border border-orange-100 rounded-2xl p-4 text-center">
          <p className="text-[12px] text-[#A16207] font-bold leading-relaxed">HopeHeart does not diagnose, prescribe, give dosage advice, or promise cures. For immediate danger, contact local emergency services or nearest emergency care.</p>
        </div>
      </div>
    </div>
  );
}
