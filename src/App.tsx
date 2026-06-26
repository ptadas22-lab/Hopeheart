import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, MoodConfig, DoctorQuestion } from './types';
import { supabase, saveSafeRulesConsentBackend } from './lib/supabaseClient';

// Importing all modular screen components
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
// import ProfileSetupScreen from './components/ProfileSetupScreen';
import DashboardScreen from './components/DashboardScreen';
import FeelGoodScreen from './components/FeelGoodScreen';
import MoodScreen from './components/MoodScreen';
import MySpaceScreen from './components/MySpaceScreen';
import CommunityScreen from './components/CommunityScreen';
import ResourcesScreen from './components/ResourcesScreen';
import HopeBuddyChatScreen from './components/HopeBuddyChatScreen';
import ListenerMatchScreen from './components/ListenerMatchScreen';
import SupportRoomsScreen from './components/SupportRoomsScreen';
import ShareSafelyScreen from './components/ShareSafelyScreen';
import NearbyCommunityScreen from './components/NearbyCommunityScreen';
import CareBridgeScreen from './components/CareBridgeScreen';
import SafetyScreen from './components/SafetyScreen';
import ProfileUtilityScreen from './components/ProfileUtilityScreen';
import NotificationsScreen from './components/NotificationsScreen';
import CustomerSupportScreen from './components/CustomerSupportScreen';
import AboutScreen from './components/AboutScreen';
import ModerationAlertScreen from './components/ModerationAlertScreen';
import FinancialsScreen from './components/FinancialsScreen';
import { MascotSitting, BrandWordmark } from './components/Logo';
import HopeBuddyWidget from './components/HopeBuddyWidget';
import SupportPopup from './components/SupportPopup';

function AppBackground({ currentScreen }: { currentScreen: ScreenId }) {
  // Screen categorization
  const isSplashWelcome = 
    currentScreen === ScreenId.Splash || 
    currentScreen === ScreenId.Welcome || 
    currentScreen === ScreenId.Login || 
    currentScreen === ScreenId.ProfileSetup;
    
  const isSafety = 
    currentScreen === ScreenId.AISafety || 
    currentScreen === ScreenId.ModerationBlock || 
    currentScreen === ScreenId.Crisis;
    
  const isProfileSettings = 
    currentScreen === ScreenId.Profile || 
    currentScreen === ScreenId.PrivacySettings || 
    currentScreen === ScreenId.Notifications || 
    currentScreen === ScreenId.About || 
    currentScreen === ScreenId.MedicalDisclaimer ||
    currentScreen === ScreenId.Financials;
    
  const isHomeCommunityResources = !isSplashWelcome && !isSafety && !isProfileSettings;

  // Gradients matching requirements
  let gradientStyle = "from-[#FFF7ED] via-[#F8EFFF] to-[#EEF2FF]"; // Home, Community, Resources: Warm cream-to-lavender gradient
  if (isSplashWelcome) {
    // Slightly stronger soft gradient with floating blurred blobs
    gradientStyle = "from-[#FFF7ED] via-[#F3E8FF] via-[#EDE9FE] to-[#EEF2FF]";
  } else if (isSafety) {
    // Calmer lavender/blue-tinted gradient, but keep it warm
    gradientStyle = "from-[#EEF2FF] via-[#EDE9FE] to-[#FFF7ED]";
  } else if (isProfileSettings) {
    // Clean minimal gradient with very light decorative shapes
    gradientStyle = "from-[#FFF7ED] via-[#FCFAF5] to-[#F8EFFF]";
  }

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none transition-all duration-700 bg-gradient-to-tr ${gradientStyle}`}>
      
      {/* Subtle visual depth blobs for Splash & Welcome */}
      {isSplashWelcome && (
        <>
          <div className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full bg-orange-150/20 blur-3xl" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[55%] rounded-full bg-purple-150/25 blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute top-[25%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-150/15 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        </>
      )}

      {/* Hearts and Chat Bubbles pattern overlay for Home, Community, Resources */}
      {isHomeCommunityResources && (
        <div 
          className="absolute inset-0 opacity-[0.025] bg-[repeat] [background-size:72px_72px] transition-opacity duration-500" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cpath d='M 18,15 C 17.2,13.5 15.5,13.5 14.7,14.5 C 13.9,15.5 13.9,17.2 14.7,18.2 L 18,21.5 L 21.3,18.2 C 22.1,17.2 22.1,15.5 21.3,14.5 C 20.5,13.5 18.8,13.5 18,15 Z' fill='%23FF7527' /%3E%3Cpath d='M 50,14 H 58 C 59.1,14 60,14.9 60,16 V 20 C 60,21.1 59.1,22 58,22 H 54 L 51,25 V 22 H 50 C 48.9,22 48,21.1 48,20 V 16 C 48,14.9 48.9,14 50,14 Z' fill='%237BA655' /%3E%3Cpath d='M 54,51 C 53.2,49.5 51.5,49.5 50.7,50.5 C 49.9,51.5 49.9,53.2 50.7,54.2 L 54,57.5 L 57.3,54.2 C 58.1,53.2 58.1,51.5 57.3,50.5 C 56.5,49.5 54.8,49.5 54,51 Z' fill='%23FF7527' /%3E%3Cpath d='M 14,50 H 22 C 23.1,50 24,50.9 24,52 V 56 C 24,57.1 23.1,58 22,58 H 18 L 15,61 V 58 H 14 C 12.9,58 12,57.1 12,56 V 52 C 12,50.9 12.9,50 14,50 Z' fill='%237BA655' /%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* Safety Screen gentle shapes */}
      {isSafety && (
        <>
          <div className="absolute top-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-indigo-100/20 blur-3xl" />
          {/* Low contrast decorative vector outline - safe guard shield */}
          <svg className="absolute top-[15%] left-[8%] w-16 h-16 text-indigo-200/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.47 3.74-3.09 7.1-7 8.16v-8.16H5V6.69l7-3.11v8.41z" />
          </svg>
        </>
      )}

      {/* Profile & Settings minimal decorative shapes */}
      {isProfileSettings && (
        <>
          <div className="absolute top-[12%] left-[8%] w-[25%] h-[25%] rounded-full bg-orange-50/15 blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
          {/* Low contrast rings */}
          <div className="absolute top-[20%] right-[15%] w-32 h-32 rounded-full border border-purple-100/15" />
          <div className="absolute bottom-[25%] left-[10%] w-48 h-48 rounded-full border border-orange-100/10" />
        </>
      )}

    </div>
  );
}

const MOOD_CONFIGS: MoodConfig[] = [
  { id: 'calm', label: 'Calm', emoji: '😊', color: 'text-emerald-500', accentBg: '#EADFC9', bgLight: 'bg-[#F2FAF6]', buddyExpression: 'calm', tagline: 'You’re allowed to slow down. I’m here with you.' },
  { id: 'sad', label: 'Sad', emoji: '😔', color: 'text-blue-600', accentBg: '#E8F1FC', bgLight: 'bg-[#F4F8FD]', buddyExpression: 'lonely', tagline: 'A gray cloud passes over. I let myself feel it.' },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-amber-500', accentBg: '#FEFAF0', bgLight: 'bg-[#FFFDF4]', buddyExpression: 'anxious', tagline: 'Racing chest, heavy breath. I am letting it pass.' },
  { id: 'hurt', label: 'Hurt', emoji: '💔', color: 'text-orange-500', accentBg: '#FFF2EA', bgLight: 'bg-[#FCFAF8]', buddyExpression: 'hurt', tagline: 'A heavy crack in my shell. Tender, but healing.' },
  { id: 'lonely', label: 'Lonely', emoji: '🥺', color: 'text-indigo-500', accentBg: '#F1F6FE', bgLight: 'bg-[#F1F6FE]', buddyExpression: 'lonely', tagline: 'An empty seat. Wishing for a kindred spark.' },
  { id: 'need-support', label: 'Need Support', emoji: '🤗', color: 'text-purple-500', accentBg: '#FAF7F0', bgLight: 'bg-[#FBF7FE]', buddyExpression: 'need-support', tagline: 'Ready to connect. A reaching hand is strength.' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌤️', color: 'text-yellow-600', accentBg: '#FFFDF0', bgLight: 'bg-[#FFFDF8]', buddyExpression: 'calm', tagline: 'Light breaking through the clouds. A fresh start.' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: 'text-slate-500', accentBg: '#F1F3F5', bgLight: 'bg-[#F8F9FA]', buddyExpression: 'numb', tagline: 'Rest is work too. Letting my batteries recharge.' },
];

const EN_DIARY_WISDOM = [
  "Do not ask what the world needs. Ask what makes your heart come alive, and go do that.",
  "You do not have to control your thoughts. You just have to stop letting them control you.",
  "Grief is just love that has nowhere to go. Let us hold space for it together.",
  "Every millimeter forward is a victory. Take a slow, deep breath.",
  "Even the tallest trees are supported by thousands of microscopic underground roots. You are backed.",
  "Some days are for recovery. Other days are for gentle progression. Both are incredibly clean.",
  "There is a crack in everything. That is where the light gets in.",
  "A soft heart is a brave heart. Be proud of your empathy."
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(ScreenId.Splash);
  const [selectedMoodId, setSelectedMoodId] = useState<string>(() => {
    return localStorage.getItem('hopeheart_mood') || 'calm';
  });

  const [previousMood, setPreviousMood] = useState<string | null>(() => {
    return localStorage.getItem('hopeheart_previous_checkin_mood') || localStorage.getItem('hopeheart_last_checkin_mood');
  });

  const [checkinFeedback, setCheckinFeedback] = useState<string | null>(null);

  const [checkinCount, setCheckinCount] = useState<number>(() => {
    const localCount = localStorage.getItem('hopeheart_checkin_count');
    return localCount ? parseInt(localCount, 10) : 0;
  });

  const getLocalPreviousMood = (): string | null => {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastCheckinDate = localStorage.getItem('hopeheart_last_checkin_date');
    if (lastCheckinDate === todayStr) {
      return localStorage.getItem('hopeheart_previous_checkin_mood');
    } else {
      return localStorage.getItem('hopeheart_last_checkin_mood');
    }
  };

  const fetchPreviousMood = async (userId: string) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('checkins')
          .select('mood, checkin_date')
          .eq('user_id', userId)
          .order('checkin_date', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(2);
        
        if (!error && data) {
          const todayStr = new Date().toISOString().split('T')[0];
          if (data.length === 2) {
            if (data[0].checkin_date === todayStr) {
              setPreviousMood(data[1].mood);
              localStorage.setItem('hopeheart_previous_checkin_mood', data[1].mood);
            } else {
              setPreviousMood(data[0].mood);
              localStorage.setItem('hopeheart_previous_checkin_mood', data[0].mood);
            }
          } else if (data.length === 1) {
            if (data[0].checkin_date !== todayStr) {
              setPreviousMood(data[0].mood);
              localStorage.setItem('hopeheart_previous_checkin_mood', data[0].mood);
            } else {
              setPreviousMood(null);
            }
          } else {
            setPreviousMood(null);
          }
        }
      } catch (err) {
        console.warn('[Checkin] Error fetching previous mood:', err);
      }
    }
  };

  const fetchCheckinCount = async (userId: string) => {
    if (supabase) {
      try {
        const { count, error } = await supabase
          .from('checkins')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        if (!error && count !== null) {
          setCheckinCount(count);
          localStorage.setItem('hopeheart_checkin_count', count.toString());
        } else if (error) {
          console.warn('[Checkin] Error counting check-ins from backend:', error.message);
        }
      } catch (err) {
        console.warn('[Checkin] Error fetching checkin count:', err);
      }
    }
  };

  const mapMoodIdToSafeMood = (moodId: string): string => {
    const map: Record<string, string> = {
      calm: 'Calm',
      sad: 'Low',
      anxious: 'Anxious',
      tired: 'Tired',
      hopeful: 'Hopeful',
      hurt: 'Low',
      lonely: 'Low',
      'need-support': 'Overwhelmed'
    };
    return map[moodId] || 'Calm';
  };

  const getMoodComparisonMessage = (prev: string, today: string): string => {
    if (prev === today) {
      return `You felt ${today} again today. HopeHeart is here with you.`;
    }
    if (prev === 'Anxious' && today === 'Calm') {
      return `You moved from Anxious to Calm today. That's a gentle step.`;
    }
    if (prev === 'Low' && today === 'Tired') {
      return `You felt Low last time and Tired today. Take today slowly.`;
    }
    return `You transitioned from ${prev} to ${today} today. Your feeling has been saved.`;
  };

  const handleMoodSelected = async (moodId: string) => {
    setSelectedMoodId(moodId);
    localStorage.setItem('hopeheart_mood', moodId);

    const safeMood = mapMoodIdToSafeMood(moodId);
    const todayDateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Determine what the previous mood was before this checkin
    const prevMoodBeforeSubmission = previousMood || getLocalPreviousMood();

    // Compute feedback message using neutral supportive transition language
    if (prevMoodBeforeSubmission) {
      const msg = getMoodComparisonMessage(prevMoodBeforeSubmission, safeMood);
      setCheckinFeedback(msg);
    } else {
      setCheckinFeedback(`Your feeling has been saved. HopeHeart is here with you.`);
    }

    let savedToBackend = false;
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId) {
          const { error } = await supabase
            .from('checkins')
            .upsert({
              user_id: userId,
              mood: safeMood,
              checkin_date: todayDateStr,
              created_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,checkin_date'
            });
          if (error) {
            console.warn('[Checkin] Failed to upsert check-in to backend:', error.message);
          } else {
            console.log('[Checkin] Upserted check-in successfully to backend.');
            savedToBackend = true;
            await fetchCheckinCount(userId);
            await fetchPreviousMood(userId);
          }
        }
      } catch (err) {
        console.warn('[Checkin] Error during backend check-in upsert:', err);
      }
    }

    // Always update localStorage fallback keys
    const lastCheckinMood = localStorage.getItem('hopeheart_last_checkin_mood');
    const lastCheckinDate = localStorage.getItem('hopeheart_last_checkin_date');

    localStorage.setItem('hopeheart_last_checkin_mood', safeMood);
    localStorage.setItem('hopeheart_last_checkin_date', todayDateStr);

    if (lastCheckinDate && lastCheckinDate !== todayDateStr) {
      localStorage.setItem('hopeheart_previous_checkin_mood', lastCheckinMood || '');
      if (lastCheckinMood) {
        setPreviousMood(lastCheckinMood);
      }
    } else if (!lastCheckinDate && prevMoodBeforeSubmission) {
      localStorage.setItem('hopeheart_previous_checkin_mood', prevMoodBeforeSubmission);
      setPreviousMood(prevMoodBeforeSubmission);
    }

    if (!savedToBackend) {
      if (lastCheckinDate !== todayDateStr) {
        const localCount = localStorage.getItem('hopeheart_checkin_count');
        const currentCount = localCount ? parseInt(localCount, 10) : 0;
        const nextCount = currentCount + 1;
        localStorage.setItem('hopeheart_checkin_count', nextCount.toString());
        setCheckinCount(nextCount);
      }
    }

    // Trigger popup based on mood category
    let popupCat = 'general-support';
    if (moodId === 'anxious' || moodId === 'overwhelmed') {
      popupCat = 'anxiety';
    } else if (moodId === 'sad' || moodId === 'hurt' || moodId === 'lonely' || moodId === 'tired' || moodId === 'low') {
      popupCat = 'emotional-support';
    } else if (moodId === 'hopeful' || moodId === 'calm' || moodId === 'need-support') {
      popupCat = 'general-support';
    }
    openSupportPopup(popupCat);
  };

  const handleNameChange = async (newName: string) => {
    setUserName(newName);
    localStorage.setItem('hopeheart_profile_display_name', newName);

    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              display_name: newName,
              updated_at: new Date().toISOString()
            });
          if (error) {
            console.warn('[Profile] Failed to update name on backend:', error.message);
          }
        }
      } catch (err) {
        console.warn('[Profile] Error updating name on backend:', err);
      }
    }
  };
  const [userName, setUserName] = useState<string>('Voice47');
  const [todayQuote, setTodayQuote] = useState<string>("Rest is productive too. You're allowed to slow down.");
  const [showSupportPopup, setShowSupportPopup] = useState<boolean>(false);
  const [popupCategory, setPopupCategory] = useState<string>('general');

  const isProfileFlowActive = currentScreen === ScreenId.Profile || currentScreen === ScreenId.PrivacySettings;

  useEffect(() => {
    if (isProfileFlowActive && showSupportPopup) {
      setShowSupportPopup(false);
    }
  }, [isProfileFlowActive, showSupportPopup]);

  const openSupportPopup = (category: string) => {
    console.log("Support popup dismissed date:", localStorage.getItem("hopeheart_support_popup_dismissed_date"));
    const dismissedDate = localStorage.getItem('hopeheart_support_popup_dismissed_date');
    const todayDateStr = new Date().toISOString().split('T')[0];
    if (dismissedDate === todayDateStr) {
      console.log("[Popup] Support popup suppressed today per user preference.");
      return;
    }
    setPopupCategory(category);
    setShowSupportPopup(true);
  };
  const [savedQuestions, setSavedQuestions] = useState<DoctorQuestion[]>(() => {
    const local = localStorage.getItem('hopeheart_care_questions');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 'q-1', text: 'Can medication dosage adjust on an empty stomach?', createdAt: 'Just now' },
      { id: 'q-2', text: 'Daily morning tremor checking checklist', createdAt: 'Just now' }
    ];
  });

  const loadCareQuestions = async (userId?: string) => {
    if (supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('care_questions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) {
          const formatted: DoctorQuestion[] = data.map(q => ({
            id: q.id,
            text: q.question_text,
            category: q.category,
            createdAt: q.created_at ? new Date(q.created_at).toLocaleDateString() : 'Just now'
          }));
          setSavedQuestions(formatted);
          localStorage.setItem('hopeheart_care_questions', JSON.stringify(formatted));
          return;
        }
      } catch (err) {
        console.warn('[Questions] Failed to fetch from Supabase:', err);
      }
    }
    // LocalStorage fallback
    const local = localStorage.getItem('hopeheart_care_questions');
    if (local) {
      try {
        setSavedQuestions(JSON.parse(local));
      } catch (e) {
        console.warn('[Questions] Error parsing local care questions:', e);
      }
    } else {
      const defaults = [
        { id: 'q-1', text: 'Can medication dosage adjust on an empty stomach?', createdAt: 'Just now' },
        { id: 'q-2', text: 'Daily morning tremor checking checklist', createdAt: 'Just now' }
      ];
      setSavedQuestions(defaults);
      localStorage.setItem('hopeheart_care_questions', JSON.stringify(defaults));
    }
  };

  // Global overlay trigger states for Screen 21 (Moderation Block) and Screen 22 (Crisis Hotline)
  const [overlayType, setOverlayType] = useState<'moderation' | 'crisis' | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState<string | null>(null);
  const [shareFileError, setShareFileError] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [showShareTextPreview, setShowShareTextPreview] = useState(false);
  const [safetyReportDirectOpen, setSafetyReportDirectOpen] = useState(false);
  const [supportPrefill, setSupportPrefill] = useState<{ issueType: string; message: string } | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile completion states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeeperMatchingModal, setShowDeeperMatchingModal] = useState(false);
  const [profileSuccessCallback, setProfileSuccessCallback] = useState<(() => void) | null>(null);

  const [isProfileCompleted, setIsProfileCompleted] = useState(() => {
    return localStorage.getItem('hopeheart_profile_basic_completed') === 'true';
  });

  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempAgeGroup, setTempAgeGroup] = useState('25–34');
  const [tempLanguage, setTempLanguage] = useState('English');
  const [tempSupportInterest, setTempSupportInterest] = useState('🌱 General Support');

  const handleRequireProfileCompletion = (onSuccess: () => void) => {
    if (isProfileCompleted) {
      onSuccess();
    } else {
      setProfileSuccessCallback(() => onSuccess);
      setShowDeeperMatchingModal(true);
    }
  };

  const handleSaveProfileModal = async () => {
    const displayName = tempDisplayName.trim() || userName || 'Companion';
    
    // Save to LocalStorage fallback keys
    localStorage.setItem('hopeheart_profile_display_name', displayName);
    localStorage.setItem('hopeheart_profile_age_group', tempAgeGroup);
    localStorage.setItem('hopeheart_profile_language', tempLanguage);
    localStorage.setItem('hopeheart_profile_support_interest', tempSupportInterest);
    localStorage.setItem('hopeheart_profile_basic_completed', 'true');
    
    // Update active userName state immediately
    setUserName(displayName);
    setIsProfileCompleted(true);

    // Save to profiles table if supabase user exists
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              display_name: displayName,
              age_group: tempAgeGroup,
              language: tempLanguage,
              support_interest: tempSupportInterest,
              updated_at: new Date().toISOString()
            });
          if (error) {
            console.warn('[Profile] Failed to save profile to backend:', error.message);
          } else {
            console.log('[Profile] Saved successfully to Supabase backend.');
            await fetchCheckinCount(userId);
          }
        }
      } catch (err) {
        console.warn('[Profile] Error during backend profiles write:', err);
      }
    }

    // Close modal
    setShowProfileModal(false);

    // Execute callback and clear it
    if (profileSuccessCallback) {
      profileSuccessCallback();
      setProfileSuccessCallback(null);
    }
  };

  // Auto-dismiss share toast notification after 3 seconds
  useEffect(() => {
    if (shareToast) {
      const t = setTimeout(() => setShareToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [shareToast]);

  // Clean up object URL when a new preview is set or when component unmounts
  useEffect(() => {
    return () => {
      if (sharePreviewUrl) {
        URL.revokeObjectURL(sharePreviewUrl);
      }
    };
  }, [sharePreviewUrl]);

  // Handle post-OAuth redirect sessions & consent saving
  useEffect(() => {
    const parseAuthSession = async (session: any) => {
      if (session?.user) {
        const pendingMethod = localStorage.getItem('hopeheart_pending_entry_method');
        if (pendingMethod) {
          // Stage 2 Backend saving
          await saveSafeRulesConsentBackend(session.user.id, pendingMethod as any);
        }

        // Update nickname
        const nickName = session.user.user_metadata?.full_name || session.user.email || 'Companion';
        setUserName(nickName);

        // Load profile from backend if available
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('display_name, age_group, language, support_interest')
            .eq('id', session.user.id)
            .maybeSingle();
          if (profile) {
            localStorage.setItem('hopeheart_profile_display_name', profile.display_name || '');
            localStorage.setItem('hopeheart_profile_age_group', profile.age_group || '25–34');
            localStorage.setItem('hopeheart_profile_language', profile.language || 'English');
            localStorage.setItem('hopeheart_profile_support_interest', profile.support_interest || '🌱 General Support');
            localStorage.setItem('hopeheart_profile_basic_completed', 'true');
            
            setUserName(profile.display_name || nickName);
            setIsProfileCompleted(true);
          } else {
            const localCompleted = localStorage.getItem('hopeheart_profile_basic_completed') === 'true';
            setIsProfileCompleted(localCompleted);
          }
        } catch (err) {
          console.warn('[Profile] Error loading profile from backend:', err);
          const localCompleted = localStorage.getItem('hopeheart_profile_basic_completed') === 'true';
          setIsProfileCompleted(localCompleted);
        }

        // Fetch checkin count
        await fetchCheckinCount(session.user.id);

        // Fetch previous mood
        await fetchPreviousMood(session.user.id);

        // Fetch care questions
        await loadCareQuestions(session.user.id);

        // Always route directly to Home
        setCurrentScreen(ScreenId.Home);
      }
    };

    const checkGuestSession = () => {
      const guestSessionId = localStorage.getItem('hopeheart_guest_session_id');
      if (guestSessionId) {
        const storedNick = localStorage.getItem('hopeheart_profile_nickname') || 'Companion';
        setUserName(storedNick);

        // Load local previous mood
        setPreviousMood(getLocalPreviousMood());

        // Load local care questions
        loadCareQuestions();

        // Always route directly to Home
        setCurrentScreen(ScreenId.Home);
      }
    };

    if (supabase) {
      // Check session on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          parseAuthSession(session);
        } else {
          checkGuestSession();
        }
      }).catch((err) => {
        console.warn('[Session] Error fetching session:', err);
        checkGuestSession();
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await parseAuthSession(session);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      checkGuestSession();
    }
  }, []);

  const getSafeShareText = () => {
    const activeMood = MOOD_CONFIGS.find(m => m.id === selectedMoodId);
    const moodText = activeMood ? `Mood: ${activeMood.emoji} ${activeMood.label}` : 'Mood: Not shared';
    return `Today I’m choosing support, not silence.\n${moodText}\nHopeHeart — Safe Emotional Support`;
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setShareFileError(null);
    setShareToast(null);
    setShowShareTextPreview(false);
    if (sharePreviewUrl) {
      URL.revokeObjectURL(sharePreviewUrl);
      setSharePreviewUrl(null);
    }
  };

  const handleShareFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setShareFileError(null);
    setShareToast(null);

    if (!file.type.startsWith('image/')) {
      setShareFileError("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setShareFileError("Please choose an image under 5MB.");
      return;
    }

    if (sharePreviewUrl) {
      URL.revokeObjectURL(sharePreviewUrl);
    }

    const url = URL.createObjectURL(file);
    setSharePreviewUrl(url);
  };

  const handleCopyShareMessage = () => {
    const text = getSafeShareText();
    navigator.clipboard.writeText(text)
      .then(() => {
        setShareToast("Share message copied safely.");
      })
      .catch((err) => {
        console.error('Failed to copy text:', err);
        setShareFileError("Could not copy message automatically.");
      });
  };

  const handleNativeShare = async () => {
    const text = getSafeShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "HopeHeart Check-In",
          text: text
        });
      } catch (err) {
        console.warn('Native share failed or dismissed:', err);
      }
    } else {
      setShareToast("Sharing is not supported on this browser. You can copy the message instead.");
    }
  };

  // Trigger quote refresh
  const handleRefreshQuote = () => {
    const list = EN_DIARY_WISDOM.filter(q => q !== todayQuote);
    const randomIdx = Math.floor(Math.random() * list.length);
    setTodayQuote(list[randomIdx]);
  };

  // Doctor checklist actions
  const handleAddQuestion = async (text: string) => {
    const tempId = 'temp-' + Date.now();
    const newQ: DoctorQuestion = {
      id: tempId,
      text,
      createdAt: 'Just now'
    };
    setSavedQuestions(prev => [newQ, ...prev]);

    let finalId = tempId;

    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId) {
          const { data, error } = await supabase
            .from('care_questions')
            .insert({
              user_id: userId,
              question_text: text,
              category: 'General'
            })
            .select('id')
            .single();

          if (!error && data) {
            finalId = data.id;
            setSavedQuestions(prev =>
              prev.map(q => q.id === tempId ? { ...q, id: data.id } : q)
            );
          }
        }
      } catch (err) {
        console.warn('[Questions] Error syncing care question to Supabase:', err);
      }
    }

    const currentLocalQuestions = JSON.parse(localStorage.getItem('hopeheart_care_questions') || '[]');
    const updatedLocal = [{ ...newQ, id: finalId }, ...currentLocalQuestions];
    localStorage.setItem('hopeheart_care_questions', JSON.stringify(updatedLocal));
  };

  const handleDeleteQuestion = async (id: string) => {
    setSavedQuestions(prev => prev.filter(q => q.id !== id));

    const currentLocalQuestions = JSON.parse(localStorage.getItem('hopeheart_care_questions') || '[]');
    const updatedLocal = currentLocalQuestions.filter((q: any) => q.id !== id);
    localStorage.setItem('hopeheart_care_questions', JSON.stringify(updatedLocal));

    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId && !id.startsWith('temp-') && id !== 'q-1' && id !== 'q-2') {
          await supabase
            .from('care_questions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        }
      } catch (err) {
        console.warn('[Questions] Error deleting care question from Supabase:', err);
      }
    }
  };

  const selectedMood = MOOD_CONFIGS.find(m => m.id === selectedMoodId) || MOOD_CONFIGS[0];

  // Router for current screens
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case ScreenId.Splash:
        return (
          <SplashScreen 
            onFinish={() => setCurrentScreen(ScreenId.Welcome)}
          />
        );

      case ScreenId.Welcome:
        return (
          <WelcomeScreen 
            onStart={() => setCurrentScreen(ScreenId.Login)}
          />
        );

      case ScreenId.Login:
        return (
          <LoginScreen 
            onLoginSuccess={(nick) => {
              setUserName(nick);
              setCurrentScreen(ScreenId.Home);
            }}
            onNavigateTo={(scr) => setCurrentScreen(scr)}
          />
        );

      case ScreenId.ProfileSetup:
        // Disabled onboarding step, redirects to Home
        setCurrentScreen(ScreenId.Home);
        return null;

      case ScreenId.Home:
        const todayStr = new Date().toISOString().split('T')[0];
        const hasCheckedInToday = localStorage.getItem('hopeheart_last_checkin_date') === todayStr;
        return (
          <DashboardScreen 
            userName={userName}
              selectedMood={selectedMood}
              onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
              todayQuote={todayQuote}
              onRefreshQuote={handleRefreshQuote}
              onMoodSelected={handleMoodSelected}
              onShareCheckIn={() => setShowShareModal(true)}
              isProfileIncomplete={!isProfileCompleted}
              onOpenProfileModal={() => {
                setTempDisplayName(userName !== 'Companion' && userName !== 'Voice47' ? userName : '');
                setShowProfileModal(true);
              }}
              previousMood={previousMood}
              hasCheckedInToday={hasCheckedInToday}
              checkinFeedback={checkinFeedback}
              onClearCheckinFeedback={() => setCheckinFeedback(null)}
            />
        );

      case ScreenId.HopeBuddyChat:
        return (
          <HopeBuddyChatScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            userName={userName}
            selectedMood={selectedMood}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
            onOpenCrisisScreen={() => setOverlayType('crisis')}
            onOpenModerationBlock={() => setOverlayType('moderation')}
          />
        );

      case ScreenId.SafeListener:
      case ScreenId.SafeChat:
        return (
          <ListenerMatchScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
            onOpenModerationBlock={() => setOverlayType('moderation')}
            onOpenCrisisScreen={() => setOverlayType('crisis')}
            onRequireProfileCompletion={handleRequireProfileCompletion}
          />
        );

      case ScreenId.SupportRooms:
      case ScreenId.RoomDetail:
        return (
          <SupportRoomsScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onOpenModerationBlock={() => setOverlayType('moderation')}
            onOpenCrisisScreen={() => setOverlayType('crisis')}
            onRequireProfileCompletion={handleRequireProfileCompletion}
          />
        );

      case ScreenId.ShareSafely:
      case ScreenId.MomentShare:
        return (
          <ShareSafelyScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onPostSuccess={() => setCurrentScreen(ScreenId.Home)}
            onRequireProfileCompletion={handleRequireProfileCompletion}
            onShareCheckIn={() => setShowShareModal(true)}
            onAddQuestion={handleAddQuestion}
            onOpenCrisisScreen={() => setOverlayType('crisis')}
          />
        );

      case ScreenId.NearbyAccess:
      case ScreenId.NearbyResults:
      case ScreenId.CommunityDetail:
      case ScreenId.MeetSafely:
        return (
          <NearbyCommunityScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onRequireProfileCompletion={handleRequireProfileCompletion}
          />
        );

      case ScreenId.DoctorSuggestions:
        return (
          <ResourcesScreen
            onBack={() => setCurrentScreen(ScreenId.Home)}
          />
        );

      case ScreenId.FeelGood:
        return (
          <FeelGoodScreen
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
          />
        );

      case ScreenId.Mood:
        return (
          <MoodScreen
            onBack={() => setCurrentScreen(ScreenId.Home)}
            selectedMood={selectedMood}
            checkinCount={checkinCount}
          />
        );

      case ScreenId.MySpace:
        return (
          <MySpaceScreen
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
          />
        );

      case ScreenId.Community:
        return (
          <CommunityScreen
            onBack={() => setCurrentScreen(ScreenId.Home)}
          />
        );

      case ScreenId.AISafety:
        return (
          <SafetyScreen 
            onBack={() => {
              setSafetyReportDirectOpen(false);
              setSupportPrefill(null);
              setCurrentScreen(ScreenId.Home);
            }}
            initialShowReport={safetyReportDirectOpen}
          />
        );

      case ScreenId.CustomerSupport:
        return (
          <CustomerSupportScreen
            onBack={() => {
              setSafetyReportDirectOpen(false);
              setSupportPrefill(null);
              setCurrentScreen(ScreenId.Home);
            }}
            onNavigateTo={(scr) => {
              setSafetyReportDirectOpen(false);
              setSupportPrefill(null);
              setCurrentScreen(scr as ScreenId);
            }}
            onOpenSafetyReport={() => {
              setSafetyReportDirectOpen(true);
              setCurrentScreen(ScreenId.AISafety);
            }}
            onOpenCrisisScreen={() => setOverlayType('crisis')}
            initialIssueType={supportPrefill?.issueType}
            initialMessage={supportPrefill?.message}
          />
        );

      case ScreenId.Profile:
      case ScreenId.PrivacySettings:
        return (
          <ProfileUtilityScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            userName={userName}
            onChangeName={handleNameChange}
            initialSubStage={currentScreen === ScreenId.PrivacySettings ? 'privacy' : 'profile'}
            onNavigateTo={(scr) => setCurrentScreen(scr)}
            onRequestAccountDataDeletion={() => {
              setSupportPrefill({
                issueType: 'Privacy concern',
                message: 'I want to request deletion of my HopeHeart account data.'
              });
              setCurrentScreen(ScreenId.CustomerSupport);
            }}
            checkinCount={checkinCount}
          />
        );

      case ScreenId.Financials:
        return (
          <FinancialsScreen 
            onBack={() => setCurrentScreen(ScreenId.Profile)}
          />
        );

      case ScreenId.Notifications:
        return (
          <NotificationsScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            previousMood={previousMood}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
          />
        );

      case ScreenId.About:
      case ScreenId.MedicalDisclaimer:
        return (
          <AboutScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onAcceptDisclaimer={() => {
              alert("Disclaimer accepted. Keep supporting each other safely.");
              setCurrentScreen(ScreenId.Home);
            }}
          />
        );

      default:
        return <SplashScreen onFinish={() => setCurrentScreen(ScreenId.Welcome)} />;
    }
  };

  // Nav highlighting helper states
  const isHomeActive = currentScreen === ScreenId.Home;
  const isMySpaceActive = currentScreen === ScreenId.MySpace || currentScreen === ScreenId.ShareSafely || currentScreen === ScreenId.MomentShare;
  const isCareActive = currentScreen === ScreenId.DoctorSuggestions || currentScreen === ScreenId.ProfessionalProfile || currentScreen === ScreenId.BookCare || currentScreen === ScreenId.SaveQuestions;
 
  // Bottom & Top Navigation is visible when the user advances past onboarding screens
  const showNavChannels = currentScreen !== ScreenId.Splash &&
                          currentScreen !== ScreenId.Welcome &&
                          currentScreen !== ScreenId.Login &&
                          currentScreen !== ScreenId.ProfileSetup;

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] sm:bg-[#F5EFE4] text-[#1E1E1A] font-sans flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 bg-[radial-gradient(#EADFC9_1.2px,transparent_1.2px)] [background-size:16px_16px] antialiased">
      
      {/* 
        FULLY RESPONSIVE DASHBOARD AREA CONTAINER
        No device mockup frames or telephone margins!
        Uses full-width on mobile viewports.
        Caps on tablet configurations, and handles spacious bento column grids for laptop displays.
      */}
      <div className="w-full sm:max-w-[760px] md:max-w-[880px] lg:max-w-[1100px] min-h-screen sm:min-h-[640px] sm:h-[min(780px,88vh)] bg-transparent rounded-none sm:rounded-[28px] shadow-none sm:shadow-lg border-0 sm:border border-gray-200/50 relative flex flex-col overflow-hidden">
        
        {/* Dynamic Premium Background Layer */}
        <AppBackground currentScreen={currentScreen} />

        {/* TOP Header and Navigation Bar */}
        {showNavChannels && (
          <header className="flex h-[64px] sm:h-[68px] shrink-0 hh-header-surface items-center justify-between px-4 sm:px-6 z-30 select-none">
            <div className="flex items-center gap-2.5">
              <MascotSitting size={36} className="shrink-0" />
              <div>
                <BrandWordmark size="text-[16px] sm:text-[18px]" />
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block leading-none mt-0.5">Safe Emotional Hub</span>
              </div>
            </div>

            {/* Desktop Navigation Paths */}
            <nav className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setCurrentScreen(ScreenId.Home)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isHomeActive ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🏡</span> Home
              </button>
              <button
                onClick={() => setCurrentScreen(ScreenId.MySpace)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isMySpaceActive ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🌼</span> My Space
              </button>
              <button
                onClick={() => setCurrentScreen(ScreenId.DoctorSuggestions)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCareActive ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>📚</span> Resources
              </button>
              <button
                onClick={() => setCurrentScreen(ScreenId.Community)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentScreen === ScreenId.Community ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🤝</span> Community
              </button>
              <button
                onClick={() => setCurrentScreen(ScreenId.Profile)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentScreen === ScreenId.Profile ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>👤</span> Profile
              </button>
            </nav>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => {
                  setCurrentScreen(ScreenId.Notifications);
                }}
                className="w-10 h-10 rounded-full border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-[18px] cursor-pointer relative"
                title="Notifications Alert"
              >
                🔔
                {!isProfileCompleted && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-white" />
                )}
              </button>
              <button 
                onClick={() => setCurrentScreen(ScreenId.Profile)}
                className="w-10 h-10 rounded-full border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-[18px] cursor-pointer"
                title="Safe Profile Settings"
              >
                👤
              </button>
              <button 
                onClick={() => setCurrentScreen(ScreenId.PrivacySettings)}
                className="w-10 h-10 rounded-full border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-[18px] cursor-pointer"
                title="Privacy & Safety Settings"
              >
                ⚙️
              </button>
            </div>
          </header>
        )}

        {/* Core viewport hosting active layouts */}
        <div className="flex-1 overflow-y-auto relative flex flex-col bg-transparent">
          <div className="flex-1 flex flex-col w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, scale: 0.99, y: 3 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -3 }}
                transition={{ duration: 0.15 }}
                className="w-full flex-1 flex flex-col"
              >
                {renderActiveScreen()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer - visible when onboarding is complete */}
          {showNavChannels && (
            <footer className="w-full bg-white/50 backdrop-blur-md sm:bg-transparent border-t border-[#ECE6D9] py-5 px-5 text-center mt-auto shrink-0 select-none">
              <div className="max-w-4xl mx-auto space-y-2">
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[12px] font-bold text-gray-500">
                  <button onClick={() => alert("Terms & Conditions:\n\n1. HopeHeart is strictly for peer-to-peer emotional support.\n2. Do not share or ask for prescriptions, medical diagnoses, or clinical advice.\n3. Be kind, empathetic, and respectful.\n4. AI monitoring keeps this space safe and anonymous.")} className="hover:underline hover:text-[#FF7527] cursor-pointer">Terms & Conditions</button>
                  <span className="hidden sm:inline">•</span>
                  <button onClick={() => alert("Privacy Policy:\n\nHopeHeart is built with privacy-first standards. Your profile data and chat history are saved offline on your device inside secure local storage. No identification details or chat logs are sent to external databases.")} className="hover:underline hover:text-[#FF7527] cursor-pointer">Privacy Policy</button>
                  <span className="hidden sm:inline">•</span>
                  <button onClick={() => alert("Emotional Support Disclaimer:\n\nHopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.")} className="hover:underline hover:text-[#FF7527] cursor-pointer">Emotional Support Disclaimer</button>
                </div>
                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed max-w-2xl mx-auto">
                  HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.
                </p>
              </div>
            </footer>
          )}
        </div>

        {/* MOBILE Safe Bottom Touch 5-Tab Navigation Bar - only on screens under 640px */}
        {showNavChannels && (
          <nav className="sm:hidden h-[74px] shrink-0 hh-header-surface border-t border-[#ECE6D9] flex items-center justify-around pb-safe z-30 shadow-[0_-3px_12px_rgba(43,29,18,0.015)] select-none">
            
            {/* Tab 1: Home */}
            <button
              onClick={() => setCurrentScreen(ScreenId.Home)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                isHomeActive ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🏡</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Home</span>
              {isHomeActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>

            {/* Tab 2: My Space */}
            <button
              onClick={() => setCurrentScreen(ScreenId.MySpace)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                isMySpaceActive ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🌼</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">My Space</span>
              {isMySpaceActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>

            {/* Tab 3: Community */}
            <button
              onClick={() => setCurrentScreen(ScreenId.Community)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                currentScreen === ScreenId.Community ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🤝</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Community</span>
              {currentScreen === ScreenId.Community && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>

            {/* Tab 4: Profile */}
            <button
              onClick={() => setCurrentScreen(ScreenId.Profile)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                currentScreen === ScreenId.Profile ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">👤</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Profile</span>
              {currentScreen === ScreenId.Profile && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>
          </nav>
        )}

      </div>

      {/* GLOBAL MODERATION & CRISIS ALERT MODALS POPUPS */}
      <AnimatePresence>
        {overlayType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="hh-surface rounded-[28px] w-full max-w-lg overflow-hidden"
            >
              <ModerationAlertScreen 
                type={overlayType}
                onNavigateTo={(scr) => {
                  setCurrentScreen(scr as ScreenId);
                  setOverlayType(null);
                }}
                onClose={() => setOverlayType(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showNavChannels && currentScreen !== ScreenId.HopeBuddyChat && (
        <HopeBuddyWidget 
          selectedMood={selectedMood}
          moodConfigs={MOOD_CONFIGS}
          onMoodSelected={handleMoodSelected}
          onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
          onShareCheckIn={() => setShowShareModal(true)}
        />
      )}

      {/* Share Card Modal Overlay */}
      {/* Share Card Modal Overlay */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs select-none">
            {/* Hidden native input elements for camera/gallery */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={handleShareFileChange}
              className="hidden"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleShareFileChange}
              className="hidden"
            />

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseShareModal}
              className="absolute inset-0"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm hh-surface rounded-[32px] p-6 z-10 space-y-4 text-center animate-in fade-in-50 duration-200"
            >
              <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                <span className="font-display font-black text-[15px] text-gray-800">
                  Share with HopeBuddy
                </span>
                <button
                  onClick={handleCloseShareModal}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-655 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Action Sheet Option list */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FCFBF8] hover:bg-[#FFF2EA] border border-gray-150 rounded-xl text-[12.5px] text-gray-700 font-bold transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>📸</span>
                    <span>Take photo</span>
                  </div>
                  <span className="text-[10px] text-gray-400">❯</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FCFBF8] hover:bg-[#FFF2EA] border border-gray-150 rounded-xl text-[12.5px] text-gray-700 font-bold transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>🖼️</span>
                    <span>Attach image</span>
                  </div>
                  <span className="text-[10px] text-gray-400">❯</span>
                </button>

                <button
                  onClick={() => setShowShareTextPreview(!showShareTextPreview)}
                  type="button"
                  className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-xl text-[12.5px] font-bold transition-all active:scale-98 cursor-pointer ${
                    showShareTextPreview
                      ? 'border-[#FF7527] bg-[#FFF2EA] text-[#FF7527]'
                      : 'border-gray-150 bg-[#FCFBF8] hover:bg-[#FFF2EA] text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>📇</span>
                    <span>Create HopeHeart share card</span>
                  </div>
                  <span className="text-[10px] text-gray-400" style={{ transform: showShareTextPreview ? 'rotate(90deg)' : 'none' }}>❯</span>
                </button>

                <button
                  onClick={handleCopyShareMessage}
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FCFBF8] hover:bg-[#FFF2EA] border border-gray-150 rounded-xl text-[12.5px] text-gray-700 font-bold transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>Copy share message</span>
                  </div>
                  <span className="text-[10px] text-gray-400">❯</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FCFBF8] hover:bg-[#FFF2EA] border border-gray-150 rounded-xl text-[12.5px] text-gray-700 font-bold transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>🔗</span>
                    <span>Share using phone apps</span>
                  </div>
                  <span className="text-[10px] text-gray-400">❯</span>
                </button>
              </div>

              {/* Toast & Error messages inside the sheet */}
              {shareToast && (
                <div className="py-1.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11px] font-bold text-center leading-normal">
                  {shareToast}
                </div>
              )}
              {shareFileError && (
                <div className="py-1.5 px-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[11px] font-semibold text-center leading-normal">
                  ⚠️ {shareFileError}
                </div>
              )}

              {/* Local Image/Photo Preview */}
              {sharePreviewUrl && (
                <div className="mt-2 p-3 bg-white border border-gray-150 rounded-2xl relative">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left mb-1.5 flex justify-between items-center">
                    <span>Local Image Preview</span>
                    <button
                      onClick={() => {
                        if (sharePreviewUrl) {
                          URL.revokeObjectURL(sharePreviewUrl);
                          setSharePreviewUrl(null);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer font-bold lowercase text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="relative rounded-xl overflow-hidden max-h-[140px] flex items-center justify-center bg-gray-50 border border-dashed border-gray-200">
                    <img
                      src={sharePreviewUrl}
                      alt="Selected preview"
                      className="max-w-full max-h-[140px] object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Safe Share Card Text Preview */}
              {showShareTextPreview && (
                <div className="p-4 bg-gradient-to-br from-[#FFF8F4] to-[#FAF5FF] border border-[#FFD3B6]/30 rounded-2.5xl text-center space-y-3 relative overflow-hidden shadow-2xs">
                  <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none select-none text-[60px] translate-x-3 -translate-y-3">
                    🧡
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-extrabold text-[#FF7527] uppercase tracking-widest block">
                      HopeHeart Share Card
                    </span>
                    <p className="text-[13px] font-display font-black text-gray-800 leading-snug">
                      "Today I’m choosing support, not silence."
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 border border-gray-200/50 rounded-xl shadow-4xs">
                    <span className="text-[16px]">{selectedMoodId ? selectedMood.emoji : '⚪'}</span>
                    <span className="text-[11px] font-display font-black text-gray-700">
                      Mood: {selectedMoodId ? selectedMood.label : 'Not shared'}
                    </span>
                  </div>
                  <div className="border-t border-[#EDE9DE]/50 pt-2 flex flex-col items-center leading-none gap-0.5">
                    <span className="font-display font-black text-[#2B1D12] text-[11px]">
                      HopeHeart
                    </span>
                    <span className="text-[8px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Safe Emotional Support
                    </span>
                  </div>
                </div>
              )}

              {/* Privacy Footer */}
              <p className="text-[10px] text-gray-450 font-semibold leading-normal max-w-[260px] mx-auto pt-1 border-t border-gray-100/60">
                HopeHeart does not share your private notes, exact location, phone number, or chat history.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Complete Profile Warning Modal for Deeper Matching */}
      <AnimatePresence>
        {showDeeperMatchingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="hh-surface rounded-[32px] w-full max-w-sm p-6 space-y-4 text-center"
            >
              <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                <span className="font-display font-black text-[15px] text-gray-800 flex items-center gap-1.5">
                  🔒 Complete your profile to continue
                </span>
                <button
                  onClick={() => {
                    setShowDeeperMatchingModal(false);
                    setProfileSuccessCallback(null);
                  }}
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-655 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
                We only need a few safe details to match you better.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowDeeperMatchingModal(false);
                    setTempDisplayName(userName !== 'Companion' && userName !== 'Voice47' ? userName : '');
                    setShowProfileModal(true);
                  }}
                  type="button"
                  className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-xs"
                >
                  Complete Now
                </button>
                <button
                  onClick={() => {
                    setShowDeeperMatchingModal(false);
                    setProfileSuccessCallback(null);
                  }}
                  type="button"
                  className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
                >
                  Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compact Profile Completion Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="hh-surface rounded-[32px] w-full max-w-md p-6 space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                <span className="font-display font-black text-[15px] text-gray-800 flex items-center gap-1.5">
                  👤 Complete your Safe Profile
                </span>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setProfileSuccessCallback(null);
                  }}
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-655 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                We only need a few safe details to improve support matching.
              </p>

              <div className="space-y-3.5">
                {/* Display Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    placeholder="e.g. Voice47"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                </div>

                {/* Age Group */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Age Group
                  </label>
                  <select
                    value={tempAgeGroup}
                    onChange={(e) => setTempAgeGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[12.5px] bg-white font-semibold focus:outline-none focus:border-[#FF7527]"
                  >
                    {['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+', 'Prefer not to say'].map((grp) => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Language
                  </label>
                  <input
                    type="text"
                    value={tempLanguage}
                    onChange={(e) => setTempLanguage(e.target.value)}
                    placeholder="e.g. English, Spanish"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                  />
                </div>

                {/* Support Interest */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Support Interest
                  </label>
                  <select
                    value={tempSupportInterest}
                    onChange={(e) => setTempSupportInterest(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[12.5px] bg-white font-semibold focus:outline-none focus:border-[#FF7527]"
                  >
                    {[
                      '🌱 General Support',
                      '🧠 Anxiety Support',
                      '🧓 Parkinson’s Support',
                      '👨👩👧 Caregiver Support'
                    ].map((interest) => (
                      <option key={interest} value={interest}>{interest}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setProfileSuccessCallback(null);
                  }}
                  type="button"
                  className="w-full py-2 bg-white hover:bg-gray-50 border border-gray-255 text-gray-700 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center"
                >
                  Later
                </button>
                <button
                  onClick={handleSaveProfileModal}
                  type="button"
                  className="w-full py-2 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SupportPopup
        isOpen={showSupportPopup && !isProfileFlowActive}
        onClose={() => setShowSupportPopup(false)}
        activeCategory={popupCategory}
        onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
      />

    </div>
  );
}
