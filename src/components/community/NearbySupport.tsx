import React, { useState } from 'react';

interface NearbyResource {
  id: string;
  name: string;
  type: 'Group' | 'Center' | 'Program';
  distance: string;
  description: string;
  contact: string;
}

const RESOURCES: NearbyResource[] = [
  {
    id: 'n-1',
    name: 'Eastside Wellness Center',
    type: 'Center',
    distance: '1.2 miles away',
    description: 'Offers weekly mental wellness check-ins, meditation spaces, and gentle counseling hours.',
    contact: 'Walk-ins welcome'
  },
  {
    id: 'n-2',
    name: 'Anxiety Peer Support Circle',
    type: 'Group',
    distance: '2.5 miles away',
    description: 'Peer-led support group meeting every Thursday evening in a cozy local library room.',
    contact: 'Thursday 7:00 PM'
  },
  {
    id: 'n-3',
    name: 'Mindful Nature Walk Program',
    type: 'Program',
    distance: '3.1 miles away',
    description: 'Group outdoor walks focusing on slow pacing, breathing resets, and gentle movement.',
    contact: 'Saturday mornings'
  }
];

export default function NearbySupport() {
  const [zipCode, setZipCode] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<NearbyResource[]>(RESOURCES);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) return;

    setSearching(true);
    setTimeout(() => {
      // Simulate geographic filter
      setResults(RESOURCES);
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Nearby Support
      </h3>

      <div className="bg-[#FFFDF9] border border-[#F1E7D8]/80 rounded-[28px] p-5 space-y-4 shadow-3xs">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter zip code or city..."
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-white font-semibold focus:outline-none focus:border-[#FF7527]"
            aria-label="Zip code search for local support groups"
          />
          <button
            type="submit"
            disabled={searching}
            className="py-2.5 px-5 bg-[#2B1D12] hover:bg-black text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs shrink-0"
          >
            {searching ? 'Searching...' : 'Find Near Me'}
          </button>
        </form>

        <div className="space-y-3">
          {results.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EDE9DE]/75 rounded-2xl p-4.5 shadow-3xs flex flex-col justify-between hover:border-[#FFB27A]/30 transition-all leading-normal"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-black text-[#2B1D12] text-[14px]">
                    {item.name}
                  </span>
                  <span className="text-[9.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-50 mt-3 flex items-center justify-between text-[11px] text-gray-400 font-bold">
                <span>📍 {item.distance}</span>
                <span>📅 {item.contact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
