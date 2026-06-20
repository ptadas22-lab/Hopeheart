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
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [step, setStep] = useState<'mood-select' | 'chat'>('mood-select');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMoodSelect = (moodId: string) => {
    onMoodSelected(moodId);
    setStep('chat');
    
    const selectedMoodObj = moodConfigs.find(m => m.id === moodId) || selectedMood;
    
    let introMsg = '';
    switch (moodId) {
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
      case 'hurt':
        introMsg = "I noticed you're feeling hurt today. Your feelings are completely valid. Please take gentle care of yourself. How can I support you?";
        break;
      case 'lonely':
        introMsg = "I noticed you're feeling lonely today. Someone is ready to listen when you're ready to share. I'm right here with you.";
        break;
      default:
        introMsg = `I noticed you're feeling ${selectedMoodObj.label.toLowerCase()} today. I'm here to support you. What's on your mind?`;
    }

    setMessages([
      { sender: 'user', text: `I'm feeling ${selectedMoodObj.label}` },
      { sender: 'buddy', text: introMsg }
    ]);
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
      return "I hear you, and I want to support you. While I can offer companionship, remember that for professional health support, our Care Bridge resources are always ready to assist.";
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

  const onboardingMoods = moodConfigs.filter(m => 
    m.id === 'calm' || m.id === 'sad' || m.id === 'anxious' || m.id === 'tired'
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-[320px] max-w-[calc(100vw-40px)] sm:w-[350px] bg-white border border-[#EDE9DE] rounded-[28px] shadow-[0_12px_32px_rgba(43,29,18,0.12)] p-4 flex flex-col gap-3 relative select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F0]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[13px] font-display font-black text-gray-800">HopeBuddy</span>
              </div>
              <button 
                onClick={() => setIsMinimized(true)}
                className="w-7 h-7 flex items-center justify-center bg-[#FCFAF5] border border-gray-100 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer active:scale-95 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {/* Step 1: Mood Selection */}
            {step === 'mood-select' && (
              <div className="py-2 space-y-4">
                <div className="space-y-1 text-center">
                  <h4 className="font-display font-extrabold text-[#2B1D12] text-[15px]">
                    How are you feeling today?
                  </h4>
                  <p className="text-[11.5px] text-gray-400 font-semibold">
                    Let's check in to begin.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {onboardingMoods.map((mood) => (
                    <motion.button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 bg-[#FCFBF8] border border-gray-100 hover:border-[#FF7527]/30 hover:bg-white rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all min-h-[72px]"
                    >
                      <span className="text-[22px]">{mood.emoji}</span>
                      <span className="text-[12px] font-bold text-gray-700">{mood.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Conversation */}
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
                    onClick={() => handleAction('close')}
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#1E1E1A] hover:bg-black text-white flex items-center justify-center shadow-lg transition-all cursor-pointer overflow-hidden border border-gray-800"
        title="Chat with HopeBuddy"
      >
        <Mascot expression={selectedMood.buddyExpression} size={48} className="scale-[1.1] translate-y-1.5" />
      </motion.button>
    </div>
  );
}
