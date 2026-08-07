import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import WhatsAppRemindersConfig from './WhatsAppRemindersConfig';

interface NotificationsScreenProps {
  onBack: () => void;
  previousMood?: string | null;
  onNavigateTo?: (screenId: string) => void;
}

type DailyCard = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  action?: string;
  screenId?: string;
  tone: string;
};

export default function NotificationsScreen({ onBack, previousMood, onNavigateTo }: NotificationsScreenProps) {
  const [dailyBriefEnabled, setDailyBriefEnabled] = useState<boolean>(() => localStorage.getItem('hopeheart_daily_brief_enabled') !== 'false');
  const [notifyMood, setNotifyMood] = useState<boolean>(true);
  const [notifyMemories, setNotifyMemories] = useState<boolean>(true);
  const [notifyNextStep, setNotifyNextStep] = useState<boolean>(true);
  const [notifyCommunity, setNotifyCommunity] = useState<boolean>(true);
  const [notifyResources, setNotifyResources] = useState<boolean>(true);
  const [quietHours, setQuietHours] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('Gentle');
  const [selectedChannel, setSelectedChannel] = useState<string>('In-app');

  const isProfileCompleted = localStorage.getItem('hopeheart_profile_basic_completed') === 'true';
  const currentMood = localStorage.getItem('hopeheart_last_checkin_mood') || previousMood || 'not checked in yet';
  const lastMemory = localStorage.getItem('hopeheart_last_memory_title') || localStorage.getItem('hopeheart_last_memory') || 'Save one small memory from today.';

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  }, []);

  const toggleDailyBrief = () => {
    const next = !dailyBriefEnabled;
    setDailyBriefEnabled(next);
    localStorage.setItem('hopeheart_daily_brief_enabled', String(next));
  };

  const dailyCards: DailyCard[] = [
    {
      id: 'yesterday-mood',
      icon: '🌤️',
      title: 'Yesterday mood reflection',
      body: previousMood
        ? `Yesterday/last check-in you felt ${previousMood}. Today, start with one gentle check-in before you choose what to do next.`
        : `Your last saved mood is ${currentMood}. Check in today so HopeHeart can understand what kind of comfort may help.`,
      time: 'Morning brief',
      action: 'Check in now',
      screenId: 'home',
      tone: 'from-[#FFF7E8] to-[#FFFDF8]'
    },
    {
      id: 'memory-reminder',
      icon: '📸',
      title: 'Memory reminder',
      body: `Remember something kind from today. ${lastMemory}`,
      time: 'Daily memory',
      action: 'Open My Space',
      screenId: 'my-space',
      tone: 'from-[#F8F0FF] to-[#FFFDF8]'
    },
    {
      id: 'next-step',
      icon: '🧡',
      title: 'What is coming next',
      body: 'After check-in, HopeHeart will suggest one small comfort action first — food, music, memory, circles, or chat only if you want.',
      time: 'Next step',
      action: 'Go Home',
      screenId: 'home',
      tone: 'from-[#FFF0EA] to-[#FFFDF8]'
    },
    {
      id: 'community',
      icon: '🤝',
      title: 'Community nudge',
      body: 'Quiet circles are available when you want people around you without pressure to share everything.',
      time: 'Community idea',
      action: 'Explore Community',
      screenId: 'community',
      tone: 'from-[#EEF8F0] to-[#FFFDF8]'
    },
    {
      id: 'resource-idea',
      icon: '🌼',
      title: 'Beautiful resource idea',
      body: 'Try one gentle resource today: a breathing note, a saved care question, a comforting article, or a simple grounding idea.',
      time: 'Resource idea',
      action: 'Open Resources',
      screenId: 'doctor-suggestions',
      tone: 'from-[#EAF4FF] to-[#FFFDF8]'
    }
  ];

  const visibleCards = dailyCards.filter((card) => {
    if (card.id === 'yesterday-mood') return notifyMood;
    if (card.id === 'memory-reminder') return notifyMemories;
    if (card.id === 'next-step') return notifyNextStep;
    if (card.id === 'community') return notifyCommunity;
    if (card.id === 'resource-idea') return notifyResources;
    return true;
  });

  const settings = [
    {
      label: 'Yesterday mood summary',
      text: 'Remind me how I felt last time and ask how I feel today.',
      enabled: notifyMood,
      onToggle: () => setNotifyMood(!notifyMood)
    },
    {
      label: 'Memories & self-reminders',
      text: 'Nudge me to save one small memory or comforting thought.',
      enabled: notifyMemories,
      onToggle: () => setNotifyMemories(!notifyMemories)
    },
    {
      label: 'What is coming next',
      text: 'Show the next gentle step after mood check-in.',
      enabled: notifyNextStep,
      onToggle: () => setNotifyNextStep(!notifyNextStep)
    },
    {
      label: 'Community circles',
      text: 'Suggest quiet community spaces when they may help.',
      enabled: notifyCommunity,
      onToggle: () => setNotifyCommunity(!notifyCommunity)
    },
    {
      label: 'Beautiful resource ideas',
      text: 'Send gentle ideas from resources without medical advice.',
      enabled: notifyResources,
      onToggle: () => setNotifyResources(!notifyResources)
    }
  ];

  const handleCardAction = (screenId?: string) => {
    if (screenId && onNavigateTo) {
      onNavigateTo(screenId);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Daily Notifications
        </span>
        <span className="text-[20px] select-none">🔔</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-6 pb-28 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="hh-hero-surface rounded-[30px] p-5 sm:p-7 border border-orange-100/70 shadow-3xs overflow-hidden relative">
            <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#FFD7C2]/45 blur-2xl" />
            <div className="relative space-y-4">
              <span className="inline-flex rounded-full bg-[#FFF2EA] px-3 py-1 text-[10px] font-mono font-black uppercase tracking-[0.16em] text-[#FF7527]">
                {todayLabel}
              </span>
              <div className="space-y-2">
                <h2 className="font-display font-black text-[#2B1D12] text-[27px] leading-tight">
                  Your gentle daily HopeHeart brief
                </h2>
                <p className="text-[14px] text-gray-600 font-semibold leading-relaxed">
                  A simple daily page for yesterday’s mood, memories, what comes next, community nudges, and beautiful resource ideas.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 border border-orange-100/70 p-3">
                <span>
                  <span className="block font-display font-black text-[#10213D] text-[13.5px]">Daily brief</span>
                  <span className="block text-[11.5px] text-gray-500 font-semibold">Soft reminders only, no pressure.</span>
                </span>
                <button
                  onClick={toggleDailyBrief}
                  type="button"
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${dailyBriefEnabled ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform transform ${dailyBriefEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {dailyBriefEnabled && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-extrabold text-[#A29985] tracking-widest block uppercase px-1">
                Today’s gentle reminders
              </span>
              {visibleCards.map((card) => (
                <div key={card.id} className={`rounded-[26px] border border-orange-100/70 p-4 shadow-3xs bg-gradient-to-br ${card.tone}`}>
                  <div className="flex items-start gap-3">
                    <span className="w-13 h-13 rounded-2xl bg-white/75 border border-orange-100 flex items-center justify-center text-[25px] shrink-0">
                      {card.icon}
                    </span>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-black text-[#10213D] text-[16px] leading-tight">{card.title}</h4>
                        <span className="text-[9.5px] font-mono font-bold text-gray-400 shrink-0">{card.time}</span>
                      </div>
                      <p className="text-[12.5px] text-gray-600 font-semibold leading-relaxed">{card.body}</p>
                      {card.action && (
                        <button
                          type="button"
                          onClick={() => handleCardAction(card.screenId)}
                          className="mt-2 inline-flex rounded-xl bg-white border border-orange-100 px-3 py-2 text-[11.5px] font-display font-black text-[#FF7527] hover:bg-[#FFF6EF] cursor-pointer"
                        >
                          {card.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="hh-surface rounded-3xl p-5 space-y-4">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              What should HopeHeart remind you about?
            </span>
            {settings.map((setting, index) => (
              <div key={setting.label} className={`flex items-center justify-between gap-4 ${index !== settings.length - 1 ? 'pb-3.5 border-b border-gray-100' : ''}`}>
                <div className="max-w-[75%]">
                  <span className="text-[13.5px] font-bold text-gray-800 block">{setting.label}</span>
                  <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">{setting.text}</p>
                </div>
                <button
                  onClick={setting.onToggle}
                  type="button"
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${setting.enabled ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="hh-surface rounded-3xl p-5 space-y-4">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Delivery style
            </span>

            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="max-w-[75%]">
                <span className="text-[13.5px] font-bold text-gray-800 block">Quiet hours</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Pause reminders during rest time.</p>
              </div>
              <button
                onClick={() => setQuietHours(!quietHours)}
                type="button"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${quietHours ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${quietHours ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-gray-100 gap-2">
              <div>
                <span className="text-[13.5px] font-bold text-gray-800 block">Reminder style</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Choose how reminders feel.</p>
              </div>
              <div className="flex gap-1.5 shrink-0 flex-wrap">
                {['Gentle', 'Normal', 'Important only'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      selectedStyle === style
                        ? 'bg-[#FFF2EA] text-[#FF7527] border-[#FF7527]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[13.5px] font-bold text-gray-800 block">Notification channel</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Preferred channel for the MVP.</p>
              </div>
              <div className="flex gap-1.5 shrink-0 flex-wrap">
                {['In-app', 'Email', 'Push later'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChannel(ch)}
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      selectedChannel === ch
                        ? 'bg-[#FFF2EA] text-[#FF7527] border-[#FF7527]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <WhatsAppRemindersConfig />

          <div className="space-y-3">
            <span className="text-[11px] font-mono font-extrabold text-[#A29985] tracking-widest block uppercase px-1">
              Account reminders
            </span>
            <div className={`p-4 hh-surface rounded-2xl flex items-center justify-between gap-4 border ${
              !isProfileCompleted ? 'border-amber-200 bg-amber-50/20' : 'border-gray-150/40 bg-[#FCFAF5]/65'
            }`}
            >
              <div className="flex-1">
                <h4 className={`text-[13px] font-extrabold ${!isProfileCompleted ? 'text-amber-950' : 'text-gray-800'}`}>
                  {!isProfileCompleted ? 'Complete your Safe Profile' : 'Your Safe Profile is ready.'}
                </h4>
                <p className="text-[12px] text-gray-500 font-medium leading-relaxed mt-0.5">
                  {!isProfileCompleted
                    ? 'Add a few safe details to improve support matching.'
                    : 'Your anonymous profile basics are configured for matching.'}
                </p>
                <span className="text-[10px] text-gray-400 block font-mono mt-1.5">System Alert</span>
              </div>
              {!isProfileCompleted ? (
                <button
                  onClick={() => handleCardAction('profile')}
                  type="button"
                  className="px-3 py-2 bg-white border border-orange-100 text-[#FF7527] rounded-xl font-display font-black text-[11px] cursor-pointer"
                >
                  Open Profile
                </button>
              ) : (
                <span className="w-6 h-6 flex items-center justify-center text-emerald-600 shrink-0 text-[18px] font-bold" title="Profile Complete">
                  ✓
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-[#FFF8EE]/80 border border-orange-100 rounded-[24px] text-left flex items-start gap-3 shadow-3xs">
            <span className="w-11 h-11 rounded-full bg-white border border-orange-100 flex items-center justify-center text-[22px] shrink-0">🛡️</span>
            <p className="text-[12px] font-semibold text-[#8A4B22] leading-relaxed">
              HopeHeart reminders are for emotional support only. They do not diagnose, treat, prescribe, replace professional care, or provide crisis support.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export { NotificationsScreen };
