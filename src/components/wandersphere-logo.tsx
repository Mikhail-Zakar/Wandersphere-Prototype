import React from 'react';

interface WandersphereLogoProps {
  className?: string;
}

export function WandersphereLogo({ className = '' }: WandersphereLogoProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', maxWidth: '40px', height: 'auto' }}
    >
      {/* Outer orbital ring */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="#9333EA"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.6"
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Middle orbital ring */}
      <circle
        cx="200"
        cy="200"
        r="130"
        stroke="#A78BFA"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.5"
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="15s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Central sphere with gradient */}
      <radialGradient id="sphereGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#6D28D9" />
      </radialGradient>
      <circle
        cx="200"
        cy="200"
        r="80"
        fill="url(#sphereGradient)"
      />
      
      {/* Meridian lines */}
      <line
        x1="200"
        y1="120"
        x2="200"
        y2="280"
        stroke="#A78BFA"
        strokeWidth="1"
        opacity="0.8"
      />
      <line
        x1="120"
        y1="200"
        x2="280"
        y2="200"
        stroke="#A78BFA"
        strokeWidth="1"
        opacity="0.8"
      />
      
      {/* Orbiting dots */}
      <circle
        cx="380"
        cy="200"
        r="8"
        fill="#A78BFA"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="200"
        cy="120"
        r="6"
        fill="#C4B5FD"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Sparkles */}
      <path
        d="M300 100 L305 105 L300 110 L295 105 Z"
        fill="#DDD6FE"
        opacity="0.7"
      >
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M100 300 L105 305 L100 310 L95 305 Z"
        fill="#DDD6FE"
        opacity="0.7"
      >
        <animate
          attributeName="opacity"
          values="0.7;0.3;0.7"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Additional subtle elements to match your design */}
      <path
        d="M150 150 L160 160 L150 170 L140 160 Z"
        fill="#9333EA"
        opacity="0.3"
      />
      <path
        d="M250 250 L260 260 L250 270 L240 260 Z"
        fill="#9333EA"
        opacity="0.3"
      />
    </svg>
  );
}
