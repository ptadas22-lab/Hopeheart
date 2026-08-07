import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  onOpenCrisisScreen?: () => void;
  onOpenModerationBlock?: () => void;
}

export default function HopeBuddyChatScreen({
  onBack,
  userName,
  selectedMood,
  onOpenCrisisScreen,
  onOpenModerationBlock,
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

    const lower = text.toLowerCase();

    const highRiskPhrases = ['suicide', 'kill myself', 'harm myself', 'end my life', 'immediate danger'];
    if (highRiskPhrases.some(phrase => lower.includes(phrase))) {
      if (onOpenCrisisScreen) {
        onOpenCrisisScreen();
        return;
      }
    }

    const unsafePhrases = [
      'take this medicine', 'increase dosage', 'stop medication',
      'you are cured', 'you have this diagnosis', 'self-harm encouragement',
      'abuse', 'bullying', 'harassment',
      'prescription', 'dosage', 'prescribe', 'diagnose', 
      'mg', 'milligram', 'treatment', 'medication', 'medicine', 
      'pill', 'xanax', 'paracetamol', 'prozac', 'cure', 'diagnosis'
    ];

    const containsUnsafe = unsafePhrases.some(word => lower.includes(word));

    if (containsUnsafe) {
      if (onOpenModerationBlock) {
        onOpenModerationBlock();
        return;
      }
      alert("⚠️ HopeHeart AI Alert: HopeHeart cannot provide diagnosis, prescriptions, dosage advice, treatment instructions, or cure claims. Please speak with a qualified professional.");
      return;
    }

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

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

  const handleSaveReflection = () => {
    const userTexts = messages
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.text);

    if (userTexts.length === 0) {
      alert("No reflection content to save yet. Write a message to HopeBuddy first.");
      return;
    }

    const compiledReflection = userTexts.join('\n\n');
    const currentRefs = JSON.parse(localStorage.getItem('hopeheart_saved_reflections') || '[]');
    const newRef = {
      id: 'ref-' + Date.now(),
      text: compiledReflection,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('hopeheart_saved_reflections', JSON.stringify([newRef, ...currentRefs]));
    alert("✓ Reflection saved safely in your private local journal!");
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full my-auto">
      <div className="flex items-center justify-between py-4 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={onBack}
          type="button"
          className="px-4 py-2.5 flex items-center gap-1.5 bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] font-display font-black text-[13px] cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[20px] uppercase tracking-tight leading-tight text-center">
          HopeBuddy<br className="sm:hidden" /> Chat
        </span>
        <button
          onClick={handleSaveReflection}
          type="button"
          className="px-4 py-2.5 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-[#FF7527] rounded-full text-[#FF7527] font-display font-black text-[12.5px] cursor-pointer"
        >
          💾 Save Reflection
        </button>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 flex flex-col justify-between space-y-5">
        <div className="flex-1 bg-white border border-[#EDE9DE] rounded-[36px] p-7 md:p-9 shadow-xs flex flex-col justify-between min-h-[460px] md:min-h-[560px] overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-7 pr-1 scrollbar-thin max-h-[420px] md:max-h-[520px]">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isBuddy = msg.sender === 'buddy';
                return (
                  <React.Fragment key={msg.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`flex gap-4 max-w-[88%] ${isBuddy ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}
                    >
                      {isBuddy && (
                        <div className="w-11 h-11 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden self-end">
                          <MascotSitting size={34} />
                        </div>
                      )}
                      <div className="space-y-2">
                        <div
                          className={`px-6 py-5 text-[16px] sm:text-[17px] font-semibold leading-relaxed ${
                            isBuddy 
                              ? 'bg-[#FAF7F0] text-gray-800 rounded-[28px] rounded-bl-xs' 
                              : 'bg-[#FFF2EA] text-gray-850 rounded-[28px] rounded-br-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className={`text-[11px] font-mono text-gray-400 block px-2 ${isBuddy ? 'text-left' : 'text-right'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </motion.div>

                    {index === 0 && (
                      <div className="py-12 flex flex-col items-center justify-center gap-4 text-center text-gray-400">
                        <div className="w-full flex items-center gap-5">
                          <span className="h-px bg-gray-100 flex-1" />
                          <span className="text-[#FF7527] text-[24px]">♡</span>
                          <span className="h-px bg-gray-100 flex-1" />
                        </div>
                        <p className="text-[14px] sm:text-[15px] font-semibold text-gray-400">
                          Take your time. I’m here whenever you’re ready.
                        </p>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 max-w-[88%] self-start"
                >
                  <div className="w-11 h-11 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden self-end">
                    <MascotSitting size={34} />
                  </div>
                  <div className="bg-[#FAF7F0] text-gray-400 px-5 py-3 rounded-[24px] rounded-bl-xs text-[13px] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmitForm} className="flex gap-3 items-center bg-white border border-[#EDE9DE] p-3 rounded-2.5xl shadow-2xs">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to HopeBuddy"
            className="flex-1 bg-[#FCFAF5] border border-[#ECE6D9] rounded-xl px-5 py-4 text-[15px] font-semibold text-gray-700 focus:outline-none focus:border-[#FF7527]/40 placeholder-gray-450"
          />
          <button
            type="submit"
            className="w-14 h-14 rounded-xl bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 shadow-xs"
            title="Send Message"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </button>
        </form>

        <div className="bg-white/80 border border-[#EDE9DE] rounded-[28px] p-5 text-center space-y-3 max-w-2xl mx-auto">
          <p className="text-[12px] text-gray-400 font-semibold leading-relaxed">
            HopeHeart provides emotional support, peer listening, and resources. It does not provide medical diagnosis, prescriptions, therapy, emergency care, or crisis intervention.
          </p>
          <p className="text-[12px] text-[#FF7527] font-bold leading-relaxed italic">
            HopeBuddy can help you reflect and find support options, but it is not a therapist, doctor, or emergency responder.
          </p>
        </div>
      </div>
    </div>
  );
}
