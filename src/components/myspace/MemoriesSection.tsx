import React, { useState } from 'react';

export interface MemoryEntry {
  id: string;
  title: string;
  story: string;
  type: string;
  emoji?: string;
  savedAt: string;
}

interface MemoriesSectionProps {
  memories: MemoryEntry[];
  onAddMemory: (memory: Omit<MemoryEntry, 'id' | 'savedAt'>) => void;
  onDeleteMemory: (id: string) => void;
}

const MEMORY_TYPES = [
  { label: 'Small win', icon: '🏆' },
  { label: 'Kind moment', icon: '💗' },
  { label: 'Peaceful moment', icon: '🌿' },
  { label: 'Someone helped me', icon: '👥' },
  { label: 'I felt connected', icon: '💛' },
  { label: 'I made it through', icon: '⛰️' }
];

export default function MemoriesSection({
  memories,
  onAddMemory,
  onDeleteMemory
}: MemoriesSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New memory form state
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [type, setType] = useState('Small win');
  const [customEmoji, setCustomEmoji] = useState('🏆');

  const handleSelectType = (label: string, icon: string) => {
    setType(label);
    setCustomEmoji(icon);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !story.trim()) return;

    onAddMemory({
      title: title.trim(),
      story: story.trim(),
      type,
      emoji: customEmoji
    });

    // Reset
    setTitle('');
    setStory('');
    setType('Small win');
    setCustomEmoji('🏆');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4 text-left select-none">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Positive Memories
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          type="button"
          className="py-1.5 px-4 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[11.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          {showAddForm ? 'Cancel' : 'Save Moment'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 space-y-4 shadow-3xs animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              What happened? (Title)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Watched the sunrise, A kind chat..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Memory Theme
            </span>
            <div className="flex flex-wrap gap-2">
              {MEMORY_TYPES.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectType(opt.label, opt.icon)}
                  className={`py-1.5 px-3 border rounded-xl text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                    type === opt.label
                      ? 'bg-orange-50 border-[#FF7527] text-[#FF7527]'
                      : 'bg-white border-gray-200 text-[#2B1D12] hover:bg-gray-50'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Optional Emoji
            </label>
            <input
              type="text"
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value.slice(0, 2))}
              placeholder="🏆"
              className="w-16 px-3 py-2.5 border border-gray-200 rounded-xl text-[14px] text-center bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Write the Story
            </label>
            <textarea
              required
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Why does this moment matter? Tell the story..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95"
          >
            Save Memory
          </button>
        </form>
      )}

      {/* Memory Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {memories.map((entry) => (
          <div
            key={entry.id}
            className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[160px] relative group hover:border-[#FFB27A]/35 transition-all"
          >
            <button
              onClick={() => onDeleteMemory(entry.id)}
              type="button"
              className="absolute right-4 top-4 w-6 h-6 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center text-[11px] font-black opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Delete memory"
            >
              ✕
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-orange-50/50 border border-orange-100/30 flex items-center justify-center text-[20px] shrink-0 select-none">
                  {entry.emoji || '🏆'}
                </span>
                <div>
                  <h4 className="font-display font-black text-[#2B1D12] text-[15px] leading-tight">
                    {entry.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-bold block">
                    {new Date(entry.savedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-[12.5px] text-gray-600 font-semibold leading-relaxed">
                {entry.story}
              </p>
            </div>

            {/* Photo Placeholder decoration */}
            <div className="mt-4 pt-3 border-t border-dashed border-gray-150 flex items-center gap-2 text-[10.5px] text-gray-400 font-bold">
              <span>🖼️ Polaroid Frame</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Saved locally</span>
            </div>
          </div>
        ))}

        {memories.length === 0 && (
          <div className="col-span-1 sm:col-span-2 text-center py-8 text-gray-400 font-semibold text-[13px]">
            No positive memories saved yet. Record a happy moment.
          </div>
        )}
      </div>
    </div>
  );
}
