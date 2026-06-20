import { motion } from 'motion/react';
import { MascotSitting } from './Logo';

interface CommunityPromiseScreenProps {
  onAccept: () => void;
}

export default function CommunityPromiseScreen({ onAccept }: CommunityPromiseScreenProps) {
  const allowed = [
    'Feelings',
    'Personal stories',
    'Kind words',
    'Lived experiences',
    'Community support',
    'Caregiver support',
    'Hopeful moments'
  ];

  const prohibited = [
    'Prescriptions',
    'Medicine advice',
    'Dosage advice',
    'Diagnosis',
    'Treatment instructions',
    'Fake cure claims',
    'Judgment or abuse'
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between p-5 md:p-8 font-sans select-none w-full">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-6 py-6">
        
        {/* Title Indicator */}
        <div className="text-center space-y-2">
          <motion.div
            animate={{
              y: [0, -6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <MascotSitting size={80} className="mx-auto" />
          </motion.div>
          <h1 className="font-display font-black text-[#2B1D12] text-[24px] md:text-[30px] tracking-tight leading-tight">
            Welcome to a Safe Space
          </h1>
          <p className="text-[14px] text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
            HopeHeart is built on kindness, trust, and emotional support. Please read these community promises before continuing.
          </p>
        </div>

        {/* Responsive Allow/Prohibit Column Splitting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ALLOWED COVENANT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xs"
          >
            <h3 className="font-display font-extrabold text-emerald-800 text-[14px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">✓</span>
              Allowed Space
            </h3>
            <ul className="space-y-2 text-[12.5px] font-semibold text-gray-600">
              {allowed.map((item, id) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + id * 0.06, duration: 0.35 }}
                  className="flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* NOT ALLOWED COVENANT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="bg-white border border-red-100 rounded-3xl p-5 shadow-xs"
          >
            <h3 className="font-display font-extrabold text-red-800 text-[14px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 text-xs flex items-center justify-center font-bold">×</span>
              Not Allowed Here
            </h3>
            <ul className="space-y-2 text-[12.5px] font-semibold text-gray-600">
              {prohibited.map((item, id) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + id * 0.06, duration: 0.35 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Unified Rule Banner */}
        <div className="bg-amber-50 border-2 border-dashed border-amber-200/60 p-5 rounded-3xl text-center shadow-xs">
          <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-widest block mb-1">
            OUR CORE MANDATE
          </span>
          <p className="font-display font-black text-gray-800 text-[15px] sm:text-[16.5px]">
            People support people. AI keeps the space safe. Professionals provide medical care.
          </p>
        </div>

        {/* CTA Options */}
        <div className="space-y-3.5 pt-2">
          <button
            onClick={onAccept}
            id="btn-promise-agree"
            className="w-full py-4 bg-[#FF7527] hover:bg-[#E55D13] active:scale-[0.98] transition-all text-white font-display font-bold text-[16px] rounded-2xl shadow-[0_4px_14px_rgba(255,117,39,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            I Understand & Enter Safely
            <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          
          <div className="text-center">
            <span className="text-[11.5px] text-gray-400 font-semibold leading-relaxed">
              *By continuing, you acknowledge that HopeHeart companion listeners are peer mentors and do not diagnose illnesses.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
