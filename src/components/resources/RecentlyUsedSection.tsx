import React from 'react';
import { ARTICLES_DB } from './ResourceDetailScreen';

interface RecentlyUsedSectionProps {
  recent: string[];
  onSelectArticle: (articleId: string) => void;
  onSelectExercise: (exerciseId: string) => void;
}

const EXERCISES_MAP: Record<string, { title: string, icon: string }> = {
  'breathing': { title: 'Breathing Exercise', icon: '🌬' },
  'grounding': { title: 'Grounding (5-4-3-2-1)', icon: '🧘' },
  'calm-sounds': { title: 'Calm Sounds', icon: '🎵' },
  'break-timer': { title: 'Take a Short Break', icon: '☕' }
};

export default function RecentlyUsedSection({
  recent,
  onSelectArticle,
  onSelectExercise
}: RecentlyUsedSectionProps) {
  if (recent.length === 0) return null;

  return (
    <div className="space-y-3 select-none text-left">
      <h3 className="font-display font-black text-[#2B1D12] text-[15px] uppercase tracking-tight flex items-center gap-1.5">
        <span>🕒</span> Recently Used
      </h3>

      <div className="flex flex-wrap gap-2.5">
        {recent.map((id) => {
          const isArticle = ARTICLES_DB[id] !== undefined;
          const isExercise = EXERCISES_MAP[id] !== undefined;
          
          if (!isArticle && !isExercise) return null;

          const title = isArticle ? ARTICLES_DB[id].title : EXERCISES_MAP[id].title;
          const icon = isArticle ? ARTICLES_DB[id].icon : EXERCISES_MAP[id].icon;

          return (
            <button
              key={id}
              onClick={() => isArticle ? onSelectArticle(id) : onSelectExercise(id)}
              type="button"
              className="px-3.5 py-2 bg-white border border-[#EDE9DE] hover:border-[#FF7527] hover:bg-[#FFF8F2] rounded-xl text-[12.5px] font-semibold text-[#2B1D12] cursor-pointer flex items-center gap-2 transition-all active:scale-95 shadow-3xs"
            >
              <span>{icon}</span>
              <span>{title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
