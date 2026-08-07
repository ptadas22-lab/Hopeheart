import React from 'react';
import { ARTICLES_DB } from './ResourceDetailScreen';

interface FavoritesSectionProps {
  favorites: string[];
  onSelectArticle: (articleId: string) => void;
  onSelectExercise: (exerciseId: string) => void;
  onToggleFavorite: (id: string) => void;
}

const EXERCISES_MAP: Record<string, { title: string, icon: string, desc: string }> = {
  'breathing': { title: 'Breathing Exercise', icon: '🌬', desc: 'Deep breathing pace' },
  'grounding': { title: 'Grounding (5-4-3-2-1)', icon: '🧘', desc: 'Sensory awareness' },
  'calm-sounds': { title: 'Calm Sounds', icon: '🎵', desc: 'Ambient soundscape' },
  'break-timer': { title: 'Take a Short Break', icon: '☕', desc: 'Calming break timer' }
};

export default function FavoritesSection({
  favorites,
  onSelectArticle,
  onSelectExercise,
  onToggleFavorite
}: FavoritesSectionProps) {
  if (favorites.length === 0) {
    return (
      <div className="space-y-3.5 select-none text-left">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight flex items-center gap-1.5">
          <span>❤️</span> Bookmarks
        </h3>
        <div className="text-center py-8 text-gray-400 font-semibold text-[13px] border border-dashed border-gray-200 rounded-[22px] bg-white/40">
          No favorite resources yet.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 select-none text-left">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight flex items-center gap-1.5">
        <span>❤️</span> Bookmarks
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {favorites.map((id) => {
          const isArticle = ARTICLES_DB[id] !== undefined;
          const isExercise = EXERCISES_MAP[id] !== undefined;
          
          if (!isArticle && !isExercise) return null;

          const title = isArticle ? ARTICLES_DB[id].title : EXERCISES_MAP[id].title;
          const icon = isArticle ? ARTICLES_DB[id].icon : EXERCISES_MAP[id].icon;
          const desc = isArticle ? ARTICLES_DB[id].summary : EXERCISES_MAP[id].desc;

          return (
            <div
              key={id}
              className="bg-white/85 border border-[#EDE9DE] rounded-[22px] p-4 text-left shadow-3xs flex items-center justify-between gap-3"
            >
              <div className="flex gap-2.5 min-w-0 flex-1">
                <span className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[18px] shrink-0 select-none">
                  {icon}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-display font-extrabold text-[#2B1D12] text-[13.5px] truncate">
                    {title}
                  </span>
                  <p className="text-[11.5px] text-gray-500 font-semibold truncate leading-normal">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onToggleFavorite(id)}
                  type="button"
                  className="text-gray-400 hover:text-red-500 p-1 text-[13px] cursor-pointer"
                  title="Unbookmark"
                >
                  ✕
                </button>
                <button
                  onClick={() => isArticle ? onSelectArticle(id) : onSelectExercise(id)}
                  type="button"
                  className="py-1.5 px-3 bg-white border border-[#FF7527] text-[#FF7527] hover:bg-[#FFF8F2] rounded-lg text-[10.5px] font-display font-black cursor-pointer transition-all active:scale-95"
                >
                  Open
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
