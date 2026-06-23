import { useState } from 'react';
import { motion } from 'motion/react';
import WhatsAppRemindersConfig from './WhatsAppRemindersConfig';

interface NotificationsScreenProps {
  onBack: () => void;
  previousMood?: string | null;
  onNavigateTo?: (screenId: string) => void;
}

export default function NotificationsScreen({ onBack, previousMood, onNavigateTo }: NotificationsScreenProps) {
  // Alert category toggles
  const [notifyReplies, setNotifyReplies] = useState<boolean>(true);
  const [notifyRoom, setNotifyRoom] = useState<boolean>(true);
  const [notifyBuddy, setNotifyBuddy] = useState<boolean>(true);
  const [notifySafety, setNotifySafety] = useState<boolean>(true);

  // MVP Visual preferences
  const [quietHours, setQuietHours] = useState<boolean>(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('Gentle');
  const [selectedChannel, setSelectedChannel] = useState<string>('In-app');

  const isProfileCompleted = localStorage.getItem('hopeheart_profile_basic_completed') === 'true';

  const notificationsList = [
    ...(previousMood ? [{
      id: 'mood-reminder',
      title: 'Daily Mood Check-in',
      body: `Last time, you felt ${previousMood}. How are you feeling today?`,
      time: 'Just now',
      isRead: false
    }] : []),
    { id: 'n1', title: '🧡 HopeBuddy Reminder', body: 'Time for a gentle check-in.', time: '2 hours ago', isRead: true },
    { id: 'n2', title: '💬 Listener Reply', body: 'A safe listener replied to your message.', time: '1 day ago', isRead: true },
    { id: 'n3', title: '🛡️ Safety Reminder', body: 'HopeHeart blocks diagnosis, prescriptions, dosage advice, and cure claims.', time: '3 days ago', isRead: true }
  ];

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Header bar */}
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
          Notifications & Alerts
        </span>
        <span className="text-[20px] select-none">🔔</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Section Title */}
          <div className="text-center md:text-left space-y-1">
            <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
              Stay gently updated
            </h2>
            <p className="text-[13px] text-gray-500 font-semibold leading-relaxed">
              Choose what HopeHeart can remind you about. You stay in control.
            </p>
          </div>

          {/* Toggles Checklist */}
          <div className="hh-surface rounded-3xl p-5 space-y-4">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Alert Categories
            </span>

            {/* Option 1: Listener replies */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="max-w-[75%]">
                <span className="text-[13.5px] font-bold text-gray-800 block">💬 Listener replies</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Notify me when a matched listener replies.</p>
              </div>
              <button
                onClick={() => setNotifyReplies(!notifyReplies)}
                type="button"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${notifyReplies ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${notifyReplies ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Option 2: Support room activity */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="max-w-[75%]">
                <span className="text-[13.5px] font-bold text-gray-800 block">🤝 Support room activity</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Notify me when someone responds in rooms I joined.</p>
              </div>
              <button
                onClick={() => setNotifyRoom(!notifyRoom)}
                type="button"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${notifyRoom ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${notifyRoom ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Option 3: HopeBuddy check-ins */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="max-w-[75%]">
                <span className="text-[13.5px] font-bold text-gray-800 block">🧡 HopeBuddy check-ins</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Remind me to check in with my mood.</p>
              </div>
              <button
                onClick={() => setNotifyBuddy(!notifyBuddy)}
                type="button"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${notifyBuddy ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${notifyBuddy ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Option 4: Safety reminders */}
            <div className="flex items-center justify-between">
              <div className="max-w-[75%]">
                <span className="text-[13.5px] font-bold text-gray-800 block">🛡️ Safety reminders</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Notify me about important safety or privacy updates.</p>
              </div>
              <button
                onClick={() => setNotifySafety(!notifySafety)}
                type="button"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${notifySafety ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${notifySafety ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Notification Preferences Section (MVP Visual Controls Only) */}
          <div className="hh-surface rounded-3xl p-5 space-y-4">
            <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              Notification Preferences
            </span>

            {/* Quiet Hours */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="max-w-[75%]">
                <span className="text-[13.5px] font-bold text-gray-800 block">Quiet Hours</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Pause notifications during rest time.</p>
              </div>
              <button
                onClick={() => setQuietHours(!quietHours)}
                type="button"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${quietHours ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${quietHours ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Reminder Style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-gray-100 gap-2">
              <div>
                <span className="text-[13.5px] font-bold text-gray-800 block">Reminder Style</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Choose how reminders are presented.</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
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

            {/* Notification Channel */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[13.5px] font-bold text-gray-800 block">Notification Channel</span>
                <p className="text-[11.5px] text-gray-400 font-semibold mt-0.5 leading-snug">Preferred channel for alerts.</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {['In-app', 'Email', 'Push'].map((ch) => (
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

          {/* WhatsApp Reminders Config */}
          <WhatsAppRemindersConfig />

          {/* Notifications log history */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-extrabold text-[#A29985] tracking-widest block uppercase px-1">
              Recent Notifications ({notificationsList.length + 1})
            </span>

            <div className="space-y-2.5">
              {/* Profile Completion Notification Card */}
              <div 
                className={`p-4 hh-surface rounded-2xl flex items-center justify-between gap-4 border ${
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
                    onClick={() => {
                      if (onNavigateTo) {
                        onNavigateTo('profile'); // ScreenId.Profile is 'profile'
                      }
                    }}
                    type="button"
                    className="w-10 h-10 flex items-center justify-center hover:bg-orange-50 rounded-xl transition-all cursor-pointer text-[#FF7527] shrink-0 border border-transparent hover:border-orange-200"
                    title="Go to Profile Settings"
                  >
                    <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                ) : (
                  <span className="w-6 h-6 flex items-center justify-center text-emerald-600 shrink-0 text-[18px] font-bold" title="Profile Complete">
                    ✓
                  </span>
                )}
              </div>

              {notificationsList.map((notify) => (
                <div 
                  key={notify.id}
                  className="p-4 hh-surface rounded-2xl flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="text-[13px] font-extrabold text-gray-800">{notify.title}</h4>
                    <p className="text-[12px] text-gray-500 font-medium leading-relaxed mt-0.5">{notify.body}</p>
                    <span className="text-[10px] text-gray-450 block font-mono mt-1.5">{notify.time}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export { NotificationsScreen };
