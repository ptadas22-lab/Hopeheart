import { useRef, useState } from 'react';
import { ScreenId } from '../types';

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

export default function MySpaceScreen({ onBack, onNavigateTo }: MySpaceScreenProps) {
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryMood, setDiaryMood] = useState('');
  const [diaryText, setDiaryText] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => loadLocalArray<DiaryEntry>('hopeheart_private_diary'));

  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryStory, setMemoryStory] = useState('');
  const [memoryType, setMemoryType] = useState('Small good moment');
  const [memoryDateOrAge, setMemoryDateOrAge] = useState('');
  const [memoryPeople, setMemoryPeople] = useState('');
  const [memoryPlace, setMemoryPlace] = useState('');
  const [memoryFeeling, setMemoryFeeling] = useState('');
  const [memoryWhy, setMemoryWhy] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryEntry[]>(() => loadLocalArray<MemoryEntry>('hopeheart_positive_memories'));

  const [strengths, setStrengths] = useState(() => localStorage.getItem('hopeheart_remember_strengths') || '');
  const [interests, setInterests] = useState(() => localStorage.getItem('hopeheart_remember_interests') || '');
  const [calmingThings, setCalmingThings] = useState(() => localStorage.getItem('hopeheart_remember_calming_things') || '');
  const [favoriteFood, setFavoriteFood] = useState(() => localStorage.getItem('hopeheart_remember_favorite_food') || '');
  const [favoriteMusic, setFavoriteMusic] = useState(() => localStorage.getItem('hopeheart_remember_favorite_music') || '');
  const [comfortActivity, setComfortActivity] = useState(() => localStorage.getItem('hopeheart_remember_comfort_activity') || '');
  const [safePlace, setSafePlace] = useState(() => localStorage.getItem('hopeheart_remember_safe_place') || '');
  const [survivalMemory, setSurvivalMemory] = useState(() => localStorage.getItem('hopeheart_remember_survival_memory') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveDiary = () => {
    if (!diaryText.trim()) return;
    const entry = { id: Date.now().toString(), title: diaryTitle.trim(), mood: diaryMood.trim(), text: diaryText.trim(), savedAt: new Date().toISOString() };
    const updated = [entry, ...diaryEntries];
    setDiaryEntries(updated);
    localStorage.setItem('hopeheart_private_diary', JSON.stringify(updated));
    setDiaryTitle('');
    setDiaryMood('');
    setDiaryText('');
  };

  const saveMemory = () => {
    if (!memoryTitle.trim() || !memoryStory.trim()) return;
    const entry = {
      id: Date.now().toString(),
      title: memoryTitle.trim(),
      story: memoryStory.trim(),
      type: memoryType,
      dateOrAge: memoryDateOrAge.trim(),
      people: memoryPeople.trim(),
      place: memoryPlace.trim(),
      feeling: memoryFeeling.trim(),
      whyItMatters: memoryWhy.trim(),
      savedAt: new Date().toISOString()
    };
    const updated = [entry, ...memories];
    setMemories(updated);
    localStorage.setItem('hopeheart_positive_memories', JSON.stringify(updated));
    setMemoryTitle('');
    setMemoryStory('');
    setMemoryDateOrAge('');
    setMemoryPeople('');
    setMemoryPlace('');
    setMemoryFeeling('');
    setMemoryWhy('');
  };

  const saveRememberMe = () => {
    localStorage.setItem('hopeheart_remember_strengths', strengths);
    localStorage.setItem('hopeheart_remember_interests', interests);
    localStorage.setItem('hopeheart_remember_calming_things', calmingThings);
    localStorage.setItem('hopeheart_remember_favorite_food', favoriteFood);
    localStorage.setItem('hopeheart_remember_favorite_music', favoriteMusic);
    localStorage.setItem('hopeheart_remember_comfort_activity', comfortActivity);
    localStorage.setItem('hopeheart_remember_safe_place', safePlace);
    localStorage.setItem('hopeheart_remember_survival_memory', survivalMemory);
  };

  const handleImagePreview = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
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

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 text-center space-y-2">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Private space for you</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Diary, memories, photos, and Remember Me data stay local for this MVP and are not shared with Community.</p>
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px]">Private Diary</h3>
          <input value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} placeholder="Title optional" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          <input value={diaryMood} onChange={(e) => setDiaryMood(e.target.value)} placeholder="Mood optional" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          <textarea value={diaryText} onChange={(e) => setDiaryText(e.target.value)} rows={4} placeholder="Write privately..." className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] font-semibold resize-none" />
          <button onClick={saveDiary} type="button" className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save diary entry</button>
          {diaryEntries.slice(0, 2).map((entry) => <p key={entry.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{entry.title || 'Untitled'} — {new Date(entry.savedAt).toLocaleString()}</p>)}
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px]">Memories</h3>
          <input value={memoryTitle} onChange={(e) => setMemoryTitle(e.target.value)} placeholder="Memory title" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          <textarea value={memoryStory} onChange={(e) => setMemoryStory(e.target.value)} rows={4} placeholder="Memory story" className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] font-semibold resize-none" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input value={memoryType} onChange={(e) => setMemoryType(e.target.value)} placeholder="Memory type" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryDateOrAge} onChange={(e) => setMemoryDateOrAge(e.target.value)} placeholder="Date or age optional" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryPeople} onChange={(e) => setMemoryPeople(e.target.value)} placeholder="People optional" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryPlace} onChange={(e) => setMemoryPlace(e.target.value)} placeholder="Place optional" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryFeeling} onChange={(e) => setMemoryFeeling(e.target.value)} placeholder="Feeling connected to memory" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryWhy} onChange={(e) => setMemoryWhy(e.target.value)} placeholder="Why this memory matters" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePreview(e.target.files?.[0])} />
          {imagePreview && <div className="rounded-2xl overflow-hidden border border-gray-150"><img src={imagePreview} alt="Local-only memory preview" className="w-full max-h-56 object-cover" /><p className="text-[10.5px] text-gray-400 font-bold p-2 text-center">Preview only — not uploaded.</p></div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button onClick={() => fileInputRef.current?.click()} type="button" className="py-2.5 bg-white border border-gray-200 rounded-xl text-[12.5px] font-display font-black cursor-pointer">Preview local photo</button>
            <button onClick={saveMemory} type="button" className="py-2.5 bg-[#FF7527] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save memory</button>
          </div>
          {memories.slice(0, 2).map((memory) => <p key={memory.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{memory.title} — {memory.type}</p>)}
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px]">Remember Me</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              ['My strengths', strengths, setStrengths],
              ['My interests', interests, setInterests],
              ['Things that calm me', calmingThings, setCalmingThings],
              ['Favourite food', favoriteFood, setFavoriteFood],
              ['Favourite music', favoriteMusic, setFavoriteMusic],
              ['Favourite comfort activity', comfortActivity, setComfortActivity],
              ['Safe place', safePlace, setSafePlace],
              ['Memory that reminds me I survived', survivalMemory, setSurvivalMemory]
            ].map(([label, value, setter]) => (
              <input key={label as string} value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} placeholder={label as string} className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            ))}
          </div>
          <button onClick={saveRememberMe} type="button" className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save Remember Me</button>
        </div>

        <button onClick={() => onNavigateTo(ScreenId.DoctorSuggestions)} type="button" className="w-full py-3 bg-white hover:bg-[#FFF8F2] border border-orange-100 rounded-2xl text-[#FF7527] font-display font-black text-[13px] cursor-pointer">Open Gentle Resources</button>
      </div>
    </div>
  );
}
