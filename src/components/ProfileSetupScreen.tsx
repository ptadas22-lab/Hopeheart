import { useState } from 'react';
import { motion } from 'motion/react';
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
  const [nickname, setNickname] = useState(initialNickname);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('25-34');
  const [selectedRole, setSelectedRole] = useState('🌱 General Emotional Support');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onComplete({
      nickname: nickname.trim(),
      ageGroup: selectedAgeGroup,
      role: selectedRole,
      interests: selectedInterests,
    });
  };

  const ageGroups = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

  const roles = [
    { label: '🧠 Anxiety Support', id: '🧠 Anxiety Support' },
    { label: "🧓 Living with Parkinson's", id: "🧓 Living with Parkinson's" },
    { label: '👨👩👧 Caregiver', id: '👨👩👧 Caregiver' },
    { label: '👀 Hallucination Support', id: '👀 Hallucination Support' },
    { label: '🌱 General Emotional Support', id: '🌱 General Emotional Support' }
  ];

  const interests = [
    '🧘 Meditation',
    '🎨 Art',
    '📚 Reading',
    '🚶 Walking',
    '🎵 Music',
    '☕ Coffee Chats',
    '🐶 Pets',
    '🌿 Nature'
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] justify-between p-5 md:p-8 font-sans select-none w-full">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-5 py-4">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 mx-auto mb-1"
          >
            <MascotSitting size={56} />
          </motion.div>
          <h1 className="font-display font-black text-[#2B1D12] text-[22px] md:text-[26px] tracking-tight leading-tight">
            ✨ Complete Your Profile
          </h1>
          <p className="text-[12.5px] text-gray-500 font-semibold max-w-sm mx-auto">
            Let us customize your HopeHeart dashboard to show relevant resources.
          </p>
        </div>

        {/* Profile Setup Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#EDE9DE] p-6 rounded-[32px] space-y-5 shadow-2xs">
          
          {/* Nickname input */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Confirm Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
              required
            />
          </div>

          {/* Age Group chips */}
          <div className="space-y-2">
            <label className="text-[12px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Age Group
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ageGroups.map(grp => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedAgeGroup(grp)}
                  className={`px-3.5 py-2 rounded-xl text-[12px] font-display font-bold border transition-all cursor-pointer ${
                    selectedAgeGroup === grp
                      ? 'bg-[#1E1E1A] text-white border-[#1E1E1A] shadow-xs'
                      : 'bg-[#FCFAF5] text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* Who are you? selector */}
          <div className="space-y-2">
            <label className="text-[12px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Who are you?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roles.map(role => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-4 py-3 rounded-2xl text-[12.5px] font-display font-bold border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF2EA] text-[#FF7527] border-[#FF7527] shadow-2xs ring-1 ring-[#FF7527]/10'
                        : 'bg-[#FCFAF5] text-gray-700 border-gray-200 hover:bg-[#FAF6EE] hover:border-gray-300'
                    }`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests multi-select */}
          <div className="space-y-2">
            <label className="text-[12px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-2.5 rounded-xl text-[12px] font-display font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#FF7527] text-white border-[#FF7527] shadow-xs'
                        : 'bg-[#FCFAF5] text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{interest}</span>
                    {isSelected && <span className="text-[10px] font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!nickname.trim()}
            className={`w-full py-4 text-white font-display font-bold text-[15px] rounded-2xl transition-all shadow-[0_4px_14px_rgba(255,117,39,0.3)] flex items-center justify-center gap-2 cursor-pointer ${
              nickname.trim()
                ? 'bg-[#FF7527] hover:bg-[#E55D13] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            Complete Setup & Go to Home
            <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </form>

        {/* Onboarding Progress Indicator */}
        <div className="w-full max-w-md mx-auto mt-4 pt-4 border-t border-[#EDE9DE]/65 flex flex-col items-center gap-1 select-none">
          <span className="text-[9.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-widest">
            Step 3 of 3
          </span>
          <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-400">
            <span>Welcome</span>
            <span>→</span>
            <span>Login</span>
            <span>→</span>
            <span className="text-[#FF7527] font-black">Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}
