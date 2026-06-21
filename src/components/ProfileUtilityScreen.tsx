import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileUtilityScreenProps {
  onBack: () => void;
  userName: string;
  onChangeName: (newName: string) => void;
  initialSubStage?: 'profile' | 'privacy';
}

export default function ProfileUtilityScreen({ onBack, userName, onChangeName, initialSubStage }: ProfileUtilityScreenProps) {
  const [subStage, setSubStage] = useState<'profile' | 'privacy'>(initialSubStage || 'profile');
  const [anonNameInput, setAnonNameInput] = useState<string>(userName);

  useEffect(() => {
    if (initialSubStage) {
      setSubStage(initialSubStage);
    }
  }, [initialSubStage]);
  
  // Toggle states
  const [showHeartStatus, setShowHeartStatus] = useState<boolean>(true);
  const [showActivity, setShowActivity] = useState<boolean>(true);
  const [showNearbyResults, setShowNearbyResults] = useState<boolean>(false);

  const handleSavePrivacy = () => {
    if (!anonNameInput.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    onChangeName(anonNameInput);
    alert("Privacy Settings Saved! Your custom anonymous handle has been updated.");
    setSubStage('profile');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={subStage === 'privacy' ? () => setSubStage('profile') : onBack}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subStage === 'profile' ? 'My Safe Profile' : 'Privacy Settings'}
        </span>
        <span className="text-[20px] select-none">👤</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 23: PROFILE SCREEN */}
          {subStage === 'profile' && (
            <motion.div
              key="profile-hub"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Profile Card Header */}
              <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF7527] to-[#FFA14E] border-4 border-white flex items-center justify-center text-[28px] shrink-0 shadow-sm select-none">
                  🦊
                </div>
                
                <div className="text-center sm:text-left space-y-1 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
                    <h3 className="font-display font-black text-gray-800 text-[18px]">
                      {userName}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-orange-50 text-[#FF7527] rounded-full text-[10px] font-mono font-extrabold uppercase w-fit mx-auto sm:mx-0">
                      Anonymous Peer
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-400 font-semibold">
                    Member since June 2026 • Encrypted Secure Token Block
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSubStage('privacy')}
                  className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#FFF2EA] border border-[#ECE6D9] hover:border-[#FF7527] text-gray-700 hover:text-[#FF7527] rounded-xl text-[12px] font-display font-black cursor-pointer transition-colors"
                >
                  ⚙️ Edit Privacy
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: '7 Days', label: 'Safety Streak', emoji: '🛡️' },
                  { value: '4 Times', label: 'Check-ins Done', emoji: '🩺' },
                  { value: '12 Hearts', label: 'Warmth Shared', emoji: '❤️' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-[#EDE9DE] rounded-2xl p-2.5 sm:p-4 text-center space-y-1 shadow-xs">
                    <span className="text-xl block">{stat.emoji}</span>
                    <h5 className="font-display font-black text-[#FF7527] text-[15px] sm:text-[16px]">{stat.value}</h5>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Utility List Menu */}
              <div className="bg-white border border-[#EDE9DE] rounded-3xl p-4 divide-y divide-gray-100 shadow-xs">
                {[
                  { label: 'Resource Logs', detail: 'View history of saved questions for professionals.', action: () => alert("Redirecting to logs... Select Resources on the bottom menu to view verified professional resources.") },
                  { label: 'Account Info', detail: 'Review security key tokens, backup codes, and active platforms.', action: () => alert("HopeHeart accounts are completely offline and locally managed via secure indexedDB. Your backup code is #GP-47712.") },
                  { label: 'Security & Safety Toggles', detail: 'Adjust real-time AI moderation sensitivity levels.', action: () => setSubStage('privacy') },
                ].map((item, id) => (
                  <button
                    key={id}
                    onClick={item.action}
                    type="button"
                    className="w-full text-left py-3.5 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between first:pt-1 last:pb-1 cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[13.5px] font-display font-extrabold text-gray-800 block">{item.label}</span>
                      <span className="text-[11.5px] text-gray-500 font-medium leading-normal block">{item.detail}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Verified Badge */}
              <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-2xl text-center">
                <span className="text-[12px] font-semibold text-[#FF7527] leading-relaxed block">
                  🛡️ HopeHeart encrypts your connection. AI models inspect chats locally to block clinical medication exposures.
                </span>
              </div>

            </motion.div>
          )}

          {/* SCREEN 24: PRIVACY SETTINGS SCREEN */}
          {subStage === 'privacy' && (
            <motion.div
              key="privacy-settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-md mx-auto"
            >
              <div className="text-center space-y-1">
                <div className="text-[32px]">🔒</div>
                <h3 className="font-display font-black text-gray-800 text-[19px]">
                  You control what you share
                </h3>
                <p className="text-[12.5px] text-gray-500 font-semibold">
                  Adjust your privacy vector settings anytime. Keep your identities safe.
                </p>
              </div>

              {/* Anon Handle input panel */}
              <div className="space-y-1.5 bg-white border border-[#EEE9DD] p-4.5 rounded-2.5xl shadow-xs">
                <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Customize Anonymous Username Tag
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={anonNameInput}
                    onChange={(e) => setAnonNameInput(e.target.value)}
                    placeholder="e.g. Voice47"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                  <button 
                    type="button"
                    onClick={() => setAnonNameInput('Voice' + Math.floor(10 + Math.random() * 900))}
                    className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[12.5px] font-display font-bold cursor-pointer"
                  >
                    🎲 Roll
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 font-medium pt-1">
                  We recommend generic, neutral numeric aliases to guarantee peak safety in Support Rooms.
                </p>
              </div>

              {/* Toggles Options checklist */}
              <div className="bg-white border border-[#EEE9DD] rounded-2.5xl p-4.5 shadow-xs space-y-4">
                
                {/* Heart Status */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">Show heart status on profile</span>
                    <p className="text-[11px] text-gray-400 font-semibold leading-normal">
                      Allows companion groups and match coaches to view your selected mood choice tag.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHeartStatus(!showHeartStatus)}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${showHeartStatus ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform transform ${showHeartStatus ? 'translate-x-5.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Activity log */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-50">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">Show activity in support rooms</span>
                    <p className="text-[11px] text-gray-400 font-semibold leading-normal">
                      Lets other active minds celebrate or reply to your shared thoughts in streams.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowActivity(!showActivity)}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${showActivity ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform transform ${showActivity ? 'translate-x-5.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Nearby Results */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">Show nearby results lookup</span>
                    <p className="text-[11px] text-gray-400 font-semibold leading-normal">
                      Exposes approximate local matching to find close peer group hubs under exact limits.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNearbyResults(!showNearbyResults)}
                    className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer ${showNearbyResults ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform transform ${showNearbyResults ? 'translate-x-5.5' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSubStage('profile')}
                  className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[13px] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePrivacy}
                  className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl cursor-pointer shadow-xs"
                >
                  Save Privacy Settings
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
export { ProfileUtilityScreen };
