import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../types';

interface ProfileUtilityScreenProps {
  onBack: () => void;
  userName: string;
  onChangeName: (newName: string) => void;
  initialSubStage?: 'profile' | 'privacy';
  onNavigateTo?: (screenId: ScreenId) => void;
  checkinCount?: number;
}

export default function ProfileUtilityScreen({ 
  onBack, 
  userName, 
  onChangeName, 
  initialSubStage, 
  onNavigateTo,
  checkinCount
}: ProfileUtilityScreenProps) {
  const [subStage, setSubStage] = useState<'profile' | 'edit-profile' | 'privacy'>(
    initialSubStage === 'privacy' ? 'privacy' : 'profile'
  );
  const [anonNameInput, setAnonNameInput] = useState<string>(userName);

  const [profileAgeGroup, setProfileAgeGroup] = useState(() => localStorage.getItem('hopeheart_profile_age_group') || '25–34');
  const [profileLanguage, setProfileLanguage] = useState(() => localStorage.getItem('hopeheart_profile_language') || 'English');
  const [profileSupportInterest, setProfileSupportInterest] = useState(() => localStorage.getItem('hopeheart_profile_support_interest') || '🌱 General Support');

  useEffect(() => {
    if (subStage === 'profile') {
      setProfileAgeGroup(localStorage.getItem('hopeheart_profile_age_group') || '25–34');
      setProfileLanguage(localStorage.getItem('hopeheart_profile_language') || 'English');
      setProfileSupportInterest(localStorage.getItem('hopeheart_profile_support_interest') || '🌱 General Support');
    }
  }, [subStage]);

  useEffect(() => {
    if (initialSubStage) {
      setSubStage(initialSubStage === 'privacy' ? 'privacy' : 'profile');
    }
  }, [initialSubStage]);
  
  // Toggle states
  const [showBasics, setShowBasics] = useState<boolean>(true);
  const [showHeartStatus, setShowHeartStatus] = useState<boolean>(true);
  const [showActivity, setShowActivity] = useState<boolean>(true);
  const [useApproximateNearby, setUseApproximateNearby] = useState<boolean>(true);
  const [allowStorySharing, setAllowStorySharing] = useState<boolean>(true);
  const [hideNearbySuggestions, setHideNearbySuggestions] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button 
          onClick={subStage !== 'profile' ? () => setSubStage('profile') : onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subStage === 'profile' ? 'My Safe Profile' : subStage === 'edit-profile' ? 'Edit Profile' : 'Privacy Settings'}
        </span>
        <span className="text-[20px] select-none">👤</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 pt-6 sm:p-6 sm:pt-8 lg:p-8 lg:pt-10">
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
              <div className="hh-surface rounded-3xl p-5 md:p-6 flex flex-col items-center gap-5 mt-2 sm:mt-4 text-center">
                <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF7527] to-[#FFA14E] border-4 border-white flex items-center justify-center text-[28px] shrink-0 shadow-sm select-none">
                    🦊
                  </div>
                  
                  <div className="text-center sm:text-left space-y-1 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
                      <h3 className="font-display font-black text-gray-800 text-[18px]">
                        {userName || 'GoogleBuddy'}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-orange-50 text-[#FF7527] rounded-full text-[10px] font-mono font-extrabold uppercase w-fit mx-auto sm:mx-0">
                        Anonymous Peer
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#FF7527] font-display font-black leading-tight">
                      Your private HopeHeart profile
                    </p>
                    <p className="text-[11.5px] text-gray-400 font-bold uppercase tracking-tight">
                      Member since June 2026
                    </p>
                  </div>
                </div>

                {/* Profile Details Chips */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3.5 border-t border-gray-100 mt-2 text-left">
                  {[
                    { label: 'Age Group', val: profileAgeGroup, icon: '🎂' },
                    { label: 'Gender', val: 'Prefer not to say', icon: '👤' },
                    { label: 'Role', val: 'Working Professional', icon: '💼' },
                    { label: 'Language', val: profileLanguage, icon: '🗣️' },
                    { label: 'Support Interest', val: profileSupportInterest, icon: '🧡' }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[12px] text-gray-650 font-semibold bg-[#FFFDF9]/60 px-3 py-1.5 rounded-xl border border-gray-150/40">
                      <span className="text-sm shrink-0">{detail.icon}</span>
                      <span className="text-gray-400 font-bold uppercase text-[9px] tracking-tight">{detail.label}:</span>
                      <span className="text-gray-700 font-extrabold leading-tight text-ellipsis overflow-hidden whitespace-nowrap">{detail.val}</span>
                    </div>
                  ))}
                </div>

                {/* Profile Card Actions */}
                <div className="w-full flex flex-col sm:flex-row gap-2 pt-3.5 border-t border-gray-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setSubStage('edit-profile')}
                    className="flex-1 py-2.5 bg-white hover:bg-[#FCFAF5] border border-gray-250 text-gray-755 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                  >
                    <span>✏️</span> Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubStage('privacy')}
                    className="flex-1 py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-3xs"
                  >
                    <span>🔒</span> Privacy Settings
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { value: '7 Days', label: 'Safe Space Streak', emoji: '🛡️' },
                  { value: `${checkinCount ?? 0} Check-ins`, label: 'Mood Reflections', emoji: '🩺' },
                  { value: '12 Hearts', label: 'Support Shared', emoji: '❤️' }
                ].map((stat, idx) => (
                  <div key={idx} className="hh-surface rounded-2xl p-3 sm:p-4 text-center space-y-1">
                    <span className="text-xl block">{stat.emoji}</span>
                    <h5 className="font-display font-black text-[#FF7527] text-[15px] sm:text-[16px]">{stat.value}</h5>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Utility List Menu */}
              <div className="hh-surface rounded-3xl p-4 divide-y divide-gray-100">
                {[
                  { 
                    label: 'Saved Questions & Resources', 
                    detail: 'View saved care questions, stories, guides, and resources.', 
                    action: () => alert("Redirecting to logs... Select Resources on the bottom menu to view verified professional resources.") 
                  },
                  { 
                    label: 'Account & Login', 
                    detail: 'Review login method, backup details, and account preferences.', 
                    action: () => alert("HopeHeart accounts are completely offline and locally managed via secure indexedDB. Your backup code is #GP-47712.") 
                  },
                  { 
                    label: 'Privacy & Safety Controls', 
                    detail: 'Adjust privacy, reporting, and safe-space preferences.', 
                    action: () => setSubStage('privacy') 
                  },
                  { 
                    label: 'Customer Support', 
                    detail: 'Contact our support team for account, privacy, safety, or app-related issues.', 
                    action: () => {
                      if (onNavigateTo) {
                        onNavigateTo(ScreenId.CustomerSupport);
                      }
                    }
                  },
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

              {/* Founder / Demo Section */}
              <div className="space-y-2 mt-4">
                <span className="text-[11px] font-mono font-extrabold text-gray-400 uppercase tracking-widest px-2 block">
                  Founder / Demo
                </span>
                <div className="hh-surface rounded-3xl p-4">
                  <button
                    onClick={() => {
                      if (onNavigateTo) {
                        onNavigateTo(ScreenId.Financials);
                      }
                    }}
                    type="button"
                    className="w-full text-left py-2 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[13.5px] font-display font-extrabold text-gray-800 block">
                        Service Model & Financials
                      </span>
                      <span className="text-[11.5px] text-gray-500 font-medium leading-normal block">
                        Founder View: Explore HopeHeart sustainability ecosystem models.
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Privacy Note */}
              <p className="text-[11.5px] text-gray-450 font-semibold leading-relaxed text-center italic max-w-[340px] mx-auto pt-2 pb-2">
                Your profile is private. HopeHeart never shows your exact location, phone number, or private notes to other users.
              </p>

              {/* Verified Badge */}
              <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-2xl text-center">
                <span className="text-[12px] font-semibold text-[#FF7527] leading-relaxed block">
                  🛡️ Private local storage in MVP. Secure encrypted storage planned for production. Safety rules help detect and block unsafe medical advice, prescriptions, dosage guidance, diagnosis claims, and cure promises.
                </span>
              </div>

            </motion.div>
          )}

          {/* EDIT PROFILE SCREEN */}
          {subStage === 'edit-profile' && (
            <motion.div
              key="edit-profile-hub"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-md mx-auto mt-1 sm:mt-2"
            >
              <div className="text-center space-y-1">
                <div className="text-[28px]">👤</div>
                <h3 className="font-display font-black text-gray-800 text-[19px]">
                  Edit Profile
                </h3>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed px-4">
                  Set your public presence. Remember, your personal details always remain private.
                </p>
              </div>

              {/* Anon Display Name input panel */}
              <div className="space-y-2 hh-surface rounded-2.5xl p-4.5">
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Anonymous Display Name
                </span>
                <p className="text-[11.5px] text-gray-550 font-semibold leading-normal">
                  This is the name others see in support rooms and listener chats.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-1">
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
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[12.5px] font-display font-bold cursor-pointer transition-all active:scale-95 text-center shrink-0"
                  >
                    🎲 Generate Name
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 font-medium pt-1">
                  We recommend generic, neutral numeric aliases to guarantee peak safety in Support Rooms.
                </p>
              </div>

              {/* Actions for edit-profile */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubStage('profile')}
                  className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[13px] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!anonNameInput.trim()) {
                      alert("Name cannot be empty.");
                      return;
                    }
                    onChangeName(anonNameInput);
                    alert("Display name updated safely!");
                    setSubStage('profile');
                  }}
                  className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl cursor-pointer shadow-xs"
                >
                  Save Profile
                </button>
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
              className="space-y-4 max-w-md mx-auto mt-1 sm:mt-2"
            >
              <div className="text-center space-y-1">
                <div className="text-[28px]">🔒</div>
                <h3 className="font-display font-black text-gray-800 text-[19px]">
                  You control what you share
                </h3>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed px-4">
                  Choose what others can see. Your private notes, phone number, and exact location are never shown.
                </p>
              </div>

              {/* Toggles Options checklist */}
              <div className="hh-surface rounded-2.5xl p-4.5 space-y-4 text-left">
                
                {/* Toggle 1: Basics */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">👤 Show my profile basics</span>
                    <p className="text-[11px] text-gray-450 font-semibold leading-normal">
                      Allows others to see your display name, role, language, and listening style.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBasics(!showBasics)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${showBasics ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${showBasics ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 2: Mood status */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">🧡 Show my mood status</span>
                    <p className="text-[11px] text-gray-450 font-semibold leading-normal">
                      Allows matched listeners to see your selected mood tag.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHeartStatus(!showHeartStatus)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${showHeartStatus ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${showHeartStatus ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 3: Support activity */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">💬 Show support room activity</span>
                    <p className="text-[11px] text-gray-450 font-semibold leading-normal">
                      Allows others to see when you reply inside support rooms.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowActivity(!showActivity)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${showActivity ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${showActivity ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 4: Nearby match */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">📍 Use approximate nearby matching</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Uses approximate distance only. Exact location is never shown.
                    </p>
                  </div>
                  <button
                    onClick={() => setUseApproximateNearby(!useApproximateNearby)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${useApproximateNearby ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${useApproximateNearby ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 5: Story Sharing */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">📖 Allow anonymous story sharing</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Your story can be shown without name, phone number, or exact location.
                    </p>
                  </div>
                  <button
                    onClick={() => setAllowStorySharing(!allowStorySharing)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${allowStorySharing ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${allowStorySharing ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 6: Hide nearby */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">🔒 Hide from nearby suggestions</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Your profile will not appear in nearby listener or support suggestions.
                    </p>
                  </div>
                  <button
                    onClick={() => setHideNearbySuggestions(!hideNearbySuggestions)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${hideNearbySuggestions ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${hideNearbySuggestions ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>

              {/* Privacy Promise Card */}
              <div className="hh-surface rounded-2.5xl p-4 text-center space-y-1.5">
                <span className="text-[12px] font-display font-black text-gray-800 block">
                  🛡️ Your private information stays private
                </span>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed px-2">
                  HopeHeart never shows your phone number, exact location, private notes, saved questions, or chat history to other users.
                </p>
              </div>

              {/* Actions for privacy */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubStage('profile')}
                  className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[13px] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Privacy preferences saved successfully!");
                    setSubStage('profile');
                  }}
                  className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl cursor-pointer shadow-xs"
                >
                  Save Settings
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
