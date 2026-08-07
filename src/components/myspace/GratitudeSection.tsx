import React, { useState, useEffect } from 'react';

interface GratitudeEntry {
  id: string;
  date: string;
  prompt: string;
  answer: string;
}

const PROMPTS = [
  "What made you smile today? 🌻",
  "What are you thankful for? 💛",
  "Who helped you today? 🤝",
  "What was a small victory you noticed today? 🏆",
  "What is a cozy comfort you appreciated today? ☕"
];

export default function GratitudeSection() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);

  useEffect(() => {
    // Pick daily prompt based on calendar date to keep it consistent throughout the day
    const day = new Date().getDate();
    const index = day % PROMPTS.length;
    setPrompt(PROMPTS[index]);

    // Load saved gratitude entries
    const saved = localStorage.getItem('hopeheart_gratitude');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    const newEntry: GratitudeEntry = {
      id: 'g-' + Date.now(),
      date: new Date().toISOString(),
      prompt,
      answer: answer.trim()
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('hopeheart_gratitude', JSON.stringify(updated));
    setAnswer("");
  };

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Gratitude Journal
      </h3>

      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#FFFDF9] to-[#FFFBF2] border border-[#F1E7D8]/80 rounded-[24px] p-5 space-y-3.5 shadow-3xs">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
            Daily Gratitude Prompt
          </span>
          <h4 className="font-display font-black text-[#2B1D12] text-[15.5px] leading-tight">
            {prompt}
          </h4>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="A short answer is perfect..."
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            aria-label="Daily gratitude answer"
          />
          <button
            type="submit"
            className="py-2.5 px-5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs shrink-0"
          >
            Save
          </button>
        </div>
      </form>

      {/* History List */}
      {entries.length > 0 && (
        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-[#EDE9DE]/75 rounded-xl p-3.5 shadow-3xs space-y-1 leading-normal"
            >
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span className="text-[#FF7527]">{entry.prompt.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim()}</span>
              </div>
              <p className="text-[12.5px] text-[#2B1D12] font-semibold">
                "{entry.answer}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
