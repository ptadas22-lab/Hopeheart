import { useState } from 'react';
import { ScreenId } from '../types';
import { saveDiaryEntry, saveMemoryEntry, saveRememberMeDetails } from '../services/mySpaceData';

interface MySpaceScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: ScreenId) => void;
}

interface DiaryEntry {
  id: string;
  title?: string;
  mood?: string;
  text: string;
  savedAt: string;
}

interface MemoryEntry {
  id: string;
  title: string;
  story: string;
  type: string;
  dateOrAge?: string;
  people?: string;
  place?: string;
  feeling?: string;
  whyItMatters?: string;
  savedAt: string;
}

const loadLocalArray = <T,>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const diaryFeelings = [
  { label: 'Calm', icon: '🌿' },
  { label: 'Heavy', icon: '☁️' },
  { label: 'Lonely', icon: '🧍' },
  { label: 'Anxious', icon: '🌀' },
  { label: 'Hopeful', icon: '☀️' }
];

const diaryNeeds = [
  { label: 'Just save this', icon: '🔖' },
  { label: 'Need comfort', icon: '💗' },
  { label: 'Need to talk', icon: '💬' },
  { label: 'Need quiet', icon: '🌿' }
];

const memoryTypes = [
  { label: 'Small win', icon: '🏆' },
  { label: 'Kind moment', icon: '💗' },
  { label: 'Peaceful moment', icon: '🌿' },
  { label: 'Someone helped me', icon: '👥' },
  { label: 'I felt connected', icon: '💛' },
  { label: 'I made it through', icon: '⛰️' }
];

const comfortOptions = [
  { label: 'Music', icon: '🎵' },
  { label: 'Prayer', icon: '🙏' },
  { label: 'Walking', icon: '👟' },
  { label: 'Talking to someone', icon: '🧑‍🤝‍🧑' },
  { label: 'Tea or coffee', icon: '☕' },
  { label: 'Nature', icon: '🌿' },
  { label: 'Family', icon: '🏠' },
  { label: 'Rest', icon: '🌙' },
  { label: 'Deep breathing', icon: '💨' },
  { label: 'My pet', icon: '🐾' },
  { label: 'Safe place', icon: '🏡' },
  { label: 'Favourite food', icon: '🍰' }
];

function Chip({ icon, label, selected, onClick, className = '' }: { icon: string; label: string; selected: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[52px] rounded-2xl border px-3.5 py-2.5 flex items-center justify-center gap-2 text-[13px] font-display font-black transition-all cursor-pointer active:scale-[0.98] ${
        selected
          ? 'bg-[#FF7527] border-[#FF7527] text-white shadow-[0_8px_18px_rgba(255,117,39,0.22)]'
          : 'bg-white/85 border-orange-100 text-[#223049] hover:border-[#FFB27A] hover:bg-[#FFF8F2]'
      } ${className}`}
    >
      <span className="text-[20px] leading-none">{icon}</span>
      <span className="leading-tight">{label}</span>
    </button>
  );
}

function StatusMessage({ type, message }: { type?: 'success' | 'error'; message?: string }) {
  if (!message) return null;

  return (
    <p role="status" className={`text-[12px] font-bold text-center ${type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
      {message}
    </p>
  );
}

export default function MySpaceScreen({ onBack, onNavigateTo }: MySpaceScreenProps) {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => loadLocalArray<DiaryEntry>('hopeheart_private_diary'));
  const [memories, setMemories] = useState<MemoryEntry[]>(() => loadLocalArray<MemoryEntry>('hopeheart_positive_memories'));

  const [diaryFeeling, setDiaryFeeling] = useState('Hopeful');
  const [diaryNeed, setDiaryNeed] = useState('Just save this');
  const [diaryNote, setDiaryNote] = useState('');
  const [memoryType, setMemoryType] = useState('Small win');
  const [memoryNote, setMemoryNote] = useState('');
  const [selectedComforts, setSelectedComforts] = useState<string[]>([]);
  const [customComfort, setCustomComfort] = useState('');

  const [diarySaveState, setDiarySaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });
  const [memorySaveState, setMemorySaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });
  const [rememberSaveState, setRememberSaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });

  const saveDiary = async () => {
    if (diarySaveState.loading) return;

    setDiarySaveState({ loading: true });
    const diaryText = [`Feeling: ${diaryFeeling}`, `Need: ${diaryNeed}`, diaryNote.trim() ? `Note: ${diaryNote.trim()}` : 'Note:'].join('\n');
    const result = await saveDiaryEntry({
      title: `Today I feel ${diaryFeeling}`,
      moodText: diaryFeeling,
      diaryText
    });

    if (!result.ok) {
      setDiarySaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

    const entry = {
      id: Date.now().toString(),
      title: `Today I feel ${diaryFeeling}`,
      mood: diaryFeeling,
      text: diaryText,
      savedAt: new Date().toISOString()
    };
    const updated = [entry, ...diaryEntries];
    setDiaryEntries(updated);
    localStorage.setItem('hopeheart_private_diary', JSON.stringify(updated));
    setDiaryNote('');
    setDiarySaveState({ loading: false, type: 'success', message: 'Your private diary entry is saved safely.' });
  };

  const saveMemory = async () => {
    if (memorySaveState.loading) return;

    setMemorySaveState({ loading: true });
    const memoryText = memoryNote.trim() || memoryType;
    const result = await saveMemoryEntry({
      memoryTitle: memoryType,
      smallGoodMoment: memoryType,
      memoryText,
      dateOrAge: '',
      people: '',
      place: '',
      feelingConnectedToMemory: '',
      whyMemoryMatters: ''
    });

    if (!result.ok) {
      setMemorySaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

    const entry = {
      id: Date.now().toString(),
      title: memoryType,
      story: memoryText,
      type: memoryType,
      savedAt: new Date().toISOString()
    };
    const updated = [entry, ...memories];
    setMemories(updated);
    localStorage.setItem('hopeheart_positive_memories', JSON.stringify(updated));
    setMemoryNote('');
    setMemorySaveState({ loading: false, type: 'success', message: 'Your memory is saved safely.' });
  };

  const toggleComfort = (label: string) => {
    setRememberSaveState({ loading: false });
    setSelectedComforts((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
  };

  const saveRememberMe = async () => {
    if (rememberSaveState.loading) return;

    setRememberSaveState({ loading: true });
    const comfortText = selectedComforts.join(', ');
    const result = await saveRememberMeDetails({
      strengths: comfortText,
      interests: '',
      calmingThings: comfortText,
      favouriteFood: selectedComforts.includes('Favourite food') ? 'Favourite food' : '',
      favouriteMusic: selectedComforts.includes('Music') ? 'Music' : '',
      favouriteComfortActivity: comfortText,
      safePlace: selectedComforts.includes('Safe place') ? 'Safe place' : '',
      survivalReminder: customComfort.trim()
    });

    if (!result.ok) {
      setRememberSaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

    localStorage.setItem('hopeheart_remember_strengths', comfortText);
    localStorage.setItem('hopeheart_remember_interests', '');
    localStorage.setItem('hopeheart_remember_calming_things', comfortText);
    localStorage.setItem('hopeheart_remember_favorite_food', selectedComforts.includes('Favourite food') ? 'Favourite food' : '');
    localStorage.setItem('hopeheart_remember_favorite_music', selectedComforts.includes('Music') ? 'Music' : '');
    localStorage.setItem('hopeheart_remember_comfort_activity', comfortText);
    localStorage.setItem('hopeheart_remember_safe_place', selectedComforts.includes('Safe place') ? 'Safe place' : '');
    localStorage.setItem('hopeheart_remember_survival_memory', customComfort.trim());
    setRememberSaveState({ loading: false, type: 'success', message: 'Your Remember Me details are saved safely.' });
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button onClick={onBack} type="button" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs">
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">My Space</span>
        <span className="text-[20px] select-none">🌼</span>
      </div>

      <div className="flex-1 max-w-[680px] mx-auto w-full p-4 md:p-6 pb-28 sm:pb-10 space-y-4">
        <div className="hh-hero-surface rounded-[30px] p-5 sm:p-6 text-left overflow-hidden relative border border-orange-100/70 shadow-[0_14px_34px_rgba(181,111,45,0.11)]">
          <div className="absolute -top-12 -right-8 w-36 h-36 bg-[#FFB98A]/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-20 w-28 h-28 bg-[#F8C8DC]/20 rounded-full blur-2xl" />
          <div className="relative grid grid-cols-[1fr_132px] gap-3 items-center">
            <div className="space-y-3">
              <h2 className="font-display font-black text-[#2B1D12] text-[27px] sm:text-[32px] leading-tight">Private space for you</h2>
              <p className="text-[15px] sm:text-[17px] text-[#334155] font-semibold leading-relaxed">A gentle place to save how you feel, small moments, and the things that help.</p>
            </div>
            <div className="justify-self-end relative w-[124px] h-[124px] rounded-[26px] bg-white/50 border border-white/70 flex items-center justify-center shadow-3xs">
              <span className="absolute left-1 bottom-5 text-[26px]">🌿</span>
              <span className="absolute right-1 top-4 text-[18px]">✨</span>
              <span className="absolute right-2 bottom-5 text-[18px]">✨</span>
              <div className="w-[82px] h-[98px] rounded-2xl bg-gradient-to-br from-[#FFD46B] to-[#FF9D45] border border-orange-200 shadow-sm flex items-center justify-center text-[34px] rotate-[-2deg]">🔒</div>
            </div>
          </div>
        </div>

        <section className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-orange-100/70 shadow-3xs">
          <div className="flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#FFF8F2] border border-orange-100 flex items-center justify-center text-[24px] shrink-0">📓</span>
            <div className="space-y-1">
              <h3 className="font-display font-black text-gray-900 text-[22px] leading-tight">Private Diary</h3>
              <p className="text-[14px] text-gray-500 font-semibold leading-relaxed">Save what today feels like. No need to explain.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {diaryFeelings.map((feeling) => (
              <Chip key={feeling.label} icon={feeling.icon} label={feeling.label} selected={diaryFeeling === feeling.label} onClick={() => { setDiaryFeeling(feeling.label); setDiarySaveState({ loading: false }); }} />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {diaryNeeds.map((need) => (
              <Chip key={need.label} icon={need.icon} label={need.label} selected={diaryNeed === need.label} onClick={() => { setDiaryNeed(need.label); setDiarySaveState({ loading: false }); }} />
            ))}
          </div>

          <label className="bg-white/85 border border-orange-100 rounded-2xl px-3.5 py-3 flex items-center gap-2.5">
            <span className="text-[18px] text-gray-400">✎</span>
            <input value={diaryNote} onChange={(e) => { setDiaryNote(e.target.value); setDiarySaveState({ loading: false }); }} placeholder="One line if you want…" className="w-full bg-transparent text-[14px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none" />
          </label>

          <button onClick={saveDiary} type="button" disabled={diarySaveState.loading} className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[16px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed">{diarySaveState.loading ? 'Saving…' : 'Save my check-in'}</button>
          <StatusMessage type={diarySaveState.type} message={diarySaveState.message} />
          <p className="text-[12px] text-gray-500 font-bold text-center">🔒 Only you can see this</p>
        </section>

        <section className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-orange-100/70 shadow-3xs">
          <div className="flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[24px] shrink-0">🖼️</span>
            <div className="space-y-1">
              <h3 className="font-display font-black text-gray-900 text-[22px] leading-tight">Memories</h3>
              <p className="text-[14px] text-gray-500 font-semibold leading-relaxed">Keep small moments that matter.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {memoryTypes.map((memory) => (
              <Chip key={memory.label} icon={memory.icon} label={memory.label} selected={memoryType === memory.label} onClick={() => { setMemoryType(memory.label); setMemorySaveState({ loading: false }); }} />
            ))}
          </div>

          <label className="bg-white/85 border border-orange-100 rounded-2xl px-3.5 py-3 flex items-center gap-2.5">
            <span className="text-[18px] text-gray-400">✎</span>
            <input value={memoryNote} onChange={(e) => { setMemoryNote(e.target.value); setMemorySaveState({ loading: false }); }} placeholder="One line about this memory…" className="w-full bg-transparent text-[14px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none" />
          </label>

          <button onClick={saveMemory} type="button" disabled={memorySaveState.loading} className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[16px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed">{memorySaveState.loading ? 'Saving…' : 'Save memory'}</button>
          <StatusMessage type={memorySaveState.type} message={memorySaveState.message} />
        </section>

        <section className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-orange-100/70 shadow-3xs">
          <div className="flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#FFF8E8] border border-orange-100 flex items-center justify-center text-[24px] shrink-0">⭐</span>
            <div className="space-y-1">
              <h3 className="font-display font-black text-gray-900 text-[22px] leading-tight">Remember Me</h3>
              <p className="text-[14px] text-gray-500 font-semibold leading-relaxed">Tap what helps you feel safe.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {comfortOptions.map((comfort) => (
              <Chip key={comfort.label} icon={comfort.icon} label={comfort.label} selected={selectedComforts.includes(comfort.label)} onClick={() => toggleComfort(comfort.label)} />
            ))}
          </div>

          <label className="bg-white/85 border border-orange-100 rounded-2xl px-3.5 py-3 flex items-center gap-2.5">
            <span className="text-[18px] text-gray-400">✎</span>
            <input value={customComfort} onChange={(e) => { setCustomComfort(e.target.value); setRememberSaveState({ loading: false }); }} placeholder="Add your own comfort reminder…" className="w-full bg-transparent text-[14px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none" />
          </label>

          <button onClick={saveRememberMe} type="button" disabled={rememberSaveState.loading} className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[16px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed">{rememberSaveState.loading ? 'Saving…' : 'Save Remember Me'}</button>
          <StatusMessage type={rememberSaveState.type} message={rememberSaveState.message} />
        </section>

        <button onClick={() => onNavigateTo(ScreenId.DoctorSuggestions)} type="button" className="w-full bg-white/90 hover:bg-[#FFF8F2] border border-orange-100 rounded-[26px] p-4 text-left cursor-pointer transition-all flex items-center justify-between gap-3 shadow-3xs">
          <span className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-[#FFF8E8] border border-orange-100 flex items-center justify-center text-[28px]">📖</span>
            <span>
              <span className="block text-[18px] text-gray-900 font-display font-black">Open Gentle Resources</span>
              <span className="block text-[13px] text-gray-500 font-semibold leading-relaxed">Explore calming and supportive resources.</span>
            </span>
          </span>
          <span className="text-[#2B1D12] font-black text-[26px]">›</span>
        </button>
      </div>
    </div>
  );
}
