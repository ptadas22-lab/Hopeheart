import { motion } from 'motion/react';
import { MascotFace } from './Logo';

interface FinancialsScreenProps {
  onBack: () => void;
}

const freeCoreServices = [
  { label: 'Daily mood check-in', icon: '😊' },
  { label: 'HopeBuddy support', icon: '💬' },
  { label: 'Basic support rooms', icon: '👥' },
  { label: 'Safe listener discovery', icon: '🛡️' },
  { label: 'Personal stories', icon: '📖' },
  { label: 'Basic resources', icon: '📋' }
];

const revenueStreams = [
  { title: 'Verified Professional Listings', text: 'Monthly plans', icon: '💼', bg: 'bg-orange-50' },
  { title: 'Premium User Tools', text: 'Optional add-ons', icon: '⭐', bg: 'bg-purple-50' },
  { title: 'Institution Partnerships', text: 'Subscription plans', icon: '🏛️', bg: 'bg-blue-50' },
  { title: 'Referral / Booking Fee', text: 'Small service fee', icon: '🤝', bg: 'bg-green-50' }
];

const mvpAssumptions = [
  { label: 'Premium', value: '₹99/month' },
  { label: 'Professional listing', value: '₹499/month' },
  { label: 'Institution', value: '₹5,000/month' },
  { label: 'Booking fee', value: '10%' }
];

const costs = [
  { label: 'Hosting', icon: '☁️' },
  { label: 'Database', icon: '🗄️' },
  { label: 'Moderation', icon: '🛡️' },
  { label: 'Verification', icon: '✅' },
  { label: 'Operations', icon: '👥' },
  { label: 'Design', icon: '✏️' }
];

const ethicalGuardrails = [
  'Free emotional support remains available',
  'No diagnosis, prescriptions, or cure claims',
  'No selling user emotional data',
  'No off-platform payment requests',
  'Paid listeners must follow safety rules'
];

export default function FinancialsScreen({ onBack }: FinancialsScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-transparent font-sans select-none w-full">
      <div className="flex items-center justify-between py-3.5 px-5 hh-header-surface sticky top-0 z-20">
        <button
          onClick={onBack}
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#E9E4D9] rounded-full hover:bg-gray-50 text-[#2B1D12] cursor-pointer transition-all active:scale-95 shadow-3xs"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 stroke-current cursor-pointer" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="font-display font-extrabold text-[#2B1D12] text-[15px] uppercase tracking-tight text-center">
          How HopeHeart Stays Free
        </span>
        <MascotFace size={26} className="shrink-0" />
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <section className="space-y-2 pt-1">
            <h2 className="font-display font-black text-[#2B1D12] text-[24px] md:text-[30px] leading-tight">
              How HopeHeart Stays Free
            </h2>
            <p className="text-[14px] md:text-[15px] text-gray-550 font-semibold leading-relaxed max-w-xl">
              Core emotional support stays free. Optional verified services help sustain the platform.
            </p>
          </section>

          <section className="hh-surface rounded-[30px] p-5 md:p-6 space-y-4">
            <h3 className="font-display font-black text-gray-850 text-[18px] flex items-center gap-2 border-b border-orange-100 pb-3">
              <span className="text-[#FF7527]">🧡</span> Free Core Services
            </h3>
            <div className="divide-y divide-orange-100/70">
              {freeCoreServices.map((service) => (
                <div key={service.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[15px] shrink-0">
                    {service.icon}
                  </span>
                  <span className="text-[14px] md:text-[15px] text-gray-750 font-bold">
                    {service.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-display font-black text-gray-850 text-[17px] flex items-center gap-2 px-1">
              <span className="text-[#FF7527]">◇</span> Revenue Streams
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {revenueStreams.map((stream) => (
                <article key={stream.title} className="hh-surface rounded-[24px] p-4 min-h-[142px] flex flex-col items-center justify-center text-center gap-2.5">
                  <span className={`w-13 h-13 rounded-full ${stream.bg} border border-white flex items-center justify-center text-[24px] shadow-3xs`}>
                    {stream.icon}
                  </span>
                  <h4 className="font-display font-black text-gray-850 text-[13px] leading-tight">
                    {stream.title}
                  </h4>
                  <p className="text-[11.5px] text-gray-500 font-semibold">
                    {stream.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="hh-surface rounded-[28px] p-5 space-y-4">
              <h3 className="font-display font-black text-gray-850 text-[17px] flex items-center gap-2">
                <span className="text-[#FF7527]">📊</span> MVP Assumptions
              </h3>
              <div className="space-y-2.5">
                {mvpAssumptions.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-[13px] text-gray-550 font-semibold">{item.label}</span>
                    <span className="text-[13px] text-gray-850 font-black whitespace-nowrap">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="hh-surface rounded-[28px] p-5 space-y-4">
              <h3 className="font-display font-black text-gray-850 text-[17px] flex items-center gap-2">
                <span className="text-[#FF7527]">💳</span> Cost Structure
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {costs.map((cost) => (
                  <div key={cost.label} className="bg-white/65 border border-gray-100 rounded-2xl p-3 text-center space-y-1.5">
                    <span className="text-[20px] block">{cost.icon}</span>
                    <span className="text-[11px] text-gray-650 font-bold leading-tight block">{cost.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="hh-surface rounded-[30px] p-5 md:p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 flex-1">
                <h3 className="font-display font-black text-gray-850 text-[18px] flex items-center gap-2">
                  <span className="text-[#FF7527]">🛡️</span> Ethical Guardrails
                </h3>
                <ul className="space-y-2.5">
                  {ethicalGuardrails.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-[13px] md:text-[14px] text-gray-650 font-semibold leading-relaxed">
                      <span className="text-[#FF7527] mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden sm:flex w-28 h-28 rounded-[32px] bg-orange-50 border border-orange-100 items-center justify-center shrink-0">
                <MascotFace size={72} />
              </div>
            </div>
          </section>

          <section className="bg-white/80 border border-orange-100 rounded-[26px] p-4 md:p-5 flex items-start gap-3 shadow-3xs">
            <span className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF7527] shrink-0">
              🧡
            </span>
            <p className="text-[13px] md:text-[14px] text-gray-650 font-semibold leading-relaxed">
              HopeHeart provides emotional support only and does not diagnose, treat, prescribe, or replace professional medical care.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
