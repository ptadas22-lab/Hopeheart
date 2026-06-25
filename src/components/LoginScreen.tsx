import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotSitting } from './Logo';
import { ScreenId } from '../types';
import { saveSafeRulesConsentLocal, supabase } from '../lib/supabaseClient';

interface LoginScreenProps {
  onLoginSuccess: (nickname: string) => void;
  onNavigateTo?: (screenId: ScreenId) => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateTo }: LoginScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Helper login function handling guest, google, and email flows
  const handleLogin = async (entryMethod: 'guest' | 'google' | 'email') => {
    setInfoMessage(null);

    // Save local consent cache & pending entry method (Stage 1)
    saveSafeRulesConsentLocal(entryMethod);

    try {
      // 1. Guest flow
      if (entryMethod === 'guest') {
        const guestSessionId = 'guest_' + Date.now();
        localStorage.setItem('hopeheart_guest_session_id', guestSessionId);

        if (supabase) {
          try {
            const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
            if (anonError) {
              console.warn('[Consent] Supabase anonymous auth failed:', anonError.message);
            } else {
              console.log('[Consent] Guest anonymous session created.');
            }
          } catch (e) {
            console.warn('[Consent] Anonymous auth check encountered error:', e);
          }
        }
        
        // Guest mode goes directly to Home
        onLoginSuccess('Companion');
        if (onNavigateTo) {
          onNavigateTo(ScreenId.Home);
        }
        return;
      }

      // 2. Google OAuth flow
      if (entryMethod === 'google') {
        if (supabase) {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              scopes: 'email profile', // Request only basic profile and email
              redirectTo: window.location.origin
            }
          });
          if (error) {
            setInfoMessage("Login could not continue. Please try again.");
            console.error('Google OAuth error:', error.message);
          }
        } else {
          // Demo fallback
          onLoginSuccess('GoogleBuddy');
        }
        return;
      }

      // 3. Email Magic Link flow
      if (entryMethod === 'email') {
        if (supabase) {
          setShowEmailInput(true);
        } else {
          setInfoMessage("Email login is coming soon!");
        }
        return;
      }
    } catch (err) {
      setInfoMessage("Login could not continue. Please try again.");
      console.error('Login method failed:', err);
    }
  };

  const handleButtonClick = (method: 'guest' | 'google' | 'email') => {
    if (!agreed) {
      setInfoMessage("Please accept the emotional-support agreement to continue.");
      return;
    }
    handleLogin(method);
  };

  const handleSendEmailLink = async () => {
    if (!agreed) {
      setInfoMessage("Please accept the emotional-support agreement to continue.");
      return;
    }
    if (!email.trim() || !supabase) return;
    setEmailLoading(true);
    setInfoMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) {
        setInfoMessage("Login could not continue. Please try again.");
        console.error('Email Magic Link error:', error.message);
      } else {
        setInfoMessage("Magic link sent safely! Please check your inbox.");
      }
    } catch (err) {
      setInfoMessage("Login could not continue. Please try again.");
      console.error('Email Magic Link error:', err);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-full w-full justify-center overflow-y-auto bg-transparent px-4 py-7 font-sans select-none sm:px-6 sm:py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,117,39,0.10) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-2xl rounded-full bg-[radial-gradient(circle_at_center,rgba(255,190,118,0.18),transparent_66%)] blur-2xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-[560px] flex-col items-center space-y-7 pb-10">
        {/* Onboarding Header */}
        <div className="text-center space-y-4 pt-1">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mx-auto flex h-[92px] w-[92px] items-center justify-center"
          >
            <div className="absolute inset-2 rounded-full bg-orange-100/45 blur-xl" />
            <span className="absolute right-0 top-3 text-[15px] text-[#FF7527]">✦</span>
            <span className="absolute left-1 top-9 text-[13px] text-amber-300">✧</span>
            <MascotSitting size={82} />
          </motion.div>
          <div className="space-y-3">
            <h1 className="font-display font-black text-[#111827] text-[30px] sm:text-[36px] tracking-tight leading-tight">
              Welcome to HopeHeart <span className="text-[#FF7527]">🧡</span>
            </h1>
            <p className="text-[18px] sm:text-[20px] text-[#4B5563] font-semibold max-w-md mx-auto leading-relaxed">
              A safe, private, and peer-to-peer emotional support space.
            </p>
          </div>
        </div>

        {/* Main Safety & Login Card */}
        <div className="w-full rounded-[30px] border border-orange-200/70 bg-[#FFFDF8]/92 p-6 text-left shadow-[0_20px_55px_rgba(181,111,45,0.16)] backdrop-blur-sm sm:rounded-[34px] sm:p-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <span className="text-[14px] font-mono font-black text-[#FF5A1F] uppercase tracking-[0.18em] block">
                Before you enter
              </span>
              <h2 className="font-display font-black text-[#111827] text-[23px] sm:text-[27px] leading-snug">
                HopeHeart is a safe emotional support space.
              </h2>
              <p className="text-[17px] text-[#4B5563] font-semibold leading-relaxed">
                You can share feelings, stories, and lived experiences. Please do not share prescriptions, diagnosis, dosage advice, cure claims, or harmful comments.
              </p>
            </div>

            {/* Visual alert message block */}
            {infoMessage && (
              <div className="py-3 px-4 bg-amber-50 text-amber-900 border border-amber-150 rounded-2xl text-[13px] font-bold text-center leading-normal">
                {infoMessage}
              </div>
            )}

            {/* Action views (Toggles email forms or standard choices) */}
            <AnimatePresence mode="wait">
              {!showEmailInput ? (
                <motion.div
                  key="login-buttons"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="space-y-3 pt-1"
                >
                  {/* Guest */}
                  <button
                    type="button"
                    onClick={() => handleButtonClick('guest')}
                    className="w-full min-h-[62px] px-5 bg-[#EFF6FF] border border-[#AFCFFF] text-blue-700 hover:bg-[#E3F0FF] rounded-[18px] font-display font-black text-[18px] cursor-pointer transition-all active:scale-[0.98] shadow-[0_8px_20px_rgba(59,130,246,0.12)] flex items-center justify-center gap-4"
                  >
                    <svg className="w-7 h-7 shrink-0 fill-none stroke-current text-blue-500" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Continue as Guest
                  </button>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleButtonClick('google')}
                    className="w-full min-h-[62px] px-5 bg-white border border-gray-200 text-[#1F2937] hover:bg-gray-50 hover:border-gray-300 rounded-[18px] font-display font-black text-[18px] cursor-pointer transition-all active:scale-[0.98] shadow-[0_8px_18px_rgba(43,29,18,0.08)] flex items-center justify-center gap-4"
                  >
                    <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Email */}
                  <button
                    type="button"
                    onClick={() => handleButtonClick('email')}
                    className="w-full min-h-[62px] px-5 bg-white border border-orange-200 text-[#1F2937] hover:border-[#FF7527]/60 hover:bg-[#FFF8F2] rounded-[18px] font-display font-black text-[18px] cursor-pointer transition-all active:scale-[0.98] shadow-[0_8px_18px_rgba(43,29,18,0.08)] flex items-center justify-center gap-4"
                  >
                    <svg className="w-7 h-7 shrink-0 fill-none stroke-current text-[#FF7527]" strokeWidth="2.1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    Continue with Email
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="email-input-form"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="space-y-3 text-left pt-1"
                >
                  <span className="text-[12px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                    Enter your Email
                  </span>
                  <p className="text-[13px] text-gray-555 font-semibold leading-relaxed">
                    We will send a magic link directly to your inbox for passwordless entry.
                  </p>
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@domain.com"
                      className="px-4 py-3.5 border border-gray-200 rounded-2xl text-[15px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
                    />
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEmailInput(false);
                          setInfoMessage(null);
                        }}
                        className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-705 font-display font-extrabold text-[13px] rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSendEmailLink}
                        disabled={emailLoading || !email.trim()}
                        className="flex-1 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-xs disabled:bg-gray-150 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {emailLoading ? 'Sending...' : 'Send Magic Link'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Agreement Checkbox & Modal Link */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-left select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) setInfoMessage(null);
                  }}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FF7527] focus:ring-[#FF7527]/30 cursor-pointer accent-[#FF7527]"
                />
                <span className="text-[15px] text-[#1F2937] font-bold leading-snug">
                  I understand HopeHeart is for emotional support only.
                </span>
              </label>
              <div className="pl-8 text-left">
                <button
                  type="button"
                  onClick={() => setShowRulesModal(true)}
                  className="text-[15px] text-[#FF5A1F] font-display font-black hover:underline cursor-pointer inline-flex items-center gap-2"
                >
                  <span aria-hidden="true">▣</span> View full safe rules
                </button>
              </div>
            </div>

            {/* Helper disclaimer */}
            <p className="text-[14px] text-[#374151] font-semibold leading-relaxed pt-1">
              HopeHeart provides emotional support, peer listening, and resources. It does not provide medical diagnosis, prescriptions, therapy, emergency care, or crisis intervention.
            </p>

            {/* Platform age gate statement */}
            <p className="text-[13px] text-center text-[#FF5A1F] font-black leading-normal pt-1 uppercase tracking-[0.16em]">
              HopeHeart MVP is intended for users 18+.
            </p>
          </div>
        </div>

        {/* Bottom cards */}
        <div className="w-full space-y-3.5">
          {[
            { icon: '🧡', title: 'Share safely', text: 'Talk about feelings, loneliness, stress, or support needs.', tint: 'bg-orange-50 text-[#FF7527]' },
            { icon: '👥', title: 'Meet support', text: 'Connect with listeners, rooms, and resources.', tint: 'bg-blue-50 text-blue-700' },
            { icon: '🛡️', title: 'Stay protected', text: 'HopeHeart blocks unsafe medical advice and harmful content.', tint: 'bg-emerald-50 text-emerald-800' }
          ].map((card) => (
            <div key={card.title} className="w-full rounded-[24px] border border-orange-100/70 bg-[#FFFDF8]/92 p-5 shadow-[0_12px_30px_rgba(181,111,45,0.10)] backdrop-blur-sm flex items-center gap-5 text-left">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${card.tint} text-[30px]`}>
                {card.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-[#111827] text-[21px] leading-tight">
                  {card.title}
                </h3>
                <p className="text-[17px] text-[#4B5563] font-semibold leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Safe Rules Modal Overlay */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulesModal(false)}
              className="absolute inset-0"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md hh-surface rounded-[32px] p-6 z-10 space-y-5 text-center"
            >
              <div className="flex items-center justify-between border-b border-gray-150 pb-2.5">
                <span className="font-display font-black text-[15px] text-gray-800 flex items-center gap-1.5">
                  🛡️ HopeHeart Safe Rules
                </span>
                <button
                  onClick={() => setShowRulesModal(false)}
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-655 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                {/* Allowed List */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-2.5xl p-4.5 space-y-2">
                  <span className="text-[11px] font-mono font-black text-emerald-805 uppercase tracking-wider block">
                    Allowed:
                  </span>
                  <ul className="space-y-1.5 text-[11.5px] font-bold text-gray-650">
                    {[
                      'Feelings',
                      'Personal stories',
                      'Kind words',
                      'Lived experiences',
                      'Caregiver support',
                      'Emotional sharing'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-500 leading-none mr-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Blocked List */}
                <div className="bg-red-50/40 border border-red-100 rounded-2.5xl p-4.5 space-y-2">
                  <span className="text-[11px] font-mono font-black text-red-805 uppercase tracking-wider block">
                    Blocked:
                  </span>
                  <ul className="space-y-1.5 text-[11.5px] font-bold text-gray-650">
                    {[
                      'Prescriptions',
                      'Dosage advice',
                      'Diagnosis',
                      'Cure claims',
                      'Medicine changes',
                      'Abuse or judgement'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-red-500 leading-none mr-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-95 text-center shadow-xs"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
