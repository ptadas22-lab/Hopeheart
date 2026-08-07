import React from 'react';

interface ResourceSearchBarProps {
  query: string;
  setQuery: (q: string) => void;
}

export default function ResourceSearchBar({ query, setQuery }: ResourceSearchBarProps) {
  return (
    <div className="w-full relative">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[16px] text-gray-400 select-none">
        🔍
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search relief exercises, guides..."
        className="w-full pl-11 pr-4 py-3.5 bg-white/85 border border-[#EDE9DE] rounded-2xl text-[13.5px] font-semibold text-[#2B1D12] placeholder:text-gray-400 outline-none focus:border-[#FF7527] shadow-3xs transition-all focus-visible:ring-1 focus-visible:ring-[#FF7527]"
        aria-label="Search resources"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xs font-black cursor-pointer"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
