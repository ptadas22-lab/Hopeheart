import React from 'react';

export default function CommunityHome() {
  return (
    <div className="hh-hero-surface rounded-[30px] p-6 text-left overflow-hidden relative border border-orange-100/70 shadow-3xs select-none">
      <div className="absolute -top-12 -right-8 w-36 h-36 bg-[#E8D9FF]/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 right-20 w-28 h-28 bg-[#FFD4BD]/20 rounded-full blur-2xl" />
      <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_132px] gap-3 items-center">
        <div className="space-y-2">
          <h2 className="font-display font-black text-[#2B1D12] text-[26px] sm:text-[30px] leading-tight">
            You are never alone.
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#334155] font-semibold leading-relaxed">
            This space is built for encouragement, understanding and hope. A quiet sanctuary to walk alongside others.
          </p>
        </div>
        <div className="justify-self-center sm:justify-self-end relative w-24 h-24 rounded-[22px] bg-white/50 border border-white/70 flex items-center justify-center shadow-3xs">
          <span className="text-[44px]">🤝</span>
        </div>
      </div>
    </div>
  );
}
