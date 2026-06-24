interface ResourcesScreenProps {
  onBack: () => void;
}

const RESOURCE_CATEGORIES = [
  ['😟', 'Anxiety', 'bg-[#FFE7C8]'],
  ['🌿', 'Stress', 'bg-[#E5F5E8]'],
  ['🧍', 'Loneliness', 'bg-[#F2E9FF]'],
  ['☁️', 'Overthinking', 'bg-[#FFEAF2]'],
  ['🌙', 'Sleep & rest', 'bg-[#FFF2D8]'],
  ['🧘', 'Grounding exercises', 'bg-[#FFE8C8]'],
  ['〰️', 'Breathing exercises', 'bg-[#EEF3FA]'],
  ['💗', 'Self-kindness', 'bg-[#FFE4EC]']
];

const openInfoAlert = (title: string, body: string) => {
  alert(`${title}\n\n${body}`);
};

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

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-28 sm:pb-10 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 sm:p-7 lg:p-8 text-left overflow-hidden relative border border-orange-100/70 shadow-3xs">
          <div className="absolute -top-16 -right-10 w-44 h-44 bg-[#E8D9FF]/35 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 left-10 w-48 h-48 bg-[#FFD4BD]/25 rounded-full blur-2xl" />
          <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-5 sm:items-center">
            <div className="space-y-3">
              <h2 className="font-display font-black text-[#10213D] text-[24px] sm:text-[28px] leading-tight">Read when you are ready</h2>
              <p className="text-[14px] sm:text-[15px] text-[#56657C] font-bold leading-relaxed">
                Small steps only. No pressure.<br />
                You are not being forced to talk.
              </p>
            </div>
            <div className="justify-self-center sm:justify-self-end relative w-36 h-28 sm:w-44 sm:h-32 rounded-[28px] bg-white/45 border border-white/70 flex items-center justify-center shadow-3xs">
              <span className="absolute left-4 bottom-4 text-[24px]">🌿</span>
              <span className="absolute right-4 top-4 text-[20px]">✨</span>
              <span className="text-[58px] sm:text-[68px] drop-shadow-sm rotate-[-7deg]">📖</span>
              <span className="absolute right-8 bottom-5 text-[24px]">💛</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESOURCE_CATEGORIES.map(([icon, category, tone]) => (
            <div key={category} className="bg-white/88 border border-orange-100/70 rounded-[26px] p-4 sm:p-5 text-left shadow-3xs flex items-start gap-4 min-h-[128px]">
              <span className={`w-14 h-14 rounded-full ${tone} border border-white/80 flex items-center justify-center text-[26px] shrink-0 shadow-3xs`}>{icon}</span>
              <span className="flex-1 min-w-0 space-y-2">
                <span className="block font-display font-black text-[#10213D] text-[17px] leading-tight">{category}</span>
                <span className="block text-[13px] text-[#56657C] font-semibold leading-relaxed">A gentle place to learn, pause, and choose one small next step for yourself.</span>
              </span>
              <span className="text-[#10213D] text-[26px] leading-none mt-2 shrink-0">›</span>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF8EE]/90 border border-[#FFD5A6] rounded-[26px] p-4 sm:p-5 flex items-start gap-3 shadow-3xs">
          <span className="w-12 h-12 rounded-full bg-[#FFF1D8] border border-[#FFD5A6] flex items-center justify-center text-[24px] shrink-0">🛡️</span>
          <p className="text-[13px] sm:text-[14px] text-[#A05412] font-display font-black leading-relaxed">HopeHeart does not diagnose, prescribe, give dosage advice, or promise cures. For immediate danger, contact local emergency services or nearest emergency care.</p>
        </div>

        <footer className="text-center space-y-3 px-2 pb-2">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] sm:text-[13px] text-[#56657C] font-display font-black">
            <button onClick={() => openInfoAlert('Terms & Conditions', 'HopeHeart is for emotional support. Be kind, respectful, and protect your privacy.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Terms & Conditions</button>
            <button onClick={() => openInfoAlert('Privacy Policy', 'HopeHeart keeps MVP fallback data local on this device unless an existing app flow clearly says otherwise.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Privacy Policy</button>
            <button onClick={() => openInfoAlert('Emotional Support Disclaimer', 'HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Emotional Support Disclaimer</button>
          </div>
          <p className="max-w-xl mx-auto text-[12px] sm:text-[13px] text-[#6B7280] font-semibold leading-relaxed">HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.</p>
        </footer>
      </div>
    </div>
  );
}
