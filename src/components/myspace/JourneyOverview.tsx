import React, { useEffect, useState } from 'react';

interface JourneyOverviewProps {
  checkinCount: number;
  journalCount: number;
  favoriteCount: number;
}

export default function JourneyOverview({
  checkinCount,
  journalCount,
  favoriteCount
}: JourneyOverviewProps) {
  const [daysCount, setDaysCount] = useState(1);

  useEffect(() => {
    const key = 'hopeheart_installation_date';
    let installed = localStorage.getItem(key);
    const today = new Date();
    
    if (!installed) {
      installed = today.toISOString();
      localStorage.setItem(key, installed);
    }

    try {
      const installDate = new Date(installed);
      const diffTime = Math.abs(today.getTime() - installDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setDaysCount(diffDays);
    } catch (e) {
      setDaysCount(1);
    }
  }, []);

  const items = [
    { label: 'Days Active', value: daysCount, icon: '🌱', bg: 'bg-[#E5F5E8] text-[#134D21]' },
    { label: 'Check-ins', value: checkinCount, icon: '❤️', bg: 'bg-[#FEF2F2] text-[#991B1B]' },
    { label: 'Journal Logs', value: journalCount, icon: '📖', bg: 'bg-[#EEF3FA] text-[#1E3A8A]' },
    { label: 'Favorites', value: favoriteCount, icon: '⭐', bg: 'bg-[#FFF2D8] text-[#78350F]' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none text-left">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white border border-[#EDE9DE] rounded-2xl p-4 shadow-3xs flex flex-col justify-between min-h-[96px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-display font-black text-gray-500 tracking-tight">
              {item.label}
            </span>
            <span className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center text-[15px] shrink-0 font-bold select-none`}>
              {item.icon}
            </span>
          </div>
          <span className="block text-[24px] font-display font-black text-[#2B1D12] pt-2">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
