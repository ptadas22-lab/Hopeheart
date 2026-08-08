import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoodConfig, ScreenId } from '../../types';
import MoodMusicCard from './MoodMusicCard';
import MoodVideoCard from './MoodVideoCard';

interface PersonalizedComfortScreenProps {
  mood: MoodConfig;
  onBack: () => void;
  onNavigateTo: (screenId: string) => void;
  onCompleteOnboarding: (choice: 'private' | 'explore' | 'connect') => void;
}

export default function PersonalizedComfortScreen({
  mood,
  onBack,
  onNavigateTo,
  onCompleteOnboarding
}: PersonalizedComfortScreenProps) {
  // 'comfort' | 'community'
  const [subStep, setSubStep] = useState<'comfort' | 'community'>('comfort');

  // Local helper to launch breathing exercise in Wellness Hub
  const handleLaunchBreathing = () => {
    // Navigates to Resource center (which contains Breathing exercise card)
    onNavigateTo(ScreenId.DoctorSuggestions);
  };

  // Local helper to launch break timer in Wellness Hub
  const handleLaunchBreak = () => {
    onNavigateTo(ScreenId.DoctorSuggestions);
  };

  // Local helper to launch HopeBuddy Chat
  const handleLaunchHopeBuddy = () => {
    onNavigateTo(ScreenId.HopeBuddyChat);
  };

  const renderComfortRecommendations = () => {
    const isAnxious = mood.id === 'anxious' || mood.id === 'need-support';
    const isSad = mood.id === 'sad' || mood.id === 'lonely' || mood.id === 'hurt';
    const isStressed = mood.id === 'tired'; // tired or overworked
    
    // Default or Happy/Calm/Hopeful
    const isCalmHappy = mood.id === 'calm' || mood.id === 'hopeful';

    return (
      <div className="space-y-4">
        {/* Recommendation 1: Breathing / Break / Kindness Action Link */}
        <div className="bg-[#FAF7F0] border border-[#EDE9DE] rounded-[24px] p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">
              Recommended Activity
            </span>
            <span className="font-display font-black text-[#2B1D12] text-[14px]">
              {isAnxious && '🌬️ Breathing Exercise'}
              {isSad && '💬 Talk with HopeBuddy'}
              {isStressed && '☕ Take a Short Break'}
              {isCalmHappy && '🌱 Perform a Kindness Action'}
            </span>
            <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
              {isAnxious && 'Slow down your chest and follow the contracting circle.'}
              {isSad && 'Share your quiet thoughts with a supportive virtual companion.'}
              {isStressed && 'Rest with a brief pause and soft grounding bell.'}
              {isCalmHappy && 'Send a warm message of hope to community members.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isAnxious) handleLaunchBreathing();
              else if (isSad) handleLaunchHopeBuddy();
              else if (isStressed) handleLaunchBreak();
              else onNavigateTo(ScreenId.Community);
            }}
            className="py-2 px-3.5 bg-[#FF7527] hover:bg-[#E55D13] text-white text-[12px] font-display font-black rounded-xl cursor-pointer transition-all active-scale"
          >
            Start
          </button>
        </div>

        {/* Music Card */}
        <MoodMusicCard moodId={mood.id} onFallbackOption={handleLaunchBreathing} />

        {/* Video Card */}
        <MoodVideoCard moodId={mood.id} onFallbackOption={handleLaunchBreathing} />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full my-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={() => {
            if (subStep === 'community') {
              setSubStep('comfort');
            } else {
              onBack();
            }
          }}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active-scale shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subStep === 'comfort' ? 'Comfort Space' : 'Community Invitation'}
        </span>
        <span className="text-[20px] select-none">🦊</span>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full p-4 md:p-6 flex flex-col justify-between space-y-6">
        <AnimatePresence mode="wait">
          {subStep === 'comfort' ? (
            <motion.div
              key="comfort"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              {/* Introduction Card */}
              <div className="text-center space-y-2">
                <span className="text-[36px] block animate-bounce duration-[2000ms]">{mood.emoji}</span>
                <h3 className="font-display font-black text-gray-800 text-[18px]">
                  You checked in as <span className="text-[#FF7527]">{mood.label}</span>
                </h3>
                <p className="text-[13.5px] text-gray-500 font-semibold leading-relaxed px-2">
                  Let's make the next few minutes a little gentler.
                </p>
              </div>

              {/* Recommendations */}
              {renderComfortRecommendations()}

              {/* Proceed Button */}
              <button
                type="button"
                onClick={() => setSubStep('community')}
                className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl cursor-pointer transition-all active-scale shadow-3xs text-center block"
              >
                Next: Connect & Explore
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="community-invitation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-5"
            >
              {/* Content Panel */}
              <div className="text-center space-y-2.5">
                <span className="text-[36px] block">💛</span>
                <h3 className="font-display font-black text-gray-800 text-[20px]">
                  You are not alone.
                </h3>
                <p className="text-[13px] text-gray-500 font-semibold leading-relaxed px-4">
                  Would you like to meet people who are going through something similar?
                </p>
                <div className="bg-[#FAF7F0] border border-[#EDE9DE] rounded-2xl p-4 text-left text-[11.5px] text-gray-600 font-semibold space-y-1.5 leading-relaxed">
                  <div>✓ <strong>You decide:</strong> You choose what you share.</div>
                  <div>✓ <strong>Private default:</strong> You can explore completely privately.</div>
                  <div>✓ <strong>Control:</strong> You can change your mind at any time.</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onCompleteOnboarding('private')}
                  className="w-full p-4 bg-white border border-[#EDE9DE] rounded-[24px] text-left hover:bg-orange-50/20 hover:border-[#FFB27A]/30 transition-all active-scale cursor-pointer flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[18px] group-hover:bg-orange-50 shrink-0">
                    🌱
                  </span>
                  <div className="space-y-0.5">
                    <span className="block font-display font-black text-gray-800 text-[13.5px]">
                      Explore Alone
                    </span>
                    <p className="text-[11.5px] text-gray-450 font-semibold leading-normal">
                      Continue to HopeHeart completely privately on this device.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onCompleteOnboarding('explore')}
                  className="w-full p-4 bg-white border border-[#EDE9DE] rounded-[24px] text-left hover:bg-orange-50/20 hover:border-[#FFB27A]/30 transition-all active-scale cursor-pointer flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-center text-[18px] shrink-0">
                    💛
                  </span>
                  <div className="space-y-0.5">
                    <span className="block font-display font-black text-gray-800 text-[13.5px]">
                      Find My Circle
                    </span>
                    <p className="text-[11.5px] text-gray-450 font-semibold leading-normal">
                      Explore community circles and mutual support topics.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onCompleteOnboarding('connect')}
                  className="w-full p-4 bg-white border border-[#EDE9DE] rounded-[24px] text-left hover:bg-orange-50/20 hover:border-[#FFB27A]/30 transition-all active-scale cursor-pointer flex items-center gap-3.5 group"
                >
                  <span className="w-10 h-10 rounded-xl bg-[#FFF2EA] border border-orange-150 flex items-center justify-center text-[18px] shrink-0">
                    🤝
                  </span>
                  <div className="space-y-0.5">
                    <span className="block font-display font-black text-gray-800 text-[13.5px]">
                      Connect With Someone
                    </span>
                    <p className="text-[11.5px] text-gray-450 font-semibold leading-normal">
                      Find a vetted peer listener to talk to without pressure.
                    </p>
                  </div>
                </button>
              </div>

              <p className="text-[10px] text-gray-400 font-semibold text-center italic leading-relaxed px-4">
                Note: Vetted peer listeners are supportive individuals, not clinical professionals. We do not automatically publish or share any of your private logs or mood.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
