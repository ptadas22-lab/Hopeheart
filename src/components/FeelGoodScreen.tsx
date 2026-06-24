import { useRef, useState } from 'react';
import { ScreenId } from '../types';

interface FeelGoodScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: ScreenId) => void;
}

export default function FeelGoodScreen({ onBack, onNavigateTo }: FeelGoodScreenProps) {
  const [isHumming, setIsHumming] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const humTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopHum = () => {
    setIsHumming(false);
    if (humTimerRef.current) clearTimeout(humTimerRef.current);
    try {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      if (audioCtxRef.current?.state !== 'closed') audioCtxRef.current?.close();
    } catch {
      // Audio may already be stopped by the browser.
    } finally {
      oscillatorRef.current = null;
      audioCtxRef.current = null;
      humTimerRef.current = null;
    }
  };

  const playHum = async () => {
    if (isHumming) {
      stopHum();
      return;
    }
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    if (ctx.state === 'suspended') await ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    oscillatorRef.current = osc;
    osc.start();
    setIsHumming(true);
    humTimerRef.current = setTimeout(stopHum, 8000);
  };
  const options = [
    { label: 'Make me smile', emoji: '😊', detail: 'Tiny light prompts for a softer minute.', action: () => undefined },
    { label: 'Calm my mind', emoji: '🫧', detail: 'Pause, breathe, and choose one small next step.', action: () => onNavigateTo(ScreenId.Mood) },
    { label: 'Play calming hum', emoji: '🎵', detail: isHumming ? 'The gentle hum is playing.' : 'Use the HopeBuddy hum for a few seconds.', action: playHum },
    { label: 'Write privately', emoji: '📝', detail: 'Open a private writing space.', action: () => onNavigateTo(ScreenId.MySpace) },
    { label: 'Save a good memory', emoji: '🌼', detail: 'Capture one okay moment for later.', action: () => onNavigateTo(ScreenId.MySpace) },
    { label: 'Read something gentle', emoji: '📚', detail: 'Comforting resources with no pressure.', action: () => onNavigateTo(ScreenId.DoctorSuggestions) },
    { label: 'Remember my strengths', emoji: '💛', detail: 'Return to what helps you keep going.', action: () => onNavigateTo(ScreenId.MySpace) },
    { label: 'Do something I like', emoji: '✨', detail: 'Pick one small interest or comfort activity.', action: () => undefined }
  ];

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button onClick={onBack} type="button" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs">
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Feel Good</span>
        <span className="text-[20px] select-none">🌤️</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 text-center space-y-2">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Feel better privately first</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">No pressure to talk. Choose something small and gentle.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => (
            <button key={option.label} type="button" onClick={option.action} className="hh-surface rounded-2xl p-4 text-left hover:bg-[#FFF8F2] transition-all cursor-pointer active:scale-[0.99] space-y-2">
              <span className="text-[24px] block">{option.emoji}</span>
              <h3 className="font-display font-black text-gray-800 text-[14px]">{option.label}</h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">{option.detail}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
