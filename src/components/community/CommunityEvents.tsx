import React, { useState } from 'react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  icon: string;
}

const EVENTS: EventItem[] = [
  { id: 'e-1', title: 'Meditation Session', date: 'Wednesday, Aug 12', time: '10:00 AM', location: 'Online Zoom', icon: '🧘' },
  { id: 'e-2', title: 'Walk Together', date: 'Saturday, Aug 15', time: '9:00 AM', location: 'Eastside Park Entrance', icon: '🚶' },
  { id: 'e-3', title: 'Mental Wellness Webinar', date: 'Tuesday, Aug 18', time: '6:00 PM', location: 'Online Livestream', icon: '💻' },
  { id: 'e-4', title: 'Gratitude Circle', date: 'Saturday, Aug 22', time: '5:00 PM', location: 'Community Center Room B', icon: '⭕' }
];

export default function CommunityEvents() {
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const handleRegister = (id: string, title: string) => {
    setRegisteredIds((prev) => {
      const next = [...prev, id];
      alert(`Registered successfully for ${title}! We have saved this details on your local calendar.`);
      return next;
    });
  };

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Community Events
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EVENTS.map((event) => {
          const registered = registeredIds.includes(event.id);
          return (
            <div
              key={event.id}
              className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[148px] hover:border-[#FFB27A]/35 transition-all"
            >
              <div className="flex gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-center text-[20px] shrink-0 select-none">
                  {event.icon}
                </span>
                <div className="space-y-0.5 min-w-0">
                  <span className="block font-display font-black text-[#2B1D12] text-[14.5px]">
                    {event.title}
                  </span>
                  <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                    {event.date} • {event.time}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-50 mt-3 flex items-center justify-between">
                <span className="text-[11.5px] text-gray-400 font-bold">
                  📍 {event.location}
                </span>
                
                <button
                  onClick={() => handleRegister(event.id, event.title)}
                  disabled={registered}
                  type="button"
                  className={`py-1.5 px-3.5 rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95 border ${
                    registered
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-[#FF7527] border-[#FF7527] text-white hover:bg-[#E96630]'
                  }`}
                >
                  {registered ? '✓ Registered' : 'Register'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
