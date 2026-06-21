import { motion } from 'motion/react';
import { MascotSitting } from './Logo';

interface IntroductionScreenProps {
  userName: string;
  onEnter: () => void;
}

export default function IntroductionScreen({ userName, onEnter }: IntroductionScreenProps) {
  const features = [
    { emoji: '🧡', title: 'Meet HopeBuddy', desc: 'Your emotional companion that checks in with you, celebrates progress, and reminds you that you\'re never alone.' },
    { emoji: '🤝', title: 'Connect safely', desc: 'Talk anonymously 1-on-1 with a trusted listener, or join group circles.' },
    { emoji: '🌍', title: 'Explore resources', desc: 'Discover verified external helplines, specialists, and care guides.' },
    { emoji: '🛡️', title: 'Stay protected', desc: 'Feel safe with anonymous boundaries and automatic AI moderation.' }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between p-5 md:p-8 font-sans select-none w-full">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-6 py-4">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 mx-auto mb-2"
          >
            <MascotSitting size={64} />
          </motion.div>
          <h1 className="font-display font-black text-[#2B1D12] text-[24px] md:text-[28px] tracking-tight leading-tight">
            Welcome, {userName} 👋
          </h1>
          <p className="text-[13.5px] text-gray-500 font-semibold max-w-sm mx-auto">
            Here's what you can do inside HopeHeart.
          </p>
        </div>

        {/* Features Rows */}
        <div className="bg-white border border-[#EDE9DE] p-6 rounded-[32px] shadow-2xs space-y-4 max-w-xl mx-auto w-full">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#FCFAF5] border border-gray-100 hover:bg-[#FAF6EE] hover:border-gray-200 transition-colors">
              <span className="text-2xl p-2 bg-white rounded-xl shadow-3xs shrink-0">{feat.emoji}</span>
              <div className="space-y-0.5">
                <h4 className="text-[14px] font-display font-black text-gray-800 leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="w-full max-w-xl mx-auto">
          <button
            onClick={onEnter}
            className="w-full py-4 bg-[#FF7527] hover:bg-[#E55D13] active:scale-[0.98] transition-all text-white font-display font-bold text-[16px] rounded-2xl shadow-[0_4px_14px_rgba(255,117,39,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            Enter HopeHeart
            <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>



      </div>
    </div>
  );
}
