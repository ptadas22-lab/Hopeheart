import React from 'react';

interface ResourceDetailScreenProps {
  articleId: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export interface ArticleData {
  id: string;
  title: string;
  summary: string;
  time: string;
  icon: string;
  color: string;
  content: string[];
}

export const ARTICLES_DB: Record<string, ArticleData> = {
  'managing-anxiety': {
    id: 'managing-anxiety',
    title: 'Managing Anxiety',
    summary: 'Learn to slow down racing thoughts and center yourself.',
    time: '3 min read',
    icon: '💛',
    color: 'bg-amber-100 text-amber-700',
    content: [
      "Anxiety is a natural defense mechanism that sometimes becomes overly sensitive. When your system senses danger—even if it is just a stressful email or a busy room—it goes into high alert.",
      "When you notice racing thoughts, a pounding chest, or shallow breaths, remind yourself: 'My body is trying to protect me, but I am safe right now.' Resisting anxiety often makes it feel stronger. Instead, try to sit with the physical sensations and let them peak and fade naturally.",
      "You don't need to fix your feelings or solve your worries right this second. Drop your shoulders, unclamp your jaw, and take three slow, long exhalations. Your body knows how to calm itself if you give it time."
    ]
  },
  'coping-stress': {
    id: 'coping-stress',
    title: 'Coping with Stress',
    summary: 'Empathetic strategies to manage daily pressure.',
    time: '4 min read',
    icon: '🌱',
    color: 'bg-emerald-100 text-emerald-700',
    content: [
      "Stress occurs when the demands placed on us exceed our capacity to handle them. Over time, chronic stress can leave us feeling depleted and disconnected.",
      "Coping with stress begins with a simple question: 'What can wait?' Often, we carry invisible weights that do not belong to today. Make a list of everything on your mind, then cross off everything that does not require immediate attention.",
      "Give yourself permission to do less. Step away from your tasks, stretch your body, and take a short walk. Productive rest is not earned—it is a basic human need. You are allowed to take up space without performing."
    ]
  },
  'better-sleep': {
    id: 'better-sleep',
    title: 'Better Sleep',
    summary: 'Calming wind-down rituals for restful nights.',
    time: '3 min read',
    icon: '😴',
    color: 'bg-indigo-100 text-indigo-700',
    content: [
      "Sleep is the ultimate form of physical and emotional recovery. However, drifting off can be difficult when our brains are still processing the day.",
      "Create a clear border between day and night. Try to put away screens at least 30 minutes before sleep, as blue light signals to your brain that it is still daytime. Instead, engage in quiet activities like reading a book, listening to soft ambient sounds, or writing down tomorrow's list on paper.",
      "If you find yourself lying awake with racing thoughts, do not force yourself to sleep. Instead, focus entirely on breathing out slowly. Exhaling activates the parasympathetic nervous system, easing your heart rate and preparing your body for rest."
    ]
  },
  'emotional-awareness': {
    id: 'emotional-awareness',
    title: 'Emotional Awareness',
    summary: 'Notice and validate your feelings without judgment.',
    time: '2 min read',
    icon: '🧠',
    color: 'bg-purple-100 text-purple-700',
    content: [
      "Emotional awareness is the simple yet profound practice of noticing what you are feeling as it happens.",
      "Instead of trying to change or fix a heavy mood, try simply naming it: 'I feel tired,' 'I feel low,' or 'I feel anxious.' Naming the feeling shifts your brain's response from reactive to observational. It reminds you that you are the observer, not the emotion itself.",
      "All emotions are temporary visitors. They arrive, stay for a while, and eventually depart. You do not need to push them away. Let them flow through you like clouds passing in a wide, calm sky."
    ]
  },
  'self-compassion': {
    id: 'self-compassion',
    title: 'Self Compassion',
    summary: 'Be kind to yourself in times of change and difficulty.',
    time: '3 min read',
    icon: '❤️',
    color: 'bg-rose-100 text-rose-700',
    content: [
      "Self-compassion means treating yourself with the same warmth, care, and understanding that you would offer to a dear friend who is going through a hard time.",
      "When we make mistakes or feel low, we often default to self-criticism. We tell ourselves we should be stronger or doing better. But healing requires kindness, not criticism. The next time things feel hard, say to yourself: 'This is a moment of struggle. I am doing my best, and that is enough.'",
      "You do not have to be perfect to be worthy of love and comfort. Breathe in comfort, and breathe out self-judgment."
    ]
  },
  'healthy-habits': {
    id: 'healthy-habits',
    title: 'Building Healthy Habits',
    summary: 'Small, incremental steps to build lasting daily routines.',
    time: '5 min read',
    icon: '🌞',
    color: 'bg-orange-100 text-orange-700',
    content: [
      "Routines and habits anchor our days, providing a sense of stability and control during chaotic times.",
      "The secret to building lasting habits is starting incredibly small. Do not try to overhaul your entire life in one day. Focus on micro-habits: drink one glass of water on waking, do two minutes of stretching, or write down one positive thought before bed.",
      "Stack your new habit on top of an existing routine (e.g. 'After I make my morning tea, I will take three deep breaths'). Over time, these small actions compound, creating a solid foundation of daily well-being."
    ]
  }
};

export default function ResourceDetailScreen({
  articleId,
  onBack,
  isFavorite,
  onToggleFavorite
}: ResourceDetailScreenProps) {
  const article = ARTICLES_DB[articleId];

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center min-h-[50vh]">
        <span className="text-[48px]">⚠️</span>
        <h4 className="font-display font-black text-[#2B1D12] text-[18px]">Article Not Found</h4>
        <button
          onClick={onBack}
          className="py-2.5 px-6 bg-[#FF7527] text-white rounded-xl text-[13px] font-display font-black"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleCopyInsights = () => {
    const text = `${article.title}\n\n${article.content.join('\n\n')}\n\nShared from HopeHeart.`;
    navigator.clipboard.writeText(text)
      .then(() => alert('Insights copied to clipboard safely.'))
      .catch(() => alert('Failed to copy.'));
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label="Back to Wellness Hub"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[14.5px] uppercase tracking-tight truncate max-w-[180px]">
          {article.title}
        </span>
        <button
          onClick={() => onToggleFavorite(articleId)}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#FF7527] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label={isFavorite ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <span className="text-[17px]">{isFavorite ? '❤️' : '♡'}</span>
        </button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-5 space-y-6 text-left pb-24">
        <div className="flex items-center gap-4">
          <span className={`w-14 h-14 rounded-2xl ${article.color} flex items-center justify-center text-[28px] shrink-0 shadow-3xs`}>
            {article.icon}
          </span>
          <div className="space-y-1">
            <h1 className="font-display font-black text-[#2B1D12] text-[24px] leading-tight">
              {article.title}
            </h1>
            <span className="text-[12px] text-gray-400 font-bold block">
              {article.time}
            </span>
          </div>
        </div>

        <blockquote className="border-l-4 border-[#FF7527] pl-4 py-1.5 text-[14px] text-[#A05412] font-semibold italic bg-orange-50/30 rounded-r-xl">
          {article.summary}
        </blockquote>

        <div className="space-y-4 text-[14px] sm:text-[14.5px] text-gray-700 font-medium leading-relaxed">
          {article.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyInsights}
            type="button"
            className="w-full sm:w-auto py-2.5 px-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            📋 Copy insights
          </button>
          <button
            onClick={onBack}
            type="button"
            className="w-full sm:w-auto py-2.5 px-6 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center"
          >
            Return to Wellness Hub
          </button>
        </div>
      </div>
    </div>
  );
}
