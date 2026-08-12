import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotSitting } from './Logo';
import { MoodConfig, ScreenId } from '../types';
import { sendMessageToMaya } from '../services/maya/mayaService';

// Importing subcomponents
import ConversationStarter from './hopebuddy/ConversationStarter';
import ConversationHistory, { StoredSession, StoredMessage } from './hopebuddy/ConversationHistory';
import SuggestedActions from './hopebuddy/SuggestedActions';
import WellnessInsights from './hopebuddy/WellnessInsights';
import SessionSummary, { SessionSummaryItem } from './hopebuddy/SessionSummary';
import CheckInReminder, { ReminderPrefs } from './hopebuddy/CheckInReminder';

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

const DEFAULT_REMINDERS: ReminderPrefs = {
  remindMood: false,
  remindJournal: false,
  remindBreathing: false,
  remindGratitude: false
};

export default function HopeBuddyChatScreen({
  onBack,
  userName,
  selectedMood,
  onNavigateTo,
  onOpenCrisisScreen,
  onOpenModerationBlock,
}: HopeBuddyChatScreenProps) {
  // Tabs: 'chat' | 'history' | 'wellness'
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'wellness'>('chat');

  // Active chat state
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const moodId = selectedMood?.id || 'calm';
    let welcomeText = `Hi ${userName}, I’m Maya. I’m here to listen and walk alongside you. How are you holding up?`;
    
    if (moodId === 'anxious') {
      welcomeText = `Hi ${userName}, I hear that you're feeling anxious. You don't have to figure everything out at once. We can take one small step together. 🌱`;
    } else if (moodId === 'sad') {
      welcomeText = `Hi ${userName}, I hear that you're feeling sad. It is completely okay to feel low. I'm right here to support you without any judgment. ❤️`;
    } else if (moodId === 'tired') {
      welcomeText = `Hi ${userName}, I see you're feeling tired. You've been holding on so strongly. I'm happy to keep you quiet company while you rest. 🛌`;
    } else if (moodId === 'lonely') {
      welcomeText = `Hi ${userName}, I see you checked in as lonely today. I'm sitting right here with you. You don't have to carry this alone. 🌙`;
    } else if (moodId === 'hurt') {
      welcomeText = `Hi ${userName}, I hear that you're feeling hurt. Let's take things slowly and find a little comfort together.`;
    }

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'buddy',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedMood, userName]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // History, Summary, and Reminders state
  const [sessions, setSessions] = useState<StoredSession[]>(() => {
    try {
      const saved = localStorage.getItem('hopebuddy_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [summaries, setSummaries] = useState<SessionSummaryItem[]>(() => {
    try {
      const saved = localStorage.getItem('hopebuddy_summaries');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [reminderPrefs, setReminderPrefs] = useState<ReminderPrefs>(() => {
    try {
      const saved = localStorage.getItem('hopebuddy_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
    } catch (e) {
      return DEFAULT_REMINDERS;
    }
  });

  // Safety overlay state
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeTab]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const lower = text.toLowerCase();

    const highRiskPhrases = ['suicide', 'kill myself', 'harm myself', 'end my life', 'immediate danger', 'want to die'];
    if (highRiskPhrases.some(phrase => lower.includes(phrase))) {
      setShowCrisisModal(true);
      return;
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

      const response = await sendMessageToMaya(text, selectedMood.id, history);

      const buddyMsg: Message = {
        id: 'buddy-' + Date.now(),
        sender: 'buddy',
        text: response.responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, buddyMsg]);
    } catch (e) {
      console.error('[Maya] Error in conversation:', e);
      const errorMsg: Message = {
        id: 'buddy-error-' + Date.now(),
        sender: 'buddy',
        text: "I'm having a quiet moment right now. Let's try chatting again in a second.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectStarter = (starterText: string) => {
    handleSend(starterText);
  };

  // Continue past chat
  const handleContinueSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(session.id);
      // Map StoredMessage to Message
      const activeMsgs: Message[] = session.messages.map(m => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }));
      setMessages(activeMsgs);
      setActiveTab('chat');
    }
  };

  // Delete past chat
  const handleDeleteSession = (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    localStorage.setItem('hopebuddy_history', JSON.stringify(updated));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  // Save current chat session and generate summary
  const handleEndAndSummarizeSession = () => {
    const userMsgs = messages.filter(m => m.sender === 'user');
    if (userMsgs.length === 0) {
      alert("No conversation exchanges to summarize yet. Chat with HopeBuddy first!");
      return;
    }

    const textJoined = messages.map(m => m.text).join(' ');
    const sessionNotes: string[] = [];

    // Rule-based summary builders
    if (textJoined.includes('overwhelm') || textJoined.includes('stress')) {
      sessionNotes.push('Feeling overwhelmed and holding stress');
    } else if (textJoined.includes('sad') || textJoined.includes('alone') || textJoined.includes('lonely')) {
      sessionNotes.push('Experiencing sadness or isolation');
    } else {
      sessionNotes.push('Reflecting on thoughts gently');
    }

    if (textJoined.includes('breath') || textJoined.includes('ground')) {
      sessionNotes.push('Completed breathing exercise pacing');
    }
    
    // Add default self-care note
    sessionNotes.push('Saved self-care reflection logs');

    const newSummary: SessionSummaryItem = {
      id: 'sum-' + Date.now(),
      timestamp: new Date().toISOString(),
      notes: sessionNotes
    };

    const updatedSummaries = [newSummary, ...summaries];
    setSummaries(updatedSummaries);
    localStorage.setItem('hopebuddy_summaries', JSON.stringify(updatedSummaries));

    // Save full chat history
    const sessionTitle = userMsgs[0].text.substring(0, 42) + '...';
    const newSession: StoredSession = {
      id: currentSessionId || 'sess-' + Date.now(),
      timestamp: new Date().toISOString(),
      title: sessionTitle,
      messages: messages.map(m => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }))
    };

    let updatedSessions: StoredSession[];
    if (currentSessionId) {
      updatedSessions = sessions.map(s => s.id === currentSessionId ? newSession : s);
    } else {
      updatedSessions = [newSession, ...sessions];
    }

    setSessions(updatedSessions);
    localStorage.setItem('hopebuddy_history', JSON.stringify(updatedSessions));

    alert("✓ Session saved, and rule-based self-care summary generated!");

    // Reset for a fresh chat session next time
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'buddy',
        text: `Hi ${userName}, I’m here with you. Feel free to start a new quiet chat.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setCurrentSessionId(null);
  };

  const handleClearAllSummaries = () => {
    setSummaries([]);
    localStorage.removeItem('hopebuddy_summaries');
  };

  const handleChangeReminders = (nextPrefs: ReminderPrefs) => {
    setReminderPrefs(nextPrefs);
    localStorage.setItem('hopebuddy_preferences', JSON.stringify(nextPrefs));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full my-auto animate-in fade-in duration-300">
      {/* Top Header */}
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
        <div className="text-center flex-1">
          <span className="font-display font-extrabold text-[#2B1D12] text-[18px] uppercase tracking-tight block">
            Maya 🌱
          </span>
          <span className="text-[10px] text-gray-500 font-semibold block leading-tight">
            Your wellness companion
          </span>
        </div>
        <span className="text-[22px]">🌱</span>
      </div>

      {/* Tab Switcher */}
      <div className="bg-[#FAF7F0] border-b border-[#E9E4D9] px-4 py-2 z-10 sticky top-[68px]">
        <div className="flex bg-[#FFF3E4]/50 border border-orange-100/60 rounded-xl p-1 gap-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('chat')}
            type="button"
            className={`flex-1 py-1.5 text-[12px] font-display font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-[#FF7527] text-white shadow-3xs' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab('history')}
            type="button"
            className={`flex-1 py-1.5 text-[12px] font-display font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-[#FF7527] text-white shadow-3xs' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📜 History
          </button>
          <button
            onClick={() => setActiveTab('wellness')}
            type="button"
            className={`flex-1 py-1.5 text-[12px] font-display font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'wellness' ? 'bg-[#FF7527] text-white shadow-3xs' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🌱 Wellness
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 pb-24 sm:pb-10 space-y-6">
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {/* Conversation Starters when messaging is at beginning */}
            {messages.length === 1 && (
              <ConversationStarter onSelectStarter={handleSelectStarter} />
            )}

            {/* Core Messages Box */}
            <div className="bg-white border border-[#EDE9DE] rounded-[36px] p-5 md:p-7 shadow-xs flex flex-col min-h-[380px] md:min-h-[440px] overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin max-h-[340px] md:max-h-[400px]">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => {
                    const isBuddy = msg.sender === 'buddy';
                    return (
                      <React.Fragment key={msg.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className={`flex gap-3.5 max-w-[85%] ${isBuddy ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}
                        >
                          {isBuddy && (
                            <div className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden self-end">
                              <MascotSitting size={28} />
                            </div>
                          )}
                          <div className="space-y-1">
                            <div
                              className={`px-5 py-3.5 text-[14.5px] sm:text-[15px] font-semibold leading-relaxed ${
                                isBuddy 
                                  ? 'bg-[#FAF7F0] text-gray-800 rounded-[22px] rounded-bl-xs' 
                                  : 'bg-[#FFF2EA] text-gray-850 rounded-[22px] rounded-br-xs'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className={`text-[10px] font-mono text-gray-405 block px-2 ${isBuddy ? 'text-left' : 'text-right'}`}>
                              {msg.timestamp}
                            </span>
                          </div>
                        </motion.div>

                        {index === 0 && (
                          <div className="py-8 flex flex-col items-center justify-center gap-3 text-center text-gray-400">
                            <div className="w-full flex items-center gap-4">
                              <span className="h-px bg-gray-100/70 flex-1" />
                              <span className="text-[#FF7527] text-[18px]">♡</span>
                              <span className="h-px bg-gray-100/70 flex-1" />
                            </div>
                            <p className="text-[13px] font-semibold text-gray-400">
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
                      className="flex gap-3.5 max-w-[85%] self-start"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden self-end">
                        <MascotSitting size={28} />
                      </div>
                      <div className="bg-[#FAF7F0] text-gray-400 px-5 py-3.5 rounded-[22px] rounded-bl-xs text-[13px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-3 pt-3 border-t border-gray-100">
                {[
                  { text: 'Help me calm down', emoji: '🌬️' },
                  { text: 'I want to talk', emoji: '💬' },
                  { text: 'Give me something to do', emoji: '🌱' }
                ].map((act) => (
                  <button
                    key={act.text}
                    onClick={() => handleSend(act.text)}
                    type="button"
                    className="py-1.5 px-3 bg-orange-50/40 hover:bg-orange-50 border border-orange-100/60 rounded-full text-[12px] font-semibold text-gray-700 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span>{act.emoji}</span> {act.text}
                  </button>
                ))}
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSubmitForm} className="mt-4 pt-4 border-t border-gray-100 flex gap-2.5">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Share what feels comfortable..."
                  className="flex-1 px-4 py-3 bg-[#FCFCFA] border border-gray-200 rounded-2xl text-[13.5px] font-semibold focus:outline-none focus:border-[#FF7527]"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputText.trim()}
                  className="px-5 py-3 bg-[#FF7527] hover:bg-[#E96630] disabled:bg-gray-150 text-white rounded-2xl text-[13.5px] font-display font-black cursor-pointer transition-all active-scale"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Suggestions & Action Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleEndAndSummarizeSession}
                className="flex-1 py-3.5 bg-[#2B1D12] hover:bg-black text-white font-display font-black text-[13px] rounded-2xl cursor-pointer transition-all active-scale text-center shadow-3xs"
              >
                💾 Save Reflection & End Session
              </button>
            </div>

            {/* Suggested actions widget */}
            <SuggestedActions
              onNavigateTo={(scr) => onNavigateTo(scr)}
              recentMoodId={selectedMood.id}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ConversationHistory
              sessions={sessions}
              onContinue={handleContinueSession}
              onDelete={handleDeleteSession}
            />
            <SessionSummary
              summaries={summaries}
              onClearAll={handleClearAllSummaries}
            />
          </div>
        )}

        {activeTab === 'wellness' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <WellnessInsights />
            <CheckInReminder
              preferences={reminderPrefs}
              onChangePreferences={handleChangeReminders}
            />
          </div>
        )}
      </div>

      {/* Safety Severe Distress Modal Overlay */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] border border-orange-100 p-6 max-w-md w-full shadow-lg text-center space-y-4 animate-in scale-in duration-200">
            <div className="text-[32px] select-none">🛡️</div>
            <h3 className="font-display font-black text-gray-800 text-[18px]">Support & Safety Guidance</h3>
            <p className="text-[12.5px] text-gray-600 font-semibold leading-relaxed">
              I hear that you're going through a very difficult time. While I am here to act as a quiet, supportive companion, I am not a crisis service. Your safety is what matters most.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-left text-[12px] text-amber-900 font-semibold space-y-1.5">
              <div>📞 <strong>National Crisis Lifeline:</strong> Call or text {reminderPrefs.crisisHotline || '988'}</div>
              <div>🏥 <strong>Emergency Services:</strong> Dial {reminderPrefs.emergencyNumber || '911'}</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCrisisModal(false);
                  onNavigateTo(ScreenId.CareBridge);
                }}
                className="py-2.5 bg-orange-50 hover:bg-[#FFF2EA] border border-orange-100 text-[#FF7527] font-display font-black text-[12px] rounded-xl cursor-pointer"
              >
                Open CareBridge
              </button>
              <button
                type="button"
                onClick={() => setShowCrisisModal(false)}
                className="py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12px] rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
