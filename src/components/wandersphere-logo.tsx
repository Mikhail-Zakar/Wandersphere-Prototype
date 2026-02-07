import React from 'react';

interface WandersphereLogoProps {
  className?: string;
  size?: number;
}

export function WandersphereLogo({ 
  className = '', 
  size = 40 
}: WandersphereLogoProps) {
  const viewBoxSize = size * 10;
  const center = viewBoxSize / 2;
  const outerRadius = center * 0.9;
  const middleRadius = center * 0.65;
  const sphereRadius = center * 0.4;

  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Outer orbit */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius}
        stroke="#9333EA"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.6"
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${center} ${center}`}
          to={`360 ${center} ${center}`}
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Middle orbit */}
      <circle
        cx={center}
        cy={center}
        r={middleRadius}
        stroke="#A78BFA"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.5"
        fill="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${center} ${center}`}
          to={`360 ${center} ${center}`}
          dur="15s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Central sphere */}
      <radialGradient id="ws-sphere" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#6D28D9" />
      </radialGradient>
      <circle
        cx={center}
        cy={center}
        r={sphereRadius}
        fill="url(#ws-sphere)"
      />
      
      {/* Meridian lines */}
      <line
        x1={center}
        y1={center - sphereRadius}
        x2={center}
        y2={center + sphereRadius}
        stroke="#A78BFA"
        strokeWidth="1"
        opacity="0.8"
      />
      <line
        x1={center - sphereRadius}
        y1={center}
        x2={center + sphereRadius}
        y2={center}
        stroke="#A78BFA"
        strokeWidth="1"
        opacity="0.8"
      />
      
      {/* Orbiting dots */}
      <circle
        cx={center + outerRadius}
        cy={center}
        r="2"
        fill="#A78BFA"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${center} ${center}`}
          to={`360 ${center} ${center}`}
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx={center}
        cy={center - middleRadius}
        r="1.5"
        fill="#C4B5FD"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`180 ${center} ${center}`}
          to={`540 ${center} ${center}`}
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Sparkles */}
      <path
        d={`M${center + sphereRadius * 0.8} ${center - sphereRadius * 0.6} 
           L${center + sphereRadius * 0.85} ${center - sphereRadius * 0.55} 
           L${center + sphereRadius * 0.8} ${center - sphereRadius * 0.5} 
           L${center + sphereRadius * 0.75} ${center - sphereRadius * 0.55} Z`}
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
        d={`M${center - sphereRadius * 0.8} ${center + sphereRadius * 0.6} 
           L${center - sphereRadius * 0.75} ${center + sphereRadius * 0.65} 
           L${center - sphereRadius * 0.8} ${center + sphereRadius * 0.7} 
           L${center - sphereRadius * 0.85} ${center + sphereRadius * 0.65} Z`}
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
    </svg>
  );
}
