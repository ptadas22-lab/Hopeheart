import React, { useState, useEffect } from 'react';
import ResourceSearchBar from './resources/ResourceSearchBar';
import DailySelfCareCard from './resources/DailySelfCareCard';
import RecommendedResources from './resources/RecommendedResources';
import QuickReliefSection from './resources/QuickReliefSection';
import LearnAndGrowSection from './resources/LearnAndGrowSection';
import RecentlyUsedSection from './resources/RecentlyUsedSection';
import FavoritesSection from './resources/FavoritesSection';
import EmergencySupportCard from './resources/EmergencySupportCard';
import ResourceDetailScreen from './resources/ResourceDetailScreen';
import { saveExpertSessionRequest } from '../services/expertSessions';
import { MoodConfig } from '../types';

interface ResourcesScreenProps {
  onBack: () => void;
}

const MOOD_CONFIGS: MoodConfig[] = [
  { id: 'calm', label: 'Calm', emoji: '😊', color: 'text-emerald-500', accentBg: '#EADFC9', bgLight: 'bg-[#F2FAF6]', buddyExpression: 'calm', tagline: 'You’re allowed to slow down. I’m here with you.' },
  { id: 'sad', label: 'Sad', emoji: '😔', color: 'text-blue-600', accentBg: '#E8F1FC', bgLight: 'bg-[#F4F8FD]', buddyExpression: 'lonely', tagline: 'A gray cloud passes over. I let myself feel it.' },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-amber-500', accentBg: '#FEFAF0', bgLight: 'bg-[#FFFDF4]', buddyExpression: 'anxious', tagline: 'Racing chest, heavy breath. I am letting it pass.' },
  { id: 'hurt', label: 'Hurt', emoji: '💔', color: 'text-orange-500', accentBg: '#FFF2EA', bgLight: 'bg-[#FCFAF8]', buddyExpression: 'hurt', tagline: 'A heavy crack in my shell. Tender, but healing.' },
  { id: 'lonely', label: 'Lonely', emoji: '🥺', color: 'text-indigo-500', accentBg: '#F1F6FE', bgLight: 'bg-[#F1F6FE]', buddyExpression: 'lonely', tagline: 'An empty seat. Wishing for a kindred spark.' },
  { id: 'need-support', label: 'Need Support', emoji: '🤗', color: 'text-purple-500', accentBg: '#FAF7F0', bgLight: 'bg-[#FBF7FE]', buddyExpression: 'need-support', tagline: 'Ready to connect. A reaching hand is strength.' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌤️', color: 'text-yellow-600', accentBg: '#FFFDF0', bgLight: 'bg-[#FFFDF8]', buddyExpression: 'calm', tagline: 'Light breaking through the clouds. A fresh start.' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: 'text-slate-500', accentBg: '#F1F3F5', bgLight: 'bg-[#F8F9FA]', buddyExpression: 'numb', tagline: 'Rest is work too. Letting my batteries recharge.' },
];

const SESSION_TOPICS = [
  'Anxiety',
  'Stress',
  'Loneliness',
  'Overthinking',
  'Sleep & rest',
  'Grounding support',
  'Self-kindness',
  'Parkinson’s emotional support',
  'Caregiver support'
];

const SESSION_TYPES = ['Chat', 'Audio call', 'Video call'];
const PREFERRED_TIMES = ['Today', 'Tomorrow', 'This week', 'Not sure yet'];

function SessionChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void; key?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-2 text-[12px] font-display font-black transition-all cursor-pointer active:scale-[0.98] ${
        selected
          ? 'bg-[#FF7527] border-[#FF7527] text-white shadow-[0_8px_18px_rgba(255,117,39,0.20)]'
          : 'bg-white/85 border-orange-100 text-[#10213D] hover:border-[#FFB27A] hover:bg-[#FFF8F2]'
      }`}
    >
      {label}
    </button>
  );
}

export default function ResourcesScreen({ onBack }: ResourcesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hopeheart_favorite_resources');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Recently used state
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hopeheart_recent_resources');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Expert session panel states (preserved)
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Anxiety');
  const [selectedSessionType, setSelectedSessionType] = useState('Chat');
  const [selectedPreferredTime, setSelectedPreferredTime] = useState('Not sure yet');
  const [sessionNote, setSessionNote] = useState('');
  const [sessionSaveState, setSessionSaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });

  // Get active mood from local storage
  const selectedMoodId = localStorage.getItem('hopeheart_mood') || 'calm';
  const selectedMood = MOOD_CONFIGS.find(m => m.id === selectedMoodId) || MOOD_CONFIGS[0];

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('hopeheart_favorite_resources', JSON.stringify(next));
      return next;
    });
  };

  const handleOpenResource = (id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 5);
      localStorage.setItem('hopeheart_recent_resources', JSON.stringify(next));
      return next;
    });
  };

  const handleSelectArticle = (id: string) => {
    handleOpenResource(id);
    setActiveArticleId(id);
  };

  const handleSelectExercise = (id: string) => {
    handleOpenResource(id);
    setActiveExerciseId(id);
  };

  const handleSendSessionRequest = async () => {
    if (sessionSaveState.loading) return;

    setSessionSaveState({ loading: true });
    const result = await saveExpertSessionRequest({
      topic: selectedTopic,
      sessionType: selectedSessionType,
      preferredTime: selectedPreferredTime,
      note: sessionNote.trim()
    });

    if (!result.ok) {
      setSessionSaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

    setSessionNote('');
    setSessionSaveState({ loading: false, type: 'success', message: 'Your session request is saved safely.' });
  };

  // Render dedicated reading view if an article is active
  if (activeArticleId) {
    return (
      <ResourceDetailScreen
        articleId={activeArticleId}
        onBack={() => setActiveArticleId(null)}
        isFavorite={favorites.includes(activeArticleId)}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full animate-in fade-in duration-300">
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
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Wellness Hub</span>
        <span className="text-[20px] select-none">🌿</span>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-28 sm:pb-10 space-y-6">
        {/* Search bar */}
        <ResourceSearchBar query={searchQuery} setQuery={setSearchQuery} />

        {/* If an interactive exercise is not actively running, render standard sections */}
        {!activeExerciseId ? (
          <>
            {/* Daily suggestion & Mood recommendations */}
            {!searchQuery && (
              <>
                <DailySelfCareCard />
                <RecommendedResources
                  selectedMood={selectedMood}
                  onSelectArticle={handleSelectArticle}
                  onSelectExercise={handleSelectExercise}
                />
              </>
            )}

            {/* Bookmarks/Favorites */}
            <FavoritesSection
              favorites={favorites}
              onSelectArticle={handleSelectArticle}
              onSelectExercise={handleSelectExercise}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Quick Relief Steppers Grid */}
            <QuickReliefSection
              searchQuery={searchQuery}
              activeExercise={activeExerciseId}
              setActiveExercise={setActiveExerciseId}
              onActivityOpened={handleOpenResource}
            />

            {/* Learn & Grow Articles Grid */}
            <LearnAndGrowSection
              searchQuery={searchQuery}
              onSelectArticle={handleSelectArticle}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Recently Used History list */}
            {!searchQuery && (
              <RecentlyUsedSection
                recent={recent}
                onSelectArticle={handleSelectArticle}
                onSelectExercise={handleSelectExercise}
              />
            )}

            {/* Expert Session booking banner (preserved) */}
            {!searchQuery && (
              <div className="bg-gradient-to-br from-[#FFF8EE] via-[#FFFDF9] to-[#FFF0F4] border border-orange-100/80 rounded-[28px] p-4 sm:p-5 text-left shadow-3xs space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-white/80 border border-orange-100 flex items-center justify-center text-[24px] shrink-0">💛</span>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-display font-black text-[#10213D] text-[18px] leading-tight">Need someone to guide you?</h3>
                    <p className="text-[13px] text-[#56657C] font-semibold leading-relaxed">Request a gentle session with a verified support expert when reading is not enough.</p>
                  </div>
                </div>
                <p className="text-[11.5px] text-[#A05412] font-bold leading-relaxed bg-white/70 border border-orange-100/70 rounded-2xl p-3">Sessions are for emotional support and guidance only. No diagnosis, prescriptions, dosage advice, or emergency care.</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSessionPanel(true);
                      setSessionSaveState({ loading: false });
                    }}
                    className="flex-1 py-3 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.99]"
                  >
                    Request expert session
                  </button>
                  <span className="self-start sm:self-auto rounded-full bg-white/80 border border-orange-100 px-3.5 py-2 text-[11.5px] text-[#C75414] font-display font-black">Chat • Audio • Video</span>
                </div>
              </div>
            )}

            {/* Emergency Support Card accordion */}
            <EmergencySupportCard />
          </>
        ) : (
          /* Render active exercise with full width */
          <QuickReliefSection
            searchQuery={searchQuery}
            activeExercise={activeExerciseId}
            setActiveExercise={setActiveExerciseId}
            onActivityOpened={handleOpenResource}
          />
        )}
      </div>

      {/* Expert Session booking panel modal (preserved) */}
      {showSessionPanel && (
        <div className="fixed inset-0 z-50 bg-[#2B1D12]/35 backdrop-blur-[3px] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200" onClick={() => setShowSessionPanel(false)}>
          <div className="w-full sm:max-w-lg max-h-[88vh] overflow-y-auto bg-[#FFFDF9] border border-orange-100 rounded-t-[30px] sm:rounded-[30px] p-5 shadow-xl space-y-4" onClick={(event) => event.stopPropagation()}>
            <div className="w-11 h-1.5 rounded-full bg-[#EADFC9] mx-auto" />
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-display font-black text-[#10213D] text-[20px] leading-tight">Request a gentle session</h3>
                <p className="text-[12.5px] text-[#56657C] font-semibold leading-relaxed">Tell us what kind of support feels helpful. You can keep it simple.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSessionPanel(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center text-[12px] font-black cursor-pointer shrink-0"
                aria-label="Close expert session request"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] font-display font-black text-gray-700 uppercase tracking-wide">Topic</span>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TOPICS.map((topic) => (
                    <SessionChip key={topic} label={topic} selected={selectedTopic === topic} onClick={() => { setSelectedTopic(topic); setSessionSaveState({ loading: false }); }} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-display font-black text-gray-700 uppercase tracking-wide">Session type</span>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TYPES.map((type) => (
                    <SessionChip key={type} label={type} selected={selectedSessionType === type} onClick={() => { setSelectedSessionType(type); setSessionSaveState({ loading: false }); }} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-display font-black text-gray-700 uppercase tracking-wide">Preferred time</span>
                <div className="flex flex-wrap gap-2">
                  {PREFERRED_TIMES.map((time) => (
                    <SessionChip key={time} label={time} selected={selectedPreferredTime === time} onClick={() => { setSelectedPreferredTime(time); setSessionSaveState({ loading: false }); }} />
                  ))}
                </div>
              </div>

              <label className="bg-white/85 border border-orange-100 rounded-2xl px-3.5 py-3 flex items-center gap-2.5">
                <span className="text-[18px] text-gray-400">✎</span>
                <input
                  value={sessionNote}
                  onChange={(event) => { setSessionNote(event.target.value); setSessionSaveState({ loading: false }); }}
                  placeholder="One line about what you need…"
                  className="w-full bg-transparent text-[13px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none"
                />
              </label>
            </div>

            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed bg-[#FFF8F2] border border-orange-100 rounded-2xl p-3">HopeHeart sessions are for emotional support only and do not replace professional medical care or emergency services.</p>

            <button
              type="button"
              onClick={handleSendSessionRequest}
              disabled={sessionSaveState.loading}
              className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {sessionSaveState.loading ? 'Sending…' : 'Send session request'}
            </button>
            {sessionSaveState.message && (
              <p role="status" className={`text-[12px] font-bold text-center ${sessionSaveState.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                {sessionSaveState.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
