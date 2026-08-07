import React from 'react';
import { saveCommunityActivity, type CommunityActivityAction } from '../services/communityActivity';

// Modular Community subcomponents
import CommunityHome from './community/CommunityHome';
import DailyKindnessCard from './community/DailyKindnessCard';
import SupportRooms from './community/SupportRooms';
import CommunityStories from './community/CommunityStories';
import ListenerDirectory from './community/ListenerDirectory';
import NearbySupport from './community/NearbySupport';
import CommunityEvents from './community/CommunityEvents';
import SafetyNotice from './community/SafetyNotice';

interface CommunityScreenProps {
  onBack: () => void;
}

export default function CommunityScreen({ onBack }: CommunityScreenProps) {
  
  const recordCommunityActivity = async (key: string, title: string, action: CommunityActivityAction) => {
    await saveCommunityActivity({
      category: 'chat',
      activityKey: key,
      activityTitle: title,
      action
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label="Back to dashboard"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Community
        </span>
        <span className="text-[20px] select-none">🤝</span>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-28 sm:pb-10 space-y-6">
        {/* Welcome message section */}
        <CommunityHome />

        {/* Daily Kindness Challenge card */}
        <DailyKindnessCard />

        {/* Support categories rooms list */}
        <SupportRooms />

        {/* Community positive recovery stories */}
        <CommunityStories />

        {/* Verified peer listeners directory */}
        <ListenerDirectory />

        {/* Regional support wellness groups */}
        <NearbySupport />

        {/* Live circles/webinars events registration list */}
        <CommunityEvents />

        {/* Clinical safety warning disclaimer notices */}
        <SafetyNotice />
      </div>
    </div>
  );
}
