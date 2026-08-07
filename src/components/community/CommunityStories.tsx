import React, { useState, useEffect } from 'react';

interface RecoveryStory {
  id: string;
  title: string;
  summary: string;
  time: string;
  icon: string;
  content: string[];
}

const STORIES: RecoveryStory[] = [
  {
    id: 's-1',
    title: 'Finding Balance in Work Stress',
    summary: 'How learning to pause and scale back demands restored my health and daily happiness.',
    time: '3 min read',
    icon: '🌱',
    content: [
      "For years, I believed that working late and exhausting my energy was the only way to be productive. My physical and mental health paid the price.",
      "The turning point came when I started using HopeHeart. I made a rule to take at least three short 3-minute breaks during the workday. I sat with my coffee, did simple deep breathing, and focused on the present moment.",
      "Today, I prioritize rest. I realized that my self-worth is not tied to performance. Taking breaks actually restored my focus and helped me stay calm."
    ]
  },
  {
    id: 's-2',
    title: 'Bridges to Sit with Grief',
    summary: 'A journey through loss, using memory logs and gentle reflections to heal.',
    time: '4 min read',
    icon: '🤍',
    content: [
      "Losing a loved one left a heavy emptiness in my day. I struggled to talk to people and felt isolated.",
      "I started writing down one happy memory log every day. I named them: 'The way we laughed at the beach', or 'Drinking morning tea together.' This created a safe bridge where I could hold onto the warmth without feeling overwhelmed by sadness.",
      "Grief doesn't disappear, but writing memory reflections helped me carry it with gentleness and grace. Small steps matter."
    ]
  },
  {
    id: 's-3',
    title: 'Navigating Panic in College',
    summary: 'Using sensory grounding and breathing paces to anchor during busy days.',
    time: '2 min read',
    icon: '📚',
    content: [
      "Exam seasons used to trigger intense anxiety for me. My chest would feel heavy and my mind would race.",
      "I discovered the 5-4-3-2-1 grounding exercise. In the middle of the library, I would notice five colors around me, touch my desk, listen to the clock, and breathe. It brought me right back to the physical room.",
      "Now, whenever panic starts, I pause. I anchor my body first. Knowing I have these tools on my phone gives me a deep sense of confidence."
    ]
  }
];

export default function CommunityStories() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeStory, setActiveStory] = useState<RecoveryStory | null>(null);

  useEffect(() => {
    const key = 'hopeheart_story_bookmarks';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('hopeheart_story_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-4 text-left select-none">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Recovery Stories
      </h3>

      {activeStory ? (
        <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 space-y-4 shadow-3xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <button
              onClick={() => setActiveStory(null)}
              type="button"
              className="text-[12px] font-display font-black text-[#FF7527] hover:text-[#E96630] cursor-pointer"
            >
              ← Back to Stories
            </button>
            <span className="text-[11px] text-gray-400 font-bold">{activeStory.time}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[20px] shrink-0 select-none">
              {activeStory.icon}
            </span>
            <h4 className="font-display font-black text-[#2B1D12] text-[16px] leading-tight">
              {activeStory.title}
            </h4>
          </div>

          <div className="space-y-3 text-[13px] text-gray-600 font-semibold leading-relaxed">
            {activeStory.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <button
            onClick={() => setActiveStory(null)}
            type="button"
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-[#2B1D12] rounded-xl text-[12px] font-display font-black cursor-pointer"
          >
            Close Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STORIES.map((story) => {
            const isBookmarked = bookmarks.includes(story.id);
            return (
              <div
                key={story.id}
                className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 text-left shadow-3xs flex flex-col justify-between min-h-[160px] hover:border-[#FFB27A]/35 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-9 h-9 rounded-xl bg-orange-50/50 flex items-center justify-center text-[18px] shrink-0 select-none">
                      {story.icon}
                    </span>
                    <button
                      onClick={(e) => handleToggleBookmark(story.id, e)}
                      type="button"
                      className="text-[#FF7527] p-1 text-[16px] cursor-pointer"
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark story"}
                    >
                      {isBookmarked ? '❤️' : '♡'}
                    </button>
                  </div>

                  <span className="block font-display font-black text-[#2B1D12] text-[14.5px] leading-tight">
                    {story.title}
                  </span>
                  <p className="text-[12px] text-gray-500 font-semibold leading-relaxed line-clamp-2">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-50 mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-bold">{story.time}</span>
                  <button
                    onClick={() => setActiveStory(story)}
                    type="button"
                    className="py-1.5 px-3 bg-white border border-[#FF7527] hover:bg-[#FFF8F2] text-[#FF7527] rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95"
                  >
                    Read Story
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
