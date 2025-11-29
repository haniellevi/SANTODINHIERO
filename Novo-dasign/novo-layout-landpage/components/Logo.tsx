import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="walletGradient" x1="20" y1="40" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" /> {/* Violet-500 */}
          <stop offset="100%" stopColor="#6d28d9" /> {/* Violet-700 */}
        </linearGradient>
        <linearGradient id="flapGradient" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" /> {/* Violet-400 */}
          <stop offset="100%" stopColor="#7c3aed" /> {/* Violet-600 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Back of Wallet */}
      <rect x="22" y="38" width="56" height="42" rx="8" fill="url(#walletGradient)" />
      
      {/* Front Flap / Pocket */}
      <path 
        d="M22 52 C 22 52, 35 65, 50 65 C 65 65, 78 52, 78 52 L 78 80 C 78 84.4, 74.4 88, 70 88 L 30 88 C 25.6 88, 22 84.4, 22 80 Z" 
        fill="url(#flapGradient)" 
        fillOpacity="0.9"
      />

      {/* Strap */}
      <path d="M74 58 H 82 A 4 4 0 0 1 86 62 V 70 A 4 4 0 0 1 82 74 H 74 V 58 Z" fill="#ffffff" fillOpacity="0.2" />

      {/* Halo (Holy Aspect) */}
      <ellipse cx="50" cy="22" rx="20" ry="4" stroke="#fbbf24" strokeWidth="3" fill="none" filter="url(#glow)" className="animate-pulse" />
      
      {/* Coins (Falling) */}
      <g>
        <circle cx="50" cy="38" r="5" fill="#fbbf24" className="drop-shadow-md" />
        <circle cx="50" cy="38" r="3" fill="#f59e0b" />
      </g>
      <g transform="translate(-12, 10) scale(0.8)">
        <circle cx="50" cy="38" r="5" fill="#fbbf24" opacity="0.8" />
      </g>
      <g transform="translate(12, 6) scale(0.8)">
        <circle cx="50" cy="38" r="5" fill="#fbbf24" opacity="0.8" />
      </g>
    </svg>
  );
};