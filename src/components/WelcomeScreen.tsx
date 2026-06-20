import { motion } from 'motion/react';
import Mascot from './Mascot';
import { PrimaryLogo, BrandDivider, MascotSitting } from './Logo';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between p-5 md:p-8 font-sans select-none w-full">
      
      {/* Brand logo at the very top (always visible & centered/aligned on mobile) */}
      <div className="block md:hidden text-center mb-2 shrink-0">
        <PrimaryLogo className="scale-90 mx-auto" />
        <div className="mt-2 text-center">
          <BrandDivider />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-2 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center max-w-5xl mx-auto w-full">
          
          {/* LEFT COLUMN: Main copy & interaction (Always displays first on desktop, and spans 7 cols) */}
          <div className="md:col-span-7 flex flex-col space-y-4 md:space-y-6 text-center md:text-left justify-center">
            
            {/* Desktop Brand Logo (hidden on mobile) */}
            <div className="hidden md:block">
              <PrimaryLogo />
              <div className="mt-3">
                <BrandDivider />
              </div>
            </div>

            {/* Mascot on mobile: displayed in-between logo and message, compact size (hidden on desktop) */}
            <div className="flex md:hidden items-center justify-center py-1">
              <div className="bg-white border border-[#EDE9DE] rounded-2xl p-3 shadow-xs flex items-center gap-4 max-w-sm w-full">
                <MascotSitting size={64} />
                <div className="text-left">
                  <span className="text-[10px] font-mono font-bold text-[#FF7527] uppercase tracking-wider">
                    HopeBuddy
                  </span>
                  <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed mt-0.5">
                    Meet HopeBuddy. A small companion that checks in with you, celebrates progress, and reminds you that you're never alone.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[14px] sm:text-[15px] md:text-[17px] text-gray-600 font-semibold leading-relaxed">
                Tell us how you're feeling today. We'll help you find support that feels right for you.
              </p>
            </div>

            <div className="space-y-3.5">
              <button
                onClick={onStart}
                id="btn-start-heart-check"
                className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] active:scale-[0.98] transition-all text-white font-display font-bold text-[16px] sm:text-[17px] rounded-2xl shadow-[0_4px_14px_rgba(255,117,39,0.22)] flex items-center justify-center gap-2 cursor-pointer"
              >
                Begin Check-In
                <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Trust Chips */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 py-0.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EDE9DE] rounded-full text-[12px] font-semibold text-gray-600 shadow-xs">
                  <span>🔒</span> Private
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EDE9DE] rounded-full text-[12px] font-semibold text-gray-600 shadow-xs">
                  <span>🤝</span> Trust First
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EDE9DE] rounded-full text-[12px] font-semibold text-gray-600 shadow-xs">
                  <span>🧡</span> No Judgement
                </span>
              </div>

              <div className="bg-[#FAF7F0] border border-[#ECE6D9] py-3 px-4 rounded-xl text-center md:text-left shadow-xs">
                <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
                  HopeHeart provides emotional support only. It does not replace professional medical care.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Soft responsive desktop mascot card (hidden on mobile, spans 5 cols) */}
          <div className="hidden md:flex md:col-span-5 items-center justify-center">
            <motion.div
              className="bg-white hover:bg-[#FFFDF9] border border-[#EDE9DE] rounded-3xl p-6 shadow-sm flex flex-col items-center w-full max-w-[290px] transition-all border-dashed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <Mascot expression="calm" size={130} />
              <div className="mt-5 text-center space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#FF7527] uppercase tracking-wider">
                  HopeBuddy
                </span>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-normal">
                  Meet HopeBuddy. A small companion that checks in with you, celebrates progress, and reminds you that you're never alone.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

    </div>
  );
}
