import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, MoodConfig, DoctorQuestion } from './types';

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
import { MascotSitting, BrandWordmark } from './components/Logo';
import HopeBuddyWidget from './components/HopeBuddyWidget';

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
              setCurrentScreen(ScreenId.ProfileSetup);
            }}
          />
        );

      case ScreenId.ProfileSetup:
        return (
          <ProfileSetupScreen 
            initialNickname={userName}
            onComplete={(details) => {
              setUserName(details.nickname);
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
    <div className="min-h-screen w-full bg-[#FCFAF5] sm:bg-[#F5EFE4] text-[#1E1E1A] font-sans flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 bg-[radial-gradient(#EADFC9_1.2px,transparent_1.2px)] [background-size:16px_16px] antialiased">
      
      {/* 
        FULLY RESPONSIVE DASHBOARD AREA CONTAINER
        No device mockup frames or telephone margins!
        Uses full-width on mobile viewports.
        Caps on tablet configurations, and handles spacious bento column grids for laptop displays.
      */}
      <div className="w-full sm:max-w-[760px] md:max-w-[880px] lg:max-w-[1100px] min-h-screen sm:min-h-[640px] sm:h-[min(780px,88vh)] bg-[#FCFAF5] rounded-none sm:rounded-[28px] shadow-none sm:shadow-lg border-0 sm:border border-gray-200/50 relative flex flex-col overflow-hidden">
        
        {/* TOP Header and Navigation Bar */}
        {showNavChannels && (
          <header className="flex h-[64px] sm:h-[68px] shrink-0 bg-white border-b border-[#ECE6D9] items-center justify-between px-4 sm:px-6 z-30 select-none">
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
        <div className="flex-1 overflow-y-auto relative flex flex-col bg-[#FCFAF5]">
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
            <footer className="w-full bg-white sm:bg-[#FAF8F5] border-t border-[#ECE6D9] py-5 px-5 text-center mt-auto shrink-0 select-none">
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
          <nav className="sm:hidden h-[74px] shrink-0 bg-white border-t border-[#ECE6D9] flex items-center justify-around pb-safe z-30 shadow-[0_-3px_12px_rgba(43,29,18,0.015)] select-none">
            
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
              className="bg-[#FCFAF5] rounded-[28px] w-full max-w-lg shadow-2xl border border-gray-150 overflow-hidden"
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
        />
      )}

    </div>
  );
}
