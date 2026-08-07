import React from 'react';
import { MoodConfig } from '../../types';

interface RecommendedResourcesProps {
  selectedMood: MoodConfig;
  onSelectArticle: (articleId: string) => void;
  onSelectExercise: (exerciseId: string) => void;
}

interface RecommendationItem {
  id: string;
  title: string;
  type: 'article' | 'exercise';
  icon: string;
  description: string;
}

const RECOMMENDATIONS_MAP: Record<string, RecommendationItem[]> = {
  hopeful: [
    { id: 'self-compassion', title: 'Self Compassion', type: 'article', icon: '❤️', description: 'Be kind to yourself in times of change.' },
    { id: 'healthy-habits', title: 'Healthy Habits', type: 'article', icon: '🌞', description: 'Small steps to build lasting daily routines.' },
    { id: 'calm-sounds', title: 'Calm Sounds', type: 'exercise', icon: '🎵', description: 'Listen to ambient, relaxing soundscapes.' }
  ],
  calm: [
    { id: 'healthy-habits', title: 'Healthy Habits', type: 'article', icon: '🌞', description: 'Small steps to build lasting daily routines.' },
    { id: 'break-timer', title: 'Take a Short Break', type: 'exercise', icon: '☕', description: 'Take 1, 3, or 5 minutes just to pause.' }
  ],
  okay: [
    { id: 'emotional-awareness', title: 'Emotional Awareness', type: 'article', icon: '🧠', description: 'Notice and validate your feelings.' },
    { id: 'break-timer', title: 'Take a Short Break', type: 'exercise', icon: '☕', description: 'Take 1, 3, or 5 minutes just to pause.' }
  ],
  low: [
    { id: 'self-compassion', title: 'Self Compassion', type: 'article', icon: '❤️', description: 'Be kind to yourself in times of change.' },
    { id: 'coping-stress', title: 'Coping with Stress', type: 'article', icon: '🌱', description: 'Empathetic strategies to manage daily pressure.' }
  ],
  anxious: [
    { id: 'breathing', title: 'Breathing Exercise', type: 'exercise', icon: '🌬', description: 'Inhale, hold, exhale to center yourself.' },
    { id: 'grounding', title: 'Grounding (5-4-3-2-1)', type: 'exercise', icon: '🧘', description: 'Connect with your immediate surroundings.' },
    { id: 'managing-anxiety', title: 'Managing Anxiety', type: 'article', icon: '💛', description: 'Learn to slow down racing thoughts.' }
  ],
  overwhelmed: [
    { id: 'grounding', title: 'Grounding (5-4-3-2-1)', type: 'exercise', icon: '🧘', description: 'Connect with your immediate surroundings.' },
    { id: 'break-timer', title: 'Take a Short Break', type: 'exercise', icon: '☕', description: 'Take 1, 3, or 5 minutes just to pause.' },
    { id: 'breathing', title: 'Breathing Exercise', type: 'exercise', icon: '🌬', description: 'Inhale, hold, exhale to center yourself.' }
  ],
  sad: [
    { id: 'self-compassion', title: 'Self Compassion', type: 'article', icon: '❤️', description: 'Be kind to yourself in times of change.' },
    { id: 'coping-stress', title: 'Coping with Stress', type: 'article', icon: '🌱', description: 'Empathetic strategies to manage daily pressure.' }
  ],
  tired: [
    { id: 'better-sleep', title: 'Better Sleep', type: 'article', icon: '😴', description: 'Calming wind-down rituals for restful nights.' },
    { id: 'break-timer', title: 'Take a Short Break', type: 'exercise', icon: '☕', description: 'Take 1, 3, or 5 minutes just to pause.' },
    { id: 'calm-sounds', title: 'Calm Sounds', type: 'exercise', icon: '🎵', description: 'Listen to ambient, relaxing soundscapes.' }
  ]
};

export default function RecommendedResources({
  selectedMood,
  onSelectArticle,
  onSelectExercise
}: RecommendedResourcesProps) {
  const moodId = selectedMood?.id || 'calm';
  const recommendations = RECOMMENDATIONS_MAP[moodId.toLowerCase()] || RECOMMENDATIONS_MAP.calm;

  return (
    <div className="space-y-3 select-none text-left">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Recommended For You
        </h3>
        <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
          Based on your latest check-in ({selectedMood.emoji} {selectedMood.label})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="hh-surface border border-[#EDE9DE]/70 rounded-[22px] p-4 text-left shadow-3xs flex flex-col justify-between min-h-[128px] hover:scale-[1.01] hover:border-[#FFB27A]/50 transition-all group"
          >
            <div className="flex gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[20px] shrink-0 select-none">
                {item.icon}
              </span>
              <div className="space-y-0.5 min-w-0">
                <span className="block font-display font-extrabold text-[#2B1D12] text-[14.5px] truncate">
                  {item.title}
                </span>
                <p className="text-[12px] text-gray-500 font-semibold leading-normal line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (item.type === 'article') {
                    onSelectArticle(item.id);
                  } else {
                    onSelectExercise(item.id);
                  }
                }}
                className="py-1.5 px-3.5 bg-white border border-[#FF7527] hover:bg-[#FFF8F2] text-[#FF7527] rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
              >
                {item.type === 'article' ? 'Read More' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
