import { useRef, useState } from 'react';
import { saveCommunityActivity, type CommunityActivityAction, type CommunityActivityCategory } from '../services/communityActivity';

interface CommunityScreenProps {
  onBack: () => void;
}

interface CommunityCard {
  title: string;
  tone: string;
  border: string;
  art: string;
  accent: string;
  category: CommunityActivityCategory;
  activityKey: string;
  panelText: string;
}

const chatCategories = ['Calm chat', 'Music comfort', 'Pet comfort', 'Bike lovers', 'Movie comfort', 'Anxiety support', 'Stress support', 'Loneliness support'];
const exerciseCategories = ['Breathing reset', 'Grounding exercise', 'Gentle stretch', 'Short walk reminder', 'Calm body scan', '5-minute reset'];
const guidanceCategories = ['When anxiety feels heavy', 'When your mind won’t stop', 'When you feel lonely but don’t want to talk', 'How to write what you feel', 'How to save a good memory', 'When to seek urgent help'];

const visibleChatCards: CommunityCard[] = [
  {
    title: chatCategories[0],
    tone: 'from-[#F5F0FF] to-[#EFE7FF]',
    border: 'border-[#DACBFF]',
    art: '☕',
    accent: '💬',
    category: 'chat',
    activityKey: 'calm_chat',
    panelText: 'A quiet space to start with gentle words when you feel ready.'
  },
  {
    title: chatCategories[1],
    tone: 'from-[#FFF7E6] to-[#FFEED0]',
    border: 'border-[#FFD89B]',
    art: '🎧',
    accent: '♪',
    category: 'chat',
    activityKey: 'music_comfort',
    panelText: 'Use music as a small comfort cue while you settle your feelings.'
  },
  {
    title: chatCategories[2],
    tone: 'from-[#FFF0F4] to-[#FFE5EB]',
    border: 'border-[#FFD0DC]',
    art: '🐶',
    accent: '💗',
    category: 'chat',
    activityKey: 'pet_comfort',
    panelText: 'A soft reminder of warmth, care, and safe companionship.'
  }
];

const visibleExerciseCards: CommunityCard[] = [
  {
    title: exerciseCategories[0],
    tone: 'from-[#EFFAF0] to-[#E2F4E5]',
    border: 'border-[#C8E8D0]',
    art: '🌬️',
    accent: '🌿',
    category: 'exercise',
    activityKey: 'breathing_reset',
    panelText: 'Take one slow pause and return gently to the present moment.'
  },
  {
    title: exerciseCategories[1],
    tone: 'from-[#EEF8FF] to-[#DFF0FF]',
    border: 'border-[#C8E2FF]',
    art: '🪨',
    accent: '🌱',
    category: 'exercise',
    activityKey: 'grounding_exercise',
    panelText: 'Notice what is around you and let your body feel a little steadier.'
  },
  {
    title: exerciseCategories[2],
    tone: 'from-[#FFF7E6] to-[#FFEBC8]',
    border: 'border-[#FFDCA8]',
    art: '🧘',
    accent: '🪴',
    category: 'exercise',
    activityKey: 'gentle_stretch',
    panelText: 'A tiny movement can help your body feel less stuck.'
  }
];

const visibleGuidanceCards: CommunityCard[] = [
  {
    title: guidanceCategories[0],
    tone: 'from-[#F4E9FF] to-[#EEE2FF]',
    border: 'border-[#D9C5FF]',
    art: '☁️',
    accent: '🫶',
    category: 'guidance',
    activityKey: 'anxiety_feels_heavy',
    panelText: 'Read a gentle support note for moments that feel emotionally heavy.'
  },
  {
    title: guidanceCategories[1],
    tone: 'from-[#EAF6FF] to-[#DFF0FF]',
    border: 'border-[#C8E2FF]',
    art: '🧠',
    accent: '💭',
    category: 'guidance',
    activityKey: 'mind_wont_stop',
    panelText: 'A soft reminder that you can slow down one thought at a time.'
  },
  {
    title: guidanceCategories[3],
    tone: 'from-[#FFF1E8] to-[#FFE1D1]',
    border: 'border-[#FFC9B2]',
    art: '✍️',
    accent: '🌿',
    category: 'guidance',
    activityKey: 'write_what_you_feel',
    panelText: 'Try naming your feeling in simple words, without judging it.'
  }
];

const openInfoAlert = (title: string, body: string) => {
  alert(`${title}\n\n${body}`);
};

function ImageCard({ card, onSelect }: { card: CommunityCard; onSelect: (card: CommunityCard) => void }) {
  const { title, tone, border, art, accent } = card;

  return (
    <button onClick={() => onSelect(card)} type="button" className={`text-left rounded-[22px] min-h-[158px] p-3.5 bg-gradient-to-br ${tone} border ${border} shadow-3xs flex flex-col justify-between overflow-hidden relative cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FFB88A]/60`}>
      <h4 className="relative z-10 text-center font-display font-black text-[#1F2937] text-[13px] sm:text-[14px] leading-tight">{title}</h4>
      <div className="relative z-10 flex-1 flex items-center justify-center py-3">
        <div className="relative w-20 h-20 rounded-full bg-white/45 flex items-center justify-center shadow-3xs">
          <span className="text-[42px] drop-shadow-sm">{art}</span>
          <span className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-white/80 border border-white flex items-center justify-center text-[16px]">{accent}</span>
        </div>
      </div>
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/35" />
    </button>
  );
}

function CommunitySection({ sectionRef, icon, title, subtitle, cards, onCardSelect }: { sectionRef: React.RefObject<HTMLDivElement>; icon: string; title: string; subtitle: string; cards: CommunityCard[]; onCardSelect: (card: CommunityCard) => void }) {
  return (
    <section ref={sectionRef} className="space-y-3 scroll-mt-28">
      <div className="space-y-0.5">
        <h3 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight"><span>{icon}</span> {title}</h3>
        <p className="text-[13px] text-[#6B7280] font-bold leading-relaxed">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card) => <ImageCard key={card.title} card={card} onSelect={onCardSelect} />)}
      </div>
    </section>
  );
}

export default function CommunityScreen({ onBack }: CommunityScreenProps) {
  const [activeSection, setActiveSection] = useState<'chat' | 'exercise' | 'guidance'>('chat');
  const [selectedCard, setSelectedCard] = useState<CommunityCard | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);
  const exerciseRef = useRef<HTMLDivElement>(null);
  const guidanceRef = useRef<HTMLDivElement>(null);

  const jumpToSection = (section: 'chat' | 'exercise' | 'guidance') => {
    setActiveSection(section);
    const target = section === 'chat' ? chatRef.current : section === 'exercise' ? exerciseRef.current : guidanceRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const recordCommunityActivity = async (card: CommunityCard, action: CommunityActivityAction) => {
    await saveCommunityActivity({
      category: card.category,
      activityKey: card.activityKey,
      activityTitle: card.title,
      action
    });
  };

  const handleCardSelect = (card: CommunityCard) => {
    setSelectedCard(card);
    setSaveStatus('');
    void recordCommunityActivity(card, 'opened');
  };

  const handleSaveForLater = async () => {
    if (!selectedCard) return;
    setSaveStatus('Saving...');
    const result = await saveCommunityActivity({
      category: selectedCard.category,
      activityKey: selectedCard.activityKey,
      activityTitle: selectedCard.title,
      action: 'saved'
    });
    setSaveStatus(result.ok ? 'Saved for later.' : 'Saved locally for now.');
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button onClick={onBack} type="button" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs">
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Community</span>
        <span className="text-[20px] select-none">🤝</span>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-28 sm:pb-10 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-6 sm:p-8 text-center space-y-3 border border-orange-100/70 shadow-3xs">
          <h2 className="font-display font-black text-[#2B1D12] text-[26px] sm:text-[30px] leading-tight">Optional Community</h2>
          <p className="max-w-lg mx-auto text-[14px] sm:text-[15px] text-gray-500 font-bold leading-relaxed">No pressure to talk. Browse quietly. Join only when ready.</p>
        </div>

        <div className="bg-white/88 border border-orange-100/70 rounded-[30px] p-1.5 shadow-3xs grid grid-cols-3 gap-1.5 sticky top-[76px] z-10 backdrop-blur-sm">
          {[
            ['chat', '💬', 'Chat'],
            ['exercise', '🌿', 'Exercise'],
            ['guidance', '🧭', 'Guidance']
          ].map(([id, icon, label]) => (
            <button key={id} onClick={() => jumpToSection(id as 'chat' | 'exercise' | 'guidance')} type="button" className={`rounded-[24px] py-3 px-2 font-display font-black text-[12px] sm:text-[14px] cursor-pointer transition-all flex items-center justify-center gap-1.5 ${activeSection === id ? 'bg-gradient-to-br from-[#FFE8DE] to-[#FFF1EA] text-[#2B1D12] shadow-3xs' : 'text-gray-600 hover:bg-[#FFF8F2]'}`}>
              <span className="text-[18px]">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="hh-surface rounded-[32px] p-4 sm:p-6 space-y-7 border border-orange-100/70 shadow-3xs">
          <CommunitySection sectionRef={chatRef} icon="💬" title="Chat" subtitle="Kind words. Safe space." cards={visibleChatCards} onCardSelect={handleCardSelect} />
          <CommunitySection sectionRef={exerciseRef} icon="🌿" title="Exercise" subtitle="Small steps. Big difference." cards={visibleExerciseCards} onCardSelect={handleCardSelect} />
          <CommunitySection sectionRef={guidanceRef} icon="🧭" title="Guidance" subtitle="Supportive tips for tough moments." cards={visibleGuidanceCards} onCardSelect={handleCardSelect} />
        </div>

        {selectedCard && (
          <div className="bg-white/92 border border-orange-100/80 rounded-[30px] p-5 shadow-3xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#FF7527] font-display font-black">Gentle support</p>
                <h3 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">{selectedCard.title}</h3>
                <p className="text-[13px] sm:text-[14px] text-[#6B7280] font-bold leading-relaxed">{selectedCard.panelText}</p>
              </div>
              <button onClick={() => setSelectedCard(null)} type="button" className="w-9 h-9 rounded-full bg-[#FFF8F2] border border-orange-100 text-[#2B1D12] font-black hover:bg-white cursor-pointer">×</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleSaveForLater} type="button" className="flex-1 rounded-[20px] bg-[#2B1D12] text-white font-display font-black text-[13px] py-3 shadow-3xs hover:opacity-95 active:scale-[0.98] transition-all">Save this for later</button>
              <button onClick={() => setSelectedCard(null)} type="button" className="flex-1 rounded-[20px] bg-[#FFF8F2] border border-orange-100 text-[#2B1D12] font-display font-black text-[13px] py-3 hover:bg-white active:scale-[0.98] transition-all">Close</button>
            </div>
            {saveStatus && <p className="text-center text-[12px] text-[#6B7280] font-bold">{saveStatus}</p>}
          </div>
        )}

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
