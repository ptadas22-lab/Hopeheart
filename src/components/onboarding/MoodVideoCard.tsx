import React, { useState, useEffect } from 'react';

interface MoodVideoCardProps {
  moodId: string;
  onFallbackOption: () => void;
}

export default function MoodVideoCard({ moodId, onFallbackOption }: MoodVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getVideoInfo = () => {
    switch (moodId) {
      case 'anxious':
      case 'stressed':
      case 'tired':
        return {
          title: '2-minute Calming Reset',
          desc: 'A breathing guidance ring that contracts and expands to align heart rates.',
          duration: '2:00'
        };
      case 'sad':
      case 'lonely':
        return {
          title: 'Gentle Comfort Loop',
          desc: 'A quiet visual journey through soft cloud landscapes and morning sunshine.',
          duration: '3:00'
        };
      default:
        return {
          title: 'Mindfulness Nature Visual',
          desc: 'Slow-motion video of water ripples and glowing sunlight reflections.',
          duration: '2:30'
        };
    }
  };

  const info = getVideoInfo();

  if (videoError) {
    return (
      <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4.5 text-left space-y-3 select-none">
        <span className="text-[13px] font-black text-red-800 block">Video unavailable right now.</span>
        <button
          type="button"
          onClick={onFallbackOption}
          className="py-2 px-4 bg-white border border-red-200 text-red-700 text-[11.5px] font-display font-black rounded-xl cursor-pointer"
        >
          Try a breathing exercise instead
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5.5 text-left shadow-3xs space-y-4 select-none animate-in fade-in duration-200">
      {!isPlaying ? (
        <div className="space-y-3.5">
          <div className="aspect-video w-full rounded-2xl bg-[#FAF7F0] border border-[#E9E4D9] flex items-center justify-center p-4 relative overflow-hidden group">
            {/* Visual background gradient pattern simulating video frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/30 to-amber-50/20" />
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="w-14 h-14 rounded-full bg-white text-[#FF7527] flex items-center justify-center text-[22px] shadow-sm z-10 transition-all active-scale hover:bg-orange-50 cursor-pointer"
            >
              ▶
            </button>
            <span className="absolute bottom-3.5 right-3.5 text-[9.5px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded-md">
              {info.duration}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">
              Calming Visual Guide
            </span>
            <h4 className="font-display font-black text-gray-800 text-[14.5px]">
              {info.title}
            </h4>
            <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
              {info.desc}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5 animate-in zoom-in-95 duration-200">
          <div className="aspect-video w-full rounded-2xl bg-black border border-gray-900 flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
            {/* Pulsing breathing bubble simulation */}
            <div className="w-20 h-20 rounded-full bg-[#FF7527]/25 flex items-center justify-center animate-ping duration-[3000ms] absolute" />
            <div className="w-16 h-16 rounded-full bg-[#FF7527]/40 flex items-center justify-center z-10 text-white font-display font-black text-[13px] animate-pulse">
              Breathe
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="absolute top-3 right-3 text-white/75 hover:text-white text-[12px] font-black cursor-pointer bg-white/10 w-7 h-7 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
              <div
                className="h-full bg-[#FF7527] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-gray-500 font-bold">Playing visual meditation...</span>
            <button
              onClick={() => setIsPlaying(false)}
              className="text-[#FF7527] font-display font-black hover:underline cursor-pointer"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Button to simulate error states */}
      <button
        type="button"
        onClick={() => setVideoError(true)}
        className="text-[9.5px] text-gray-400 hover:text-gray-600 block text-right w-full font-semibold"
      >
        Simulate video failure
      </button>
    </div>
  );
}
