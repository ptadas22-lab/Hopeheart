import React, { useState, useEffect, useRef } from 'react';
import Mascot from './Mascot';
import { MascotSitting } from './Logo';
import { MoodConfig } from '../types';

interface HopeBuddyWidgetProps {
  selectedMood: MoodConfig;
  moodConfigs: MoodConfig[];
  onMoodSelected: (moodId: string) => void;
  onNavigateTo: (screenId: string) => void;
  onShareCheckIn?: () => void;
  currentScreen?: string;
}

const SUPPORTIVE_SENTENCES = [
  "You've already taken the hardest step.",
  "I'm glad you're here.",
  "Take one breath.",
  "You don't have to rush.",
  "Thank you for checking in."
];

const getScreenMessage = (screenId: string): string => {
  const cleanId = screenId.toLowerCase();
  if (cleanId === 'home') return "How are you feeling today?";
  if (cleanId === 'my-space') return "Your progress matters.";
  if (cleanId === 'feel-good') return "Write whatever feels right.";
  if (cleanId === 'doctor-suggestions' || cleanId === 'resources') return "Take your time.";
  if (cleanId === 'community' || cleanId === 'support-rooms') return "You're among kind people.";
  if (cleanId === 'privacy-settings' || cleanId === 'profile') return "You're in control.";
  return "How are you feeling today?";
};

export default function HopeBuddyWidget({
  selectedMood,
  onNavigateTo,
  onShareCheckIn,
  currentScreen = 'home',
}: HopeBuddyWidgetProps) {
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  // Drag state
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posRight: 0, posBottom: 0 });
  const dragDistance = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic status triggers
  const [isScrolling, setIsScrolling] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  // Speech bubble state
  const [speechText, setSpeechText] = useState("");
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [isTappedMsg, setIsTappedMsg] = useState(false);
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tappedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Position of mascot bubble relative to bottom-right (24px margin default)
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
    return { right: 24, bottom: isMobileInitial ? 90 : 24 };
  });

  // Track viewport changes
  useEffect(() => {
    const handleResize = () => {
      const isMobileNow = window.innerWidth < 640;
      setIsMobile(isMobileNow);
      
      const bubbleSize = 56;
      const maxRight = window.innerWidth - bubbleSize - 24;
      const maxBottom = window.innerHeight - bubbleSize - 24;
      const minBottom = isMobileNow ? 90 : 24;

      setPosition(prev => {
        const nextBottom = Math.max(minBottom, Math.min(maxBottom, prev.bottom));
        const nextRight = Math.max(24, Math.min(maxRight, prev.right));
        return { right: nextRight, bottom: nextBottom };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Keyboard open detection
  useEffect(() => {
    const handleFocus = () => {
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        setIsKeyboardOpen(true);
      }
    };
    const handleBlur = () => {
      setIsKeyboardOpen(false);
    };
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  // Quick scroll hide trigger
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Emotional response trigger when selectedMood changes
  useEffect(() => {
    if (selectedMood?.id) {
      setReaction(selectedMood.id);
      if (reactionTimerRef.current) {
        clearTimeout(reactionTimerRef.current);
      }
      reactionTimerRef.current = setTimeout(() => {
        setReaction(null);
      }, 5000);
    }
  }, [selectedMood]);

  // Context message synchronization
  useEffect(() => {
    if (!isTappedMsg) {
      setSpeechText(getScreenMessage(currentScreen));
      setShowSpeechBubble(true);
    }
  }, [currentScreen, isTappedMsg]);

  // Mascot tap handler
  const handleMascotTap = () => {
    const randMsg = SUPPORTIVE_SENTENCES[Math.floor(Math.random() * SUPPORTIVE_SENTENCES.length)];
    setSpeechText(randMsg);
    setIsTappedMsg(true);
    setShowSpeechBubble(true);

    if (tappedTimerRef.current) {
      clearTimeout(tappedTimerRef.current);
    }
    tappedTimerRef.current = setTimeout(() => {
      setIsTappedMsg(false);
    }, 3000);
  };

  // Drag Pointer Handlers
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

    // Bounds check relative to window viewport (since it is fixed positioning)
    const bubbleSize = 56;
    const maxRight = window.innerWidth - bubbleSize - 24;
    const maxBottom = window.innerHeight - bubbleSize - 24;
    const minBottom = isMobile ? 90 : 24;

    const newRight = Math.max(24, Math.min(maxRight, dragStart.current.posRight - dx));
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

    // Tap detected
    if (dragDistance.current < 6) {
      handleMascotTap();
    }
  };

  // Map mood selection to companion expression
  const getBuddyExpression = (): 'calm' | 'anxious' | 'hurt' | 'numb' | 'lonely' | 'need-support' => {
    const activeMood = reaction || selectedMood?.id || 'calm';
    const lower = activeMood.toLowerCase();
    
    if (lower === 'hopeful') return 'need-support';
    if (lower === 'calm' || lower === 'peaceful' || lower === 'okay') return 'calm';
    if (lower === 'anxious') return 'anxious';
    if (lower === 'low' || lower === 'numb') return 'numb';
    if (lower === 'sad' || lower === 'frustrated') return 'hurt';
    if (lower === 'overwhelmed') return 'anxious';
    
    return 'calm';
  };

  const buddyExpression = getBuddyExpression();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .buddy-floating-btn {
          transition: transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 150ms ease;
        }
        .buddy-floating-btn:hover {
          transform: scale(1.05);
        }
        .buddy-floating-btn:active {
          transform: scale(0.94);
        }
        .speech-bubble-animate {
          animation: bubbleFadeIn 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-hand-wave-indicator {
          animation: hand-wave-indicator 2.2s ease-in-out infinite;
          transform-origin: bottom right;
        }
        @keyframes bubbleFadeIn {
          from { opacity: 0; transform: scale(0.9) translateX(5px); }
          to { opacity: 1; transform: scale(1) translateX(0); }
        }
        @keyframes hand-wave-indicator {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .buddy-floating-btn, .speech-bubble-animate, .anim-hand-wave-indicator {
            animation: none !important;
            transform: none !important;
            transition: none !important;
          }
        }
      ` }} />

      {/* Expanded Menu Sheet - position: fixed relative to viewport */}
      {!isMinimized && (
        <div
          style={
            isMobile
              ? {
                  position: 'fixed',
                  bottom: '86px',
                  left: '5vw',
                  width: '90vw',
                  maxWidth: '90vw',
                  zIndex: 50,
                  transition: 'opacity 200ms ease, transform 200ms ease'
                }
              : {
                  position: 'fixed',
                  right: `${position.right}px`,
                  bottom: `${position.bottom + 64}px`,
                  width: '300px',
                  zIndex: 50,
                  transition: 'opacity 200ms ease, transform 200ms ease'
                }
          }
          className="hh-surface p-5 rounded-[28px] flex flex-col gap-4 select-none border border-[#F4E7D8]/80 shadow-md bg-white/95 backdrop-blur-xs"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-150 pb-2">
              <span className="font-display font-black text-[14.5px] text-[#2B1D12] flex items-center gap-1.5">
                <span>🧡</span> HopeBuddy 👋
              </span>
              <button
                onClick={() => setIsMinimized(true)}
                type="button"
                className="text-gray-400 hover:text-gray-600 font-black text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7527]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FFFDF9] border border-[#F1E7D8] flex items-center justify-center mx-auto overflow-hidden shadow-3xs">
                <MascotSitting size={34} />
              </div>
              <p className="text-[13px] font-black text-[#2B1D12] px-2 leading-relaxed">
                Want to capture how you’re doing today?
              </p>
              <p className="text-[10px] text-gray-400 font-bold px-2 leading-normal italic">
                HopeBuddy can help you reflect privately. It is not a therapist, doctor, or emergency responder.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  if (onShareCheckIn) onShareCheckIn();
                  setIsMinimized(true);
                }}
                type="button"
                className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7527]"
              >
                📸 Create Share Card
              </button>
              <button
                onClick={() => {
                  onNavigateTo('hopebuddy-chat');
                  setIsMinimized(true);
                }}
                type="button"
                className="w-full py-2.5 bg-[#2B1D12] hover:bg-black text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-xs text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF7527]"
              >
                💬 Chat with HopeBuddy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mascot Bubble - position: fixed relative to viewport */}
      <div
        className={`fixed z-40 flex items-center pointer-events-none transition-all duration-300 ${
          isScrolling || isKeyboardOpen ? 'opacity-0 scale-90 translate-y-3' : 'opacity-1 scale-100'
        }`}
        style={{
          right: `${position.right}px`,
          bottom: `${position.bottom}px`,
          width: '56px',
          height: '56px',
        }}
      >
        {/* Speech Bubble Context helper */}
        {showSpeechBubble && isMinimized && (
          <div 
            className="absolute right-16 bottom-2 bg-[#FFFDF9] border border-[#F1E7D8] text-[#2B1D12] px-3 py-2 rounded-2xl shadow-sm text-[12px] font-bold whitespace-nowrap select-none pointer-events-auto speech-bubble-animate flex items-center gap-2"
            style={{ transformOrigin: 'right center' }}
          >
            <span>{speechText}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              type="button"
              className="text-[10px] bg-orange-100 hover:bg-orange-200 text-[#FF7527] px-1.5 py-0.5 rounded-md font-black cursor-pointer transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7527]"
            >
              Menu
            </button>
            <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#FFFDF9] border-r border-b border-[#F1E7D8] rotate-[-45deg]" />
          </div>
        )}

        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          type="button"
          className="w-14 h-14 rounded-full bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center shadow-lg border border-gray-800 relative pointer-events-auto cursor-grab active:cursor-grabbing overflow-hidden buddy-floating-btn"
          title="Interact with HopeBuddy"
        >
          {/* Mascot face */}
          <Mascot 
            expression={buddyExpression} 
            size={48} 
            className={`scale-[1.1] translate-y-1.5 pointer-events-none ${
              reaction === 'Hopeful' ? 'anim-bounce-once' : ''
            }`} 
          />

          {/* Gentle Waving Hand 👋 */}
          <div className="absolute bottom-1 right-1 text-[13px] pointer-events-none select-none anim-hand-wave-indicator">
            👋
          </div>
        </button>

        {/* Camera Icon Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF7527] border border-white text-white flex items-center justify-center text-[11px] shadow-sm select-none pointer-events-none">
          📸
        </div>
      </div>
    </>
  );
}
