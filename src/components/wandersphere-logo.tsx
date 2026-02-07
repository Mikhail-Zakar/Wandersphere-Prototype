import React from 'react';

interface WandersphereLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export function WandersphereLogo({ 
  className = '', 
  theme = 'light' 
}: WandersphereLogoProps) {
  // Theme-specific color configurations
  const themeConfig = {
    light: {
      primary: '#9333EA',
      secondary: '#A78BFA',
      accent: '#C4B5FD',
      sparkle: '#DDD6FE',
      glow: 'rgba(139, 92, 246, 0.6)',
      background: 'transparent'
    },
    dark: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#C084FC',
      sparkle: '#E0E0FF',
      glow: 'rgba(171, 121, 255, 0.7)',
      background: 'transparent'
    }
  };

  const colors = themeConfig[theme];

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ backgroundColor: colors.background }}
    >
      {/* Outer orbit ring - dynamic gradient */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke={`url(#gradient1-${theme})`}
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      
      {/* Middle orbit ring - enhanced dynamic gradient */}
      <circle
        cx="20        cy="20"
        r="13"
        stroke={`url(#gradient2-${theme})`}
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.5"
      />
      
      {/* Central sphere - dynamic radial gradient */}
      <circle
        cx="20"
        cy="20"
        r="8"
        fill={`url(#gradient3-${theme})`}
      />
      
      {/* Animated orbital paths */}
      <ellipse
        cx="20"
        cy="20"
        rx="18"
        ry="18"
        stroke={colors.glow}
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.2"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 20 20"
          to="360 20 20"
          dur="20s"
          repeatCount="indefinite"
        />
      </ellipse>
      
      {/* Vertical meridian line */}
      <ellipse
        cx="20"
        cy="20"
        rx="4"
        ry="8"
        stroke={colors.glow}
        strokeWidth="1"
        fill="none"
      />
      
      {/* Horizontal latitude line */}
      <ellipse
        cx="20"
        cy="20"
        rx="8"
        ry="3"
        stroke={colors.glow}
        strokeWidth="1"
        fill="none"
      />
      
      {/* Traveling dot on outer orbit */}
      <circle
        cx="38"
        cy="20"
        r="2"
        fill={colors.secondary}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 20 20"
          to="360 20 20"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Traveling dot on middle orbit */}
      <circle
        cx="33"
        cy="20"
        r="1.5"
        fill={colors.accent}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="180 20 20"
          to="540 20 20"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Enhanced sparkle accents */}
      <path
        d="M30 12 L31 13 L30 14 L29 13 Z"
        fill={colors.sparkle}
        opacity="0.8"
      >
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      
      <path
        d="M10 28 L11 29 L10 30 L9 29 Z"
        fill={colors.sparkle}
        opacity="0.8"
      >
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Additional cosmic elements for depth */}
      <circle
        cx="20"
        cy="20"
        r="15"
        stroke={colors.glow}
        strokeWidth="0.3"
        strokeDasharray="1 1"
        opacity="0.1"
      />
      
      {/* Dynamic gradient definitions */}
      <defs>
        <linearGradient id={`gradient1-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
          <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0.4" />
        </linearGradient>
        
        <linearGradient id={`gradient2-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0.5" />
        </linearGradient>
        
        <radialGradient id={`gradient3-${theme}`}>
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="50%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={theme === 'dark' ? '#EC4899' : '#6D28D9'} />
        </radialGradient>
      </defs>
    </svg>
  );
}
