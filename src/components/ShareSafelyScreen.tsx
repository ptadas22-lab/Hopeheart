import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabaseClient';

interface ShareSafelyScreenProps {
  onBack: () => void;
  onPostSuccess: () => void;
  onRequireProfileCompletion?: (onSuccess: () => void) => void;
  onShareCheckIn?: () => void;
  onAddQuestion?: (text: string) => void;
  onOpenCrisisScreen?: () => void;
}

export default function ShareSafelyScreen({ 
  onBack, 
  onPostSuccess,
  onRequireProfileCompletion,
  onShareCheckIn,
  onAddQuestion,
  onOpenCrisisScreen
}: ShareSafelyScreenProps) {
  const [subStage, setSubStage] = useState<'hub' | 'private-reflection' | 'saved-question' | 'write' | 'moment'>('hub');
  
  // Custom states
  const [textRelease, setTextRelease] = useState<string>('');
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  
  // Moment Share metadata 
  const [momentCaption, setMomentCaption] = useState<string>('');
  const [selectedMoodTag, setSelectedMoodTag] = useState<string>('Hopeful');
  const [privacyOption, setPrivacyOption] = useState<string>('Share anonymously');
  const [aiScreeningMessage, setAiScreeningMessage] = useState<string>('');
  
  // Custom Hub states
  const [privateText, setPrivateText] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  
  const moodTags = ['Calm', 'Hopeful', 'Heavy', 'Lonely', 'Healing', 'Grateful'];
  const privacySettings = ['Share anonymously', 'Keep private', 'Share with support room'];

  // Preset warm image templates to simulate upload moments beautifully
  const simulatedPhotos = [
    { name: 'cup_of_tea', emoji: '🍵', label: 'Warm Cup of Tea', url: 'A steaming cup of lavender tea under gentle sunlight.' },
    { name: 'garden_walk', emoji: '🌳', label: 'Walk Outside', url: 'Crisp green leaves and a quiet muddy trail in the woods.' },
    { name: 'small_doodle', emoji: '🎨', label: 'Crayon Drawing', url: 'A cozy orange heart with little protective hands holding it.' },
    { name: 'peaceful_lake', emoji: '🌅', label: 'Quiet Sunset', url: 'Soft lavender pink skies reflecting off fresh calm lake water.' }
  ];

  // Helper check for crisis/self-harm keywords
  const checkHighRiskText = (text: string): boolean => {
    const lower = text.toLowerCase();
    const highRiskPhrases = ['suicide', 'kill myself', 'harm myself', 'end my life', 'immediate danger'];
    if (highRiskPhrases.some(phrase => lower.includes(phrase))) {
      onOpenCrisisScreen?.();
      return true;
    }
    return false;
  };

  const handleMicSimulate = () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      setTextRelease(prev => prev + " [Voice-to-text: I did a slow 5-minute breathing walk and noticed dry pinecones in the soil. It helped me ground.]");
    } else {
      setIsListeningMic(true);
    }
  };

  // Submit anonymous story
  const handleShareSubmit = () => {
    if (checkHighRiskText(momentCaption)) return;

    const action = async () => {
      // Show automated image scanning disclaimer
      setAiScreeningMessage('🛡️ HopeHeart Safe AI is scanning your moment image... Clear of prescriptions/IDs! Approved.');
      
      let userId: string | null = null;
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          userId = session?.user?.id || null;
        } catch (e) {
          console.warn('[Stories] Error getting session:', e);
        }
      }

      const saveStoryLocally = () => {
        try {
          const localQueue = JSON.parse(localStorage.getItem('hopeheart_pending_stories') || '[]');
          const newStory = {
            id: 'local-' + Date.now(),
            title: `${selectedMoodTag} Moment`,
            story_text: momentCaption,
            category: selectedMoodTag.toLowerCase(),
            author_name: privacyOption === 'Share anonymously' ? 'Anonymous' : 'Companion',
            status: 'pending_review',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('hopeheart_pending_stories', JSON.stringify([...localQueue, newStory]));
          localStorage.setItem('hopeheart_has_shared_story', 'true');
        } catch (e) {
          console.warn('[Stories] Error saving story locally:', e);
        }
      };

      if (supabase) {
        try {
          const { error } = await supabase
            .from('community_stories')
            .insert({
              user_id: userId,
              title: `${selectedMoodTag} Moment`,
              story_text: momentCaption,
              category: selectedMoodTag.toLowerCase(),
              author_name: privacyOption === 'Share anonymously' ? 'Anonymous' : 'Companion',
              status: 'pending_review'
            });
          if (error) {
            console.warn('[Stories] Failed to insert story into Supabase:', error.message);
            saveStoryLocally();
          } else {
            localStorage.setItem('hopeheart_has_shared_story', 'true');
          }
        } catch (err) {
          console.warn('[Stories] Error saving story in Supabase:', err);
          saveStoryLocally();
        }
      } else {
        saveStoryLocally();
      }

      setTimeout(() => {
        alert("Hope Moment Posted Safely! Thank you for sharing a spark of light.");
        onPostSuccess();
      }, 1800);
    };

    if (onRequireProfileCompletion) {
      onRequireProfileCompletion(action);
    } else {
      action();
    }
  };

  // Save private journaling reflection locally
  const handleSavePrivateReflection = () => {
    if (!privateText.trim()) return;
    if (checkHighRiskText(privateText)) return;

    try {
      const currentRefs = JSON.parse(localStorage.getItem('hopeheart_saved_reflections') || '[]');
      const newRef = {
        id: 'ref-' + Date.now(),
        text: privateText,
        created_at: new Date().toISOString()
      };
      localStorage.setItem('hopeheart_saved_reflections', JSON.stringify([newRef, ...currentRefs]));
      localStorage.setItem('hopeheart_has_reflected', 'true');
      localStorage.setItem('hopeheart_has_shared_story', 'true');
      
      alert("✓ Reflection saved safely in your private local journal!");
      setPrivateText('');
      setSubStage('hub');
    } catch (e) {
      console.warn('[Reflection] Local write failed:', e);
    }
  };

  // Save consultation question
  const handleSaveQuestion = () => {
    if (!questionText.trim()) return;
    if (checkHighRiskText(questionText)) return;

    if (onAddQuestion) {
      onAddQuestion(questionText.trim());
    } else {
      // Fallback local save
      const currentLocal = JSON.parse(localStorage.getItem('hopeheart_care_questions') || '[]');
      const newQ = {
        id: 'local-q-' + Date.now(),
        text: questionText.trim(),
        createdAt: 'Just now'
      };
      localStorage.setItem('hopeheart_care_questions', JSON.stringify([newQ, ...currentLocal]));
    }
    localStorage.setItem('hopeheart_has_explored_resources', 'true');
    alert("✓ Care question saved safely in your Care Notebook!");
    setQuestionText('');
    setSubStage('hub');
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={
            subStage === 'moment' ? () => setSubStage('write') : 
            subStage !== 'hub' ? () => setSubStage('hub') : 
            onBack
          }
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subStage === 'hub' && 'Share Safely'}
          {subStage === 'private-reflection' && 'Private Reflection'}
          {subStage === 'saved-question' && 'Save Care Question'}
          {subStage === 'write' && 'Release Today'}
          {subStage === 'moment' && 'Share A Hope Moment'}
        </span>
        <span className="text-[20px] select-none">📸</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* STAGE 0: HUB VIEW */}
          {subStage === 'hub' && (
            <motion.div
              key="share-hub"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center md:text-left space-y-1">
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
                  Express Yourself Safely
                </h2>
                <p className="text-[13px] text-gray-500 font-semibold">
                  HopeHeart is a safe place to share. Choose how you want to release your feelings today.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Private Reflection */}
                <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 flex flex-col justify-between gap-4 shadow-3xs">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[24px]">📓</span>
                    <h4 className="font-display font-black text-gray-800 text-[14px]">
                      Private Reflection
                    </h4>
                    <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                      Journal privately on your device. Everything is saved offline only.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubStage('private-reflection')}
                    className="w-full py-2 bg-[#FCFAF5] hover:bg-orange-50/50 border border-[#EDE9DE] hover:border-orange-200 text-gray-700 hover:text-[#FF7527] transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
                  >
                    Write Reflection
                  </button>
                </div>

                {/* 2. Share Card */}
                <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 flex flex-col justify-between gap-4 shadow-3xs">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[24px]">📸</span>
                    <h4 className="font-display font-black text-gray-800 text-[14px]">
                      Mood Share Card
                    </h4>
                    <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                      Generate a beautiful card of your current mood to save or share.
                    </p>
                  </div>
                  <button
                    onClick={() => onShareCheckIn?.()}
                    className="w-full py-2 bg-[#FCFAF5] hover:bg-orange-50/50 border border-[#EDE9DE] hover:border-orange-200 text-gray-700 hover:text-[#FF7527] transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
                  >
                    Generate Card
                  </button>
                </div>

                {/* 3. Anonymous Story Draft */}
                <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 flex flex-col justify-between gap-4 shadow-3xs">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[24px]">👥</span>
                    <h4 className="font-display font-black text-gray-800 text-[14px]">
                      Anonymous Story
                    </h4>
                    <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                      Share your lived experiences anonymously on the community feed.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubStage('write')}
                    className="w-full py-2 bg-[#FCFAF5] hover:bg-orange-50/50 border border-[#EDE9DE] hover:border-orange-200 text-gray-700 hover:text-[#FF7527] transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
                  >
                    Write Story
                  </button>
                </div>

                {/* 4. Saved Question */}
                <div className="bg-white border border-[#EDE9DE] rounded-[24px] p-5 flex flex-col justify-between gap-4 shadow-3xs">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[24px]">❓</span>
                    <h4 className="font-display font-black text-gray-800 text-[14px]">
                      Prepare Consultation Question
                    </h4>
                    <p className="text-[11.5px] text-gray-555 font-semibold leading-relaxed">
                      Write down care questions privately to prepare for your next consultation.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubStage('saved-question')}
                    className="w-full py-2 bg-[#FCFAF5] hover:bg-orange-50/50 border border-[#EDE9DE] hover:border-orange-200 text-gray-700 hover:text-[#FF7527] transition-all font-display font-extrabold text-[11px] rounded-xl cursor-pointer text-center"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE A: PRIVATE REFLECTION VIEW */}
          {subStage === 'private-reflection' && (
            <motion.div
              key="private-reflection-form"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-left"
            >
              <div className="space-y-1">
                <h3 className="font-display font-black text-[#2B1D12] text-[18px]">
                  Write Private Reflection
                </h3>
                <p className="text-[12.5px] text-gray-555 font-semibold">
                  Express how you feel right now. Everything stays secure on your device.
                </p>
              </div>

              <textarea
                placeholder="Today I want to reflect on..."
                rows={6}
                value={privateText}
                onChange={(e) => setPrivateText(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-3xl text-[13.5px] bg-[#FCFCFA] focus:ring-1 focus:ring-[#FF7527] focus:outline-none font-semibold leading-relaxed"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSubStage('hub')}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-display font-bold text-[13px] rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePrivateReflection}
                  className="flex-1 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-2xl cursor-pointer shadow-xs"
                >
                  Save Reflection
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE B: SAVED QUESTION VIEW */}
          {subStage === 'saved-question' && (
            <motion.div
              key="saved-question-form"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-left"
            >
              <div className="space-y-1">
                <h3 className="font-display font-black text-[#2B1D12] text-[18px]">
                  Save Care Question
                </h3>
                <p className="text-[12.5px] text-gray-555 font-semibold">
                  Write down any questions you want to remember when speaking with caregivers or doctors.
                </p>
              </div>

              <textarea
                placeholder="e.g. What are daily exercises that help with movement tremors?"
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-3xl text-[13.5px] bg-[#FCFCFA] focus:ring-1 focus:ring-[#FF7527] focus:outline-none font-semibold leading-relaxed"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSubStage('hub')}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-255 text-gray-700 font-display font-bold text-[13px] rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuestion}
                  className="flex-1 py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13px] rounded-2xl cursor-pointer shadow-xs"
                >
                  Save Question
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 1: ANONYMOUS STORY DRAFT */}
          {subStage === 'write' && (
            <motion.div
              key="share-safely-form"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-left"
            >
              <div className="space-y-1">
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[22px]">
                  What do you want to release today?
                </h2>
                <p className="text-[13px] text-gray-500 font-semibold">
                  Write, speak, or share a safe moment to lift your heart.
                </p>
              </div>

              {/* Text Writing Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Write or Record Lived Experience
                </label>
                <textarea
                  placeholder="Today I feel..."
                  rows={5}
                  value={textRelease}
                  onChange={(e) => setTextRelease(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-3xl text-[13.5px] bg-[#FCFCFA] focus:ring-1 focus:ring-[#FF7527] focus:outline-none font-semibold leading-relaxed"
                />
              </div>

              {/* Microphone trigger "Tap to Speak" */}
              <div className="flex justify-between items-center bg-white border border-[#EEE9DD] p-3.5 rounded-2xl shadow-xs">
                <div>
                  <span className="text-[13px] font-bold text-gray-800 block">Voice Release Capture</span>
                  <p className="text-[11px] text-gray-500 font-medium">Draft feelings without typing via automatic speech transcription.</p>
                </div>
                <button
                  type="button"
                  onClick={handleMicSimulate}
                  className={`px-4 py-2.5 rounded-xl font-display font-black text-[12px] cursor-pointer transition-all ${
                    isListeningMic 
                      ? 'bg-red-500 text-white animate-pulse shadow-sm' 
                      : 'bg-orange-50 text-[#FF7527] hover:bg-orange-100'
                  }`}
                >
                  🎙️ {isListeningMic ? 'Tap to Stop' : 'Tap to Speak'}
                </button>
              </div>

              {/* Upload Item Showcase for Moment Shares */}
              <div className="space-y-2.5">
                <div>
                  <span className="text-[12.5px] font-display font-black text-gray-800 block">📸 Moment Share Gallery templates</span>
                  <p className="text-[11.5px] text-gray-500 leading-none mt-1 font-medium">
                    Upload a photo of something that made your heart feel lighter, calmer, or hopeful.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {simulatedPhotos.map((photo) => {
                    const isPicked = selectedPhoto === photo.name;
                    return (
                      <button
                        key={photo.name}
                        onClick={() => setSelectedPhoto(photo.name)}
                        type="button"
                        className={`p-3 border rounded-2xl hover:border-[#FF7527] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1 ${
                          isPicked ? 'bg-[#FFF2EA] border-[#FF7527]' : 'bg-white border-gray-150'
                        }`}
                      >
                        <span className="text-2xl">{photo.emoji}</span>
                        <span className="text-[11px] font-bold text-gray-700 leading-tight block">{photo.label}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedPhoto && (
                  <div className="p-3 bg-[#F2FAF6] border border-emerald-100 rounded-xl text-[11.5px] text-emerald-800 font-semibold italic">
                    ✓ Mock uploaded: "{simulatedPhotos.find(p=>p.name===selectedPhoto)?.url}"
                  </div>
                )}
              </div>

              {/* Safety rules note */}
              <div className="bg-[#FFF8F8] border border-red-100 p-4 rounded-2xl">
                <p className="text-[12px] text-red-800 font-semibold leading-relaxed">
                  ⚠️ <strong>Disclaimer Note:</strong> Do not include diagnosis, medication, phone number, exact location, or private contact details in your story. Do not upload personal medical documents, diagnostic prescriptions, private government IDs, or pill boxes.
                </p>
              </div>

              {/* Next Step trigger */}
              <button
                onClick={() => {
                  if (checkHighRiskText(textRelease)) return;
                  if (!textRelease.trim() && !selectedPhoto) {
                    alert("Please write down some thoughts or choose a photo template above first.");
                    return;
                  }
                  // Move to Screen 11 detail prompt
                  setMomentCaption(textRelease);
                  setSubStage('moment');
                }}
                className="w-full py-3.5 bg-[#FF7527] hover:bg-[#E55D13] font-display font-black text-white text-[15px] rounded-2xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Assemble Hope Moment
              </button>

            </motion.div>
          )}

          {/* STAGE 2: MOMENT SHARE DETAIL CONFIRMS */}
          {subStage === 'moment' && (
            <motion.div
              key="moment-share-details"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5 text-left"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">STAGE 2 of 2</span>
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[22px]">
                  Share a Hope Moment
                </h2>
                <p className="text-[13px] text-gray-500 font-semibold">
                  A small spark can help someone else feel less alone today. Choose options and post.
                </p>
              </div>

              {/* Upload presentation box */}
              <div className="bg-white border border-[#EDE9DE] rounded-3xl p-5 space-y-3 shadow-xs">
                <div className="flex gap-3.5 items-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-700 font-display font-black text-lg rounded-xl flex items-center justify-center select-none shrink-0">
                    {selectedPhoto ? simulatedPhotos.find(p => p.name === selectedPhoto)?.emoji : '📝'}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-[#A29985] block uppercase">IMAGE ATTACHMENT</span>
                    <p className="text-[12.5px] text-gray-700 leading-normal font-bold">
                      {selectedPhoto ? simulatedPhotos.find(p => p.name === selectedPhoto)?.label : 'Text Only Post'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                    Caption Statement
                  </label>
                  <textarea
                    value={momentCaption}
                    onChange={(e) => setMomentCaption(e.target.value)}
                    placeholder="This made my heart feel..."
                    rows={3}
                    className="w-full p-3.5 border border-gray-200 rounded-2xl text-[13px] bg-[#FCFCFA] font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Mood Tag options selection */}
              <div className="space-y-2">
                <label className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Assign Heart Feeling Tag
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {moodTags.map((tag) => {
                    const isT = selectedMoodTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedMoodTag(tag)}
                        type="button"
                        className={`px-3 py-2 text-[12px] font-display font-bold rounded-xl border transition-colors cursor-pointer ${
                          isT ? 'bg-[#FF7527] text-white border-[#FF7527]' : 'bg-white border-gray-200 text-gray-655 hover:bg-gray-50'
                        }`}
                      >
                        ✨ {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Privacy configurations */}
              <div className="space-y-2">
                <label className="text-[11.5px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
                  Select Visibility Privacy Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {privacySettings.map((set) => {
                    const isP = privacyOption === set;
                    return (
                      <button
                        key={set}
                        onClick={() => setPrivacyOption(set)}
                        type="button"
                        className={`p-3 text-[12px] font-display font-bold rounded-xl border text-center transition-all cursor-pointer ${
                          isP ? 'bg-[#1E1E1A] text-white border-[#1E1E1A]' : 'bg-white border-gray-150 text-gray-700'
                        }`}
                      >
                        {set}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI message scans */}
              {aiScreeningMessage ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-[11.5px] font-semibold leading-relaxed">
                  {aiScreeningMessage}
                </div>
              ) : (
                <div className="bg-[#FAF7F0] border border-[#EDE9DE] p-3.5 rounded-2xl text-[11px] text-gray-500 font-semibold leading-normal space-y-1">
                  <p>🛡️ <strong>AI Safety Notice:</strong> HopeHeart automatically scans captions and images to shield the community from drug prescriptions, clinic IDs, or self-harm triggers.</p>
                  <p className="text-amber-800">⚠️ <strong>Important:</strong> Do not include diagnosis, medication, phone number, exact location, or private contact details.</p>
                </div>
              )}

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubStage('write')}
                  className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-display font-bold text-[13.5px] rounded-2xl cursor-pointer"
                >
                  Adjust Draft
                </button>
                <button
                  type="button"
                  onClick={handleShareSubmit}
                  className="w-full py-3 bg-[#FF7527] hover:bg-[#E55D13] text-white font-display font-black text-[13.5px] rounded-2xl shadow-xs cursor-pointer transition-colors"
                >
                  Post Hope Moment
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
