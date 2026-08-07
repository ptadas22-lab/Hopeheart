import React, { useState, useEffect, useRef } from 'react';

interface BreakTimerProps {
  onComplete: () => void;
}

export default function BreakTimer({ onComplete }: BreakTimerProps) {
  const [duration, setDuration] = useState<number | null>(null); // null means setting state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => {
              onComplete();
            }, 2500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, onComplete]);

  const handleStart = (minutes: number) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setDuration(null);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Progress ring math
  const total = duration || 1;
  const percentage = ((total - timeLeft) / total) * 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full text-center space-y-5 select-none p-5 bg-[#FFFDF9] border border-[#F1E7D8]/80 rounded-[28px]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes timer-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .timer-finished-anim {
          animation: timer-pulse 1.2s ease-in-out infinite;
        }
      ` }} />

      <div className="space-y-1">
        <h4 className="font-display font-black text-[#2B1D12] text-[17px]">
          ☕ Take a Short Break
        </h4>
        <p className="text-[12px] text-gray-500 font-semibold max-w-sm mx-auto leading-relaxed">
          Allow yourself a moment to recharge and restore your attention.
        </p>
      </div>

      {duration === null ? (
        <div className="py-4 space-y-4">
          <div className="flex justify-center gap-3">
            {[1, 3, 5].map((mins) => (
              <button
                key={mins}
                onClick={() => handleStart(mins)}
                type="button"
                className="py-3 px-5 bg-white border border-[#F1E7D8] hover:border-[#FF7527] hover:bg-[#FFF8F2] text-[#2B1D12] rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs"
              >
                {mins} {mins === 1 ? 'Min' : 'Mins'}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          {/* Progress circle */}
          <div className={`relative w-36 h-36 flex items-center justify-center ${isFinished ? 'timer-finished-anim' : ''}`}>
            <svg className="w-full h-full transform -rotate-[90deg]">
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 117, 39, 0.08)"
                strokeWidth="8"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="transparent"
                stroke={isFinished ? '#10B981' : '#FF7527'}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              {isFinished ? (
                <span className="text-[28px]">🌿</span>
              ) : (
                <span className="text-[20px] font-mono font-black text-[#2B1D12]">
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
          </div>

          {isFinished ? (
            <p className="text-[13.5px] font-display font-black text-[#0F5132]">
              Break complete. Feel free to return when ready.
            </p>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="py-2.5 px-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePause}
                className="py-2.5 px-6 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95"
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
