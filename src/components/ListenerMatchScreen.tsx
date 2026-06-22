import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

interface ListenerMatchScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: string) => void;
  onOpenModerationBlock?: () => void; // Trigger for Screen 21
  onOpenCrisisScreen?: () => void; // Trigger for Screen 22
  onRequireProfileCompletion?: (onSuccess: () => void) => void;
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
  ageGroup: string;
  profession: string;
  listeningStyle: string;
  rating: string;
  sessions: string;
  languages: string;
  matchedReason: string;
  distance?: string;
  interests?: string[];
  bestFor: string[];
}

// Warm anonymous listener profiles mapped to categories
const LISTENERS_DATA: Record<string, Listener[]> = {
  'I need someone to listen': [
    {
      name: 'Priya',
      role: 'Peer Listener',
      bio: 'I’m here to listen without judgement. You can share slowly and only what feels safe.',
      status: 'available',
      supportType: 'Active listening',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '25–34',
      profession: 'Working Professional',
      listeningStyle: 'Warm listener',
      rating: '97%',
      sessions: '140 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: 'You both selected emotional support, Hindi/Kannada, and yoga as a calm interest.',
      distance: 'Around 5 km away',
      interests: ['Walking', 'Music', 'Coffee Chats'],
      bestFor: ['Anxiety', 'Loneliness', 'Emotional overwhelm']
    },
    {
      name: 'Aarav',
      role: 'Peer Listener',
      bio: 'Here to listen quietly and support you with a gentle, patient space. Share what feels safe.',
      status: 'available',
      supportType: 'Quiet support',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-teal-100 text-teal-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      ageGroup: '18–24',
      profession: 'Student',
      listeningStyle: 'Gentle listener',
      rating: '96%',
      sessions: '110 listens',
      languages: 'English • Hindi',
      matchedReason: 'You both selected active listening, English, and quiet reading as a shared interest.',
      distance: 'Around 7 km away',
      interests: ['Cycling', 'Reading', 'Gaming'],
      bestFor: ['Quiet support', 'Stress', 'Anxiety']
    },
    {
      name: 'Leo',
      role: 'Peer Listener',
      bio: 'Offering a quiet, comforting presence. A warm cup of tea for your heavy thoughts today.',
      status: 'available',
      supportType: 'Quiet companionship',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      ageGroup: '35–44',
      profession: 'Caregiver',
      listeningStyle: 'Gentle listener',
      rating: '95%',
      sessions: '85 listens',
      languages: 'English • Spanish',
      matchedReason: 'You both selected patient presence, English/Spanish, and nature walks as an interest.',
      distance: 'Around 10 km away',
      interests: ['Nature Walks', 'Cooking', 'Gardening'],
      bestFor: ['Grief', 'Burnout', 'Caregiver support']
    }
  ],
  'I feel anxious': [
    {
      name: 'Maya',
      role: 'Peer Listener',
      bio: 'Providing gentle grounding support and slow conversations during racing moments.',
      status: 'available',
      supportType: 'Calming presence',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-orange-100 text-orange-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '18–24',
      profession: 'Student',
      listeningStyle: 'Calm listener',
      rating: '98%',
      sessions: '120 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: 'You both selected emotional support, Kannada/Hindi, and walking as an interest.',
      distance: 'Around 5 km away',
      interests: ['Music', 'Walking', 'Coffee Chats'],
      bestFor: ['Overthinking', 'Panic', 'Grounding']
    },
    {
      name: 'Nisha',
      role: 'Peer Listener',
      bio: 'Let’s take it one minute at a time. Slow breathing and quiet space. I am here for you.',
      status: 'soon',
      supportType: 'Anxiety grounding',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '25–34',
      profession: 'Caregiver',
      listeningStyle: 'Calm listener',
      rating: '99%',
      sessions: '95 listens',
      languages: 'English • Hindi',
      matchedReason: 'You both selected grounding conversations, English, and writing/journaling interests.',
      distance: 'Around 3 km away',
      interests: ['Tea brewing', 'Journaling', 'Poetry'],
      bestFor: ['Anxiety grounding', 'Worry', 'Panic']
    },
    {
      name: 'Leo',
      role: 'Peer Listener',
      bio: 'A soft, patient presence when everything feels too fast. You can set the pace.',
      status: 'available',
      supportType: 'Quiet support',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      ageGroup: '35–44',
      profession: 'Caregiver',
      listeningStyle: 'Gentle listener',
      rating: '95%',
      sessions: '85 listens',
      languages: 'English • Spanish',
      matchedReason: 'You both selected patient presence, English/Spanish, and nature walks as an interest.',
      distance: 'Around 10 km away',
      interests: ['Nature Walks', 'Cooking', 'Gardening'],
      bestFor: ['Grief', 'Burnout', 'Caregiver support']
    }
  ],
  'I feel lonely': [
    {
      name: 'Priya',
      role: 'Peer Listener',
      bio: 'I’m here to listen without judgement. You can share slowly and only what feels safe.',
      status: 'available',
      supportType: 'Active listening',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '25–34',
      profession: 'Working Professional',
      listeningStyle: 'Warm listener',
      rating: '97%',
      sessions: '140 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: 'You both selected emotional support, Hindi/Kannada, and yoga as a calm interest.',
      distance: 'Around 5 km away',
      interests: ['Walking', 'Music', 'Coffee Chats'],
      bestFor: ['Anxiety', 'Loneliness', 'Emotional overwhelm']
    },
    {
      name: 'Kabir',
      role: 'Peer Listener',
      bio: 'Let’s connect and talk about life, art, or anything else you love. I am here to share a chat.',
      status: 'available',
      supportType: 'Friendly company',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-indigo-100 text-indigo-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      ageGroup: '25–34',
      profession: 'Artist',
      listeningStyle: 'Patient listener',
      rating: '97%',
      sessions: '72 listens',
      languages: 'English • Hindi • Urdu',
      matchedReason: 'You both selected patient companionship, Hindi/Urdu, and music as a shared interest.',
      distance: 'Around 6 km away',
      interests: ['Painting', 'Music', 'Coffee Chats'],
      bestFor: ['Loneliness', 'Life changes', 'Sharing a chat']
    },
    {
      name: 'Aarav',
      role: 'Peer Listener',
      bio: 'Here to listen quietly and support you with a gentle, patient space. Share what feels safe.',
      status: 'available',
      supportType: 'Cozy companionship',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-teal-100 text-teal-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      ageGroup: '18–24',
      profession: 'Student',
      listeningStyle: 'Gentle listener',
      rating: '96%',
      sessions: '110 listens',
      languages: 'English • Hindi',
      matchedReason: 'You both selected active listening, English, and quiet reading as a shared interest.',
      distance: 'Around 7 km away',
      interests: ['Cycling', 'Reading', 'Gaming'],
      bestFor: ['Quiet support', 'Stress', 'Anxiety']
    }
  ],
  'I feel hurt': [
    {
      name: 'Nisha',
      role: 'Peer Listener',
      bio: 'Let’s take it one minute at a time. Slow breathing and quiet space. I am here for you.',
      status: 'soon',
      supportType: 'Anxiety grounding',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '25–34',
      profession: 'Caregiver',
      listeningStyle: 'Calm listener',
      rating: '99%',
      sessions: '95 listens',
      languages: 'English • Hindi',
      matchedReason: 'You both selected grounding conversations, English, and writing/journaling interests.',
      distance: 'Around 3 km away',
      interests: ['Tea brewing', 'Journaling', 'Poetry'],
      bestFor: ['Anxiety grounding', 'Worry', 'Panic']
    },
    {
      name: 'Maya',
      role: 'Peer Listener',
      bio: 'Providing gentle grounding support and slow conversations during racing moments.',
      status: 'available',
      supportType: 'Kind presence',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-orange-100 text-orange-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '18–24',
      profession: 'Student',
      listeningStyle: 'Calm listener',
      rating: '98%',
      sessions: '120 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: 'You both selected emotional support, Kannada/Hindi, and walking as an interest.',
      distance: 'Around 5 km away',
      interests: ['Music', 'Walking', 'Coffee Chats'],
      bestFor: ['Overthinking', 'Panic', 'Grounding']
    },
    {
      name: 'Leo',
      role: 'Peer Listener',
      bio: 'Offering a quiet, comforting presence. A warm cup of tea for your heavy thoughts today.',
      status: 'available',
      supportType: 'Quiet support',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-blue-100 text-blue-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      ageGroup: '35–44',
      profession: 'Caregiver',
      listeningStyle: 'Gentle listener',
      rating: '95%',
      sessions: '85 listens',
      languages: 'English • Spanish',
      matchedReason: 'You both selected patient presence, English/Spanish, and nature walks as an interest.',
      distance: 'Around 10 km away',
      interests: ['Nature Walks', 'Cooking', 'Gardening'],
      bestFor: ['Grief', 'Burnout', 'Caregiver support']
    }
  ],
  'I want guidance, not advice': [
    {
      name: 'Kabir',
      role: 'Peer Listener',
      bio: 'Let’s connect and talk about life, art, or anything else you love. I am here to share a chat.',
      status: 'available',
      supportType: 'Cozy company',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-indigo-100 text-indigo-700',
      actionText: 'Start Safe Chat',
      gender: 'Male',
      ageGroup: '25–34',
      profession: 'Artist',
      listeningStyle: 'Patient listener',
      rating: '97%',
      sessions: '72 listens',
      languages: 'English • Hindi • Urdu',
      matchedReason: 'You both selected patient companionship, Hindi/Urdu, and music as a shared interest.',
      distance: 'Around 6 km away',
      interests: ['Painting', 'Music', 'Coffee Chats'],
      bestFor: ['Loneliness', 'Life changes', 'Sharing a chat']
    },
    {
      name: 'Nisha',
      role: 'Peer Listener',
      bio: 'Let’s take it one minute at a time. Slow breathing and quiet space. I am here for you.',
      status: 'soon',
      supportType: 'Anxiety grounding',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-amber-100 text-amber-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '25–34',
      profession: 'Caregiver',
      listeningStyle: 'Calm listener',
      rating: '99%',
      sessions: '95 listens',
      languages: 'English • Hindi',
      matchedReason: 'You both selected grounding conversations, English, and writing/journaling interests.',
      distance: 'Around 3 km away',
      interests: ['Tea brewing', 'Journaling', 'Poetry'],
      bestFor: ['Anxiety grounding', 'Worry', 'Panic']
    },
    {
      name: 'Priya',
      role: 'Peer Listener',
      bio: 'I’m here to listen without judgement. You can share slowly and only what feels safe.',
      status: 'available',
      supportType: 'Active listening',
      boundary: 'Emotional support only. No diagnosis, prescriptions, or treatment advice.',
      iconBg: 'bg-emerald-100 text-emerald-700',
      actionText: 'Start Safe Chat',
      gender: 'Female',
      ageGroup: '25–34',
      profession: 'Working Professional',
      listeningStyle: 'Warm listener',
      rating: '97%',
      sessions: '140 listens',
      languages: 'English • Hindi • Kannada',
      matchedReason: 'You both selected emotional support, Hindi/Kannada, and yoga as a calm interest.',
      distance: 'Around 5 km away',
      interests: ['Walking', 'Music', 'Coffee Chats'],
      bestFor: ['Anxiety', 'Loneliness', 'Emotional overwhelm']
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
  onOpenCrisisScreen,
  onRequireProfileCompletion
}: ListenerMatchScreenProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string>('I need someone to listen');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeListener, setActiveListener] = useState<Listener | null>(null);
  const [viewingProfileListener, setViewingProfileListener] = useState<Listener | null>(null);
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(() => {
    const saved = localStorage.getItem('hopeheart_location_permission');
    return saved === 'true' ? true : saved === 'false' ? false : null;
  });
  
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
    if (activeFilter === 'Nearby') {
      if (hasLocationPermission !== true) {
        alert("Please enable 'Nearby Support Match' location matching to filter by nearby listeners.");
        setActiveFilter(null);
        return true;
      }
      return !!listener.distance;
    }
    if (activeFilter === 'Same interest') return !!listener.interests;
    if (activeFilter === 'Same language') return listener.languages.includes('English') || listener.languages.includes('Hindi');
    if (activeFilter === 'Available now') return listener.status === 'available';
    if (activeFilter === 'Calm listener') return listener.listeningStyle.toLowerCase().includes('calm');
    if (activeFilter === 'Caregiver') return listener.profession.toLowerCase().includes('caregiver');
    if (activeFilter === 'High trust score') {
      const score = parseFloat(listener.rating.replace('%', ''));
      return score >= 97;
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
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
          <div className="hh-header-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
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
                  <div key={msg.id} className="hh-surface border border-[#ECE6D9] p-3 rounded-2xl text-[11.5px] text-gray-500 font-semibold text-center leading-relaxed">
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
          <div className="hh-header-surface border-t p-3 space-y-2 shrink-0">
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

          {/* Nearby Support Match Section */}
          <div className="hh-surface rounded-[32px] p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-black text-[#2B1D12] text-[15px] flex items-center gap-2">
                <span>📍</span> Nearby Support Match
              </h3>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                Find people with similar interests, support needs, and preferred language near your area.
              </p>
            </div>

            {hasLocationPermission !== true && (
              <div className="bg-[#FFFDF9] border border-dashed border-[#FFE4D6] rounded-2xl p-4.5 space-y-3">
                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-gray-800 text-[13.5px] flex items-center gap-1.5">
                    📍 Nearby Support
                  </h4>
                  <p className="text-[12px] text-gray-600 font-semibold leading-relaxed">
                    HopeHeart can use your approximate location to show nearby peer listeners and support circles.
                  </p>
                  <p className="text-[10.5px] text-gray-400 font-semibold italic">
                    🛡️ We never show your exact location to others.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setHasLocationPermission(true);
                      localStorage.setItem('hopeheart_location_permission', 'true');
                    }}
                    type="button"
                    className="px-4 py-2 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12px] font-black cursor-pointer transition-all active:scale-95 shadow-xs"
                  >
                    Use Approximate Location
                  </button>
                  <button
                    onClick={() => {
                      setHasLocationPermission(false);
                      localStorage.setItem('hopeheart_location_permission', 'false');
                    }}
                    type="button"
                    className="px-4 py-2 bg-gray-50 border border-gray-205 text-gray-600 rounded-xl text-[12px] font-bold cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            )}
            {hasLocationPermission === true && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 text-[14px]">🟢</span>
                  <p className="text-[12px] font-bold text-emerald-800">
                    Approximate location matching enabled. Showing nearby members & circles.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setHasLocationPermission(false);
                    localStorage.setItem('hopeheart_location_permission', 'false');
                  }}
                  type="button"
                  className="text-[11px] font-bold text-gray-400 hover:text-gray-650 underline cursor-pointer"
                >
                  Disable
                </button>
              </div>
            )}
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
                  'Nearby',
                  'Same interest',
                  'Same language',
                  'Available now',
                  'Calm listener',
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
                          : 'bg-white border-gray-200 text-gray-555 hover:bg-gray-50'
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
                    <div className="col-span-full py-16 text-center space-y-2 hh-surface rounded-[32px] p-6">
                      <span className="text-3xl block">🔍</span>
                      <h4 className="font-display font-black text-gray-800 text-[16px]">
                        No active listeners match this filter
                      </h4>
                      <p className="text-[12px] text-gray-400 font-semibold max-w-xs mx-auto">
                        Try selecting another filter chip or changing your support need category.
                      </p>
                    </div>
                  ) : (
                    filteredListeners.map((listener, idx) => {
                      const genderIcon = listener.gender.toLowerCase() === 'female' ? '👩' : listener.gender.toLowerCase() === 'male' ? '👨' : '👤';
                      const availabilityText = listener.status === 'available' ? 'Available now' : 'Available soon';
                      const availabilityIcon = listener.status === 'available' ? '🟢' : '⏳';
                      return (
                        <motion.div
                          key={listener.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hh-surface rounded-[32px] p-5 flex flex-col justify-between space-y-4 transition-all"
                        >
                          <div className="space-y-4">
                            {/* Header: Avatar, Name, and Role label */}
                            <div className="flex items-center gap-3">
                              <ListenerAvatar name={listener.name} gender={listener.gender} />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-display font-black text-[#2B1D12] text-[16px] leading-tight truncate">
                                  {listener.name}
                                </h4>
                                <p className="text-[11px] font-bold text-[#FF7527] bg-[#FFF2EA] px-2 py-0.5 rounded-full inline-block mt-0.5 border border-[#FFE4D6]">
                                  {listener.role}
                                </p>
                              </div>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-2 text-[12.5px] font-semibold text-gray-655 pl-1">
                              <p className="flex items-center gap-2">
                                <span className="text-gray-400 text-[14px]">{genderIcon}</span>
                                <span>{listener.gender} • {listener.ageGroup}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-gray-400 text-[14px]">💼</span>
                                <span>{listener.profession}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-gray-400 text-[14px]">🤝</span>
                                <span>{listener.listeningStyle}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-gray-400 text-[14px]">🗣️</span>
                                <span>{listener.languages}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-[14px]">{availabilityIcon}</span>
                                <span>{availabilityText}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-gray-400 text-[14px]">🛡️</span>
                                <span>Trust Score {listener.rating}</span>
                              </p>
                            </div>

                            {/* Best For Tags Section */}
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                                Best for:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {listener.bestFor.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-[#FCFAF5] border border-gray-200 rounded-lg text-gray-600 text-[11px] font-bold"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* View Profile Button */}
                          <div className="pt-2">
                            <button
                              onClick={() => setViewingProfileListener(listener)}
                              type="button"
                              className="w-full py-2.5 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all text-center active:scale-98 shadow-xs"
                            >
                              View Profile
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nearby Support Circles Section */}
          {hasLocationPermission === true && (
            <div className="space-y-4">
              <div className="border-b border-[#EDE9DE] pb-2">
                <h3 className="font-display font-black text-[#2B1D12] text-[16px] flex items-center gap-2">
                  <span>👥</span> Nearby Support Circles
                </h3>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Support circles meet online with optional local in-person check-ins.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 space-y-3.5 shadow-3xs hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-black text-[#2B1D12] text-[15px]">
                        Anxiety Support Circle
                      </h4>
                      <p className="text-[11.5px] text-gray-450 font-bold mt-0.5">
                        Online + nearby optional
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#FFF2EA] text-[#FF7527] border border-[#FFE4D6] rounded-full text-[10px] font-extrabold uppercase shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 bg-[#FCFAF5] rounded-xl p-2.5">
                    <span className="flex items-center gap-1">📍 Around 3 km away</span>
                    <span className="flex items-center gap-1">👥 12 members</span>
                  </div>

                  <button
                    onClick={() => {
                      const action = () => alert("Joined Anxiety Support Circle. You will be notified of the next session.");
                      if (onRequireProfileCompletion) {
                        onRequireProfileCompletion(action);
                      } else {
                        action();
                      }
                    }}
                    type="button"
                    className="w-full py-2 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12px] font-bold transition-all cursor-pointer text-center"
                  >
                    Request to Join Circle
                  </button>
                </div>

                <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 space-y-3.5 shadow-3xs hover:shadow-xs transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-black text-[#2B1D12] text-[15px]">
                        Caregiver Support Circle
                      </h4>
                      <p className="text-[11.5px] text-[#E55D13] font-bold mt-0.5">
                        Private group
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 rounded-full text-[10px] font-extrabold uppercase shrink-0">
                      Private
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 bg-[#FCFAF5] rounded-xl p-2.5">
                    <span className="flex items-center gap-1">📍 Around 6 km away</span>
                    <span className="flex items-center gap-1">👥 8 members</span>
                  </div>

                  <button
                    onClick={() => alert("Request sent to the Caregiver Support Circle organizer. Privacy verification required.")}
                    type="button"
                    className="w-full py-2 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12px] font-bold transition-all cursor-pointer text-center"
                  >
                    Request to Join Circle
                  </button>
                </div>
              </div>
            </div>
          )}

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

      {/* Detail Profile Modal Overlay */}
      <AnimatePresence>
        {viewingProfileListener && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="hh-surface rounded-[32px] w-full max-w-md overflow-hidden relative z-50"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FCFAF5]">
                <div className="flex items-center gap-3">
                  <ListenerAvatar name={viewingProfileListener.name} gender={viewingProfileListener.gender} />
                  <div>
                    <h4 className="font-display font-black text-[#2B1D12] text-[18px]">
                      {viewingProfileListener.name}
                    </h4>
                    <p className="text-[12px] font-bold text-[#FF7527]">
                      {viewingProfileListener.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingProfileListener(null)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 cursor-pointer text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Full Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <span>👩</span>
                    <span>Gender: {viewingProfileListener.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🧑</span>
                    <span>Age Group: {viewingProfileListener.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span>💼</span>
                    <span>Role: {viewingProfileListener.profession}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span>🤝</span>
                    <span>Listening Style: {viewingProfileListener.listeningStyle}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span>🗣️</span>
                    <span>Languages: {viewingProfileListener.languages}</span>
                  </div>
                  {viewingProfileListener.interests && viewingProfileListener.interests.length > 0 && (
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <span>🌱</span>
                      <span>Interests: {viewingProfileListener.interests.join(' • ')}</span>
                    </div>
                  )}
                  {viewingProfileListener.distance && (
                    <div className="flex items-center gap-2 sm:col-span-2 text-[#FF7527] font-bold">
                      <span>📍</span>
                      <span>Nearby: {viewingProfileListener.distance}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>🟢</span>
                    <span>Availability: {viewingProfileListener.status === 'available' ? 'Available now' : 'Available soon'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <span>Trust Score: {viewingProfileListener.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💬</span>
                    <span>{viewingProfileListener.sessions}</span>
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-1.5">
                  <h5 className="text-[12px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
                    About:
                  </h5>
                  <p className="text-[13px] text-gray-650 bg-[#FCFAF5] border border-gray-100 rounded-2xl p-4 italic font-semibold leading-relaxed">
                    "{viewingProfileListener.bio}"
                  </p>
                </div>

                {/* Boundaries Section */}
                <div className="space-y-1.5">
                  <h5 className="text-[12px] font-mono font-extrabold text-red-500 uppercase tracking-wider">
                    Boundaries:
                  </h5>
                  <p className="text-[12.5px] text-red-800 bg-[#FFF8F8] border border-red-100 rounded-2xl p-4 font-semibold leading-relaxed">
                    "{viewingProfileListener.boundary}"
                  </p>
                </div>
              </div>

              {/* Actions footer */}
              <div className="p-5 border-t border-gray-100 bg-[#FCFAF5] space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      const action = () => {
                        setViewingProfileListener(null);
                        startChatFlow(viewingProfileListener);
                      };
                      if (onRequireProfileCompletion) {
                        onRequireProfileCompletion(action);
                      } else {
                        action();
                      }
                    }}
                    type="button"
                    className="py-3 px-2 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[13px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                  >
                    <span>💬</span> Chat
                  </button>
                  <button
                    disabled
                    type="button"
                    className="py-3 px-2 bg-gray-50 border border-gray-200 text-gray-400 rounded-xl flex items-center justify-center gap-1 text-[13px] font-bold cursor-not-allowed"
                    title="Call unlocked after trust is built"
                  >
                    <span>🔒</span> Call
                  </button>
                  <button
                    disabled
                    type="button"
                    className="py-3 px-2 bg-gray-50 border border-gray-200 text-gray-400 rounded-xl flex items-center justify-center gap-1 text-[13px] font-bold cursor-not-allowed"
                    title="Video unlocked after trust is built"
                  >
                    <span>🔒</span> Video
                  </button>
                </div>
                <p className="text-[10.5px] text-gray-400 text-center font-semibold">
                  Call and video unlock after trust is built.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
