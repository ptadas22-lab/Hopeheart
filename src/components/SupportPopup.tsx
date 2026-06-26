import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SupportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onNavigateTo: (screenId: string) => void;
}

export default function SupportPopup({
  isOpen,
  onClose,
  activeCategory,
  onNavigateTo,
}: SupportPopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const supportOptions = [
    {
      label: 'PRIVATE FIRST',
      labelClass: 'text-amber-700 bg-amber-50 border-amber-100',
      icon: '🌤️',
      title: 'Talk to HopeBuddy',
      description: 'Take a quiet moment to reflect privately before connecting with anyone.',
      button: 'Start privately',
      screenId: 'hopebuddy-chat',
      buttonClass: 'hover:bg-amber-50/70 hover:border-amber-200 hover:text-amber-800'
    },
    {
      label: 'OPTIONAL SUPPORT',
      labelClass: 'text-[#C75414] bg-[#FFF2EA] border-orange-100',
      icon: '🤝',
      title: 'Request a peer listener',
      description: 'Connect with someone who can listen with kindness. No pressure to share more than you want.',
      button: 'Request listener',
      screenId: 'safe-listener',
      buttonClass: 'hover:bg-[#FFF2EA] hover:border-[#FF7527]/30 hover:text-[#FF7527]'
    },
    {
      label: 'QUIET COMMUNITY',
      labelClass: 'text-indigo-700 bg-indigo-50 border-indigo-100',
      icon: '🌙',
      title: 'Join a support room',
      description: 'Enter a calm space where people share experiences and encouragement.',
      button: 'View rooms',
      screenId: 'support-rooms',
      buttonClass: 'hover:bg-indigo-50/70 hover:border-indigo-200 hover:text-indigo-800'
    },
    {
      label: 'COMFORT RESOURCES',
      labelClass: 'text-teal-700 bg-teal-50 border-teal-100',
      icon: '📚',
      title: 'Read something helpful',
      description: 'Explore gentle resources when you are not ready to talk.',
      button: 'Open resources',
      screenId: 'doctor-suggestions',
      buttonClass: 'hover:bg-teal-50/70 hover:border-teal-200 hover:text-teal-800'
    }
  ];

  const handleDismiss = () => {
    if (dontShowAgain) {
      const todayDateStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('hopeheart_support_popup_dismissed_date', todayDateStr);
    }
    onClose();
  };

  const handleAction = (screenId: string) => {
    if (dontShowAgain) {
      const todayDateStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('hopeheart_support_popup_dismissed_date', todayDateStr);
    }
    onClose();
    onNavigateTo(screenId);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-xs select-none">
      {/* Backdrop click close handler */}
      <div className="absolute inset-0 cursor-default" onClick={handleDismiss} />

      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 120 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full sm:max-w-xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white border border-t-[#EDE9DE] sm:border-[#EDE9DE] rounded-t-[32px] rounded-b-none sm:rounded-[32px] relative z-[9999] text-left flex flex-col shadow-xl select-none scrollbar-none"
      >
        {/* Header section */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-[#FCFAF5] sticky top-0 z-20">
          <div className="space-y-1.5 flex-1 pr-6">
            <h3 className="font-display font-black text-gray-800 text-[18px] tracking-tight leading-tight flex items-center gap-1.5">
              <span>💛</span> What kind of support feels right?
            </h3>
            <p className="text-[12.5px] text-gray-500 font-semibold leading-normal pr-2">
              Choose one gentle option. You are always in control.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full border border-gray-150 hover:bg-gray-50 text-gray-400 hover:text-gray-700 font-bold text-[16px] flex items-center justify-center cursor-pointer transition-colors shrink-0"
            title="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {supportOptions.map((option) => (
              <div key={option.title} className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-3xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${option.labelClass}`}>
                      {option.label}
                    </span>
                    <span className="text-[20px] leading-none" aria-hidden="true">{option.icon}</span>
                  </div>
                  <h5 className="font-display font-black text-gray-800 text-[14px] leading-tight">
                    {option.title}
                  </h5>
                  <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                    {option.description}
                  </p>
                </div>
                <button
                  onClick={() => handleAction(option.screenId)}
                  className={`w-full py-2.5 bg-white border border-[#EDE9DE] text-gray-700 transition-all font-display font-extrabold text-[11.5px] rounded-xl cursor-pointer text-center ${option.buttonClass}`}
                >
                  {option.button}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Disclaimer and Suppression Checkbox Footer bar */}
        <div className="bg-[#FEFBF7] border border-amber-100 rounded-2xl p-4 space-y-3 mt-1 mx-5 mb-5">
          <p className="text-[11px] text-[#A16207] font-semibold leading-relaxed">
            HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.
          </p>
          {activeCategory && (
            <p className="text-[10.5px] text-gray-400 font-semibold leading-relaxed">
              You can close this and choose another path anytime.
            </p>
          )}
          <div className="border-t border-amber-100/50 pt-2.5 flex items-center justify-between gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-[11.5px] text-gray-500 font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-[#FF7527] focus:ring-[#FF7527] cursor-pointer"
              />
              Don’t show again today
            </label>

            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-[11.5px] font-display font-black transition-all cursor-pointer shadow-3xs"
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
