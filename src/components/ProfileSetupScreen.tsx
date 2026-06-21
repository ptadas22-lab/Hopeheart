import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotSitting } from './Logo';

interface ProfileSetupScreenProps {
  initialNickname: string;
  onComplete: (details: {
    nickname: string;
    ageGroup: string;
    role: string;
    interests: string[];
  }) => void;
}

export default function ProfileSetupScreen({ initialNickname, onComplete }: ProfileSetupScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Profile state answers
  const [nickname, setNickname] = useState(initialNickname);
  const [ageGroup, setAgeGroup] = useState('25-34');
  const [gender, setGender] = useState('Prefer not to say');
  const [profession, setProfession] = useState('Prefer not to say');
  const [supportInterest, setSupportInterest] = useState('🌱 General Emotional Support');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [todayNeed, setTodayNeed] = useState('Just explore quietly');

  const ageGroups = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+', 'Prefer not to say'];
  const genders = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
  const professions = ['Student', 'Working Professional', 'Caregiver', 'Retired', 'Homemaker', 'Self-employed', 'Prefer not to say'];
  const interests = [
    '🧠 Anxiety Support',
    '🧓 Parkinson’s Support',
    '👨👩👧 Caregiver Support',
    '👀 Hallucination Support',
    '🌱 General Emotional Support',
    '🤝 I want to support others'
  ];
  const needs = [
    'Someone to listen',
    'Join a support circle',
    'Find resources',
    'Talk with HopeBuddy',
    'Just explore quietly'
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save all answers in localStorage
      localStorage.setItem('hopeheart_profile_nickname', nickname);
      localStorage.setItem('hopeheart_profile_ageGroup', ageGroup);
      localStorage.setItem('hopeheart_profile_gender', gender);
      localStorage.setItem('hopeheart_profile_profession', profession);
      localStorage.setItem('hopeheart_profile_supportInterest', supportInterest);
      localStorage.setItem('hopeheart_profile_phoneNumber', phoneNumber);
      localStorage.setItem('hopeheart_profile_todayNeed', todayNeed);

      // Route to introduction screen
      onComplete({
        nickname: nickname.trim() || 'Companion',
        ageGroup,
        role: supportInterest,
        interests: []
      });
    }
  };

  const handleSkipPhone = () => {
    setPhoneNumber('');
    setCurrentStep(prev => prev + 1);
  };

  // Validation rules
  const canContinue = currentStep === 0 ? nickname.trim().length > 0 : true;

  const renderQuestionContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-[18px] md:text-[20px] font-display font-black text-gray-800">
                What should we call you?
              </h2>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                Use a nickname. You do not need to use your real name.
              </p>
            </div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13.5px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
              required
            />
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-[18px] md:text-[20px] font-display font-black text-gray-800">
                Which age group are you in?
              </h2>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                This helps us keep the space safe and age-appropriate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ageGroups.map(grp => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setAgeGroup(grp)}
                  className={`px-3 py-2.5 rounded-xl text-[12.5px] font-display font-bold border transition-all cursor-pointer ${
                    ageGroup === grp
                      ? 'bg-[#1E1E1A] text-white border-[#1E1E1A] shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-650 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-[18px] md:text-[20px] font-display font-black text-gray-800">
                How would you like to be represented?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {genders.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-3 py-2.5 rounded-xl text-[12.5px] font-display font-bold border transition-all cursor-pointer ${
                    gender === g
                      ? 'bg-[#1E1E1A] text-white border-[#1E1E1A] shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-650 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 font-semibold italic text-center">
              This helps with listener matching. You can change it later.
            </p>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-[18px] md:text-[20px] font-display font-black text-gray-800">
                What best describes you right now?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {professions.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProfession(p)}
                  className={`px-3 py-2.5 rounded-xl text-[12.5px] font-display font-bold border transition-all cursor-pointer ${
                    profession === p
                      ? 'bg-[#1E1E1A] text-white border-[#1E1E1A] shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-650 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-[18px] md:text-[20px] font-display font-black text-gray-800">
                What kind of support are you looking for?
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {interests.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSupportInterest(role)}
                  className={`px-4 py-3 rounded-2xl text-[12.5px] font-display font-bold border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    supportInterest === role
                      ? 'bg-[#FFF2EA] text-[#FF7527] border-[#FF7527] shadow-2xs ring-1 ring-[#FF7527]/10'
                      : 'bg-[#FCFAF5] text-gray-700 border-gray-200 hover:bg-[#FAF6EE] hover:border-gray-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-[18px] md:text-[20px] font-display font-black text-gray-800">
                Add phone number?
              </h2>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                Optional. Used only for account recovery and safety verification.
              </p>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13.5px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
            />
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step-6"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <h2 className="text-[18px] md:text-[20px] font-display font-black text-gray-800">
                What would help you most today?
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {needs.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTodayNeed(n)}
                  className={`px-4 py-3 rounded-2xl text-[12.5px] font-display font-bold border text-left transition-all cursor-pointer ${
                    todayNeed === n
                      ? 'bg-[#FFF2EA] text-[#FF7527] border-[#FF7527] shadow-2xs ring-1 ring-[#FF7527]/10'
                      : 'bg-[#FCFAF5] text-gray-700 border-gray-200 hover:bg-[#FAF6EE] hover:border-gray-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between font-sans select-none w-full">
      {/* Top Header with Progress Dots and Back Button */}
      <div className="flex items-center justify-between py-3 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        {currentStep > 0 ? (
          <button 
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="w-9 h-9 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
        
        {/* Simple Progress Dots */}
        <div className="flex gap-2 items-center justify-center">
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'bg-[#FF7527] scale-125 shadow-xs' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="w-9 h-9 flex items-center justify-center text-[18px]">
          ✨
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center p-4 md:p-6 lg:p-8">
        
        {/* Mascot sitting decoration */}
        <div className="text-center mb-3">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 mx-auto"
          >
            <MascotSitting size={48} />
          </motion.div>
        </div>

        {/* Dynamic setup card */}
        <div className="bg-white border border-[#EDE9DE] p-6 rounded-[32px] shadow-2xs space-y-6 min-h-[320px] flex flex-col justify-between">
          
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {renderQuestionContent()}
            </AnimatePresence>
          </div>

          {/* Footer Action Navigation */}
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            {currentStep === 5 ? (
              <>
                <button
                  type="button"
                  onClick={handleSkipPhone}
                  className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-550 border border-gray-200 rounded-2xl text-[13.5px] font-display font-bold cursor-pointer transition-all text-center"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3.5 bg-[#FF7527] hover:bg-[#E55D13] active:scale-[0.98] text-white rounded-2xl text-[13.5px] font-display font-bold cursor-pointer transition-all shadow-[0_4px_12px_rgba(255,117,39,0.22)]"
                >
                  Continue →
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canContinue}
                className={`w-full py-4 text-white font-display font-bold text-[14.5px] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  canContinue
                    ? 'bg-[#FF7527] hover:bg-[#E55D13] active:scale-[0.98] shadow-[0_4px_12px_rgba(255,117,39,0.22)]'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {currentStep === 6 ? 'Finish Setup →' : 'Continue →'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
