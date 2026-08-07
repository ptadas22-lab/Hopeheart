import React from 'react';

export default function PrivateLockCard() {
  return (
    <div className="bg-[#FAF7F0] border border-[#EADFC9] rounded-[24px] p-4 text-left shadow-3xs flex items-start gap-3.5 select-none">
      <span className="text-[24px] leading-none shrink-0">🔒</span>
      <div className="space-y-1">
        <h4 className="font-display font-black text-[#2B1D12] text-[13.5px] leading-tight">
          Everything here is private
        </h4>
        <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
          All entries, check-ins, memories, and self-care plans are stored locally on your device. Only you can access them. No remote sharing by default.
        </p>
      </div>
    </div>
  );
}
