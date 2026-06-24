interface CommunityScreenProps {
  onBack: () => void;
}

const chatCategories = ['Calm chat', 'Music comfort', 'Pet comfort', 'Bike lovers', 'Movie comfort', 'Anxiety support', 'Stress support', 'Loneliness support'];
const exerciseCategories = ['Breathing reset', 'Grounding exercise', 'Gentle stretch', 'Short walk reminder', 'Calm body scan', '5-minute reset'];
const guidanceCategories = ['When anxiety feels heavy', 'When your mind won’t stop', 'When you feel lonely but don’t want to talk', 'How to write what you feel', 'How to save a good memory', 'When to seek urgent help'];

function CategorySection({ title, emoji, items }: { title: string; emoji: string; items: string[] }) {
  return (
    <div className="hh-surface rounded-3xl p-5 space-y-3">
      <h3 className="font-display font-black text-gray-800 text-[15px]"><span>{emoji}</span> {title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="bg-white/80 border border-orange-100/60 rounded-2xl p-3">
            <span className="text-[12.5px] text-gray-700 font-bold">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommunityScreen({ onBack }: CommunityScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button onClick={onBack} type="button" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs">
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Community</span>
        <span className="text-[20px] select-none">🤝</span>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 text-center space-y-2">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Optional Community</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">No pressure to talk. Browse quietly. Join only when ready.</p>
        </div>
        <CategorySection title="Chat" emoji="💬" items={chatCategories} />
        <CategorySection title="Exercise" emoji="🌿" items={exerciseCategories} />
        <CategorySection title="Guidance" emoji="🧭" items={guidanceCategories} />
      </div>
    </div>
  );
}
