import React from 'react';

export interface SessionSummaryItem {
  id: string;
  timestamp: string;
  notes: string[];
}

interface SessionSummaryProps {
  summaries: SessionSummaryItem[];
  onClearAll: () => void;
}

export default function SessionSummary({
  summaries,
  onClearAll
}: SessionSummaryProps) {
  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Session Summaries
        </h3>
        {summaries.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all local session summaries?')) {
                onClearAll();
              }
            }}
            type="button"
            className="text-[11.5px] font-display font-black text-red-500 hover:text-red-700 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {summaries.map((summary) => (
          <div
            key={summary.id}
            className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 shadow-3xs text-left"
          >
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block mb-2.5">
              📅 Conversation: {new Date(summary.timestamp).toLocaleString()}
            </span>
            <ul className="space-y-2">
              {summary.notes.map((note, idx) => (
                <li key={idx} className="text-[12.5px] text-gray-600 font-semibold flex items-start gap-2.5">
                  <span className="text-orange-300 pt-0.5 shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {summaries.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-semibold text-[13px] border border-dashed border-gray-200 rounded-[24px] bg-white/40">
            No session summaries saved yet. Complete a chat to generate one.
          </div>
        )}
      </div>
    </div>
  );
}
