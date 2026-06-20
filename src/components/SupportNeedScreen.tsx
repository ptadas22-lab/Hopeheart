import { useState } from 'react';
import { motion } from 'motion/react';

interface SupportNeedScreenProps {
  onSelectOption: (optionId: string) => void;
  onBack: () => void;
}

export default function SupportNeedScreen({ onSelectOption, onBack }: SupportNeedScreenProps) {
  const options = [
    { id: 'safe-listener', label: 'Someone to Listen', emoji: '🤝', tagline: 'Talk anonymously with a trusted listener.' },
    { id: 'support-rooms', label: 'Community Circle', emoji: '🧡', tagline: "Join people who understand what you're going through." },
    { id: 'share-safely', label: 'Share a Moment', emoji: '✨', tagline: 'Share thoughts, feelings, or small wins.' },
    { id: 'doctor-suggestions', label: 'Professional Help', emoji: '🩺', tagline: 'Find verified professional resources when needed.' }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between p-5 md:p-8 font-sans select-none w-full relative pb-16">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-8 py-4">
        
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
            How would you like support today?
          </h1>
          <p className="text-[13.5px] text-gray-500 font-semibold leading-relaxed">
            Choose one path. You can always change it later.
          </p>
        </div>

        {/* Option list grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
          {options.map((opt) => (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectOption(opt.id)}
              className="p-5 md:p-6 bg-white border border-[#EDE9DE] hover:border-[#FF7527]/40 rounded-3xl text-left cursor-pointer transition-all flex flex-row sm:flex-col items-start gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F0] flex items-center justify-center text-[28px] select-none shrink-0">
                {opt.emoji}
              </div>
              <div className="space-y-1">
                <h3 className="text-[15.5px] font-display font-black text-[#2B1D12]">
                  {opt.label}
                </h3>
                <p className="text-[12.5px] text-gray-500 font-medium leading-relaxed">
                  {opt.tagline}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Small note disclaimer */}
        <div className="bg-[#FAF7F0] border border-[#ECE6D9] py-3.5 px-4 rounded-2xl text-center shadow-xs">
          <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
            🛡️ <strong>Note:</strong> HopeHeart will not diagnose you. We protect your clinical boundaries and guide you towards safe companionship and care.
          </p>
        </div>

      </div>

      {/* Sticky Emergency Support Button at bottom right */}
      <div className="absolute bottom-5 right-5 z-20">
        <motion.button
          onClick={() => onSelectOption('crisis')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-full text-[13px] font-extrabold text-red-700 cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          <span>🚨</span> Emergency Support
        </motion.button>
      </div>

    </div>
  );
}
