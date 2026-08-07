import React, { useEffect, useState } from 'react';

const SUGGESTIONS = [
  "Drink a glass of water.",
  "Take five slow breaths.",
  "Step outside for two minutes.",
  "Message someone you trust.",
  "Write one positive thought.",
  "Stretch your body for one minute."
];

export default function DailySelfCareCard() {
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('hopeheart_daily_selfcare');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today && parsed.text) {
          setSuggestion(parsed.text);
          return;
        }
      } catch (e) {}
    }

    // Pick new suggestion
    const randomText = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
    localStorage.setItem('hopeheart_daily_selfcare', JSON.stringify({
      text: randomText,
      date: today
    }));
    setSuggestion(randomText);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF9F2] border border-[#F1E7D8]/80 rounded-[28px] p-5 text-left shadow-3xs relative overflow-hidden flex items-start gap-4 select-none">
      <div className="absolute -top-10 -right-6 w-24 h-24 bg-orange-100/20 rounded-full blur-xl" />
      <span className="w-12 h-12 rounded-2xl bg-white border border-[#F1E7D8] flex items-center justify-center text-[24px] shrink-0 shadow-3xs">
        🌞
      </span>
      <div className="space-y-1.5 flex-1 relative z-10">
        <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
          Daily Self-Care Idea
        </span>
        <h4 className="font-display font-black text-[#2B1D12] text-[16px] leading-tight">
          {suggestion || "Loading suggestion..."}
        </h4>
        <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
          One small, peaceful gesture for your well-being today.
        </p>
      </div>
    </div>
  );
}
