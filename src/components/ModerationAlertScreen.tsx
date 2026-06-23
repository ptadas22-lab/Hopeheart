import { motion } from 'motion/react';

interface ModerationAlertScreenProps {
  type: 'moderation' | 'crisis';
  onNavigateTo: (screenId: string) => void;
  onClose: () => void;
}

export default function ModerationAlertScreen({ type, onNavigateTo, onClose }: ModerationAlertScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-transparent justify-between p-5 md:p-8 font-sans select-none w-full">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center space-y-6 py-6">
        
        {/* SCREEN 21: AI SAFETY MODERATION BLOCK */}
        {type === 'moderation' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[28px] mx-auto animate-bounce shadow-inner">
                🛡️
              </div>
              <h2 className="font-display font-black text-amber-950 text-[20px] md:text-[22px] tracking-tight">
                Suggested Change
              </h2>
              <p className="text-[13px] text-gray-700 font-semibold leading-relaxed p-4 bg-amber-50/50 border border-amber-200 rounded-3xl text-left sm:text-center">
                HopeHeart cannot provide diagnosis, prescriptions, dosage advice, treatment instructions, or cure claims. Please speak with a qualified professional.
              </p>
            </div>

            {/* Change suggestion advice card */}
            <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 space-y-3 shadow-xs">
              <span className="text-[10px] font-mono font-extrabold text-amber-700 block uppercase tracking-widest">WHY WAS THIS INTERCEPTED?</span>
              <p className="text-[12.5px] font-semibold text-gray-700 leading-relaxed">
                Type names like generic Xanax, Prozac, Pfizer, paracetamol, or claims of "cures" will lock your message to prevent unlicensed clinical liability blocks.
              </p>
              <div className="bg-[#FFF8F8] border border-red-50 p-3 rounded-xl text-[11.5px] text-red-800 font-semibold leading-relaxed">
                ✓ <strong>Allowed:</strong> "I feel really anxious and heavy tonight."<br />
                ❌ <strong>Prohibited:</strong> "I took 10mg of medication. You should try that dosage."
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] font-display font-black text-white text-[14px] rounded-2xl cursor-pointer shadow-xs text-center transition-colors"
              >
                Adjust Draft Message
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTo('about');
                }}
                className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-bold text-[13px] rounded-xl text-center cursor-pointer"
              >
                Learn Community Rules
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTo('doctor-suggestions');
                }}
                className="w-full py-3 bg-white hover:bg-gray-50 border border-emerald-200 text-emerald-800 font-display font-bold text-[13px] rounded-xl text-center cursor-pointer"
              >
                Open Professional Resources
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 22: CRISIS / UNSAFE MOOD HELPLINE SCREEN */}
        {type === 'crisis' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[28px] mx-auto animate-pulse shadow-inner">
                🚨
              </div>
              <h2 className="font-display font-black text-red-950 text-[20px] md:text-[22.5px] tracking-tight">
                Crisis Safety Notice
              </h2>
              <p className="text-[13.5px] text-gray-700 font-semibold leading-relaxed text-left sm:text-center p-5 bg-red-50/50 border border-red-200 rounded-3xl">
                HopeHeart is not an emergency service. If you or someone else is in immediate danger, contact local emergency services, go to the nearest emergency care center, or reach out to a trusted family member/adult immediately.
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-3.5 pt-2">
              <button
                onClick={onClose}
                className="w-full py-4 bg-[#1E1E1A] hover:bg-black text-[15px] text-white font-display font-black rounded-2.5xl cursor-pointer text-center transition-colors"
              >
                Back to Safe App
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTo('doctor-suggestions');
                }}
                className="w-full py-3 bg-[#FCFAF5] hover:bg-white text-gray-700 border border-gray-200 rounded-xl text-[13px] font-display font-bold text-center cursor-pointer transition-colors"
              >
                Open Professional Resources
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export { ModerationAlertScreen };
