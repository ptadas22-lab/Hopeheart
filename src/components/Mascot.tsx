interface MascotProps {
  expression: 'calm' | 'anxious' | 'hurt' | 'numb' | 'lonely' | 'need-support';
  size?: number;
  className?: string;
}

export default function Mascot({ expression, size = 180, className = '' }: MascotProps) {
  const isAnxious = expression === 'anxious';
  
  const renderEyes = () => {
    switch (expression) {
      case 'calm':
        return (
          <>
            {/* Open Eyes */}
            <g className="anim-eye-open">
              <path d="M 45 65 A 8 8 0 0 1 61 65" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
              <path d="M 89 65 A 8 8 0 0 1 105 65" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Closed Eyes for Blinking */}
            <g className="anim-eye-closed" style={{ opacity: 0 }}>
              <path d="M 45 66 Q 53 70 61 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
              <path d="M 89 66 Q 97 70 105 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Soft pink cheeks */}
            <circle cx="43" cy="74" r="7" fill="#FFA5A5" opacity="0.8" />
            <circle cx="107" cy="74" r="7" fill="#FFA5A5" opacity="0.8" />
          </>
        );
      case 'anxious':
        return (
          <>
            {/* Wide/worried circular eyes */}
            <g className="anim-eye-open">
              <circle cx="53" cy="65" r="7" fill="#2B1D12" />
              <circle cx="97" cy="65" r="7" fill="#2B1D12" />
              <circle cx="51" cy="63" r="2" fill="white" />
              <circle cx="95" cy="63" r="2" fill="white" />
            </g>
            {/* Closed Eyes for Blinking */}
            <g className="anim-eye-closed" style={{ opacity: 0 }}>
              <path d="M 47 66 Q 53 70 59 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
              <path d="M 91 66 Q 97 70 103 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Worried eyebrows */}
            <path d="M 45 53 Q 55 51 61 56" fill="none" stroke="#2B1D12" strokeWidth="3" strokeLinecap="round" />
            <path d="M 105 53 Q 95 51 89 56" fill="none" stroke="#2B1D12" strokeWidth="3" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="45" cy="74" r="5" fill="#FFA5A5" opacity="0.5" />
            <circle cx="105" cy="74" r="5" fill="#FFA5A5" opacity="0.5" />
          </>
        );
      case 'hurt':
        return (
          <>
            {/* Soft closed comforting eyes (these are closed so they do not blink) */}
            <path d="M 48 68 Q 54 62 60 68" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 90 68 Q 96 62 102 68" fill="none" stroke="#2B1D12" strokeWidth="3.5" strokeLinecap="round" />
            {/* Bandage overlay on head/left side */}
            <rect x="35" y="38" width="40" height="10" rx="3" transform="rotate(-20, 35, 38)" fill="#FFF3D4" stroke="#D1B894" strokeWidth="1" />
            {/* Cozy blushing cheeks */}
            <circle cx="46" cy="75" r="8" fill="#FFA3A3" opacity="0.9" />
            <circle cx="104" cy="75" r="8" fill="#FFA3A3" opacity="0.9" />
          </>
        );
      case 'numb':
        return (
          <>
            {/* Neutral straight line eyes */}
            <g className="anim-eye-open">
              <line x1="47" y1="65" x2="59" y2="65" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="91" y1="65" x2="103" y2="65" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
            </g>
            {/* Closed Eyes for Blinking */}
            <g className="anim-eye-closed" style={{ opacity: 0 }}>
              <path d="M 47 66 Q 53 70 59 66" fill="none" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 91 66 Q 97 70 103 66" fill="none" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
            </g>
            {/* Soft subtle cheeks */}
            <circle cx="45" cy="74" r="5" fill="#E2D8C9" opacity="0.7" />
            <circle cx="105" cy="74" r="5" fill="#E2D8C9" opacity="0.7" />
          </>
        );
      case 'lonely':
        return (
          <>
            {/* Looking upward with big shiny black eyes */}
            <g className="anim-eye-open">
              <circle cx="53" cy="62" r="8.5" fill="#2B1D12" />
              <circle cx="97" cy="62" r="8.5" fill="#2B1D12" />
              <circle cx="55" cy="59" r="3.5" fill="white" />
              <circle cx="99" cy="59" r="3.5" fill="white" />
              <circle cx="51" cy="64" r="1.5" fill="white" />
              <circle cx="95" cy="64" r="1.5" fill="white" />
            </g>
            {/* Closed Eyes for Blinking */}
            <g className="anim-eye-closed" style={{ opacity: 0 }}>
              <path d="M 47 66 Q 53 70 59 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
              <path d="M 91 66 Q 97 70 103 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Soft blush */}
            <circle cx="44" cy="72" r="8" fill="#FFBABA" opacity="0.8" />
            <circle cx="106" cy="72" r="8" fill="#FFBABA" opacity="0.8" />
          </>
        );
      case 'need-support':
      default:
        return (
          <>
            {/* Big sparkle happy open eyes */}
            <g className="anim-eye-open">
              <circle cx="53" cy="64" r="8" fill="#2B1D12" />
              <circle cx="97" cy="64" r="8" fill="#2B1D12" />
              <circle cx="51" cy="61" r="3" fill="white" />
              <circle cx="95" cy="61" r="3" fill="white" />
            </g>
            {/* Closed Eyes for Blinking */}
            <g className="anim-eye-closed" style={{ opacity: 0 }}>
              <path d="M 47 66 Q 53 70 59 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
              <path d="M 91 66 Q 97 70 103 66" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Cute brows */}
            <path d="M 46 51 C 51 47 57 50 57 50" fill="none" stroke="#2B1D12" strokeWidth="3" strokeLinecap="round" />
            <path d="M 104 51 C 99 47 93 50 93 50" fill="none" stroke="#2B1D12" strokeWidth="3" strokeLinecap="round" />
            {/* Bright happy cheeks */}
            <circle cx="43" cy="73" r="8.5" fill="#FF9E9E" opacity="0.9" />
            <circle cx="107" cy="73" r="8.5" fill="#FF9E9E" opacity="0.9" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case 'calm':
        return <path d="M 68 76 Q 75 81 82 76" fill="none" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />;
      case 'anxious':
        return <path d="M 67 76 Q 75 72 83 76" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />;
      case 'hurt':
        return <path d="M 69 77 Q 75 74 81 77" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />;
      case 'numb':
        return <line x1="69" y1="76" x2="81" y2="76" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />;
      case 'lonely':
        return <path d="M 70 77 Q 75 79 80 77" fill="none" stroke="#2B1D12" strokeWidth="3" strokeLinecap="round" />;
      case 'need-support':
      default:
        // Huge open happy mouth showing tiny tongue
        return (
          <g>
            <path d="M 66 74 Q 75 88 84 74 Z" fill="#992E2E" stroke="#2B1D12" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 70 81 Q 75 76 80 81" fill="#FFA5A5" />
          </g>
        );
    }
  };

  const renderHands = () => {
    switch (expression) {
      case 'anxious':
        return (
          <>
            {/* Hands nervously meeting near chin */}
            <path 
              d="M 23 90 C 35 90 44 85 46 80" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              className="anim-hand-anxious-l"
            />
            <path 
              d="M 127 90 C 115 90 106 85 104 80" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              className="anim-hand-anxious-r"
            />
          </>
        );
      case 'hurt':
        // Hugging itself tightly (crossing inside heart body)
        return (
          <>
            <path 
              d="M 23 90 C 40 92 58 92 62 82" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              className="anim-hand-hug-l"
            />
            <path 
              d="M 127 90 C 110 92 92 92 88 82" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              className="anim-hand-hug-r"
            />
          </>
        );
      case 'numb':
        // Hands resting quietly down
        return (
          <>
            <path d="M 25 90 Q 32 108 38 104" fill="none" stroke="#BAAE9C" strokeWidth="8.5" strokeLinecap="round" />
            <path d="M 125 90 Q 118 108 112 104" fill="none" stroke="#BAAE9C" strokeWidth="8.5" strokeLinecap="round" />
          </>
        );
      case 'lonely':
        // Sitting, one hand holding a tiny golden tea light or lantern
        return (
          <>
            <path d="M 24 90 C 35 96 45 92 48 83" fill="none" stroke="#ECA06B" strokeWidth="8.5" strokeLinecap="round" />
            {/* Hand holding lantern */}
            <g className="anim-lantern">
              <path d="M 126 90 C 118 96 112 102 110 106" fill="none" stroke="#EA713E" strokeWidth="8.5" strokeLinecap="round" />
              {/* Mini Lantern */}
              <rect x="104" y="106" width="12" height="16" rx="2" fill="#FFAE00" stroke="#2B1D12" strokeWidth="2" />
              <line x1="110" y1="100" x2="110" y2="106" stroke="#2B1D12" strokeWidth="2" />
              <circle cx="110" cy="114" r="4.5" fill="#FFFDBF" />
            </g>
          </>
        );
      case 'need-support':
        return (
          <>
            {/* Waving left hand (facing us, so right side of screen) */}
            <path 
              d="M 126 90 Q 142 66 142 54" 
              fill="none" stroke="#EA713E" strokeWidth="9.5" strokeLinecap="round"
              className="anim-hand-wave"
            />
            {/* Hand on hip */}
            <path d="M 24 90 Q 14 96 22 103" fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round" />
          </>
        );
      case 'calm':
      default:
        // Peaceful waving / open arms floating
        return (
          <>
            <path 
              d="M 22 90 C 10 93 12 78 4 72" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              className="anim-hand-calm-l"
            />
            <path 
              d="M 128 90 C 140 93 138 78 146 72" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              className="anim-hand-calm-r"
            />
            {/* Holding a little dynamic sunflower */}
            <g transform="translate(4, 60)">
              <circle cx="0" cy="0" r="4" fill="#6A463B" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <ellipse 
                  key={angle}
                  cx="0" 
                  cy="0" 
                  rx="3.5" 
                  ry="9" 
                  fill="#FFCE44" 
                  transform={`rotate(${angle}) translate(0, -9)`}
                  opacity="0.9"
                />
              ))}
            </g>
          </>
        );
    }
  };

  const getBodyColors = () => {
    switch (expression) {
      case 'hurt':
        return {
          bgGradStart: '#ff9865',
          bgGradEnd: '#f16421',
          shadow: 'rgba(241,100,33,0.35)',
          stroke: '#842f0a'
        };
      case 'anxious':
        return {
          bgGradStart: '#ffad7d',
          bgGradEnd: '#f17942',
          shadow: 'rgba(241,121,66,0.3)',
          stroke: '#913b16'
        };
      case 'numb':
        return {
          bgGradStart: '#dddbd0',
          bgGradEnd: '#b0afa2',
          shadow: 'rgba(176,175,162,0.25)',
          stroke: '#5c5b52'
        };
      case 'lonely':
        return {
          bgGradStart: '#f79f6f',
          bgGradEnd: '#d8672a',
          shadow: 'rgba(216,103,42,0.3)',
          stroke: '#7a2f09'
        };
      case 'need-support':
      case 'calm':
      default:
        return {
          bgGradStart: '#ffa552',
          bgGradEnd: '#f76a26',
          shadow: 'rgba(247,106,38,0.4)',
          stroke: '#7e2d09'
        };
    }
  };

  const body = getBodyColors();

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mascot-idle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes mascot-idle-breathe {
          0%, 100% { transform: scale(0.98); }
          50% { transform: scale(1.02); }
        }
        @keyframes mascot-blink-open {
          0%, 90%, 94%, 98%, 100% { opacity: 1; }
          91%, 95% { opacity: 0; }
        }
        @keyframes mascot-blink-closed {
          0%, 90%, 94%, 98%, 100% { opacity: 0; }
          91%, 95% { opacity: 1; }
        }
        @keyframes mascot-bounce-happy {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px) scaleY(1.04); }
          50% { transform: translateY(2px) scaleY(0.96); }
          70% { transform: translateY(-3px) scaleY(1.02); }
        }
        @keyframes mascot-hand-anxious-left {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes mascot-hand-anxious-right {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes mascot-hand-hug-left {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes mascot-hand-hug-right {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes mascot-hand-waving {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(12deg); }
        }
        @keyframes mascot-hand-calm-left {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes mascot-hand-calm-right {
          0%, 100% { transform: rotate(4deg); }
          50% { transform: rotate(-2deg); }
        }
        @keyframes mascot-glow-halo {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.12); opacity: 0.2; }
        }
        @keyframes mascot-lantern-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes mascot-star-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        
        .anim-mascot-svg {
          animation: mascot-idle-float 4.5s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-mascot-body {
          animation: mascot-idle-breathe 4s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-eye-open {
          animation: mascot-blink-open 11s infinite;
        }
        .anim-eye-closed {
          animation: mascot-blink-closed 11s infinite;
        }
        .anim-bounce-once {
          animation: mascot-bounce-happy 0.8s ease-out;
        }
        .anim-hand-anxious-l {
          animation: mascot-hand-anxious-left 1.5s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-hand-anxious-r {
          animation: mascot-hand-anxious-right 1.5s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-hand-hug-l {
          animation: mascot-hand-hug-left 2.2s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-hand-hug-r {
          animation: mascot-hand-hug-right 2.2s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-hand-wave {
          animation: mascot-hand-waving 2s ease-in-out infinite;
          transform-origin: 126px 90px;
        }
        .anim-hand-calm-l {
          animation: mascot-hand-calm-left 3s ease-in-out infinite;
          transform-origin: 22px 90px;
        }
        .anim-hand-calm-r {
          animation: mascot-hand-calm-right 3s ease-in-out infinite;
          transform-origin: 128px 90px;
        }
        .anim-halo {
          animation: mascot-glow-halo 4s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-lantern {
          animation: mascot-lantern-float 3s ease-in-out infinite;
          transform-origin: center;
        }
        .anim-star {
          animation: mascot-star-pulse 2.5s ease-in-out infinite;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-mascot-svg, .anim-mascot-body, .anim-eye-open, .anim-eye-closed, 
          .anim-bounce-once, .anim-hand-anxious-l, .anim-hand-anxious-r, 
          .anim-hand-hug-l, .anim-hand-hug-r, .anim-hand-wave, 
          .anim-hand-calm-l, .anim-hand-calm-r, .anim-halo, .anim-lantern, .anim-star {
            animation: none !important;
            transform: none !important;
          }
          .anim-eye-closed {
            display: none !important;
          }
          .anim-eye-open {
            opacity: 1 !important;
          }
        }
      ` }} />
      
      {/* Background soft emotional halos for anxiety or loneliness */}
      {isAnxious && (
        <div 
          className="absolute rounded-full border border-orange-200 bg-orange-100/30 anim-halo"
          style={{ width: size * 1.25, height: size * 1.25, zIndex: 0 }}
        />
      )}
      
      {expression === 'lonely' && (
        <div className="absolute top-[-10px] right-[10px] text-yellow-400 select-none pointer-events-none anim-star" style={{ zIndex: 5 }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3.5-5.5 3.5 1.5-6-4.5-4 6-.5z" fill="#FFF275" />
          </svg>
        </div>
      )}

      {/* Main Mascot SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 150 150"
        className="anim-mascot-svg"
        style={{ zIndex: 10, filter: `drop-shadow(0 12px 24px ${body.shadow})` }}
      >
        <defs>
          <linearGradient id={`heartGrad-${expression}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={body.bgGradStart} />
            <stop offset="100%" stopColor={body.bgGradEnd} />
          </linearGradient>
        </defs>

        {/* Mascot Legs & Boots */}
        <g>
          {/* Left leg & boot */}
          <line x1="50" y1="110" x2="50" y2="128" stroke="#3D291C" strokeWidth="6" strokeLinecap="round" />
          <path d="M 44 125 C 44 125 32 125 32 129 C 32 133 58 133 58 129 C 58 125 44 125 44 125" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="36" y="129" width="10" height="3.5" rx="1" fill="white" />
          
          {/* Right leg & boot */}
          <line x1="100" y1="110" x2="100" y2="128" stroke="#3D291C" strokeWidth="6" strokeLinecap="round" />
          <path d="M 94 125 C 94 125 82 125 82 129 C 82 133 108 133 108 129 C 108 125 94 125 94 125" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="86" y="129" width="10" height="3.5" rx="1" fill="white" />
        </g>

        {/* Mascot Main Body */}
        <g className="anim-mascot-body">
          <rect 
            x="24" 
            y="26" 
            width="102" 
            height="86" 
            rx="36" 
            fill={`url(#heartGrad-${expression})`} 
            stroke="#2B1D12" 
            strokeWidth="4" 
          />
          {/* Top Heart-Ear Humps */}
          <path 
            d="M 40 28 C 36 12, 60 12, 66 26 Z" 
            fill={`url(#heartGrad-${expression})`} 
            stroke="#2B1D12" 
            strokeWidth="4" 
            strokeLinejoin="round"
          />
          <path 
            d="M 110 28 C 114 12, 90 12, 84 26 Z" 
            fill={`url(#heartGrad-${expression})`} 
            stroke="#2B1D12" 
            strokeWidth="4" 
            strokeLinejoin="round"
          />
          {/* Re-fill inner body to overlay ears stroke seamlessly */}
          <rect 
            x="26" 
            y="28" 
            width="98" 
            height="82" 
            rx="34" 
            fill={`url(#heartGrad-${expression})`} 
          />
          {/* Chest Badge */}
          <path 
            d="M 75 42 L 78 39 A 3 3 0 0 1 82 43 L 75 49 L 68 43 A 3 3 0 0 1 72 39 Z" 
            fill="#FFF5E6" 
            stroke="#2B1D12" 
            strokeWidth="1.5"
            opacity="0.95"
          />
        </g>

        {/* Arms and Hands */}
        {renderHands()}

        {/* Face */}
        <g className="anim-mascot-body">
          {renderEyes()}
          {renderMouth()}
        </g>
      </svg>
    </div>
  );
}

export { Mascot };
