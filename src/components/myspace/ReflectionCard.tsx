import React, { useEffect, useState } from 'react';

export default function ReflectionCard() {
  const [reflectionPoints, setReflectionPoints] = useState<string[]>([]);

  useEffect(() => {
    const points: string[] = [];

    // Analyze mood history
    try {
      const historyStr = localStorage.getItem('hopeheart_mood_history');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentLogs = history.filter((h: any) => {
          const d = new Date(h.date);
          return d >= sevenDaysAgo;
        });

        if (recentLogs.length > 0) {
          points.push(`You checked in ${recentLogs.length} ${recentLogs.length === 1 ? 'time' : 'times'} this week.`);
          
          // Find most frequent mood
          const moodCounts: Record<string, number> = {};
          recentLogs.forEach((h: any) => {
            moodCounts[h.mood] = (moodCounts[h.mood] || 0) + 1;
          });
          
          let topMood = '';
          let maxCount = 0;
          Object.entries(moodCounts).forEach(([m, count]) => {
            if (count > maxCount) {
              maxCount = count;
              topMood = m;
            }
          });
          
          if (topMood) {
            points.push(`You often felt ${topMood.toLowerCase()} in your recent updates.`);
          }
        }
      }
    } catch (e) {}

    // Analyze completed exercises in recent list
    try {
      const recentStr = localStorage.getItem('hopeheart_recent_resources');
      if (recentStr) {
        const recents = JSON.parse(recentStr);
        const breathingCount = recents.filter((id: string) => id === 'breathing').length;
        const groundingCount = recents.filter((id: string) => id === 'grounding').length;
        const breakCount = recents.filter((id: string) => id === 'break-timer').length;

        if (breathingCount > 0) {
          points.push(`You practiced breathing exercises.`);
        }
        if (groundingCount > 0) {
          points.push(`You used sensory grounding to stay present.`);
        }
        if (breakCount > 0) {
          points.push(`You scheduled a quiet break.`);
        }
      }
    } catch (e) {}

    // Fallbacks if no logs exist yet
    if (points.length === 0) {
      points.push("Check-in daily and write reflections to generate personal weekly insights.");
      points.push("Your data stays saved privately on this device.");
    }

    setReflectionPoints(points);
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF9F2] border border-orange-100/70 rounded-[28px] p-5 text-left shadow-3xs relative overflow-hidden flex items-start gap-4 select-none">
      <div className="absolute -top-10 -right-6 w-24 h-24 bg-orange-100/20 rounded-full blur-xl" />
      <span className="w-12 h-12 rounded-2xl bg-white border border-[#F1E7D8] flex items-center justify-center text-[24px] shrink-0 shadow-3xs select-none">
        ⭐
      </span>
      <div className="space-y-2 flex-1 relative z-10">
        <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
          Weekly Reflection
        </span>
        <h4 className="font-display font-black text-[#2B1D12] text-[15.5px] leading-tight">
          Your Self-Care Summary
        </h4>
        <ul className="space-y-1.5 pt-1">
          {reflectionPoints.map((point, idx) => (
            <li key={idx} className="text-[12.5px] text-gray-600 font-semibold leading-relaxed flex items-start gap-2">
              <span className="text-[#FF7527] mt-0.5">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
