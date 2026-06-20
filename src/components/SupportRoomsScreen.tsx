import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
}

const SUPPORT_ROOMS_DATA: RoomCard[] = [
  {
    id: 'anxiety',
    name: 'Anxiety Support',
    category: 'Coping Support',
    activeCount: 42,
    emoji: '🧘',
    accent: 'bg-amber-50 border-amber-150',
    rule: 'Focus on calming breaths. Avoid prescribing tranquilizers or medical diagnoses.',
    description: 'For worry, panic, fear, and overthinking.',
    defaultPosts: [
      { id: 'anx-1', sender: 'Voice11', content: 'Feeling some chest tension tonight. Deep breathing helps slow my heart rate.', supportCount: 4, repliesCount: 1 },
      { id: 'anx-2', sender: 'Voice81', content: 'Remember, thoughts are just clouds. They pass.', supportCount: 8, repliesCount: 3 }
    ]
  },
  {
    id: 'trauma',
    name: 'Trauma Healing',
    category: 'Safe Sharing',
    activeCount: 18,
    emoji: '🌱',
    accent: 'bg-orange-50 border-orange-150',
    rule: 'Respect triggers. Do not compare therapies or claim cures.',
    description: 'For triggers, painful memories, and emotional safety.',
    defaultPosts: [
      { id: 'tr-1', sender: 'Voice33', content: 'Today I acknowledged my trigger without spiral. That is a millimeter gain.', supportCount: 12, repliesCount: 4 }
    ]
  },
  {
    id: 'loneliness',
    name: 'Loneliness Circle',
    category: 'Silent Companionship',
    activeCount: 56,
    emoji: '🕯️',
    accent: 'bg-blue-50 border-blue-150',
    rule: 'Listen with kindness. Do not diagnose, prescribe, or judge.',
    description: 'For people who feel unseen, isolated, or emotionally distant.',
    defaultPosts: [
      { id: 'l1', sender: 'Voice21', content: 'I feel lonely today even though people are around me. I just want someone to understand.', supportCount: 14, repliesCount: 2 },
      { id: 'l2', sender: 'Voice88', content: 'I understand this feeling. You are not alone here.', supportCount: 19, repliesCount: 5 },
      { id: 'l3', sender: 'Voice52', content: 'Today I stepped outside for 10 minutes. It felt small, but I am proud of it.', supportCount: 22, repliesCount: 0, type: 'celebrate' }
    ]
  },
  {
    id: 'chronic',
    name: 'Parkinson’s & Chronic Illness',
    category: 'Allies & Fighters',
    activeCount: 29,
    emoji: '🤝',
    accent: 'bg-purple-50 border-purple-150',
    rule: 'Lived experience only. No professional therapist advice, prescription medication dosage claims.',
    description: 'For people living with long-term health struggles who need emotional support.',
    defaultPosts: [
      { id: 'ch-1', sender: 'Voice9', content: 'Sharing love to fellow caregivers and friends managing tremors today.', supportCount: 9, repliesCount: 2 }
    ]
  },
  {
    id: 'caregiver',
    name: 'Caregiver Corner',
    category: 'Helper Haven',
    activeCount: 23,
    emoji: '🛡️',
    accent: 'bg-emerald-50 border-emerald-150',
    rule: 'Respect exhaustion. No medicine advice or medical prescriptions.',
    description: 'For family members and caregivers who feel emotionally tired.',
    defaultPosts: [
      { id: 'ca-1', sender: 'Voice70', content: 'We cannot pour support from a barren vessel. Remember to rest.', supportCount: 11, repliesCount: 1 }
    ]
  },
  {
    id: 'smallwins',
    name: 'Small Wins Only',
    category: 'Celebration',
    activeCount: 88,
    emoji: '🥳',
    accent: 'bg-yellow-50 border-yellow-150',
    rule: 'Cheer each other on. No cynical judgment or diagnostic labels.',
    description: 'Share one small step, one brave moment, or one hopeful thing from today.',
    defaultPosts: [
      { id: 'sw-1', sender: 'Voice5', content: 'Finally watered my plants today after a heavy week. They look glad.', supportCount: 30, repliesCount: 2, type: 'celebrate' }
    ]
  }
];

export default function SupportRoomsScreen({ onBack, onOpenModerationBlock }: SupportRoomsScreenProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomCard | null>(null);
  const [roomPosts, setRoomPosts] = useState<Record<string, PostItem[]>>({});
  const [postInput, setPostInput] = useState<string>('');

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

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none w-full">
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
                  Choose a room where you feel safe. Share feelings, support caregivers, or celebrate wins.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {SUPPORT_ROOMS_DATA.map((room) => {
                  const liveCount = room.activeCount + ((roomPosts[room.id] || []).length - room.defaultPosts.length);
                  return (
                    <div 
                      key={room.id}
                      className="bg-white border border-[#EDE9DE] hover:border-orange-300 rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[20px] select-none">
                            {room.emoji}
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-[#FAF7F0] text-gray-500 border border-gray-100 px-2 py-0.5 rounded-lg uppercase">
                            ❤️ {liveCount} Active
                          </span>
                        </div>
                        <h3 className="font-display font-extrabold text-[#2b1d12] text-[16px]">
                          {room.name}
                        </h3>
                        <p className="text-[12px] text-gray-500 leading-relaxed font-semibold">
                          {room.description}
                        </p>
                      </div>

                      <button
                        onClick={() => navigateToRoom(room)}
                        className="w-full py-2.5 bg-[#FAF7F0] hover:bg-[#FF7527] border hover:border-[#FF7527] text-gray-700 hover:text-white rounded-xl text-[12.5px] font-display font-black transition-all cursor-pointer text-center"
                      >
                        Join Room
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Verified Clinical Notice footer */}
              <div className="bg-[#FAF7F0] border border-[#ECE6D9] p-4 rounded-2xl text-center shadow-inner">
                <p className="text-[11.5px] text-gray-500 font-semibold">
                  🛡️ <strong>Footer Note:</strong> Support rooms are for emotional support only. They are not medical treatment spaces. AI protects this space.
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
