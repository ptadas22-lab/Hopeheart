import { useState } from 'react';
import { saveExpertSessionRequest } from '../services/expertSessions';

interface ResourcesScreenProps {
  onBack: () => void;
}

const RESOURCE_CATEGORIES = [
  ['😟', 'Anxiety', 'bg-[#FFE7C8]'],
  ['🌿', 'Stress', 'bg-[#E5F5E8]'],
  ['🧍', 'Loneliness', 'bg-[#F2E9FF]'],
  ['☁️', 'Overthinking', 'bg-[#FFEAF2]'],
  ['🌙', 'Sleep & rest', 'bg-[#FFF2D8]'],
  ['🧘', 'Grounding exercises', 'bg-[#FFE8C8]'],
  ['〰️', 'Breathing exercises', 'bg-[#EEF3FA]'],
  ['💗', 'Self-kindness', 'bg-[#FFE4EC]']
];

const openInfoAlert = (title: string, body: string) => {
  alert(`${title}\n\n${body}`);
};

const SESSION_TOPICS = [
  'Anxiety',
  'Stress',
  'Loneliness',
  'Overthinking',
  'Sleep & rest',
  'Grounding support',
  'Self-kindness',
  'Parkinson’s emotional support',
  'Caregiver support'
];

const SESSION_TYPES = ['Chat', 'Audio call', 'Video call'];
const PREFERRED_TIMES = ['Today', 'Tomorrow', 'This week', 'Not sure yet'];

function SessionChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-2 text-[12px] font-display font-black transition-all cursor-pointer active:scale-[0.98] ${
        selected
          ? 'bg-[#FF7527] border-[#FF7527] text-white shadow-[0_8px_18px_rgba(255,117,39,0.20)]'
          : 'bg-white/85 border-orange-100 text-[#10213D] hover:border-[#FFB27A] hover:bg-[#FFF8F2]'
      }`}
    >
      {label}
    </button>
  );
}

export default function ResourcesScreen({ onBack }: ResourcesScreenProps) {
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Anxiety');
  const [selectedSessionType, setSelectedSessionType] = useState('Chat');
  const [selectedPreferredTime, setSelectedPreferredTime] = useState('Not sure yet');
  const [sessionNote, setSessionNote] = useState('');
  const [sessionSaveState, setSessionSaveState] = useState<{ loading: boolean; type?: 'success' | 'error'; message?: string }>({ loading: false });

  const handleSendSessionRequest = async () => {
    if (sessionSaveState.loading) return;

    setSessionSaveState({ loading: true });
    const result = await saveExpertSessionRequest({
      topic: selectedTopic,
      sessionType: selectedSessionType,
      preferredTime: selectedPreferredTime,
      note: sessionNote.trim()
    });

    if (!result.ok) {
      setSessionSaveState({ loading: false, type: 'error', message: "Couldn’t save right now. Please try again." });
      return;
    }

    setSessionNote('');
    setSessionSaveState({ loading: false, type: 'success', message: 'Your session request is saved safely.' });
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
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">Resources</span>
        <span className="text-[20px] select-none">📚</span>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 pb-28 sm:pb-10 space-y-5">
        <div className="hh-hero-surface rounded-[32px] p-5 sm:p-7 lg:p-8 text-left overflow-hidden relative border border-orange-100/70 shadow-3xs">
          <div className="absolute -top-16 -right-10 w-44 h-44 bg-[#E8D9FF]/35 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 left-10 w-48 h-48 bg-[#FFD4BD]/25 rounded-full blur-2xl" />
          <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-5 sm:items-center">
            <div className="space-y-3">
              <h2 className="font-display font-black text-[#10213D] text-[24px] sm:text-[28px] leading-tight">Read when you are ready</h2>
              <p className="text-[14px] sm:text-[15px] text-[#56657C] font-bold leading-relaxed">
                Small steps only. No pressure.<br />
                You are not being forced to talk.
              </p>
            </div>
            <div className="justify-self-center sm:justify-self-end relative w-36 h-28 sm:w-44 sm:h-32 rounded-[28px] bg-white/45 border border-white/70 flex items-center justify-center shadow-3xs">
              <span className="absolute left-4 bottom-4 text-[24px]">🌿</span>
              <span className="absolute right-4 top-4 text-[20px]">✨</span>
              <span className="text-[58px] sm:text-[68px] drop-shadow-sm rotate-[-7deg]">📖</span>
              <span className="absolute right-8 bottom-5 text-[24px]">💛</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FFF8EE] via-[#FFFDF9] to-[#FFF0F4] border border-orange-100/80 rounded-[28px] p-4 sm:p-5 text-left shadow-3xs space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white/80 border border-orange-100 flex items-center justify-center text-[24px] shrink-0">💛</span>
            <div className="space-y-1 flex-1">
              <h3 className="font-display font-black text-[#10213D] text-[18px] leading-tight">Need someone to guide you?</h3>
              <p className="text-[13px] text-[#56657C] font-semibold leading-relaxed">Request a gentle session with a verified support expert when reading is not enough.</p>
            </div>
          </div>
          <p className="text-[11.5px] text-[#A05412] font-bold leading-relaxed bg-white/70 border border-orange-100/70 rounded-2xl p-3">Sessions are for emotional support and guidance only. No diagnosis, prescriptions, dosage advice, or emergency care.</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setShowSessionPanel(true);
                setSessionSaveState({ loading: false });
              }}
              className="flex-1 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.99]"
            >
              Request expert session
            </button>
            <span className="self-start sm:self-auto rounded-full bg-white/80 border border-orange-100 px-3.5 py-2 text-[11.5px] text-[#C75414] font-display font-black">Chat • Audio • Video</span>
          </div>
          <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">HopeHeart sessions are for emotional support only and do not replace professional medical care or emergency services.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESOURCE_CATEGORIES.map(([icon, category, tone]) => (
            <div key={category} className="bg-white/88 border border-orange-100/70 rounded-[26px] p-4 sm:p-5 text-left shadow-3xs flex items-start gap-4 min-h-[128px]">
              <span className={`w-14 h-14 rounded-full ${tone} border border-white/80 flex items-center justify-center text-[26px] shrink-0 shadow-3xs`}>{icon}</span>
              <span className="flex-1 min-w-0 space-y-2">
                <span className="block font-display font-black text-[#10213D] text-[17px] leading-tight">{category}</span>
                <span className="block text-[13px] text-[#56657C] font-semibold leading-relaxed">A gentle place to learn, pause, and choose one small next step for yourself.</span>
              </span>
              <span className="text-[#10213D] text-[26px] leading-none mt-2 shrink-0">›</span>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF8EE]/90 border border-[#FFD5A6] rounded-[26px] p-4 sm:p-5 flex items-start gap-3 shadow-3xs">
          <span className="w-12 h-12 rounded-full bg-[#FFF1D8] border border-[#FFD5A6] flex items-center justify-center text-[24px] shrink-0">🛡️</span>
          <p className="text-[13px] sm:text-[14px] text-[#A05412] font-display font-black leading-relaxed">HopeHeart does not diagnose, prescribe, give dosage advice, or promise cures. For immediate danger, contact local emergency services or nearest emergency care.</p>
        </div>

        <footer className="text-center space-y-3 px-2 pb-2">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] sm:text-[13px] text-[#56657C] font-display font-black">
            <button onClick={() => openInfoAlert('Terms & Conditions', 'HopeHeart is for emotional support. Be kind, respectful, and protect your privacy.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Terms & Conditions</button>
            <button onClick={() => openInfoAlert('Privacy Policy', 'HopeHeart keeps MVP fallback data local on this device unless an existing app flow clearly says otherwise.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Privacy Policy</button>
            <button onClick={() => openInfoAlert('Emotional Support Disclaimer', 'HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.')} type="button" className="hover:text-[#FF7527] hover:underline cursor-pointer">Emotional Support Disclaimer</button>
          </div>
          <p className="max-w-xl mx-auto text-[12px] sm:text-[13px] text-[#6B7280] font-semibold leading-relaxed">HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.</p>
        </footer>
      </div>

      {showSessionPanel && (
        <div className="fixed inset-0 z-50 bg-[#2B1D12]/35 backdrop-blur-[3px] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowSessionPanel(false)}>
          <div className="w-full sm:max-w-lg max-h-[88vh] overflow-y-auto bg-[#FFFDF9] border border-orange-100 rounded-t-[30px] sm:rounded-[30px] p-5 shadow-xl space-y-4" onClick={(event) => event.stopPropagation()}>
            <div className="w-11 h-1.5 rounded-full bg-[#EADFC9] mx-auto" />
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-display font-black text-[#10213D] text-[20px] leading-tight">Request a gentle session</h3>
                <p className="text-[12.5px] text-[#56657C] font-semibold leading-relaxed">Tell us what kind of support feels helpful. You can keep it simple.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSessionPanel(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center text-[12px] font-black cursor-pointer shrink-0"
                aria-label="Close expert session request"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] font-display font-black text-gray-700 uppercase tracking-wide">Topic</span>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TOPICS.map((topic) => (
                    <SessionChip key={topic} label={topic} selected={selectedTopic === topic} onClick={() => { setSelectedTopic(topic); setSessionSaveState({ loading: false }); }} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-display font-black text-gray-700 uppercase tracking-wide">Session type</span>
                <div className="flex flex-wrap gap-2">
                  {SESSION_TYPES.map((type) => (
                    <SessionChip key={type} label={type} selected={selectedSessionType === type} onClick={() => { setSelectedSessionType(type); setSessionSaveState({ loading: false }); }} />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-display font-black text-gray-700 uppercase tracking-wide">Preferred time</span>
                <div className="flex flex-wrap gap-2">
                  {PREFERRED_TIMES.map((time) => (
                    <SessionChip key={time} label={time} selected={selectedPreferredTime === time} onClick={() => { setSelectedPreferredTime(time); setSessionSaveState({ loading: false }); }} />
                  ))}
                </div>
              </div>

              <label className="bg-white/85 border border-orange-100 rounded-2xl px-3.5 py-3 flex items-center gap-2.5">
                <span className="text-[18px] text-gray-400">✎</span>
                <input
                  value={sessionNote}
                  onChange={(event) => { setSessionNote(event.target.value); setSessionSaveState({ loading: false }); }}
                  placeholder="One line about what you need…"
                  className="w-full bg-transparent text-[13px] font-semibold text-gray-700 placeholder:text-gray-400 outline-none"
                />
              </label>
            </div>

            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed bg-[#FFF8F2] border border-orange-100 rounded-2xl p-3">HopeHeart sessions are for emotional support only and do not replace professional medical care or emergency services.</p>

            <button
              type="button"
              onClick={handleSendSessionRequest}
              disabled={sessionSaveState.loading}
              className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {sessionSaveState.loading ? 'Sending…' : 'Send session request'}
            </button>
            {sessionSaveState.message && (
              <p role="status" className={`text-[12px] font-bold text-center ${sessionSaveState.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                {sessionSaveState.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
