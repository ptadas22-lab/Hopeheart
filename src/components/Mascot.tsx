import { motion } from 'motion/react';

interface MascotProps {
  expression: 'calm' | 'anxious' | 'hurt' | 'numb' | 'lonely' | 'need-support';
  size?: number;
  className?: string;
}

export default function Mascot({ expression, size = 180, className = '' }: MascotProps) {
  // Let's configure expression-specific animations and SVG components
  const isAnxious = expression === 'anxious';
  
  // Choose eyes based on expression
  const renderEyes = () => {
    switch (expression) {
      case 'calm':
        return (
          <>
            {/* Happy curved eyes */}
            <path d="M 45 65 A 8 8 0 0 1 61 65" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
            <path d="M 89 65 A 8 8 0 0 1 105 65" fill="none" stroke="#2B1D12" strokeWidth="4" strokeLinecap="round" />
            {/* Soft pink cheeks */}
            <circle cx="43" cy="74" r="7" fill="#FFA5A5" opacity="0.8" />
            <circle cx="107" cy="74" r="7" fill="#FFA5A5" opacity="0.8" />
          </>
        );
      case 'anxious':
        return (
          <>
            {/* Wide/worried circular eyes */}
            <circle cx="53" cy="65" r="7" fill="#2B1D12" />
            <circle cx="97" cy="65" r="7" fill="#2B1D12" />
            <circle cx="51" cy="63" r="2" fill="white" />
            <circle cx="95" cy="63" r="2" fill="white" />
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
            {/* Soft closed comforting eyes */}
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
            <line x1="47" y1="65" x2="59" y2="65" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="91" y1="65" x2="103" y2="65" stroke="#2B1D12" strokeWidth="4.5" strokeLinecap="round" />
            {/* Soft subtle cheeks */}
            <circle cx="45" cy="74" r="5" fill="#E2D8C9" opacity="0.7" />
            <circle cx="105" cy="74" r="5" fill="#E2D8C9" opacity="0.7" />
          </>
        );
      case 'lonely':
        return (
          <>
            {/* Looking upward with big shiny black eyes */}
            <circle cx="53" cy="62" r="8.5" fill="#2B1D12" />
            <circle cx="97" cy="62" r="8.5" fill="#2B1D12" />
            <circle cx="55" cy="59" r="3.5" fill="white" />
            <circle cx="99" cy="59" r="3.5" fill="white" />
            <circle cx="51" cy="64" r="1.5" fill="white" />
            <circle cx="95" cy="64" r="1.5" fill="white" />
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
            <circle cx="53" cy="64" r="8" fill="#2B1D12" />
            <circle cx="97" cy="64" r="8" fill="#2B1D12" />
            <circle cx="51" cy="61" r="3" fill="white" />
            <circle cx="95" cy="61" r="3" fill="white" />
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
            <motion.path 
              d="M 23 90 C 35 90 44 85 46 80" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path 
              d="M 127 90 C 115 90 106 85 104 80" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.1 }}
            />
          </>
        );
      case 'hurt':
        // Hugging itself tightly (crossing inside heart body)
        return (
          <>
            <motion.path 
              d="M 23 90 C 40 92 58 92 62 82" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
            <motion.path 
              d="M 127 90 C 110 92 92 92 88 82" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.2 }}
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
            <motion.g
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <path d="M 126 90 C 118 96 112 102 110 106" fill="none" stroke="#EA713E" strokeWidth="8.5" strokeLinecap="round" />
              {/* Mini Lantern */}
              <rect x="104" y="106" width="12" height="16" rx="2" fill="#FFAE00" stroke="#2B1D12" strokeWidth="2" />
              <line x1="110" y1="100" x2="110" y2="106" stroke="#2B1D12" strokeWidth="2" />
              <circle cx="110" cy="114" r="3" fill="#FFF200" className="animate-ping" style={{ animationDuration: '2s' }} />
              <circle cx="110" cy="114" r="4.5" fill="#FFFDBF" />
            </motion.g>
          </>
        );
      case 'need-support':
        // Waving hand excitingly, other hand on hip
        return (
          <>
            {/* Waving left hand (facing us, so right side of screen) */}
            <motion.path 
              d="M 126 90 Q 142 66 142 54" 
              fill="none" stroke="#EA713E" strokeWidth="9.5" strokeLinecap="round"
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: "126px 90px" }}
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
            <motion.path 
              d="M 22 90 C 10 93 12 78 4 72" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              animate={{ rotate: [-2, 4, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.path 
              d="M 128 90 C 140 93 138 78 146 72" 
              fill="none" stroke="#EA713E" strokeWidth="9" strokeLinecap="round"
              animate={{ rotate: [4, -2, 4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
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

  // Determine body gradient/colors matching expressions
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
        // Soft peach worried orange
        return {
          bgGradStart: '#ffad7d',
          bgGradEnd: '#f17942',
          shadow: 'rgba(241,121,66,0.3)',
          stroke: '#913b16'
        };
      case 'numb':
        // Warm sand gray calm comfort
        return {
          bgGradStart: '#dddbd0',
          bgGradEnd: '#b0afa2',
          shadow: 'rgba(176,175,162,0.25)',
          stroke: '#5c5b52'
        };
      case 'lonely':
        // Soft lonely warm twilight orange
        return {
          bgGradStart: '#f79f6f',
          bgGradEnd: '#d8672a',
          shadow: 'rgba(216,103,42,0.3)',
          stroke: '#7a2f09'
        };
      case 'need-support':
      case 'calm':
      default:
        // Super warm bright orange yellow blend
        return {
          bgGradStart: '#ffa552',
          bgGradEnd: '#f76a26',
          shadow: 'rgba(247,106,38,0.4)',
          stroke: '#7e2d09'
        };
    }
  };

  const body = getBodyColors();

  // Floating bounce animation keyframes based on expression
  const floatTransition = styleFloat(expression);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      
      {/* Background soft emotional halos for anxiety or loneliness */}
      {isAnxious && (
        <motion.div 
          className="absolute rounded-full border border-orange-200 bg-orange-100/30"
          style={{ width: size * 1.25, height: size * 1.25, zIndex: 0 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
      )}
      
      {expression === 'lonely' && (
        <div className="absolute top-[-10px] right-[10px] text-yellow-400 select-none pointer-events-none" style={{ zIndex: 5 }}>
          <motion.svg width="24" height="24" viewBox="0 0 24 24"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <path d="M12 2l2.5 5.5 6 .5-4.5 4 1.5 6-5.5-3.5-5.5 3.5 1.5-6-4.5-4 6-.5z" fill="#FFF275" />
          </motion.svg>
        </div>
      )}

      {/* Main Mascot SVG */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 150 150"
        style={{ zIndex: 10, filter: `drop-shadow(0 12px 24px ${body.shadow})` }}
        animate={floatTransition.animate}
        transition={floatTransition.transition}
      >
        <defs>
          <linearGradient id={`heartGrad-${expression}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={body.bgGradStart} />
            <stop offset="100%" stopColor={body.bgGradEnd} />
          </linearGradient>
        </defs>

        {/* Mascot Legs & Boots (wearing adorable blocky yellow/white sneakers) */}
        <g>
          {/* Left leg & boot */}
          <line x1="50" y1="110" x2="50" y2="128" stroke="#3D291C" strokeWidth="6" strokeLinecap="round" />
          <path d="M 44 125 C 44 125 32 125 32 129 C 32 133 58 133 58 129 C 58 125 44 125 44 125" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="36" y="129" width="10" height="3.5" rx="1" fill="white" />
          
          {/* Right leg & boot (with custom micro waving action if needed) */}
          <line x1="100" y1="110" x2="100" y2="128" stroke="#3D291C" strokeWidth="6" strokeLinecap="round" />
          <path d="M 94 125 C 94 125 82 125 82 129 C 82 133 108 133 108 129 C 108 125 94 125 94 125" fill="#FED25A" stroke="#2B1D12" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="86" y="129" width="10" height="3.5" rx="1" fill="white" />
        </g>

        {/* Mascot Main Body: Warm blocky curved heart-bean container */}
        <g>
          {/* A customized heart-bean shape: top side is double-humped but overall blocky & lovable */}
          <path 
            d="M 35 34 C 18 34 18 58 40 60 C 40 60 40 60 40 60 C 58 60 62 34 35 34 Z" 
            fill={`url(#heartGrad-${expression})`} 
            stroke={body.stroke} 
            strokeWidth="3.5" 
            className="hidden" // draft only
          />
          {/* Perfect rounded bean body with tiny soft heart ears */}
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
          {/* Top Heart-Ear Humps to give it a signature HopeHeart mascot look */}
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
          {/* Tiny detail: A glowing white plaster or healing heart badge on its chest! */}
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

        {/* Main Face Container */}
        <g>
          {renderEyes()}
          {renderMouth()}
        </g>
      </motion.svg>
    </div>
  );
}

function styleFloat(expression: string) {
  switch (expression) {
    case 'anxious':
      return {
        animate: { y: [0, -4, 0, 4, 0] },
        transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
      };
    case 'hurt':
      return {
        animate: { y: [0, -3, 0], scale: [1, 0.99, 1] },
        transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
      };
    case 'numb':
      return {
        animate: { y: [0, -1, 0] },
        transition: { repeat: Infinity, duration: 6, ease: "easeInOut" }
      };
    case 'lonely':
      return {
        animate: { y: [0, -3, 0], rotate: [-1, 1, -1] },
        transition: { repeat: Infinity, duration: 5, ease: "easeInOut" }
      };
    default:
      return {
        animate: { y: [0, -7, 0] },
        transition: { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
      };
  }
}
export { Mascot };
