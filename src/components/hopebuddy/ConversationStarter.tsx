import React from 'react';

interface ConversationStarterProps {
  onSelectStarter: (text: string) => void;
}

const STARTERS = [
  "How are you feeling today?",
  "What's on your mind?",
  "Would you like to reflect or simply talk?"
];

export default function ConversationStarter({ onSelectStarter }: ConversationStarterProps) {
  return (
    <div className="space-y-2.5 text-left select-none animate-in fade-in duration-200">
      <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
        Start a Conversation
      </span>
      <div className="flex flex-col gap-2">
        {STARTERS.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelectStarter(text)}
            className="w-full text-left p-3.5 bg-white border border-[#EDE9DE] rounded-[20px] text-[13.5px] font-semibold text-gray-700 hover:bg-[#FFF8F2] hover:border-[#FFB27A]/35 transition-all active-scale cursor-pointer"
          >
            💬 "{text}"
          </button>
        ))}
      </div>
    </div>
  );
}
