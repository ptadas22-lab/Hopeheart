$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-HopeHeartFile {
  param(
    [Parameter(Mandatory=$true)][string]$RelativePath,
    [Parameter(Mandatory=$true)][string]$Content
  )
  $targetPath = Join-Path $root $RelativePath
  $targetDir = Split-Path -Parent $targetPath
  if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
  }
  Set-Content -Path $targetPath -Value $Content -Encoding UTF8
}

Write-HopeHeartFile -RelativePath 'src/App.tsx' -Content @'
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
  const isFeelGoodActive = currentScreen === ScreenId.FeelGood;
  const isMoodActive = currentScreen === ScreenId.Mood;
  const isMySpaceActive = currentScreen === ScreenId.MySpace || currentScreen === ScreenId.ShareSafely || currentScreen === ScreenId.MomentShare;
  const isCareActive = currentScreen === ScreenId.DoctorSuggestions || currentScreen === ScreenId.ProfessionalProfile || currentScreen === ScreenId.BookCare || currentScreen === ScreenId.SaveQuestions;
  const isSafetyActive = currentScreen === ScreenId.AISafety;
 
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
                onClick={() => setCurrentScreen(ScreenId.FeelGood)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isFeelGoodActive ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🌤️</span> Feel Good
              </button>
              <button
                onClick={() => setCurrentScreen(ScreenId.Mood)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isMoodActive ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🧡</span> Mood
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
                <span>🩺</span> Resources
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

            {/* Tab 2: Feel Good */}
            <button
              onClick={() => setCurrentScreen(ScreenId.FeelGood)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                isFeelGoodActive ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🌤️</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Feel Good</span>
              {isFeelGoodActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>
 
            {/* Tab 3: Mood */}
            <button
              onClick={() => setCurrentScreen(ScreenId.Mood)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                isMoodActive ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🧡</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Mood</span>
              {isMoodActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>
 
            {/* Tab 4: My Space */}
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

            {/* Tab 5: Profile */}
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
        isOpen={showSupportPopup}
        onClose={() => setShowSupportPopup(false)}
        activeCategory={popupCategory}
        onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
      />

    </div>
  );
}
'@

Write-HopeHeartFile -RelativePath 'src/types.ts' -Content @'
export enum ScreenId {
  Splash = 'splash',
  Welcome = 'welcome',
  Login = 'login',
  ProfileSetup = 'profile-setup',
  Home = 'home',
  FeelGood = 'feel-good',
  Mood = 'mood',
  MySpace = 'my-space',
  Community = 'community',
  SafeListener = 'safe-listener',
  SafeChat = 'safe-chat',
  HopeBuddyChat = 'hopebuddy-chat',
  SupportRooms = 'support-rooms',
  RoomDetail = 'room-detail',
  ShareSafely = 'share-safely',
  MomentShare = 'moment-share',
  NearbyAccess = 'nearby-access',
  NearbyResults = 'nearby-results',
  CommunityDetail = 'community-detail',
  MeetSafely = 'meet-safely',
  DoctorSuggestions = 'doctor-suggestions',
  ProfessionalProfile = 'professional-profile',
  BookCare = 'book-care',
  SaveQuestions = 'save-questions',
  AISafety = 'ai-safety',
  ModerationBlock = 'moderation-block',
  Crisis = 'crisis',
  Profile = 'profile',
  PrivacySettings = 'privacy-settings',
  Notifications = 'notifications',
  About = 'about',
  MedicalDisclaimer = 'medical-disclaimer',
  Financials = 'financials',
  CustomerSupport = 'customer-support'
}

export interface MoodConfig {
  id: string;
  label: string;
  emoji: string;
  color: string; // Tailwind class
  accentBg: string; // Hex color or Tailwind class
  bgLight: string; // Light tint for dashboard cards
  buddyExpression: 'calm' | 'anxious' | 'hurt' | 'numb' | 'lonely' | 'need-support';
  tagline: string;
}

export interface SupportRoom {
  id: string;
  name: string;
  category: string;
  activeCount: number;
  description: string;
  tags: string[];
}

export interface Message {
  id: string;
  sender: 'user' | 'listener' | 'system' | 'bot';
  senderName: string;
  content: string;
  timestamp: string;
  isFlagged?: boolean; // AI Safety check label
}

export interface GuardrailItem {
  id: string;
  text: string;
  description: string;
  isAllowed: boolean;
  category: 'community' | 'clinical' | 'safe';
}

export interface DoctorQuestion {
  id: string;
  text: string;
  createdAt: string;
  category?: string;
}
'@

Write-HopeHeartFile -RelativePath 'src/components/DashboardScreen.tsx' -Content @'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Mascot from './Mascot';
import { MoodConfig, ScreenId } from '../types';
import { MascotFace } from './Logo';

interface DashboardScreenProps {
  userName: string;
  selectedMood: MoodConfig;
  onNavigateTo: (screenId: string) => void;
  todayQuote: string;
  onRefreshQuote: () => void;
  onMoodSelected: (moodId: string) => void;
  onShareCheckIn?: () => void;
  isProfileIncomplete: boolean;
  onOpenProfileModal: () => void;
  previousMood: string | null;
  hasCheckedInToday: boolean;
  checkinFeedback: string | null;
  onClearCheckinFeedback: () => void;
}

// 2. Trusted Resources Illustration (Person calmly reading guide/map, floating cards)
function ResourcesIllustration() {
  return (
    <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#EAF7F0" />
      <circle cx="50" cy="50" r="40" fill="#FFFDF9" stroke="#D1EFE0" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="32" r="7" fill="#E08C5E" />
      <path d="M44 32c0-5 3-8 6-8s6 3 6 8c0 1 0 2-1 3H45c-1-1-1-2-1-3z" fill="#6B5B52" />
      {/* Body */}
      <path d="M36 68c0-8 6-13 14-13s14 5 14 13H36z" fill="#3D9B75" />
      {/* Map/Guide */}
      <path d="M38 52h24l4 12H34l4-12z" fill="#FAF6EE" stroke="#A89C85" strokeWidth="1.2" />
      <line x1="43" y1="56" x2="57" y2="56" stroke="#C7BDAB" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="41" y1="60" x2="59" y2="60" stroke="#C7BDAB" strokeWidth="1.5" strokeLinecap="round" />
      {/* Floating resources */}
      <rect x="18" y="24" width="12" height="16" rx="2" fill="#FFF" stroke="#FF7527" strokeWidth="0.8" transform="rotate(-15, 18, 24)" />
      <rect x="68" y="20" width="14" height="18" rx="2" fill="#FFF" stroke="#3D9B75" strokeWidth="0.8" transform="rotate(10, 68, 20)" />
      <circle cx="75" cy="26" r="1" fill="#EAF7F0" stroke="#3D9B75" strokeWidth="0.5" transform="rotate(10, 68, 20)" />
    </svg>
  );
}

// 3. Safety Guardrails Illustration (Person inside soft protective shield with lock/symbols)
function SafetyIllustration() {
  return (
    <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#FFF8EE" />
      {/* Head */}
      <circle cx="50" cy="46" r="7" fill="#E08C5E" />
      {/* Body */}
      <path d="M36 78c0-8 6-14 14-14s14 6 14 14H36z" fill="#9C7752" />
      {/* Shield */}
      <path d="M50 20c15 0 25 5 25 18 0 16-16 28-25 32C41 66 25 54 25 38c0-13 10-18 25-18z" fill="#FFE5D6" fillOpacity="0.2" stroke="#FF7527" strokeWidth="2.2" strokeLinejoin="round" />
      {/* Lock */}
      <rect x="44" y="38" width="12" height="9" rx="1.5" fill="#2B1D12" />
      <path d="M47 38v-3c0-1.6 1.3-3 3-3s3 1.4 3 3v3" stroke="#2B1D12" strokeWidth="1.5" fill="none" />
      {/* Checkmarks */}
      <circle cx="21" cy="30" r="3" fill="#3D9B75" />
      <path d="M20 30l0.7 0.7 1.5-1.5" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="79" cy="48" r="3" fill="#3D9B75" />
      <path d="M78 48l0.7 0.7 1.5-1.5" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// 4. Help & Support Illustration (Agent with headset and help screen frame)
function SupportIllustration() {
  return (
    <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#F1F6FE" />
      <circle cx="50" cy="50" r="40" fill="#FFFDF9" stroke="#D6E5FF" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="38" r="7.5" fill="#E08C5E" />
      {/* Headset */}
      <path d="M42 38a8 8 0 0 1 16 0" fill="none" stroke="#2B1D12" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="41.5" cy="38" r="1.5" fill="#2B1D12" />
      <circle cx="58.5" cy="38" r="1.5" fill="#2B1D12" />
      <path d="M58.5 38c0 4-3 5-3 5" fill="none" stroke="#2B1D12" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body */}
      <path d="M34 72c0-9 7-15 16-15s16 6 16 15H34z" fill="#4B6EAF" />
      {/* Chat frame */}
      <rect x="25" y="52" width="50" height="28" rx="4" fill="#FAF6EE" stroke="#BACAE6" strokeWidth="1.2" />
      <circle cx="30" cy="56" r="1.2" fill="#FF7527" />
      <circle cx="34" cy="56" r="1.2" fill="#FFC72C" />
      <circle cx="38" cy="56" r="1.2" fill="#28C840" />
      {/* Chat bubble */}
      <rect x="42" y="62" width="28" height="12" rx="3" fill="#EBF5FF" />
      <circle cx="48" cy="68" r="1" fill="#4B6EAF" />
      <circle cx="54" cy="68" r="1" fill="#4B6EAF" />
      <circle cx="60" cy="68" r="1" fill="#4B6EAF" />
    </svg>
  );
}

export default function DashboardScreen({
  userName,
  selectedMood,
  onNavigateTo,
  todayQuote,
  onRefreshQuote,
  onMoodSelected,
  onShareCheckIn,
  isProfileIncomplete,
  onOpenProfileModal,
  previousMood,
  hasCheckedInToday,
  checkinFeedback,
  onClearCheckinFeedback,
}: DashboardScreenProps) {
  const [showToast, setShowToast] = useState(true);
  const [showReminder, setShowReminder] = useState(true);
  const [dismissedReminder, setDismissedReminder] = useState(false);
  const [currentMood, setCurrentMood] = useState(selectedMood.id);
  const [activeMoodLift, setActiveMoodLift] = useState<string | null>(null);

  // HopeBuddy Song states
  const [isSongCardExpanded, setIsSongCardExpanded] = useState(false);
  const [isHumming, setIsHumming] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('hopeheart_music_muted') === 'true';
  });
  const [audioError, setAudioError] = useState<string | null>(null);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const humTimerRef = useRef<NodeJS.Timeout | null>(null);


  const funnyMoodLiftCards = [
    { emoji: '🐧', title: 'Tiny penguin energy', body: 'Imagine a penguin confidently waddling into Monday like it has a meeting to lead.' },
    { emoji: '🍞', title: 'Toast update', body: 'A piece of toast finally popped up and said, “I needed space, but I’m ready now.”' },
    { emoji: '🧦', title: 'Sock mystery', body: 'One sock is always missing because it joined a tiny laundry adventure club.' }
  ];

  const getLyricsForMoodId = (moodId: string): string => {
    const lyricsMap: Record<string, string> = {
      anxious: "Breathe in slow, I’m here with you,\nOne small step will carry you through.",
      sad: "Even quiet days still matter,\nYour heart can rest, not shatter.",
      hurt: "Even quiet days still matter,\nYour heart can rest, not shatter.",
      lonely: "Even quiet days still matter,\nYour heart can rest, not shatter.",
      tired: "Rest your mind, soften the day,\nYou don’t have to rush your way.",
      'need-support': "One thing now, then one thing more,\nYou are safe on this small shore.",
      calm: "Keep this peace, soft and bright,\nCarry it gently through the night.",
      hopeful: "Hold that little light today,\nHope can grow in a gentle way."
    };
    return lyricsMap[moodId] || lyricsMap['calm'];
  };

  const stopWebAudioHum = () => {
    setIsHumming(false);

    if (humTimerRef.current) {
      clearTimeout(humTimerRef.current);
      humTimerRef.current = null;
    }

    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
        audioCtxRef.current = null;
      }
    } catch (e) {
      console.warn('[WebAudio] Error cleaning up audio:', e);
    }
  };

  const startWebAudioHum = async () => {
    setAudioError(null);
    stopWebAudioHum();

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        setAudioError("Your browser does not support AudioContext.");
        return;
      }

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (!isMuted) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // Softer 220 Hz tone (A3)

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime); // Low safe gain

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillatorRef.current = osc;
        gainNodeRef.current = gainNode;

        osc.start();
      }

      setIsHumming(true);

      // Stop automatically after 8 seconds
      humTimerRef.current = setTimeout(() => {
        stopWebAudioHum();
      }, 8000);
    } catch (err) {
      console.warn('[WebAudio] Browser blocked play action:', err);
      setAudioError("Your browser blocked sound. Tap Play again or check volume.");
      setIsHumming(false);
    }
  };

  // Stop humming when mood changes or song card is closed
  useEffect(() => {
    stopWebAudioHum();
  }, [currentMood, isSongCardExpanded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebAudioHum();
    };
  }, []);

  // Auto-dismiss the welcome toast after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Sync state if selected mood changes externally
  useEffect(() => {
    setCurrentMood(selectedMood.id);
  }, [selectedMood.id]);

  return (
    <div className="flex flex-col min-h-full bg-transparent overflow-y-auto font-sans select-none scrollbar-none w-full relative">

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-sm"
          >
            <div className="bg-[#1E1E1A] text-white px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-800">
              <span className="text-xl shrink-0">🧡</span>
              <p className="text-[12px] sm:text-[12.5px] font-semibold leading-normal text-left text-gray-200">
                Welcome, {userName} 👋 HopeBuddy is ready when you need support.
              </p>
              <button
                onClick={() => setShowToast(false)}
                type="button"
                className="ml-auto text-gray-400 hover:text-white text-xs cursor-pointer flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upper Brand / User bar */}
      <div className="pt-4 pb-3 px-5 flex items-center justify-between hh-header-surface sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-[#FF7527] bg-[#FFEFE5] flex items-center justify-center p-0.5 overflow-hidden">
              <MascotFace size={34} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <span className="text-[10px] text-[#FF7527] font-extrabold uppercase font-mono tracking-wider block leading-none mb-0.5">User Status</span>
            <h3 className="font-display font-extrabold text-[#2B1D12] text-[16px] leading-tight">
              Hi, {userName} 🌟
            </h3>
          </div>
        </div>
      </div>

      {/* Profile Completion Gentle Reminder Banner */}
      {isProfileIncomplete && showReminder && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
          <div className="bg-gradient-to-r from-[#FFF5F0] to-[#FAF5FF] border border-[#FFD3B6]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[24px] shrink-0">🔔</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-gray-800 text-[13.5px]">
                  Complete your Safe Profile
                </h4>
                <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                  Add a few details so HopeHeart can match you better.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowReminder(false)}
                type="button"
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95"
              >
                Later
              </button>
              <button
                onClick={onOpenProfileModal}
                type="button"
                className="px-3.5 py-1.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95 shadow-3xs"
              >
                Complete Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Checkin Feedback Banner */}
      {checkinFeedback && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
          <div className="bg-gradient-to-r from-[#F0FDF4] to-[#F5FFF6] border border-[#BBF7D0]/50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[24px] shrink-0">🌱</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-[#166534] text-[13.5px]">
                  Daily Reflection Saved
                </h4>
                <p className="text-[11.5px] text-[#1E3A1E] font-semibold leading-relaxed">
                  {checkinFeedback}
                </p>
              </div>
            </div>
            <button
              onClick={onClearCheckinFeedback}
              type="button"
              className="w-7 h-7 rounded-full border border-[#BBF7D0] flex items-center justify-center text-gray-500 hover:text-[#166534] text-xs font-bold cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Daily Mood Check-In Reminder Banner */}
      {previousMood && !hasCheckedInToday && !dismissedReminder && (
        <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
          <div className="bg-gradient-to-r from-[#FFFDF9] to-[#FDFBF7] border border-[#ECE6D9] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs">
            <div className="flex items-center gap-3 text-left">
              <span className="text-[24px] shrink-0">🌤️</span>
              <div className="space-y-0.5">
                <h4 className="font-display font-black text-gray-800 text-[13.5px]">
                  Daily Mood Check-in
                </h4>
                <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                  Last time, you felt <span className="font-bold text-[#FF7527]">{previousMood}</span>. How are you feeling today?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDismissedReminder(true)}
                type="button"
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95"
              >
                Later
              </button>
              <button
                onClick={() => {
                  const card = document.getElementById('hopebuddy-checkin-card');
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                type="button"
                className="px-3.5 py-1.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[12px] rounded-xl cursor-pointer transition-all active:scale-95 shadow-3xs"
              >
                Check in now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💛 Your Emotional Support Journey Stepper */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
        <div className="bg-white/80 border border-[#EDE9DE] rounded-[24px] p-5 space-y-4 shadow-3xs backdrop-blur-xs select-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Your Trust Path</span>
              <h4 className="font-display font-black text-gray-800 text-[14px]">
                Your Emotional Support Journey 💛
              </h4>
            </div>
            <p className="text-[11.5px] text-gray-550 font-semibold leading-relaxed">
              Explore step-by-step to build comfort and find the right support.
            </p>
          </div>

          {/* Steps Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
            {[
              {
                step: 1,
                label: 'Mood Check-in',
                emoji: '🌤️',
                done: hasCheckedInToday,
                desc: 'How do you feel today?'
              },
              {
                step: 2,
                label: 'HopeBuddy Reflection',
                emoji: '💬',
                done: localStorage.getItem('hopeheart_has_reflected') === 'true',
                desc: 'Take a quiet moment to reflect.'
              },
              {
                step: 3,
                label: 'Explore & Share',
                emoji: '📓',
                done: localStorage.getItem('hopeheart_has_explored_resources') === 'true' || localStorage.getItem('hopeheart_has_shared_story') === 'true' || (localStorage.getItem('hopeheart_care_questions') && JSON.parse(localStorage.getItem('hopeheart_care_questions') || '[]').length > 0),
                desc: 'Save questions or draft reflections.'
              },
              {
                step: 4,
                label: 'Memories & Resources',
                emoji: '🌼',
                done: (localStorage.getItem('hopeheart_positive_memories') && JSON.parse(localStorage.getItem('hopeheart_positive_memories') || '[]').length > 0) || localStorage.getItem('hopeheart_has_explored_resources') === 'true',
                desc: 'Save good moments or read gently.'
              }
            ].map((st) => {
              return (
                <div key={st.step} className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-1.5 ${
                  st.done
                    ? 'bg-[#EAF7F0] border-emerald-200 text-emerald-800'
                    : 'bg-[#FCFBF8] border-gray-150 text-gray-500'
                }`}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[12px] font-mono font-bold uppercase tracking-wider block">Step {st.step}</span>
                    <span className="text-[14px]">
                      {st.done ? '✅' : st.emoji}
                    </span>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h5 className="font-display font-black text-[12px] leading-tight text-gray-800">
                      {st.label}
                    </h5>
                    <p className="text-[10px] text-gray-550 font-semibold leading-normal">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mood Lift: softer first step before heavier support */}
      <div className="mx-4 sm:mx-6 md:mx-8 mt-4">
        <div className="hh-surface rounded-[28px] p-5 space-y-4 border border-[#F4E7D8]/80">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Support without pressure</span>
              <h3 className="font-display font-black text-[#2B1D12] text-[18px] leading-tight">Mood Lift</h3>
              <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Not ready to talk? Try something light first.</p>
            </div>
            <span className="text-[28px] self-start sm:self-auto">🌤️</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 'smile', label: 'Make me smile', emoji: '😊' },
              { id: 'calm', label: 'Calm my mind', emoji: '🫧' },
              { id: 'sound', label: 'Play calming hum', emoji: '🎵' },
              { id: 'write', label: 'Write privately', emoji: '📝' },
              { id: 'memory', label: 'Save a good memory', emoji: '🌼' },
              { id: 'read', label: 'Read something gentle', emoji: '📚' },
              { id: 'strengths', label: 'Remember my strengths', emoji: '💛' },
              { id: 'like', label: 'Do something I like', emoji: '✨' }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (option.id === 'sound') {
                    setActiveMoodLift('sound');
                    if (isHumming) {
                      stopWebAudioHum();
                    } else {
                      startWebAudioHum();
                    }
                    return;
                  }
                  if (option.id === 'calm') {
                    onNavigateTo(ScreenId.Mood);
                    return;
                  }
                  if (option.id === 'write' || option.id === 'memory' || option.id === 'strengths') {
                    onNavigateTo(ScreenId.MySpace);
                    return;
                  }
                  if (option.id === 'read') {
                    onNavigateTo(ScreenId.DoctorSuggestions);
                    return;
                  }
                  setActiveMoodLift(activeMoodLift === option.id ? null : option.id);
                }}
                className={`min-h-[74px] rounded-2xl border p-2.5 text-center transition-all cursor-pointer active:scale-95 ${
                  activeMoodLift === option.id
                    ? 'bg-[#FFF2EA] border-[#FF7527]/40 text-[#C75414] shadow-3xs'
                    : 'bg-[#FFFDF9] border-gray-150 text-gray-650 hover:border-orange-200 hover:bg-[#FFF8F2]'
                }`}
              >
                <span className="text-[20px] block mb-1">{option.emoji}</span>
                <span className="text-[11.5px] font-display font-black leading-tight block">{option.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {(activeMoodLift === 'smile' || activeMoodLift === 'like') && (
              <motion.div
                key="mood-lift-smile"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1"
              >
                {funnyMoodLiftCards.map((card) => (
                  <div key={card.title} className="bg-white/80 border border-orange-100/70 rounded-2xl p-3.5 space-y-1.5">
                    <span className="text-[22px]">{card.emoji}</span>
                    <h4 className="font-display font-black text-gray-800 text-[13px]">{card.title}</h4>
                    <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeMoodLift === 'sound' && (
              <motion.div
                key="mood-lift-sound"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="bg-[#FFFDF9] border border-orange-100/70 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-display font-black text-gray-800 text-[13px]">HopeBuddy hum</h4>
                  <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                    {isHumming ? 'A gentle hum is playing for a few seconds.' : 'Tap Calming sound again when you want the gentle hum.'}
                  </p>
                  {audioError && <p className="text-[11px] text-red-600 font-semibold mt-1">⚠️ {audioError}</p>}
                </div>
                <button
                  type="button"
                  onClick={isHumming ? stopWebAudioHum : startWebAudioHum}
                  className="px-4 py-2 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95"
                >
                  {isHumming ? 'Stop hum' : 'Play hum'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Layout Bento Grid */}
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">

          {/* Component 1: 🧡 HopeBuddy Check-In Card */}
          <div id="hopebuddy-checkin-card" className="hh-hero-surface rounded-[32px] p-5 flex flex-col justify-between space-y-4 col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧡</span>
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] tracking-wider uppercase">
                  HopeBuddy Companion
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="p-3 bg-[#FFFDF9] border border-dashed border-[#EDE9DE] rounded-2xl shadow-inner shrink-0">
                  <Mascot expression={selectedMood.buddyExpression} size={110} />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h2 className="font-display font-black text-gray-800 text-[19px] md:text-[21px] leading-tight">
                    You're feeling <span className="text-[#FF7527]">{selectedMood.label}</span> today.
                  </h2>
                  <p className="text-[12.5px] text-gray-500 font-semibold italic leading-relaxed">
                    "{selectedMood.tagline}"
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-[#EDE9DE] space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
                  Daily Check-In
                </span>
                <span className="text-[13px] font-display font-black text-gray-700">
                  How are you feeling now?
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'calm', label: 'Calm', emoji: '😊' },
                  { id: 'sad', label: 'Low', emoji: '😔' },
                  { id: 'anxious', label: 'Anxious', emoji: '😰' },
                  { id: 'tired', label: 'Tired', emoji: '😴' }
                ].map((mood) => {
                  const isSelected = currentMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setCurrentMood(mood.id)}
                      type="button"
                      className={`py-2 px-1 border rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF7527] bg-[#FFF2EA] text-[#FF7527] font-bold shadow-3xs'
                          : 'border-gray-150 bg-[#FCFBF8] text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-[20px]">{mood.emoji}</span>
                      <span className="text-[10px] font-bold">{mood.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onMoodSelected(currentMood);
                  }}
                  type="button"
                  className="flex-1 py-2.5 bg-[#1E1E1A] hover:bg-black text-white rounded-xl text-[12.5px] font-bold cursor-pointer transition-all active:scale-95 shadow-xs"
                >
                  Update Check-In
                </button>
                <button
                  onClick={onShareCheckIn}
                  type="button"
                  className="px-4 py-2.5 bg-[#FFF2EA] hover:bg-[#FFE4E6] text-[#FF7527] border border-[#FF7527]/20 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                  title="Share Check-In Card"
                >
                  <span>📸</span> Share
                </button>
              </div>

              {/* HopeBuddy Song Section (shows when a mood is selected) */}
              {currentMood && (
                <div className="mt-3 pt-3 border-t border-dashed border-[#EDE9DE] flex flex-col items-center">
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => setIsSongCardExpanded(!isSongCardExpanded)}
                      type="button"
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FFF2EA] hover:bg-[#FFEAE1] text-[#FF7527] border border-[#FF7527]/15 rounded-full text-[12px] font-bold cursor-pointer transition-all active:scale-95 hover:scale-[1.02]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#FF7527] text-white flex items-center justify-center text-[10px] shadow-3xs font-sans">🎵</span>
                      <span>HopeBuddy Song</span>
                      <span className="text-[10px] text-[#FF7527]/70 transition-transform duration-200" style={{ transform: isSongCardExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </button>
                    {isHumming && (
                      <div className="flex items-center gap-1.5 animate-pulse text-[11px] font-semibold text-gray-500">
                        <span className="inline-block animate-bounce text-xs font-sans" style={{ animationDelay: '0.1s' }}>🎵</span>
                        <span className="inline-block animate-bounce text-xs font-sans" style={{ animationDelay: '0.3s' }}>🎶</span>
                        <span>Humming...</span>
                      </div>
                    )}
                  </div>

                  {isSongCardExpanded && (
                    <div className="w-full mt-3 bg-[#FFFDF9]/80 border border-[#EDE9DE]/50 rounded-2xl p-4 text-center relative overflow-hidden space-y-3 shadow-3xs">
                      <div>
                        <h4 className="font-display font-black text-gray-800 text-[13px] leading-tight mb-0.5">
                          “HopeBuddy has a little song for you”
                        </h4>
                        <p className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">
                          Based on your mood today.
                        </p>
                      </div>

                      <p className="text-[12.5px] text-gray-600 font-semibold italic whitespace-pre-line leading-relaxed px-2 py-1">
                        {getLyricsForMoodId(currentMood)}
                      </p>

                      {audioError && (
                        <div className="py-1.5 px-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[11px] font-semibold text-center leading-normal">
                          ⚠️ {audioError}
                        </div>
                      )}

                      {isHumming && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="py-1.5 px-3 bg-[#FFEFE5] text-[#FF7527] border border-[#FF7527]/10 rounded-xl text-[11.5px] font-bold"
                        >
                          {isMuted ? 'HopeBuddy is muted 🎵' : 'HopeBuddy is humming for you 🎵'}
                        </motion.div>
                      )}

                      {/* Song card actions */}
                      <div className="flex flex-wrap gap-2 pt-1 justify-center">
                        <button
                          onClick={() => {
                            if (isHumming) {
                              stopWebAudioHum();
                            } else {
                              startWebAudioHum();
                            }
                          }}
                          type="button"
                          className="py-1.5 px-3.5 bg-white border border-gray-250 text-gray-700 font-display font-black text-[11.5px] rounded-xl cursor-pointer hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-1.5 shadow-3xs"
                        >
                          <span>{isHumming ? '⏹️ Stop hum' : '🎵 Play HopeBuddy hum'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const nextMuted = !isMuted;
                            setIsMuted(nextMuted);
                            localStorage.setItem('hopeheart_music_muted', nextMuted ? 'true' : 'false');
                            if (nextMuted) {
                              stopWebAudioHum();
                            }
                          }}
                          type="button"
                          className="py-1.5 px-3.5 bg-white border border-gray-250 text-gray-700 font-display font-black text-[11.5px] rounded-xl cursor-pointer hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-1.5 shadow-3xs"
                        >
                          <span>{isMuted ? '🔊 Unmute' : '🔇 Mute'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Component 2: 🛡️ Safety Guardrails Card */}
          <motion.button
            onClick={() => onNavigateTo('ai-safety')}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <SafetyIllustration />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Safety Guardrails
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  AI helps keep conversations safe, respectful, and free from medical advice.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              View Rules & Guide →
            </span>
          </motion.button>

          {/* Component 3: 🌤️ Feel Good Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.FeelGood)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF2EA] border border-orange-100 flex items-center justify-center text-[30px] shrink-0">🌤️</div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">Feel Good</h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Smile, hum, write, remember strengths, or do something small you like.</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">Try Something Light →</span>
          </motion.button>

          {/* Component 3: 🌼 My Space Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.MySpace)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF2EA] border border-orange-100 flex items-center justify-center text-[30px] shrink-0">🌼</div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  My Space
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Private diary, memories, Remember Me, and gentle resources in one place.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              Open My Space →
            </span>
          </motion.button>

          {/* Component 4: 🌍 Trusted Resources Card */}
          <motion.button
            onClick={() => onNavigateTo('doctor-suggestions')}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <ResourcesIllustration />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  Comfort Resources
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Read gentle emotional information when you are ready. Small steps only.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">
              Read When Ready →
            </span>
          </motion.button>

          {/* Remember Me Strength Reminder Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.MySpace)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[30px] block">💛</span>
              <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">Remember Me</h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Keep strengths, interests, comforts, safe places, and survival memories close.</p>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">Remember My Strengths →</span>
          </motion.button>

          {/* Optional Community Card */}
          <motion.button
            onClick={() => onNavigateTo(ScreenId.Community)}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            className="p-5 hh-surface rounded-[32px] text-left transition-all cursor-pointer flex flex-col justify-between gap-4 col-span-1"
          >
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[30px] block">🤝</span>
              <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">Optional Community</h4>
              <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">Connect only when you feel ready. You can also just browse quietly.</p>
            </div>
            <span className="text-[11px] font-bold text-[#FF7527] uppercase tracking-wide cursor-pointer hover:underline">Browse Quietly →</span>
          </motion.button>

          {/* Component 5: 🛟 Help & Support Card */}
          <div
            className="p-5 hh-surface rounded-[32px] text-left flex flex-col justify-between gap-4 col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <SupportIllustration />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-display font-black text-gray-800 text-[16px] leading-tight">
                  🛟 Help & Support
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                  Need help using HopeHeart? Contact support or report an issue.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTo(ScreenId.CustomerSupport)}
              type="button"
              className="w-full py-2.5 bg-[#FAF8F4] hover:bg-[#FFF2EA] hover:text-[#FF7527] border border-[#ECE6D9] hover:border-[#FF7527] text-gray-700 rounded-xl text-[12px] font-display font-black cursor-pointer transition-all active:scale-95 text-center mt-1"
            >
              Contact Support
            </button>
          </div>

        </div>

        {/* Safe Platform Boundary Disclaimer Footer */}
        <div className="mt-8 mb-6 text-center max-w-2xl mx-auto px-4">
          <p className="text-[11px] text-gray-400 font-bold leading-normal">
            HopeHeart provides emotional support, peer listening, and resources. It does not provide medical diagnosis, prescriptions, therapy, emergency care, or crisis intervention.
          </p>
        </div>
      </div>
    </div>
  );
}
'@

Write-HopeHeartFile -RelativePath 'src/components/FeelGoodScreen.tsx' -Content @'
import { useRef, useState } from 'react';
import { ScreenId } from '../types';

interface FeelGoodScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: ScreenId) => void;
}

export default function FeelGoodScreen({ onBack, onNavigateTo }: FeelGoodScreenProps) {
  const [isHumming, setIsHumming] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const humTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopHum = () => {
    setIsHumming(false);
    if (humTimerRef.current) clearTimeout(humTimerRef.current);
    try {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      if (audioCtxRef.current?.state !== 'closed') audioCtxRef.current?.close();
    } catch {
      // Audio may already be stopped by the browser.
    } finally {
      oscillatorRef.current = null;
      audioCtxRef.current = null;
      humTimerRef.current = null;
    }
  };

  const playHum = async () => {
    if (isHumming) {
      stopHum();
      return;
    }
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    if (ctx.state === 'suspended') await ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    oscillatorRef.current = osc;
    osc.start();
    setIsHumming(true);
    humTimerRef.current = setTimeout(stopHum, 8000);
  };
  const options = [
    { label: 'Make me smile', emoji: '😊', detail: 'Tiny light prompts for a softer minute.', action: () => undefined },
    { label: 'Calm my mind', emoji: '🫧', detail: 'Pause, breathe, and choose one small next step.', action: () => onNavigateTo(ScreenId.Mood) },
    { label: 'Play calming hum', emoji: '🎵', detail: isHumming ? 'The gentle hum is playing.' : 'Use the HopeBuddy hum for a few seconds.', action: playHum },
    { label: 'Write privately', emoji: '📝', detail: 'Open a private writing space.', action: () => onNavigateTo(ScreenId.MySpace) },
    { label: 'Save a good memory', emoji: '🌼', detail: 'Capture one okay moment for later.', action: () => onNavigateTo(ScreenId.MySpace) },
    { label: 'Read something gentle', emoji: '📚', detail: 'Comforting resources with no pressure.', action: () => onNavigateTo(ScreenId.DoctorSuggestions) },
    { label: 'Remember my strengths', emoji: '💛', detail: 'Return to what helps you keep going.', action: () => onNavigateTo(ScreenId.MySpace) },
    { label: 'Do something I like', emoji: '✨', detail: 'Pick one small interest or comfort activity.', action: () => undefined }
  ];

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button onClick={onBack} type="button" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs">
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Feel Good</span>
        <span className="text-[20px] select-none">🌤️</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 text-center space-y-2">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Feel better privately first</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">No pressure to talk. Choose something small and gentle.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option) => (
            <button key={option.label} type="button" onClick={option.action} className="hh-surface rounded-2xl p-4 text-left hover:bg-[#FFF8F2] transition-all cursor-pointer active:scale-[0.99] space-y-2">
              <span className="text-[24px] block">{option.emoji}</span>
              <h3 className="font-display font-black text-gray-800 text-[14px]">{option.label}</h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">{option.detail}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
'@

Write-HopeHeartFile -RelativePath 'src/components/MySpaceScreen.tsx' -Content @'
import { useRef, useState } from 'react';
import { ScreenId } from '../types';

interface MySpaceScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: ScreenId) => void;
}

interface DiaryEntry {
  id: string;
  title?: string;
  mood?: string;
  text: string;
  savedAt: string;
}

interface MemoryEntry {
  id: string;
  title: string;
  story: string;
  type: string;
  dateOrAge?: string;
  people?: string;
  place?: string;
  feeling?: string;
  whyItMatters?: string;
  savedAt: string;
}

const loadLocalArray = <T,>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

export default function MySpaceScreen({ onBack, onNavigateTo }: MySpaceScreenProps) {
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryMood, setDiaryMood] = useState('');
  const [diaryText, setDiaryText] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => loadLocalArray<DiaryEntry>('hopeheart_private_diary'));

  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryStory, setMemoryStory] = useState('');
  const [memoryType, setMemoryType] = useState('Small good moment');
  const [memoryDateOrAge, setMemoryDateOrAge] = useState('');
  const [memoryPeople, setMemoryPeople] = useState('');
  const [memoryPlace, setMemoryPlace] = useState('');
  const [memoryFeeling, setMemoryFeeling] = useState('');
  const [memoryWhy, setMemoryWhy] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryEntry[]>(() => loadLocalArray<MemoryEntry>('hopeheart_positive_memories'));

  const [strengths, setStrengths] = useState(() => localStorage.getItem('hopeheart_remember_strengths') || '');
  const [interests, setInterests] = useState(() => localStorage.getItem('hopeheart_remember_interests') || '');
  const [calmingThings, setCalmingThings] = useState(() => localStorage.getItem('hopeheart_remember_calming_things') || '');
  const [favoriteFood, setFavoriteFood] = useState(() => localStorage.getItem('hopeheart_remember_favorite_food') || '');
  const [favoriteMusic, setFavoriteMusic] = useState(() => localStorage.getItem('hopeheart_remember_favorite_music') || '');
  const [comfortActivity, setComfortActivity] = useState(() => localStorage.getItem('hopeheart_remember_comfort_activity') || '');
  const [safePlace, setSafePlace] = useState(() => localStorage.getItem('hopeheart_remember_safe_place') || '');
  const [survivalMemory, setSurvivalMemory] = useState(() => localStorage.getItem('hopeheart_remember_survival_memory') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveDiary = () => {
    if (!diaryText.trim()) return;
    const entry = { id: Date.now().toString(), title: diaryTitle.trim(), mood: diaryMood.trim(), text: diaryText.trim(), savedAt: new Date().toISOString() };
    const updated = [entry, ...diaryEntries];
    setDiaryEntries(updated);
    localStorage.setItem('hopeheart_private_diary', JSON.stringify(updated));
    setDiaryTitle('');
    setDiaryMood('');
    setDiaryText('');
  };

  const saveMemory = () => {
    if (!memoryTitle.trim() || !memoryStory.trim()) return;
    const entry = {
      id: Date.now().toString(),
      title: memoryTitle.trim(),
      story: memoryStory.trim(),
      type: memoryType,
      dateOrAge: memoryDateOrAge.trim(),
      people: memoryPeople.trim(),
      place: memoryPlace.trim(),
      feeling: memoryFeeling.trim(),
      whyItMatters: memoryWhy.trim(),
      savedAt: new Date().toISOString()
    };
    const updated = [entry, ...memories];
    setMemories(updated);
    localStorage.setItem('hopeheart_positive_memories', JSON.stringify(updated));
    setMemoryTitle('');
    setMemoryStory('');
    setMemoryDateOrAge('');
    setMemoryPeople('');
    setMemoryPlace('');
    setMemoryFeeling('');
    setMemoryWhy('');
  };

  const saveRememberMe = () => {
    localStorage.setItem('hopeheart_remember_strengths', strengths);
    localStorage.setItem('hopeheart_remember_interests', interests);
    localStorage.setItem('hopeheart_remember_calming_things', calmingThings);
    localStorage.setItem('hopeheart_remember_favorite_food', favoriteFood);
    localStorage.setItem('hopeheart_remember_favorite_music', favoriteMusic);
    localStorage.setItem('hopeheart_remember_comfort_activity', comfortActivity);
    localStorage.setItem('hopeheart_remember_safe_place', safePlace);
    localStorage.setItem('hopeheart_remember_survival_memory', survivalMemory);
  };

  const handleImagePreview = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button onClick={onBack} type="button" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs">
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">My Space</span>
        <span className="text-[20px] select-none">🌼</span>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 text-center space-y-2">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Private space for you</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Diary, memories, photos, and Remember Me data stay local for this MVP and are not shared with Community.</p>
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px]">Private Diary</h3>
          <input value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} placeholder="Title optional" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          <input value={diaryMood} onChange={(e) => setDiaryMood(e.target.value)} placeholder="Mood optional" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          <textarea value={diaryText} onChange={(e) => setDiaryText(e.target.value)} rows={4} placeholder="Write privately..." className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] font-semibold resize-none" />
          <button onClick={saveDiary} type="button" className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save diary entry</button>
          {diaryEntries.slice(0, 2).map((entry) => <p key={entry.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{entry.title || 'Untitled'} — {new Date(entry.savedAt).toLocaleString()}</p>)}
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px]">Memories</h3>
          <input value={memoryTitle} onChange={(e) => setMemoryTitle(e.target.value)} placeholder="Memory title" className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          <textarea value={memoryStory} onChange={(e) => setMemoryStory(e.target.value)} rows={4} placeholder="Memory story" className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] font-semibold resize-none" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input value={memoryType} onChange={(e) => setMemoryType(e.target.value)} placeholder="Memory type" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryDateOrAge} onChange={(e) => setMemoryDateOrAge(e.target.value)} placeholder="Date or age optional" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryPeople} onChange={(e) => setMemoryPeople(e.target.value)} placeholder="People optional" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryPlace} onChange={(e) => setMemoryPlace(e.target.value)} placeholder="Place optional" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryFeeling} onChange={(e) => setMemoryFeeling(e.target.value)} placeholder="Feeling connected to memory" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            <input value={memoryWhy} onChange={(e) => setMemoryWhy(e.target.value)} placeholder="Why this memory matters" className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePreview(e.target.files?.[0])} />
          {imagePreview && <div className="rounded-2xl overflow-hidden border border-gray-150"><img src={imagePreview} alt="Local-only memory preview" className="w-full max-h-56 object-cover" /><p className="text-[10.5px] text-gray-400 font-bold p-2 text-center">Preview only — not uploaded.</p></div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button onClick={() => fileInputRef.current?.click()} type="button" className="py-2.5 bg-white border border-gray-200 rounded-xl text-[12.5px] font-display font-black cursor-pointer">Preview local photo</button>
            <button onClick={saveMemory} type="button" className="py-2.5 bg-[#FF7527] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save memory</button>
          </div>
          {memories.slice(0, 2).map((memory) => <p key={memory.id} className="text-[11.5px] text-gray-500 font-semibold bg-white/70 rounded-xl p-2">{memory.title} — {memory.type}</p>)}
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px]">Remember Me</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              ['My strengths', strengths, setStrengths],
              ['My interests', interests, setInterests],
              ['Things that calm me', calmingThings, setCalmingThings],
              ['Favourite food', favoriteFood, setFavoriteFood],
              ['Favourite music', favoriteMusic, setFavoriteMusic],
              ['Favourite comfort activity', comfortActivity, setComfortActivity],
              ['Safe place', safePlace, setSafePlace],
              ['Memory that reminds me I survived', survivalMemory, setSurvivalMemory]
            ].map(([label, value, setter]) => (
              <input key={label as string} value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} placeholder={label as string} className="px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] font-semibold" />
            ))}
          </div>
          <button onClick={saveRememberMe} type="button" className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer">Save Remember Me</button>
        </div>

        <button onClick={() => onNavigateTo(ScreenId.DoctorSuggestions)} type="button" className="w-full py-3 bg-white hover:bg-[#FFF8F2] border border-orange-100 rounded-2xl text-[#FF7527] font-display font-black text-[13px] cursor-pointer">Open Gentle Resources</button>
      </div>
    </div>
  );
}
'@

Write-HopeHeartFile -RelativePath 'src/components/CommunityScreen.tsx' -Content @'
interface CommunityScreenProps {
  onBack: () => void;
}

const chatCategories = ['Calm chat', 'Music comfort', 'Pet comfort', 'Bike lovers', 'Movie comfort', 'Anxiety support', 'Stress support', 'Loneliness support'];
const exerciseCategories = ['Breathing reset', 'Grounding exercise', 'Gentle stretch', 'Short walk reminder', 'Calm body scan', '5-minute reset'];
const guidanceCategories = ['When anxiety feels heavy', 'When your mind won’t stop', 'When you feel lonely but don’t want to talk', 'How to write what you feel', 'How to save a good memory', 'When to seek urgent help'];

function CategorySection({ title, emoji, items }: { title: string; emoji: string; items: string[] }) {
  return (
    <div className="hh-surface rounded-3xl p-5 space-y-3">
      <h3 className="font-display font-black text-gray-800 text-[15px]"><span>{emoji}</span> {title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="bg-white/80 border border-orange-100/60 rounded-2xl p-3">
            <span className="text-[12.5px] text-gray-700 font-bold">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CommunityScreen({ onBack }: CommunityScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button onClick={onBack} type="button" className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs">
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Community</span>
        <span className="text-[20px] select-none">🤝</span>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 text-center space-y-2">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Optional Community</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">No pressure to talk. Browse quietly. Join only when ready.</p>
        </div>
        <CategorySection title="Chat" emoji="💬" items={chatCategories} />
        <CategorySection title="Exercise" emoji="🌿" items={exerciseCategories} />
        <CategorySection title="Guidance" emoji="🧭" items={guidanceCategories} />
      </div>
    </div>
  );
}
'@

Write-HopeHeartFile -RelativePath 'src/components/ProfileUtilityScreen.tsx' -Content @'
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

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 pt-6 sm:p-6 sm:pt-8 lg:p-8 lg:pt-10">
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
              <div className="hh-surface rounded-3xl p-5 md:p-6 flex flex-col items-center gap-5 mt-2 sm:mt-4 text-center">
                <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                  {/* Large Avatar container */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF7527] to-[#FFA14E] border-4 border-white flex items-center justify-center text-[40px] shrink-0 shadow-md select-none">
                    {profileAvatar}
                  </div>
                  
                  <div className="text-center sm:text-left space-y-1 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                      <h3 className="font-display font-black text-gray-800 text-[19px]">
                        {anonNameInput || userName || 'GoogleBuddy'}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-orange-50 text-[#FF7527] border border-orange-100 rounded-full text-[10px] font-mono font-extrabold uppercase w-fit mx-auto sm:mx-0">
                        Peer Member
                      </span>
                    </div>

                    {/* Trust status indicators */}
                    <div className="pt-1">
                      {quizPassed ? (
                        <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-250 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full">
                          <span>⭐</span> Trust Badge Earned — understands safety rules
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-255 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full">
                          <span>⚠️</span> Authenticity Pending — take safety quiz below
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Completion Progress Bar */}
                <div className="w-full pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-tight block mb-1">
                    <span>Profile Completion Progress</span>
                    <span className="text-[#FF7527] font-extrabold">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF7527] transition-all duration-500" 
                      style={{ width: `${progressPercentage}%` }} 
                    />
                  </div>
                </div>

                {/* Personal Details Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3.5 border-t border-gray-100 mt-2 text-left">
                  {[
                    { label: 'Display Name', val: anonNameInput, icon: '👤' },
                    { label: 'Age Group', val: profileAgeGroup, icon: '🎂' },
                    { label: 'Gender', val: profileGender, icon: '🌈' },
                    { label: 'Profession', val: profileProfession, icon: '💼' },
                    { label: 'Language', val: profileLanguage, icon: '🗣️' },
                    { label: 'Support Interest', val: profileSupportInterest, icon: '🧡' },
                    { label: 'Best Quality', val: profileBestQuality, icon: '⭐' },
                    { label: 'Nature/Personality', val: profileNature, icon: '🌱' }
                  ].map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-[12px] text-gray-650 font-semibold bg-[#FFFDF9]/60 px-3 py-2 rounded-xl border border-gray-150/40">
                      <span className="text-base shrink-0">{detail.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-tight block leading-none mb-0.5">{detail.label}</span>
                        <span className="text-gray-700 font-extrabold text-[12.5px] leading-tight block truncate">{detail.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Profile Card Actions */}
                <div className="w-full flex flex-col sm:flex-row gap-2 pt-3.5 border-t border-gray-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setSubStage('edit-profile')}
                    className="flex-1 py-2.5 bg-white hover:bg-[#FCFAF5] border border-gray-250 text-gray-755 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                  >
                    <span>✏️</span> Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubStage('privacy')}
                    className="flex-1 py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-3xs"
                  >
                    <span>🔒</span> Privacy Settings
                  </button>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { value: '7 Days', label: 'Safe Space Streak', emoji: '🛡️' },
                  { value: `${checkinCount ?? 0} Check-ins`, label: 'Mood Reflections', emoji: '🩺' },
                  { value: '12 Hearts', label: 'Support Shared', emoji: '❤️' }
                ].map((stat, idx) => (
                  <div key={idx} className="hh-surface rounded-2xl p-3 sm:p-4 text-center space-y-1">
                    <span className="text-xl block">{stat.emoji}</span>
                    <h5 className="font-display font-black text-[#FF7527] text-[15px] sm:text-[16px]">{stat.value}</h5>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Authenticity Check Quiz Card */}
              <div className="hh-surface rounded-3xl p-5 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="font-display font-black text-gray-800 text-[14.5px]">🛡️ Authenticity Check</h4>
                    <p className="text-[11.5px] text-gray-450 font-semibold mt-0.5">Complete a short safety quiz to earn your HopeHeart Trust Badge.</p>
                  </div>
                  {quizPassed && (
                    <span className="text-[20px]" title="Quiz Passed">🏆</span>
                  )}
                </div>

                {quizPassed ? (
                  <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-2xl space-y-2 text-center">
                    <span className="text-emerald-800 font-extrabold text-[13px] block">✓ Trust Badge Earned</span>
                    <p className="text-[11.5px] text-emerald-700 font-medium leading-relaxed">
                      You have passed the safety check on {new Date(quizPassedAt).toLocaleDateString()}. Your profile shows the trust verification badge in HopeHeart spaces.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4.5 pt-1">
                    {/* Q1 */}
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-bold text-gray-700 block">Q1: HopeHeart is mainly for:</span>
                      <div className="flex flex-col gap-1.5 pl-1.5">
                        {['Medical diagnosis', 'Emotional support and resources', 'Prescriptions'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-[12px] text-gray-600 font-semibold cursor-pointer">
                            <input 
                              type="radio" 
                              name="q1" 
                              value={opt} 
                              checked={q1Answer === opt} 
                              onChange={(e) => setQ1Answer(e.target.value)}
                              className="accent-[#FF7527] cursor-pointer" 
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Q2 */}
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-bold text-gray-700 block">Q2: If someone says they are in immediate danger, you should:</span>
                      <div className="flex flex-col gap-1.5 pl-1.5">
                        {[
                          'Only send them to peer chat', 
                          'Encourage emergency help, trusted family/adult, or local emergency services', 
                          'Give medicine advice'
                        ].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-[12px] text-gray-600 font-semibold cursor-pointer">
                            <input 
                              type="radio" 
                              name="q2" 
                              value={opt} 
                              checked={q2Answer === opt} 
                              onChange={(e) => setQ2Answer(e.target.value)}
                              className="accent-[#FF7527] cursor-pointer" 
                            />
                            <span className="leading-snug">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Q3 */}
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-bold text-gray-700 block">Q3: A peer listener should not:</span>
                      <div className="flex flex-col gap-1.5 pl-1.5">
                        {['Listen with care', 'Share what helped them personally', 'Diagnose, prescribe, or promise cures'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-[12px] text-gray-600 font-semibold cursor-pointer">
                            <input 
                              type="radio" 
                              name="q3" 
                              value={opt} 
                              checked={q3Answer === opt} 
                              onChange={(e) => setQ3Answer(e.target.value)}
                              className="accent-[#FF7527] cursor-pointer" 
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    {quizError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-[11px] font-semibold">
                        ⚠️ {quizError}
                      </div>
                    )}

                    <button
                      onClick={handleQuizSubmit}
                      type="button"
                      className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-3xs"
                    >
                      Verify Answers
                    </button>
                  </div>
                )}
              </div>

              {/* Utility List Menu */}
              <div className="hh-surface rounded-3xl p-4 divide-y divide-gray-100">
                {[
                  { 
                    label: 'Saved Questions & Resources', 
                    detail: 'View saved care questions, guides, and resources.',
                    action: () => {
                      if (onNavigateTo) {
                        onNavigateTo(ScreenId.DoctorSuggestions);
                      }
                    }
                  },
                  { 
                    label: 'Account & Login', 
                    detail: 'Review your sign-in method and account help options.',
                    action: () => {
                      if (onNavigateTo) {
                        onNavigateTo(ScreenId.CustomerSupport);
                      }
                    }
                  },
                  { 
                    label: 'Privacy & Safety Controls', 
                    detail: 'Adjust privacy, reporting, and safe-space preferences.', 
                    action: () => setSubStage('privacy') 
                  },
                  { 
                    label: 'Optional Community',
                    detail: 'Browse quietly or connect only when you feel ready.',
                    action: () => {
                      if (onNavigateTo) {
                        onNavigateTo(ScreenId.Community);
                      }
                    }
                  },
                  {
                    label: 'Customer Support', 
                    detail: 'Contact our support team for account, privacy, safety, or app-related issues.', 
                    action: () => {
                      if (onNavigateTo) {
                        onNavigateTo(ScreenId.CustomerSupport);
                      }
                    }
                  },
                ].map((item, id) => (
                  <button
                    key={id}
                    onClick={item.action}
                    type="button"
                    className="w-full text-left py-3.5 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between first:pt-1 last:pb-1 cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[13.5px] font-display font-extrabold text-gray-800 block">{item.label}</span>
                      <span className="text-[11.5px] text-gray-500 font-medium leading-normal block">{item.detail}</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Founder / Demo Section */}
              <div className="space-y-2 mt-4">
                <span className="text-[11px] font-mono font-extrabold text-gray-400 uppercase tracking-widest px-2 block">
                  Founder / Demo
                </span>
                <div className="hh-surface rounded-3xl p-4">
                  <button
                    onClick={() => {
                      if (onNavigateTo) {
                        onNavigateTo(ScreenId.Financials);
                      }
                    }}
                    type="button"
                    className="w-full text-left py-2 px-2 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[13.5px] font-display font-extrabold text-gray-800 block">
                        Service Model & Financials
                      </span>
                      <span className="text-[11.5px] text-gray-500 font-medium leading-normal block">
                        Founder View: Explore HopeHeart sustainability ecosystem models.
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Privacy Note */}
              <p className="text-[11.5px] text-gray-455 font-semibold leading-relaxed text-center italic max-w-[370px] mx-auto pt-2 pb-2">
                Your profile is private. HopeHeart never shows your exact location, phone number, diagnosis, medication, or private notes.
              </p>

              {/* Security Badge */}
              <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-2xl text-center">
                <span className="text-[12px] font-semibold text-[#FF7527] leading-relaxed block">
                  🛡️ Private local storage in MVP. Secure encrypted storage planned for production. Safety rules help detect and block unsafe medical advice, prescriptions, dosage guidance, diagnosis claims, and cure promises.
                </span>
              </div>

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
'@

Write-HopeHeartFile -RelativePath 'src/components/MoodScreen.tsx' -Content @'
import { MoodConfig } from '../types';

interface MoodScreenProps {
  onBack: () => void;
  selectedMood: MoodConfig;
  checkinCount: number;
}

export default function MoodScreen({ onBack, selectedMood, checkinCount }: MoodScreenProps) {
  const lastMood = localStorage.getItem('hopeheart_last_checkin_mood') || selectedMood.label;
  const lastDate = localStorage.getItem('hopeheart_last_checkin_date');
  const recentMood = lastMood || 'Not checked in yet';
  const patternText = checkinCount > 1
    ? `You have checked in ${checkinCount} times. Notice what helps you feel steady, one day at a time.`
    : 'Start with one gentle check-in. Patterns become clearer after a few reflections.';

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Mood</span>
        <span className="text-[20px] select-none">🌤️</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 space-y-3 text-center">
          <span className="text-[36px] block">{selectedMood.emoji}</span>
          <div>
            <span className="text-[10px] font-mono font-black text-[#FF7527] uppercase tracking-wider block">Today's mood</span>
            <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">{selectedMood.label}</h2>
          </div>
          <p className="text-[12.5px] text-gray-500 font-semibold italic leading-relaxed">“{selectedMood.tagline}”</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="hh-surface rounded-3xl p-4 space-y-2">
            <h3 className="font-display font-black text-gray-800 text-[14px]">Recent check-in</h3>
            <p className="text-[13px] text-gray-600 font-semibold">{recentMood}</p>
            <p className="text-[11px] text-gray-400 font-bold">{lastDate ? `Saved on ${lastDate}` : 'No date saved yet'}</p>
          </div>
          <div className="hh-surface rounded-3xl p-4 space-y-2">
            <h3 className="font-display font-black text-gray-800 text-[14px]">Mood pattern</h3>
            <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">{patternText}</p>
          </div>
        </div>

        <div className="bg-[#FFF8EE] border border-orange-100 rounded-2xl p-4 text-center">
          <p className="text-[12px] text-[#A16207] font-bold leading-relaxed">This is for self-reflection, not diagnosis.</p>
        </div>
      </div>
    </div>
  );
}
'@

Write-HopeHeartFile -RelativePath 'src/components/MemoriesScreen.tsx' -Content @'
import { useRef, useState } from 'react';

interface MemoryItem {
  id: string;
  text: string;
  prompt: string;
  createdAt: string;
}

interface MemoriesScreenProps {
  onBack: () => void;
}

const MEMORY_PROMPTS = [
  'A small moment that made me feel okay',
  'Someone who made me smile',
  'A place where I felt calm',
  'Something I survived and feel proud of'
];

export default function MemoriesScreen({ onBack }: MemoriesScreenProps) {
  const [selectedPrompt, setSelectedPrompt] = useState(MEMORY_PROMPTS[0]);
  const [memoryText, setMemoryText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hopeheart_positive_memories') || '[]');
    } catch {
      return [];
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveMemory = () => {
    if (!memoryText.trim()) return;
    const nextMemory: MemoryItem = {
      id: Date.now().toString(),
      text: memoryText.trim(),
      prompt: selectedPrompt,
      createdAt: new Date().toISOString()
    };
    const updated = [nextMemory, ...memories];
    setMemories(updated);
    localStorage.setItem('hopeheart_positive_memories', JSON.stringify(updated));
    setMemoryText('');
  };

  const handleImagePreview = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Memories</span>
        <span className="text-[20px] select-none">🌼</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 space-y-3 text-center">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Save a gentle memory</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Keep small proof that okay moments still exist. Saved locally on this device.</p>
        </div>

        <div className="hh-surface rounded-3xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MEMORY_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setSelectedPrompt(prompt)}
                className={`p-3 rounded-2xl border text-left text-[12px] font-bold transition-all cursor-pointer ${selectedPrompt === prompt ? 'bg-[#FFF2EA] border-[#FF7527]/40 text-[#C75414]' : 'bg-white border-gray-200 text-gray-600 hover:bg-[#FFF8F2]'}`}
              >
                {prompt}
              </button>
            ))}
          </div>

          <textarea
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            rows={4}
            placeholder="Write a comforting moment here..."
            className="w-full px-3.5 py-3 bg-[#FCFBF8] border border-gray-200 rounded-2xl text-[12.5px] text-gray-700 font-semibold focus:outline-none focus:border-[#FF7527]/50 resize-none"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImagePreview(e.target.files?.[0])}
          />
          {imagePreview && (
            <div className="rounded-2xl border border-gray-150 overflow-hidden bg-white">
              <img src={imagePreview} alt="Local memory preview" className="w-full max-h-56 object-cover" />
              <p className="text-[10.5px] text-gray-400 font-bold p-2 text-center">Preview only — image is not uploaded.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
            >
              Preview local image
            </button>
            <button
              type="button"
              onClick={handleSaveMemory}
              className="py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
            >
              Save comforting moment
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-display font-black text-gray-800 text-[15px] px-1">Saved memories</h3>
          {memories.length === 0 ? (
            <div className="hh-surface rounded-2xl p-4 text-center text-[12px] text-gray-500 font-semibold">No memories saved yet. Start with one small moment.</div>
          ) : memories.map((memory) => (
            <div key={memory.id} className="hh-surface rounded-2xl p-4 space-y-1">
              <span className="text-[10px] text-[#FF7527] font-mono font-black uppercase tracking-wider">{memory.prompt}</span>
              <p className="text-[12.5px] text-gray-650 font-semibold leading-relaxed">{memory.text}</p>
              <p className="text-[10px] text-gray-400 font-bold">{new Date(memory.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'@

Write-HopeHeartFile -RelativePath 'src/components/ResourcesScreen.tsx' -Content @'
interface ResourcesScreenProps {
  onBack: () => void;
}

const RESOURCE_CATEGORIES = [
  'Anxiety',
  'Stress',
  'Loneliness',
  'Overthinking',
  'Sleep & rest',
  'Grounding exercises',
  'Breathing exercises',
  'Self-kindness'
];

export default function ResourcesScreen({ onBack }: ResourcesScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Resources</span>
        <span className="text-[20px] select-none">📚</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 space-y-2 text-center">
          <h2 className="font-display font-black text-[#2B1D12] text-[22px] leading-tight">Read when you are ready</h2>
          <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">Small steps only. No pressure. You are not being forced to talk.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RESOURCE_CATEGORIES.map((category) => (
            <div key={category} className="hh-surface rounded-2xl p-4 space-y-2">
              <h3 className="font-display font-black text-gray-800 text-[14px]">{category}</h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">A gentle place to learn, pause, and choose one small next step for yourself.</p>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF8EE] border border-orange-100 rounded-2xl p-4 text-center">
          <p className="text-[12px] text-[#A16207] font-bold leading-relaxed">HopeHeart does not diagnose, prescribe, give dosage advice, or promise cures. For immediate danger, contact local emergency services or nearest emergency care.</p>
        </div>
      </div>
    </div>
  );
}
'@

Write-Host 'HopeHeart final files were applied successfully.'
