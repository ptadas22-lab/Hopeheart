import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorQuestion } from '../types';

interface CareBridgeScreenProps {
  onBack: () => void;
  savedQuestions: DoctorQuestion[];
  onAddQuestion: (text: string) => void;
  onDeleteQuestion: (id: string) => void;
}

type SubScreen = 'suggestions' | 'profile' | 'book' | 'questions';

export default function CareBridgeScreen({
  onBack,
  savedQuestions,
  onAddQuestion,
  onDeleteQuestion,
}: CareBridgeScreenProps) {
  const [subScreen, setSubScreen] = useState<SubScreen>('suggestions');
  
  // Selected clinician data for custom profile view
  const [selectedClinician, setSelectedClinician] = useState({
    name: 'Dr. Ananya Rao',
    specialty: 'Anxiety & Stress Care',
    type: 'Verified Professional',
    mode: 'Online / In-person',
    languages: 'English, Hindi, Kannada',
    available: 'This week',
    canHelpWith: [
      'Anxiety',
      'Stress',
      'Emotional overwhelm',
      'Sleep difficulty',
      'Trauma support',
      'Care guidance'
    ]
  });

  const [filterType, setFilterType] = useState<string>('All');
  
  // Save Question input
  const [questionInput, setQuestionInput] = useState<string>('');

  // Booking Form state
  const [bookingReason, setBookingReason] = useState<string>('Anxiety');
  const [bookingMessage, setBookingMessage] = useState<string>('');
  const [bookingConsent, setBookingConsent] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const handleAddQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    onAddQuestion(questionInput.trim());
    setQuestionInput('');
  };

  const handleRequestBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!bookingConsent) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingMessage('');
      setSubScreen('suggestions');
    }, 3000);
  };

  const exampleQuestions = [
    'Why do I feel anxious often?',
    'What should I do when panic starts?',
    'Do I need therapy?',
    'Should I meet a specialist?',
    'What support options are right for me?'
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none scrollbar-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={() => {
            if (subScreen === 'suggestions') {
              onBack();
            } else {
              setSubScreen('suggestions');
            }
          }}
          id="btn-back-carebridge"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subScreen === 'suggestions' && 'Professional Suggestions'}
          {subScreen === 'profile' && 'Professional Profile'}
          {subScreen === 'book' && 'Request Appointment'}
          {subScreen === 'questions' && 'Doctor Question List'}
        </span>
        <button 
          onClick={() => setSubScreen('questions')}
          className="relative px-3 py-1.5 bg-[#FFF2EA] hover:bg-[#FFE3D1] rounded-xl flex items-center gap-1 text-[11px] font-display font-black text-[#FF7527] transition-all cursor-pointer"
        >
          <span>📋</span> Question List
          {savedQuestions.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold font-mono">
              {savedQuestions.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {/* SCREEN 16: SUGGGESTIONS CATOLOG */}
          {subScreen === 'suggestions' && (
            <motion.div
              key="suggestions-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Responsive Hero Header */}
              <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/20 border border-emerald-100/70 rounded-3xl p-5 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 md:max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                    🧑‍⚕️ Verified Clinician Care
                  </div>
                  <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[28px] leading-snug">
                    Professional Care Suggestions
                  </h2>
                  <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed font-medium">
                    Some pain needs professional care. That is okay. HopeHeart can suggest verified professionals based on your support need.
                  </p>
                  <p className="text-[11.5px] text-gray-400 italic">
                    HopeHeart does not diagnose you. These are care suggestions, not medical decisions.
                  </p>
                </div>
                <div className="shrink-0 flex items-center justify-end">
                  <div className="bg-white border border-emerald-100 rounded-3xl p-4 shadow-inner flex flex-col items-center justify-center text-center w-36">
                    <span className="text-[32px]">🌱</span>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#FF7527] mt-1">AI PROTECTED</span>
                  </div>
                </div>
              </div>

              {/* Care Type Filter Selector chips */}
              <div className="space-y-2">
                <label className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider">
                  Select Care Specialty Filter
                </label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Therapist', 'Psychologist', 'Psychiatrist', 'Doctor', 'Neurologist', 'Counsellor'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3.5 py-2 text-[12.5px] font-display font-bold rounded-xl transition-all cursor-pointer ${
                        filterType === type 
                          ? 'bg-[#1E1E1A] text-white shadow-xs' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Professional Cards Grid (2 columns on desktop, 1 on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* SUGGESTION 1: Therapist */}
                {(filterType === 'All' || filterType === 'Therapist' || filterType === 'Counsellor') && (
                  <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase">Verified Therapist</span>
                        <span className="text-[12px] font-semibold text-gray-400">Online / In-person</span>
                      </div>
                      <h4 className="font-display font-extrabold text-gray-800 text-[17px] leading-tight">
                        Anxiety & Stress Therapist
                      </h4>
                      <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                        Best for: Anxiety, stress, emotional overwhelm, panic attacks, and lifestyle adjustments.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClinician({
                          name: 'Dr. Ananya Rao',
                          specialty: 'Anxiety & Stress Care',
                          type: 'Verified Professional Therapist',
                          mode: 'Online / In-person',
                          languages: 'English, Hindi, Kannada',
                          available: 'This week',
                          canHelpWith: [
                            'Anxiety', 'Stress', 'Emotional overwhelm', 'Sleep difficulty', 'Trauma support', 'Care guidance'
                          ]
                        });
                        setSubScreen('profile');
                      }}
                      className="w-full py-2.5 bg-[#FAF8F5] border border-gray-200 hover:bg-[#FF7527] hover:text-white transition-all text-gray-700 font-display font-bold text-[13px] rounded-xl cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                )}

                {/* SUGGESTION 2: Psychologist */}
                {(filterType === 'All' || filterType === 'Psychologist') && (
                  <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md uppercase">Verified Psychologist</span>
                        <span className="text-[12px] font-semibold text-gray-400 font-medium">Online / In-person</span>
                      </div>
                      <h4 className="font-display font-extrabold text-gray-800 text-[17px] leading-tight">
                        Trauma-informed Psychologist
                      </h4>
                      <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                        Best for: Trauma, triggers, emotional healing, grief, and long-term diagnostic assessments.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClinician({
                          name: 'Dr. Kenneth Vance',
                          specialty: 'Trauma & PTSD Support',
                          type: 'Verified Clinical Psychologist',
                          mode: 'Online / In-person',
                          languages: 'English, Spanish',
                          available: 'Next week',
                          canHelpWith: [
                            'Trauma healing', 'Grief', 'Trigger management', 'Behavioral health', 'Psychotherapy'
                          ]
                        });
                        setSubScreen('profile');
                      }}
                      className="w-full py-2.5 bg-[#FAF8F5] border border-gray-200 hover:bg-[#FF7527] hover:text-white transition-all text-gray-700 font-display font-bold text-[13px] rounded-xl cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                )}

                {/* SUGGESTION 3: Psychiatrist */}
                {(filterType === 'All' || filterType === 'Psychiatrist' || filterType === 'Doctor') && (
                  <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md uppercase">Verified Psychiatrist</span>
                        <span className="text-[12px] font-semibold text-gray-400">Appointment required</span>
                      </div>
                      <h4 className="font-display font-extrabold text-gray-800 text-[17px] leading-tight">
                        Clinical Psychiatrist
                      </h4>
                      <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                        Best for: Medication-related care, clinical diagnostic mental health treatment, and prescription oversight.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClinician({
                          name: 'Dr. Marcus Sterling',
                          specialty: 'Clinical Psychiatry & Psychopharmacology',
                          type: 'Certified Medical Psychiatrist',
                          mode: 'Clinic Appointment Only',
                          languages: 'English, French',
                          available: 'By appointment',
                          canHelpWith: [
                            'Clinical diagnosis', 'Medication administration', 'Prescription evaluation', 'Bi-polar treatments', 'Chronic anxiety care'
                          ]
                        });
                        setSubScreen('profile');
                      }}
                      className="w-full py-2.5 bg-[#FAF8F5] border border-gray-200 hover:bg-[#FF7527] hover:text-white transition-all text-gray-700 font-display font-bold text-[13px] rounded-xl cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                )}

                {/* SUGGESTION 4: Neurologist */}
                {(filterType === 'All' || filterType === 'Neurologist' || filterType === 'Doctor') && (
                  <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">Verified Neurologist</span>
                        <span className="text-[12px] font-semibold text-gray-400">Appointment required</span>
                      </div>
                      <h4 className="font-display font-extrabold text-gray-800 text-[17px] leading-tight">
                        Neurologist Specialist
                      </h4>
                      <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                        Best for: Parkinson’s, motor coordination, neurological health concerns, or somatic tremor analysis.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClinician({
                          name: 'Dr. Elizabeth Lin',
                          specialty: 'Neurology & Somatic Health',
                          type: 'Board-Certified Neurologist',
                          mode: 'Clinic Appointment Only',
                          languages: 'English, Mandarin',
                          available: 'This week',
                          canHelpWith: [
                            'Parkinson\'s support', 'Neurological assessment', 'Somatic symptoms', 'Tremor therapies', 'Motor coordination'
                          ]
                        });
                        setSubScreen('profile');
                      }}
                      className="w-full py-2.5 bg-[#FAF8F5] border border-gray-200 hover:bg-[#FF7527] hover:text-white transition-all text-gray-700 font-display font-bold text-[13px] rounded-xl cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                )}

              </div>

              {/* Bottom Creed Stamp */}
              <div className="bg-[#FEFAF0] border-2 border-dashed border-[#F3E2C4] p-5 rounded-3xl text-center">
                <span className="font-mono text-[9px] font-extrabold text-[#FF7527] uppercase tracking-widest block mb-1">
                  Our Code of Practice
                </span>
                <p className="text-[13.5px] font-bold text-gray-700">
                  "Community supports. AI protects. Doctors treat."
                </p>
              </div>
            </motion.div>
          )}

          {/* SCREEN 17: PROFESSIONAL PROFILE SCREEN */}
          {subScreen === 'profile' && (
            <motion.div
              key="profile-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto bg-white border border-[#E9E4D9] rounded-3xl p-6 md:p-8 space-y-6 shadow-xs"
            >
              {/* Doctor Header card */}
              <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-[#FFEFE5] border-2 border-[#FF7527] flex items-center justify-center text-3xl shrink-0 select-none">
                  👩‍⚕️
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 bg-[#FFF2EA] text-[#FF7527] text-[10px] font-mono font-extrabold tracking-wider px-2 py-0.5 rounded-md uppercase">
                    {selectedClinician.type}
                  </div>
                  <h3 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[22px] leading-tight mt-1">
                    {selectedClinician.name}
                  </h3>
                  <p className="text-[13px] text-[#FF7527] font-semibold">
                    {selectedClinician.specialty}
                  </p>
                </div>
              </div>

              {/* Doctor Details Specs */}
              <div className="grid grid-cols-2 gap-4 bg-[#FCFAF5] p-4.5 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">CONSULTATION MODE</span>
                  <span className="text-[12.5px] text-[#2B1D12] font-semibold">{selectedClinician.mode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">SUPPORT LANGUAGES</span>
                  <span className="text-[12.5px] text-[#2B1D12] font-semibold">{selectedClinician.languages}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">AVAILABILITY</span>
                  <span className="text-[12.5px] font-semibold text-emerald-600">● {selectedClinician.available}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">VERIFICATION ID</span>
                  <span className="text-[11.5px] font-mono text-gray-500 font-bold">#HP-9562-IN</span>
                </div>
              </div>

              {/* Specialty Chips */}
              <div className="space-y-2">
                <h4 className="text-[12.5px] font-mono font-black text-gray-800 uppercase tracking-wider">Can Assist You With:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedClinician.canHelpWith.map((help, idx) => (
                    <span key={idx} className="bg-white border border-[#EEE9DD] text-gray-600 text-[12px] font-semibold px-3 py-1 rounded-xl shadow-xs">
                      ✨ {help}
                    </span>
                  ))}
                </div>
              </div>

              {/* Critical Legal Disclaimer */}
              <div className="bg-[#FFF8F8] border border-red-100 p-4 rounded-2xl">
                <p className="text-[12px] text-red-800 font-semibold leading-relaxed">
                  ⚠️ <strong>Disclaimer:</strong> Only verified professionals can provide official diagnosis, clinical therapy, medical prescriptions, or treatment guidance. Community users on HopeHeart cannot provide medical advice.
                </p>
              </div>

              {/* Bottom Interaction controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setSubScreen('book')}
                  className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] font-display font-extrabold text-white rounded-2xl shadow-sm text-center cursor-pointer text-[14.5px] transition-all"
                >
                  Request Appointment
                </button>
                <button
                  onClick={() => {
                    alert(`Saved ${selectedClinician.name} on your clipboard list!`);
                    setSubScreen('suggestions');
                  }}
                  className="w-full py-3.5 bg-white hover:bg-[#FCFAF5] border border-gray-200 text-gray-700 font-display font-extrabold rounded-2xl text-center cursor-pointer text-[14.5px] transition-all"
                >
                  Save for Later
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 18: BOOK INTENSE CARE SCREEN */}
          {subScreen === 'book' && (
            <motion.div
              key="book-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto bg-white border border-[#E9E4D9] rounded-3xl p-6 md:p-8 space-y-6 shadow-xs"
            >
              <div className="text-center space-y-1">
                <div className="text-[40px]">📅</div>
                <h3 className="font-display font-black text-gray-800 text-[20px] md:text-[22px]">
                  Request Appointment
                </h3>
                <p className="text-[13px] text-gray-500 font-medium">
                  Submit a confidential intake request to connect with <strong>{selectedClinician.name}</strong>.
                </p>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3 bg-[#F2FAF6] border border-emerald-100 rounded-3xl p-5">
                  <div className="text-[36px] animate-bounce">✨</div>
                  <h4 className="font-display font-black text-emerald-800 text-[17px]">Intake Request Simulated!</h4>
                  <p className="text-[13px] text-emerald-700 leading-relaxed max-w-md mx-auto">
                    Your appointment intent with <strong>Reason: {bookingReason}</strong> has been saved. The clinician team will receive your inquiry and saved doctor questions docket shortly.
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium italic pt-2">
                    Returning to listings in a moment ...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestBooking} className="space-y-4">
                  {/* Select reason */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF7527]">
                      Reason for Visit
                    </label>
                    <select
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-[13.5px] bg-[#FCFCFA] font-semibold focus:ring-1 focus:ring-[#FF7527] focus:outline-none"
                    >
                      <option value="Anxiety">Anxiety</option>
                      <option value="Trauma">Trauma</option>
                      <option value="Loneliness">Loneliness</option>
                      <option value="Chronic illness support">Chronic illness support</option>
                      <option value="Caregiver stress">Caregiver stress</option>
                      <option value="Parkinson’s support">Parkinson’s support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Input message */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF7527]">
                      Confidential Message for Professional
                    </label>
                    <textarea
                      placeholder="Briefly tell the professional what support or help checklists you are looking for..."
                      rows={4}
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-2xl text-[13px] bg-[#FCFCFA] focus:ring-1 focus:ring-[#FF7527] focus:outline-none font-medium"
                    />
                  </div>

                  {/* Consents checkbox */}
                  <div className="flex items-start gap-3 bg-[#FCFAF5] p-4 rounded-xl border border-gray-100">
                    <input
                      type="checkbox"
                      id="consent-box"
                      checked={bookingConsent}
                      onChange={(e) => setBookingConsent(e.target.checked)}
                      className="w-5 h-5 accent-[#FF7527] border-gray-300 rounded-lg mt-0.5 shrink-0"
                    />
                    <label htmlFor="consent-box" className="text-[12px] text-gray-600 font-semibold leading-relaxed cursor-pointer select-none">
                      I understand HopeHeart is only helping me connect with care. The professional will provide official medical decisions and diagnostic guidance during the appointment.
                    </label>
                  </div>

                  {/* Submit buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSubScreen('profile')}
                      className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-extrabold text-[13.5px] rounded-2xl cursor-pointer"
                    >
                      Cancel Profile
                    </button>
                    <button
                      type="submit"
                      disabled={!bookingConsent}
                      className={`w-full py-3 font-display font-extrabold text-[13.5px] rounded-2xl text-white transition-all ${
                        bookingConsent 
                          ? 'bg-[#1E1E1A] hover:bg-black cursor-pointer shadow-xs' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Request Booking
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* SCREEN 19: SAVE QUESTIONS FOR DOCTOR SCREEN */}
          {subScreen === 'questions' && (
            <motion.div
              key="questions-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto bg-white border border-[#E9E4D9] rounded-3xl p-6 md:p-8 space-y-6 shadow-xs"
            >
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="font-display font-black text-gray-800 text-[20px] md:text-[22px] tracking-tight leading-none">
                  Save Questions for Doctor
                </h3>
                <p className="text-[13px] text-gray-500 font-semibold">
                  Write down what you want to ask during your upcoming general practitioner appointment. We keep it ready for you!
                </p>
              </div>

              {/* Core add form */}
              <form onSubmit={handleAddQuestion} className="flex gap-2.5">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Ask about symptoms, pills, dosage, or anxiety triggers..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-[13px] bg-[#FCFCFA] focus:outline-none focus:border-[#FF7527] font-semibold"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white rounded-2xl text-[13px] font-display font-black transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Save Question
                </button>
              </form>

              {/* Sample Helper suggestions */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Quick examples (click to auto-add)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {exampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onAddQuestion(q)}
                      className="bg-[#FCFAF5] hover:bg-[#FFF2EA] border border-[#EEE9DD] text-gray-600 hover:text-[#FF7527] text-[11.5px] font-semibold px-3 py-1.5 rounded-xl text-left transition-colors cursor-pointer"
                    >
                      ➕ {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Questions Container */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                  Your Active Saved Questions Checklist ({savedQuestions.length})
                </span>
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-thin">
                  {savedQuestions.length === 0 ? (
                    <div className="text-center py-8 bg-[#FCFAF5] border border-dashed border-[#ECE6D9] rounded-2xl">
                      <span className="text-[28px]">📜</span>
                      <p className="text-[12px] text-gray-500 font-semibold mt-2">
                        Your clinical clipboard is empty. Save questions above!
                      </p>
                    </div>
                  ) : (
                    savedQuestions.map((q) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start justify-between gap-3 p-3.5 bg-white border border-[#EEE9DD] rounded-xl text-[12.5px] text-gray-700"
                      >
                        <div className="flex-1 font-semibold leading-relaxed select-all">
                          • {q.text}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              alert(`Sent question: "${q.text}" mock-shared with your verified care provider!`);
                            }}
                            className="bg-[#F2FAF6] text-emerald-700 hover:bg-emerald-100 text-[10px] font-display font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer"
                          >
                            Share with Professional
                          </button>
                          <button
                            onClick={() => onDeleteQuestion(q.id)}
                            className="text-gray-400 hover:text-red-500 font-mono font-bold text-[15px] px-1.5 cursor-pointer leading-none"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-[#FAF7F0] border border-[#ECE6D9] p-4 rounded-2xl">
                <p className="text-[11.5px] text-gray-500 font-medium leading-relaxed">
                  💡 <strong>Tip:</strong> Keep this list open on your phone screen when talking face-to-face with your physician so that no important bodily symptoms are left unaddressed!
                </p>
              </div>

              <button
                onClick={() => setSubScreen('suggestions')}
                className="w-full py-3 bg-[#1e1e1a] text-white font-display font-black text-[14px] rounded-xl cursor-pointer"
              >
                Back to Suggestions Grid
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
export { CareBridgeScreen };
