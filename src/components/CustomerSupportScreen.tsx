import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ScreenId } from '../types';
import { supabase } from '../lib/supabaseClient';

const SUPPORT_EMAIL = "support@hopeheart.app";

interface CustomerSupportScreenProps {
  onBack: () => void;
  onNavigateTo: (screenId: ScreenId) => void;
  onOpenSafetyReport: () => void;
  onOpenCrisisScreen?: () => void;
}

export default function CustomerSupportScreen({
  onBack,
  onNavigateTo,
  onOpenSafetyReport,
  onOpenCrisisScreen,
}: CustomerSupportScreenProps) {
  const [issueType, setIssueType] = useState('Account issue');
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setFormError("Please enter your support request message.");
      return;
    }

    // Check for high-risk crisis keywords
    const lower = message.toLowerCase();
    const highRiskPhrases = ['suicide', 'kill myself', 'harm myself', 'end my life', 'immediate danger'];
    if (highRiskPhrases.some(phrase => lower.includes(phrase))) {
      onOpenCrisisScreen?.();
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      // Attempt to save to Supabase customer_support_requests table
      const { error } = await supabase.from('customer_support_requests').insert({
        user_id: userId,
        issue_type: issueType,
        message: message.trim(),
        contact_email: contactEmail.trim() || null,
        status: 'new'
      });

      if (error) {
        throw error;
      }

      setFormSuccess("Thank you! Your support request has been sent successfully.");
      setMessage('');
      setContactEmail('');
    } catch (err) {
      console.warn('[Support] Supabase insert failed, saving request locally:', err);
      
      // Fallback: save locally
      try {
        const pending = JSON.parse(localStorage.getItem('hopeheart_pending_support_requests') || '[]');
        pending.push({
          issue_type: issueType,
          message: message.trim(),
          contact_email: contactEmail.trim() || null,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('hopeheart_pending_support_requests', JSON.stringify(pending));
        setFormSuccess("Your request has been saved locally. Please email support if urgent.");
        setMessage('');
        setContactEmail('');
      } catch (localErr) {
        console.error('[Support] Local storage save failed:', localErr);
        setFormError("Could not submit request. Please email support@hopeheart.app directly.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent font-sans select-none overflow-y-auto scrollbar-thin w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3 px-4 hh-header-surface sticky top-0 z-20">
        <button 
          onClick={onBack}
          id="btn-back-support"
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[15px]">
          Customer Support
        </span>
        <div className="w-9 h-9 flex items-center justify-center text-[18px]">
          🛟
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6 flex-1 max-w-xl mx-auto w-full">
        {/* Support Title Section */}
        <div className="text-center space-y-2 max-w-md mx-auto">
          <h2 className="font-display font-black text-[#2B1D12] text-[20px] sm:text-[23px] leading-tight">
            Need help with HopeHeart?
          </h2>
          <p className="text-[12px] sm:text-[13px] text-gray-500 font-semibold leading-relaxed">
            Contact our support team for account, privacy, safety, or app-related issues.
          </p>
        </div>

        {/* Quick Contacts Actions */}
        <div className="grid grid-cols-2 gap-3.5">
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=HopeHeart%20Support%20Request`}
            className="flex flex-col items-center justify-center p-4 bg-[#FCFBF8] hover:bg-[#FFF2EA] border border-gray-150 rounded-2xl text-center gap-2 cursor-pointer transition-all active:scale-98 shadow-3xs"
          >
            <span className="text-2xl">📧</span>
            <span className="text-[13px] font-display font-black text-gray-800">Email Support</span>
            <span className="text-[9.5px] font-semibold text-gray-400">support@hopeheart.app</span>
          </a>

          <button
            disabled
            type="button"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center gap-2 cursor-not-allowed opacity-60 shadow-none"
          >
            <span className="text-2xl">📞</span>
            <span className="text-[13px] font-display font-black text-gray-400">Call Support</span>
            <span className="text-[9.5px] font-semibold text-gray-400">Support number coming soon</span>
          </button>
        </div>

        {/* Submit Support Request Form Card */}
        <div className="hh-surface rounded-[28px] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <span className="text-lg">📝</span>
            <h3 className="font-display font-black text-gray-800 text-[14px]">
              Submit Support Request
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Issue type dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] text-gray-700 font-bold focus:outline-none focus:border-[#FF7527]/50"
              >
                <option value="Account issue">Account issue</option>
                <option value="Privacy concern">Privacy concern</option>
                <option value="App bug">App bug</option>
                <option value="Listener/community issue">Listener/community issue</option>
                <option value="Safety concern">Safety concern</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message Box */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Describe your issue, bug, or safety concern in detail..."
                className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] text-gray-700 font-bold focus:outline-none focus:border-[#FF7527]/50 placeholder-gray-300 leading-normal resize-none"
              />
            </div>

            {/* Optional Contact Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Enter email to receive support replies..."
                className="w-full px-3.5 py-2.5 bg-[#FCFBF8] border border-gray-200 rounded-xl text-[12.5px] text-gray-700 font-bold focus:outline-none focus:border-[#FF7527]/50 placeholder-gray-300"
              />
            </div>

            {/* Form feedback status alerts */}
            {formSuccess && (
              <div className="py-2 px-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-[11.5px] font-bold text-center leading-normal">
                {formSuccess}
              </div>
            )}
            {formError && (
              <div className="py-2 px-3 bg-red-50 text-red-650 border border-red-150 rounded-xl text-[11.5px] font-bold text-center leading-normal">
                ⚠️ {formError}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] disabled:bg-[#FF7527]/60 text-white rounded-xl text-[13px] font-display font-black cursor-pointer transition-all active:scale-[0.98] shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{isSubmitting ? 'Sending Request...' : 'Send Support Request'}</span>
            </button>
          </form>
        </div>

        {/* Safety report shortcut section */}
        <div className="hh-surface border border-red-100 rounded-2xl p-4.5 text-left flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0">
            🚩
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="font-display font-black text-gray-800 text-[13.5px] leading-tight">
              Report Unsafe Behaviour
            </h4>
            <p className="text-[11.5px] text-gray-500 font-semibold leading-normal">
              If a matched listener, message, or room comment violates community guidelines or safety policies, open the Safety Concern form directly.
            </p>
            <button
              onClick={onOpenSafetyReport}
              type="button"
              className="px-3.5 py-1.5 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-rose-700 border border-[#FECDD3] rounded-lg font-display font-black text-[11.5px] cursor-pointer transition-all active:scale-95"
            >
              Report Safety Concern
            </button>
          </div>
        </div>

        {/* Safety Warning Note Footer */}
        <p className="text-[10.5px] text-gray-450 font-semibold leading-normal text-center max-w-sm mx-auto pt-2">
          HopeHeart support is for app, account, privacy, and safety concerns. It is not an emergency or medical service.
        </p>
      </div>
    </div>
  );
}
