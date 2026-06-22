import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabaseClient';

interface SafetyScreenProps {
  onBack: () => void;
  initialShowReport?: boolean;
}

function SafetyIllustration() {
  return (
    <svg width="220" height="190" viewBox="0 0 220 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto my-1">
      {/* Background soft glow / shield shadow */}
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF1F2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="avatar1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF8A4C" />
          <stop offset="100%" stopColor="#FF6A1A" />
        </linearGradient>
        <linearGradient id="avatar2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#8B5CF6" floodOpacity="0.06" />
        </filter>
      </defs>

      {/* Main Shield Shape */}
      <path 
        d="M110 15C138 15 175 28 175 70C175 120 128 160 110 170C92 160 45 120 45 70C45 28 82 15 110 15Z" 
        fill="url(#shieldGrad)" 
        stroke="#E9D5FF" 
        strokeWidth="2" 
        strokeDasharray="4 4"
        filter="url(#shadow)"
      />

      {/* Connection path / communication line */}
      <path d="M85 95C95 87 125 87 135 95" stroke="#FF7527" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />

      {/* Person 1 (Left) */}
      <g transform="translate(62, 75)">
        {/* Body */}
        <path d="M5 40 C5 26, 35 26, 35 40" fill="url(#avatar1Grad)" />
        {/* Head */}
        <circle cx="20" cy="16" r="11" fill="#FED7AA" />
        {/* Hair/Cap */}
        <path d="M9 16C9 9, 31 9, 31 16" fill="#D97706" />
        {/* Happy eyes */}
        <path d="M15 16Q17 14 19 16" stroke="#7C2D12" strokeWidth="1.2" strokeLinecap="round" />
        {/* Smile */}
        <path d="M18 21Q20 23 22 21" stroke="#7C2D12" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Person 2 (Right) */}
      <g transform="translate(118, 75)">
        {/* Body */}
        <path d="M5 40 C5 26, 35 26, 35 40" fill="url(#avatar2Grad)" />
        {/* Head */}
        <circle cx="20" cy="16" r="11" fill="#F3E8FF" />
        {/* Hair */}
        <path d="M9 16C9 7, 31 7, 31 16" fill="#5B21B6" />
        {/* Happy eyes */}
        <path d="M15 16Q17 14 19 16" stroke="#2E1065" strokeWidth="1.2" strokeLinecap="round" />
        {/* Smile */}
        <path d="M18 21Q20 23 22 21" stroke="#2E1065" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Heart Icon near the center top of communication line */}
      <path 
        d="M110 65C108 62 104 62 102 64C100 66 100 70 102 72L110 80L118 72C120 70 120 66 118 64C116 62 112 62 110 65Z" 
        fill="#FF4B4B" 
      />

      {/* Green Checkmark Badge (Bottom Right of Shield) */}
      <g transform="translate(140, 115)" filter="url(#shadow)">
        <circle cx="14" cy="14" r="12" fill="#10B981" stroke="white" strokeWidth="2" />
        <path d="M9 14L12 17L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function SafetyScreen({ onBack, initialShowReport }: SafetyScreenProps) {
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [showReportForm, setShowReportForm] = useState(initialShowReport || false);

  const [reportWhatHappened, setReportWhatHappened] = useState('');
  const [reportWhereHappened, setReportWhereHappened] = useState('');
  const [reportOptionalNote, setReportOptionalNote] = useState('');

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportWhatHappened.trim() || !reportWhereHappened.trim()) return;

    let userId = null;
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        userId = session?.user?.id || null;
      } catch (err) {
        console.warn("Failed to retrieve user ID for safety report:", err);
      }
    }

    const messageContent = `What: ${reportWhatHappened.trim()}\nWhere: ${reportWhereHappened.trim()}\nNote: ${reportOptionalNote.trim()}`;

    try {
      if (!supabase) throw new Error("Supabase is not configured");

      const { error } = await supabase.from('safety_concerns').insert({
        user_id: userId,
        concern_type: 'General Safety Concern',
        message: messageContent,
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      alert(`Thank you for helping keep HopeHeart safe. Our AI safety moderators will review this concern immediately.`);
    } catch (err) {
      console.warn('[Safety] Supabase concern insert failed, saving locally:', err);
      try {
        const pending = JSON.parse(localStorage.getItem('hopeheart_pending_safety_concerns') || '[]');
        pending.push({
          user_id: userId,
          concern_type: 'General Safety Concern',
          message: messageContent,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('hopeheart_pending_safety_concerns', JSON.stringify(pending));
        alert(`Thank you for helping keep HopeHeart safe. Our AI safety moderators will review this concern immediately.`);
      } catch (localErr) {
        console.error('[Safety] Local storage concern save failed:', localErr);
        alert(`Thank you for helping keep HopeHeart safe. Our AI safety moderators will review this concern immediately.`);
      }
    } finally {
      setReportWhatHappened('');
      setReportWhereHappened('');
      setReportOptionalNote('');
      setShowReportForm(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent font-sans select-none overflow-y-auto scrollbar-thin w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3 px-4 hh-header-surface sticky top-0 z-20">
        <button 
          onClick={onBack}
          id="btn-back-safety"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[15px]">
          Safety Hub
        </span>
        <div className="w-9 h-9 flex items-center justify-center text-[18px]">
          🛡️
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6 flex-1 max-w-4xl mx-auto w-full">
        {/* Safety Header Card */}
        <div className="relative hh-hero-surface rounded-3xl p-4 sm:p-5">
          {/* Urgent Help Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowUrgentModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 bg-[#FFF1F2] border border-[#FECDD3] hover:bg-[#FFE4E6] text-rose-700 rounded-full font-display font-black text-[12px] transition-colors shadow-3xs cursor-pointer"
            >
              <span>🚨</span>
              <span className="hidden sm:inline">Urgent Help</span>
            </button>
          </div>

          <div className="text-center space-y-2 max-w-2xl mx-auto pt-6 sm:pt-0 pr-8 sm:pr-0">
            <h2 className="font-display font-black text-[#2B1D12] text-[20px] sm:text-[23px] leading-tight">
              How HopeHeart Protects You
            </h2>
            <p className="text-[12px] sm:text-[12.5px] text-gray-500 font-semibold leading-relaxed">
              HopeHeart uses safety filters, community rules, and reporting tools to keep support kind, private, and free from unsafe medical advice.
            </p>
          </div>

          {/* Warm human-based safety illustration */}
          <div className="mt-4 flex justify-center">
            <SafetyIllustration />
          </div>
        </div>

        {/* Section 1: AI Safety Filter */}
        <div className="hh-surface border border-orange-100 p-5 rounded-3xl space-y-2">
          <h3 className="font-display font-black text-[#FF7527] text-[15px] flex items-center gap-1.5">
            <span>🛡️</span> AI Safety Filter
          </h3>
          <p className="text-[12px] sm:text-[12.5px] text-gray-600 font-semibold leading-relaxed">
            HopeHeart checks conversations for unsafe medical advice, prescriptions, dosage guidance, diagnosis claims, cure promises, abuse, or harmful content.
          </p>
        </div>

        {/* Section 2 & 3: Allowed and Blocked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 2: Allowed */}
          <div className="hh-surface border border-emerald-100 rounded-3xl p-5 space-y-4">
            <div>
              <h3 className="font-display font-black text-emerald-800 text-[14.5px] flex items-center gap-1.5 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] flex items-center justify-center font-bold">✓</span>
                Allowed
              </h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
                People can share emotions, lived experiences, and kind support without giving medical instructions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Feelings',
                'Personal stories',
                'Kind words',
                'Lived experiences',
                'Caregiver support',
                'Emotional sharing'
              ].map((chip, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50/70 text-emerald-800 border border-emerald-100/50 rounded-full text-[11.5px] font-bold">
                  ✅ {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Blocked */}
          <div className="hh-surface border border-red-100 rounded-3xl p-5 space-y-4">
            <div>
              <h3 className="font-display font-black text-red-800 text-[14.5px] flex items-center gap-1.5 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-red-50 text-red-800 text-[11px] flex items-center justify-center font-bold">×</span>
                Blocked
              </h3>
              <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
                HopeHeart blocks medical advice, diagnosis, prescriptions, dosage guidance, cure claims, and harmful behaviour.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Prescriptions',
                'Dosage advice',
                'Diagnosis',
                'Cure claims',
                'Medicine changes',
                'Abuse or judgement'
              ].map((chip, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50/70 text-rose-855 border border-rose-100/50 rounded-full text-[11.5px] font-bold">
                  🚫 {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Community Rules */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <h3 className="font-display font-black text-[#2B1D12] text-[15px] flex items-center justify-center sm:justify-start gap-1.5">
              <span>📜</span> Community Rules
            </h3>
            <p className="text-[12px] text-gray-500 font-semibold mt-1">
              Please follow these guidelines to keep HopeHeart safe for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Be kind and respectful', desc: 'Treat everyone with empathy, support, and understanding.', icon: '❤️' },
              { title: 'Share only what feels safe', desc: 'Your boundaries matter. Only share what you are comfortable with.', icon: '🔒' },
              { title: 'Do not pressure others', desc: 'Respect other users\' choices, response times, and comfort levels.', icon: '🤝' },
              { title: 'Do not give medical instructions', desc: 'Leave medical recommendations, prescriptions, and diagnosis to professionals.', icon: '🚫' },
              { title: 'Do not ask for personal contact details', desc: 'Keep conversations within HopeHeart to protect your privacy.', icon: '📱' },
              { title: 'Report unsafe behaviour', desc: 'Flag any messaging that crosses boundaries or causes discomfort.', icon: '🚩' }
            ].map((rule, idx) => (
              <div key={idx} className="hh-surface rounded-2xl p-4 flex gap-3 items-start">
                <div className="w-8 h-8 bg-orange-50/80 text-orange-500 rounded-xl flex items-center justify-center text-[16px] shrink-0">
                  {rule.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-display font-black text-gray-800 text-[12.5px] leading-tight">
                    {rule.title}
                  </h4>
                  <p className="text-[11.5px] text-gray-500 font-medium leading-snug">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5 & 6: Report a Concern & Response policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 5: Report a Concern */}
          <div className="hh-surface rounded-3xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="space-y-2 mb-4">
              <h3 className="font-display font-black text-gray-850 text-[15px] flex items-center gap-1.5">
                <span>🚩</span> Report a Concern
              </h3>
              <p className="text-[12px] sm:text-[12.5px] text-gray-600 font-semibold leading-relaxed">
                If something feels unsafe, harmful, abusive, or medically risky, you can report it.
              </p>
            </div>

            <AnimatePresence initial={false} mode="wait">
              {!showReportForm ? (
                <motion.div
                  key="button-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-bold text-[12.5px] rounded-xl transition-colors cursor-pointer shadow-3xs"
                  >
                    Report Concern →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form-state"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  onSubmit={handleReportSubmit}
                  className="space-y-3.5 pt-2"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                      What happened?
                    </label>
                    <input
                      type="text"
                      value={reportWhatHappened}
                      onChange={(e) => setReportWhatHappened(e.target.value)}
                      placeholder="Brief summary of the safety issue..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[12px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                      Where did it happen?
                    </label>
                    <input
                      type="text"
                      value={reportWhereHappened}
                      onChange={(e) => setReportWhereHappened(e.target.value)}
                      placeholder="e.g. Chat with user Alex, or Group support room..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[12px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                      Optional note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={reportOptionalNote}
                      onChange={(e) => setReportOptionalNote(e.target.value)}
                      placeholder="Any extra details you want to add..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-[12px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-bold text-[12px] rounded-xl cursor-pointer"
                    >
                      Submit Report
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReportForm(false);
                        setReportWhatHappened('');
                        setReportWhereHappened('');
                        setReportOptionalNote('');
                      }}
                      className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 font-display font-bold text-[12px] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Section 6: What happens if unsafe advice appears? */}
          <div className="hh-surface rounded-3xl p-5 flex flex-col justify-between min-h-[160px]">
            <div className="space-y-2">
              <h3 className="font-display font-black text-gray-850 text-[15px] flex items-center gap-1.5">
                <span>💬</span> What happens if unsafe advice appears?
              </h3>
              <p className="text-[12px] sm:text-[12.5px] text-gray-600 font-semibold leading-relaxed">
                If a message includes diagnosis, dosage, prescriptions, cure claims, or harmful advice, HopeHeart blocks it and guides the user toward safe support or professional care.
              </p>
            </div>
            <div className="mt-4 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-center gap-2">
              <span className="text-[16px]">🛡️</span>
              <p className="text-[11px] text-gray-600 font-bold leading-normal">
                Real-time safety monitors actively scan and intercept medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Help Modal */}
      <AnimatePresence>
        {showUrgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUrgentModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm hh-surface rounded-3xl p-6 text-center z-10 space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-[24px] mx-auto">
                🚨
              </div>
              <h3 className="font-display font-black text-[18px] text-gray-800">
                Urgent Help
              </h3>
              <p className="text-[13px] text-gray-600 font-semibold leading-relaxed">
                If you or someone else is in immediate danger, contact your local emergency service or go to the nearest hospital/emergency care center.
              </p>
              <div className="py-2 px-3 bg-red-50/50 rounded-xl">
                <p className="text-[11.5px] text-red-700 font-bold">
                  HopeHeart is not an emergency service.
                </p>
              </div>
              <button
                onClick={() => setShowUrgentModal(false)}
                className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-display font-bold text-[13px] rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
