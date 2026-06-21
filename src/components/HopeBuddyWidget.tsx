import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MascotSitting } from './Logo';
import { MoodConfig } from '../types';

interface HopeBuddyWidgetProps {
  selectedMood: MoodConfig;
  moodConfigs: MoodConfig[];
  onMoodSelected: (moodId: string) => void;
  onNavigateTo: (screenId: string) => void;
}

export default function HopeBuddyWidget({
  selectedMood,
  moodConfigs,
  onMoodSelected,
  onNavigateTo,
}: HopeBuddyWidgetProps) {
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [step, setStep] = useState<'mood-select' | 'support-options'>('mood-select');
  const [tempMoodId, setTempMoodId] = useState<string>(selectedMood.id);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  // Ref for dragging
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posRight: 0, posBottom: 0 });
  const dragDistance = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Position of mascot bubble relative to bottom-right
  const [position, setPosition] = useState(() => {
    const isMobileInitial = window.innerWidth < 640;
    const saved = localStorage.getItem('hopebuddy_bubble_position');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.right === 'number' && typeof parsed.bottom === 'number') {
          // enforce mobile bottom limit
          if (isMobileInitial && parsed.bottom < 90) {
            parsed.bottom = 90;
          }
          return parsed;
        }
      } catch (e) {}
    }
    // Default position (above bottom nav on mobile)
    return { right: 20, bottom: isMobileInitial ? 90 : 20 };
  });

  // Track viewport changes
  useEffect(() => {
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 640;
      setIsMobile(isMobileNow);
      
      const bubbleSize = 56;
      const maxRight = window.innerWidth - bubbleSize - 20;
      const maxBottom = window.innerHeight - bubbleSize - 20;
      const minBottom = isMobileNow ? 90 : 20;

      setPosition(prev => {
        const nextBottom = Math.max(minBottom, Math.min(maxBottom, prev.bottom));
        const nextRight = Math.max(20, Math.min(maxRight, prev.right));
        return { right: nextRight, bottom: nextBottom };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync temp mood when selected mood changes externally
  useEffect(() => {
    setTempMoodId(selectedMood.id);
  }, [selectedMood.id]);

  // Handle pointer drag actions
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragDistance.current = 0;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posRight: position.right,
      posBottom: position.bottom,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;

    dragDistance.current = Math.sqrt(dx * dx + dy * dy);

    const bubbleSize = 56;
    const maxRight = window.innerWidth - bubbleSize - 20;
    const maxBottom = window.innerHeight - bubbleSize - 20;
    const minBottom = isMobile ? 90 : 20;

    const newRight = Math.max(20, Math.min(maxRight, dragStart.current.posRight - dx));
    const newBottom = Math.max(minBottom, Math.min(maxBottom, dragStart.current.posBottom - dy));

    setPosition({ right: newRight, bottom: newBottom });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    localStorage.setItem('hopebuddy_bubble_position', JSON.stringify(position));

    // If drag distance is very small, trigger bubble click toggle
    if (dragDistance.current < 6) {
      setIsMinimized(prev => !prev);
    }
  };

  const handleSaveCheckIn = () => {
    if (!tempMoodId) return;
    onMoodSelected(tempMoodId);
    setStep('support-options');
  };

  return (
    <>
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={
              isMobile
                ? {
                    position: 'fixed',
                    bottom: '86px',
                    left: '5vw',
                    width: '90vw',
                    maxWidth: '90vw',
                    zIndex: 50,
                  }
                : {
                    position: 'fixed',
                    right: `${position.right}px`,
                    bottom: `${position.bottom + 64}px`,
                    width: '320px',
                    zIndex: 50,
                  }
            }
            className="bg-white border border-[#EDE9DE] p-4.5 rounded-[28px] shadow-lg flex flex-col gap-4 select-none z-50"
          >
            {/* Stage 1: Compact Check-In */}
            {step === 'mood-select' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-display font-extrabold text-[14.5px] text-gray-800 flex items-center gap-1.5">
                    <span>🧡</span> HopeBuddy 👋
                  </span>
                  <button
                    onClick={() => setIsMinimized(true)}
                    type="button"
                    className="text-gray-400 hover:text-gray-600 font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-1 text-center">
                  <p className="text-[13px] text-gray-700 font-semibold leading-normal">
                    How are you feeling?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'calm', label: 'Calm', emoji: '😊' },
                    { id: 'sad', label: 'Low', emoji: '😔' },
                    { id: 'anxious', label: 'Anxious', emoji: '😰' },
                    { id: 'tired', label: 'Tired', emoji: '😴' }
                  ].map((mood) => {
                    const isSelected = tempMoodId === mood.id;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setTempMoodId(mood.id)}
                        type="button"
                        className={`p-2.5 border rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#FF7527] bg-[#FFF2EA] text-[#FF7527] font-bold shadow-3xs'
                            : 'bg-[#FCFBF8] border-gray-150 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-[20px]">{mood.emoji}</span>
                        <span className="text-[11px] font-bold">{mood.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setIsMinimized(true)}
                    type="button"
                    className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-550 border border-gray-200 rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95"
                  >
                    Maybe later
                  </button>
                  <button
                    onClick={handleSaveCheckIn}
                    disabled={!tempMoodId}
                    type="button"
                    className={`flex-1 py-2 rounded-xl text-[12.5px] font-black transition-all ${
                      tempMoodId
                        ? 'bg-[#1E1E1A] hover:bg-black text-white cursor-pointer shadow-xs active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Stage 2: Support Options */}
            {step === 'support-options' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                  <span className="font-display font-extrabold text-[14.5px] text-gray-800 flex items-center gap-1.5">
                    <span>🧡</span> HopeBuddy 👋
                  </span>
                  <button
                    onClick={() => setIsMinimized(true)}
                    type="button"
                    className="text-gray-400 hover:text-gray-600 font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1.5 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#EDE9DE] flex items-center justify-center mx-auto overflow-hidden">
                      <MascotSitting size={28} />
                    </div>
                    <p className="text-[12.5px] font-semibold text-gray-700 px-2 leading-relaxed">
                      I’m here with you. What would help?
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        onNavigateTo('hopebuddy-chat');
                        setIsMinimized(true);
                      }}
                      type="button"
                      className="w-full py-2.5 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs text-center"
                    >
                      💬 Talk with HopeBuddy
                    </button>
                    <button
                      onClick={() => {
                        onNavigateTo('safe-listener');
                        setIsMinimized(true);
                      }}
                      type="button"
                      className="w-full py-2.5 bg-white hover:bg-[#FCFAF5] border border-gray-250 text-gray-755 rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 text-center"
                    >
                      🤝 Find Listener
                    </button>
                    <button
                      onClick={() => {
                        onNavigateTo('doctor-suggestions');
                        setIsMinimized(true);
                      }}
                      type="button"
                      className="w-full py-2.5 bg-white hover:bg-[#FCFAF5] border border-gray-250 text-gray-755 rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 text-center"
                    >
                      🌍 Resources
                    </button>
                    
                    <button
                      onClick={() => {
                        setStep('mood-select');
                      }}
                      type="button"
                      className="w-full py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-95 text-center mt-1"
                    >
                      Change Mood Check-In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mascot Button Trigger (Gentle Float Loop) */}
      <motion.button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        initial={{ opacity: 0, y: 80, scale: 0.5 }}
        animate={isDragging ? { opacity: 1, scale: 1.05 } : { opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={
          isDragging 
            ? { duration: 0.1 } 
            : {
                y: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          right: position.right,
          bottom: position.bottom,
          touchAction: 'none',
        }}
        className="w-14 h-14 rounded-full bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing overflow-hidden border border-gray-800 z-40"
        title="Chat with HopeBuddy"
      >
        <Mascot expression={selectedMood.buddyExpression} size={48} className="scale-[1.1] translate-y-1.5 pointer-events-none" />
      </motion.button>
    </>
  );
}
