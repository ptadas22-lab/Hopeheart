import { motion } from 'motion/react';
import { MascotFace } from './Logo';

interface FinancialsScreenProps {
  onBack: () => void;
}

export default function FinancialsScreen({ onBack }: FinancialsScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button 
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[16px] uppercase tracking-tight">
          Service Model & Financials
        </span>
        <MascotFace size={26} className="shrink-0" />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Main Title & Subtitle */}
          <div className="text-center md:text-left space-y-1.5">
            <span className="text-[11px] font-mono font-extrabold text-[#FF7527] uppercase tracking-wider block">
              MVP Founder Pitch
            </span>
            <h2 className="font-display font-black text-[#2B1D12] text-[22px] md:text-[26px] leading-tight">
              Service Model & Financials
            </h2>
            <p className="text-[13.5px] text-gray-500 font-semibold leading-relaxed">
              How HopeHeart can stay accessible while building a sustainable emotional-support ecosystem.
            </p>
          </div>

          {/* Section 1: Free Core Services */}
          <div className="hh-surface rounded-3xl p-5 md:p-6 space-y-4">
            <h4 className="font-display font-black text-gray-800 text-[15px] border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
              <span>🎁</span> Free Core Services
            </h4>
            <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
              The foundational support pillars of HopeHeart always remain 100% free and open for everyone.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { name: 'Daily emotional check-in', icon: '🩺' },
                { name: 'HopeBuddy support guidance', icon: '🧡' },
                { name: 'Basic peer support rooms', icon: '💬' },
                { name: 'Safe listener discovery', icon: '🤝' },
                { name: 'Personal stories', icon: '📖' },
                { name: 'Saved care questions', icon: '❓' },
                { name: 'Basic external resources', icon: '🌐' }
              ].map((srv, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF9] border border-[#EDE9DE]/50 rounded-xl text-[12px] text-gray-700 font-bold shadow-3xs"
                >
                  <span>{srv.icon}</span>
                  <span>{srv.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Revenue Streams */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-gray-800 text-[15px] px-1 flex items-center gap-1.5">
              <span>💼</span> Revenue Streams
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  title: 'Verified Professional Listings',
                  text: 'Clinics, counsellors, therapists, NGOs, and wellness groups can pay for verified visibility inside external support resources.',
                  price: '₹499/month per listing',
                  badgeColor: 'bg-orange-50 text-[#FF7527] border-orange-100',
                  icon: '🎫'
                },
                {
                  title: 'Premium User Tools',
                  text: 'Optional premium features such as private journaling, mood history, saved care questions, advanced privacy controls, and priority support circles.',
                  price: '₹99/month',
                  badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
                  icon: '🛠️'
                },
                {
                  title: 'Institution Partnerships',
                  text: 'Colleges, NGOs, senior-care communities, and wellness organizations can use HopeHeart for group emotional-support access.',
                  price: '₹5,000/month per institution',
                  badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
                  icon: '🏢'
                },
                {
                  title: 'Referral / Booking Fee',
                  text: 'HopeHeart may earn a small service fee when users choose verified external professionals.',
                  price: '10% platform fee',
                  badgeColor: 'bg-emerald-50 text-emerald-805 border-emerald-100',
                  icon: '🤝'
                }
              ].map((stream, idx) => (
                <div key={idx} className="hh-surface rounded-2.5xl p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stream.icon}</span>
                      <h5 className="font-display font-black text-gray-800 text-[14px] leading-tight">
                        {stream.title}
                      </h5>
                    </div>
                    <p className="text-[12px] text-gray-500 font-semibold leading-relaxed">
                      {stream.text}
                    </p>
                  </div>
                  <div className={`mt-2 px-3 py-1.5 border rounded-xl text-[11px] font-mono font-black tracking-wide text-center uppercase ${stream.badgeColor}`}>
                    MVP assumptions for validation: {stream.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: User Earning Model */}
          <div className="hh-surface rounded-3xl p-5 md:p-6 space-y-4">
            <h4 className="font-display font-black text-gray-800 text-[15px] border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
              <span>✨</span> Verified Listener Program
            </h4>
            <p className="text-[12.5px] text-gray-500 font-semibold leading-relaxed">
              Trusted users can apply to become verified listeners or community hosts, opening opportunities for safe, community-driven micro-earnings.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: 'Paid emotional listening sessions', icon: '🎧' },
                { name: 'Support circle hosting', icon: '👥' },
                { name: 'Story contribution rewards', icon: '✍️' },
                { name: 'Community moderation rewards', icon: '🛡️' }
              ].map((earn, idx) => (
                <div key={idx} className="p-3 bg-[#FFFDF9] border border-[#EDE9DE]/50 rounded-2xl flex items-center gap-2">
                  <span className="text-lg shrink-0">{earn.icon}</span>
                  <span className="text-[11.5px] text-gray-750 font-extrabold leading-tight">{earn.name}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-50/50 border border-red-100 rounded-2.5xl">
              <span className="text-[10px] font-mono font-black text-red-750 block uppercase tracking-wider mb-1">
                Strict Safety Rule
              </span>
              <p className="text-[11.5px] text-red-800 font-bold leading-normal">
                Verified listeners provide emotional support only. They cannot diagnose, prescribe, suggest dosage, promise cure, or give treatment instructions.
              </p>
            </div>
          </div>

          {/* Section 4: Cost Structure */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-gray-800 text-[15px] px-1 flex items-center gap-1.5">
              <span>📊</span> Cost Structure
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Hosting', icon: '☁️' },
                { name: 'Database / storage', icon: '💾' },
                { name: 'Safety moderation', icon: '⚖️' },
                { name: 'Professional verification', icon: '🔑' },
                { name: 'Community operations', icon: '⚙️' },
                { name: 'Design and development', icon: '✏️' }
              ].map((cost, idx) => (
                <div key={idx} className="hh-surface rounded-2xl p-3 text-center space-y-1.5 flex flex-col items-center justify-center">
                  <span className="text-xl block">{cost.icon}</span>
                  <span className="text-[11.5px] text-gray-700 font-extrabold leading-tight">{cost.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: MVP Financial Assumptions */}
          <div className="hh-surface rounded-3xl p-5 md:p-6 space-y-3.5">
            <h4 className="font-display font-black text-gray-800 text-[15px] border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
              <span>📝</span> MVP Financial Assumptions
            </h4>
            <div className="space-y-2.5">
              {[
                { item: 'Premium plan', val: '₹99/month' },
                { item: 'Professional listing', val: '₹499/month' },
                { item: 'Institution plan', val: '₹5,000/month' },
                { item: 'Platform fee on paid support sessions', val: '10%' }
              ].map((asm, idx) => (
                <div key={idx} className="flex justify-between items-center text-[12.5px] border-b border-gray-100/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500 font-semibold">{asm.item}</span>
                  <span className="font-mono font-black text-gray-800">{asm.val}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-center">
              <span className="text-[10.5px] font-semibold text-amber-900 leading-normal block">
                ⚠️ These are MVP assumptions for validation and may change after user testing.
              </span>
            </div>
          </div>

          {/* Section 6: Ethical Guardrails */}
          <div className="hh-surface rounded-3xl p-5 md:p-6 space-y-4">
            <h4 className="font-display font-black text-gray-800 text-[15px] border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
              <span>🛡️</span> Ethical Guardrails
            </h4>
            <ul className="space-y-2.5">
              {[
                'Free emotional support remains available',
                'No payment for medical advice',
                'No selling diagnosis, treatment, prescriptions, or cure claims',
                'No off-platform payment requests',
                'Users must not share phone numbers or personal payment details in community spaces',
                'Paid listener features require verification and safety rules'
              ].map((rule, idx) => (
                <li key={idx} className="text-[12.5px] text-gray-600 font-semibold flex items-start gap-2">
                  <span className="text-[#FF7527] font-bold mt-0.5">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <div className="p-3 bg-[#FFFDF9] border border-gray-200/50 rounded-xl">
              <p className="text-[10.5px] text-gray-500 font-bold text-center leading-normal">
                Private local storage in MVP. Secure encrypted storage planned for production.
              </p>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <p className="text-[10.5px] text-gray-450 font-semibold leading-relaxed text-center italic max-w-[420px] mx-auto pt-4 pb-6 border-t border-gray-200/50">
            HopeHeart provides emotional support only. It does not diagnose, treat, prescribe, or replace professional medical care.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
