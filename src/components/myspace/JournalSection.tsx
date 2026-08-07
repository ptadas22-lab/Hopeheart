import React, { useState } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  mood: string;
  text: string;
  tags: string[];
}

interface JournalSectionProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  onDeleteEntry: (id: string) => void;
}

const AVAILABLE_TAGS = ['Work', 'Family', 'Health', 'Friends', 'Hope'];
const MOOD_OPTIONS = [
  { label: 'Calm', emoji: '😊' },
  { label: 'Peaceful', emoji: '😌' },
  { label: 'Okay', emoji: '🙂' },
  { label: 'Low', emoji: '😔' },
  { label: 'Anxious', emoji: '😟' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Overwhelmed', emoji: '😤' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Frustrated', emoji: '😠' },
  { label: 'Numb', emoji: '😶' },
  { label: 'Hopeful', emoji: '❤️' }
];

export default function JournalSection({
  entries,
  onAddEntry,
  onDeleteEntry
}: JournalSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New entry form state
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('Okay');
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddEntry({
      title: title.trim() || 'Untitled Reflection',
      mood,
      text: text.trim(),
      tags: selectedTags
    });

    // Reset form
    setTitle('');
    setMood('Okay');
    setText('');
    setSelectedTags([]);
    setShowAddForm(false);
  };

  // Filter entries
  const filtered = entries.filter((entry) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return entry.title.toLowerCase().includes(term) ||
           entry.text.toLowerCase().includes(term) ||
           entry.tags.some(tag => tag.toLowerCase().includes(term)) ||
           entry.mood.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-4 text-left select-none">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Private Journal
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          type="button"
          className="py-1.5 px-4 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[11.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          {showAddForm ? 'Cancel' : 'Write Entry'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 space-y-4 shadow-3xs animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning thoughts, Coping step..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Today's Mood
            </span>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setMood(opt.label)}
                  className={`py-1.5 px-3 border rounded-xl text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                    mood === opt.label
                      ? 'bg-orange-50 border-[#FF7527] text-[#FF7527]'
                      : 'bg-white border-gray-200 text-[#2B1D12] hover:bg-gray-50'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`py-1 px-3 border rounded-lg text-[11px] font-bold cursor-pointer transition-all active:scale-95 ${
                      selected
                        ? 'bg-[#2B1D12] border-[#2B1D12] text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Entry Text
            </label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write whatever feels right..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95"
          >
            Save Diary Entry
          </button>
        </form>
      )}

      {/* Search Input */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search journal entries by title or tag..."
          className="w-full pl-9 pr-4 py-2 bg-white/70 border border-orange-100/60 rounded-xl text-[12.5px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#FF7527] transition-all"
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

      {/* Entry List */}
      <div className="space-y-3.5">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="bg-white border border-[#EDE9DE]/75 rounded-[22px] p-4.5 shadow-3xs space-y-3 relative group hover:border-[#FFB27A]/30 transition-all"
          >
            <button
              onClick={() => onDeleteEntry(entry.id)}
              type="button"
              className="absolute right-4.5 top-4.5 w-6 h-6 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center text-[11.5px] font-black opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Delete journal entry"
            >
              ✕
            </button>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-display font-extrabold text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="text-[11px] font-black bg-orange-50 text-[#FF7527] px-2 py-0.5 rounded-md">
                  Mood: {entry.mood}
                </span>
              </div>
              <h4 className="font-display font-black text-[#2B1D12] text-[15.5px]">
                {entry.title}
              </h4>
            </div>

            <p className="text-[13px] text-gray-600 font-semibold leading-relaxed whitespace-pre-wrap">
              {entry.text}
            </p>

            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-black bg-[#2B1D12] text-white px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-semibold text-[13px]">
            {searchQuery ? 'No matching journal entries found.' : 'Your journal is empty. Write your first reflection.'}
          </div>
        )}
      </div>
    </div>
  );
}
