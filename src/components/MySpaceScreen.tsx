import { useRef, useState } from 'react';
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
  const [diarySaveState, setDiarySaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });
  const [memorySaveState, setMemorySaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });
  const [rememberSaveState, setRememberSaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });

  const saveDiary = async () => {
    if (!diaryText.trim() || diarySaveState.loading) return;

    setDiarySaveState({ loading: true });
    const result = await saveDiaryEntry({
      title: diaryTitle.trim(),
      moodText: diaryMood.trim(),
      diaryText: diaryText.trim()
    });

    if (!result.ok) {
      setDiarySaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

    const entry = { id: Date.now().toString(), title: diaryTitle.trim(), mood: diaryMood.trim(), text: diaryText.trim(), savedAt: new Date().toISOString() };
    const updated = [entry, ...diaryEntries];
    setDiaryEntries(updated);
    localStorage.setItem('hopeheart_private_diary', JSON.stringify(updated));
    setDiaryTitle('');
    setDiaryMood('');
    setDiaryText('');
    setDiarySaveState({ loading: false, type: 'success', message: 'Your private diary entry is saved safely.' });
  };

  const saveMemory = async () => {
    if (!memoryTitle.trim() || !memoryStory.trim() || memorySaveState.loading) return;

    setMemorySaveState({ loading: true });
    const result = await saveMemoryEntry({
      memoryTitle: memoryTitle.trim(),
      smallGoodMoment: memoryType.trim(),
      memoryText: memoryStory.trim(),
      dateOrAge: memoryDateOrAge.trim(),
      people: memoryPeople.trim(),
      place: memoryPlace.trim(),
      feelingConnectedToMemory: memoryFeeling.trim(),
      whyMemoryMatters: memoryWhy.trim()
    });

    if (!result.ok) {
      setMemorySaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

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
    setMemorySaveState({ loading: false, type: 'success', message: 'Your memory is saved safely.' });
  };

  const saveRememberMe = async () => {
    if (rememberSaveState.loading) return;

    setRememberSaveState({ loading: true });
    const result = await saveRememberMeDetails({
      strengths,
      interests,
      calmingThings,
      favouriteFood: favoriteFood,
      favouriteMusic: favoriteMusic,
      favouriteComfortActivity: comfortActivity,
      safePlace,
      survivalReminder: survivalMemory
    });

    if (!result.ok) {
      setRememberSaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

    localStorage.setItem('hopeheart_remember_strengths', strengths);
    localStorage.setItem('hopeheart_remember_interests', interests);
    localStorage.setItem('hopeheart_remember_calming_things', calmingThings);
    localStorage.setItem('hopeheart_remember_favorite_food', favoriteFood);
    localStorage.setItem('hopeheart_remember_favorite_music', favoriteMusic);
    localStorage.setItem('hopeheart_remember_comfort_activity', comfortActivity);
    localStorage.setItem('hopeheart_remember_safe_place', safePlace);
    localStorage.setItem('hopeheart_remember_survival_memory', survivalMemory);
    setRememberSaveState({ loading: false, type: 'success', message: 'Your Remember Me details are saved safely.' });
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

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-28 sm:pb-10 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 sm:p-6 lg:p-8 text-left overflow-hidden relative border border-orange-100/70 shadow-3xs">
          <div className="absolute -top-14 -right-10 w-40 h-40 bg-[#FFB98A]/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-16 w-28 h-28 bg-[#F8C8DC]/20 rounded-full blur-2xl" />
          <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_210px] gap-5 sm:items-center">
            <div className="space-y-3">
              <h2 className="font-display font-black text-[#2B1D12] text-[24px] sm:text-[28px] leading-tight">Private space for you</h2>
              <p className="text-[13px] sm:text-[14px] text-gray-600 font-semibold leading-relaxed max-w-md">Your diary, memories, photos, and Remember Me data stay local for this MVP and are not shared with Community.</p>
            </div>
            <div className="justify-self-center sm:justify-self-end relative w-40 h-32 sm:w-48 sm:h-36 rounded-[28px] bg-white/45 border border-white/70 flex items-center justify-center shadow-3xs">
              <div className="absolute left-4 bottom-4 text-[28px]">🌿</div>
              <div className="absolute right-4 top-4 text-[22px]">💛</div>
              <div className="w-24 h-28 rounded-2xl bg-gradient-to-br from-[#FFD46B] to-[#FF9D45] border border-orange-200 shadow-sm flex items-center justify-center text-[36px] rotate-[-3deg]">🔒</div>
              <div className="absolute right-8 bottom-3 text-[34px] rotate-12">✍️</div>
            </div>
          </div>
        </div>

        <div className="hh-surface rounded-[30px] p-5 sm:p-6 space-y-5 border border-orange-100/70 shadow-3xs">
          <div className="flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#FFF8F2] border border-orange-100 flex items-center justify-center text-[24px] shrink-0">📓</span>
            <div className="space-y-1">
              <h3 className="font-display font-black text-gray-800 text-[18px]">Private Diary</h3>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Write freely. Your words stay with you.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ['📝', 'Start a new entry', 'Write whatever is on your mind.'],
              ['🔒', '100% private', 'Only you can see your diary.'],
              ['🌿', 'Keep it in the moment', 'Capture your thoughts, feelings, and moments.']
            ].map(([icon, title, text]) => (
              <div key={title} className="bg-[#FFFDF9] border border-orange-100/80 rounded-2xl p-3.5 flex items-start gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-white border border-orange-100 flex items-center justify-center text-[18px] shrink-0">{icon}</span>
                <div className="space-y-0.5">
                  <h4 className="text-[11.5px] font-display font-black text-gray-800 leading-tight">{title}</h4>
                  <p className="text-[10.5px] text-gray-500 font-semibold leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/70 border border-orange-100/60 rounded-3xl p-3.5 sm:p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1.5">
                <span className="text-[11px] font-display font-black text-gray-700">Title optional</span>
                <input value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} placeholder="A quiet title..." className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-orange-100/70 rounded-2xl text-[12.5px] font-semibold outline-none focus:border-[#FFB27A]" />
              </label>
              <label className="space-y-1.5">
                <span className="text-[11px] font-display font-black text-gray-700">Mood optional</span>
                <input value={diaryMood} onChange={(e) => setDiaryMood(e.target.value)} placeholder="How it feels..." className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-orange-100/70 rounded-2xl text-[12.5px] font-semibold outline-none focus:border-[#FFB27A]" />
              </label>
            </div>
            <label className="space-y-1.5 block">
              <span className="text-[11px] font-display font-black text-gray-700">Write privately</span>
              <textarea value={diaryText} onChange={(e) => setDiaryText(e.target.value)} rows={4} placeholder="Let your thoughts land here..." className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-orange-100/70 rounded-2xl text-[12.5px] font-semibold resize-none outline-none focus:border-[#FFB27A]" />
            </label>
            <button onClick={saveDiary} type="button" disabled={diarySaveState.loading} className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed">{diarySaveState.loading ? 'Saving…' : 'Save diary entry'}</button>
            {diarySaveState.message && (
              <p role="status" className={`text-[11.5px] font-bold text-center ${diarySaveState.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>{diarySaveState.message}</p>
            )}
          </div>
          {diaryEntries.slice(0, 2).map((entry) => <p key={entry.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{entry.title || 'Untitled'} — {new Date(entry.savedAt).toLocaleString()}</p>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="rounded-[30px] p-4 sm:p-5 space-y-4 bg-gradient-to-br from-[#FFFDF9] via-[#FFF7F2] to-[#FFF0F4] border border-[#FFD9CC] shadow-3xs">
            <div className="flex items-start gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#FFF1F0] border border-[#FFD0C4] flex items-center justify-center text-[24px] shrink-0">🖼️</span>
              <div className="space-y-1">
                <h3 className="font-display font-black text-gray-800 text-[18px]">Memories</h3>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Capture moments that matter.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                ['♡', 'Memory title', 'Name this moment...', memoryTitle, setMemoryTitle, 'input'],
                ['☀️', 'Small good moment', 'Choose or describe...', memoryType, setMemoryType, 'input'],
                ['▤', 'Your memory', 'Write your memory...', memoryStory, setMemoryStory, 'textarea'],
                ['🗓️', 'Date or age', 'Date or age...', memoryDateOrAge, setMemoryDateOrAge, 'input'],
                ['🧑‍🤝‍🧑', 'People', 'People...', memoryPeople, setMemoryPeople, 'input'],
                ['📍', 'Place', 'Place...', memoryPlace, setMemoryPlace, 'input'],
                ['💛', 'Feeling connected to memory', 'Feeling connected to...', memoryFeeling, setMemoryFeeling, 'input'],
                ['✨', 'Why this memory matters', 'Why this memory matters...', memoryWhy, setMemoryWhy, 'input']
              ].map(([icon, label, placeholder, value, setter, kind]) => (
                <label key={label as string} className="bg-white/78 border border-[#FFD9CC]/80 rounded-2xl px-3 py-2.5 flex items-start gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#FFF8F2] flex items-center justify-center text-[15px] shrink-0">{icon as string}</span>
                  <span className="flex-1 min-w-0 space-y-1">
                    <span className="block text-[11px] font-display font-black text-gray-700">{label as string}</span>
                    {kind === 'textarea' ? (
                      <textarea value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} rows={3} placeholder={placeholder as string} className="w-full bg-transparent text-[12.5px] font-semibold text-gray-700 placeholder:text-gray-400 resize-none outline-none" />
                    ) : (
                      <input value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} placeholder={placeholder as string} className="w-full bg-transparent text-[12.5px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none" />
                    )}
                  </span>
                </label>
              ))}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePreview(e.target.files?.[0])} />
            {imagePreview && <div className="rounded-2xl overflow-hidden border border-[#FFD9CC]"><img src={imagePreview} alt="Local-only memory preview" className="w-full max-h-56 object-cover" /><p className="text-[10.5px] text-gray-400 font-bold p-2 text-center">Preview only — not uploaded.</p></div>}
            <button onClick={() => fileInputRef.current?.click()} type="button" className="w-full py-3 bg-white border border-[#FFD9CC] rounded-2xl text-[12.5px] font-display font-black cursor-pointer hover:bg-[#FFF8F2] transition-all">📷 Preview local photo</button>
            <button onClick={saveMemory} type="button" disabled={memorySaveState.loading} className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed">{memorySaveState.loading ? 'Saving…' : 'Save memory'}</button>
            {memorySaveState.message && (
              <p role="status" className={`text-[11.5px] font-bold text-center ${memorySaveState.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>{memorySaveState.message}</p>
            )}
            {memories.slice(0, 2).map((memory) => <p key={memory.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{memory.title} — {memory.type}</p>)}
          </div>

          <div className="rounded-[30px] p-4 sm:p-5 space-y-4 bg-gradient-to-br from-[#FFFDF9] via-[#F8FBFF] to-[#EEF5FF] border border-[#D8E7FF] shadow-3xs">
            <div className="flex items-start gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#EEF5FF] border border-[#D8E7FF] flex items-center justify-center text-[24px] shrink-0">⭐</span>
              <div className="space-y-1">
                <h3 className="font-display font-black text-gray-800 text-[18px]">Remember Me</h3>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Revisit what makes you, you.</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                ['⭐', 'My strengths', strengths, setStrengths],
                ['🧡', 'My interests', interests, setInterests],
                ['🌿', 'Things that calm me', calmingThings, setCalmingThings],
                ['🍽️', 'Favourite food', favoriteFood, setFavoriteFood],
                ['🎵', 'Favourite music', favoriteMusic, setFavoriteMusic],
                ['🛋️', 'Favourite comfort activity', comfortActivity, setComfortActivity],
                ['🏠', 'Safe place', safePlace, setSafePlace],
                ['🛡️', 'Memory that reminds me I survived', survivalMemory, setSurvivalMemory]
              ].map(([icon, label, value, setter]) => (
                <label key={label as string} className="bg-white/78 border border-[#D8E7FF]/90 rounded-2xl px-3 py-2.5 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#F5F9FF] flex items-center justify-center text-[15px] shrink-0">{icon as string}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] font-display font-black text-gray-700">{label as string}</span>
                    <input value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} placeholder={`${label as string}...`} className="w-full bg-transparent text-[12.5px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none" />
                  </span>
                </label>
              ))}
            </div>
            <button onClick={saveRememberMe} type="button" disabled={rememberSaveState.loading} className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed">{rememberSaveState.loading ? 'Saving…' : 'Save Remember Me'}</button>
            {rememberSaveState.message && (
              <p role="status" className={`text-[11.5px] font-bold text-center ${rememberSaveState.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>{rememberSaveState.message}</p>
            )}
          </div>
        </div>

        <button onClick={() => onNavigateTo(ScreenId.DoctorSuggestions)} type="button" className="w-full bg-white/85 hover:bg-[#FFF8F2] border border-orange-100 rounded-[26px] p-4 text-left cursor-pointer transition-all flex items-center justify-between gap-3 shadow-3xs">
          <span className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-[#FFF8E8] border border-orange-100 flex items-center justify-center text-[22px]">🪴</span>
            <span>
              <span className="block text-[14px] text-[#FF7527] font-display font-black">Open Gentle Resources</span>
              <span className="block text-[11.5px] text-gray-500 font-semibold leading-relaxed">Explore calming and supportive resources.</span>
            </span>
          </span>
          <span className="text-[#FF7527] font-black text-[20px]">›</span>
        </button>
      </div>
    </div>
  );
}
