import React from 'react';
import { ARTICLES_DB } from './ResourceDetailScreen';

interface LearnAndGrowSectionProps {
  searchQuery: string;
  onSelectArticle: (articleId: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function LearnAndGrowSection({
  searchQuery,
  onSelectArticle,
  favorites,
  onToggleFavorite
}: LearnAndGrowSectionProps) {
  const articles = Object.values(ARTICLES_DB);
  
  // Filter based on search query
  const filtered = articles.filter(article => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return article.title.toLowerCase().includes(term) ||
           article.summary.toLowerCase().includes(term);
  });

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3.5 select-none text-left">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
        Learn & Grow
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((article) => {
          const isFav = favorites.includes(article.id);
          return (
            <div
              key={article.id}
              className="bg-white/85 border border-[#EDE9DE] rounded-[26px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[148px] hover:border-[#FFB27A]/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className={`w-12 h-12 rounded-2xl ${article.color} flex items-center justify-center text-[24px] shrink-0 shadow-3xs`}>
                  {article.icon}
                </span>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="block font-display font-black text-[#2B1D12] text-[16px] leading-tight truncate">
                      {article.title}
                    </span>
                    <button
                      onClick={() => onToggleFavorite(article.id)}
                      type="button"
                      className="text-[#FF7527] hover:text-[#E55D13] p-1 text-[16px] cursor-pointer transition-all active:scale-90"
                      aria-label={isFav ? `Remove ${article.title} from bookmarks` : `Bookmark ${article.title}`}
                    >
                      {isFav ? '❤️' : '♡'}
                    </button>
                  </div>
                  <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-50 mt-3 flex items-center justify-between">
                <span className="text-[11.5px] text-gray-400 font-bold">
                  {article.time}
                </span>
                <button
                  onClick={() => onSelectArticle(article.id)}
                  type="button"
                  className="py-1.5 px-4 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
                >
                  Read More
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
