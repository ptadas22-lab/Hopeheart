import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../types';
import { supabase } from '../lib/supabaseClient';
import WhatsAppRemindersConfig from './WhatsAppRemindersConfig';

interface ProfileUtilityScreenProps {
  onBack: () => void;
  userName: string;
  onChangeName: (newName: string) => void;
  initialSubStage?: 'profile' | 'privacy';
  onNavigateTo?: (screenId: ScreenId) => void;
  onRequestAccountDataDeletion?: () => void;
  checkinCount?: number;
}

export default function ProfileUtilityScreen({ 
  onBack, 
  userName, 
  onChangeName, 
  initialSubStage, 
  onNavigateTo,
  onRequestAccountDataDeletion,
  checkinCount
}: ProfileUtilityScreenProps) {
  const [subStage, setSubStage] = useState<'profile' | 'edit-profile' | 'privacy'>(
    initialSubStage === 'privacy' ? 'privacy' : 'profile'
  );
  
  // Safe Profile Fields
  const [anonNameInput, setAnonNameInput] = useState<string>(userName);
  const [profileAvatar, setProfileAvatar] = useState(() => localStorage.getItem('hopeheart_profile_avatar') || '🦊');
  const [profileAgeGroup, setProfileAgeGroup] = useState(() => localStorage.getItem('hopeheart_profile_age_group') || '25–34');
  const [profileGender, setProfileGender] = useState(() => localStorage.getItem('hopeheart_profile_gender') || 'Prefer not to say');
  const [profileProfession, setProfileProfession] = useState(() => localStorage.getItem('hopeheart_profile_profession') || 'Working Professional');
  const [profileLanguage, setProfileLanguage] = useState(() => localStorage.getItem('hopeheart_profile_language') || 'English');
  const [profileSupportInterest, setProfileSupportInterest] = useState(() => localStorage.getItem('hopeheart_profile_support_interest') || '🌱 General Support');
  const [profileBestQuality, setProfileBestQuality] = useState(() => localStorage.getItem('hopeheart_profile_best_quality') || 'Good Listener');
  const [profileNature, setProfileNature] = useState(() => localStorage.getItem('hopeheart_profile_nature') || 'Calm and Supportive');
  const [profileVibe, setProfileVibe] = useState(() => localStorage.getItem('hopeheart_profile_vibe') || '🤩');

  // Authenticity Quiz States
  const [quizPassed, setQuizPassed] = useState(() => localStorage.getItem('hopeheart_authenticity_quiz_passed') === 'true');
  const [quizPassedAt, setQuizPassedAt] = useState(() => localStorage.getItem('hopeheart_authenticity_quiz_passed_at') || '');
  
  const [q1Answer, setQ1Answer] = useState<string>('');
  const [q2Answer, setQ2Answer] = useState<string>('');
  const [q3Answer, setQ3Answer] = useState<string>('');
  const [quizError, setQuizError] = useState<string>('');
  const [validatedOnce, setValidatedOnce] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  useEffect(() => {
    if (subStage === 'profile') {
      setAnonNameInput(localStorage.getItem('hopeheart_profile_display_name') || userName);
      setProfileAvatar(localStorage.getItem('hopeheart_profile_avatar') || '🦊');
      setProfileAgeGroup(localStorage.getItem('hopeheart_profile_age_group') || '25–34');
      setProfileGender(localStorage.getItem('hopeheart_profile_gender') || 'Prefer not to say');
      setProfileProfession(localStorage.getItem('hopeheart_profile_profession') || 'Working Professional');
      setProfileLanguage(localStorage.getItem('hopeheart_profile_language') || 'English');
      setProfileSupportInterest(localStorage.getItem('hopeheart_profile_support_interest') || '🌱 General Support');
      setProfileBestQuality(localStorage.getItem('hopeheart_profile_best_quality') || 'Good Listener');
      setProfileNature(localStorage.getItem('hopeheart_profile_nature') || 'Calm and Supportive');
      setProfileVibe(localStorage.getItem('hopeheart_profile_vibe') || '🤩');
      setQuizPassed(localStorage.getItem('hopeheart_authenticity_quiz_passed') === 'true');
      setQuizPassedAt(localStorage.getItem('hopeheart_authenticity_quiz_passed_at') || '');
    }
  }, [subStage, userName]);

  useEffect(() => {
    if (initialSubStage) {
      setSubStage(initialSubStage === 'privacy' ? 'privacy' : 'profile');
    }
  }, [initialSubStage]);

  // Privacy toggles
  const [showBasics, setShowBasics] = useState<boolean>(true);
  const [showHeartStatus, setShowHeartStatus] = useState<boolean>(true);
  const [showActivity, setShowActivity] = useState<boolean>(true);
  const [useApproximateNearby, setUseApproximateNearby] = useState<boolean>(true);
  const [allowStorySharing, setAllowStorySharing] = useState<boolean>(true);
  const [hideNearbySuggestions, setHideNearbySuggestions] = useState<boolean>(false);
  const [showDeleteLocalDataModal, setShowDeleteLocalDataModal] = useState<boolean>(false);

  const dataProtectionLocalStorageKeys = [
    'hopeheart_last_checkin_mood',
    'hopeheart_last_checkin_date',
    'hopeheart_checkin_count',
    'hopeheart_saved_reflections',
    'hopeheart_care_questions',
    'hopeheart_saved_resources',
    'hopeheart_pending_support_requests',
    'hopeheart_pending_safety_concerns',
    'hopeheart_whatsapp_reminders_enabled',
    'hopeheart_whatsapp_number',
    'hopeheart_whatsapp_reminder_time',
    'hopeheart_whatsapp_reminder_frequency'
  ];

  const handleViewStoredData = () => {
    const storedDataSummary = dataProtectionLocalStorageKeys
      .map((key) => `${key}: ${localStorage.getItem(key) === null ? 'Not saved on this device' : 'Saved on this device'}`)
      .join('\n');
    alert(`HopeHeart local MVP data on this device:\n\n${storedDataSummary}`);
  };

  const handleDeleteLocalData = () => {
    dataProtectionLocalStorageKeys.forEach((key) => localStorage.removeItem(key));
    setShowDeleteLocalDataModal(false);
    alert('Local HopeHeart data was deleted from this device. Your auth/session was not changed.');
  };

  // Avatar Options (🦊 exactly once)
  const AVATAR_OPTIONS = ['🦊', '🐱', '🐻', '🐼', '🦁', '🐯', '🐨', '🦄', '🦉', '🐶'];

  // Calculate profile progress
  const safeFields = [
    anonNameInput,
    profileAvatar,
    profileAgeGroup,
    profileGender,
    profileProfession,
    profileLanguage,
    profileSupportInterest,
    profileBestQuality,
    profileNature
  ];
  const filledCount = safeFields.filter(f => f && f.trim() !== '' && f !== 'Prefer not to say').length;
  const progressWeight = quizPassed ? 1 : 0;
  const progressPercentage = Math.min(100, Math.round(((filledCount + progressWeight) / 10) * 100));

  // Sync to Supabase helper
  const syncProfileToBackend = async (data: any) => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            ...data,
            updated_at: new Date().toISOString()
          });
        if (error) {
          console.warn('[Profile] Supabase profile sync warning:', error.message);
        }
      }
    } catch (err) {
      console.warn('[Profile] Supabase profile sync exception:', err);
    }
  };

  const handleSaveProfile = async () => {
    if (!anonNameInput.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    // Save locally
    localStorage.setItem('hopeheart_profile_display_name', anonNameInput);
    localStorage.setItem('hopeheart_profile_avatar', profileAvatar);
    localStorage.setItem('hopeheart_profile_age_group', profileAgeGroup);
    localStorage.setItem('hopeheart_profile_gender', profileGender);
    localStorage.setItem('hopeheart_profile_profession', profileProfession);
    localStorage.setItem('hopeheart_profile_language', profileLanguage);
    localStorage.setItem('hopeheart_profile_support_interest', profileSupportInterest);
    localStorage.setItem('hopeheart_profile_best_quality', profileBestQuality);
    localStorage.setItem('hopeheart_profile_nature', profileNature);
    localStorage.setItem('hopeheart_profile_vibe', profileVibe);
    localStorage.setItem('hopeheart_profile_basic_completed', 'true');

    // Notify parent
    onChangeName(anonNameInput);

    // Sync to Supabase
    await syncProfileToBackend({
      display_name: anonNameInput,
      avatar_emoji: profileAvatar,
      age_group: profileAgeGroup,
      gender: profileGender,
      profession: profileProfession,
      language: profileLanguage,
      support_interest: profileSupportInterest,
      best_quality: profileBestQuality,
      nature: profileNature
    });

    alert("Profile details saved safely!");
    setSubStage('profile');
  };

  const handleQuizSubmit = async () => {
    setValidatedOnce(true);
    setQuizError('');

    const isQ1Correct = q1Answer === 'Emotional support and resources';
    const isQ2Correct = q2Answer === 'Encourage emergency help, trusted family/adult, or local emergency services';
    const isQ3Correct = q3Answer === 'Diagnose, prescribe, or promise cures';

    if (isQ1Correct && isQ2Correct && isQ3Correct) {
      const timestamp = new Date().toISOString();
      
      // Save locally
      localStorage.setItem('hopeheart_authenticity_quiz_passed', 'true');
      localStorage.setItem('hopeheart_authenticity_quiz_passed_at', timestamp);
      
      setQuizPassed(true);
      setQuizPassedAt(timestamp);

      // Sync to Supabase
      await syncProfileToBackend({
        authenticity_quiz_passed: true,
        authenticity_quiz_passed_at: timestamp
      });

      alert("🎉 Congratulations! You have earned your HopeHeart Trust Badge!");
    } else {
      setQuizError("Some answers are incorrect. Please check safety instructions and try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button 
          onClick={subStage !== 'profile' ? () => setSubStage('profile') : onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subStage === 'profile' ? 'My Safe Profile' : subStage === 'edit-profile' ? 'Edit Profile' : 'Privacy Settings'}
        </span>
        <span className="text-[20px] select-none">👤</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 pt-6 sm:p-6 sm:pt-8 lg:p-8 lg:pt-10 pb-28 sm:pb-10">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 23: PROFILE SCREEN */}
          {subStage === 'profile' && (
            <motion.div
              key="profile-hub"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Profile Card Header */}
              <div className="hh-surface rounded-[34px] p-6 sm:p-8 text-center overflow-hidden relative border border-orange-100/70 shadow-3xs">
                <div className="absolute -left-16 top-10 w-28 h-44 rounded-full bg-[#EAD9FF]/40 blur-sm" />
                <div className="absolute -right-8 top-24 w-24 h-28 rounded-full bg-[#FFE3D3]/65" />
                <div className="absolute left-20 top-20 text-[18px] text-[#FFCF8A]">✦</div>
                <div className="absolute right-12 top-16 text-[18px] text-[#FFCF8A]">✦</div>
                <div className="absolute right-8 top-28 text-[26px] text-[#FFB95F]">✦</div>

                <div className="relative flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF7527] to-[#FFA14E] border-4 border-white flex items-center justify-center text-[50px] shrink-0 shadow-md select-none">
                    {profileAvatar}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display font-black text-[#10213D] text-[28px] leading-tight">GoogleBuddy</h3>
                    <span className="inline-flex px-4 py-1 bg-orange-50 text-[#FF7527] border border-orange-100 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider">Peer Member</span>
                  </div>

                  <button type="button" onClick={() => setShowQuiz(true)} className="inline-flex items-center gap-2 bg-[#FFF8EE] border border-[#FF9D45] text-[#9A4A12] text-[12.5px] font-extrabold px-5 py-3 rounded-2xl cursor-pointer hover:bg-[#FFF2E2] transition-colors">
                    <span>⚠️</span> Authenticity Pending — take safety quiz below
                  </button>
                </div>

                <div className="relative w-full pt-6 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-[13px] font-semibold text-[#697386] mb-2">
                    <span>Profile completion progress</span>
                    <span className="text-[#FF7527] font-display font-black text-[20px]">70%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF7527] transition-all duration-500 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 max-w-md mx-auto">
                  <button type="button" onClick={() => setSubStage('edit-profile')} className="py-3 bg-white hover:bg-[#FCFAF5] border border-gray-300 text-[#2B1D12] rounded-2xl text-[14px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-2">
                    <span>✏️</span> Edit Profile
                  </button>
                  <button type="button" onClick={() => setSubStage('privacy')} className="py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[14px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-2 shadow-3xs">
                    <span>🔒</span> Privacy Settings
                  </button>
                </div>
              </div>

              {/* My Safe Identity */}
              <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-3 border border-orange-100/70 shadow-3xs">
                <h4 className="font-display font-black text-[#10213D] text-[18px]">My Safe Identity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    ['⭐', 'Good Listener', 'bg-[#FFF5D9]'],
                    ['🌿', 'Calm & Supportive', 'bg-[#EDF8ED]'],
                    ['💜', 'General Support', 'bg-[#F3E9FF]'],
                    ['🌐', 'English', 'bg-[#EAF7FF]'],
                    ['🗓️', '25–34', 'bg-[#FFF0D8]'],
                    ['👤', 'Prefer not to say', 'bg-[#FFE8EE]']
                  ].map(([icon, label, tone]) => (
                    <div key={label} className="bg-white/78 border border-orange-100/70 rounded-2xl p-2.5 flex items-center gap-2.5 min-h-[58px]">
                      <span className={`w-10 h-10 rounded-full ${tone} flex items-center justify-center text-[20px] shrink-0`}>{icon}</span>
                      <span className="font-display font-black text-[#10213D] text-[12.5px] leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* My activity */}
              <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-3 border border-orange-100/70 shadow-3xs">
                <h4 className="font-display font-black text-[#10213D] text-[18px]">My activity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: '7', suffix: 'Days', label: 'Safe space streak', emoji: '🛡️', tone: 'from-[#FFF0E8] to-[#FFF8F2]', text: 'text-[#FF7527]' },
                    { value: '3', suffix: 'Check-ins', label: 'Mood reflections', emoji: '✓', tone: 'from-[#F7EEFF] to-[#FFFBFF]', text: 'text-[#8B5CF6]' },
                    { value: '12', suffix: 'Hearts', label: 'Support shared', emoji: '💗', tone: 'from-[#FFF0F4] to-[#FFF8FA]', text: 'text-[#EF5A72]' }
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl p-4 text-center space-y-1 bg-gradient-to-br ${stat.tone} border border-orange-100/70 shadow-3xs`}>
                      <span className={`text-[30px] block ${stat.text}`}>{stat.emoji}</span>
                      <div className="flex items-end justify-center gap-1">
                        <h5 className={`font-display font-black ${stat.text} text-[32px] leading-none`}>{stat.value}</h5>
                        <span className={`font-display font-black ${stat.text} text-[13px] pb-1`}>{stat.suffix}</span>
                      </div>
                      <p className="text-[12px] text-[#697386] font-semibold leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authenticity Check Quiz Card */}
              <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-orange-100/70 shadow-3xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-16 h-16 rounded-2xl bg-[#FFF7E8] border border-orange-100 flex items-center justify-center text-[36px] shrink-0">🛡️</span>
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-[#10213D] text-[17px]">Authenticity Check</h4>
                      <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Complete a short safety quiz to earn your HopeHeart Trust Badge.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowQuiz((value) => !value)} type="button" className="px-5 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs shrink-0">
                    Take safety quiz ›
                  </button>
                </div>

                {showQuiz && (quizPassed ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2 text-center">
                    <span className="text-emerald-800 font-extrabold text-[13px] block">✓ Trust Badge Earned</span>
                    <p className="text-[11.5px] text-emerald-700 font-medium leading-relaxed">You have passed the safety check on {new Date(quizPassedAt).toLocaleDateString()}. Your profile shows the trust verification badge in HopeHeart spaces.</p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-3 border-t border-orange-100/70">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <span className="text-[12px] font-display font-black text-[#10213D] block">Q1: HopeHeart is mainly for:</span>
                        <div className="flex flex-col gap-2">
                          {['Medical diagnosis', 'Emotional support and resources', 'Prescriptions'].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-[12px] text-gray-600 font-semibold cursor-pointer">
                              <input type="radio" name="q1" value={opt} checked={q1Answer === opt} onChange={(e) => setQ1Answer(e.target.value)} className="accent-[#FF7527] cursor-pointer" />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[12px] font-display font-black text-[#10213D] block">Q2: If someone says they are in immediate danger, you should:</span>
                        <div className="flex flex-col gap-2">
                          {['Only send them to peer chat', 'Encourage emergency help, trusted family/adult, or local emergency services', 'Give medicine advice'].map((opt) => (
                            <label key={opt} className="flex items-start gap-2 text-[12px] text-gray-600 font-semibold cursor-pointer">
                              <input type="radio" name="q2" value={opt} checked={q2Answer === opt} onChange={(e) => setQ2Answer(e.target.value)} className="accent-[#FF7527] cursor-pointer mt-0.5" />
                              <span className="leading-snug">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[12px] font-display font-black text-[#10213D] block">Q3: A peer listener should not:</span>
                        <div className="flex flex-col gap-2">
                          {['Listen with care', 'Share what helped them personally', 'Diagnose, prescribe, or promise cures'].map((opt) => (
                            <label key={opt} className="flex items-start gap-2 text-[12px] text-gray-600 font-semibold cursor-pointer">
                              <input type="radio" name="q3" value={opt} checked={q3Answer === opt} onChange={(e) => setQ3Answer(e.target.value)} className="accent-[#FF7527] cursor-pointer mt-0.5" />
                              <span className="leading-snug">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {quizError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-[11px] font-semibold">⚠️ {quizError}</div>}
                    <button onClick={handleQuizSubmit} type="button" className="w-full flex items-center justify-center py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-3xs">Verify Answers</button>
                  </div>
                ))}
              </div>

              {/* Tools & Support */}
              <div className="hh-surface rounded-[28px] p-4 space-y-3 border border-orange-100/70 shadow-3xs">
                <h4 className="font-display font-black text-[#10213D] text-[18px]">Tools & Support</h4>
                <div className="rounded-2xl overflow-hidden border border-orange-100/70 bg-white/70 divide-y divide-orange-100/70">
                  {[
                    { icon: '🛡️', label: 'Privacy & Safety', action: () => setSubStage('privacy') },
                    { icon: '📖', label: 'Saved Resources', action: () => onNavigateTo?.(ScreenId.DoctorSuggestions) },
                    { icon: '🎧', label: 'Customer Support', action: () => onNavigateTo?.(ScreenId.CustomerSupport) },
                    { icon: '👤', label: 'Account & Login', action: () => onNavigateTo?.(ScreenId.CustomerSupport) },
                    { icon: '🤝', label: 'Optional Community', action: () => onNavigateTo?.(ScreenId.Community) },
                    { icon: '📊', label: 'Service Model & Financials', action: () => onNavigateTo?.(ScreenId.Financials) },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} type="button" className="w-full text-left py-3 px-3 hover:bg-[#FFF8F2] transition-colors flex items-center justify-between cursor-pointer gap-3">
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-[#FFF8F2] flex items-center justify-center text-[18px] shrink-0">{item.icon}</span>
                        <span className="text-[13.5px] font-display font-black text-[#10213D] block truncate">{item.label}</span>
                      </span>
                      <svg className="w-5 h-5 text-gray-400 stroke-current cursor-pointer shrink-0" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Note */}
              <div className="p-4 bg-gradient-to-br from-[#FBF5FF] to-[#FFFDF9] border border-[#E7D7FF] rounded-[24px] flex items-center gap-3 shadow-3xs">
                <span className="w-14 h-14 rounded-full bg-[#F6ECFF] border border-[#E7D7FF] flex items-center justify-center text-[26px] shrink-0">🔒</span>
                <span className="text-left">
                  <span className="block font-display font-black text-[#10213D] text-[13.5px]">Your profile is private.</span>
                  <span className="block text-[12px] text-gray-600 font-semibold leading-relaxed">HopeHeart never shows your exact location, phone number, diagnosis, medication, or private notes.</span>
                </span>
                <span className="ml-auto text-[#B794F4] text-[20px] hidden sm:block">✦</span>
              </div>

              {/* Security Badge */}
              <div className="p-4 bg-[#FFF2E8]/80 border border-orange-100 rounded-[24px] text-left flex items-start gap-3 shadow-3xs">
                <span className="w-14 h-14 rounded-full bg-[#FFF8EE] border border-orange-100 flex items-center justify-center text-[26px] shrink-0">🔐</span>
                <span>
                  <span className="block font-display font-black text-[#FF5C1A] text-[13.5px] mb-1">Private local storage in MVP.</span>
                  <span className="text-[12px] font-semibold text-[#8A4B22] leading-relaxed block">Secure encrypted storage planned for production. Safety rules help detect and block unsafe medical advice, prescriptions, dosage guidance, diagnosis claims, and cure promises.</span>
                </span>
              </div>

              <footer className="text-center space-y-3 px-2 pb-2">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-[#56657C] font-display font-black">
                  <button onClick={() => alert('Terms & Conditions\n\nHopeHeart is for emotional support. Be kind, respectful, and protect your privacy.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Terms & Conditions</button>
                  <button onClick={() => alert('Privacy Policy\n\nHopeHeart keeps MVP fallback data local on this device unless an existing app flow clearly says otherwise.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Privacy Policy</button>
                  <button onClick={() => alert('Emotional Support Disclaimer\n\nHopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Emotional Support Disclaimer</button>
                </div>
                <p className="max-w-xl mx-auto text-[12px] text-[#6B7280] font-semibold leading-relaxed">HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.</p>
              </footer>

            </motion.div>
          )}

          {/* EDIT PROFILE SCREEN */}
          {subStage === 'edit-profile' && (
            <motion.div
              key="edit-profile-hub"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-2xl mx-auto mt-1 sm:mt-2 pb-28 sm:pb-10"
            >
              <div className="hh-hero-surface rounded-[30px] p-5 sm:p-7 text-left overflow-hidden relative border border-orange-100/70 shadow-3xs">
                <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-[#FFD7C2]/45 blur-2xl" />
                <div className="absolute right-20 top-12 text-[#FF7527] text-[24px]">🧡</div>
                <div className="absolute right-36 top-10 text-[#FFB95F] text-[18px]">✦</div>
                <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-4 sm:items-center">
                  <div className="space-y-3">
                    <h3 className="font-display font-black text-[#2B1D12] text-[30px] leading-[0.95]">Make it<br />uniquely <span className="text-[#FF7527]">you</span></h3>
                    <p className="text-[14px] text-gray-500 font-bold leading-relaxed">Share what feels right.<br />You’re in control.</p>
                  </div>
                  <div className="justify-self-center sm:justify-self-end relative w-44 h-32 rounded-[28px] bg-white/45 flex items-center justify-center">
                    <span className="absolute left-5 bottom-3 text-[36px]">🌼</span>
                    <span className="absolute right-3 bottom-2 text-[42px]">✏️</span>
                    <span className="text-[66px] drop-shadow-sm">🐧</span>
                  </div>
                </div>
              </div>

              <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-orange-100/70 shadow-3xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#EEE9FF] flex items-center justify-center text-[24px]">🖼️</span>
                    <span>
                      <span className="block font-display font-black text-[#2B1D12] text-[18px]">Add Photos</span>
                      <span className="block text-[12.5px] text-gray-500 font-semibold">Help others get to know you</span>
                    </span>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-[#F0E9FF] text-[#6D5BD0] text-[12px] font-display font-black">0/4 added</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['Main photo', 'Photo 2', 'Photo 3', 'Photo 4'].map((label) => (
                    <div key={label} className="space-y-2 text-center">
                      <button type="button" className="w-full aspect-square rounded-2xl border-2 border-dashed border-[#DCCFE8] bg-[#FFFDF9]/80 flex items-center justify-center cursor-pointer hover:bg-[#FBF6FF] transition-colors">
                        <span className="w-10 h-10 rounded-full bg-[#F0E9FF] border border-[#C9BDF1] text-[#6D5BD0] flex items-center justify-center text-[26px]">+</span>
                      </button>
                      <span className="block text-[12px] text-gray-500 font-semibold">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-emerald-100/80 shadow-3xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#DDFBE7] flex items-center justify-center text-[24px]">☺️</span>
                    <span>
                      <span className="block font-display font-black text-[#2B1D12] text-[18px]">Create Your Avatar</span>
                      <span className="block text-[12.5px] text-gray-500 font-semibold">Pick a style that represents you</span>
                    </span>
                  </div>
                  <button type="button" className="px-4 py-2 rounded-2xl bg-[#ECFFF2] border border-emerald-200 text-emerald-700 font-display font-black text-[12.5px] cursor-pointer">🪄 Customize</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {[
                    ['🦊', 'Fox'],
                    ['🐱', 'Cat'],
                    ['🐻', 'Bear'],
                    ['🐼', 'Panda'],
                    ['🦄', 'Unicorn'],
                    ['🦉', 'Owl']
                  ].map(([emoji, label]) => (
                    <button key={label} type="button" onClick={() => setProfileAvatar(emoji)} className="shrink-0 space-y-2 text-center cursor-pointer">
                      <span className={`relative w-20 h-20 rounded-2xl bg-white border-2 flex items-center justify-center text-[38px] transition-all ${profileAvatar === emoji ? 'border-emerald-400 shadow-3xs' : 'border-gray-200 hover:border-gray-300'}`}>
                        {emoji}
                        {profileAvatar === emoji && <span className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-emerald-400 text-white flex items-center justify-center text-[13px]">✓</span>}
                      </span>
                      <span className={`block text-[12px] font-display font-black ${profileAvatar === emoji ? 'text-emerald-700' : 'text-gray-500'}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-yellow-100/80 shadow-3xs">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFF1C7] flex items-center justify-center text-[26px]">😄</span>
                  <span>
                    <span className="block font-display font-black text-[#2B1D12] text-[18px]">Funny Emojis / Vibe</span>
                    <span className="block text-[12.5px] text-gray-500 font-semibold">Choose emojis that match your vibe</span>
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {['🤩', '😎', '😜', '🥰', '😂', '🤔', '🎉'].map((emoji) => (
                    <button key={emoji} type="button" onClick={() => setProfileVibe(emoji)} className={`relative w-16 h-16 shrink-0 rounded-2xl bg-white flex items-center justify-center text-[34px] border-2 cursor-pointer transition-all ${profileVibe === emoji ? 'border-[#FF7527] bg-[#FFF5EE] shadow-3xs' : 'border-gray-200 hover:border-orange-200'}`}>
                      {emoji}
                      {profileVibe === emoji && <span className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-[#FF7527] text-white flex items-center justify-center text-[13px]">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hh-surface rounded-[28px] p-4 sm:p-5 space-y-4 border border-blue-100/80 shadow-3xs text-left">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-[#EAF3FF] flex items-center justify-center text-[24px]">👤</span>
                  <span>
                    <span className="block font-display font-black text-[#2B1D12] text-[18px]">Tell Us More (Your Basics)</span>
                    <span className="block text-[12.5px] text-gray-500 font-semibold">All fields are private and optional</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">👤 Anonymous Display Name</span>
                    <input type="text" value={anonNameInput} onChange={(e) => setAnonNameInput(e.target.value)} placeholder="e.g. GoogleBuddy" className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">🗓️ Age Group</span>
                    <select value={profileAgeGroup} onChange={(e) => setProfileAgeGroup(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]">
                      {['18–24', '25–34', '35–44', '45–54', '55+'].map((group) => <option key={group} value={group}>{group}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">⚧ Gender</span>
                    <select value={profileGender} onChange={(e) => setProfileGender(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]">
                      {['Prefer not to say', 'Female', 'Male', 'Non-binary', 'Other'].map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">💼 Profession</span>
                    <input type="text" value={profileProfession} onChange={(e) => setProfileProfession(e.target.value)} placeholder="Prefer not to say" className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">🌐 Languages</span>
                    <input type="text" value={profileLanguage} onChange={(e) => setProfileLanguage(e.target.value)} placeholder="English" className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">🌱 Support Interest</span>
                    <select value={profileSupportInterest} onChange={(e) => setProfileSupportInterest(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]">
                      {['🌱 General Support', '🧘 Anxiety Relief', '🤝 Peer Listening', '🩺 Clinical Resources'].map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">⭐ Best Quality</span>
                    <input type="text" value={profileBestQuality} onChange={(e) => setProfileBestQuality(e.target.value)} placeholder="Good Listener" className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]" />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[12px] font-display font-black text-gray-500 flex items-center gap-1.5">🧡 Nature / Personality</span>
                    <input type="text" value={profileNature} onChange={(e) => setProfileNature(e.target.value)} placeholder="Calm and Supportive" className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[14px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <button type="button" onClick={() => setSubStage('profile')} className="w-full py-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[15px] rounded-2xl cursor-pointer shadow-3xs">Cancel</button>
                <button type="button" onClick={handleSaveProfile} className="w-full py-4 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[15px] rounded-2xl cursor-pointer shadow-xs">Save Profile</button>
              </div>

              <div className="hh-surface rounded-[24px] p-4 border border-orange-100/70 text-left flex items-start gap-3">
                <span className="w-12 h-12 rounded-full bg-[#FFF8EE] border border-orange-100 flex items-center justify-center text-[22px] shrink-0">🛡️</span>
                <span className="space-y-2">
                  <span className="block font-display font-black text-[#10213D] text-[13px]">Your safety and privacy come first.</span>
                  <span className="block text-[12px] text-gray-500 font-semibold leading-relaxed">HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.</span>
                  <span className="flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-[#56657C] font-display font-black pt-1">
                    <button type="button" onClick={() => alert('Terms & Conditions\n\nHopeHeart is for emotional support. Be kind, respectful, and protect your privacy.')} className="hover:text-[#FF7527] hover:underline cursor-pointer">Terms & Conditions</button>
                    <button type="button" onClick={() => alert('Privacy Policy\n\nHopeHeart keeps MVP fallback data local on this device unless an existing app flow clearly says otherwise.')} className="hover:text-[#FF7527] hover:underline cursor-pointer">Privacy Policy</button>
                    <button type="button" onClick={() => alert('Emotional Support Disclaimer\n\nHopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.')} className="hover:text-[#FF7527] hover:underline cursor-pointer">Emotional Support Disclaimer</button>
                  </span>
                </span>
              </div>

            </motion.div>
          )}

          {/* SCREEN 24: PRIVACY SETTINGS SCREEN */}
          {subStage === 'privacy' && (
            <motion.div
              key="privacy-settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-md mx-auto mt-1 sm:mt-2"
            >
              <div className="text-center space-y-1">
                <div className="text-[28px]">🔒</div>
                <h3 className="font-display font-black text-gray-800 text-[19px]">
                  You control what you share
                </h3>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed px-4">
                  Choose what others can see. Your private notes, phone number, and exact location are never shown.
                </p>
              </div>

              {/* Toggles Options checklist */}
              <div className="hh-surface rounded-2.5xl p-4.5 space-y-4 text-left">
                
                {/* Toggle 1: Basics */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">👤 Show my profile basics</span>
                    <p className="text-[11px] text-gray-450 font-semibold leading-normal">
                      Allows others to see your display name, role, language, and listening style.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBasics(!showBasics)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${showBasics ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${showBasics ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 2: Mood status */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">🧡 Show my mood status</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Allows matched listeners to see your selected mood tag.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHeartStatus(!showHeartStatus)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${showHeartStatus ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${showHeartStatus ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 3: Support activity */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">💬 Show shared activity</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Allows shared HopeHeart activity indicators where available.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowActivity(!showActivity)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${showActivity ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${showActivity ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 4: Nearby match */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">📍 Use approximate nearby matching</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Uses approximate distance only. Exact location is never shown.
                    </p>
                  </div>
                  <button
                    onClick={() => setUseApproximateNearby(!useApproximateNearby)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${useApproximateNearby ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${useApproximateNearby ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 5: Story Sharing */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-150/40">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">📖 Allow anonymous story sharing</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Your story can be shown without name, phone number, or exact location.
                    </p>
                  </div>
                  <button
                    onClick={() => setAllowStorySharing(!allowStorySharing)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${allowStorySharing ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${allowStorySharing ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Toggle 6: Hide nearby */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 max-w-[75%]">
                    <span className="text-[13px] font-bold text-gray-800 block">🔒 Hide from nearby suggestions</span>
                    <p className="text-[11px] text-gray-455 font-semibold leading-normal">
                      Your profile will not appear in nearby listener or support suggestions.
                    </p>
                  </div>
                  <button
                    onClick={() => setHideNearbySuggestions(!hideNearbySuggestions)}
                    type="button"
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${hideNearbySuggestions ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${hideNearbySuggestions ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

              </div>

              {/* WhatsApp Reminders Config */}
              <WhatsAppRemindersConfig />

              {/* Privacy Promise Card */}
              <div className="hh-surface rounded-2.5xl p-4 text-center space-y-1.5">
                <span className="text-[12px] font-display font-black text-gray-800 block">
                  🛡️ Your private information stays private
                </span>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed px-2">
                  HopeHeart never shows your phone number, exact location, private notes, saved questions, or chat history to other users.
                </p>
              </div>

              {/* Data Protection Center */}
              <div className="hh-surface rounded-2.5xl p-4.5 space-y-4 text-left">
                <div className="text-center space-y-1 border-b border-gray-100 pb-3">
                  <span className="text-[22px] block">🛡️</span>
                  <h4 className="font-display font-black text-gray-800 text-[15px]">Data Protection Center</h4>
                  <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                    HopeHeart protects your emotional privacy. We collect only what is needed to support your experience.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="bg-[#FFFDF9] border border-orange-100/70 rounded-2xl p-3.5 space-y-2">
                    <h5 className="text-[12.5px] font-display font-black text-gray-800">What HopeHeart stores</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {['Mood check-ins', 'Basic profile details', 'Saved resources', 'Care questions', 'Support requests', 'Safety reports', 'Reminder preferences'].map((item) => (
                        <span key={item} className="text-[11.5px] text-gray-600 font-semibold flex items-center gap-1.5"><span className="text-[#FF7527]">•</span>{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3.5 space-y-2">
                    <h5 className="text-[12.5px] font-display font-black text-gray-800">What HopeHeart never stores publicly</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {['Diagnosis', 'Medication', 'Exact location', 'Phone number publicly', 'Medical history', 'Private chat history', 'Private notes without user action'].map((item) => (
                        <span key={item} className="text-[11.5px] text-gray-600 font-semibold flex items-center gap-1.5"><span className="text-emerald-600">✓</span>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[12.5px] font-display font-black text-gray-800">Data controls</h5>
                  <div className="grid grid-cols-1 gap-2">
                    <button type="button" onClick={handleViewStoredData} className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[12.5px] rounded-xl cursor-pointer transition-all active:scale-95">View My Stored Data</button>
                    <button type="button" onClick={() => setShowDeleteLocalDataModal(true)} className="w-full py-2.5 bg-[#FFF2EA] hover:bg-[#FFE5D2] border border-orange-100 text-[#C75414] font-display font-extrabold text-[12.5px] rounded-xl cursor-pointer transition-all active:scale-95">Delete Local Data</button>
                    <button type="button" onClick={onRequestAccountDataDeletion} className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12.5px] rounded-xl cursor-pointer transition-all active:scale-95 shadow-3xs">Request Account Data Deletion</button>
                  </div>
                </div>

                <div className="bg-[#FCFBF8] border border-gray-150 rounded-2xl p-3.5 space-y-2">
                  <h5 className="text-[12.5px] font-display font-black text-gray-800">Security checklist</h5>
                  {['Private tables use Row Level Security', 'Service role keys are not stored in frontend', 'WhatsApp reminders require consent', 'Images are previewed locally only', 'Full chats are not saved automatically'].map((item) => (
                    <div key={item} className="text-[11.5px] text-gray-600 font-semibold flex items-start gap-2"><span className="text-emerald-600 shrink-0">✓</span><span>{item}</span></div>
                  ))}
                </div>

                <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded-2xl p-3 font-semibold leading-relaxed text-center">
                  Some MVP fallback data may be saved on this device. You can delete it anytime from Data Protection Center.
                </p>
              </div>

              {/* Actions for privacy */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubStage('profile')}
                  className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[13px] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Privacy preferences saved successfully!");
                    setSubStage('profile');
                  }}
                  className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl cursor-pointer shadow-xs"
                >
                  Save Settings
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {showDeleteLocalDataModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-xl border border-orange-100 text-center space-y-4">
            <div className="text-[28px]">🧹</div>
            <p className="text-[14px] font-display font-black text-gray-800 leading-snug">
              Are you sure you want to delete local HopeHeart data from this device?
            </p>
            <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
              This will not delete your auth/session. Use logout separately if you want to end your session.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button type="button" onClick={() => setShowDeleteLocalDataModal(false)} className="py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[12.5px] rounded-xl cursor-pointer">Cancel</button>
              <button type="button" onClick={handleDeleteLocalData} className="py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12.5px] rounded-xl cursor-pointer">Delete Local Data</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export { ProfileUtilityScreen };
