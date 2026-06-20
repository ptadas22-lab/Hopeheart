import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareSafelyScreenProps {
  onBack: () => void;
  onPostSuccess: () => void;
}

export default function ShareSafelyScreen({ onBack, onPostSuccess }: ShareSafelyScreenProps) {
  const [subStage, setSubStage] = useState<'write' | 'moment'>('write');
  
  // Custom states
  const [textRelease, setTextRelease] = useState<string>('');
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  
  // Moment Share metadata 
  const [momentCaption, setMomentCaption] = useState<string>('');
  const [selectedMoodTag, setSelectedMoodTag] = useState<string>('Hopeful');
  const [privacyOption, setPrivacyOption] = useState<string>('Share anonymously');
  const [aiScreeningMessage, setAiScreeningMessage] = useState<string>('');
  
  const moodTags = ['Calm', 'Hopeful', 'Heavy', 'Lonely', 'Healing', 'Grateful'];
  const privacySettings = ['Share anonymously', 'Keep private', 'Share with support room'];

  // Preset warm image templates to simulate upload moments beautifully
  const simulatedPhotos = [
    { name: 'cup_of_tea', emoji: '🍵', label: 'Warm Cup of Tea', url: 'A steaming cup of lavender tea under gentle sunlight.' },
    { name: 'garden_walk', emoji: '🌳', label: 'Walk Outside', url: 'Crisp green leaves and a quiet muddy trail in the woods.' },
    { name: 'small_doodle', emoji: '🎨', label: 'Crayon Drawing', url: 'A cozy orange heart with little protective hands holding it.' },
    { name: 'peaceful_lake', emoji: '🌅', label: 'Quiet Sunset', url: 'Soft lavender pink skies reflecting off fresh calm lake water.' }
  ];

  const handleMicSimulate = () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      setTextRelease(prev => prev + " [Voice-to-text: I did a slow 5-minute breathing walk and noticed dry pinecones in the soil. It helped me ground.]");
    } else {
      setIsListeningMic(true);
    }
  };

  const handleShareSubmit = () => {
    // Show automated image scanning disclaimer
    setAiScreeningMessage('🛡️ HopeHeart Safe AI is scanning your moment image... Clear of prescriptions/IDs! Approved.');
    setTimeout(() => {
      alert("Hope Moment Posted Safely! Thank you for sharing a spark of light.");
      onPostSuccess();
    }, 1800);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FCFAF5] font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 border-b border-[#E9E4D9] bg-white sticky top-0 z-20 shadow-xs">
        <button 
          onClick={subStage === 'moment' ? () => setSubStage('write') : onBack}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          {subStage === 'write' ? 'Release Today' : 'Share A Hope Moment'}
        </span>
        <span className="text-[20px] select-none">📸</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          
          {/* STAGE 10: SHARE SAFELY FORM */}
          {subStage === 'write' && (
            <motion.div
              key="share-safely-form"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center md:text-left space-y-1">
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
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
                  ⚠️ <strong>Disclaimer Note:</strong> Do not upload personal medical documents, diagnostic prescriptions, private government IDs, pill boxes, or unsafe contact details.
                </p>
              </div>

              {/* Next Step trigger */}
              <button
                onClick={() => {
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

          {/* STAGE 11: MOMENT SHARE DETAIL CONFIRMS */}
          {subStage === 'moment' && (
            <motion.div
              key="moment-share-details"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="text-center md:text-left space-y-1">
                <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">STAGE 2 of 2</span>
                <h2 className="font-display font-black text-[#2B1D12] text-[20px] md:text-[24px]">
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
                          isT ? 'bg-[#FF7527] text-white border-[#FF7527]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
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
                <div className="bg-[#FAF7F0] border border-[#EDE9DE] p-3.5 rounded-2xl text-[11px] text-gray-500 font-semibold leading-normal">
                  🛡️ <strong>AI Safety Notice:</strong> HopeHeart automatically scans captions and images to shield the community from drug prescriptions, clinic IDs, or self-harm triggers.
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
