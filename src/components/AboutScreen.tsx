import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotFace } from './Logo';

interface AboutScreenProps {
  onBack: () => void;
  onAcceptDisclaimer: () => void;
}

export default function AboutScreen({ onBack, onAcceptDisclaimer }: AboutScreenProps) {
  const [panel, setPanel] = useState<'about' | 'disclaimer'>('about');

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={panel === 'disclaimer' ? () => setPanel('about') : onBack}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {panel === 'about' ? 'About HopeHeart' : 'Medical Disclaimer'}
        </span>
        <MascotFace size={26} className="shrink-0" />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 26: ABOUT SCREEN */}
          {panel === 'about' && (
            <motion.div
              key="about-story"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center md:text-left space-y-1">
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">OUR WORLDWIDE STORY</span>
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
                  Feel heard. Find support. Reach care.
                </h2>
                <p className="text-[13px] text-gray-500 font-semibold leading-relaxed">
                  HopeHeart is a trust-first emotional healthcare application built to stand beside companions managing panic, anxious grief, isolation, chronic tremors, or caregiver exhaustion.
                </p>
              </div>

              {/* Belief Creed blocks */}
              <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 md:p-6 space-y-4 shadow-xs">
                <h4 className="font-display font-bold text-gray-800 text-[15px] border-b border-gray-100 pb-2.5">
                  The Trust-First Philosophy
                </h4>
                
                <p className="text-[13px] text-gray-650 leading-relaxed font-semibold">
                  We believe that professional therapy is vital, but communities provide the offline daily warmth that shelters people from spiraling.
                </p>

                <p className="text-[13px] text-gray-650 leading-relaxed font-semibold">
                  By matching raw peer emotional conversations with localized community circles, we restore humanity back to healthcare.
                </p>

                <div className="bg-[#FFF2EA] border border-orange-100 rounded-2xl p-4.5 text-center">
                  <span className="text-[10px] font-mono font-extrabold text-[#FF7527] block tracking-widest mb-1">THE TRIPLE DECREE</span>
                  <p className="font-display font-black text-gray-800 text-[15.5px]">
                    Community supports. AI protects. Professionals provide care.
                  </p>
                </div>
              </div>

              {/* Volunteer guidelines */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-gray-800 text-[14px] px-1">How peer volunteers work:</h4>
                <div className="p-4 bg-[#FAF8F5] border border-gray-150 rounded-2xl text-[12.5px] text-gray-500 font-semibold leading-relaxed space-y-2">
                  <p>• Volunter listeners must complete safe conversational training models before helping peers.</p>
                  <p>• Our real-time Safe AI monitors chats continually to verify that no prescriptions, clinical drug dosages, or diagnoses occur inside community spaces.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setPanel('disclaimer')}
                  className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] font-[#FCFAF5] font-display font-black text-white text-[14px] rounded-2xl transition-colors cursor-pointer text-center shadow-xs"
                >
                  Review Medical Disclaimer
                </button>
              </div>

            </motion.div>
          )}

          {/* SCREEN 27: MEDICAL DISCLAIMER SCREEN */}
          {panel === 'disclaimer' && (
            <motion.div
              key="disclaimer-terms"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <div className="text-[40px] animate-pulse">⚖️</div>
                <h3 className="font-display font-black text-gray-800 text-[20px] md:text-[22px]">
                  HopeHeart Medical Disclaimer
                </h3>
                <p className="text-[13px] text-gray-500 font-semibold">
                  Please read this clinical boundary mandate carefully before trusting advice.
                </p>
              </div>

              {/* Comprehensive Terms banner */}
              <div className="bg-white border border-red-150 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm text-[12.5px] font-semibold text-gray-650 leading-relaxed">
                <p className="text-red-900 font-bold border-b border-red-50 pb-2">
                  🔴 HopeHeart is NOT a diagnosis, prescription, or clinical crisis hospital service.
                </p>

                <p>
                  Any peer conversation matching, caregiver room comment, post share, voice memo, or local circle meetup description found on HopeHeart is strictly for peer-to-peer emotional wellness companion support.
                </p>

                <p>
                  Our peer listeners and moderators are not clinical doctors, licensed counselors, pharmacists, or emergency assistance line agents.
                </p>

                <p className="bg-[#FAF7F0] p-3 rounded-xl border border-gray-100 font-sans italic">
                  "Only certified, locally registered healthcare clinicians and therapists can legally write drug prescriptions, adjust medical dosages, construct diagnostic mental profiles, or propose clinical cures."
                </p>

                <p>
                  If you are managing physical clinical tremors, clinical panic, manic depression, or thoughts of self-harm, immediately close this App and consult an emergency room practitioner directory or phone dialer.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={onAcceptDisclaimer}
                  className="w-full py-4 bg-[#1E1E1A] hover:bg-black text-[#FCFAF5] font-display font-black text-[15px] rounded-2.5xl cursor-pointer transition-colors text-center shadow-sm"
                >
                  I Understand & Accept Disclaimer
                </button>
                <button
                  type="button"
                  onClick={() => setPanel('about')}
                  className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-bold text-[13px] rounded-2xl cursor-pointer text-center"
                >
                  Back to Story Creed
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
export { AboutScreen };
