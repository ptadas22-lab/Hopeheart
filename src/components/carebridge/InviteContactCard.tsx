import React from 'react';

export default function InviteContactCard() {
  const inviteText = "Hi! I've invited you to be part of my HopeHeart support circle. We can share safety plans and checks privately: https://hopeheart.app/join/carebridge";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteText)
      .then(() => alert('Invitation copied to clipboard safely. You can send it to your trusted contact via text or chat.'))
      .catch(() => alert('Failed to copy.'));
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-200">
      <h3 className="font-display font-black text-[#2B1D12] text-[16px] uppercase tracking-tight border-b border-gray-150 pb-2">
        Invite Trusted Contact
      </h3>

      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFFBF0] border border-[#F1E7D8]/80 rounded-[28px] p-5.5 space-y-4 shadow-3xs">
        <span className="text-[10px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block leading-none">
          Message Preview
        </span>
        
        <div className="bg-white border border-[#EDE9DE] rounded-2xl p-4 text-[13px] text-gray-700 font-semibold leading-relaxed relative">
          <div className="absolute right-3.5 top-3.5 text-[15px] select-none">💬</div>
          "{inviteText}"
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:flex-1 py-3 bg-[#FF7527] hover:bg-[#E96630] text-white rounded-2xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 shadow-3xs flex items-center justify-center gap-1.5"
          >
            <span>📋</span> Copy Invitation
          </button>
          <a
            href={`sms:?&body=${encodeURIComponent(inviteText)}`}
            className="w-full sm:flex-1 py-3 bg-[#2B1D12] hover:bg-black text-white rounded-2xl text-[12.5px] font-display font-black cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>📱</span> Send SMS
          </a>
        </div>
      </div>
    </div>
  );
}
