import React from 'react';

interface CareBridgeHomeProps {
  onStart: () => void;
}

export default function CareBridgeHome({ onStart }: CareBridgeHomeProps) {
  return (
    <div className="space-y-6 text-center select-none max-w-md mx-auto py-6">
      {/* Visual illustration box */}
      <div className="relative w-28 h-28 rounded-[28px] bg-gradient-to-br from-[#FFE8DE] to-[#FFF1EA] border border-orange-100/70 shadow-3xs flex items-center justify-center text-[54px] mx-auto select-none rotate-[-3deg]">
        🌉
      </div>

      <div className="space-y-3.5">
        <h2 className="font-display font-black text-[#2B1D12] text-[26px] sm:text-[30px] leading-tight">
          CareBridge Support Circle
        </h2>
        <p className="text-[14.5px] text-gray-500 font-semibold leading-relaxed px-2">
          CareBridge helps you stay connected with people you trust.
        </p>
      </div>

      <div className="bg-white border border-[#EDE9DE]/80 rounded-[28px] p-5.5 text-left space-y-3 shadow-3xs">
        <div className="flex items-start gap-3 text-[13px] text-gray-600 font-semibold">
          <span className="text-[16px] shrink-0">🤝</span>
          <span>You decide who is invited.</span>
        </div>
        <div className="flex items-start gap-3 text-[13px] text-gray-600 font-semibold border-t border-gray-50 pt-3">
          <span className="text-[16px] shrink-0">🔒</span>
          <span>You decide what is shared.</span>
        </div>
        <div className="flex items-start gap-3 text-[13px] text-gray-600 font-semibold border-t border-gray-50 pt-3">
          <span className="text-[16px] shrink-0">🔄</span>
          <span>You can change your mind at any time.</span>
        </div>
      </div>

      <button
        onClick={onStart}
        type="button"
        className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-2xl text-[13.5px] font-display font-black cursor-pointer transition-all active:scale-[0.98] shadow-3xs"
      >
        Get Started
      </button>
    </div>
  );
}
