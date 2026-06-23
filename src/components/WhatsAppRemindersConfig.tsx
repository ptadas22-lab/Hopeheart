import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function WhatsAppRemindersConfig() {
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [whatsappTime, setWhatsappTime] = useState<string>('Morning');
  const [whatsappFrequency, setWhatsappFrequency] = useState<string>('Daily');
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load preferences from local storage and Supabase on mount
  useEffect(() => {
    const localEnabled = localStorage.getItem('hopeheart_whatsapp_reminders_enabled') === 'true';
    const localNumber = localStorage.getItem('hopeheart_whatsapp_number') || '';
    const localTime = localStorage.getItem('hopeheart_whatsapp_reminder_time') || 'Morning';
    const localFrequency = localStorage.getItem('hopeheart_whatsapp_reminder_frequency') || 'Daily';
    
    setWhatsappEnabled(localEnabled);
    setWhatsappNumber(localNumber);
    setWhatsappTime(localTime);
    setWhatsappFrequency(localFrequency);
    if (localEnabled) {
      setConsentAccepted(true);
    }

    const fetchBackendPreferences = async () => {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('whatsapp_reminders_enabled, whatsapp_number, whatsapp_reminder_time, whatsapp_reminder_frequency')
            .eq('id', userId)
            .single();
          if (data && !error) {
            setWhatsappEnabled(data.whatsapp_reminders_enabled ?? false);
            setWhatsappNumber(data.whatsapp_number ?? '');
            setWhatsappTime(data.whatsapp_reminder_time ?? 'Morning');
            setWhatsappFrequency(data.whatsapp_reminder_frequency ?? 'Daily');
            if (data.whatsapp_reminders_enabled) {
              setConsentAccepted(true);
            }
          }
        }
      } catch (err) {
        console.warn('[WhatsApp] Bypassed fetching backend settings:', err);
      }
    };

    fetchBackendPreferences();
  }, []);

  const handleSavePreference = async () => {
    setErrorMessage('');
    setSaveStatus('');

    if (whatsappEnabled) {
      if (!whatsappNumber.trim()) {
        setErrorMessage("Please enter your WhatsApp number to enable reminders.");
        return;
      }
      if (!consentAccepted) {
        setErrorMessage("Please agree to receive reminder messages to save preferences.");
        return;
      }
    }

    // Save locally
    localStorage.setItem('hopeheart_whatsapp_reminders_enabled', whatsappEnabled ? 'true' : 'false');
    localStorage.setItem('hopeheart_whatsapp_number', whatsappNumber.trim());
    localStorage.setItem('hopeheart_whatsapp_reminder_time', whatsappTime);
    localStorage.setItem('hopeheart_whatsapp_reminder_frequency', whatsappFrequency);

    // Sync to Supabase if configured
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              whatsapp_reminders_enabled: whatsappEnabled,
              whatsapp_number: whatsappNumber.trim(),
              whatsapp_reminder_time: whatsappTime,
              whatsapp_reminder_frequency: whatsappFrequency,
              updated_at: new Date().toISOString()
            });
          if (error) {
            console.warn('[WhatsApp] Supabase sync failed, cached locally:', error.message);
          }
        }
      } catch (err) {
        console.warn('[WhatsApp] Sync exception encountered:', err);
      }
    }

    setSaveStatus("Preferences saved successfully!");
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="hh-surface border border-[#ECE6D9]/60 rounded-3xl p-5 space-y-4 text-left">
      <div className="flex items-start justify-between border-b border-gray-100 pb-2.5">
        <div>
          <h4 className="font-display font-black text-gray-800 text-[14.5px] flex items-center gap-1.5">
            <span>💬</span> WhatsApp Reminders
          </h4>
          <p className="text-[11.5px] text-gray-550 font-semibold mt-0.5 leading-relaxed">
            Get gentle HopeHeart check-in reminders on WhatsApp.
          </p>
        </div>
        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap">
          Future Setup Needed
        </span>
      </div>

      <div className="space-y-4">
        {/* Toggle option */}
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] font-bold text-gray-800">Enable WhatsApp reminders</span>
          <button
            onClick={() => setWhatsappEnabled(!whatsappEnabled)}
            type="button"
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              whatsappEnabled ? 'bg-[#FF7527]' : 'bg-gray-200'
            }`}
            title="Toggle WhatsApp reminders"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform transform ${
                whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {whatsappEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3.5 pt-1.5 border-t border-gray-50"
          >
            {/* Phone Number Input */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                WhatsApp Number
              </span>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter WhatsApp number"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
              />
            </div>

            {/* Time Option dropdown */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                Reminder Time
              </span>
              <select
                value={whatsappTime}
                onChange={(e) => setWhatsappTime(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
              >
                {['Morning', 'Afternoon', 'Evening'].map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Frequency Selector dropdown */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                Reminder Frequency
              </span>
              <select
                value={whatsappFrequency}
                onChange={(e) => setWhatsappFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[12.5px] bg-[#FCFCFA] font-semibold focus:outline-none focus:border-[#FF7527]"
              >
                {['Daily', 'Weekly'].map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Example */}
            <div className="bg-[#FFFDF9]/60 border border-gray-150/40 p-3.5 rounded-2xl space-y-1 text-left">
              <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
                Preview of message
              </span>
              <p className="text-[11.5px] text-gray-600 font-semibold italic leading-relaxed">
                “HopeHeart check-in reminder 💛 How are you feeling today? Open HopeHeart to reflect safely.”
              </p>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-left pt-1 select-none">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-1 accent-[#FF7527] cursor-pointer"
              />
              <span className="text-[11.5px] text-gray-650 font-bold leading-normal">
                I agree to receive gentle HopeHeart reminder messages on WhatsApp when this feature is enabled.
              </span>
            </label>
          </motion.div>
        )}

        {/* Future Badge status */}
        <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl text-[11px] font-semibold text-amber-800 leading-relaxed text-center">
          ⚡ <strong>Status:</strong> WhatsApp sending requires backend setup.
        </div>

        {/* Unsubscribe & Privacy notes */}
        <div className="space-y-1 text-[10px] text-gray-400 font-semibold leading-relaxed">
          <p>
            ℹ️ You can turn off WhatsApp reminders anytime from Notifications or Profile Settings.
          </p>
          <p className="italic">
            🛡️ Privacy Promise: WhatsApp reminders will only contain gentle check-in text. HopeHeart will not send your mood, private notes, diagnosis, medication, location, or chat history.
          </p>
        </div>

        {/* Error / Success feedback inline */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-[11px] font-semibold">
            ⚠️ {errorMessage}
          </div>
        )}
        {saveStatus && (
          <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl p-3 text-[11px] font-bold text-center">
            ✓ {saveStatus}
          </div>
        )}

        <button
          onClick={handleSavePreference}
          type="button"
          className="w-full py-2.5 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-xl text-[12.5px] font-display font-black cursor-pointer transition-all text-center active:scale-95 shadow-3xs"
        >
          Save Reminder Preference
        </button>
      </div>
    </div>
  );
}
