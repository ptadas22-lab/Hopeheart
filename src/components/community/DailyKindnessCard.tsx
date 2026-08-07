import React, { useEffect, useState } from 'react';

const CHALLENGES = [
  { text: "Compliment someone.", icon: "💛" },
  { text: "Water a plant.", icon: "🌱" },
  { text: "Smile at yourself in the mirror.", icon: "😊" },
  { text: "Check on a friend.", icon: "📞" },
  { text: "Take a short walk.", icon: "🚶" }
];

export default function DailyKindnessCard() {
  const [task, setTask] = useState({ text: "", icon: "" });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('hopeheart_daily_kindness');
    const day = new Date().getDate();
    const taskIdx = day % CHALLENGES.length;
    const selectedTask = CHALLENGES[taskIdx];
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) {
          setTask({ text: parsed.text, icon: parsed.icon });
          setCompleted(!!parsed.completed);
          return;
        }
      } catch (e) {}
    }

    // Initialize daily task
    setTask(selectedTask);
    setCompleted(false);
    localStorage.setItem('hopeheart_daily_kindness', JSON.stringify({
      ...selectedTask,
      date: today,
      completed: false
    }));
  }, []);

  const handleComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    setCompleted(true);
    localStorage.setItem('hopeheart_daily_kindness', JSON.stringify({
      ...task,
      date: today,
      completed: true
    }));
  };

  return (
    <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF9F2] border border-[#F1E7D8]/80 rounded-[28px] p-5 text-left shadow-3xs relative overflow-hidden flex items-start gap-4 select-none">
      <div className="absolute -top-10 -right-6 w-24 h-24 bg-orange-100/20 rounded-full blur-xl" />
      <span className="w-12 h-12 rounded-2xl bg-white border border-[#F1E7D8] flex items-center justify-center text-[24px] shrink-0 shadow-3xs">
        {task.icon || '💛'}
      </span>
      <div className="space-y-1.5 flex-1 relative z-10">
        <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
          Daily Kindness Challenge
        </span>
        <h4 className="font-display font-black text-[#2B1D12] text-[16px] leading-tight">
          {task.text || "Loading challenge..."}
        </h4>
        
        {completed ? (
          <p className="text-[12px] text-emerald-600 font-extrabold flex items-center gap-1.5 pt-1.5 animate-in fade-in duration-200">
            <span>✓</span> Challenged completed! Thank you for sharing kindness.
          </p>
        ) : (
          <button
            onClick={handleComplete}
            type="button"
            className="mt-2 py-1.5 px-4 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[11px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
          >
            I Completed This
          </button>
        )}
      </div>
    </div>
  );
}
