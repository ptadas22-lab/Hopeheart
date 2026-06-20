import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MoodConfig } from '../types';

interface HeartCheckScreenProps {
  onMoodSelected: (moodId: string) => void;
  onBack: () => void;
  moodConfigs: MoodConfig[];
  initialSelected?: string;
}

export default function HeartCheckScreen({ 
  onMoodSelected, 
  onBack, 
  moodConfigs,
  initialSelected = 'calm'
}: HeartCheckScreenProps) {
  const [selectedMoodId, setSelectedMoodId] = useState<string>(initialSelected);

  const currentMoodObj = moodConfigs.find((m) => m.id === selectedMoodId) || moodConfigs[0];

  const handleNext = () => {
    onMoodSelected(selectedMoodId);
  };

  const getMascotMessage = (moodId: string): string => {
    switch (moodId) {
      case 'calm':
        return "I'm glad today feels peaceful.";
      case 'anxious':
        return "It's okay to slow down. You don't have to carry everything alone.";
      case 'lonely':
        return "Someone is ready to listen when you're ready to share.";
      case 'sad':
        return "It's okay to feel down. Healing takes its own time.";
      case 'hurt':
        return "Your feelings are valid. Take gentle care of yourself today.";
      case 'need-support':
        return "Reaching out is a sign of strength. We're here for you.";
      case 'hopeful':
        return "Cherish this warmth. Bright steps are ahead.";
      case 'tired':
        return "Rest is productive too. Be gentle with your energy.";
      default:
        return currentMoodObj.tagline;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] p-5 font-sans select-none justify-between">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <button 
          onClick={onBack}
          id="btn-back-heartcheck"
          className="w-11 h-11 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 active:scale-95 transition-all text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-bold text-gray-800 text-[17px]">Daily Check-In</span>
        <div className="w-11 h-11" /> {/* Spacer */}
      </div>

      {/* Main Responsive Grid layout */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-5xl mx-auto w-full">
          
          {/* Left side: Title, Mascot, Emotional message */}
          <div className="flex flex-col items-center text-center p-2 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <motion.h2 
                className="font-display font-extrabold text-[24px] md:text-[32px] text-[#2B1D12] tracking-tight leading-tight"
                key={currentMoodObj.id + '-title'}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                How are you feeling today?
              </motion.h2>

              <p className="text-[14px] md:text-[15px] text-gray-500 font-medium">
                Choose the feeling that best matches your current mood.
              </p>
            </div>

            {/* Mascot Frame */}
            <div className="h-[180px] md:h-[220px] flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMoodObj.buddyExpression}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <Mascot expression={currentMoodObj.buddyExpression} size={160} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tagline / Healing Affirmation */}
            <div className="min-h-[50px] flex items-center justify-center px-4 max-w-sm">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMoodObj.id + '-tagline'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="text-[14px] font-semibold italic text-gray-700 leading-relaxed text-center"
                >
                  "{getMascotMessage(currentMoodObj.id)}"
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Right side: Mood choices (2-column grid), Continue, Safety note */}
          <div className="flex flex-col space-y-6 p-2">
            
            {/* Mood Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {moodConfigs.map((mood) => {
                const isSelected = mood.id === selectedMoodId;
                return (
                  <motion.button
                    key={mood.id}
                    id={`mood-card-${mood.id}`}
                    onClick={() => setSelectedMoodId(mood.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="py-3 px-4 flex items-center gap-3 rounded-2xl border text-left transition-all min-h-[52px] select-none cursor-pointer"
                    style={{
                      borderColor: isSelected ? '#FF7527' : '#EEE9DD',
                      backgroundColor: isSelected ? '#FFF2EA' : 'white',
                      fontWeight: isSelected ? '600' : '500',
                    }}
                  >
                    <span className="text-[20px] filter drop-shadow-sm">{mood.emoji}</span>
                    <span className="text-[14px] text-gray-800 tracking-tight">
                      {mood.label}
                    </span>
                    {isSelected && (
                      <motion.div 
                        layoutId="selectedCheck"
                        className="ml-auto w-4.5 h-4.5 rounded-full bg-[#FF7527] flex items-center justify-center text-white shrink-0"
                      >
                        <svg className="w-3 h-3 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Actions & Disclaimers */}
            <div className="space-y-4">
              <button
                onClick={handleNext}
                id="btn-confirm-heartcheck"
                className="w-full py-4 bg-[#1E1E1A] hover:bg-black text-[15px] hover:scale-[1.01] active:scale-[0.99] font-display font-bold rounded-2xl text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Continue →
              </button>

              <div className="bg-[#FAF7F0] border border-[#ECE6D9] py-3.5 px-4 rounded-xl text-center">
                <p className="text-[12px] text-gray-500 font-semibold leading-normal">
                  HopeHeart is a support space, not a medical service.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
