import React, { useState, useEffect } from 'react';
import { JournalEntry } from './JournalSection';

interface MoodLog {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  message: string;
}

interface MoodTimelineProps {
  journals: JournalEntry[];
}

const SUPPORTIVE_MESSAGES: Record<string, string> = {
  calm: "Take a moment to appreciate this peaceful feeling. Small moments of calm matter.",
  peaceful: "You deserve moments like this. Carry this feeling with you today.",
  okay: "One day at a time. Every small check-in counts toward your journey.",
  low: "Thank you for checking in. Caring for yourself starts with noticing.",
  anxious: "Let's slow down together. Breathe out, let go, you are not alone.",
  tired: "Rest is an important part of healing. Sleep counts as self-care.",
  overwhelmed: "You don't have to carry everything alone. Let's find one small grounding focus.",
  sad: "It's okay to feel sad. Be gentle with yourself today.",
  frustrated: "Let's pause. Take a slow deep breath, and let it go.",
  numb: "Thank you for being here. You are valid, and you are not alone.",
  hopeful: "Hold onto this feeling. Hope grows when we focus on what lifts us."
};

const MOCK_HISTORY: MoodLog[] = [
  { id: 'h-1', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 'Hopeful', emoji: '🌤️', message: "Hope grows when we notice it." },
  { id: 'h-2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 'Anxious', emoji: '😟', message: "You're not alone in this feeling." },
  { id: 'h-3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], mood: 'Calm', emoji: '😊', message: "It's good to notice peaceful moments." }
];

export default function MoodTimeline({ journals }: MoodTimelineProps) {
  const [history, setHistory] = useState<MoodLog[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const key = 'hopeheart_mood_history';
    const saved = localStorage.getItem(key);
    
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
        return;
      } catch (e) {}
    }

    // Default mock history
    localStorage.setItem(key, JSON.stringify(MOCK_HISTORY));
    setHistory(MOCK_HISTORY);
  }, []);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Sort history newest first
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Mood Timeline
      </h3>

      <div className="relative pl-6 border-l border-[#F1E7D8]/80 ml-3 space-y-5 py-2">
        {sorted.map((log) => {
          const isExpanded = expandedId === log.id;
          
          // Match journal entry from the same date
          const matchingJournal = journals.find(
            (j) => new Date(j.date).toISOString().split('T')[0] === log.date
          );

          return (
            <div key={log.id} className="relative">
              {/* Timeline marker node */}
              <button
                onClick={() => handleToggleExpand(log.id)}
                type="button"
                className={`absolute -left-9.5 top-0.5 w-7 h-7 rounded-full bg-white border border-[#F1E7D8] flex items-center justify-center text-[14px] shadow-3xs cursor-pointer hover:border-[#FF7527] transition-all ${
                  isExpanded ? 'ring-2 ring-orange-100 border-[#FF7527]' : ''
                }`}
                aria-label={`Expand details for ${log.mood} checkin on ${log.date}`}
              >
                {log.emoji || '😊'}
              </button>

              <div className="space-y-1.5">
                <button
                  onClick={() => handleToggleExpand(log.id)}
                  type="button"
                  className="text-left block w-full focus-visible:outline-none"
                >
                  <span className="block text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider leading-none">
                    {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="font-display font-black text-[#2B1D12] text-[14.5px] leading-tight">
                    Felt {log.mood}
                  </span>
                </button>

                {isExpanded && (
                  <div className="bg-[#FFFDF9] border border-[#F1E7D8]/60 rounded-xl p-4.5 space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-wider block">
                        Support Message
                      </span>
                      <p className="text-[12.5px] text-gray-600 font-semibold leading-relaxed">
                        {log.message || SUPPORTIVE_MESSAGES[log.mood.toLowerCase()] || "Empathetic feedback checkin."}
                      </p>
                    </div>

                    {matchingJournal ? (
                      <div className="pt-3 border-t border-gray-100 space-y-1">
                        <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                          Related Journal Log
                        </span>
                        <span className="block font-display font-extrabold text-[#2B1D12] text-[13px]">
                          {matchingJournal.title}
                        </span>
                        <p className="text-[12px] text-gray-500 font-semibold line-clamp-2 leading-relaxed">
                          {matchingJournal.text}
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-gray-50">
                        <span className="text-[10.5px] text-gray-400 font-bold italic">
                          No journal log written on this day.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-6 text-gray-400 font-semibold text-[13px]">
            No check-in timeline recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
