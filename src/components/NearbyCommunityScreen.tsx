import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NearbyCommunityScreenProps {
  onBack: () => void;
}

type NearbyStage = 'access' | 'results' | 'detail' | 'safety';

export default function NearbyCommunityScreen({ onBack }: NearbyCommunityScreenProps) {
  const [stage, setStage] = useState<NearbyStage>('access');
  const [locationPreference, setLocationPreference] = useState<string>('Use approximate location');
  const [cityInput, setCityInput] = useState<string>('');
  
  // Fitler states
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  
  // Selected community card for detail zoom
  const [selectedCircle, setSelectedCircle] = useState({
    name: 'Anxiety Support Circle',
    area: 'Near your city (approximate)',
    mode: 'Online + Local Meetup',
    bestFor: 'Anxiety, fear, overthinking',
    details: 'A calm support space for people dealing with anxiety, fear, and overthinking.',
    canDo: [
      'Share feelings safely to peer support experts',
      'Listen to others without interrupting or judging',
      'Join support discussions',
      'Attend public meetups if available',
      'Ask for professional resources'
    ],
    cannotDo: [
      'Give medical drug prescriptions',
      'Suggest specific chemical dosages',
      'Diagnose someone with clinical health disorders',
      'Claim miracle cures',
      'Pressure anyone to meet privately'
    ]
  });

  const filterChips = ['All', 'Anxiety', 'Trauma', 'Loneliness', 'Chronic Illness', 'Caregivers', 'Online Only'];

  const handleStartSearch = () => {
    if (locationPreference === 'Enter city manually' && !cityInput.trim()) {
      alert("Please specify your city manually.");
      return;
    }
    setStage('results');
  };

  const circlesData = [
    {
      id: 'circ-1',
      name: 'Anxiety Support Circle',
      area: 'Near your city',
      mode: 'Online + Local meetup',
      bestFor: 'Anxiety, fear, overthinking',
      category: 'Anxiety'
    },
    {
      id: 'circ-2',
      name: 'Caregiver Support Group',
      area: 'Nearby',
      mode: 'Community group',
      bestFor: 'Family members and caregivers',
      category: 'Caregivers'
    },
    {
      id: 'circ-3',
      name: 'Parkinson’s & Chronic Illness Circle',
      area: 'Nearby',
      mode: 'Support community',
      bestFor: 'Long-term health emotional support',
      category: 'Chronic Illness'
    },
    {
      id: 'circ-4',
      name: 'Loneliness Support Circle',
      area: 'Online now',
      mode: 'Anonymous support room',
      bestFor: 'Feeling alone or emotionally distant',
      category: 'Online Only'
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={() => {
            if (stage === 'access') onBack();
            else if (stage === 'results') setStage('access');
            else if (stage === 'detail') setStage('results');
            else if (stage === 'safety') setStage('detail');
          }}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {stage === 'access' && 'Nearby Location Setup'}
          {stage === 'results' && 'Nearby Safe Circles'}
          {stage === 'detail' && 'Circle Details'}
          {stage === 'safety' && 'Meet Safely Checklist'}
        </span>
        <span className="text-[20px] select-none">📍</span>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 12: NEARBY COMMUNITY ACCESS SCREEN */}
          {stage === 'access' && (
            <motion.div
              key="access-setup"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-md mx-auto"
            >
              <div className="text-center space-y-2">
                <div className="text-[40px]">🛰️</div>
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[22px]">
                  Nearby Community Support
                </h2>
                <p className="text-[13px] text-gray-500 font-semibold leading-relaxed">
                  Discover emotional support communities near your area. HopeHeart does not track your live location. You can choose to share only your approximate area.
                </p>
              </div>

              {/* Location options radio checklist */}
              <div className="space-y-2.5">
                {[
                  { id: 'Use approximate location', emoji: '🗺️', desc: 'Saves your privacy. No GPS tracking used.' },
                  { id: 'Enter city manually', emoji: '🏢', desc: 'Type your city name safely.' },
                  { id: 'Keep online only', emoji: '🌐', desc: 'Connect with virtual chat spaces only.' }
                ].map((opt) => {
                  const isS = locationPreference === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setLocationPreference(opt.id)}
                      className={`w-full p-4 text-left border rounded-2xl transition-all cursor-pointer flex items-center justify-between ${
                        isS ? 'bg-[#FFF2EA] border-[#FF7527]' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl select-none">{opt.emoji}</span>
                        <div>
                          <span className="text-[13px] font-display font-black text-gray-800 block">{opt.id}</span>
                          <span className="text-[11px] text-gray-400 font-semibold">{opt.desc}</span>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isS ? 'border-[#FF7527]' : 'border-gray-300'
                      }`}>
                        {isS && <span className="w-2.5 h-2.5 rounded-full bg-[#FF7527]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* City Input manual box */}
              {locationPreference === 'Enter city manually' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">City / Postal Code</label>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="e.g. Toronto, ON or Bangalore, India"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[13px] bg-white font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                </div>
              )}

              {/* Location privacy disclimers */}
              <div className="p-3 bg-[#FCFAF5] border border-gray-100 rounded-xl">
                <p className="text-[11px] text-gray-400 font-semibold text-center italic">
                  🛡️ <strong>Privacy Rule:</strong> HopeHeart never displays your exact residential coordinates, address, or telemetry data block to any other community member.
                </p>
              </div>

              {/* Submit search button */}
              <button
                onClick={handleStartSearch}
                className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] font-display font-black text-white text-[14.5px] rounded-2xl shadow-xs cursor-pointer transition-colors text-center"
              >
                Find Nearby Support
              </button>
            </motion.div>
          )}

          {/* SCREEN 13: NEARBY COMMUNITY RESULTS SCREEN */}
          {stage === 'results' && (
            <motion.div
              key="access-results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center md:text-left space-y-1">
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
                  Nearby Safe Circles
                </h2>
                <p className="text-[13px] text-gray-500 font-semibold">
                  Showing available circles based on <strong>{locationPreference}</strong> constraints. Keep online spaces safe!
                </p>
              </div>

              {/* Filter chip scroll row */}
              <div className="flex flex-wrap gap-1.5 pb-2">
                {filterChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setSelectedFilter(chip)}
                    className={`px-3 py-1.5 text-[12px] font-display font-bold rounded-lg border cursor-pointer transition-all ${
                      selectedFilter === chip 
                        ? 'bg-[#1E1E1A] text-white border-[#1e1e1a]' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Render Circles Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {circlesData
                  .filter(c => selectedFilter === 'All' || c.category === selectedFilter)
                  .map((circle) => (
                    <div 
                      key={circle.id}
                      className="bg-white border border-[#EDE9DE] rounded-3xl p-5 hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
                          <span>📍 {circle.area}</span>
                          <span className="font-mono text-[9px] uppercase tracking-wider bg-orange-50 text-[#FF7527] px-2 py-0.5 rounded-md">{circle.mode}</span>
                        </div>
                        <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                          {circle.name}
                        </h4>
                        <p className="text-[12px] text-gray-500 leading-normal font-semibold">
                          Best for: {circle.bestFor}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCircle({
                            name: circle.name,
                            area: circle.area,
                            mode: circle.mode,
                            bestFor: circle.bestFor,
                            details: `A dedicated companion group specializing in supporting those managing ${circle.bestFor} feelings with zero prescriptions.`,
                            canDo: [
                              'Share feelings safely to peer support experts',
                              'Listen to others without interrupting or judging',
                              'Join support discussions',
                              'Attend public meetups if available',
                              'Ask for professional resources'
                            ],
                            cannotDo: [
                              'Give medical drug prescriptions',
                              'Suggest specific chemical dosages',
                              'Diagnose someone with clinical health disorders',
                              'Claim miracle cures',
                              'Pressure anyone to meet privately'
                            ]
                          });
                          setStage('detail');
                        }}
                        className="w-full py-2 bg-[#FAF8F5] hover:bg-[#FF7527] border hover:border-[#FF7527] text-gray-700 hover:text-white rounded-xl text-[12.5px] font-display font-bold cursor-pointer transition-colors text-center"
                      >
                        {circle.category === 'Online Only' ? 'Join Online' : 'View Circle'}
                      </button>
                    </div>
                  ))}
              </div>

              {/* Safety banner caution */}
              <div className="p-3.5 bg-yellow-50 border border-yellow-100 rounded-2xl text-[11.5px] text-yellow-850 font-semibold leading-relaxed text-center">
                ⚠️ <strong>Safety Warning:</strong> Meet only in verified public spaces. Do not share your private address or highly sensitive personal financial details with other circle members.
              </div>

            </motion.div>
          )}

          {/* SCREEN 14: COMMUNITY DETAIL SCREEN */}
          {stage === 'detail' && (
            <motion.div
              key="detail-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto bg-white border border-[#E9E4D9] rounded-3xl p-6 md:p-8 space-y-6 shadow-xs"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">📍 LOCAL SAFE CIRCLE DIRECTORY</span>
                <h3 className="font-display font-black text-gray-800 text-[21px] md:text-[24px] leading-tight">
                  {selectedCircle.name}
                </h3>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-normal font-mono">
                  Mode: {selectedCircle.mode} | Area: {selectedCircle.area}
                </p>
              </div>

              <p className="text-[13.5px] text-gray-600 font-semibold leading-relaxed bg-[#FCFAF5] p-3.5 rounded-2xl border border-gray-100">
                <strong>Overview:</strong> {selectedCircle.details}
              </p>

              {/* Columns Allow/Ban split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-extrabold text-emerald-700 uppercase tracking-wider block">✓ WHAT YOU CAN DO HERE:</span>
                  <ul className="space-y-1.5 text-[11.5px] font-semibold text-gray-500">
                    {selectedCircle.canDo.map((val, idx) => (
                      <li key={idx} className="flex gap-1 items-start">
                        <span className="text-emerald-500 shrink-0">•</span>
                        <span>{val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-extrabold text-red-700 uppercase tracking-wider block">× WHAT YOU CANNOT DO HERE:</span>
                  <ul className="space-y-1.5 text-[11.5px] font-semibold text-gray-500">
                    {selectedCircle.cannotDo.map((val, idx) => (
                      <li key={idx} className="flex gap-1 items-start">
                        <span className="text-red-500 shrink-0">•</span>
                        <span>{val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action grid CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => setStage('safety')}
                  className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-extrabold text-[13.5px] rounded-2xl shadow-xs cursor-pointer transition-colors text-center"
                >
                  Join Community
                </button>
                <button
                  onClick={() => {
                    alert("A safety moderator has been dispatched to audit this local group circle. Thank you for raising concerns.");
                    setStage('results');
                  }}
                  className="w-full py-3 bg-white hover:bg-gray-50 border border-red-100 text-red-650 font-display font-extrabold text-[13.5px] rounded-2xl cursor-pointer text-center"
                >
                  Report Concern
                </button>
              </div>

            </motion.div>
          )}

          {/* SCREEN 15: MEET SAFELY SCREEN */}
          {stage === 'safety' && (
            <motion.div
              key="safety-checklist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto bg-white border border-red-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs"
            >
              <div className="text-center space-y-1">
                <div className="text-[40px] animate-pulse">🛡️</div>
                <h3 className="font-display font-black text-red-900 text-[20px] md:text-[22px]">
                  Meet Safely Checklist
                </h3>
                <p className="text-[13px] text-gray-500 font-semibold px-4">
                  HopeHeart does not encourage private or unsafe meetings. If you choose to attend a local community meetup, follow these safety steps.
                </p>
              </div>

              {/* Safety checkbox elements */}
              <div className="bg-[#FAF8F5] border border-[#EDE9DE] rounded-2xl p-4 md:p-5 space-y-3 font-semibold text-gray-750 text-[13px]">
                {[
                  'Meet only in a public, highly visible street, park, or coffee shop.',
                  'Do not share your exact home residential address or personal private details.',
                  'Inform a trusted friend, counselor, or relative of where you are going.',
                  'Use explicit checking-in and checking-out updates with a guardian friend.',
                  'Leave immediately any time you feel pressured, uncomfortable, or unsafe.',
                  'Report any coercive, diagnostic, or prescription-related advice to HopeHeart.'
                ].map((rule, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start pl-1">
                    <span className="w-5 h-5 rounded-full bg-red-150 text-red-800 text-xs flex items-center justify-center font-black shrink-0 leading-none">⚠️</span>
                    <p className="leading-snug">{rule}</p>
                  </div>
                ))}
              </div>

              {/* User Option settings */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">ADD GUARDIAN ACTIONS:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      const num = prompt("Enter mobile/email for your trusted safety contact:");
                      if (num) alert(`Contact "${num}" added as your primary emergency safety contact!`);
                    }}
                    className="p-3 bg-red-50 hover:bg-red-100/50 text-red-800 border border-red-150 rounded-xl text-[12px] font-display font-bold cursor-pointer transition-colors text-center"
                  >
                    📞 Add trusted contact
                  </button>
                  <button 
                    onClick={() => alert("Your location lookup mask has been locked to 100% private.")}
                    className="p-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[12px] font-display font-bold cursor-pointer text-center"
                  >
                    🔒 Keep location private
                  </button>
                  <button 
                    onClick={() => {
                      alert("Switching this join instance to Web Online video call Room instead!");
                      setStage('results');
                    }}
                    className="p-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[12px] font-display font-bold cursor-pointer text-center"
                  >
                    🌐 Attend online instead
                  </button>
                </div>
              </div>

              {/* Confirm agreement button */}
              <button
                onClick={() => {
                  alert("Successfully Joined Circle! Keep boundaries safe.");
                  setStage('results');
                }}
                className="w-full py-3.5 bg-[#1E1E1A] hover:bg-black text-white font-display font-black text-[14.5px] rounded-2.5xl cursor-pointer transition-colors text-center"
              >
                I Understand Safety Rules
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
