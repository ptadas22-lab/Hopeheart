import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

interface ListenerMatchScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: string) => void;
  onOpenModerationBlock?: () => void; // Trigger for Screen 21
  onOpenCrisisScreen?: () => void; // Trigger for Screen 22
}

interface Listener {
  name: string;
  role: string;
  bio: string;
  status: 'available' | 'soon';
  supportType: string;
  boundary: string;
  iconBg: string;
  actionText: string;
  targetPath?: string;
  gender?: string;
  profession?: string;
  listeningStyle?: string;
  rating?: string;
  sessions?: string;
  languages?: string;
}

const LISTENERS_DATA: Record<string, Listener[]> = {
  'I need someone to listen': [
    {
      name: 'Voice123',
      role: 'Safe Listener',
      bio: 'Ready to listen without judgment. Share your heavy thoughts here safely.',
      status: 'available',
      supportType: 'Emotional support',
      boundary: 'No prescriptions or diagnosis',
      iconBg: 'bg-orange-100 text-orange-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Caregiver',
      listeningStyle: 'Calm listener',
      rating: '⭐ 4.8',
      sessions: '120 listens',
      languages: 'English • Hindi'
    },
    {
      name: 'Voice78',
      role: 'Safe Listener',
      bio: 'Offering cozy conversations and gentle support loops.',
      status: 'available',
      supportType: 'Kind companionship',
      boundary: 'No prescriptions or diagnosis',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Working Professional',
      listeningStyle: 'Practical listener',
      rating: '⭐ 4.6',
      sessions: '86 listens',
      languages: 'English • Kannada'
    },
    {
      name: 'Hope88',
      role: 'Safe Listener',
      bio: 'Here to support you with an open mind and warm presence.',
      status: 'soon',
      supportType: 'Warm listening',
      boundary: 'No prescriptions or diagnosis',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Student',
      listeningStyle: 'Warm listener',
      rating: '⭐ 4.9',
      sessions: '140 listens',
      languages: 'English • Hindi • Kannada'
    }
  ],
  'I feel anxious': [
    {
      name: 'Peace47',
      role: 'Calm Listener',
      bio: 'Helps you slow down and talk through anxious moments.',
      status: 'available',
      supportType: 'Anxiety grounding',
      boundary: 'No clinical treatment advice',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Educator',
      listeningStyle: 'Calm listener',
      rating: '⭐ 4.7',
      sessions: '95 listens',
      languages: 'English • Hindi'
    },
    {
      name: 'CalmBuddy',
      role: 'Calm Listener',
      bio: 'Dedicated to gentle breathing exercises and slow, peaceful talk.',
      status: 'soon',
      supportType: 'Calming presence',
      boundary: 'No clinical treatment advice',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Yoga Guide',
      listeningStyle: 'Gentle listener',
      rating: '⭐ 4.8',
      sessions: '110 listens',
      languages: 'English • Kannada'
    },
    {
      name: 'RestingMind',
      role: 'Calm Listener',
      bio: 'Here to help you ground yourself when life feels too loud.',
      status: 'available',
      supportType: 'Quiet listening',
      boundary: 'No clinical treatment advice',
      iconBg: 'bg-purple-100 text-purple-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Artist',
      listeningStyle: 'Calm listener',
      rating: '⭐ 4.9',
      sessions: '72 listens',
      languages: 'English • Hindi • Kannada'
    }
  ],
  'I feel lonely': [
    {
      name: 'Warm28',
      role: 'Companion Listener',
      bio: 'Available for gentle conversation and emotional support.',
      status: 'available',
      supportType: 'Kind companionship',
      boundary: 'No clinical assessments',
      iconBg: 'bg-[#FFF2EA] text-[#FF7527]',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Social Worker',
      listeningStyle: 'Warm listener',
      rating: '⭐ 4.8',
      sessions: '130 listens',
      languages: 'English • Hindi'
    },
    {
      name: 'Friendship99',
      role: 'Companion Listener',
      bio: "Let's share a virtual warm tea and chat about anything on your mind.",
      status: 'available',
      supportType: 'Friendly listening',
      boundary: 'No clinical assessments',
      iconBg: 'bg-indigo-100 text-indigo-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Technical Support',
      listeningStyle: 'Warm listener',
      rating: '⭐ 4.7',
      sessions: '68 listens',
      languages: 'English • Kannada'
    },
    {
      name: 'KindHeart',
      role: 'Companion Listener',
      bio: 'A friendly presence for quiet or talkative evenings.',
      status: 'soon',
      supportType: 'Cozy conversation',
      boundary: 'No clinical assessments',
      iconBg: 'bg-teal-100 text-teal-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Psychology Student',
      listeningStyle: 'Warm listener',
      rating: '⭐ 4.9',
      sessions: '105 listens',
      languages: 'English • Hindi • Kannada'
    }
  ],
  'I feel hurt': [
    {
      name: 'Heal56',
      role: 'Care Listener',
      bio: 'Here to listen while you process difficult feelings.',
      status: 'available',
      supportType: 'Healing listening',
      boundary: 'No medical guidance',
      iconBg: 'bg-red-100 text-red-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Caregiver',
      listeningStyle: 'Quiet listener',
      rating: '⭐ 4.9',
      sessions: '150 listens',
      languages: 'English • Hindi'
    },
    {
      name: 'TenderEar',
      role: 'Care Listener',
      bio: 'A soft space for difficult days and recovery thoughts.',
      status: 'soon',
      supportType: 'Empathetic listening',
      boundary: 'No medical guidance',
      iconBg: 'bg-orange-100 text-orange-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Nurse Practitioner',
      listeningStyle: 'Patient listener',
      rating: '⭐ 4.8',
      sessions: '92 listens',
      languages: 'English • Kannada'
    },
    {
      name: 'GentleSoul',
      role: 'Care Listener',
      bio: 'Supporting you through raw, emotional, or confusing times.',
      status: 'available',
      supportType: 'Patient support',
      boundary: 'No medical guidance',
      iconBg: 'bg-rose-100 text-rose-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Community Host',
      listeningStyle: 'Gentle listener',
      rating: '⭐ 4.9',
      sessions: '115 listens',
      languages: 'English • Hindi • Kannada'
    }
  ],
  'I want professional help': [
    {
      name: 'Professional Resources',
      role: 'Professional Hub',
      bio: 'Find external professional resources and helplines.',
      status: 'available',
      supportType: 'Resource navigation',
      boundary: 'External links only',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Open Resources',
      targetPath: 'doctor-suggestions'
    },
    {
      name: 'External Directory',
      role: 'Professional Directory',
      bio: 'Connect with verified clinics and mental health professionals.',
      status: 'available',
      supportType: 'Provider directory',
      boundary: 'External links only',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Open Resources',
      targetPath: 'doctor-suggestions'
    },
    {
      name: 'Crisis Support Line',
      role: 'Immediate Hotline',
      bio: 'Instant access to free, confidential crisis resources.',
      status: 'available',
      supportType: 'Urgent helpline list',
      boundary: 'External lines only',
      iconBg: 'bg-red-100 text-red-700',
      actionText: 'Open Resources',
      targetPath: 'doctor-suggestions'
    }
  ]
};

export default function ListenerMatchScreen({ 
  onBack, 
  onNavigateTo,
  onOpenModerationBlock,
  onOpenCrisisScreen
}: ListenerMatchScreenProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string>('I need someone to listen');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeListener, setActiveListener] = useState<Listener | null>(null);
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

  // Run initial search loading animation on mount
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFeelingSelect = (feeling: string) => {
    setSelectedFeeling(feeling);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  // Scroll chat messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const startChatFlow = (listener: Listener) => {
    setActiveListener(listener);
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
        senderName: listener.name,
        content: `Hi 👋 I'm ${listener.name}.\n\nI'm another HopeHeart member volunteering as a listener today.\n\nTake your time. What would you like to share?`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Safe checks for unallowed health words
  const handleCheckAndSend = (textToSend: string) => {
    if (!textToSend.trim() || !activeListener) return;

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
      let comfort = "I understand. I am here for you. Thank you for sharing your feelings with me.";
      if (lower.includes('heavy') || lower.includes('sad')) {
        comfort = `Hearing that life feels heavy carries so much weight. Take all the time you need. I am here listening.`;
      } else if (lower.includes('lonely') || lower.includes('alone')) {
        comfort = `We are connected here today, my friend. You do not have to carry this alone.`;
      } else if (lower.includes('thank')) {
        comfort = `You are so welcome. It is an honor to be a safe listener for you today.`;
      }
      
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'listener',
          senderName: activeListener.name,
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
    "🌱 I had a difficult day",
    "😔 I'm feeling overwhelmed",
    "🧡 I just need someone to listen"
  ];

  const currentListeners = LISTENERS_DATA[selectedFeeling] || LISTENERS_DATA['I need someone to listen'];

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
          {isChatActive && activeListener ? `Chat with ${activeListener.name}` : 'Safe Listener Match'}
        </span>
        <span className="text-[20px] select-none">💬</span>
      </div>

      {isChatActive && activeListener ? (
        /* SCREEN 7: SAFE CHAT CLIENT SCREEN */
        <div className="flex-1 flex flex-col justify-between h-[calc(100vh-140px)] md:h-[650px] bg-[#F7F4EC] relative overflow-hidden w-full max-w-4xl mx-auto border-x border-[#EDE9DE]">
          
          {/* Safety Banner */}
          <div className="bg-amber-50 border-b border-amber-100 p-3.5 text-center text-amber-800 text-[11px] font-semibold leading-relaxed shrink-0">
            🛡️ <strong>Safety Banner:</strong> Share feelings only. Do not share prescriptions, dosage, diagnosis, or treatment advice. Community users are peer listeners, not clinical professionals.
          </div>

          {/* Listener Profile Card & Status Badges */}
          <div className="bg-white border-b border-[#E9E4D9] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-[16px] ${activeListener.iconBg}`}>
                {activeListener.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-black text-gray-800 flex items-center gap-1.5">
                    <span className="text-green-500">●</span> {activeListener.name}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    ⭐ Community trusted
                  </span>
                </div>
                <div className="text-[11.5px] text-gray-500 font-semibold space-x-2 mt-0.5">
                  <span>⏱️ Listening for: 18 mins</span>
                  <span>•</span>
                  <span>💬 Style: {activeListener.role}</span>
                  <span>•</span>
                  <span>🌐 Speaks: English • Hindi</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 bg-[#FCFAF5] border border-gray-200 text-gray-600 rounded-full text-[10.5px] font-extrabold flex items-center gap-1">
                🔒 Anonymous Chat
              </span>
              <span className="px-2.5 py-1 bg-[#FCFAF5] border border-gray-200 text-gray-600 rounded-full text-[10.5px] font-extrabold flex items-center gap-1">
                🛡️ AI Protected
              </span>
            </div>
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
                        Find Resources
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
                  <div 
                    className={`p-3.5 max-w-[85%] rounded-2xl text-[13px] leading-relaxed shadow-xs font-semibold ${
                      isMe 
                        ? 'bg-[#1E1E1A] text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-[#E9E4D9] rounded-bl-none'
                    }`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
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
                  className="bg-white hover:bg-[#FFF2EA] border border-[#ECE6D9] text-[#2B1D12] hover:text-[#FF7527] text-[12.5px] font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer text-left active:scale-95"
                >
                  {reply}
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
                placeholder="Share what's on your mind..."
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
              Type keywords like " Xanax, cure, prescription, dosage " to trigger safety block simulation!
            </div>
          </div>

        </div>
      ) : (
        /* SCREEN 6: SAFE PEER LISTENER SCREEN */
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
              Safe Space Community
            </h2>
            <p className="text-[13px] text-gray-500 font-semibold leading-relaxed">
              Peer listeners are here to support, not diagnose or treat.
            </p>
          </div>

          {/* Feeling Filters selection */}
          <div className="space-y-2.5">
            <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
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

          {/* Matched listeners grid */}
          <div className="space-y-3">
            <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              2. Matched Safe Spaces & Listeners
            </span>

            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="searching-prompt"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#FEFAF0] border border-[#F3E2C4] rounded-3xl p-6 text-center space-y-3 py-14"
                >
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-orange-100 animate-ping absolute opacity-45" />
                    <span className="text-[28px] z-10 select-none">🧩</span>
                  </div>
                  <h4 className="font-display font-black text-gray-800 text-[16px]">
                    Matching with supportive spaces...
                  </h4>
                  <p className="text-[12.5px] text-gray-500 font-semibold px-6 max-w-sm mx-auto">
                    Finding peer listeners or resource paths suited to your needs. Your identity remains 100% anonymous.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {currentListeners.map((listener, idx) => (
                    <motion.div
                      key={listener.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-[#EDE9DE] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-[16.5px] ${listener.iconBg}`}>
                              {listener.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-display font-black text-[#2B1D12] text-[14.5px] leading-tight">
                                {listener.name}
                              </h4>
                              <span className="text-[11px] font-semibold text-gray-400 block mt-0.5">
                                {listener.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 py-0.5">
                          <span className="text-[11.5px] font-bold text-gray-700">
                            {listener.status === 'available' ? '🟢 Available now' : '🟡 Usually replies soon'}
                          </span>
                        </div>

                        <div className="text-[11.5px] bg-[#FCFAF5] rounded-xl border border-gray-100 p-3 space-y-1 font-semibold text-gray-600">
                          <p><span className="text-gray-400 font-medium">Focus:</span> {listener.supportType}</p>
                          <p><span className="text-gray-400 font-medium">Limit:</span> {listener.boundary}</p>
                        </div>

                        {/* Compact Trust details grid */}
                        {listener.rating && (
                          <div className="grid grid-cols-2 gap-2.5 text-[10.5px] font-semibold text-gray-500 bg-[#FCFAF5] rounded-xl border border-gray-100 p-3">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="shrink-0 select-none">👤</span> 
                              <span className="truncate">{listener.gender} • {listener.profession}</span>
                            </div>
                            <div className="flex items-center gap-1.5 justify-end text-right min-w-0">
                              <span className="shrink-0 select-none">{listener.rating}</span> 
                              <span className="text-gray-400 truncate">({listener.sessions})</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="shrink-0 select-none">🧠</span> 
                              <span className="truncate">{listener.listeningStyle}</span>
                            </div>
                            <div className="flex items-center gap-1.5 justify-end text-right min-w-0">
                              <span className="shrink-0 select-none">🗣️</span> 
                              <span className="truncate" title={listener.languages}>{listener.languages}</span>
                            </div>
                          </div>
                        )}

                        <p className="text-[12.5px] text-gray-500 font-medium italic leading-relaxed">
                          "{listener.bio}"
                        </p>
                      </div>

                      {listener.targetPath ? (
                        <button
                          onClick={() => onNavigateTo(listener.targetPath!)}
                          className="w-full py-2.5 bg-[#1E1E1A] hover:bg-black text-[#FCFAF5] font-display font-extrabold rounded-xl text-[12.5px] cursor-pointer transition-colors active:scale-98"
                        >
                          {listener.actionText}
                        </button>
                      ) : (
                        <div className="flex flex-wrap justify-between items-center pt-3 border-t border-[#FAF7F0] gap-3">
                          {/* Communication Actions */}
                          <div className="flex items-center gap-2">
                            {/* Chat Button (Enabled) */}
                            <button
                              onClick={() => startChatFlow(listener)}
                              className="px-3.5 py-2.5 bg-[#FFF2EA] hover:bg-[#FFE0CD] text-[#FF7527] rounded-xl flex items-center justify-center gap-1.5 font-display font-extrabold text-[12px] cursor-pointer transition-all active:scale-95 hover:scale-105"
                              title="Start safe text chat"
                            >
                              <span>💬</span> Chat
                            </button>

                            {/* Call Button (Locked) */}
                            <div className="relative group">
                              <button
                                disabled
                                className="px-3.5 py-2.5 bg-[#FCFBF8] text-gray-400 border border-gray-150 rounded-xl flex items-center justify-center gap-1.5 font-display font-bold text-[12px] cursor-not-allowed opacity-80"
                              >
                                <span>📞</span> Call 🔒
                              </button>
                              {/* Custom Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#1E1E1A] text-white text-[9.5px] px-2.5 py-1.5 rounded-lg w-44 text-center leading-normal shadow-md font-sans z-30 select-none pointer-events-none">
                                Unlocks after 10 meaningful messages
                              </div>
                            </div>

                            {/* Video Button (Locked) */}
                            <div className="relative group">
                              <button
                                disabled
                                className="px-3.5 py-2.5 bg-[#FCFBF8] text-gray-400 border border-gray-150 rounded-xl flex items-center justify-center gap-1.5 font-display font-bold text-[12px] cursor-not-allowed opacity-80"
                              >
                                <span>🎥</span> Video 🔒
                              </button>
                              {/* Custom Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#1E1E1A] text-white text-[9.5px] px-2.5 py-1.5 rounded-lg w-44 text-center leading-normal shadow-md font-sans z-30 select-none pointer-events-none">
                                Unlocks only when both users agree
                              </div>
                            </div>
                          </div>

                          {/* Helper text */}
                          <div className="text-right">
                            <span className="text-[11px] font-extrabold text-gray-400 flex items-center gap-1">
                              🛡️ Trust builds gradually
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* How Safe Listening Works Section */}
          <div className="bg-white border border-[#EDE9DE] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="text-center md:text-left space-y-1">
              <h3 className="font-display font-black text-[#2B1D12] text-[18px]">
                How safe listening works
              </h3>
              <p className="text-[12px] text-gray-500 font-semibold">
                HopeHeart is built to protect your anonymity and emotional safety.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center font-display font-black text-[16px] text-[#FF7527]">
                  1
                </div>
                <h4 className="font-display font-bold text-gray-800 text-[13.5px]">
                  Share comfort, stay secure
                </h4>
                <p className="text-[12px] text-gray-500 leading-relaxed font-semibold">
                  Share only what you feel comfortable sharing. Your personal details are never shared.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-display font-black text-[16px] text-blue-600">
                  2
                </div>
                <h4 className="font-display font-bold text-gray-800 text-[13.5px]">
                  Emotional peer support
                </h4>
                <p className="text-[12px] text-gray-500 leading-relaxed font-semibold">
                  Listeners offer emotional support, not medical advice, clinical treatment, or prescriptions.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center font-display font-black text-[16px] text-emerald-600">
                  3
                </div>
                <h4 className="font-display font-bold text-gray-800 text-[13.5px]">
                  AI-powered guardrails
                </h4>
                <p className="text-[12px] text-gray-500 leading-relaxed font-semibold">
                  AI safety helps detect harmful or unsafe conversations to keep this a compassionate space.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export { ListenerMatchScreen };
