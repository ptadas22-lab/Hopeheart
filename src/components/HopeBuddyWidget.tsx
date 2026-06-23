import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MascotSitting } from './Logo';
import { MoodConfig } from '../types';

interface HopeBuddyWidgetProps {
  selectedMood: MoodConfig;
  moodConfigs: MoodConfig[];
  onMoodSelected: (moodId: string) => void;
  onNavigateTo: (screenId: string) => void;
  onShareCheckIn?: () => void;
}

export default function HopeBuddyWidget({
  selectedMood,
  onNavigateTo,
  onShareCheckIn,
}: HopeBuddyWidgetProps) {
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
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
          if (isMobileInitial && parsed.bottom < 90) {
            parsed.bottom = 90;
          }
          return parsed;
        }
      } catch (e) {}
    }
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
                    width: '300px',
                    zIndex: 50,
                  }
            }
            className="hh-surface p-5 rounded-[28px] flex flex-col gap-4 select-none"
          >
            {/* Options Popup */}
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

              <div className="space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FFFDF9] border border-[#EDE9DE] flex items-center justify-center mx-auto overflow-hidden">
                  <MascotSitting size={34} />
                </div>
                <p className="text-[13px] font-semibold text-gray-750 px-2 leading-relaxed">
                  Want to capture how you’re doing today?
                </p>
                <p className="text-[10px] text-gray-450 font-bold px-2 leading-normal italic">
                  HopeBuddy can help you reflect and find support options, but it is not a therapist, doctor, or emergency responder.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    if (onShareCheckIn) onShareCheckIn();
                    setIsMinimized(true);
                  }}
                  type="button"
                  className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-xs text-center"
                >
                  📸 Create Share Card
                </button>
                <button
                  onClick={() => {
                    onNavigateTo('hopebuddy-chat');
                    setIsMinimized(true);
                  }}
                  type="button"
                  className="w-full py-2.5 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-xs text-center"
                >
                  💬 Talk with HopeBuddy
                </button>
                <button
                  onClick={() => {
                    onNavigateTo('safe-listener');
                    setIsMinimized(true);
                  }}
                  type="button"
                  className="w-full py-2.5 bg-white hover:bg-[#FCFAF5] border border-gray-250 text-gray-755 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
                >
                  🤝 Find Support
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mascot Button Trigger Container */}
      <div
        style={{
          position: 'fixed',
          right: position.right,
          bottom: position.bottom,
          touchAction: 'none',
          zIndex: 40,
        }}
      >
        <motion.button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          initial={{ opacity: 0, scale: 0.5 }}
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
                  scale: { duration: 0.3 }
                }
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing overflow-hidden border border-gray-800 relative"
          title="Interact with HopeBuddy"
        >
          {/* Mascot face inside floating bubble */}
          <Mascot expression={selectedMood.buddyExpression} size={48} className="scale-[1.1] translate-y-1.5 pointer-events-none" />

          {/* Gentle Waving Hand 👋 */}
          <motion.div
            className="absolute bottom-1 right-1 text-[13px] pointer-events-none select-none"
            animate={{ rotate: [0, 15, -10, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            style={{ transformOrigin: 'bottom right' }}
          >
            👋
          </motion.div>
        </motion.button>

        {/* Small Camera Icon Badge 📸 */}
        <motion.div
          animate={isDragging ? {} : { y: [0, -6, 0] }}
          transition={isDragging ? {} : { y: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF7527] border border-white text-white flex items-center justify-center text-[11px] shadow-sm select-none pointer-events-none"
        >
          📸
        </motion.div>
      </div>
    </>
  );
}
