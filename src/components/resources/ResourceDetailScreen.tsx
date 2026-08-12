import React, { useState, useEffect } from 'react';
import { HOPEHEART_RESOURCES } from '../../services/maya/resourcesData';

interface ResourceDetailScreenProps {
  articleId: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export interface ArticleData {
  id: string;
  title: string;
  summary: string;
  time: string;
  icon: string;
  color: string;
  content: string[];
}

export const ARTICLES_DB: Record<string, ArticleData> = {};
HOPEHEART_RESOURCES.forEach(r => {
  if (r.type === 'article') {
    ARTICLES_DB[r.id] = {
      id: r.id,
      title: r.title,
      summary: r.description,
      time: r.readTime || '3 min read',
      icon: r.icon || '🌼',
      color: r.color || 'bg-orange-100 text-orange-700',
      content: r.content || []
    };
  }
});

export default function ResourceDetailScreen({
  articleId,
  onBack,
  isFavorite,
  onToggleFavorite
}: ResourceDetailScreenProps) {
  const article = ARTICLES_DB[articleId];

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center min-h-[50vh]">
        <span className="text-[48px]">⚠️</span>
        <h4 className="font-display font-black text-[#2B1D12] text-[18px]">Article Not Found</h4>
        <button
          onClick={onBack}
          className="py-2.5 px-6 bg-[#FF7527] text-white rounded-xl text-[13px] font-display font-black"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleCopyInsights = () => {
    const text = `${article.title}\n\n${article.content.join('\n\n')}\n\nShared from HopeHeart.`;
    navigator.clipboard.writeText(text)
      .then(() => alert('Insights copied to clipboard safely.'))
      .catch(() => alert('Failed to copy.'));
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label="Back to Wellness Hub"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[14.5px] uppercase tracking-tight truncate max-w-[180px]">
          {article.title}
        </span>
        <button
          onClick={() => onToggleFavorite(articleId)}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#FF7527] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label={isFavorite ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <span className="text-[17px]">{isFavorite ? '❤️' : '♡'}</span>
        </button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-5 space-y-6 text-left pb-24">
        <div className="flex items-center gap-4">
          <span className={`w-14 h-14 rounded-2xl ${article.color} flex items-center justify-center text-[28px] shrink-0 shadow-3xs`}>
            {article.icon}
          </span>
          <div className="space-y-1">
            <h1 className="font-display font-black text-[#2B1D12] text-[24px] leading-tight">
              {article.title}
            </h1>
            <span className="text-[12px] text-gray-400 font-bold block">
              {article.time}
            </span>
          </div>
        </div>

        <blockquote className="border-l-4 border-[#FF7527] pl-4 py-1.5 text-[14px] text-[#A05412] font-semibold italic bg-orange-50/30 rounded-r-xl">
          {article.summary}
        </blockquote>

        <div className="space-y-4 text-[14px] sm:text-[14.5px] text-gray-700 font-medium leading-relaxed">
          {article.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {articleId === 'healthy-habits' && (
          <HealthyHabitsChallenge />
        )}

        <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyInsights}
            type="button"
            className="w-full sm:w-auto py-2.5 px-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            📋 Copy insights
          </button>
          <button
            onClick={onBack}
            type="button"
            className="w-full sm:w-auto py-2.5 px-6 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center"
          >
            Return to Wellness Hub
          </button>
        </div>
      </div>
    </div>
  );
}

// === Healthy Habits Challenge Component ===

interface ChallengeItem {
  id: string;
  title: string;
  emoji: string;
  goal: string;
  reward: string;
  coupon: string;
}

const CHALLENGES: ChallengeItem[] = [
  { id: 'c1', title: 'Nourishing Breakfast', emoji: '🥣', goal: 'Have a balanced, nourishing breakfast today.', reward: '₹50 Wellness Reward', coupon: 'HH-WELL-50-BFAST' },
  { id: 'c2', title: 'Sugar Break', emoji: '🍫', goal: 'Avoid unnecessary chocolates, biscuits, and sugary snacks for one day.', reward: '₹30 Wellness Reward', coupon: 'HH-WELL-30-SUGAR' },
  { id: 'c3', title: 'Hydration Day', emoji: '💧', goal: 'Drink water regularly throughout the day.', reward: '₹30 Wellness Reward', coupon: 'HH-WELL-30-WATER' },
  { id: 'c4', title: '20-Minute Movement', emoji: '🚶', goal: 'Walk, stretch, dance, or do another comfortable physical activity for 20 minutes.', reward: '₹50 Wellness Reward', coupon: 'HH-WELL-50-MOVE' },
  { id: 'c5', title: 'Green Habit', emoji: '🌱', goal: 'Plant something or spend time caring for a plant.', reward: '₹50 Eco Reward', coupon: 'HH-ECO-50-PLANT' },
  { id: 'c6', title: 'Screen Break', emoji: '📱', goal: 'Take three short breaks away from screens today.', reward: '₹30 Wellness Reward', coupon: 'HH-WELL-30-SCREEN' },
  { id: 'c7', title: 'Better Bedtime', emoji: '💤', goal: 'Follow a relaxing bedtime routine and give yourself enough time to rest.', reward: '₹50 Wellness Reward', coupon: 'HH-WELL-50-SLEEP' },
  { id: 'c8', title: 'Add Something Nutritious', emoji: '🥗', goal: 'Add a fruit, vegetable, whole grain, or another nourishing food to one meal today.', reward: '₹50 Wellness Reward', coupon: 'HH-WELL-50-NUTRI' },
  { id: 'c9', title: 'Mindful Medicine', emoji: '💊', goal: 'Avoid unnecessary self-medication and use medicines only as directed by a qualified healthcare professional.', reward: '₹30 Wellness Reward', coupon: 'HH-WELL-30-MED' }
];

function HealthyHabitsChallenge() {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hopeheart_completed_challenges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeId, setActiveId] = useState<string | null>(() => {
    return localStorage.getItem('hopeheart_active_challenge');
  });

  const [selectedId, setSelectedId] = useState<string | null>(CHALLENGES[0].id);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleStartChallenge = (id: string) => {
    setActiveId(id);
    localStorage.setItem('hopeheart_active_challenge', id);
  };

  const handleCompleteChallenge = (id: string) => {
    const nextCompleted = [...completedIds, id];
    setCompletedIds(nextCompleted);
    localStorage.setItem('hopeheart_completed_challenges', JSON.stringify(nextCompleted));
    if (activeId === id) {
      setActiveId(null);
      localStorage.removeItem('hopeheart_active_challenge');
    }
  };

  const handleCopyCoupon = (coupon: string) => {
    navigator.clipboard.writeText(coupon)
      .then(() => {
        setCopySuccess(coupon);
        setTimeout(() => setCopySuccess(null), 2500);
      })
      .catch(() => alert('Failed to copy.'));
  };

  const selectedChallenge = CHALLENGES.find(c => c.id === selectedId) || CHALLENGES[0];
  const isActive = activeId === selectedChallenge.id;
  const isCompleted = completedIds.includes(selectedChallenge.id);

  return (
    <div className="mt-8 border-t border-gray-150 pt-6 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[18px] uppercase tracking-tight">
          🌱 Healthy Habits Challenge
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Choose one small challenge today. Small steps can become lasting habits.
        </p>
      </div>

      {/* Selected Challenge Detail Panel */}
      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF9F2] border border-[#F1E7D8]/80 rounded-[28px] p-5 shadow-3xs space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white border border-[#F1E7D8] flex items-center justify-center text-[24px] shrink-0 shadow-3xs">
            {selectedChallenge.emoji}
          </span>
          <div>
            <h4 className="font-display font-black text-[#2B1D12] text-[16px] leading-tight">
              {selectedChallenge.title}
            </h4>
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
              {selectedChallenge.reward} (Demo)
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#EDE9DE] rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-wider block">
            Challenge Goal
          </span>
          <p className="text-[13.5px] text-gray-700 font-semibold leading-relaxed">
            {selectedChallenge.goal}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2">
          {!isCompleted && !isActive && (
            <button
              onClick={() => handleStartChallenge(selectedChallenge.id)}
              className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
            >
              Start Challenge
            </button>
          )}

          {isActive && !isCompleted && (
            <button
              onClick={() => handleCompleteChallenge(selectedChallenge.id)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
            >
              Mark as Completed
            </button>
          )}

          {isCompleted && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-4 text-center">
                <span className="text-[18px] block text-emerald-800">🎉 Challenge completed!</span>
                <span className="text-[12.5px] text-emerald-800 font-semibold block mt-0.5">
                  Small steps matter. Keep going!
                </span>
              </div>

              {/* Reward Card */}
              <div className="bg-[#2B1D12] text-white rounded-2xl p-4 text-center space-y-2 border border-amber-900/30">
                <span className="text-[10px] font-mono font-extrabold text-amber-400 uppercase tracking-wider block">
                  Your Reward
                </span>
                <h5 className="font-display font-black text-[18px] leading-tight text-white">
                  {selectedChallenge.reward}
                </h5>
                <div className="bg-white/10 rounded-xl py-2 px-4 inline-block font-mono font-bold text-[13px] tracking-wider text-amber-200">
                  COUPON: {selectedChallenge.coupon}
                </div>
                <p className="text-[10px] text-gray-400 font-semibold block">
                  * Demo Reward card. Valid only for review verification.
                </p>
                <button
                  onClick={() => handleCopyCoupon(selectedChallenge.coupon)}
                  className="w-full mt-2 py-2 bg-amber-400 hover:bg-amber-500 text-[#2B1D12] rounded-xl text-[11.5px] font-display font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {copySuccess === selectedChallenge.coupon ? '✓ Copied!' : '📋 Copy Coupon'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-2 gap-3">
        {CHALLENGES.map((item) => {
          const isItemCompleted = completedIds.includes(item.id);
          const isItemActive = activeId === item.id;
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`rounded-2xl p-4 text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[108px] active:scale-[0.98] ${
                isSelected
                  ? 'border-[#FF7527] bg-[#FFF8F2] shadow-3xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[22px]">{item.emoji}</span>
                {isItemCompleted && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold">
                    ✓ Done
                  </span>
                )}
                {isItemActive && (
                  <span className="bg-orange-100 text-[#FF7527] text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold animate-pulse">
                    Active
                  </span>
                )}
              </div>
              <div className="space-y-0.5 mt-2">
                <span className="block font-display font-extrabold text-[#2B1D12] text-[13px] leading-tight line-clamp-1">
                  {item.title}
                </span>
                <span className="block text-[10px] text-gray-400 font-bold">
                  {item.reward.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
