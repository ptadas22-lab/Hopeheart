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

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-24 sm:pb-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 sm:p-6 text-left overflow-hidden relative">
          <div className="absolute -top-12 -right-10 w-32 h-32 bg-[#FFB98A]/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-14 -left-10 w-36 h-36 bg-[#F8C8DC]/20 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-white/80 border border-orange-100 flex items-center justify-center text-[28px] shrink-0 shadow-3xs">🔒</div>
            <div className="space-y-1">
              <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Private space for you</h2>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Diary, memories, photos, and Remember Me data stay local for this MVP and are not shared with Community.</p>
            </div>
          </div>
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-display font-black text-gray-800 text-[16px]">Private Diary</h3>
            <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Write freely. Your words stay with you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              ['📝', 'Start a new entry', 'Write whatever is on your mind.'],
              ['🔒', '100% private', 'Only you can see your diary.'],
              ['🌿', 'Keep it in the moment', 'Capture your thoughts, feelings, and moments.']
            ].map(([icon, title, text]) => (
              <div key={title} className="bg-[#FFFDF9] border border-orange-100/70 rounded-2xl p-3 space-y-1.5">
                <span className="text-[18px] block">{icon}</span>
                <h4 className="text-[11.5px] font-display font-black text-gray-800 leading-tight">{title}</h4>
                <p className="text-[10.5px] text-gray-500 font-semibold leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/70 border border-orange-100/60 rounded-2xl p-3.5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="space-y-1">
                <span className="text-[11px] font-display font-black text-gray-700">Title optional</span>
                <input value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} placeholder="A quiet title..." className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-display font-black text-gray-700">Mood optional</span>
                <input value={diaryMood} onChange={(e) => setDiaryMood(e.target.value)} placeholder="How it feels..." className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
              </label>
            </div>
            <label className="space-y-1 block">
              <span className="text-[11px] font-display font-black text-gray-700">Write privately</span>
              <textarea value={diaryText} onChange={(e) => setDiaryText(e.target.value)} rows={4} placeholder="Let your thoughts land here..." className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] font-semibold resize-none" />
            </label>
            <button onClick={saveDiary} type="button" className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save diary entry</button>
          </div>
          {diaryEntries.slice(0, 2).map((entry) => <p key={entry.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{entry.title || 'Untitled'} — {new Date(entry.savedAt).toLocaleString()}</p>)}
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-display font-black text-gray-800 text-[16px]">Memories</h3>
            <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Capture moments that matter to you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">Memory title</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">Name this moment.</span>
              <input value={memoryTitle} onChange={(e) => setMemoryTitle(e.target.value)} placeholder="Memory title" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            </label>
            <label className="bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">Small good moment</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">Choose or describe the memory type.</span>
              <input value={memoryType} onChange={(e) => setMemoryType(e.target.value)} placeholder="Memory type" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            </label>
            <label className="sm:col-span-2 bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">Your memory</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">Write the story in your own words.</span>
              <textarea value={memoryStory} onChange={(e) => setMemoryStory(e.target.value)} rows={4} placeholder="Memory story" className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] font-semibold resize-none" />
            </label>
            <label className="bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">Date or age</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">Optional, if you remember.</span>
              <input value={memoryDateOrAge} onChange={(e) => setMemoryDateOrAge(e.target.value)} placeholder="Date or age optional" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            </label>
            <label className="bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">People</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">Who was part of it?</span>
              <input value={memoryPeople} onChange={(e) => setMemoryPeople(e.target.value)} placeholder="People optional" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            </label>
            <label className="bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">Place</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">Where did it happen?</span>
              <input value={memoryPlace} onChange={(e) => setMemoryPlace(e.target.value)} placeholder="Place optional" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            </label>
            <label className="bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">Feeling connected to memory</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">What feeling does it bring?</span>
              <input value={memoryFeeling} onChange={(e) => setMemoryFeeling(e.target.value)} placeholder="Feeling connected to memory" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            </label>
            <label className="sm:col-span-2 bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
              <span className="text-[11px] font-display font-black text-gray-700">Why this memory matters</span>
              <span className="block text-[10.5px] text-gray-400 font-semibold">A sentence is enough.</span>
              <input value={memoryWhy} onChange={(e) => setMemoryWhy(e.target.value)} placeholder="Why this memory matters" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            </label>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePreview(e.target.files?.[0])} />
          {imagePreview && <div className="rounded-2xl overflow-hidden border border-gray-150"><img src={imagePreview} alt="Local-only memory preview" className="w-full max-h-56 object-cover" /><p className="text-[10.5px] text-gray-400 font-bold p-2 text-center">Preview only — not uploaded.</p></div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button onClick={() => fileInputRef.current?.click()} type="button" className="py-2.5 bg-white border border-gray-200 rounded-xl text-[12.5px] font-display font-black cursor-pointer">Preview local photo</button>
            <button onClick={saveMemory} type="button" className="py-2.5 bg-[#FF7527] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save memory</button>
          </div>
          {memories.slice(0, 2).map((memory) => <p key={memory.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{memory.title} — {memory.type}</p>)}
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-display font-black text-gray-800 text-[16px]">Remember Me</h3>
            <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Revisit what makes you, you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['My strengths', 'What helps you keep going?', strengths, setStrengths],
              ['My interests', 'Things that feel like you.', interests, setInterests],
              ['Things that calm me', 'Small comforts that help.', calmingThings, setCalmingThings],
              ['Favourite food', 'A taste that comforts you.', favoriteFood, setFavoriteFood],
              ['Favourite music', 'Sounds that feel safe.', favoriteMusic, setFavoriteMusic],
              ['Favourite comfort activity', 'Something gentle you like.', comfortActivity, setComfortActivity],
              ['Safe place', 'A place your mind can rest.', safePlace, setSafePlace],
              ['Memory that reminds me I survived', 'A reminder of your strength.', survivalMemory, setSurvivalMemory]
            ].map(([label, helper, value, setter]) => (
              <label key={label as string} className="bg-white/70 border border-orange-100/60 rounded-2xl p-3 space-y-1">
                <span className="text-[11px] font-display font-black text-gray-700">{label as string}</span>
                <span className="block text-[10.5px] text-gray-400 font-semibold">{helper as string}</span>
                <input value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} placeholder={label as string} className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
              </label>
            ))}
          </div>
          <button onClick={saveRememberMe} type="button" className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save Remember Me</button>
        </div>

        <button onClick={() => onNavigateTo(ScreenId.DoctorSuggestions)} type="button" className="w-full bg-white hover:bg-[#FFF8F2] border border-orange-100 rounded-2xl p-4 text-left cursor-pointer transition-all flex items-center justify-between gap-3">
          <span>
            <span className="block text-[13px] text-[#FF7527] font-display font-black">Open Gentle Resources</span>
            <span className="block text-[11.5px] text-gray-500 font-semibold leading-relaxed">Explore calming and supportive resources.</span>
          </span>
          <span className="text-[#FF7527] font-black">→</span>
        </button>
      </div>
    </div>
  );
}
