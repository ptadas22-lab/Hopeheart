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

interface Message {
  sender: 'buddy' | 'user';
  text: string;
}

export default function HopeBuddyWidget({
  selectedMood,
  moodConfigs,
  onMoodSelected,
  onNavigateTo,
}: HopeBuddyWidgetProps) {
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [step, setStep] = useState<'mood-select' | 'support-options' | 'chat'>('mood-select');
  const [tempMoodId, setTempMoodId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Position offsets relative to bottom-right
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('hopebuddy_position_offset');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.right === 'number' && typeof parsed.bottom === 'number') {
          return parsed;
        }
      } catch (e) {}
    }
    return { right: 20, bottom: 20 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posRight: 0, posBottom: 0 });

  // Sync scroll to bottom in chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // On mount, auto-open the popup after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimized(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle pointer down for drag start (works for both mouse and touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posRight: position.right,
      posBottom: position.bottom,
    };
    
    target.setPointerCapture(e.pointerId);
  };

  // Handle pointer move for drag tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;

    const popupWidth = popupRef.current?.offsetWidth || 350;
    const popupHeight = popupRef.current?.offsetHeight || 400;

    const maxRight = window.innerWidth - popupWidth - 20;
    const maxBottom = window.innerHeight - popupHeight - 20;

    const newRight = Math.max(20, Math.min(maxRight, dragStart.current.posRight - dx));
    const newBottom = Math.max(20, Math.min(maxBottom, dragStart.current.posBottom - dy));

    setPosition({ right: newRight, bottom: newBottom });
  };

  // Handle pointer up for drag end
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const target = e.target as HTMLElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch (err) {}

    localStorage.setItem('hopebuddy_position_offset', JSON.stringify(position));
  };

  // Handle window resizing to keep the popup within viewport bounds
  useEffect(() => {
    const handleResize = () => {
      const popupWidth = popupRef.current?.offsetWidth || 350;
      const popupHeight = popupRef.current?.offsetHeight || 400;

      const maxRight = window.innerWidth - popupWidth - 20;
      const maxBottom = window.innerHeight - popupHeight - 20;

      setPosition(prev => ({
        right: Math.max(20, Math.min(maxRight, prev.right)),
        bottom: Math.max(20, Math.min(maxBottom, prev.bottom)),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMoodSelect = (moodId: string) => {
    setTempMoodId(moodId);
  };

  const handleContinue = () => {
    if (!tempMoodId) return;
    
    // Save selection globally and in localStorage
    onMoodSelected(tempMoodId);
    
    // Move to next step (support options)
    setStep('support-options');
  };

  const handleSkip = () => {
    setIsMinimized(true);
  };

  const generateResponse = (userText: string, moodId: string): string => {
    const text = userText.toLowerCase();
    
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return "Hello! I'm always glad to chat with you. How can I help support you today?";
    }
    if (text.includes('exam') || text.includes('test') || text.includes('study') || text.includes('school') || text.includes('work') || text.includes('job')) {
      if (moodId === 'anxious') {
        return "Deep breaths. Focus on one small task at a time. You don't have to finish everything right this second. I'm right here beside you.";
      }
      if (moodId === 'tired') {
        return "I know there is a lot to do, but please listen to your body and take breaks. Let's recharge when you need to.";
      }
      return "You're working hard. Take a moment to stretch and drink some water. I believe in you!";
    }
    if (text.includes('sad') || text.includes('lonely') || text.includes('cry') || text.includes('depress') || text.includes('grief')) {
      return "It's completely okay to feel this way. I'm right here, holding a warm space for you. You don't have to go through it alone.";
    }
    if (text.includes('anxious') || text.includes('panic') || text.includes('worry') || text.includes('scared') || text.includes('fear')) {
      return "Let's take a slow breath together: Inhale for four seconds... hold... exhale... You are safe, and this feeling will pass.";
    }
    if (text.includes('thank') || text.includes('thanks') || text.includes('good') || text.includes('great')) {
      return "You're so welcome! Knowing I can bring even a tiny bit of warmth to your day makes me very happy.";
    }
    if (text.includes('help') || text.includes('hurt') || text.includes('pain') || text.includes('sick')) {
      return "I hear you, and I want to support you. While I can offer companionship, remember that for professional resources, our Care Bridge section is always ready to assist.";
    }

    switch (moodId) {
      case 'anxious':
        return "I understand. Sometimes things pile up and feel overwhelming. Just focus on your breathing right now, and take a slow pause.";
      case 'tired':
        return "It sounds like you've been carrying a lot. Remember that resting and doing nothing is a form of healing too.";
      case 'sad':
        return "I'm listening. Thank you for sharing that with me. It takes courage to put feelings into words.";
      default:
        return "Thank you for sharing that with me. I'm here to listen, stand beside you, and help you find support paths whenever you're ready.";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');
    
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      const reply = generateResponse(userMsg, selectedMood.id);
      setMessages(prev => [...prev, { sender: 'buddy', text: reply }]);
    }, 600);
  };

  const handleAction = (path: string) => {
    if (path === 'close') {
      setIsMinimized(true);
    } else {
      onNavigateTo(path);
      setIsMinimized(true);
    }
  };

  const startHopeBuddyConversation = () => {
    const selectedMoodObj = moodConfigs.find(m => m.id === selectedMood.id) || selectedMood;
    
    let introMsg = '';
    switch (selectedMood.id) {
      case 'calm':
        introMsg = "I'm glad today feels peaceful. I'm right here if you want to reflect or share anything on your mind.";
        break;
      case 'anxious':
        introMsg = "I noticed you're feeling anxious today. It's okay to slow down. You don't have to carry everything alone. Let's take a deep breath together.";
        break;
      case 'sad':
        introMsg = "I noticed you're feeling sad today. It's completely okay to feel down; healing takes its own time. What's on your mind?";
        break;
      case 'tired':
        introMsg = "I noticed you're feeling tired today. Rest is productive too. Take all the time you need, I'm right here beside you.";
        break;
      default:
        introMsg = `I noticed you're feeling ${selectedMoodObj.label.toLowerCase()} today. I'm here to support you. What's on your mind?`;
    }

    setMessages([
      { sender: 'user', text: `I'm feeling ${selectedMoodObj.label}` },
      { sender: 'buddy', text: introMsg }
    ]);
    setStep('chat');
  };

  const onboardingMoods = moodConfigs.filter(m => 
    m.id === 'calm' || m.id === 'sad' || m.id === 'anxious' || m.id === 'tired'
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            ref={popupRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            style={{
              position: 'fixed',
              right: position.right,
              bottom: position.bottom,
              touchAction: 'none', // Prevents body scrolling while touch-dragging
            }}
            className="w-[320px] max-w-[calc(100vw-40px)] sm:w-[350px] bg-white border border-[#EDE9DE] rounded-[28px] shadow-[0_12px_32px_rgba(43,29,18,0.12)] p-4 flex flex-col gap-3 select-none z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F0]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[13px] font-display font-black text-gray-800">HopeBuddy 👋</span>
              </div>

              {/* Drag Handle */}
              <div className="drag-handle flex items-center gap-1 px-2.5 py-1 bg-[#FCFAF5] border border-[#ECE6D9]/70 rounded-full text-[10.5px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-all select-none">
                <span className="text-gray-300 font-extrabold">⋮⋮</span> Drag me
              </div>

              <button 
                onClick={() => setIsMinimized(true)}
                className="w-7 h-7 flex items-center justify-center bg-[#FCFAF5] border border-gray-100 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer active:scale-95 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step 1: Mood Selection */}
            {step === 'mood-select' && (
              <div className="py-2 space-y-4">
                <div className="space-y-1 text-center">
                  <p className="text-[13.5px] text-gray-700 font-semibold leading-relaxed">
                    "Welcome back. How are you feeling today?"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {onboardingMoods.map((mood) => {
                    const isSelected = tempMoodId === mood.id;
                    return (
                      <motion.button
                        key={mood.id}
                        onClick={() => handleMoodSelect(mood.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 border rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all min-h-[72px] ${
                          isSelected 
                            ? 'border-[#FF7527] bg-[#FFF2EA] text-gray-800 shadow-2xs' 
                            : 'bg-[#FCFBF8] border-gray-100 hover:border-[#FF7527]/30 hover:bg-white text-gray-600'
                        }`}
                      >
                        <span className="text-[22px]">{mood.emoji}</span>
                        <span className="text-[12px] font-bold">{mood.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Skip and Continue Actions */}
                <div className="flex gap-2 pt-2 border-t border-[#FAF7F0]">
                  <button
                    onClick={handleSkip}
                    className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[12px] font-semibold cursor-pointer transition-all active:scale-95"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!tempMoodId}
                    className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${
                      tempMoodId 
                        ? 'bg-[#1E1E1A] hover:bg-black text-white cursor-pointer shadow-xs active:scale-95' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Support Options */}
            {step === 'support-options' && (
              <div className="py-2 space-y-4">
                <div className="space-y-2 text-center">
                  <div className="w-11 h-11 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center mx-auto mb-1 overflow-hidden">
                    <MascotSitting size={34} />
                  </div>
                  <p className="text-[13px] font-semibold text-gray-700 leading-relaxed px-2">
                    "Thanks for sharing. I’m here with you. Would you like to talk or find support?"
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={startHopeBuddyConversation}
                    className="w-full py-2.5 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
                  >
                    💬 Talk with HopeBuddy
                  </button>
                  <button
                    onClick={() => handleAction('safe-listener')}
                    className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95"
                  >
                    👂 Find a Listener
                  </button>
                  <button
                    onClick={() => handleAction('support-rooms')}
                    className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95"
                  >
                    🧡 Join Community
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[12px] font-semibold cursor-pointer transition-all active:scale-95"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Chat */}
            {step === 'chat' && (
              <div className="flex flex-col gap-3">
                {/* Scrollable message history */}
                <div className="h-[180px] md:h-[210px] overflow-y-auto pr-1 flex flex-col gap-2.5 scrollbar-thin">
                  {messages.map((msg, id) => {
                    const isBuddy = msg.sender === 'buddy';
                    return (
                      <div
                        key={id}
                        className={`flex gap-2 max-w-[85%] ${
                          isBuddy ? 'self-start' : 'self-end flex-row-reverse'
                        }`}
                      >
                        {isBuddy && (
                          <div className="w-7 h-7 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center p-0.5 shrink-0 overflow-hidden self-end">
                            <MascotSitting size={24} />
                          </div>
                        )}
                        <div
                          className={`px-3.5 py-2 text-[12.5px] font-semibold leading-relaxed ${
                            isBuddy 
                              ? 'bg-[#FAF7F0] text-gray-800 rounded-[18px] rounded-bl-xs' 
                              : 'bg-[#FFF2EA] text-gray-850 rounded-[18px] rounded-br-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Actions Shortcut chips */}
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-[#FAF7F0]">
                  <button
                    onClick={() => handleAction('safe-listener')}
                    className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#FFF2EA] hover:text-[#FF7527] border border-[#ECE6D9] rounded-full text-[11px] font-extrabold text-gray-600 cursor-pointer transition-all flex items-center gap-1"
                  >
                    👂 Someone to listen
                  </button>
                  <button
                    onClick={() => handleAction('support-rooms')}
                    className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#FFF2EA] hover:text-[#FF7527] border border-[#ECE6D9] rounded-full text-[11px] font-extrabold text-gray-600 cursor-pointer transition-all flex items-center gap-1"
                  >
                    🧡 Join a community
                  </button>
                  <button
                    onClick={() => handleAction('share-safely')}
                    className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#FFF2EA] hover:text-[#FF7527] border border-[#ECE6D9] rounded-full text-[11px] font-extrabold text-gray-600 cursor-pointer transition-all flex items-center gap-1"
                  >
                    ✍️ Share your thoughts
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-gray-100 border border-[#ECE6D9] rounded-full text-[11px] font-extrabold text-gray-500 cursor-pointer transition-all flex items-center gap-1"
                  >
                    🤝 Talk later
                  </button>
                </div>

                {/* Small Chat Box Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center mt-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-[#FCFAF5] border border-[#ECE6D9] rounded-xl px-3.5 py-2 text-[12.5px] font-semibold text-gray-700 focus:outline-none focus:border-[#FF7527]/40 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-xl bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger circular button */}
      <motion.button
        onClick={() => setIsMinimized(!isMinimized)}
        initial={{ opacity: 0, y: 80, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 150, 
          damping: 12, 
          mass: 1.1,
          delay: 0.2 
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center shadow-lg cursor-pointer overflow-hidden border border-gray-800"
        title="Chat with HopeBuddy"
      >
        <Mascot expression={selectedMood.buddyExpression} size={48} className="scale-[1.1] translate-y-1.5" />
      </motion.button>
    </div>
  );
}
