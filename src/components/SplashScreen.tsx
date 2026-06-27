import { motion } from 'motion/react';
import Mascot from './Mascot';
import { BrandWordmark } from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <div
      onClick={onFinish}
      className="relative flex min-h-full w-full items-center justify-center overflow-hidden p-3 sm:p-5 md:p-7 text-center select-none cursor-pointer"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,194,128,0.28)_0%,rgba(255,247,237,0.1)_36%,rgba(255,255,255,0)_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,117,39,0.12)_0%,transparent_34%)] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative flex min-h-[calc(100vh-32px)] sm:min-h-[calc(100vh-48px)] md:min-h-[calc(100vh-64px)] w-full max-w-[1540px] flex-col items-center justify-center overflow-hidden rounded-[34px] sm:rounded-[44px] md:rounded-[56px] border border-orange-200/70 bg-[#FFFDF8]/88 px-5 py-10 shadow-[0_28px_80px_rgba(181,111,45,0.22)] backdrop-blur-sm"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,117,39,0.13) 1px, transparent 0), linear-gradient(135deg, rgba(255,253,248,0.95), rgba(255,248,239,0.92))',
          backgroundSize: '28px 28px, 100% 100%'
        }}
      >
        <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_center,rgba(255,185,114,0.18)_0%,rgba(255,185,114,0.08)_26%,transparent_58%)]" />
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-orange-100/30 blur-3xl" />
        <div className="absolute -right-12 bottom-12 h-48 w-48 rounded-full bg-amber-100/35 blur-3xl" />

        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-7 sm:gap-8">
          <div className="relative h-[190px] w-[250px] sm:h-[220px] sm:w-[300px] md:h-[245px] md:w-[330px]">
            <motion.div
              animate={{ opacity: [0.35, 0.8, 0.35], scale: [0.96, 1.04, 0.96] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB36B]/30 blur-2xl sm:h-52 sm:w-52"
            />
            <motion.span
              animate={{ opacity: [0.35, 1, 0.35], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
              className="absolute left-4 top-20 text-[26px] text-orange-200"
            >
              ♥
            </motion.span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], rotate: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.4 }}
              className="absolute right-8 top-9 text-[28px] text-amber-300"
            >
              ✦
            </motion.span>
            <motion.span
              animate={{ opacity: [0.25, 0.75, 0.25], y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.7 }}
              className="absolute bottom-9 right-2 text-[20px] text-orange-200"
            >
              ♥
            </motion.span>
            <motion.span
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-12 left-8 text-[22px] text-amber-200"
            >
              ✧
            </motion.span>

            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Mascot expression="need-support" size={168} className="sm:scale-110 md:scale-125" />
            </motion.div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <h1 className="drop-shadow-[0_8px_18px_rgba(43,29,18,0.12)]">
              <BrandWordmark size="text-[44px] sm:text-[62px] md:text-[72px]" />
            </h1>

            <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-3 sm:max-w-sm">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-orange-100" />
              <span className="text-[20px] leading-none drop-shadow-sm">🧡</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-orange-200 to-orange-100" />
            </div>

            <p className="font-subheading text-[20px] sm:text-[25px] md:text-[28px] font-semibold italic leading-relaxed text-[#7B8190]">
              “Find someone safe to talk to.”
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0.55 }}
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-3 px-4 sm:bottom-10"
        >
          <span className="h-2 w-2 rounded-full bg-orange-200" />
          <span className="font-sans text-[13px] font-semibold tracking-wide text-gray-400 sm:text-[16px]">
            Tap anywhere to continue <span className="text-[#FF7527]">→</span>
          </span>
          <span className="h-2 w-2 rounded-full bg-orange-200" />
        </motion.div>
      </motion.div>
    </div>
  );
}
