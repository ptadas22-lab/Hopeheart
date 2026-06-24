import { useRef, useState } from 'react';

interface MemoryItem {
  id: string;
  text: string;
  prompt: string;
  createdAt: string;
}

interface MemoriesScreenProps {
  onBack: () => void;
}

const MEMORY_PROMPTS = [
  'A small moment that made me feel okay',
  'Someone who made me smile',
  'A place where I felt calm',
  'Something I survived and feel proud of'
];

export default function MemoriesScreen({ onBack }: MemoriesScreenProps) {
  const [selectedPrompt, setSelectedPrompt] = useState(MEMORY_PROMPTS[0]);
  const [memoryText, setMemoryText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hopeheart_positive_memories') || '[]');
    } catch {
      return [];
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveMemory = () => {
    if (!memoryText.trim()) return;
    const nextMemory: MemoryItem = {
      id: Date.now().toString(),
      text: memoryText.trim(),
      prompt: selectedPrompt,
      createdAt: new Date().toISOString()
    };
    const updated = [nextMemory, ...memories];
    setMemories(updated);
    localStorage.setItem('hopeheart_positive_memories', JSON.stringify(updated));
    setMemoryText('');
  };

  const handleImagePreview = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Memories</span>
        <span className="text-[20px] select-none">🌼</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 space-y-3 text-center">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Save a gentle memory</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Keep small proof that okay moments still exist. Saved locally on this device.</p>
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MEMORY_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setSelectedPrompt(prompt)}
                className={`p-3 rounded-2xl border text-left text-[12px] font-bold transition-all cursor-pointer ${selectedPrompt === prompt ? 'bg-[#FFF2EA] border-[#FF7527]/40 text-[#C75414]' : 'bg-white border-gray-200 text-gray-600 hover:bg-[#FFF8F2]'}`}
              >
                {prompt}
              </button>
            ))}
          </div>

          <textarea
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            rows={4}
            placeholder="Write a comforting moment here..."
            className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] text-gray-700 font-semibold focus:outline-none focus:border-[#FF7527]/50 resize-none"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImagePreview(e.target.files?.[0])}
          />
          {imagePreview && (
            <div className="rounded-2xl border border-gray-150 overflow-hidden bg-white">
              <img src={imagePreview} alt="Local memory preview" className="w-full max-h-56 object-cover" />
              <p className="text-[10.5px] text-gray-400 font-bold p-2 text-center">Preview only — image is not uploaded.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
            >
              Preview local image
            </button>
            <button
              type="button"
              onClick={handleSaveMemory}
              className="py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
            >
              Save comforting moment
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px] px-1">Saved memories</h3>
          {memories.length === 0 ? (
            <div className="hh-surface rounded-2xl p-4 text-center text-[12px] text-gray-500 font-semibold">No memories saved yet. Start with one small moment.</div>
          ) : memories.map((memory) => (
            <div key={memory.id} className="hh-surface rounded-2xl p-4 space-y-1">
              <span className="text-[10px] text-[#FF7527] font-mono font-black uppercase tracking-wider">{memory.prompt}</span>
              <p className="text-[12.5px] text-gray-650 font-semibold leading-relaxed">{memory.text}</p>
              <p className="text-[10px] text-gray-400 font-bold">{new Date(memory.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
