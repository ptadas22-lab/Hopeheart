import React from 'react';

interface AchievementsSectionProps {
  checkinCount: number;
  journalCount: number;
  gratitudeCount: number;
  favoriteCount: number;
}

interface Milestone {
  id: string;
  title: string;
  desc: string;
  icon: string;
  bgClass: string;
  unlocked: boolean;
}

export default function AchievementsSection({
  checkinCount,
  journalCount,
  gratitudeCount,
  favoriteCount
}: AchievementsSectionProps) {
  const milestones: Milestone[] = [
    {
      id: 'first-checkin',
      title: 'First Check-in',
      desc: 'You took the first step to notice your mood.',
      icon: '🌱',
      bgClass: 'bg-[#E5F5E8] border-[#A7F3D0] text-[#065F46]',
      unlocked: checkinCount >= 1
    },
    {
      id: 'seven-checkins',
      title: 'Mindful Week',
      desc: 'Seven days of mood check-ins completed.',
      icon: '❤️',
      bgClass: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]',
      unlocked: checkinCount >= 7
    },
    {
      id: 'first-journal',
      title: 'First Journal',
      desc: 'Saved your first private diary entry.',
      icon: '📖',
      bgClass: 'bg-[#EEF3FA] border-[#BFDBFE] text-[#1E3A8A]',
      unlocked: journalCount >= 1
    },
    {
      id: 'week-gratitude',
      title: 'Week of Gratitude',
      desc: 'Noticed small good things for a whole week.',
      icon: '🌞',
      bgClass: 'bg-[#FFF2D8] border-[#FDE68A] text-[#78350F]',
      unlocked: gratitudeCount >= 7
    },
    {
      id: 'first-bookmark',
      title: 'First Saved Resource',
      desc: 'Bookmarked a self-care guide or exercise.',
      icon: '⭐',
      bgClass: 'bg-[#FAF5FF] border-[#E9D5FF] text-[#581C87]',
      unlocked: favoriteCount >= 1
    }
  ];

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Gentle Achievements
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {milestones.map((ms) => (
          <div
            key={ms.id}
            className={`border rounded-2xl p-4 flex items-start gap-3.5 transition-all shadow-3xs ${
              ms.unlocked
                ? `${ms.bgClass} scale-100`
                : 'bg-gray-50/50 border-gray-200 text-gray-400 opacity-60'
            }`}
          >
            <span className="text-[28px] leading-none shrink-0 select-none">
              {ms.unlocked ? ms.icon : '🔒'}
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-black text-[13.5px] leading-tight">
                {ms.title}
              </h4>
              <p className="text-[11.5px] font-semibold leading-relaxed">
                {ms.desc}
              </p>
              {ms.unlocked && (
                <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded">
                  Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
