import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../types';

interface SupportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string; // The mood ID, e.g. anxious, sad, calm, etc.
  onNavigateTo: (screenId: string) => void;
}

export default function SupportPopup({ isOpen, onClose, activeCategory, onNavigateTo }: SupportPopupProps) {
  if (!isOpen) return null;

  const mood = (activeCategory || 'calm').toLowerCase();
  let message = "I'm glad you checked in today. Want to take one small step for your well-being today?";

  if (mood === 'anxious' || mood === 'overwhelmed') {
    message = "I see you're feeling anxious today. You don't have to handle everything at once. Would you like to take a small moment together?";
  } else if (mood === 'sad' || mood === 'hurt' || mood === 'lonely' || mood === 'need-support') {
    message = "I'm glad you checked in with me. You don't have to carry everything alone. Would you like to talk?";
  } else if (mood === 'hopeful' || mood === 'calm' || mood === 'happy') {
    message = "I'm glad you're feeling good today! 🌱 Want to do something small to keep that feeling going?";
  } else if (mood === 'tired' || mood === 'low') {
    message = "Sounds like you might need a little gentleness today. Want to take one small moment for yourself?";
  }

  const handleTalkToMaya = () => {
    onClose();
    onNavigateTo(ScreenId.HopeBuddyChat);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF8F2] to-[#FFF0E8] border border-orange-100 rounded-[32px] p-6 shadow-xl w-full max-w-sm text-center relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FFB98A]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative space-y-4">
            {/* Header */}
            <div className="space-y-1">
              <span className="text-[32px] block">🌱</span>
              <h3 className="font-display font-black text-[#2B1D12] text-[20px] leading-tight">
                Maya
              </h3>
              <p className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
                Your wellness companion
              </p>
            </div>

            {/* Content Message */}
            <p className="text-[13.5px] text-gray-700 font-semibold leading-relaxed px-2">
              "{message}"
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleTalkToMaya}
                type="button"
                className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-3xs"
              >
                Talk to Maya
              </button>
              <button
                onClick={onClose}
                type="button"
                className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export { SupportPopup };
