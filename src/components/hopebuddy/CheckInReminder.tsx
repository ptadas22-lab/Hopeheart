import React from 'react';

export interface ReminderPrefs {
  remindMood: boolean;
  remindJournal: boolean;
  remindBreathing: boolean;
  remindGratitude: boolean;
}

interface CheckInReminderProps {
  preferences: ReminderPrefs;
  onChangePreferences: (prefs: ReminderPrefs) => void;
}

export default function CheckInReminder({
  preferences,
  onChangePreferences
}: CheckInReminderProps) {
  const handleToggle = (key: keyof ReminderPrefs) => {
    const next = {
      ...preferences,
      [key]: !preferences[key]
    };
    onChangePreferences(next);
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
          Self-Care Reminders
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Enable optional reminders to help you maintain gentle daily habits. rems are saved strictly on this device.
        </p>
      </div>

      <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5.5 space-y-4 shadow-3xs">
        {/* Reminder 1: Mood Check-in */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-gray-800 block">
              🫧 Daily Mood check-ins
            </span>
            <p className="text-[11.5px] text-gray-450 font-semibold leading-normal">
              Pause for 10 seconds to log how you feel today.
            </p>
          </div>
          <button
            onClick={() => handleToggle('remindMood')}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              preferences.remindMood ? 'bg-[#FF7527]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.remindMood ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Reminder 2: Journal */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-gray-800 block">
              📝 Private reflections
            </span>
            <p className="text-[11.5px] text-gray-450 font-semibold leading-normal">
              Log private entries to capture quiet reflections.
            </p>
          </div>
          <button
            onClick={() => handleToggle('remindJournal')}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              preferences.remindJournal ? 'bg-[#FF7527]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.remindJournal ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Reminder 3: Breathing */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-gray-800 block">
              🌬️ Grounding & breathing
            </span>
            <p className="text-[11.5px] text-gray-455 font-semibold leading-normal">
              Gentle breathing cycles to quiet a busy mind.
            </p>
          </div>
          <button
            onClick={() => handleToggle('remindBreathing')}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              preferences.remindBreathing ? 'bg-[#FF7527]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.remindBreathing ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Reminder 4: Gratitude */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-gray-800 block">
              🌞 Daily gratitude logs
            </span>
            <p className="text-[11.5px] text-gray-455 font-semibold leading-normal">
              Record one tiny thing you feel thankful for today.
            </p>
          </div>
          <button
            onClick={() => handleToggle('remindGratitude')}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              preferences.remindGratitude ? 'bg-[#FF7527]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.remindGratitude ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
