import { useState } from 'react';
import { motion } from 'motion/react';

interface NotificationsScreenProps {
  onBack: () => void;
}

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  // Configured alerts toggles
  const [notifyChat, setNotifyChat] = useState<boolean>(true);
  const [notifyReplies, setNotifyReplies] = useState<boolean>(true);
  const [notifySafety, setNotifySafety] = useState<boolean>(true);

  const notificationsList = [
    { id: 'n1', title: '🛡️ AI Safety Update', body: 'HopeHeart AI successfully updated custom medication block filters.', time: '2 hours ago', isRead: true },
    { id: 'n2', title: '🛋️ Caring reply in Loneliness Room', body: 'Voice88 replied kindly to your anonymous comfort card.', time: '1 day ago', isRead: true },
    { id: 'n3', title: '🩺 Saved clinical questions summary', body: 'Read your assembled practitioner checklists inside Care logs.', time: '3 days ago', isRead: true }
  ];

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Notifications Check
        </span>
        <span className="text-[20px] select-none">🔔</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8 space-y-6">
        <div className="text-center md:text-left space-y-1">
          <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
            Keep updated, stay safe
          </h2>
          <p className="text-[13px] text-gray-500 font-semibold">
            Choose what alerts can find you. HopeHeart matches your comfort pace.
          </p>
        </div>

        {/* Toggles Checklist */}
        <div className="hh-surface rounded-3xl p-5 space-y-4">
          <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
            ALERT CATEGORY CHANNELS:
          </span>

          {/* Chat messages */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
            <div>
              <span className="text-[13.5px] font-bold text-gray-800 block">New safe companion messages</span>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5 leading-snug">Notify me when matched safe listeners reply in chat logs.</p>
            </div>
            <button
              onClick={() => setNotifyChat(!notifyChat)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${notifyChat ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${notifyChat ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Peer replies */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
            <div>
              <span className="text-[13.5px] font-bold text-gray-800 block">Peer replies in support rooms</span>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5 leading-snug">Alert me when anonymous hearts add comforting replies to my posts.</p>
            </div>
            <button
              onClick={() => setNotifyReplies(!notifyReplies)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${notifyReplies ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${notifyReplies ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Safety news */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[13.5px] font-bold text-gray-800 block">Safety & clinical updates alert</span>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5 leading-snug">Receive reports of major app safety enhancements or local warnings.</p>
            </div>
            <button
              onClick={() => setNotifySafety(!notifySafety)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${notifySafety ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${notifySafety ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

        </div>

        {/* Notifications log history */}
        <div className="space-y-3">
          <span className="text-[11px] font-mono font-extrabold text-[#A29985] tracking-widest block uppercase px-1">
            Recent Activity Logs ({notificationsList.length})
          </span>

          <div className="space-y-2.5">
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
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
export { NotificationsScreen };
