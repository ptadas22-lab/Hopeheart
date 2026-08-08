import React, { useState } from 'react';

export interface StoredMessage {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  timestamp: string;
}

export interface StoredSession {
  id: string;
  timestamp: string;
  title: string;
  messages: StoredMessage[];
}

interface ConversationHistoryProps {
  sessions: StoredSession[];
  onContinue: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

export default function ConversationHistory({
  sessions,
  onContinue,
  onDelete
}: ConversationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = sessions.filter((s) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      s.title.toLowerCase().includes(term) ||
      s.messages.some((m) => m.text.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
          Past Conversations
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Search and continue previous conversations stored locally on this device.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past chats..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-[#EDE9DE] rounded-xl text-[12.5px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#FF7527] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-655 text-[11px] font-bold"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-[#EDE9DE] rounded-[24px] p-4.5 shadow-3xs flex items-center justify-between gap-4 hover:border-[#FFB27A]/35 transition-all group"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  {new Date(s.timestamp).toLocaleDateString()}
                </span>
                <span className="text-[11px] text-gray-400 font-semibold">
                  • {s.messages.length} messages
                </span>
              </div>
              <span className="block font-display font-black text-[#2B1D12] text-[14px] truncate leading-tight">
                {s.title}
              </span>
              <p className="text-[12px] text-gray-400 font-semibold truncate leading-normal">
                Last message: {s.messages[s.messages.length - 1]?.text}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onContinue(s.id)}
                className="py-1.5 px-3.5 bg-orange-50 hover:bg-[#FFF2EA] border border-orange-100 text-[#FF7527] rounded-xl text-[11.5px] font-display font-black cursor-pointer transition-all active-scale"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this conversation record?')) {
                    onDelete(s.id);
                  }
                }}
                className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center text-[12px] font-black cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete history entry"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-semibold text-[13px] border border-dashed border-gray-200 rounded-[24px] bg-white/40">
            {searchQuery ? 'No matching conversations found.' : 'No past conversations saved yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
