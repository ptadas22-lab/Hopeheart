import React, { useState, useEffect, useRef } from 'react';

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

interface BreathingExerciseProps {
  onComplete: () => void;
}

export default function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Core breath cycle logic
  useEffect(() => {
    if (phase === 'idle') {
      setTimeLeft(4);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition phase
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold';
            if (currentPhase === 'hold') return 'exhale';
            if (currentPhase === 'exhale') {
              setCyclesCompleted((c) => {
                const nextCount = c + 1;
                if (nextCount >= 3) {
                  // Complete exercise after 3 cycles (about 36 seconds)
                  setTimeout(() => {
                    handleStop();
                    onComplete();
                  }, 100);
                }
                return nextCount;
              });
              return 'inhale';
            }
            return 'idle';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, onComplete]);

  const handleStart = () => {
    setCyclesCompleted(0);
    setPhase('inhale');
    setTimeLeft(4);
  };

  const handleStop = () => {
    setPhase('idle');
    setCyclesCompleted(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in slowly through your nose... 🌬';
      case 'hold': return 'Hold your breath and stay still... ⚓';
      case 'exhale': return 'Exhale fully through your mouth... 🌬';
      default: return 'Find a comfortable seat. Ready when you are.';
    }
  };

  return (
    <div className="w-full text-center space-y-6 select-none p-5 bg-[#FFFDF9] border border-[#F1E7D8]/80 rounded-[28px]">
      <style dangerouslySetInnerHTML={{ __html: `
        .breath-ring-container {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .breath-outer-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255, 117, 39, 0.08);
          border: 1px solid rgba(255, 117, 39, 0.2);
          transition: transform 4000ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .breath-inner-circle {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF7527, #FFA26B);
          box-shadow: 0 8px 24px rgba(255, 117, 39, 0.25);
          transition: transform 4000ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Scaling rules mapped to cycle phases */
        .breath-inhale .breath-outer-ring {
          transform: scale(1.15);
        }
        .breath-inhale .breath-inner-circle {
          transform: scale(1.6);
        }
        .breath-hold .breath-outer-ring {
          transform: scale(1.15);
        }
        .breath-hold .breath-inner-circle {
          transform: scale(1.6);
        }
        .breath-exhale .breath-outer-ring {
          transform: scale(0.9);
        }
        .breath-exhale .breath-inner-circle {
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .breath-outer-ring, .breath-inner-circle {
            transition: none !important;
            transform: none !important;
          }
        }
      ` }} />

      <div className="space-y-1">
        <h4 className="font-display font-black text-[#2B1D12] text-[17px]">
          🌬 Deep Breathing Exercise
        </h4>
        <p className="text-[12px] text-gray-500 font-semibold max-w-sm mx-auto leading-relaxed">
          Cycle: Inhale 4s, Hold 4s, Exhale 4s. This balances your nervous system.
        </p>
      </div>

      {phase !== 'idle' ? (
        <div className="space-y-6">
          {/* Animated visual elements */}
          <div className={`breath-ring-container breath-${phase}`}>
            <div className="breath-outer-ring" />
            <div className="breath-inner-circle" />
            <span className="absolute text-white font-mono font-black text-[18px]">
              {timeLeft}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[12.5px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">
              {phase}
            </span>
            <p className="text-[14px] font-display font-extrabold text-[#2B1D12] min-h-[24px]">
              {getInstructions()}
            </p>
            <span className="text-[10px] text-gray-400 font-bold block">
              Cycle {cyclesCompleted + 1} of 3
            </span>
          </div>

          <button
            type="button"
            onClick={handleStop}
            className="py-2.5 px-6 bg-[#2B1D12] hover:bg-black text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95"
          >
            Cancel Exercise
          </button>
        </div>
      ) : (
        <div className="py-6 space-y-6">
          <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[32px] mx-auto select-none">
            🌬
          </div>
          <p className="text-[13.5px] text-[#2B1D12] font-semibold">
            Ready to take a gentle breath?
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="py-3 px-8 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-98 shadow-3xs"
          >
            Start Breathing
          </button>
        </div>
      )}
    </div>
  );
}
