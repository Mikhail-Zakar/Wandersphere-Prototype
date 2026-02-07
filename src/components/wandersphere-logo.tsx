import React from 'react';

interface WandersphereLogoProps {
  className?: string;
}

export function WandersphereLogo({ className = '' }: WandersphereLogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer orbit ring */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#gradient1)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      
      {/* Middle orbit ring */}
      <circle
        cx="20"
        cy="20"
        r="13"
        stroke="url(#gradient2)"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.5"
      />
      
      {/* Central sphere */}
      <circle
        cx="20"
        cy="20"
        r="8"
        fill="url(#gradient3)"
      />
      
      {/* Vertical meridian line */}
      <ellipse
        cx="20"
        cy="20"
        rx="4"
        ry="8"
        stroke="rgba(139, 92, 246, 0.6)"
        strokeWidth="1"
        fill="none"
      />
      
      {/* Horizontal latitude line */}
      <ellipse
        cx="20"
        cy="20"
        rx="8"
        ry="3"
        stroke="rgba(139, 92, 246, 0.6)"
        strokeWidth="1"
        fill="none"
      />
      
      {/* Traveling dot on outer orbit */}
      <circle
        cx="38"
        cy="20"
        r="2"
        fill="#A78BFA"
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
        fill="#C4B5FD"
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
      
      {/* Sparkle accent - top right */}
      <path
        d="M30 12 L31 13 L30 14 L29 13 Z"
        fill="#DDD6FE"
        opacity="0.8"
      >
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Sparkle accent - bottom left */}
      <path
        d="M10 28 L11 29 L10 30 L9 29 Z"
        fill="#DDD6FE"
        opacity="0.8"
      >
        <animate
          attributeName="opacity"
          values="0.8;0.3;0.8"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.4" />
        </linearGradient>
        
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.5" />
        </linearGradient>
        
        <radialGradient id="gradient3">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </radialGradient>
      </defs>
    </svg>
  );
}
