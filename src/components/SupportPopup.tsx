import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../types';
import { sendMessageToMaya, StoredMessage } from '../services/maya/mayaService';

interface SupportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string; // The mood ID, e.g. anxious, sad, calm, etc.
  onNavigateTo: (screenId: string) => void;
}

interface Message {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  timestamp: string;
}

export default function SupportPopup({ isOpen, onClose, activeCategory, onNavigateTo }: SupportPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversations on open
  useEffect(() => {
    if (!isOpen || !activeCategory) return;

    const mood = activeCategory.toLowerCase();
    let welcomeText = "I'm glad you checked in today. Want to take a small moment for your well-being?";

    if (mood === 'anxious' || mood === 'overwhelmed') {
      welcomeText = "I see you're feeling anxious today. You don't have to handle everything at once. Would you like to take a small moment together?";
    } else if (mood === 'sad' || mood === 'hurt' || mood === 'lonely' || mood === 'need-support') {
      welcomeText = "I'm glad you checked in with me. You don't have to carry everything alone. Would you like to talk?";
    } else if (mood === 'hopeful' || mood === 'calm' || mood === 'happy') {
      welcomeText = "I'm glad you're feeling good today! 🌱 Want to do something small to keep that feeling going?";
    } else if (mood === 'tired' || mood === 'low') {
      welcomeText = "Sounds like you might need a little gentleness today. Want to take one small moment for yourself?";
    }

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'buddy',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [isOpen, activeCategory]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  // Return null ONLY after all hooks are evaluated to comply with Rules of Hooks
  if (!isOpen) return null;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const history: StoredMessage[] = nextMessages.map(m => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }));

      const response = await sendMessageToMaya(text, activeCategory, history);

      const buddyMsg: Message = {
        id: 'buddy-' + Date.now(),
        sender: 'buddy',
        text: response.responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, buddyMsg]);
    } catch (e) {
      console.error('[Maya Popup] Error in conversation:', e);
      const errorMsg: Message = {
        id: 'buddy-error-' + Date.now(),
        sender: 'buddy',
        text: "I'm having a quiet moment right now. Let's try talking again in a second.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
      {/* Modal Card container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF8F2] to-[#FFF0E8] border border-orange-100 rounded-[32px] p-5 shadow-2xl w-full max-w-md text-left relative overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FFB98A]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-orange-100/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[24px]">🌱</span>
            <div>
              <h3 className="font-display font-black text-[#2B1D12] text-[17px] leading-tight">
                Maya
              </h3>
              <p className="text-[10px] text-gray-500 font-semibold leading-none">
                Your wellness companion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center border border-orange-100/60 text-gray-400 hover:text-gray-600 transition-all cursor-pointer font-bold text-[14px]"
            title="Continue to Dashboard"
          >
            ✕
          </button>
        </div>

        {/* Conversation Message Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin max-h-[380px] min-h-[220px]">
          {messages.map((msg) => {
            const isBuddy = msg.sender === 'buddy';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-2.5 max-w-[85%] ${isBuddy ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}
              >
                <div className="space-y-0.5">
                  <div
                    className={`px-4 py-2.5 text-[13.5px] font-semibold leading-relaxed ${
                      isBuddy
                        ? 'bg-[#FAF7F0] text-gray-800 rounded-[20px] rounded-bl-xs border border-orange-50/50'
                        : 'bg-[#FFF2EA] text-gray-850 rounded-[20px] rounded-br-xs border border-orange-100/30'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[9px] font-mono text-gray-400 block px-1.5 ${isBuddy ? 'text-left' : 'text-right'}`}>
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
              className="flex gap-2.5 max-w-[85%] self-start"
            >
              <div className="bg-[#FAF7F0] border border-orange-50/50 text-gray-400 px-4 py-2.5 rounded-[20px] rounded-bl-xs text-[12px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Actions */}
        <div className="pt-3 border-t border-orange-100/50 shrink-0">
          <form onSubmit={handleSubmitForm} className="flex items-center gap-2">
            {/* Microphone placeholder button */}
            <button
              type="button"
              disabled
              className="w-10 h-10 rounded-xl bg-orange-50/50 border border-orange-100/40 flex items-center justify-center text-[18px] opacity-60 cursor-not-allowed"
              title="Voice input placeholder (disabled)"
            >
              🎙️
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share how you are holding up..."
              className="flex-1 min-w-0 px-4 h-10 bg-white border border-gray-200 rounded-xl text-[13px] font-semibold focus:outline-none focus:border-[#FF7527]"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !inputText.trim()}
              className="h-10 px-4 bg-[#FF7527] hover:bg-[#E96630] disabled:bg-gray-200 text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-3xs"
            >
              Send
            </button>
          </form>

          {/* Close/Continue Option */}
          <div className="mt-3 flex justify-center">
            <button
              onClick={onClose}
              type="button"
              className="w-full py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-[11px] font-display font-black cursor-pointer transition-all text-center"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export { SupportPopup };
