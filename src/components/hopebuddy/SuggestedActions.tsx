import React from 'react';
import { ScreenId } from '../../types';

interface SuggestedActionsProps {
  onNavigateTo: (screenId: ScreenId) => void;
  recentMoodId?: string;
}

export default function SuggestedActions({
  onNavigateTo,
  recentMoodId
}: SuggestedActionsProps) {
  
  // Rule-based logic
  const getSuggestions = () => {
    const list = [
      { id: 'breathing', label: 'Breathing Exercise', icon: '🌬️', desc: 'Pause, breathe and center your body.', action: () => onNavigateTo(ScreenId.DoctorSuggestions) },
      { id: 'gratitude', label: 'Gratitude Journal', icon: '📝', desc: 'Write down one good thing today.', action: () => onNavigateTo(ScreenId.MySpace) },
    ];

    if (recentMoodId === 'anxious' || recentMoodId === 'tired') {
      list.unshift({
        id: 'break',
        label: 'Take a Short Break',
        icon: '☕',
        desc: 'Relax with our soothing break timer.',
        action: () => onNavigateTo(ScreenId.DoctorSuggestions)
      });
    } else {
      list.push({
        id: 'mood',
        label: 'Mood Check-in',
        icon: '🫧',
        desc: 'Log how you feel right now.',
        action: () => onNavigateTo(ScreenId.Mood)
      });
    }

    list.push({
      id: 'community',
      label: 'Read Stories',
      icon: '🤝',
      desc: 'Connect with inspiring support rooms.',
      action: () => onNavigateTo(ScreenId.Community)
    });

    return list;
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
          Suggested Actions
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Rule-based comforting steps you can choose to explore next.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {getSuggestions().map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={act.action}
            className="p-4 bg-white border border-[#EDE9DE] rounded-[24px] text-left shadow-3xs flex items-start gap-3.5 cursor-pointer hover:border-[#FFB27A]/35 transition-all hover-lift w-full"
          >
            <span className="w-10 h-10 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-center text-[20px] shrink-0">
              {act.icon}
            </span>
            <div className="space-y-0.5">
              <span className="block font-display font-black text-[#2B1D12] text-[14px]">
                {act.label}
              </span>
              <p className="text-[12px] text-gray-500 font-semibold leading-normal">
                {act.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
