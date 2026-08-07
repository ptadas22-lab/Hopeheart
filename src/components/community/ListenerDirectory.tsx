import React, { useState } from 'react';

interface ListenerProfile {
  id: string;
  name: string;
  avatar: string;
  languages: string[];
  availability: string;
  supportAreas: string[];
  online: boolean;
}

const LISTENERS: ListenerProfile[] = [
  {
    id: 'l-1',
    name: 'Sarah Jenkins',
    avatar: '👩‍💼',
    languages: ['English'],
    availability: 'Available now',
    supportAreas: ['Anxiety', 'Stress support'],
    online: true
  },
  {
    id: 'l-2',
    name: 'David Kim',
    avatar: '👨‍💻',
    languages: ['English', 'Korean'],
    availability: 'Evenings',
    supportAreas: ['Grief & loss', 'Self Growth'],
    online: false
  },
  {
    id: 'l-3',
    name: 'Elena Martinez',
    avatar: '👩‍🎨',
    languages: ['English', 'Spanish'],
    availability: 'Available now',
    supportAreas: ['Relationships', 'Students Circle'],
    online: true
  }
];

export default function ListenerDirectory() {
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = (id: string, name: string) => {
    setConnectingId(id);
    setTimeout(() => {
      alert(`Connecting to verified listener ${name}. Chat room will launch shortly.`);
      setConnectingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Verified Listeners
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {LISTENERS.map((listener) => (
          <div
            key={listener.id}
            className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[190px] hover:border-[#FFB27A]/35 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[26px] shrink-0 select-none">
                  {listener.avatar}
                </span>
                <div>
                  <span className="block font-display font-black text-[#2B1D12] text-[15px] leading-tight">
                    {listener.name}
                  </span>
                  <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    {listener.availability}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11.5px] text-gray-500 font-semibold">
                <div>
                  <span className="text-gray-400 font-bold block">Languages:</span>
                  <span>{listener.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block">Support Areas:</span>
                  <span>{listener.supportAreas.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-50 mt-3 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full inline-block ${listener.online ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`} />
                <span>{listener.online ? 'Online' : 'Offline'}</span>
              </span>

              <button
                onClick={() => handleConnect(listener.id, listener.name)}
                disabled={connectingId !== null}
                type="button"
                className="py-1.5 px-3 bg-[#FF7527] hover:bg-[#E96630] disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
              >
                {connectingId === listener.id ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
