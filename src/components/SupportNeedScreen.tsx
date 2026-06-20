import { useState } from 'react';
import { motion } from 'motion/react';

interface SupportNeedScreenProps {
  onSelectOption: (optionId: string) => void;
  onBack: () => void;
}

export default function SupportNeedScreen({ onSelectOption, onBack }: SupportNeedScreenProps) {
  const [selectedOpt, setSelectedOpt] = useState<string>('');

  const options = [
    { id: 'safe-listener', label: 'I need someone to listen', emoji: '💬', tagline: 'Connect anonymously with a safe emotional peer listener.' },
    { id: 'support-rooms', label: 'I want to join a support community', emoji: '🛋️', tagline: 'Join focused anonymous sharing streams.' },
    { id: 'nearby-access', label: 'I want nearby community support', emoji: '📍', tagline: 'Discover emotional circles and local check-ins near you.' },
    { id: 'share-safely', label: 'I want to share a moment', emoji: '📸', tagline: 'Release raw feelings, small wins, or comforting doodles.' },
    { id: 'doctor-suggestions', label: 'I want to talk to a doctor or therapist', emoji: '🩺', tagline: 'Connect with verified clinical healthcare professionals.' },
    { id: 'crisis', label: 'I feel unsafe', emoji: '🚨', tagline: 'Immediate crisis dialers, emergency checklists, and helpers.', isAlert: true }
  ];

  const handleContinue = () => {
    if (!selectedOpt) return;
    onSelectOption(selectedOpt);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between p-5 md:p-8 font-sans select-none w-full">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-6">
        
        {/* Title Block */}
        <div className="text-center md:text-left space-y-1.5">
          <button 
            type="button"
            onClick={onBack}
            className="text-xs font-mono font-bold text-[#FF7527] hover:underline flex items-center gap-1 cursor-pointer mb-2"
          >
            ← Back to Mood Check-in
          </button>
          
          <h1 className="font-display font-black text-[#2B1D12] text-[22px] md:text-[28px] tracking-tight leading-tight">
            What do you need right now?
          </h1>
          <p className="text-[13.5px] text-gray-500 font-semibold leading-relaxed">
            Choose what feels closest. You do not need to explain everything. We help you find the right kind of support.
          </p>
        </div>

        {/* Option list grids */}
        <div className="space-y-2.5">
          {options.map((opt) => {
            const isSel = selectedOpt === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOpt(opt.id)}
                className={`w-full p-4 text-left border rounded-3xl transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  opt.isAlert 
                    ? isSel ? 'bg-red-50 border-red-500 shadow-sm' : 'bg-red-50/40 border-red-100 hover:bg-red-50'
                    : isSel ? 'bg-[#FFF2EA] border-[#FF7527] shadow-xs' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[19px] shrink-0 leading-none select-none ${
                    opt.isAlert ? 'bg-red-100' : 'bg-[#FAF7F0]'
                  }`}>
                    {opt.emoji}
                  </div>
                  <div>
                    <h3 className={`text-[13.5px] font-display font-extrabold ${opt.isAlert ? 'text-red-900' : 'text-gray-800'}`}>
                      {opt.label}
                    </h3>
                    <p className="text-[11.5px] text-gray-500 leading-normal mt-0.5 font-medium">
                      {opt.tagline}
                    </p>
                  </div>
                </div>
                
                {/* Custom Check radio */}
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSel ? 'border-[#FF7527]' : 'border-gray-300'
                }`}>
                  {isSel && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF7527]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Small note disclaimer */}
        <div className="bg-[#FAF7F0] border border-[#ECE6D9] py-3.5 px-4 rounded-2xl text-center shadow-xs">
          <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
            🛡️ <strong>Note:</strong> HopeHeart will not diagnose you. We protect your clinical boundaries and guide you towards safe companionship and care.
          </p>
        </div>

        {/* Main Continue button */}
        <div>
          <button
            onClick={handleContinue}
            disabled={!selectedOpt}
            className={`w-full py-4 font-display font-black text-white text-[15px] rounded-2xl transition-all flex items-center justify-center gap-2 ${
              selectedOpt 
                ? 'bg-[#1e1e1a] hover:bg-black cursor-pointer shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <svg className="w-4 h-4 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
