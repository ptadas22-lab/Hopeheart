import { useEffect } from 'react';
import { motion } from 'motion/react';
import { MascotWaving, BrandWordmark, BrandDivider } from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      onClick={onFinish}
      className="flex flex-col items-center justify-center min-h-full bg-[#FCFAF5] p-6 text-center select-none cursor-pointer w-full my-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="space-y-6 flex flex-col items-center"
      >
        {/* Mascot Waving */}
        <MascotWaving size={150} className="mx-auto" />
        
        {/* Brand wordmark logo */}
        <div className="flex flex-col items-center space-y-2">
          <BrandWordmark size="text-[36px]" />
          <BrandDivider />
        </div>

        {/* Tagline */}
        <p className="text-[15px] text-gray-500 font-semibold max-w-sm leading-relaxed italic">
          "Find someone safe to share with."
        </p>

        <span className="text-[10px] text-gray-300 font-medium uppercase tracking-widest pt-12 block">
          Tap anywhere to skip
        </span>
      </motion.div>
    </div>
  );
}
