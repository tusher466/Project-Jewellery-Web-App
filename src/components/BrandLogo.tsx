import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  subtitle,
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Luxury RK Emblem Logo */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2a2415] via-[#151620] to-[#0d0e14] p-1 border border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/15 group transition-transform hover:scale-105"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rkGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae8b4" />
              <stop offset="45%" stopColor="#d4af37" />
              <stop offset="85%" stopColor="#997a15" />
              <stop offset="100%" stopColor="#e5c158" />
            </linearGradient>
            <linearGradient id="rkDiamondGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Octagonal Gemstone Facet Frame */}
          <polygon
            points="50,6 88,24 88,76 50,94 12,76 12,24"
            stroke="url(#rkGoldGrad)"
            strokeWidth="3"
            fill="#12131c"
            strokeLinejoin="round"
          />

          {/* Internal Geometric Facet Lines */}
          <line x1="50" y1="6" x2="50" y2="24" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="12" y1="24" x2="88" y2="24" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="12" y1="76" x2="88" y2="76" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="50" y1="76" x2="50" y2="94" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />

          {/* Stylized Monogram Letter 'R' */}
          <path
            d="M 28 32 L 28 68 M 28 32 L 44 32 C 49 32 52 35 52 40 C 52 45 49 48 44 48 L 28 48 M 41 48 L 51 68"
            stroke="url(#rkGoldGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stylized Monogram Letter 'K' */}
          <path
            d="M 57 32 L 57 68 M 72 32 L 57 50 L 73 68"
            stroke="url(#rkGoldGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Brilliant Crown Diamond Star Sparkle at Top */}
          <polygon
            points="50,15 52,20 57,22 52,24 50,29 48,24 43,22 48,20"
            fill="url(#rkDiamondGlow)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-brand font-bold tracking-wider text-white truncate ${
                size === 'sm' ? 'text-sm sm:text-base' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-base sm:text-xl'
              }`}
            >
              RK <span className="text-[#f3e5ab]">Jewellery</span>
            </span>
          </div>
          <span
            className={`text-[8px] sm:text-[9px] font-semibold tracking-widest uppercase text-[#d4af37]/80 truncate ${
              size === 'sm' ? 'text-[7px] sm:text-[8px]' : ''
            }`}
          >
            {subtitle || 'Haute Fine Atelier'}
          </span>
        </div>
      )}
    </div>
  );
};
