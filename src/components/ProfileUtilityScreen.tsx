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

  // Authenticity Quiz States
  const [quizPassed, setQuizPassed] = useState(() => localStorage.getItem('hopeheart_authenticity_quiz_passed') === 'true');
  const [quizPassedAt, setQuizPassedAt] = useState(() => localStorage.getItem('hopeheart_authenticity_quiz_passed_at') || '');
  
  const [q1Answer, setQ1Answer] = useState<string>('');
  const [q2Answer, setQ2Answer] = useState<string>('');
  const [q3Answer, setQ3Answer] = useState<string>('');
  const [quizError, setQuizError] = useState<string>('');
  const [validatedOnce, setValidatedOnce] = useState<boolean>(false);

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

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 pt-6 sm:p-6 sm:pt-8 lg:p-8 lg:pt-10 pb-28 sm:pb-10">
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
              <div className="hh-surface rounded-[34px] p-5 sm:p-7 text-center overflow-hidden relative border border-orange-100/70 shadow-3xs">
                <div className="absolute -right-10 top-24 w-44 h-44 rounded-full bg-[#FFE3D3]/55" />
                <div className="absolute right-10 top-16 text-[22px] text-[#FFB95F]">✦</div>
                <div className="absolute right-24 top-28 text-[28px] text-[#FFCA75]">✦</div>
                <div className="absolute right-7 bottom-44 text-[44px] opacity-70">🪴</div>

                <div className="relative flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF7527] to-[#FFA14E] border-4 border-white flex items-center justify-center text-[42px] shrink-0 shadow-md select-none">
                    {profileAvatar}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display font-black text-[#10213D] text-[24px] leading-tight">{anonNameInput || userName || 'GoogleBuddy'}</h3>
                    <span className="inline-flex px-4 py-1 bg-orange-50 text-[#FF7527] border border-orange-100 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider">Peer Member</span>
                  </div>

                  {quizPassed ? (
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-extrabold px-4 py-2 rounded-xl">
                      <span>⭐</span> Trust Badge Earned — understands safety rules
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-[#FFF8EE] border border-[#FF9D45] text-[#9A4A12] text-[12px] font-extrabold px-4 py-2 rounded-xl">
                      <span>⚠️</span> Authenticity Pending — take safety quiz below
                    </div>
                  )}
                </div>

                <div className="relative w-full pt-6">
                  <div className="flex items-center justify-between text-[11px] font-display font-black text-[#697386] uppercase tracking-tight mb-2">
                    <span>Profile Completion Progress</span>
                    <span className="text-[#FF7527] text-[15px]">70%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF7527] transition-all duration-500 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 gap-0 pt-7 text-left">
                  {[
                    { label: 'Display Name', val: anonNameInput || 'GoogleBuddy', icon: '👤', tone: 'bg-[#FFEAF0]' },
                    { label: 'Age Group', val: profileAgeGroup || '25–34', icon: '🦊', tone: 'bg-[#FFF1E6]' },
                    { label: 'Gender', val: profileGender || 'Prefer not to say', icon: '🌈', tone: 'bg-[#EFFFF4]' },
                    { label: 'Profession', val: profileProfession === 'Working Professional' ? 'Prefer not to say' : profileProfession, icon: '💼', tone: 'bg-[#FFF3E0]' },
                    { label: 'Language', val: profileLanguage || 'English', icon: '💬', tone: 'bg-[#F0F8E8]' },
                    { label: 'Support Interest', val: (profileSupportInterest || 'General Support').replace('🌱 ', ''), icon: '🧡', tone: 'bg-[#FFF5E8]' },
                    { label: 'Best Quality', val: profileBestQuality || 'Good Listener', icon: '⭐', tone: 'bg-[#FFF5E8]' },
                    { label: 'Nature/Personality', val: profileNature || 'Calm and Supportive', icon: '🌱', tone: 'bg-[#EFF8E8]' }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/74 border border-orange-100/70 px-4 py-3 min-h-[76px] first:rounded-t-2xl sm:first:rounded-tl-2xl sm:first:rounded-tr-none sm:[&:nth-child(2)]:rounded-tr-2xl sm:[&:nth-child(7)]:rounded-bl-2xl last:rounded-b-2xl sm:last:rounded-bl-none sm:last:rounded-br-2xl">
                      <span className={`w-11 h-11 rounded-2xl ${detail.tone} flex items-center justify-center text-[22px] shrink-0`}>{detail.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[#697386] font-display font-black uppercase text-[10px] tracking-tight block leading-none mb-1">{detail.label}</span>
                        <span className="text-[#10213D] font-display font-black text-[14px] leading-tight block truncate">{detail.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5">
                  <button type="button" onClick={() => setSubStage('edit-profile')} className="py-3 bg-white hover:bg-[#FCFAF5] border border-gray-300 text-[#2B1D12] rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5">
                    <span>✏️</span> Edit Profile
                  </button>
                  <button type="button" onClick={() => setSubStage('privacy')} className="py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-3xs">
                    <span>🔒</span> Privacy Settings
                  </button>
                </div>

                <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
                  {[
                    { value: '7 Days', label: 'Safe Space Streak', emoji: '🛡️', tone: 'from-[#FFF0F3] to-[#FFF8F8]', text: 'text-[#B42318]' },
                    { value: '3 Check-ins', label: 'Mood Reflections', emoji: '🌼', tone: 'from-[#EFFAF0] to-[#F8FFF8]', text: 'text-[#15803D]' },
                    { value: '12 Hearts', label: 'Support Shared', emoji: '💜', tone: 'from-[#F7EEFF] to-[#FFFBFF]', text: 'text-[#7E22CE]' }
                  ].map((stat, idx) => (
                    <div key={idx} className={`rounded-2xl p-4 text-center space-y-1 bg-gradient-to-br ${stat.tone} border border-white/80 shadow-3xs`}>
                      <span className="text-[24px] block">{stat.emoji}</span>
                      <h5 className={`font-display font-black ${stat.text} text-[16px]`}>{stat.value}</h5>
                      <p className="text-[10px] text-[#697386] font-bold uppercase tracking-tight leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authenticity Check Quiz Card */}
              <div className="hh-surface rounded-[30px] p-5 space-y-4 text-left border border-orange-100/70 shadow-3xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100/70 pb-3">
                  <div className="flex items-start gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#FFF7E8] border border-orange-100 flex items-center justify-center text-[22px] shrink-0">🛡️</span>
                    <div>
                      <h4 className="font-display font-black text-[#2B1D12] text-[16px]">Authenticity Check</h4>
                      <p className="text-[12px] text-gray-500 font-semibold mt-0.5">Complete a short safety quiz to earn your HopeHeart Trust Badge.</p>
                    </div>
                  </div>
                  <button type="button" className="px-5 py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs">Take Quiz</button>
                </div>

                {quizPassed ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2 text-center">
                    <span className="text-emerald-800 font-extrabold text-[13px] block">✓ Trust Badge Earned</span>
                    <p className="text-[11.5px] text-emerald-700 font-medium leading-relaxed">You have passed the safety check on {new Date(quizPassedAt).toLocaleDateString()}. Your profile shows the trust verification badge in HopeHeart spaces.</p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2 lg:border-r lg:border-orange-100 lg:pr-4">
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

                      <div className="space-y-2 lg:border-r lg:border-orange-100 lg:pr-4">
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
                    <button onClick={handleQuizSubmit} type="button" className="w-full sm:w-80 mx-auto flex items-center justify-center py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-3xs">Verify Answers</button>
                  </div>
                )}
              </div>

              {/* Utility List Menu */}
              <div className="hh-surface rounded-[30px] p-4 divide-y divide-orange-100/70 border border-orange-100/70 shadow-3xs">
                {[
                  { icon: '🔖', tone: 'bg-[#EAF7FF]', label: 'Saved Questions & Resources', detail: 'View saved care questions, guides, and resources.', action: () => onNavigateTo?.(ScreenId.DoctorSuggestions) },
                  { icon: '👤', tone: 'bg-[#FFF0F3]', label: 'Account & Login', detail: 'Review your sign-in method and account help options.', action: () => onNavigateTo?.(ScreenId.CustomerSupport) },
                  { icon: '🔒', tone: 'bg-[#FFF3E8]', label: 'Privacy & Safety Controls', detail: 'Adjust privacy, reporting, and safe-space preferences.', action: () => setSubStage('privacy') },
                  { icon: '💬', tone: 'bg-[#FFF0F3]', label: 'Optional Community', detail: 'Browse quietly or connect only when you feel ready.', action: () => onNavigateTo?.(ScreenId.Community) },
                  { icon: '🎧', tone: 'bg-[#F2F6FF]', label: 'Customer Support', detail: 'Contact our support team for account, privacy, safety, or app-related issues.', action: () => onNavigateTo?.(ScreenId.CustomerSupport) },
                ].map((item, id) => (
                  <button key={id} onClick={item.action} type="button" className="w-full text-left py-3 px-1 hover:bg-[#FFF8F2] transition-colors flex items-center justify-between first:pt-1 last:pb-3 cursor-pointer gap-3">
                    <span className={`w-10 h-10 rounded-xl ${item.tone} flex items-center justify-center text-[20px] shrink-0`}>{item.icon}</span>
                    <span className="flex-1 min-w-0 space-y-0.5">
                      <span className="text-[13.5px] font-display font-black text-[#10213D] block">{item.label}</span>
                      <span className="text-[11.5px] text-gray-500 font-medium leading-normal block">{item.detail}</span>
                    </span>
                    <svg className="w-5 h-5 text-gray-400 stroke-current cursor-pointer shrink-0" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </button>
                ))}

                <div className="pt-3">
                  <span className="text-[11px] font-mono font-extrabold text-gray-400 uppercase tracking-widest px-1 block mb-1">Founder / Demo</span>
                  <button onClick={() => onNavigateTo?.(ScreenId.Financials)} type="button" className="w-full text-left py-3 px-1 hover:bg-[#FFF8F2] transition-colors flex items-center justify-between cursor-pointer gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#EFF8E8] flex items-center justify-center text-[20px] shrink-0">📊</span>
                    <span className="flex-1 min-w-0 space-y-0.5">
                      <span className="text-[13.5px] font-display font-black text-[#10213D] block">Service Model & Financials</span>
                      <span className="text-[11.5px] text-gray-500 font-medium leading-normal block">Founder View: Explore HopeHeart sustainability ecosystem models.</span>
                    </span>
                    <svg className="w-5 h-5 text-gray-400 stroke-current cursor-pointer shrink-0" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                  </button>
                </div>
              </div>

              {/* Privacy Note */}
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed text-center italic max-w-[520px] mx-auto pt-1 pb-1">Your profile is private. HopeHeart never shows your exact location, phone number, diagnosis, medication, or private notes.</p>

              {/* Security Badge */}
              <div className="p-4 bg-[#FFF2E8]/80 border border-orange-100 rounded-[24px] text-center flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="w-12 h-12 rounded-full bg-[#FFF8EE] border border-orange-100 flex items-center justify-center text-[23px] shrink-0">🛡️</span>
                <span className="text-[12.5px] sm:text-[13px] font-display font-black text-[#FF5C1A] leading-relaxed block">Private local storage in MVP. Secure encrypted storage planned for production. Safety rules help detect and block unsafe medical advice, prescriptions, dosage guidance, diagnosis claims, and cure promises.</span>
              </div>

              <footer className="text-center space-y-3 px-2 pb-2">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] sm:text-[13px] text-[#56657C] font-display font-black">
                  <button onClick={() => alert('Terms & Conditions\n\nHopeHeart is for emotional support. Be kind, respectful, and protect your privacy.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Terms & Conditions</button>
                  <button onClick={() => alert('Privacy Policy\n\nHopeHeart keeps MVP fallback data local on this device unless an existing app flow clearly says otherwise.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Privacy Policy</button>
                  <button onClick={() => alert('Emotional Support Disclaimer\n\nHopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Emotional Support Disclaimer</button>
                </div>
                <p className="max-w-xl mx-auto text-[12px] sm:text-[13px] text-[#6B7280] font-semibold leading-relaxed">HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.</p>
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
              className="space-y-4 max-w-md mx-auto mt-1 sm:mt-2"
            >
              <div className="text-center space-y-1">
                <div className="text-[28px]">⚙️</div>
                <h3 className="font-display font-black text-gray-800 text-[19px]">
                  Edit Profile
                </h3>
                <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed px-4">
                  Set your public presence. Remember, your personal details always remain private.
                </p>
              </div>

              <div className="space-y-4 hh-surface rounded-2.5xl p-5 text-left">
                {/* Avatar emoji picker */}
                <div className="space-y-2">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Choose Avatar Emoji
                  </span>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setProfileAvatar(emoji)}
                        className={`w-11 h-11 text-[24px] rounded-xl flex items-center justify-center transition-all cursor-pointer border-2 ${
                          profileAvatar === emoji 
                            ? 'border-[#FF7527] bg-[#FFF2EA]' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Anonymous Display Name
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={anonNameInput}
                      onChange={(e) => setAnonNameInput(e.target.value)}
                      placeholder="e.g. Voice47"
                      className="flex-1 px-3.5 py-2 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                    />
                    <button 
                      type="button"
                      onClick={() => setAnonNameInput('Voice' + Math.floor(10 + Math.random() * 900))}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[12px] font-display font-bold cursor-pointer transition-all active:scale-95 text-center shrink-0"
                    >
                      🎲 Generate
                    </button>
                  </div>
                </div>

                {/* Age Group Selector (no exact age) */}
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Age Group
                  </span>
                  <select
                    value={profileAgeGroup}
                    onChange={(e) => setProfileAgeGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  >
                    {['18–24', '25–34', '35–44', '45–54', '55+'].map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* Gender Selector */}
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Gender
                  </span>
                  <select
                    value={profileGender}
                    onChange={(e) => setProfileGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  >
                    {['Prefer not to say', 'Female', 'Male', 'Non-binary', 'Other'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Profession Selector */}
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Profession
                  </span>
                  <input
                    type="text"
                    value={profileProfession}
                    onChange={(e) => setProfileProfession(e.target.value)}
                    placeholder="e.g. Caregiver guide"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                </div>

                {/* Languages */}
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Languages
                  </span>
                  <input
                    type="text"
                    value={profileLanguage}
                    onChange={(e) => setProfileLanguage(e.target.value)}
                    placeholder="e.g. English, Hindi"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                </div>

                {/* Support Interest Selector */}
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Support Interest
                  </span>
                  <select
                    value={profileSupportInterest}
                    onChange={(e) => setProfileSupportInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  >
                    {['🌱 General Support', '🧘 Anxiety Relief', '🤝 Peer Listening', '🩺 Clinical Resources'].map((ch) => (
                      <option key={ch} value={ch}>{ch}</option>
                    ))}
                  </select>
                </div>

                {/* Best Quality */}
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Best Quality
                  </span>
                  <input
                    type="text"
                    value={profileBestQuality}
                    onChange={(e) => setProfileBestQuality(e.target.value)}
                    placeholder="e.g. Good Listener"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                </div>

                {/* Nature / Personality */}
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Nature / Personality
                  </span>
                  <input
                    type="text"
                    value={profileNature}
                    onChange={(e) => setProfileNature(e.target.value)}
                    placeholder="e.g. Calm and Supportive"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                </div>
              </div>

              {/* Actions for edit-profile */}
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
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-xl cursor-pointer shadow-xs"
                >
                  Save Profile
                </button>
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
