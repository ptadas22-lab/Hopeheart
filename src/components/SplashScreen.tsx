import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BrandWordmark, BrandDivider } from './Logo';
import Mascot from './Mascot';

interface SplashScreenProps {
  onFinish: () => void;
}

const MOOD_EXPRESSIONS: ('need-support' | 'calm' | 'lonely' | 'hurt')[] = [
  'need-support', // 😊 Happy (sparkling open eyes & huge open happy mouth)
  'calm',         // 😌 Calm (happy curved eyes & soft smiling mouth)
  'lonely',       // 🥹 Caring (shiny black upward eyes & soft cheeks)
  'hurt'          // 🥰 Supportive (soft closed comforting eyes & blushing cheeks)
];

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [expressionIndex, setExpressionIndex] = useState(0);

  // Rotate facial expression every second (Happy -> Calm -> Caring -> Supportive)
  useEffect(() => {
    const interval = setInterval(() => {
      setExpressionIndex((prev) => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentExpression = MOOD_EXPRESSIONS[expressionIndex];

  return (
    <div 
      onClick={onFinish}
      className="flex flex-col items-center justify-between min-h-full bg-transparent p-5 sm:p-6 md:p-8 text-center select-none cursor-pointer w-full my-auto py-10 md:py-12"
    >
      {/* Spacer to push content to middle */}
      <div className="h-4" />

      {/* Main mascot & text content */}
      <div className="space-y-6 flex flex-col items-center w-full overflow-hidden">
        {/* Animated HopeBuddy walking & waving */}
        <motion.div
          animate={{
            x: [250, 0, 0, -250],
            rotate: [0, -6, 6, -6, 6, 0, 0, 0, -6, 6, -6, 6, 0]
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="mx-auto flex justify-center items-center"
        >
          <Mascot expression={currentExpression} size={150} />
        </motion.div>
        
        {/* Brand wordmark logo using Nunito ExtraBold */}
        <div className="flex flex-col items-center space-y-2">
          <BrandWordmark size="text-[36px]" className="font-heading font-extrabold" />
          <BrandDivider />
        </div>

        {/* Tagline using Quicksand SemiBold */}
        <p className="font-subheading font-semibold text-[15px] sm:text-[16px] text-gray-500 max-w-sm leading-relaxed">
          "Find someone safe to talk to."
        </p>
      </div>

      {/* Bottom text with better visibility using Inter Medium */}
      <motion.div 
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="w-full text-center pb-2"
      >
        <span className="font-sans font-medium text-[13px] text-gray-400 tracking-wider">
          Tap anywhere to continue →
        </span>
      </motion.div>
    </div>
  );
}
