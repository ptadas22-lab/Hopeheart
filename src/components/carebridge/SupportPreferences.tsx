import React from 'react';

export interface SupportPrefState {
  shareMoods: boolean;
  shareJournals: boolean;
  shareMilestones: boolean;
  shareGratitude: boolean;
  shareNothing: boolean;
}

interface SupportPreferencesProps {
  preferences: SupportPrefState;
  onChangePreferences: (prefs: SupportPrefState) => void;
}

export default function SupportPreferences({
  preferences,
  onChangePreferences
}: SupportPreferencesProps) {
  
  const handleToggle = (key: keyof SupportPrefState) => {
    const next = { ...preferences };

    if (key === 'shareNothing') {
      next.shareNothing = !preferences.shareNothing;
      if (next.shareNothing) {
        // Turn off everything else if shareNothing is checked
        next.shareMoods = false;
        next.shareJournals = false;
        next.shareMilestones = false;
        next.shareGratitude = false;
      }
    } else {
      next[key] = !preferences[key];
      // If any specific sharing is toggled on, turn off "shareNothing"
      if (next[key]) {
        next.shareNothing = false;
      }
    }

    onChangePreferences(next);
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
          Sharing Preferences
        </h3>
        <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
          Configure what details are optionally visible to your support circle. Sharing is disabled by default.
        </p>
      </div>

      <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5.5 space-y-4 shadow-3xs">
        {/* Toggle: Share nothing by default */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-gray-800 block">
              🔒 Share nothing by default
            </span>
            <p className="text-[11.5px] text-gray-450 font-semibold leading-normal">
              Keep everything 100% offline on this device. Disables all updates.
            </p>
          </div>
          <button
            onClick={() => handleToggle('shareNothing')}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              preferences.shareNothing ? 'bg-[#FF7527]' : 'bg-gray-200'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.shareNothing ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle: Share mood check-ins */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-[#2B1D12] block">
              🧡 Share mood check-ins
            </span>
            <p className="text-[11.5px] text-gray-450 font-semibold leading-normal">
              Allow trusted contacts to view your daily mood entries.
            </p>
          </div>
          <button
            onClick={() => handleToggle('shareMoods')}
            disabled={preferences.shareNothing}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
              preferences.shareNothing ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer'
            } ${preferences.shareMoods ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.shareMoods ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle: Share journal entries */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-[#2B1D12] block">
              📖 Share journal entries
            </span>
            <p className="text-[11.5px] text-gray-455 font-semibold leading-normal">
              Allow trusted contacts to read your private diary logs.
            </p>
          </div>
          <button
            onClick={() => handleToggle('shareJournals')}
            disabled={preferences.shareNothing}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
              preferences.shareNothing ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer'
            } ${preferences.shareJournals ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.shareJournals ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle: Share milestones */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-[#2B1D12] block">
              ⭐ Share milestones
            </span>
            <p className="text-[11.5px] text-gray-455 font-semibold leading-normal">
              Show when you unlock self-care achievements or daily goals.
            </p>
          </div>
          <button
            onClick={() => handleToggle('shareMilestones')}
            disabled={preferences.shareNothing}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
              preferences.shareNothing ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer'
            } ${preferences.shareMilestones ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.shareMilestones ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Toggle: Share gratitude */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 max-w-[75%]">
            <span className="text-[13px] font-black text-[#2B1D12] block">
              🌞 Share gratitude logs
            </span>
            <p className="text-[11.5px] text-gray-455 font-semibold leading-normal">
              Show what made you smile or who helped you in your daily journals.
            </p>
          </div>
          <button
            onClick={() => handleToggle('shareGratitude')}
            disabled={preferences.shareNothing}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
              preferences.shareNothing ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'cursor-pointer'
            } ${preferences.shareGratitude ? 'bg-[#FF7527]' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
              preferences.shareGratitude ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
