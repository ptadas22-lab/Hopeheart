import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabaseClient';

interface SupportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onNavigateTo: (screenId: string) => void;
}

export default function SupportPopup({
  isOpen,
  onClose,
  activeCategory,
  onNavigateTo,
}: SupportPopupProps) {
  const [dbListener, setDbListener] = useState<any>(null);
  const [dbRoom, setDbRoom] = useState<any>(null);
  const [dbGuide, setDbGuide] = useState<any>(null);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch backend data if available when popup opens
  useEffect(() => {
    if (!isOpen) return;

    setDbListener(null);
    setDbRoom(null);
    setDbGuide(null);

    const fetchData = async () => {
      if (!supabase) return;
      try {
        // Fetch verification-checked active listener matching category or general
        const { data: listeners } = await supabase
          .from('community_listeners')
          .select('*')
          .eq('is_verified', true)
          .eq('availability', 'Available')
          .limit(1);
        if (listeners && listeners.length > 0) {
          setDbListener(listeners[0]);
        }

        // Fetch active support room
        const { data: rooms } = await supabase
          .from('support_rooms')
          .select('*')
          .eq('is_active', true)
          .limit(1);
        if (rooms && rooms.length > 0) {
          setDbRoom(rooms[0]);
        }

        // Fetch resource guide matching normalized category
        const dbCategory = 
          activeCategory === 'emotional-support' ? 'emotional-recovery' :
          activeCategory === 'general-support' ? 'general' :
          activeCategory;

        const { data: resources } = await supabase
          .from('resource_items')
          .select('*')
          .eq('is_active', true)
          .eq('category', dbCategory)
          .limit(1);
        if (resources && resources.length > 0) {
          setDbGuide(resources[0]);
        }
      } catch (err) {
        console.warn('[Popup] Quietly failed to fetch data from Supabase:', err);
      }
    };

    fetchData();
  }, [isOpen, activeCategory]);

  if (!isOpen) return null;

  // Resolve normalized category for fallback mock details
  const normalizedCategory =
    activeCategory === 'emotional-support' ? 'emotional-recovery' :
    activeCategory === 'general-support' ? 'general' :
    activeCategory;

  // Resolve safe details based on category (Fallbacks)
  const getPeerListenerDetails = () => {
    if (dbListener) {
      return {
        name: dbListener.display_name,
        role: dbListener.role || 'Verified Peer Listener',
        languages: dbListener.languages || 'English',
        focus: dbListener.support_focus || 'General support',
        availability: 'Available Now',
        isVerified: true
      };
    }
    // Safe mock fallbacks
    switch (normalizedCategory) {
      case 'anxiety':
        return {
          name: "Anjali M.",
          role: "Peer Listener",
          languages: "Hindi, English",
          focus: "General support, anxiety mitigation, daily stress management",
          availability: "Available (Evening)",
          isVerified: true
        };
      case 'parkinsons':
        return {
          name: "David K.",
          role: "Caregiver Guide",
          languages: "English",
          focus: "Caregiver burnout, Parkinson's family support",
          availability: "Available (Weekends)",
          isVerified: true
        };
      case 'hallucinations':
        return {
          name: "Sarah P.",
          role: "Community Volunteer",
          languages: "English, Spanish",
          focus: "Quiet reality validation, reality grounding",
          availability: "Available (Afternoons)",
          isVerified: true
        };
      case 'emotional-recovery':
      case 'emotional-support':
        return {
          name: "Michael H.",
          role: "Peer Listener",
          languages: "English",
          focus: "Grief recovery, emotional burnout, life transitions",
          availability: "Available Online",
          isVerified: true
        };
      case 'general':
      case 'general-support':
      default:
        return {
          name: "Companion",
          role: "Peer Listener",
          languages: "English",
          focus: "General peer emotional support",
          availability: "Available Online",
          isVerified: true
        };
    }
  };

  const getCoachDetails = () => {
    return {
      name: "Coach Clara J.",
      role: "Certified Coach",
      languages: "English",
      focus: "Stress management, emotional wellness, daily habit coaching",
      availability: "Available Online",
      isVerified: true
    };
  };

  const getDoctorDetails = () => {
    return {
      name: "Dr. Marcus T.",
      role: "Medical Specialist",
      languages: "English",
      focus: "Cognitive guidance, medical consultation, specialist check-ins",
      availability: "By Appointment",
      isVerified: true
    };
  };

  const getSupportRoomDetails = () => {
    if (dbRoom) {
      return {
        name: dbRoom.room_name,
        description: dbRoom.description || 'Support circle chat room'
      };
    }
    switch (normalizedCategory) {
      case 'anxiety':
        return { name: "Anxiety Support Circles", description: "Join group rooms centered on stress and overthinking support." };
      case 'parkinsons':
        return { name: "Parkinson's Circles", description: "Join rooms where families share somatic tremor tips and wins." };
      case 'hallucinations':
        return { name: "Quiet Sharing Circles", description: "Slow-paced rooms for talking through confusion or fears." };
      case 'emotional-recovery':
      case 'emotional-support':
        return { name: "Burnout & Loss Circles", description: "Weekly sharing circles for mutual recovery during transitions." };
      case 'general':
      case 'general-support':
      default:
        return { name: "General Support Lounge", description: "Open-ended support room for sharing daily experiences and finding calm." };
    }
  };

  const getGuideDetails = () => {
    if (dbGuide) {
      return {
        title: dbGuide.title,
        summary: dbGuide.summary
      };
    }
    switch (normalizedCategory) {
      case 'anxiety':
        return { title: "NAMI Anxiety Guide", summary: "Educational resources, guides on panic attacks, and family help guides." };
      case 'parkinsons':
        return { title: "Family Caregiver Alliance", summary: "Offers caregiver checklists, online classes, and regional advocacy groups." };
      case 'hallucinations':
        return { title: "Lewy Body Dementia Line", summary: "Specialized support for hallucinations and caregiver confusion." };
      case 'general':
      case 'general-support':
        return { title: "Educational Guides", summary: "Read simple guides about anxiety, grief, Parkinson's support, and recovery." };
      case 'emotional-recovery':
      case 'emotional-support':
      default:
        return { title: "Burnout Recovery Guide", summary: "Self-assessments, stress reduction worksheets, and directories." };
    }
  };

  const listenerDetails = getPeerListenerDetails();
  const coachDetails = getCoachDetails();
  const doctorDetails = getDoctorDetails();
  const roomDetails = getSupportRoomDetails();
  const guideDetails = getGuideDetails();

  const handleDismiss = () => {
    if (dontShowAgain) {
      const todayDateStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('hopeheart_support_popup_dismissed_date', todayDateStr);
    }
    onClose();
  };

  const handleAction = (screenId: string) => {
    if (dontShowAgain) {
      const todayDateStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('hopeheart_support_popup_dismissed_date', todayDateStr);
    }
    onClose();
    onNavigateTo(screenId);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-xs select-none">
      {/* Backdrop click close handler */}
      <div className="absolute inset-0 cursor-default" onClick={handleDismiss} />

      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 120 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full sm:max-w-xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white border border-t-[#EDE9DE] sm:border-[#EDE9DE] rounded-t-[32px] rounded-b-none sm:rounded-[32px] relative z-[9999] text-left flex flex-col shadow-xl select-none scrollbar-none"
      >
        {/* Header section */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-[#FCFAF5] sticky top-0 z-20">
          <div className="space-y-1.5 flex-1 pr-6">
            <h3 className="font-display font-black text-gray-800 text-[18px] tracking-tight leading-none flex items-center gap-1.5">
              <span>🛡️</span> Available Support for You
            </h3>
            <p className="text-[12.5px] text-gray-500 font-semibold leading-normal pr-2">
              Based on what you selected, here are safe support options you can try.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full border border-gray-150 hover:bg-gray-50 text-gray-400 hover:text-gray-700 font-bold text-[16px] flex items-center justify-center cursor-pointer transition-colors"
            title="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: HopeBuddy Reflection */}
            <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase align-middle inline-block">
                  HopeBuddy Companion
                </span>
                <h5 className="font-display font-black text-gray-800 text-[13px] leading-tight">
                  Talk to HopeBuddy first
                </h5>
                <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                  Take a quiet moment to reflect on your current mood with HopeBuddy.
                </p>
              </div>
              <button
                onClick={() => handleAction('hopebuddy-chat')}
                className="w-full py-2 bg-[#FCFAF5] hover:bg-amber-50/50 border border-[#EDE9DE] hover:border-amber-200 text-gray-700 hover:text-amber-800 transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
              >
                Start Reflection
              </button>
            </div>

            {/* Card 2: Peer Listener */}
            <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-[#FF7527] bg-[#FFF2EA] px-2 py-0.5 rounded-md uppercase">
                    {listenerDetails.role}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                    ✓ Verified
                  </span>
                </div>
                <h5 className="font-display font-black text-gray-800 text-[13px] leading-tight">
                  Talk to a peer listener
                </h5>
                <div className="space-y-0.5 text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                  <p><span className="text-gray-400 font-medium font-bold">Name:</span> {listenerDetails.name}</p>
                  <p><span className="text-gray-400 font-medium font-bold">Languages:</span> {listenerDetails.languages}</p>
                  <p><span className="text-gray-400 font-medium font-bold">Focus:</span> {listenerDetails.focus}</p>
                  <p className="italic text-emerald-600">● {listenerDetails.availability}</p>
                </div>
              </div>
              <button
                onClick={() => handleAction('safe-listener')}
                className="w-full py-2 bg-[#FCFAF5] hover:bg-[#FFF2EA] border border-[#EDE9DE] hover:border-[#FF7527]/30 text-gray-700 hover:text-[#FF7527] transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
              >
                Request Support
              </button>
            </div>

            {/* Card 3: Support Room */}
            <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md uppercase align-middle inline-block">
                  Support Circle
                </span>
                <h5 className="font-display font-black text-gray-800 text-[13px] leading-tight">
                  Join a support room
                </h5>
                <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                  <strong>{roomDetails.name}</strong>: {roomDetails.description}
                </p>
              </div>
              <button
                onClick={() => handleAction('support-rooms')}
                className="w-full py-2 bg-[#FCFAF5] hover:bg-indigo-50/50 border border-[#EDE9DE] hover:border-indigo-200 text-gray-700 hover:text-indigo-800 transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
              >
                View Rooms
              </button>
            </div>

            {/* Card 4: Coach / emotional wellness professional */}
            <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                    {coachDetails.role}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                    ✓ Verified
                  </span>
                </div>
                <h5 className="font-display font-black text-gray-800 text-[13px] leading-tight">
                  Connect with a wellness coach
                </h5>
                <div className="space-y-0.5 text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                  <p><span className="text-gray-400 font-medium font-bold">Name:</span> {coachDetails.name}</p>
                  <p><span className="text-gray-400 font-medium font-bold">Focus:</span> {coachDetails.focus}</p>
                  <p className="italic text-teal-600">● {coachDetails.availability}</p>
                </div>
              </div>
              <button
                onClick={() => handleAction('doctor-suggestions')}
                className="w-full py-2 bg-[#FCFAF5] hover:bg-teal-50 border border-[#EDE9DE] hover:border-teal-200 text-gray-700 hover:text-teal-800 transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
              >
                Find Coaches
              </button>
            </div>

            {/* Card 5: Helpful Guide */}
            <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase align-middle inline-block">
                  Resource Guide
                </span>
                <h5 className="font-display font-black text-gray-800 text-[13px] leading-tight">
                  Read a helpful guide
                </h5>
                <p className="text-[11.5px] text-gray-550 font-semibold leading-relaxed">
                  <strong>{guideDetails.title}</strong>: {guideDetails.summary}
                </p>
              </div>
              <button
                onClick={() => handleAction('doctor-suggestions')}
                className="w-full py-2 bg-[#FCFAF5] hover:bg-teal-50/50 border border-[#EDE9DE] hover:border-teal-200 text-gray-700 hover:text-teal-800 transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
              >
                Open Resource
              </button>
            </div>

            {/* Card 6: Save Care Question */}
            <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase align-middle inline-block">
                  Private Notebook
                </span>
                <h5 className="font-display font-black text-gray-800 text-[13px] leading-tight">
                  Save a care question
                </h5>
                <p className="text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                  Quickly save care questions to prepare for your next consultation. Everything stays private on your device.
                </p>
              </div>
              <button
                onClick={() => handleAction('save-questions')}
                className="w-full py-2 bg-[#FCFAF5] hover:bg-amber-50/50 border border-[#EDE9DE] hover:border-amber-200 text-gray-700 hover:text-amber-800 transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
              >
                Add Question
              </button>
            </div>

            {/* Card 7: Doctor consultation */}
            <div className="bg-[#FCFAF5] border border-[#EDE9DE] rounded-2xl p-4 flex flex-col justify-between gap-3 col-span-1 md:col-span-2">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md uppercase">
                    {doctorDetails.role}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                    🔒 Safety Gate Required
                  </span>
                </div>
                <h5 className="font-display font-black text-gray-800 text-[13px] leading-tight">
                  Consult a licensed medical doctor or specialist
                </h5>
                <div className="space-y-0.5 text-[11.5px] text-gray-500 font-semibold leading-relaxed">
                  <p><span className="text-gray-400 font-medium font-bold">Name:</span> {doctorDetails.name}</p>
                  <p><span className="text-gray-400 font-medium font-bold">Focus:</span> {doctorDetails.focus}</p>
                  <p className="text-amber-800 font-bold">⚠️ Connection requires profile completion and safety gate confirmation.</p>
                </div>
              </div>
              <button
                onClick={() => handleAction('doctor-suggestions')}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
              >
                Access Doctor Gateway
              </button>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer and Suppression Checkbox Footer bar */}
        <div className="bg-[#FEFBF7] border border-amber-100 rounded-2xl p-4 space-y-3 mt-2 mx-5 mb-5">
          <p className="text-[11px] text-[#A16207] font-semibold leading-relaxed">
            ⚠️ <strong>Safety Statement:</strong> HopeHeart provides emotional support, peer listening, and resources. It does not provide medical diagnosis, prescriptions, therapy, emergency care, or crisis intervention.
          </p>
          
          <div className="border-t border-amber-100/50 pt-2.5 flex items-center justify-between gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-[11.5px] text-gray-500 font-bold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-[#FF7527] focus:ring-[#FF7527] cursor-pointer"
              />
              Don’t show again today
            </label>

            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-[11.5px] font-display font-black transition-all cursor-pointer shadow-3xs"
            >
              Not now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
