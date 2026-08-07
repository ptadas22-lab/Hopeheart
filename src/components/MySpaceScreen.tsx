import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import { saveDiaryEntry, saveMemoryEntry, saveRememberMeDetails } from '../services/mySpaceData';

// Modular Wellness Sanctuary subcomponents
import PrivateLockCard from './myspace/PrivateLockCard';
import JourneyOverview from './myspace/JourneyOverview';
import JournalSection, { JournalEntry } from './myspace/JournalSection';
import MoodTimeline from './myspace/MoodTimeline';
import GratitudeSection from './myspace/GratitudeSection';
import MemoriesSection, { MemoryEntry } from './myspace/MemoriesSection';
import AchievementsSection from './myspace/AchievementsSection';
import ReflectionCard from './myspace/ReflectionCard';

interface MySpaceScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: ScreenId) => void;
}

const loadLocalArray = <T,>(key: string, fallbackKey?: string): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    if (fallbackKey) {
      const fallbackSaved = localStorage.getItem(fallbackKey);
      if (fallbackSaved) return JSON.parse(fallbackSaved);
    }
    return [];
  } catch {
    return [];
  }
};

const COMFORT_OPTIONS = [
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

export default function MySpaceScreen({ onBack, onNavigateTo }: MySpaceScreenProps) {
  // Diary / Journal logs
  const [diaryEntries, setDiaryEntries] = useState<JournalEntry[]>(() =>
    loadLocalArray<JournalEntry>('hopeheart_journal', 'hopeheart_private_diary')
  );

  // Memories logs
  const [memories, setMemories] = useState<MemoryEntry[]>(() =>
    loadLocalArray<MemoryEntry>('hopeheart_memories', 'hopeheart_positive_memories')
  );

  // Counts for achievements
  const [checkinCount, setCheckinCount] = useState(0);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Remember Me / Comfort States (Preserved legacy features)
  const [showComfortPanel, setShowComfortPanel] = useState(false);
  const [selectedComforts, setSelectedComforts] = useState<string[]>([]);
  const [customComfort, setCustomComfort] = useState('');
  const [rememberSaveState, setRememberSaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });

  // Load metrics from local storage
  useEffect(() => {
    // Check-in count
    try {
      const historyStr = localStorage.getItem('hopeheart_mood_history');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        setCheckinCount(history.length);
      } else {
        const legacyCheckinCount = localStorage.getItem('hopeheart_checkin_count');
        if (legacyCheckinCount) {
          setCheckinCount(parseInt(legacyCheckinCount, 10));
        }
      }
    } catch (e) {}

    // Gratitude count
    try {
      const gratitudeStr = localStorage.getItem('hopeheart_gratitude');
      if (gratitudeStr) {
        setGratitudeCount(JSON.parse(gratitudeStr).length);
      }
    } catch (e) {}

    // Favorites count
    try {
      const favoritesStr = localStorage.getItem('hopeheart_favorite_resources');
      if (favoritesStr) {
        setFavoriteCount(JSON.parse(favoritesStr).length);
      }
    } catch (e) {}

    // Comforts loading
    const savedComfortText = localStorage.getItem('hopeheart_remember_comfort_activity') || '';
    if (savedComfortText) {
      const split = savedComfortText.split(', ').filter(Boolean);
      setSelectedComforts(split);
    }
    const savedCustomComfort = localStorage.getItem('hopeheart_remember_survival_memory') || '';
    setCustomComfort(savedCustomComfort);
  }, []);

  const handleAddJournal = async (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    // 1. Backend sync
    const diaryText = [`Feeling: ${entry.mood}`, `Tags: ${entry.tags.join(', ')}`, entry.text].join('\n');
    await saveDiaryEntry({
      title: entry.title,
      moodText: entry.mood,
      diaryText
    });

    // 2. Update local state
    const newEntry: JournalEntry = {
      id: 'j-' + Date.now(),
      title: entry.title,
      date: new Date().toISOString(),
      mood: entry.mood,
      text: entry.text,
      tags: entry.tags
    };

    const updated = [newEntry, ...diaryEntries];
    setDiaryEntries(updated);
    localStorage.setItem('hopeheart_journal', JSON.stringify(updated));
    localStorage.setItem('hopeheart_private_diary', JSON.stringify(updated)); // Legacy support
  };

  const handleDeleteJournal = (id: string) => {
    const updated = diaryEntries.filter((entry) => entry.id !== id);
    setDiaryEntries(updated);
    localStorage.setItem('hopeheart_journal', JSON.stringify(updated));
    localStorage.setItem('hopeheart_private_diary', JSON.stringify(updated));
  };

  const handleAddMemory = async (entry: Omit<MemoryEntry, 'id' | 'savedAt'>) => {
    // 1. Backend sync
    await saveMemoryEntry({
      memoryTitle: entry.title,
      smallGoodMoment: entry.type,
      memoryText: entry.story,
      dateOrAge: '',
      people: '',
      place: '',
      feelingConnectedToMemory: '',
      whyMemoryMatters: ''
    });

    // 2. Update local state
    const newEntry: MemoryEntry = {
      id: 'm-' + Date.now(),
      title: entry.title,
      story: entry.story,
      type: entry.type,
      emoji: entry.emoji,
      savedAt: new Date().toISOString()
    };

    const updated = [newEntry, ...memories];
    setMemories(updated);
    localStorage.setItem('hopeheart_memories', JSON.stringify(updated));
    localStorage.setItem('hopeheart_positive_memories', JSON.stringify(updated)); // Legacy support
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter((entry) => entry.id !== id);
    setMemories(updated);
    localStorage.setItem('hopeheart_memories', JSON.stringify(updated));
    localStorage.setItem('hopeheart_positive_memories', JSON.stringify(updated));
  };

  const toggleComfort = (label: string) => {
    setRememberSaveState({ loading: false });
    setSelectedComforts((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
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
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label="Back to dashboard"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          My Space
        </span>
        <span className="text-[20px] select-none">🌼</span>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 pb-28 sm:pb-10 space-y-6">
        {/* Hero Welcome banner */}
        <div className="hh-hero-surface rounded-[30px] p-6 text-left overflow-hidden relative border border-orange-100/70 shadow-3xs">
          <div className="absolute -top-12 -right-8 w-36 h-36 bg-[#FFB98A]/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-0 right-20 w-28 h-28 bg-[#F8C8DC]/20 rounded-full blur-2xl" />
          <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_132px] gap-3 items-center">
            <div className="space-y-2">
              <h2 className="font-display font-black text-[#2B1D12] text-[26px] sm:text-[30px] leading-tight">
                Private Healing Space
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#334155] font-semibold leading-relaxed">
                A gentle place to reflect on your journey, write thoughts, and remember the small moments.
              </p>
            </div>
            <div className="justify-self-center sm:justify-self-end relative w-24 h-24 rounded-[22px] bg-white/50 border border-white/70 flex items-center justify-center shadow-3xs">
              <span className="absolute left-1 bottom-3 text-[22px]">🌿</span>
              <span className="absolute right-1 top-2 text-[14px]">✨</span>
              <span className="text-[44px] rotate-[-2deg]">🔒</span>
            </div>
          </div>
        </div>

        {/* Section 1: Journey Stats Overview */}
        <JourneyOverview
          checkinCount={checkinCount}
          journalCount={diaryEntries.length}
          favoriteCount={favoriteCount}
        />

        {/* Section 7: Local Weekly Reflection Insights */}
        <ReflectionCard />

        {/* Section 8: Privacy Statement locker card */}
        <PrivateLockCard />

        {/* Section 2: Private Diary Section */}
        <JournalSection
          entries={diaryEntries}
          onAddEntry={handleAddJournal}
          onDeleteEntry={handleDeleteJournal}
        />

        {/* Section 3: Chronological Mood Timeline */}
        <MoodTimeline journals={diaryEntries} />

        {/* Section 4: Daily Gratitude Prompts */}
        <GratitudeSection />

        {/* Section 5: Scrapbook positive memories */}
        <MemoriesSection
          memories={memories}
          onAddMemory={handleAddMemory}
          onDeleteMemory={handleDeleteMemory}
        />

        {/* Section 6: Quiet Milestones Achievements */}
        <AchievementsSection
          checkinCount={checkinCount}
          journalCount={diaryEntries.length}
          gratitudeCount={gratitudeCount}
          favoriteCount={favoriteCount}
        />

        {/* Collapsible Legacy Comfort Activity Strategy Selector */}
        <div className="border border-[#EDE9DE]/75 bg-white/80 rounded-[24px] overflow-hidden text-left">
          <button
            onClick={() => setShowComfortPanel(!showComfortPanel)}
            type="button"
            className="w-full p-4 flex items-center justify-between font-display font-black text-[#2B1D12] text-[14.5px] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>☕</span> Things that Comfort Me
            </span>
            <span className="text-gray-400 font-bold text-[14px]">
              {showComfortPanel ? '−' : '+'}
            </span>
          </button>

          {showComfortPanel && (
            <div className="p-4 border-t border-gray-150 space-y-4 bg-transparent animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Select Calming Activities
                </span>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                  Choose the comfort options that help ground you during challenging check-ins.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {COMFORT_OPTIONS.map((item) => {
                  const isSelected = selectedComforts.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleComfort(item.label)}
                      className={`p-2.5 border rounded-xl text-[12px] font-semibold flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-[#FF7527] border-[#FF7527] text-white'
                          : 'bg-white border-gray-200 text-[#2B1D12] hover:bg-[#FFF8F2]'
                      }`}
                    >
                      <span className="text-[16px]">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  A survival memory or note to my future self:
                </label>
                <input
                  type="text"
                  value={customComfort}
                  onChange={(e) => setCustomComfort(e.target.value)}
                  placeholder="e.g. Remember to breathe, this passes..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                />
              </div>

              <button
                onClick={saveRememberMe}
                type="button"
                className="w-full py-2.5 bg-[#2B1D12] hover:bg-black text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
              >
                Save Calming Settings
              </button>
              {rememberSaveState.message && (
                <p className={`text-[12px] font-bold text-center ${rememberSaveState.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                  {rememberSaveState.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
