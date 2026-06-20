import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

interface ListenerMatchScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: string) => void;
  onOpenModerationBlock?: () => void; // Trigger for Screen 21
  onOpenCrisisScreen?: () => void; // Trigger for Screen 22
}

const CONSTANT_LISTENERS = [
  { 
    name: 'Voice123', 
    bio: 'Ready to listen without judgment. Share your heavy thoughts here safely.',
    status: 'Available for support',
    supportType: 'Emotional listening',
    boundary: 'No prescriptions or diagnosis',
    bg: 'bg-orange-100', 
    text: 'text-orange-850'
  },
  { 
    name: 'Voice78', 
    bio: 'Care ally. Offering cozy conversations and support loops.',
    status: 'Available for support',
    supportType: 'Kind companionship',
    boundary: 'No prescriptions or diagnosis',
    bg: 'bg-blue-100', 
    text: 'text-blue-800' 
  },
];

export default function ListenerMatchScreen({ 
  onBack, 
  onNavigateTo,
  onOpenModerationBlock,
  onOpenCrisisScreen
}: ListenerMatchScreenProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string>('I need someone to listen');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeListener, setActiveListener] = useState<typeof CONSTANT_LISTENERS[0] | null>(null);
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  
  // Chat messaging state
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const feelingOptions = [
    'I need someone to listen',
    'I feel anxious',
    'I feel lonely',
    'I feel hurt',
    'I want professional help'
  ];

  // Intercept the therapist suggestion selection
  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling);
    if (feeling === 'I want professional help') {
      onNavigateTo('doctor-suggestions');
    }
  };

  // Scroll chat messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleStartSearch = () => {
    setIsSearching(true);
    setActiveListener(null);
    setIsChatActive(false);

    setTimeout(() => {
      setIsSearching(false);
      // Ensure Voice123 is shown as requested in specifications
      const preferred = CONSTANT_LISTENERS.find(l => l.name === 'Voice123') || CONSTANT_LISTENERS[0];
      setActiveListener(preferred);
    }, 1500);
  };

  const startChatFlow = () => {
    if (!activeListener) return;
    setIsChatActive(true);
    setChatMessages([
      {
        id: '1',
        sender: 'system',
        senderName: 'HopeHeart Safe AI Guard',
        content: `🛡️ Anonymous safe chat created. HopeHeart automatically checks messages to prevent unsafe guidance.`,
        timestamp: 'Just now'
      },
      {
        id: '2',
        sender: 'listener',
        senderName: activeListener.name,
        content: `Hello my friend, I am Voice123. I am here to offer you a supportive, listening ear. How is your heart doing today?`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Safe checks for unallowed health words
  const handleCheckAndSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const lower = textToSend.toLowerCase();
    const unsafeKeywords = [
      'prescription', 'dosage', 'prescribe', 'diagnose', 
      'mg', 'milligram', 'treatment', 'medication', 'medicine', 
      'pill', 'xanax', 'paracetamol', 'prozac', 'cure', 'diagnosis'
    ];

    const containsUnsafe = unsafeKeywords.some(word => lower.includes(word));

    if (containsUnsafe) {
      if (onOpenModerationBlock) {
        onOpenModerationBlock();
        return;
      }
      
      // Inline block fallback
      const errorMsg: Message = {
        id: Date.now().toString() + '-blocked',
        sender: 'bot',
        senderName: 'HopeHeart AI Protection',
        content: '⚠️ This message may include medical advice or treatment guidance. HopeHeart allows emotional support only. Please remove medical advice.',
        timestamp: 'Blocked'
      };
      setChatMessages(prev => [...prev, errorMsg]);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: 'Voice47 (You)',
      content: textToSend,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Simulated reply trigger
    setTimeout(() => {
      let comfort = "I understand. I am here for you. Thank you for sharing your feeling with me.";
      if (lower.includes('heavy') || lower.includes('sad')) {
        comfort = "Hearing that life feels heavy carries so much weight. Take all the time you need. I am here listening.";
      } else if (lower.includes('lonely') || lower.includes('alone')) {
        comfort = "We are connected here today, my friend. You do not have to carry this alone.";
      } else if (lower.includes('thank')) {
        comfort = "You are so welcome. It is an honor to be a safe listener for you tonight.";
      }
      
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'listener',
          senderName: 'Voice123',
          content: comfort,
          timestamp: 'Just now'
        }
      ]);
    }, 1500);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    handleCheckAndSend(messageInput);
    setMessageInput('');
  };

  const handleSuggestedMessageClick = (msg: string) => {
    handleCheckAndSend(msg);
  };

  const toggleVoiceRecordSimulator = () => {
    if (isRecording) {
      setIsRecording(false);
      handleCheckAndSend("🎙️ [Shared a 12-second voice note of comfort]");
    } else {
      setIsRecording(true);
    }
  };

  const triggerReportModal = () => {
    alert("Thank you. Our safety moderators have been notified of this chat session. We prioritize emotional safety.");
  };

  const suggestedReplies = [
    "I feel heavy today.",
    "I need someone to listen.",
    "I do not need advice right now.",
    "Can you just hear me for a moment?",
    "Thank you for being here."
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={isChatActive ? () => setIsChatActive(false) : onBack}
          id="btn-back-match-screen"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px]">
          {isChatActive ? 'Chat with Voice123' : 'Safe Listener Match'}
        </span>
        <span className="text-[20px] select-none">💬</span>
      </div>

      {isChatActive && activeListener ? (
        /* SCREEN 7: SAFE CHAT CLIENT SCREEN */
        <div className="flex-1 flex flex-col justify-between h-[calc(100vh-140px)] md:h-[650px] bg-[#F7F4EC] relative overflow-hidden">
          
          {/* Safety Banner */}
          <div className="bg-amber-50 border-b border-amber-100 p-3.5 text-center text-amber-800 text-[11.5px] font-semibold leading-relaxed shrink-0">
            🛡️ <strong>Safety Banner:</strong> Share feelings only. Do not share prescriptions, dosage, diagnosis, or treatment advice. Community users are peer listeners, not clinical professionals.
          </div>

          {/* Chat message logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
            {chatMessages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="bg-white/80 border border-[#ECE6D9] p-3 rounded-2xl text-[11.5px] text-gray-500 font-semibold text-center leading-relaxed">
                    {msg.content}
                  </div>
                );
              }
              if (msg.sender === 'bot') {
                return (
                  <div key={msg.id} className="bg-red-50 border border-red-200 p-3.5 rounded-2xl text-[12px] text-red-600 font-semibold leading-relaxed shadow-sm">
                    {msg.content}
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => onNavigateTo('about')}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Learn Community Rules
                      </button>
                      <button 
                        onClick={() => onNavigateTo('doctor-suggestions')}
                        className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Find Clinicians
                      </button>
                    </div>
                  </div>
                );
              }

              const isMe = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest font-extrabold mb-1 px-1.5 uppercase">
                    {msg.senderName}
                  </span>
                  <div className={`p-3.5 max-w-[85%] rounded-2xl text-[13px] leading-relaxed shadow-xs font-semibold ${
                    isMe 
                      ? 'bg-[#1E1E1A] text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-[#E9E4D9] rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Click Suggested Messages (Above the input fold) */}
          <div className="p-2.5 bg-[#FAF7F0] border-t border-[#EDE9DE] shrink-0">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block mb-1.5 px-1">
              Tap a safe message to send instantly
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {suggestedReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedMessageClick(reply)}
                  className="bg-white hover:bg-[#FFF2EA] border border-[#ECE6D9] text-[#2B1D12] hover:text-[#FF7527] text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
                >
                  💬 {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Core Chat Form & Actions */}
          <div className="bg-white p-3 border-t border-[#E9E4D9] space-y-2 shrink-0">
            <form onSubmit={handleFormSubmit} className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Write what your heart wants to say..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold bg-[#FCFCFA] focus:outline-none focus:ring-1 focus:ring-[#FF7527]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>

            {/* Quick Actions Buttons Row: Send, Voice Note, Report, End Chat */}
            <div className="flex justify-between items-center gap-1.5 pt-1">
              <button
                onClick={toggleVoiceRecordSimulator}
                className={`px-3 py-2 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-50 text-[#FF7527]'} hover:bg-orange-100 rounded-xl text-[11px] font-display font-bold cursor-pointer transition-all flex items-center gap-1`}
              >
                🎙️ {isRecording ? 'Stop & Send Note' : 'Voice Note'}
              </button>
              
              <div className="flex gap-1.5">
                <button
                  onClick={triggerReportModal}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[11px] font-display font-bold cursor-pointer transition-colors"
                >
                  ⚠️ Report
                </button>
                <button
                  onClick={() => {
                    if (confirm("End this supportive chat session?")) {
                      setIsChatActive(false);
                    }
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-250 text-gray-700 rounded-xl text-[11px] font-display font-bold cursor-pointer transition-colors"
                >
                  🚪 End Chat
                </button>
              </div>
            </div>
            
            <div className="text-[10px] text-center text-gray-400 font-semibold italic mt-1">
              Type keywords like " Xanax, cure, prescription, dosage " to trigger community safety block simulation!
            </div>
          </div>

        </div>
      ) : (
        /* SCREEN 6: SAFE PEER LISTENER SCREEN */
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
              Find someone safe to share with
            </h2>
            <p className="text-[13px] text-gray-500 font-semibold leading-relaxed">
              You do not need to explain everything. Start with one feeling.
            </p>
          </div>

          {/* Feeling Filters selection */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              1. Choose a focus prompt category
            </span>
            <div className="flex flex-wrap gap-2">
              {feelingOptions.map((option) => {
                const isSel = selectedFeeling === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleFeelingSelect(option)}
                    className={`px-4 py-3 rounded-2xl text-[12.5px] font-display font-extrabold border transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-[#FFF2EA] border-[#FF7527] text-[#FF7527] shadow-xs' 
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matchmaking trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleStartSearch}
              disabled={isSearching}
              className="w-full py-4 bg-[#FF7527] hover:bg-[#E55D13] font-display font-black text-white text-[15px] sm:text-[16px] rounded-2xl shadow-[0_4px_14px_rgba(255,117,39,0.2)] disabled:bg-gray-300 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 00-10 10h2a8 8 0 018-8V2z" />
                  </svg>
                  Matching with a Kind Heart...
                </>
              ) : (
                <>
                  Connect with a Safe Listener
                  <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Matching results */}
          <AnimatePresence mode="wait">
            {isSearching && (
              <motion.div
                key="searching-prompt"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#FEFAF0] border-2 border-dashed border-[#F3E2C4] rounded-3xl p-6 text-center space-y-3 py-10"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-orange-100 animate-ping absolute opacity-45" />
                  <span className="text-[28px] z-10 select-none">🧩</span>
                </div>
                <h4 className="font-display font-black text-gray-800 text-[16px]">
                  HopeHeart AI Search Platform Active
                </h4>
                <p className="text-[12.5px] text-gray-500 font-semibold px-6 max-w-sm mx-auto">
                  Connecting you with peer listeners who share a similar focus theme. Your identity is 100% hidden.
                </p>
              </motion.div>
            )}

            {!isSearching && activeListener && (
              <motion.div
                key="listener-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#EDE9DE] rounded-3xl p-6 shadow-xs space-y-4 max-w-md mx-auto"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-display font-black text-[18px]">
                      H
                    </div>
                    <div>
                      <h4 className="font-display font-black text-[#2B1D12] text-[16.5px]">
                        Safe Listener: {activeListener.name}
                      </h4>
                      <span className="text-xs font-semibold text-green-600 block">
                        ● {activeListener.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Listener Specs */}
                <div className="text-[12px] bg-[#FCFAF5] rounded-2xl border border-gray-100 p-4 space-y-1.5 font-semibold text-gray-600">
                  <p><strong>Support type:</strong> {activeListener.supportType}</p>
                  <p><strong>Boundary restriction:</strong> {activeListener.boundary}</p>
                  <p className="italic text-gray-500 font-normal pt-1.5">"{activeListener.bio}"</p>
                </div>

                <button
                  onClick={startChatFlow}
                  id="btn-start-chat-matched"
                  className="w-full py-3 bg-[#1e1e1a] hover:bg-black text-[#FCFAF5] font-display font-extrabold rounded-2xl text-[14px] cursor-pointer transition-colors"
                >
                  Start Safe Chat
                </button>

                <div className="text-center">
                  <p className="text-[11.5px] text-gray-400 font-semibold">
                    Support only. Listeners are here to support, not to treat.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
export { ListenerMatchScreen };
