import React, { useState, useEffect } from 'react';

interface SupportRoom {
  id: string;
  title: string;
  desc: string;
  activeCount: number;
  icon: string;
}

const ROOMS: SupportRoom[] = [
  { id: 'anxiety', title: 'Anxiety Support', desc: 'A calm space to share coping strategies and quiet your thoughts.', activeCount: 142, icon: '😟' },
  { id: 'stress', title: 'Stress & Burnout', desc: 'Slowing down, managing pressure, and finding daily recovery.', activeCount: 89, icon: '🌿' },
  { id: 'grief', title: 'Grief & Loss', desc: 'A safe place to share memory logs, sorrow, and healing steps.', activeCount: 34, icon: '🌧️' },
  { id: 'relationships', title: 'Relationships', desc: 'Connecting with empathy, boundary settings, and kindness.', activeCount: 76, icon: '🤝' },
  { id: 'work', title: 'Work Pressure', desc: 'Anchor balance, work stress, and career confidence.', activeCount: 110, icon: '💼' },
  { id: 'students', title: 'Students Circle', desc: 'Managing exam panic, assignments, and school-life balance.', activeCount: 95, icon: '📚' },
  { id: 'parents', title: 'Parents Support', desc: 'Gentle parenting reflections and sharing daily patience tips.', activeCount: 52, icon: '🏡' },
  { id: 'self-growth', title: 'Self Growth', desc: 'Cultivating healthy habits, self-kindness, and progress.', activeCount: 124, icon: '🌱' }
];

export default function SupportRooms() {
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);

  useEffect(() => {
    const key = 'hopeheart_joined_rooms';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setJoinedRooms(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleToggleJoin = (id: string) => {
    setJoinedRooms((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('hopeheart_joined_rooms', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Support Rooms
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROOMS.map((room) => {
          const isJoined = joinedRooms.includes(room.id);
          return (
            <div
              key={room.id}
              className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[148px] hover:border-[#FFB27A]/35 transition-all"
            >
              <div className="flex gap-3.5">
                <span className="w-11 h-11 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-center text-[22px] shrink-0 select-none">
                  {room.icon}
                </span>
                <div className="space-y-1 min-w-0">
                  <span className="block font-display font-black text-[#2B1D12] text-[15.5px]">
                    {room.title}
                  </span>
                  <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed line-clamp-2">
                    {room.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-50 mt-3 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  <span>{room.activeCount} online</span>
                </span>
                
                <button
                  onClick={() => handleToggleJoin(room.id)}
                  type="button"
                  className={`py-1.5 px-4 rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95 border ${
                    isJoined
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-[#FF7527] border-[#FF7527] text-white hover:bg-[#E96630]'
                  }`}
                >
                  {isJoined ? '✓ Joined' : 'Join'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
