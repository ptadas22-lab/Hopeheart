import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FILTER_CHIPS = [
  'All Rooms',
  'Anxiety',
  'Loneliness',
  'Caregivers',
  'Parkinson’s',
  'Emotional Recovery',
  'Small Wins',
  'Nearby'
];

function RoomIllustration({ type }: { type: 'anxiety' | 'emotional-recovery' | 'loneliness' | 'parkinsons' | 'caregiver' | 'small-wins' }) {
  return (
    <div className="w-20 h-16 flex items-center justify-center relative overflow-visible">
      {type === 'anxiety' && (
        <svg width="80" height="65" viewBox="0 0 120 100" className="overflow-visible">
          <motion.circle 
            cx="80" cy="45" r="24" 
            fill="none" stroke="#FF7527" strokeWidth="2" opacity="0.3"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <g transform="translate(15, 15)">
            <path d="M 10,70 Q 30,42 50,70 Z" fill="#E2DCD0" stroke="#2B1D12" strokeWidth="2.2" />
            <circle cx="30" cy="30" r="14" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2.2" />
            <path d="M 24,30 Q 27,28 30,30" fill="none" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 34,30 Q 37,28 40,30" fill="none" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 42,55 L 48,50" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
            <rect x="46" y="44" width="8" height="14" rx="1.5" fill="#333" stroke="#2B1D12" strokeWidth="1.2" />
          </g>
        </svg>
      )}

      {type === 'emotional-recovery' && (
        <svg width="80" height="65" viewBox="0 0 120 100" className="overflow-visible">
          <g transform="translate(15, 18)">
            <path d="M 10,70 Q 30,42 50,70 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="2.2" />
            <circle cx="30" cy="30" r="14" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2.2" />
            <path d="M 24,30 Q 27,28 30,30" fill="none" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 34,30 Q 37,28 40,30" fill="none" stroke="#2B1D12" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <g transform="translate(80, 35)">
            <circle cx="10" cy="10" r="12" fill="#FFE3D1" opacity="0.4" />
            <path d="M 10,35 L 10,18" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
            <path d="M 10,22 Q 18,15 16,24" fill="#7BA655" stroke="#2B1D12" strokeWidth="1.5" />
            <path d="M 10,26 Q 2,20 4,28" fill="#7BA655" stroke="#2B1D12" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {type === 'loneliness' && (
        <svg width="80" height="65" viewBox="0 0 120 100" className="overflow-visible">
          <g transform="translate(10, 25) scale(0.85)">
            <path d="M 5,70 Q 22,42 40,70 Z" fill="#dddbd0" stroke="#2B1D12" strokeWidth="2.2" />
            <circle cx="22" cy="30" r="12" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2.2" />
          </g>
          <g transform="translate(70, 25) scale(0.85)">
            <path d="M 5,70 Q 22,42 40,70 Z" fill="#ffe3d1" stroke="#2B1D12" strokeWidth="2.2" />
            <circle cx="22" cy="30" r="12" fill="#dddbd0" stroke="#2B1D12" strokeWidth="2.2" />
          </g>
          <motion.g
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          >
            <path d="M 45,25 H 75 Q 82,25 82,32 V 42 Q 82,49 75,49 H 58 L 50,56 V 49 H 45 Q 38,49 38,42 V 32 Q 38,25 45,25 Z" fill="#FFF2EA" stroke="#FF7527" strokeWidth="1.8" />
            <line x1="48" y1="37" x2="72" y2="37" stroke="#FF7527" strokeWidth="1.5" strokeDasharray="2 2" />
          </motion.g>
        </svg>
      )}

      {type === 'parkinsons' && (
        <svg width="80" height="65" viewBox="0 0 120 100" className="overflow-visible">
          <g transform="translate(15, 15)">
            <g transform="translate(0, 0)">
              <path d="M 5,75 Q 22,48 40,75 Z" fill="#7BA655" stroke="#2B1D12" strokeWidth="2.2" />
              <circle cx="22" cy="35" r="12" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2.2" />
              <path d="M 32,55 Q 45,52 48,58" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g transform="translate(38, 3)">
              <path d="M 5,72 Q 22,48 40,72 Z" fill="#dddbd0" stroke="#2B1D12" strokeWidth="2.2" />
              <circle cx="22" cy="32" r="12" fill="#FFF2EA" stroke="#2B1D12" strokeWidth="2.2" />
              <path d="M 12,25 C 12,14 32,14 32,25" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
              <path d="M 32,45 L 37,72" stroke="#8A6E58" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      )}

      {type === 'caregiver' && (
        <svg width="80" height="65" viewBox="0 0 120 100" className="overflow-visible">
          <g transform="translate(15, 15)">
            <g transform="translate(5, 5)">
              <path d="M 5,70 Q 22,42 40,70 Z" fill="#7BA655" stroke="#2B1D12" strokeWidth="2.2" />
              <circle cx="22" cy="30" r="12" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2.2" />
              <path d="M 35,46 Q 52,42 56,48" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g transform="translate(45, 10)">
              <path d="M 5,65 Q 20,40 35,65 Z" fill="#FFF2EA" stroke="#2B1D12" strokeWidth="2.2" />
              <circle cx="20" cy="26" r="11" fill="#FFE3D1" stroke="#2B1D12" strokeWidth="2.2" />
            </g>
          </g>
        </svg>
      )}

      {type === 'small-wins' && (
        <svg width="80" height="65" viewBox="0 0 120 100" className="overflow-visible">
          <rect x="65" y="20" width="35" height="50" rx="3" fill="#F0ECE1" stroke="#2B1D12" strokeWidth="2" />
          <line x1="72" y1="35" x2="93" y2="35" stroke="#BAAE9C" strokeWidth="1.5" />
          <line x1="72" y1="48" x2="93" y2="48" stroke="#BAAE9C" strokeWidth="1.5" />
          <line x1="72" y1="60" x2="85" y2="60" stroke="#BAAE9C" strokeWidth="1.5" />
          <g transform="translate(10, 20)">
            <path d="M 5,70 Q 25,42 45,70 Z" fill="#ffa552" stroke="#2B1D12" strokeWidth="2.2" />
            <circle cx="25" cy="30" r="12" fill="#FCE5D6" stroke="#2B1D12" strokeWidth="2.2" />
            <path d="M 38,46 Q 55,38 58,40" fill="none" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
          </g>
          <motion.path
            d="M 68,36 L 70,30 L 72,36 L 78,36 L 73,40 L 75,46 L 70,42 L 65,46 L 67,40 L 62,36 Z"
            fill="#FF7527"
            stroke="#2B1D12"
            strokeWidth="1.2"
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ transformOrigin: "70px 38px" }}
          />
        </svg>
      )}
    </div>
  );
}

interface SupportRoomsScreenProps {
  onBack: () => void;
  onOpenModerationBlock?: () => void; // Trigger for Screen 21
}

interface PostItem {
  id: string;
  sender: string;
  content: string;
  supportCount: number;
  repliesCount: number;
  type?: 'celebrate' | 'support';
  hasCelebrated?: boolean;
}

interface RoomCard {
  id: string;
  name: string;
  description: string;
  category: string;
  activeCount: number;
  emoji: string;
  accent: string;
  rule: string;
  defaultPosts: PostItem[];
  roomType: string;
  languages: string[];
  privacyStatus: string;
  moderationStatus: string;
  isNearby?: boolean;
  distance?: string;
  illustrationType: 'anxiety' | 'emotional-recovery' | 'loneliness' | 'parkinsons' | 'caregiver' | 'small-wins';
}

const SUPPORT_ROOMS_DATA: RoomCard[] = [
  {
    id: 'anxiety',
    name: 'Anxiety Support',
    category: 'Anxiety',
    activeCount: 48,
    emoji: '🧘',
    accent: 'bg-amber-50 border-amber-150',
    rule: 'Focus on calming breaths. Avoid prescribing tranquilizers or medical diagnoses.',
    description: 'For worry, panic, fear, and overthinking.',
    roomType: 'Peer support',
    languages: ['English', 'Hindi'],
    privacyStatus: 'Anonymous room',
    moderationStatus: 'AI moderated',
    isNearby: true,
    distance: '3 km away',
    illustrationType: 'anxiety',
    defaultPosts: [
      { id: 'anx-1', sender: 'Voice11', content: 'Feeling some chest tension tonight. Deep breathing helps slow my heart rate.', supportCount: 4, repliesCount: 1 },
      { id: 'anx-2', sender: 'Voice81', content: 'Remember, thoughts are just clouds. They pass.', supportCount: 8, repliesCount: 3 }
    ]
  },
  {
    id: 'emotional-recovery',
    name: 'Emotional Recovery',
    category: 'Emotional Recovery',
    activeCount: 18,
    emoji: '🌱',
    accent: 'bg-orange-50 border-orange-150',
    rule: 'Respect boundaries and triggers. We support recovery at your own pace.',
    description: 'For healing, life changes, grief, and recovering emotional strength.',
    roomType: 'Peer support',
    languages: ['English', 'Spanish'],
    privacyStatus: 'Safe sharing',
    moderationStatus: 'AI moderated',
    isNearby: false,
    illustrationType: 'emotional-recovery',
    defaultPosts: [
      { id: 'tr-1', sender: 'Voice33', content: 'Today I acknowledged my trigger without spiral. That is a millimeter gain.', supportCount: 12, repliesCount: 4 }
    ]
  },
  {
    id: 'loneliness',
    name: 'Loneliness Circle',
    category: 'Loneliness',
    activeCount: 56,
    emoji: '🕯️',
    accent: 'bg-blue-50 border-blue-150',
    rule: 'Listen with kindness and empathy. Lived experiences only.',
    description: 'For people who feel unseen, isolated, or emotionally distant.',
    roomType: 'Silent Companionship',
    languages: ['English', 'Kannada'],
    privacyStatus: 'Anonymous room',
    moderationStatus: 'AI moderated',
    isNearby: false,
    illustrationType: 'loneliness',
    defaultPosts: [
      { id: 'l1', sender: 'Voice21', content: 'I feel lonely today even though people are around me. I just want someone to understand.', supportCount: 14, repliesCount: 2 },
      { id: 'l2', sender: 'Voice88', content: 'I understand this feeling. You are not alone here.', supportCount: 19, repliesCount: 5 },
      { id: 'l3', sender: 'Voice52', content: 'Today I stepped outside for 10 minutes. It felt small, but I am proud of it.', supportCount: 22, repliesCount: 0, type: 'celebrate' }
    ]
  },
  {
    id: 'parkinsons',
    name: 'Living with Parkinson’s',
    category: 'Parkinson’s',
    activeCount: 29,
    emoji: '🤝',
    accent: 'bg-purple-50 border-purple-150',
    rule: 'Lived Parkinson\'s experience sharing. Avoid prescribing medication or dosages.',
    description: 'For Parkinson\'s emotional comfort and caregiver support.',
    roomType: 'Peer support',
    languages: ['English', 'Hindi'],
    privacyStatus: 'Safe space',
    moderationStatus: 'AI moderated',
    isNearby: false,
    illustrationType: 'parkinsons',
    defaultPosts: [
      { id: 'ch-1', sender: 'Voice9', content: 'Sharing love to fellow caregivers and friends managing tremors today.', supportCount: 9, repliesCount: 2 }
    ]
  },
  {
    id: 'caregiver',
    name: 'Caregiver Corner',
    category: 'Caregivers',
    activeCount: 23,
    emoji: '🛡️',
    accent: 'bg-emerald-50 border-emerald-150',
    rule: 'Respect caregiver exhaustion. Share mutual encouragement and rest reminders.',
    description: 'For family members and caregivers who feel emotionally tired.',
    roomType: 'Helper Haven',
    languages: ['English', 'Telugu'],
    privacyStatus: 'Anonymous room',
    moderationStatus: 'AI moderated',
    isNearby: true,
    distance: '5 km away',
    illustrationType: 'caregiver',
    defaultPosts: [
      { id: 'ca-1', sender: 'Voice70', content: 'We cannot pour support from a barren vessel. Remember to rest.', supportCount: 11, repliesCount: 1 }
    ]
  },
  {
    id: 'smallwins',
    name: 'Small Wins Only',
    category: 'Small Wins',
    activeCount: 88,
    emoji: '🥳',
    accent: 'bg-yellow-50 border-yellow-150',
    rule: 'Celebrate tiny steps and positive moments. Lived experiences only.',
    description: 'Share one small step, one brave moment, or one hopeful thing from today.',
    roomType: 'Celebration',
    languages: ['English'],
    privacyStatus: 'Open room',
    moderationStatus: 'AI moderated',
    isNearby: false,
    illustrationType: 'small-wins',
    defaultPosts: [
      { id: 'sw-1', sender: 'Voice5', content: 'Finally watered my plants today after a heavy week. They look glad.', supportCount: 30, repliesCount: 2, type: 'celebrate' }
    ]
  }
];

export default function SupportRoomsScreen({ onBack, onOpenModerationBlock }: SupportRoomsScreenProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomCard | null>(null);
  const [roomPosts, setRoomPosts] = useState<Record<string, PostItem[]>>({});
  const [postInput, setPostInput] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All Rooms');

  const navigateToRoom = (room: RoomCard) => {
    setSelectedRoom(room);
    // Initialize room posts if not loaded
    if (!roomPosts[room.id]) {
      setRoomPosts(prev => ({
        ...prev,
        [room.id]: room.defaultPosts
      }));
    }
  };

  const handleSupportClick = (postId: string) => {
    if (!selectedRoom) return;
    const roomId = selectedRoom.id;
    setRoomPosts(prev => {
      const posts = prev[roomId] || [];
      return {
        ...prev,
        [roomId]: posts.map(p => {
          if (p.id === postId) {
            return { ...p, supportCount: p.supportCount + 1 };
          }
          return p;
        })
      };
    });
  };

  const handleCelebrateClick = (postId: string) => {
    if (!selectedRoom) return;
    const roomId = selectedRoom.id;
    setRoomPosts(prev => {
      const posts = prev[roomId] || [];
      return {
        ...prev,
        [roomId]: posts.map(p => {
          if (p.id === postId) {
            return { 
              ...p, 
              supportCount: p.supportCount + 1, 
              hasCelebrated: true 
            };
          }
          return p;
        })
      };
    });
  };

  const handlePostThoughtSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !postInput.trim()) return;

    // Direct AI prescription scan simulation
    const lower = postInput.toLowerCase();
    const rxKeywords = ['mg', 'pfizer', 'paracetamol', 'dosage', 'prescription', 'doctor says', 'cure', 'diagnose', 'take pill', 'xanax', 'prozac'];
    const blocksText = rxKeywords.some(kw => lower.includes(kw));

    if (blocksText) {
      if (onOpenModerationBlock) {
        onOpenModerationBlock();
        return;
      }
      alert("⚠️ HopeHeart AI Alert: Medical advice, prescriptions, or treatments detected. Please post emotional support only.");
      return;
    }

    const roomId = selectedRoom.id;
    const newPost: PostItem = {
      id: Date.now().toString(),
      sender: 'Voice47 (You)',
      content: postInput.trim(),
      supportCount: 0,
      repliesCount: 0
    };

    setRoomPosts(prev => ({
      ...prev,
      [roomId]: [newPost, ...(prev[roomId] || [])]
    }));

    setPostInput('');
  };

  const currentRoomPosts = selectedRoom ? (roomPosts[selectedRoom.id] || selectedRoom.defaultPosts) : [];

  const filteredRooms = SUPPORT_ROOMS_DATA.filter((room) => {
    if (activeFilter === 'All Rooms') return true;
    if (activeFilter === 'Nearby') return room.isNearby;
    
    const filterLower = activeFilter.toLowerCase();
    if (filterLower === 'anxiety') return room.id === 'anxiety';
    if (filterLower === 'loneliness') return room.id === 'loneliness';
    if (filterLower === 'caregivers') return room.id === 'caregiver';
    if (filterLower === 'parkinson’s') return room.id === 'parkinsons';
    if (filterLower === 'emotional recovery') return room.id === 'emotional-recovery';
    if (filterLower === 'small wins') return room.id === 'smallwins';
    
    return true;
  });

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={selectedRoom ? () => setSelectedRoom(null) : onBack}
          id="btn-back-rooms-screen"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[15px] sm:text-[16px] uppercase tracking-tight">
          {selectedRoom ? selectedRoom.name : 'Support Rooms'}
        </span>
        <span className="text-[20px] select-none">🛋️</span>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 8: SUPPORT ROOMS SCREEN */}
          {!selectedRoom ? (
            <motion.div
              key="rooms-grid"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center md:text-left space-y-1">
                <h2 className="font-display font-black text-[#2B1D12] text-[22px] md:text-[28px] tracking-tight">
                  Support Rooms
                </h2>
                <p className="text-[14px] text-gray-500 font-semibold">
                  Choose a safe room to share, listen, or quietly feel less alone.
                </p>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2 py-1 justify-center md:justify-start">
                {FILTER_CHIPS.map((chip) => {
                  const isActive = activeFilter === chip;
                  return (
                    <button
                      key={chip}
                      onClick={() => setActiveFilter(chip)}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-display font-bold border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#1E1E1A] text-white border-[#1E1E1A] shadow-xs'
                          : 'bg-[#FCFAF5] text-gray-655 border-gray-200 hover:bg-[#FAF6EE] hover:border-gray-300'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRooms.map((room) => {
                  const liveCount = room.activeCount + ((roomPosts[room.id] || []).length - room.defaultPosts.length);
                  return (
                    <div 
                      key={room.id}
                      className="bg-white border border-[#EDE9DE] hover:border-orange-300 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="bg-[#FCFAF5] border border-gray-100 rounded-2xl p-1 shrink-0">
                            <RoomIllustration type={room.illustrationType} />
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[10.5px] font-bold text-green-700 bg-green-50/70 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                              {liveCount} active now
                            </span>
                            {room.isNearby && room.distance && (
                              <span className="text-[9.5px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                📍 {room.distance}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9.5px] font-mono font-bold text-[#FF7527] bg-[#FFF2EA] px-2 py-0.5 rounded-md uppercase">
                            {room.roomType}
                          </span>
                          <h3 className="font-display font-black text-[#2b1d12] text-[17px] pt-1">
                            {room.name}
                          </h3>
                          <p className="text-[12px] text-gray-500 leading-relaxed font-semibold">
                            {room.description}
                          </p>
                        </div>

                        {/* Room metadata details */}
                        <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100 text-[11px] font-semibold text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <span>🌐</span>
                            <span className="truncate">{room.languages.join(' • ')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>🔒</span>
                            <span className="truncate">{room.privacyStatus}</span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2">
                            <span>🛡️</span>
                            <span>{room.moderationStatus}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigateToRoom(room)}
                        className="w-full py-2.5 bg-[#FAF7F0] hover:bg-[#FF7527] border hover:border-[#FF7527] text-gray-700 hover:text-white rounded-xl text-[12.5px] font-display font-black transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                      >
                        Enter Room →
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Safety Note Footer */}
              <div className="bg-[#FEFAF0] border border-[#F3E2C4] p-4 rounded-2xl text-center shadow-xs">
                <p className="text-[11.5px] text-gray-600 font-semibold leading-relaxed">
                  ⚠️ <strong>Rooms are for emotional support only.</strong> Please do not share prescriptions, dosage advice, diagnosis, or personal contact details.
                </p>
              </div>
            </motion.div>
          ) : (
            
            /* SCREEN 9: ROOM DETAIL SCREEN */
            <motion.div
              key="room-detail"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
              {/* Back to Rooms badge */}
              <button 
                onClick={() => setSelectedRoom(null)}
                className="text-xs font-mono font-bold text-[#FF7527] hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Back to Support Rooms list
              </button>

              {/* Room Banner cards */}
              <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 md:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF2EA] flex items-center justify-center text-[26px]">
                    {selectedRoom.emoji}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#FF7527] uppercase tracking-wider block">
                      SUPPORT ROOM STREAM
                    </span>
                    <h3 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[22px]">
                      {selectedRoom.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-[13px] text-gray-600 font-semibold leading-relaxed">
                  <strong>Description:</strong> {selectedRoom.description}
                </p>

                {/* Specific Room Active Rule banner */}
                <div className="bg-[#FFF2EA] border border-[#FFE3D1] p-3.5 rounded-2xl text-[12px] text-orange-950 font-bold leading-normal">
                  📍 <strong>Room Rule:</strong> {selectedRoom.rule}
                </div>
              </div>

              {/* Posts list */}
              <div className="space-y-3.5">
                {currentRoomPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="p-4 bg-white border border-[#EDE9DE] rounded-2xl shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400 font-extrabold">
                        👤 {post.sender}
                      </span>
                    </div>

                    <p className="text-[13px] text-gray-750 font-semibold leading-relaxed select-all">
                      {post.content}
                    </p>

                    {/* Specific Post action triggers */}
                    <div className="flex justify-between items-center pt-1 border-t border-gray-50 text-[12px]">
                      <div className="flex gap-2">
                        {/* Celebrate Button option */}
                        {(post.type === 'celebrate' || selectedRoom.id === 'smallwins') ? (
                          <button
                            onClick={() => handleCelebrateClick(post.id)}
                            className={`px-3 py-1.5 rounded-lg font-display font-black border transition-colors cursor-pointer flex items-center gap-1 ${
                              post.hasCelebrated 
                                ? 'bg-yellow-100 text-yellow-850 border-yellow-200' 
                                : 'bg-yellow-50/50 text-yellow-750 hover:bg-yellow-100 border-yellow-100'
                            }`}
                          >
                            🥳 {post.hasCelebrated ? 'Celebrated!' : 'Celebrate'} ({post.supportCount})
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleSupportClick(post.id)}
                          className="px-3 py-1.5 bg-orange-50/50 hover:bg-[#FFF2EA] border border-orange-100 hover:border-[#FF7527] text-[#FF7527] font-display font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          ❤️ Send Support ({post.supportCount})
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          const reply = prompt("Send a kind anonymous reply:");
                          if (reply && reply.trim()) {
                            alert("Thank you! Your gentle companion reply was delivered anonymously.");
                          }
                        }}
                        className="text-gray-500 hover:text-[#FF7527] font-display font-bold cursor-pointer"
                      >
                        📬 Reply Kindly
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Post Form */}
              <div className="bg-white p-4 border border-[#ECE6D9] rounded-2.5xl space-y-2">
                <form onSubmit={handlePostThoughtSubmit} className="flex gap-2.5">
                  <input
                    type="text"
                    value={postInput}
                    onChange={(e) => setPostInput(e.target.value)}
                    placeholder="Share support, not prescriptions."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-[13px] font-semibold bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl whitespace-nowrap cursor-pointer transition-colors"
                  >
                    Post Safely
                  </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 font-bold italic uppercase tracking-wider">
                  ⚠️ AI Filter Alert: No prescriptions or treatment guidance allowed. Lived experiences only.
                </p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
export { SupportRoomsScreen };
