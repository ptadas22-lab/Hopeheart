import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, MoodConfig, DoctorQuestion } from './types';
import { supabase, saveSafeRulesConsentBackend } from './lib/supabaseClient';

// Importing all modular screen components
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import ProfileSetupScreen from './components/ProfileSetupScreen';
import DashboardScreen from './components/DashboardScreen';
import HopeBuddyChatScreen from './components/HopeBuddyChatScreen';
import ListenerMatchScreen from './components/ListenerMatchScreen';
import SupportRoomsScreen from './components/SupportRoomsScreen';
import ShareSafelyScreen from './components/ShareSafelyScreen';
import NearbyCommunityScreen from './components/NearbyCommunityScreen';
import CareBridgeScreen from './components/CareBridgeScreen';
import SafetyScreen from './components/SafetyScreen';
import ProfileUtilityScreen from './components/ProfileUtilityScreen';
import NotificationsScreen from './components/NotificationsScreen';
import AboutScreen from './components/AboutScreen';
import ModerationAlertScreen from './components/ModerationAlertScreen';
import FinancialsScreen from './components/FinancialsScreen';
import { MascotSitting, BrandWordmark } from './components/Logo';
import HopeBuddyWidget from './components/HopeBuddyWidget';

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

  const handleMoodSelected = (moodId: string) => {
    setSelectedMoodId(moodId);
    localStorage.setItem('hopeheart_mood', moodId);
  };
  const [userName, setUserName] = useState<string>('Voice47');
  const [todayQuote, setTodayQuote] = useState<string>("Rest is productive too. You're allowed to slow down.");
  const [savedQuestions, setSavedQuestions] = useState<DoctorQuestion[]>([
    { id: 'q-1', text: 'Can medication dosage adjust on an empty stomach?', createdAt: 'Just now' },
    { id: 'q-2', text: 'Daily morning tremor checking checklist', createdAt: 'Just now' }
  ]);

  // Global overlay trigger states for Screen 21 (Moderation Block) and Screen 22 (Crisis Hotline)
  const [overlayType, setOverlayType] = useState<'moderation' | 'crisis' | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadComingSoon, setDownloadComingSoon] = useState(false);

  useEffect(() => {
    if (copySuccess) {
      const t = setTimeout(() => setCopySuccess(false), 2500);
      return () => clearTimeout(t);
    }
  }, [copySuccess]);

  useEffect(() => {
    if (downloadComingSoon) {
      const t = setTimeout(() => setDownloadComingSoon(false), 2500);
      return () => clearTimeout(t);
    }
  }, [downloadComingSoon]);

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

        // Check if profile is completed
        const isCompleted = localStorage.getItem('hopeheart_profile_completed') === 'true' || 
                            localStorage.getItem('hopeheart_profile_nickname');
        if (isCompleted) {
          setCurrentScreen(ScreenId.Home);
        } else {
          setCurrentScreen(ScreenId.ProfileSetup);
        }
      }
    };

    const checkGuestSession = () => {
      const guestSessionId = localStorage.getItem('hopeheart_guest_session_id');
      if (guestSessionId) {
        const storedNick = localStorage.getItem('hopeheart_profile_nickname') || 'Companion';
        setUserName(storedNick);

        const isCompleted = localStorage.getItem('hopeheart_profile_completed') === 'true' || 
                            localStorage.getItem('hopeheart_profile_nickname');
        if (isCompleted) {
          setCurrentScreen(ScreenId.Home);
        } else {
          setCurrentScreen(ScreenId.ProfileSetup);
        }
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

  const handleShareClick = async () => {
    const shareData = {
      title: 'HopeHeart Check-In',
      text: 'Today I’m choosing support, not silence.',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
  };

  const handleDownloadCard = () => {
    setDownloadComingSoon(true);
  };

  // Trigger quote refresh
  const handleRefreshQuote = () => {
    const list = EN_DIARY_WISDOM.filter(q => q !== todayQuote);
    const randomIdx = Math.floor(Math.random() * list.length);
    setTodayQuote(list[randomIdx]);
  };

  // Doctor checklist actions
  const handleAddQuestion = (text: string) => {
    const newQ: DoctorQuestion = {
      id: Date.now().toString(),
      text,
      createdAt: 'Just now'
    };
    setSavedQuestions(prev => [newQ, ...prev]);
  };

  const handleDeleteQuestion = (id: string) => {
    setSavedQuestions(prev => prev.filter(q => q.id !== id));
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
              // Check profile completion status
              const isCompleted = localStorage.getItem('hopeheart_profile_completed') === 'true' || 
                                  localStorage.getItem('hopeheart_profile_nickname');
              if (isCompleted) {
                setCurrentScreen(ScreenId.Home);
              } else {
                setCurrentScreen(ScreenId.ProfileSetup);
              }
            }}
            onNavigateTo={(scr) => setCurrentScreen(scr)}
          />
        );

      case ScreenId.ProfileSetup:
        return (
          <ProfileSetupScreen 
            initialNickname={userName}
            onComplete={(details) => {
              setUserName(details.nickname);
              localStorage.setItem('hopeheart_profile_completed', 'true');
              setCurrentScreen(ScreenId.Home);
            }}
          />
        );

      case ScreenId.Home:
        return (
          <DashboardScreen 
            userName={userName}
            selectedMood={selectedMood}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
            todayQuote={todayQuote}
            onRefreshQuote={handleRefreshQuote}
            onMoodSelected={handleMoodSelected}
            onShareCheckIn={() => setShowShareModal(true)}
          />
        );

      case ScreenId.HopeBuddyChat:
        return (
          <HopeBuddyChatScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            userName={userName}
            selectedMood={selectedMood}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
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
          />
        );

      case ScreenId.SupportRooms:
      case ScreenId.RoomDetail:
        return (
          <SupportRoomsScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onOpenModerationBlock={() => setOverlayType('moderation')}
          />
        );

      case ScreenId.ShareSafely:
      case ScreenId.MomentShare:
        return (
          <ShareSafelyScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onPostSuccess={() => setCurrentScreen(ScreenId.Home)}
          />
        );

      case ScreenId.NearbyAccess:
      case ScreenId.NearbyResults:
      case ScreenId.CommunityDetail:
      case ScreenId.MeetSafely:
        return (
          <NearbyCommunityScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
          />
        );

      case ScreenId.DoctorSuggestions:
      case ScreenId.ProfessionalProfile:
      case ScreenId.BookCare:
      case ScreenId.SaveQuestions:
        return (
          <CareBridgeScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            onNavigateTo={(scr) => setCurrentScreen(scr as ScreenId)}
            savedQuestions={savedQuestions}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        );

      case ScreenId.AISafety:
        return (
          <SafetyScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
          />
        );

      case ScreenId.Profile:
      case ScreenId.PrivacySettings:
        return (
          <ProfileUtilityScreen 
            onBack={() => setCurrentScreen(ScreenId.Home)}
            userName={userName}
            onChangeName={(newName) => setUserName(newName)}
            initialSubStage={currentScreen === ScreenId.PrivacySettings ? 'privacy' : 'profile'}
            onNavigateTo={(scr) => setCurrentScreen(scr)}
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
  const isSupportActive = currentScreen === ScreenId.SupportRooms || currentScreen === ScreenId.SafeListener || currentScreen === ScreenId.SafeChat || currentScreen === ScreenId.RoomDetail || currentScreen === ScreenId.ShareSafely || currentScreen === ScreenId.MomentShare || currentScreen === ScreenId.NearbyAccess || currentScreen === ScreenId.NearbyResults || currentScreen === ScreenId.CommunityDetail || currentScreen === ScreenId.MeetSafely;
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
                onClick={() => setCurrentScreen(ScreenId.SafeListener)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSupportActive ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🤝</span> Community
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
                onClick={() => setCurrentScreen(ScreenId.AISafety)}
                className={`px-3 py-2 rounded-xl font-display font-bold text-[12.5px] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSafetyActive ? 'bg-[#FFF2EA] text-[#FF7527]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🛡️</span> Safety
              </button>
            </nav>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentScreen(ScreenId.Notifications)}
                className="w-10 h-10 rounded-full border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-[18px] cursor-pointer"
                title="Notifications Alert"
              >
                🔔
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

            {/* Tab 2: Support */}
            <button
              onClick={() => setCurrentScreen(ScreenId.SafeListener)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                isSupportActive ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🤝</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Community</span>
              {isSupportActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>
 
            {/* Tab 4: Care */}
            <button
              onClick={() => setCurrentScreen(ScreenId.DoctorSuggestions)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                isCareActive ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🩺</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Resources</span>
              {isCareActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-6 h-0.75 rounded-full bg-[#FF7527]"
                />
              )}
            </button>
 
            {/* Tab 5: Safety */}
            <button
              onClick={() => setCurrentScreen(ScreenId.AISafety)}
              className={`flex flex-col items-center justify-center flex-1 h-[52px] rounded-xl transition-all relative cursor-pointer ${
                isSafetyActive ? 'text-[#FF7527]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-[17px] mb-0.5 select-none leading-none">🛡️</span>
              <span className="text-[9.5px] font-display font-black tracking-tight leading-none">Safety</span>
              {isSafetyActive && (
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
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm hh-surface rounded-[32px] p-6 z-10 space-y-5 text-center"
            >
              <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                <span className="font-display font-black text-[15px] text-gray-800">
                  Share Your Check-In
                </span>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-655 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Share Card Preview Box */}
              <div className="p-5 bg-gradient-to-br from-[#FFF8F4] to-[#FAF5FF] border border-[#FFD3B6]/30 rounded-2.5xl shadow-sm text-center space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none select-none text-[80px] translate-x-5 -translate-y-5">
                  🧡
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-widest block">
                    HopeHeart Check-In
                  </span>
                  <p className="text-[14px] font-display font-black text-gray-855 px-2 leading-snug">
                    "Today I’m choosing support, not silence."
                  </p>
                </div>

                {/* Mood Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/85 border border-gray-200/50 rounded-2xl shadow-3xs">
                  <span className="text-[20px]">{selectedMood.emoji}</span>
                  <span className="text-[12.5px] font-display font-black text-gray-750">
                    Mood: {selectedMood.label}
                  </span>
                </div>

                <div className="border-t border-[#EDE9DE]/50 pt-3 flex flex-col items-center leading-none gap-1">
                  <span className="font-display font-black text-[#2B1D12] text-[13px]">
                    HopeHeart
                  </span>
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    Safe Emotional Hub
                  </span>
                </div>
              </div>

              {/* Privacy Notice */}
              <p className="text-[10.5px] text-gray-450 font-semibold leading-normal max-w-[240px] mx-auto italic">
                Only your selected mood is shown. Private notes are never shared.
              </p>

              {/* Toast Copy Link / Download success */}
              {copySuccess && (
                <div className="py-1.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11px] font-bold">
                  Link copied safely
                </div>
              )}
              {downloadComingSoon && (
                <div className="py-1.5 px-3 bg-amber-50 text-amber-850 border border-amber-200 rounded-xl text-[11px] font-bold">
                  Coming soon
                </div>
              )}

              {/* Actions Grid */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={handleShareClick}
                  className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-xs"
                >
                  Share
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 bg-white hover:bg-[#FCFAF5] border border-gray-250 text-gray-750 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
                >
                  Copy Link
                </button>
                <button
                  onClick={handleDownloadCard}
                  className="w-full py-2.5 bg-white hover:bg-[#FCFAF5] border border-gray-250 text-gray-750 rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95"
                >
                  Download Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
