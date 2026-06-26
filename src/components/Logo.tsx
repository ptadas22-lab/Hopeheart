import React from 'react';

// Mascot Face SVG Component
export function MascotFace({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ears */}
      <path
        d="M 28 28 C 24 16, 44 14, 48 26 Z"
        fill="url(#mascotGrad)"
        stroke="#2B1D12"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M 72 28 C 76 16, 56 14, 52 26 Z"
        fill="url(#mascotGrad)"
        stroke="#2B1D12"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Main Round Body */}
      <rect
        x="18"
        y="24"
        width="64"
        height="56"
        rx="26"
        fill="url(#mascotGrad)"
        stroke="#2B1D12"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cover inner ear lines */}
      <rect
        x="20"
        y="26"
        width="60"
        height="52"
        rx="24"
        fill="url(#mascotGrad)"
      />

      {/* White heart on forehead */}
      <path
        d="M 50 40 L 52.5 37.5 A 2 2 0 0 1 55.5 40.5 L 50 46 L 44.5 40.5 A 2 2 0 0 1 47.5 37.5 Z"
        fill="#FCFAF5"
        stroke="#2B1D12"
        strokeWidth="1.5"
      />

      {/* Happy happy eyes (curved arcs) */}
      <path d="M 32 54 C 34 49, 42 49, 44 54" stroke="#2B1D12" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 56 54 C 58 49, 66 49, 68 54" stroke="#2B1D12" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Rosy salmon cheeks */}
      <circle cx="28" cy="62" r="5" fill="#FFA39E" opacity="0.9" />
      <circle cx="72" cy="62" r="5" fill="#FFA39E" opacity="0.9" />

      {/* Happy high smile */}
      <path d="M 46 64 C 48 67, 52 67, 54 64" stroke="#2B1D12" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      <defs>
        <linearGradient id="mascotGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA14E" />
          <stop offset="100%" stopColor="#FF621E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Full Waving Mascot SVG
export function MascotWaving({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wavingMascotGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA14E" />
          <stop offset="100%" stopColor="#FF621E" />
        </linearGradient>
      </defs>

      {/* Feet & Legs */}
      <line x1="52" y1="102" x2="52" y2="118" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 42 118 C 42 114, 62 114, 62 118 C 62 122, 42 122, 42 118" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" />

      <line x1="88" y1="102" x2="88" y2="118" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 78 118 C 78 114, 98 114, 98 118 C 98 122, 78 122, 78 118" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" />

      {/* Right Arm (resting on side) */}
      <path d="M 98 75 C 104 75, 108 85, 106 91" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Left Waving Arm */}
      <path d="M 42 75 C 32 72, 24 64, 25 56" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      
      {/* Yellow waving hand */}
      <g transform="translate(18, 42)">
        {/* Palm */}
        <circle cx="7" cy="8" r="4.5" fill="#FED25A" stroke="#2B1D12" strokeWidth="2" />
        {/* Fingers */}
        <path d="M 3 6 L 1 1" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 6 4 L 5 0" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 10 5 L 11 1" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 12 9 L 16 7" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 2 11 L -2 12" stroke="#2B1D12" strokeWidth="2" strokeLinecap="round" />
        {/* Color fill on fingers */}
        <line x1="7" y1="8" x2="2.5" y2="3" stroke="#FED25A" strokeWidth="2" />
        <line x1="7" y1="8" x2="5.5" y2="2" stroke="#FED25A" strokeWidth="2" />
        <line x1="7" y1="8" x2="10.5" y2="3" stroke="#FED25A" strokeWidth="2" />
      </g>

      {/* Ears */}
      <path d="M 50 32 C 45 16, 68 14, 74 28 C 74 28 74 28 74 28" fill="url(#wavingMascotGrad)" stroke="#2B1D12" strokeWidth="4" strokeLinejoin="round" />
      <path d="M 90 32 C 95 16, 72 14, 66 28 L 66 28" fill="url(#wavingMascotGrad)" stroke="#2B1D12" strokeWidth="4" strokeLinejoin="round" />

      {/* Main Oval Body */}
      <rect x="36" y="28" width="68" height="76" rx="28" fill="url(#wavingMascotGrad)" stroke="#2B1D12" strokeWidth="4" />

      {/* ear overlay repair */}
      <rect x="38" y="30" width="64" height="72" rx="26" fill="url(#wavingMascotGrad)" />

      {/* White heart forehead badge */}
      <path d="M 70 42 L 73 39 A 2.2 2.2 0 0 1 76.5 42.5 L 70 49 L 63.5 42.5 A 2.2 2.2 0 0 1 67 39 Z" fill="#FCFAF5" stroke="#2B1D12" strokeWidth="1.8" />

      {/* Face */}
      {/* Happy Closed eyes */}
      <path d="M 51 58 Q 55 52 59 58" fill="none" stroke="#2B1D12" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M 77 58 Q 81 52 85 58" fill="none" stroke="#2B1D12" strokeWidth="3.2" strokeLinecap="round" />
      
      {/* Salmon Cheeks */}
      <circle cx="47" cy="65" r="5.5" fill="#FFA39E" opacity="0.95" />
      <circle cx="89" cy="65" r="5.5" fill="#FFA39E" opacity="0.95" />

      {/* Smiling mouth */}
      <path d="M 64 68 Q 68 72 72 68" fill="none" stroke="#2B1D12" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

// Sitting Mascot holding a white heart
export function MascotSitting({ size = 110, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sittingMascotGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA14E" />
          <stop offset="100%" stopColor="#FF621E" />
        </linearGradient>
      </defs>

      {/* Cute crossed sitting feet */}
      <path d="M 44 104 C 44 104, 38 116, 54 116 C 58 116, 60 108, 60 104" fill="#FED25A" stroke="#2B1D12" strokeWidth="3" />
      <path d="M 96 104 C 96 104, 102 116, 86 116 C 82 116, 80 108, 80 104" fill="#FED25A" stroke="#2B1D12" strokeWidth="3" />

      {/* Ears */}
      <path d="M 50 32 C 45 16, 68 14, 74 28" fill="url(#sittingMascotGrad)" stroke="#2B1D12" strokeWidth="4" />
      <path d="M 90 32 C 95 16, 72 14, 66 28" fill="url(#sittingMascotGrad)" stroke="#2B1D12" strokeWidth="4" />

      {/* Main Oval Body */}
      <rect x="36" y="28" width="68" height="76" rx="28" fill="url(#sittingMascotGrad)" stroke="#2B1D12" strokeWidth="4" />
      <rect x="38" y="30" width="64" height="72" rx="26" fill="url(#sittingMascotGrad)" />

      {/* White heart on forehead */}
      <path d="M 70 42 L 73 39 A 2.2 2.2 0 0 1 76.5 42.5 L 70 49 L 63.5 42.5 A 2.2 2.2 0 0 1 67 39 Z" fill="#FCFAF5" stroke="#2B1D12" strokeWidth="1.8" />

      {/* Happy Closed eyes */}
      <path d="M 51 58 Q 55 52 59 58" fill="none" stroke="#2B1D12" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M 77 58 Q 81 52 85 58" fill="none" stroke="#2B1D12" strokeWidth="3.2" strokeLinecap="round" />
      
      {/* Cheeks */}
      <circle cx="47" cy="65" r="5.5" fill="#FFA39E" opacity="0.95" />
      <circle cx="89" cy="65" r="5.5" fill="#FFA39E" opacity="0.95" />

      {/* Smiling mouth */}
      <path d="M 64 68 Q 68 72 72 68" fill="none" stroke="#2B1D12" strokeWidth="3.2" strokeLinecap="round" />

      {/* Love heart held in front (sitting holding a clean white heart) */}
      <g transform="translate(56, 84)">
        <path d="M 14 20 L 22.5 11 A 6 6 0 0 0 14 2 L 14 20 Z" fill="#FFEFEA" stroke="#2B1D12" strokeWidth="3" />
        <path d="M 14 20 L 5.5 11 A 6 6 0 0 1 14 2 L 14 20 Z" fill="#FFEFEA" stroke="#2B1D12" strokeWidth="3" />
        {/* Core little heart inside */}
        <path d="M 14 14 L 17.5 9.5 A 2.5 2.5 0 0 0 14 5.5 L 14 14 Z" fill="#FF7527" />
        <path d="M 14 14 L 10.5 9.5 A 2.5 2.5 0 0 1 14 5.5 L 14 14 Z" fill="#FF7527" />
      </g>

      {/* Arms holding the white heart */}
      <path d="M 38 84 Q 50 88 56 90" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <path d="M 102 84 Q 90 88 84 90" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BrandWordmark({ size = 'text-[24px]', color = 'text-[#2B1D12]', className = '' }: { size?: string; color?: string; className?: string }) {
  return (
    <span className={`font-heading font-extrabold tracking-tight select-none inline-flex items-center gap-1.5 ${size} ${color} ${className}`}>
      <span>HopeHeart</span>
      <svg className="w-[0.9em] h-[0.82em] shrink-0 translate-y-[0.04em]" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M 10 16.5 L 18.5 7.5 A 5.5 5.5 0 0 0 10 1 L 10 16.5 Z"
          fill="#FF7527"
        />
        <path
          d="M 10 16.5 L 1.5 7.5 A 5.5 5.5 0 0 1 10 1 L 10 16.5 Z"
          fill="#FF7527"
        />
      </svg>
    </span>
  );
}

// PRIMARY LOGO LOCKUP: Mascot waving + HopeHeart text + Tagline
export function PrimaryLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left ${className}`}>
      <MascotWaving size={120} className="shrink-0" />
      <div className="flex flex-col items-center md:items-start space-y-1">
        <BrandWordmark size="text-[34px]" />
        <p className="text-[14px] md:text-[15px] text-gray-500 font-semibold tracking-normal">
          An emotional support community built on trust, empathy, and human connection.
        </p>
      </div>
    </div>
  );
}

// COMPACT BADGE: Mascot sitting above HopeHeart text
export function CompactBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center space-y-1 ${className}`}>
      <MascotSitting size={96} className="shrink-0" />
      <BrandWordmark size="text-[20px]" />
    </div>
  );
}

// Brand App Icon (Mascot face inside a squircle gradient card)
export function AppIcon({ size = 110, className = '' }: { size?: number; className?: string }) {
  return (
    <div 
      className={`rounded-[28px] bg-gradient-to-br from-[#FFF9F2] to-[#FAF3E4] border border-[#ECE0CC] flex items-center justify-center p-4 relative shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <MascotWaving size={size * 0.8} />
    </div>
  );
}

// Clean aesthetic spacer/decoration matching brand-board hearts
export function BrandDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-1 select-none">
      <span className="w-8 h-px bg-[#EADCBE]" />
      <span className="text-[#FF7527] text-xs">🧡</span>
      <span className="w-8 h-px bg-[#EADCBE]" />
    </div>
  );
}
