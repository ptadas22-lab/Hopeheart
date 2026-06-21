import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MascotSitting } from './Logo';
import { MoodConfig } from '../types';

interface Message {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  timestamp: string;
}

interface HopeBuddyChatScreenProps {
  onBack: () => void;
  userName: string;
  selectedMood: MoodConfig;
  onNavigateTo: (screenId: string) => void;
}

export default function HopeBuddyChatScreen({
  onBack,
  userName,
  selectedMood,
  onNavigateTo,
}: HopeBuddyChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'buddy',
      text: `Hi ${userName}, I’m here with you. You can share what feels safe to share.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickActionChips = [
    "I feel anxious",
    "I feel lonely",
    "I need someone to listen",
    "Help me slow down"
  ];

  const generateBuddyResponse = (userText: string, moodId: string): string => {
    const text = userText.toLowerCase();
    
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return `Hello, ${userName}! I'm so glad we can chat today. I'm right here beside you. How are you holding up?`;
    }
    if (text.includes('exam') || text.includes('test') || text.includes('study') || text.includes('school') || text.includes('work') || text.includes('job') || text.includes('stress')) {
      return "That sounds like a lot to carry. Remember, you're allowed to take a step back and breathe. Your worth isn't defined by how much you produce. Let's take a slow pause together.";
    }
    if (text.includes('sad') || text.includes('lonely') || text.includes('cry') || text.includes('depress') || text.includes('alone')) {
      return "I hear you, and it's completely okay to feel sad or lonely. I'm sitting right here with you. Even if we're just resting in silence, you don't have to carry this alone.";
    }
    if (text.includes('anxious') || text.includes('panic') || text.includes('worry') || text.includes('scared') || text.includes('breath') || text.includes('slow down')) {
      return "Let's take a slow, deep breath together. Inhale gently for four seconds... hold it... and exhale slowly. You are in a safe space, and we can take this one minute at a time.";
    }
    if (text.includes('thank') || text.includes('thanks') || text.includes('good') || text.includes('great') || text.includes('happy')) {
      return "I'm so glad to hear that! Knowing we can share this warm connection makes my day. I'm always here when you need a quiet companion.";
    }
    if (text.includes('help') || text.includes('hurt') || text.includes('pain') || text.includes('suicide') || text.includes('kill') || text.includes('emergency')) {
      return "I care about your safety deeply. While I'm here to offer emotional companionship, if you need urgent care, please check our Safety section or contact your local emergency support immediately.";
    }

    // Default responses based on checked-in mood
    switch (moodId) {
      case 'anxious':
        return "I hear the worry in your words. It is okay if things feel scattered right now. Focus on the ground beneath you, and let's go slowly.";
      case 'tired':
        return "You've been holding on so strongly. Please let yourself rest now. I'm happy to keep you company while you recharge.";
      case 'sad':
        return "Thank you for sharing your heart with me. I'm listening, and I'm here to support you without any judgment.";
      default:
        return "Thank you for sharing that with me. I'm here to listen, support, and walk beside you. What's on your mind next?";
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate buddy response with a slight delay
    setTimeout(() => {
      const buddyReply = generateBuddyResponse(text, selectedMood.id);
      const buddyMsg: Message = {
        id: 'buddy-' + Date.now(),
        sender: 'buddy',
        text: buddyReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, buddyMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none w-full my-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={onBack}
          type="button"
          className="px-3.5 py-2 flex items-center gap-1 bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] font-display font-black text-[12.5px] cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          HopeBuddy Chat
        </span>
        <div className="w-8 h-8 rounded-full bg-[#FFEFE5] border border-[#FF7527] flex items-center justify-center overflow-hidden">
          <MascotSitting size={26} />
        </div>
      </div>

      {/* Main chat viewport */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 flex flex-col justify-between space-y-4">
        
        {/* Messages List Area */}
        <div className="flex-1 bg-white border border-[#EDE9DE] rounded-[32px] p-4.5 md:p-6 shadow-xs flex flex-col justify-between min-h-[350px] md:min-h-[420px] overflow-hidden">
          
          {/* Scrollable box */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin max-h-[320px] md:max-h-[380px]">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isBuddy = msg.sender === 'buddy';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={`flex gap-3 max-w-[85%] ${isBuddy ? 'self-start' : 'self-end flex-row-reverse'}`}
                  >
                    {isBuddy && (
                      <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center p-0.5 shrink-0 overflow-hidden self-end">
                        <MascotSitting size={26} />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div
                        className={`px-4 py-3 text-[13px] sm:text-[13.5px] font-semibold leading-relaxed ${
                          isBuddy 
                            ? 'bg-[#FAF7F0] text-gray-800 rounded-[20px] rounded-bl-xs' 
                            : 'bg-[#FFF2EA] text-gray-850 rounded-[20px] rounded-br-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className={`text-[9.5px] font-mono text-gray-400 block px-1.5 ${isBuddy ? 'text-left' : 'text-right'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 max-w-[85%] self-start"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center p-0.5 shrink-0 overflow-hidden self-end">
                    <MascotSitting size={26} />
                  </div>
                  <div className="bg-[#FAF7F0] text-gray-400 px-4 py-2.5 rounded-[20px] rounded-bl-xs text-[13px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick action chips selection */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Quick expressions
            </span>
            <div className="flex flex-wrap gap-2">
              {quickActionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  type="button"
                  className="px-3 py-1.5 bg-[#FCFAF5] hover:bg-[#FFF2EA] hover:text-[#FF7527] border border-[#ECE6D9] hover:border-[#FF7527]/30 rounded-full text-[11.5px] font-extrabold text-gray-650 cursor-pointer transition-all active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input box Form */}
        <form onSubmit={handleSubmitForm} className="flex gap-2.5 items-center bg-white border border-[#EDE9DE] p-2.5 rounded-2.5xl shadow-2xs">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to HopeBuddy..."
            className="flex-1 bg-[#FCFAF5] border border-[#ECE6D9] rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-700 focus:outline-none focus:border-[#FF7527]/40 placeholder-gray-450"
          />
          <button
            type="submit"
            className="w-11 h-11 rounded-xl bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
            title="Send Message"
          >
            <svg className="w-4.5 h-4.5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </button>
        </form>

        {/* Bottom Safety Disclaimer */}
        <div className="text-center pt-1.5">
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed max-w-md mx-auto">
            HopeBuddy provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.
          </p>
        </div>

      </div>
    </div>
  );
}
