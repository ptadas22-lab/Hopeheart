import React, { useState, useEffect } from 'react';

interface MoodMusicCardProps {
  moodId: string;
  onFallbackOption: () => void;
}

export default function MoodMusicCard({ moodId, onFallbackOption }: MoodMusicCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getMusicInfo = () => {
    switch (moodId) {
      case 'calm':
      case 'hopeful':
        return {
          title: 'Nature Resonance',
          desc: 'Calm instrumental with soft rain & forest resonance.',
          duration: '3:30'
        };
      case 'sad':
      case 'lonely':
      case 'hurt':
        return {
          title: 'Gentle Acoustics',
          desc: 'Soft acoustic guitar chords built for comforting relief.',
          duration: '4:15'
        };
      case 'anxious':
      case 'tired':
      case 'need-support':
      default:
        return {
          title: 'Deep Ambient Slow Chill',
          desc: 'Ambient pads designed for grounding nervous resonance.',
          duration: '5:00'
        };
    }
  };

  const info = getMusicInfo();

  if (audioError) {
    return (
      <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4.5 text-left space-y-3 select-none">
        <span className="text-[13px] font-black text-red-800 block">Music isn't available right now.</span>
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
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">
            Ambient Soundscape
          </span>
          <h4 className="font-display font-black text-gray-800 text-[14.5px] truncate">
            {info.title}
          </h4>
          <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
            {info.desc}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all active-scale ${
            isPlaying ? 'bg-[#FF7527] text-white' : 'bg-orange-50 text-[#FF7527] border border-orange-100'
          }`}
        >
          <span className="text-[16px]">{isPlaying ? '⏸' : '▶'}</span>
        </button>
      </div>

      {isPlaying && (
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF7527] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9.5px] text-gray-400 font-mono">
            <span>Playing</span>
            <span>{info.duration}</span>
          </div>
        </div>
      )}

      {/* Button to simulate audio source error */}
      <button
        type="button"
        onClick={() => setAudioError(true)}
        className="text-[9.5px] text-gray-400 hover:text-gray-600 block text-right w-full font-semibold"
      >
        Simulate playback error
      </button>
    </div>
  );
}
