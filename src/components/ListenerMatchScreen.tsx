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
  gender: string;
  profession: string;
  listeningStyle: string;
  rating: string;
  sessions: string;
  languages: string;
  matchedReason: string;
}

// Warm anonymous listener profiles mapped to categories
const LISTENERS_DATA: Record<string, Listener[]> = {
  'I need someone to listen': [
    {
      name: 'Priya',
      role: 'Anonymous Listener',
      bio: 'Here to hold space for you. Share your day or just speak your mind. I am ready to hear you.',
      status: 'available',
      supportType: 'Active listening',
      boundary: 'No clinical assessments',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Working Professional',
      listeningStyle: 'Warm listener',
      rating: '97%',
      sessions: '140 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: "You selected 'I need someone to listen' and Priya is known for active, warm conversations."
    },
    {
      name: 'Aarav',
      role: 'Anonymous Listener',
      bio: 'Here to listen quietly and support you with a gentle, patient space. Share what feels safe.',
      status: 'available',
      supportType: 'Quiet support',
      boundary: 'No prescriptions',
      iconBg: 'bg-teal-100 text-teal-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Student',
      listeningStyle: 'Gentle listener',
      rating: '96%',
      sessions: '110 listens',
      languages: 'English • Hindi',
      matchedReason: "You selected 'I need someone to listen' and Aarav focuses on quiet, patient space."
    },
    {
      name: 'Leo',
      role: 'Anonymous Listener',
      bio: 'Offering a quiet, comforting presence. A warm cup of tea for your heavy thoughts today.',
      status: 'available',
      supportType: 'Quiet companionship',
      boundary: 'No diagnosis or treatment',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Caregiver',
      listeningStyle: 'Gentle listener',
      rating: '95%',
      sessions: '85 listens',
      languages: 'English • Spanish',
      matchedReason: "You selected 'I need someone to listen' and Leo is matched for his supportive quiet presence."
    }
  ],
  'I feel anxious': [
    {
      name: 'Maya',
      role: 'Anonymous Listener',
      bio: 'Providing gentle grounding support and slow conversations during racing moments.',
      status: 'available',
      supportType: 'Calming presence',
      boundary: 'No medical advice',
      iconBg: 'bg-orange-100 text-orange-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Student',
      listeningStyle: 'Calm listener',
      rating: '98%',
      sessions: '120 listens',
      languages: 'English • Hindi',
      matchedReason: "You selected 'I feel anxious' and Maya is known for calm, slow conversations."
    },
    {
      name: 'Nisha',
      role: 'Anonymous Listener',
      bio: 'Let’s take it one minute at a time. Slow breathing and quiet space. I am here for you.',
      status: 'soon',
      supportType: 'Anxiety grounding',
      boundary: 'No clinical advice',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Caregiver',
      listeningStyle: 'Calm listener',
      rating: '99%',
      sessions: '95 listens',
      languages: 'English • Hindi',
      matchedReason: "You selected 'I feel anxious' and Nisha excels at supporting people dealing with high anxiety."
    },
    {
      name: 'Leo',
      role: 'Anonymous Listener',
      bio: 'A soft, patient presence when everything feels too fast. You can set the pace.',
      status: 'available',
      supportType: 'Quiet support',
      boundary: 'No diagnosis or treatment',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Caregiver',
      listeningStyle: 'Gentle listener',
      rating: '95%',
      sessions: '85 listens',
      languages: 'English • Spanish',
      matchedReason: "You selected 'I feel anxious' and Leo is known for grounding, slow-paced support."
    }
  ],
  'I feel lonely': [
    {
      name: 'Priya',
      role: 'Anonymous Listener',
      bio: 'Companionship for quiet evenings. Let’s share a comfortable talk. You are not alone.',
      status: 'available',
      supportType: 'Active listening',
      boundary: 'No clinical assessments',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Working Professional',
      listeningStyle: 'Warm listener',
      rating: '97%',
      sessions: '140 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: "You selected 'I feel lonely' and Priya is matched for her warm, friendly presence."
    },
    {
      name: 'Kabir',
      role: 'Anonymous Listener',
      bio: 'Let’s connect and talk about life, art, or anything else you love. I am here to share a chat.',
      status: 'available',
      supportType: 'Friendly company',
      boundary: 'No clinical assessments',
      iconBg: 'bg-indigo-100 text-indigo-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Artist',
      listeningStyle: 'Patient listener',
      rating: '97%',
      sessions: '72 listens',
      languages: 'English • Hindi • Urdu',
      matchedReason: "You selected 'I feel lonely' and Kabir offers patient, comfortable peer companionship."
    },
    {
      name: 'Aarav',
      role: 'Anonymous Listener',
      bio: 'Here to chat, share a laugh, or just listen quietly. Let’s keep each other company.',
      status: 'available',
      supportType: 'Cozy companionship',
      boundary: 'No prescriptions',
      iconBg: 'bg-teal-100 text-teal-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Student',
      listeningStyle: 'Gentle listener',
      rating: '96%',
      sessions: '110 listens',
      languages: 'English • Hindi',
      matchedReason: "You selected 'I feel lonely' and Aarav is matched for his friendly, approachable style."
    }
  ],
  'I feel hurt': [
    {
      name: 'Nisha',
      role: 'Anonymous Listener',
      bio: 'A gentle space to process raw, heavy feelings without judgment. Take all the time you need.',
      status: 'soon',
      supportType: 'Anxiety grounding',
      boundary: 'No clinical advice',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Caregiver',
      listeningStyle: 'Calm listener',
      rating: '99%',
      sessions: '95 listens',
      languages: 'English • Hindi',
      matchedReason: "You selected 'I feel hurt' and Nisha is highly experienced in holding space on raw days."
    },
    {
      name: 'Maya',
      role: 'Anonymous Listener',
      bio: 'Healing thoughts and soft, quiet support. Share what feels safe to talk through.',
      status: 'available',
      supportType: 'Kind presence',
      boundary: 'No medical advice',
      iconBg: 'bg-orange-100 text-orange-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Student',
      listeningStyle: 'Calm listener',
      rating: '98%',
      sessions: '120 listens',
      languages: 'English • Hindi',
      matchedReason: "You selected 'I feel hurt' and Maya is known for slow, healing, and patient talks."
    },
    {
      name: 'Leo',
      role: 'Anonymous Listener',
      bio: 'A safe harbor when life throws painful challenges your way. I am here to stand beside you.',
      status: 'available',
      supportType: 'Quiet support',
      boundary: 'No diagnosis or treatment',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Caregiver',
      listeningStyle: 'Gentle listener',
      rating: '95%',
      sessions: '85 listens',
      languages: 'English • Spanish',
      matchedReason: "You selected 'I feel hurt' and Leo brings strong peer support strengths from caregiving."
    }
  ],
  'I want guidance, not advice': [
    {
      name: 'Kabir',
      role: 'Anonymous Listener',
      bio: 'Helping you explore your thoughts and options, not telling you what to do. You make your path.',
      status: 'available',
      supportType: 'Cozy company',
      boundary: 'No medical advice',
      iconBg: 'bg-indigo-100 text-indigo-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      profession: 'Artist',
      listeningStyle: 'Patient listener',
      rating: '97%',
      sessions: '72 listens',
      languages: 'English • Hindi • Urdu',
      matchedReason: "You selected 'I want guidance, not advice' and Kabir offers soft, reflective guidance."
    },
    {
      name: 'Nisha',
      role: 'Anonymous Listener',
      bio: 'Offering reflective listening to help you map out your next steps and find clarity.',
      status: 'soon',
      supportType: 'Anxiety grounding',
      boundary: 'No clinical advice',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Caregiver',
      listeningStyle: 'Calm listener',
      rating: '99%',
      sessions: '95 listens',
      languages: 'English • Hindi',
      matchedReason: "You selected 'I want guidance, not advice' and Nisha helps you map reflections gently."
    },
    {
      name: 'Priya',
      role: 'Anonymous Listener',
      bio: 'A sounding board for your decisions, keeping you secure and grounded as you navigate today.',
      status: 'available',
      supportType: 'Active listening',
      boundary: 'No clinical assessments',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      profession: 'Working Professional',
      listeningStyle: 'Warm listener',
      rating: '97%',
      sessions: '140 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: "You selected 'I want guidance, not advice' and Priya is matched as a secure sounding board."
    }
  ]
};

// Style-aligned vector avatar component for anonymous listeners
function ListenerAvatar({ name, gender }: { name: string; gender: string }) {
  const isFemale = gender.toLowerCase() === 'female';
  
  const bgColors: Record<string, string> = {
    Maya: '#FFF2EA',
    Leo: '#EBF5FF',
    Priya: '#EAF7F0',
    Aarav: '#FFF8EE',
    Nisha: '#FAF5FF',
    Kabir: '#F0F4FF'
  };
  const strokeColors: Record<string, string> = {
    Maya: '#FF7527',
    Leo: '#3B82F6',
    Priya: '#10B981',
    Aarav: '#F59E0B',
    Nisha: '#8B5CF6',
    Kabir: '#6366F1'
  };
  
  const bgColor = bgColors[name] || '#F3F4F6';
  const strokeColor = strokeColors[name] || '#9CA3AF';

  return (
    <svg className="w-12 h-12 rounded-2xl shrink-0" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="24" fill={bgColor} />
      {/* Head */}
      <circle cx="50" cy="46" r="18" fill="#E08C5E" />
      {/* Hair */}
      {isFemale ? (
        <path d="M26 46c0-14 10-24 24-24s24 10 24 24c0 4-2 7-4 9H30c-2-2-4-5-4-9z" fill="#4A3B32" />
      ) : (
        <path d="M30 40c0-10 8-18 20-18s20 8 20 18c0 1-2 2-3 2H33c-1 0-3-1-3-2z" fill="#332A24" />
      )}
      {/* Calming eyes */}
      <path d="M40 46q4 -2 8 0" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 46q4 -2 8 0" fill="none" stroke="#2B1D12" strokeWidth="2.5" strokeLinecap="round" />
      {/* Gentle smile */}
      <path d="M46 54q4 2 8 0" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
      {/* Torso/Shoulders */}
      <path d="M22 84c0-12 12-18 28-18s28 6 28 18H22z" fill={strokeColor} fillOpacity="0.8" />
    </svg>
  );
}

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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
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
    'I want guidance, not advice'
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
    setActiveFilter(null); // Clear filter on category switch
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

  // Resolve active category listeners and filter them
  const currentListeners = LISTENERS_DATA[selectedFeeling] || LISTENERS_DATA['I need someone to listen'];
  const filteredListeners = currentListeners.filter(listener => {
    if (!activeFilter) return true;
    if (activeFilter === 'Available now') return listener.status === 'available';
    if (activeFilter === 'Same language') return listener.languages.includes('English');
    if (activeFilter === 'Calm listener') return listener.listeningStyle.toLowerCase().includes('calm');
    if (activeFilter === 'Student') return listener.profession.toLowerCase().includes('student');
    if (activeFilter === 'Caregiver') return listener.profession.toLowerCase().includes('caregiver');
    if (activeFilter === 'High trust score') {
      const score = parseFloat(listener.rating.replace('%', ''));
      return score >= 97;
    }
    return true;
  });

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
          {isChatActive && activeListener ? `Chat with ${activeListener.name}` : 'Safe Space Community'}
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
              <ListenerAvatar name={activeListener.name} gender={activeListener.gender} />
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
                  <span>🌐 Speaks: {activeListener.languages}</span>
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

          {/* Quick Click Suggested Messages */}
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

            {/* Quick Actions Buttons Row */}
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
            <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
              Find someone who matches your current emotional need, language, and listening preference.
            </p>
          </div>

          {/* Feeling Filters selection */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              What kind of support do you need right now?
            </span>
            <div className="flex flex-wrap gap-2">
              {feelingOptions.map((option) => {
                const isSel = selectedFeeling === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleFeelingSelect(option)}
                    type="button"
                    className={`px-4 py-2.5 rounded-2xl text-[12px] font-display font-extrabold border transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-[#FFF2EA] border-[#FF7527] text-[#FF7527] shadow-xs' 
                        : 'bg-white border-gray-200 text-gray-750 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matched listeners grid */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EDE9DE] pb-2">
              <h3 className="text-[13.5px] font-display font-black text-[#2B1D12] shrink-0">
                Matched listeners available now
              </h3>
              
              {/* Filter Chips list */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  'Available now',
                  'Same language',
                  'Calm listener',
                  'Student',
                  'Caregiver',
                  'High trust score'
                ].map((filter) => {
                  const isAct = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(prev => prev === filter ? null : filter)}
                      type="button"
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                        isAct
                          ? 'bg-[#1E1E1A] border-[#1E1E1A] text-white shadow-3xs'
                          : 'bg-white border-gray-200 text-gray-550 hover:bg-gray-50'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

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
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredListeners.length === 0 ? (
                    <div className="col-span-full py-16 text-center space-y-2 bg-white border border-[#EDE9DE] rounded-[32px] p-6 shadow-3xs">
                      <span className="text-3xl block">🔍</span>
                      <h4 className="font-display font-black text-gray-800 text-[16px]">
                        No active listeners match this filter
                      </h4>
                      <p className="text-[12px] text-gray-400 font-semibold max-w-xs mx-auto">
                        Try selecting another filter chip or changing your support need category.
                      </p>
                    </div>
                  ) : (
                    filteredListeners.map((listener, idx) => (
                      <motion.div
                        key={listener.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-[#EDE9DE] rounded-[32px] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-sm transition-all"
                      >
                        <div className="space-y-4">
                          {/* Header: Avatar, Name, and Anonymous Listener label */}
                          <div className="flex items-center gap-3">
                            <ListenerAvatar name={listener.name} gender={listener.gender} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-display font-black text-[#2B1D12] text-[16px] leading-tight truncate">
                                {listener.name}
                              </h4>
                              <p className="text-[11px] font-bold text-[#FF7527] bg-[#FFF2EA] px-2 py-0.5 rounded-full inline-block mt-0.5 border border-[#FFE4D6]">
                                Anonymous Listener
                              </p>
                            </div>
                          </div>

                          {/* Profile Details */}
                          <div className="space-y-1.5 text-[12.5px] font-semibold text-gray-600 pl-1">
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400 text-[14px]">👤</span>
                              <span>{listener.gender} • {listener.profession}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400 text-[14px]">🧠</span>
                              <span>{listener.listeningStyle}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-gray-400 text-[14px]">🗣️</span>
                              <span>{listener.languages}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span>{listener.status === 'available' ? '🟢 Available now' : '⏳ Available soon'}</span>
                            </p>
                          </div>

                          {/* Trust Score & Listens */}
                          <div className="bg-[#FCFAF5] border border-[#E9E4D9] rounded-2xl p-3 flex justify-between items-center text-[12.5px] font-semibold text-gray-700">
                            <div className="flex items-center gap-1">
                              <span>🛡️ Trust Score:</span>
                              <span className="font-black text-gray-800">{listener.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>🤝 {listener.sessions}</span>
                            </div>
                          </div>

                          {/* Match reason card */}
                          <div className="bg-[#FFFDF9] border border-dashed border-[#FFE4D6] rounded-2xl p-3.5 space-y-1">
                            <p className="text-[11.5px] text-[#E55D13] font-bold uppercase tracking-wider">Matched because:</p>
                            <p className="text-[12.5px] text-gray-600 italic font-semibold leading-relaxed">
                              "{listener.matchedReason}"
                            </p>
                          </div>
                        </div>

                        {/* Action buttons row */}
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => startChatFlow(listener)}
                              type="button"
                              className="py-2 px-1 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[11px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-95 shadow-xs"
                            >
                              <span>💬</span> Chat
                            </button>
                            <button
                              disabled
                              type="button"
                              className="py-2 px-1 bg-gray-50 border border-gray-205 text-gray-400 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold cursor-not-allowed"
                              title="Call unlocked after trust is built"
                            >
                              <span>📞</span> Call locked
                            </button>
                            <button
                              disabled
                              type="button"
                              className="py-2 px-1 bg-gray-50 border border-gray-205 text-gray-400 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold cursor-not-allowed"
                              title="Video unlocked after trust is built"
                            >
                              <span>🎥</span> Video locked
                            </button>
                          </div>
                          <p className="text-[10.5px] text-gray-400 text-center font-semibold mt-1">
                            Call and video unlock after trust is built.
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* How Safe Matching Works Section */}
          <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-[24px] p-4 sm:p-5 space-y-3 mt-2">
            <h3 className="font-display font-black text-[#2B1D12] text-[14.5px] text-center sm:text-left">
              How safe matching works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 text-[12px] font-semibold text-gray-600 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="shrink-0 select-none text-[#FF7527]">⭐</span>
                <p>We match you based on your support need.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 select-none text-[#FF7527]">⭐</span>
                <p>You can choose by language, style, and availability.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 select-none text-[#FF7527]">⭐</span>
                <p>Listeners provide emotional support only, not medical advice.</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
