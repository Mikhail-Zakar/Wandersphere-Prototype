/**
 * ParallaxViewerBg — Three-layer depth parallax for immersive viewers.
 *
 * Now accepts:
 *  - `ambientColor`  from AmbientLightShift (timeOfDay → warm/cool tint)
 *  - `weatherColor`  from useWeatherMood (live weather → atmospheric shift)
 *
 * The two colours are blended at 50/50 into the fog layer when both present,
 * or individually when only one is provided. Falls back to brand purple.
 */

import { useRef, useCallback, useEffect, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface ParallaxViewerBgProps {
  imageUrl:      string;
  children:      ReactNode;
  className?:    string;
  strength?:     number;
  /** Hex colour from ambientLightShift() */
  ambientColor?: string;
  /** Opacity for ambientColor blend (0–1) */
  ambientIntensity?: number;
  /** Hex colour from useWeatherMood() */
  weatherColor?: string;
  /** Opacity for weatherColor blend (0–1) */
  weatherIntensity?: number;
}

// Blend two hex colours at a given ratio (0 = full a, 1 = full b)
function blendHex(a: string, b: string, t: number): string {
  const parse = (h: string) => {
    const c = h.replace("#", "");
    return [
      parseInt(c.slice(0, 2), 16),
      parseInt(c.slice(2, 4), 16),
      parseInt(c.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ParallaxViewerBg({
  imageUrl,
  children,
  className = "",
  strength = 1,
  ambientColor,
  ambientIntensity = 0.4,
  weatherColor,
  weatherIntensity = 0.4,
}: ParallaxViewerBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const smoothX = useSpring(rawX, { stiffness: 40, damping: 14 });
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 14 });

  const img_x = useTransform(smoothX, [0, 1], [`${-2.5 * strength}%`, `${2.5 * strength}%`]);
  const img_y = useTransform(smoothY, [0, 1], [`${-2.5 * strength}%`, `${2.5 * strength}%`]);
  const fog_x = useTransform(smoothX, [0, 1], [`${-5   * strength}%`, `${5   * strength}%`]);
  const fog_y = useTransform(smoothY, [0, 1], [`${-5   * strength}%`, `${5   * strength}%`]);
  const vig_x = useTransform(smoothX, [0, 1], [`${-8   * strength}%`, `${8   * strength}%`]);
  const vig_y = useTransform(smoothY, [0, 1], [`${-8   * strength}%`, `${8   * strength}%`]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left)  / rect.width);
    rawY.set((e.clientY - rect.top)   / rect.height);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.5);
  }, [rawX, rawY]);

  // Gyroscope on mobile
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) rawX.set(Math.min(1, Math.max(0, (e.gamma + 30) / 60)));
      if (e.beta  != null) rawY.set(Math.min(1, Math.max(0, (e.beta  - 20) / 60)));
    };
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, [rawX, rawY]);

  // Resolve fog colour: blend ambient + weather if both present
  const BASE_COLOR = "#2D1B4E";
  let fogHex = BASE_COLOR;
  if (ambientColor && weatherColor) {
    fogHex = blendHex(ambientColor, weatherColor, 0.5);
  } else if (ambientColor) {
    fogHex = ambientColor;
  } else if (weatherColor) {
    fogHex = weatherColor;
  }
  const blendedIntensity = ambientColor && weatherColor
    ? (ambientIntensity + weatherIntensity) * 0.5
    : ambientColor   ? ambientIntensity
    : weatherColor   ? weatherIntensity
    : 0.35;

  const fogC1 = hexToRgba(fogHex, blendedIntensity * 0.9);
  const fogC2 = hexToRgba(fogHex, blendedIntensity * 0.6);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Layer 1: background image */}
      <motion.div className="absolute inset-[-8%]" style={{ x: img_x, y: img_y }}>
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: "brightness(0.5)",
          }}
        />
      </motion.div>

      {/* Layer 2: atmospheric fog tinted by ambient+weather */}
      <motion.div
        className="absolute inset-[-8%] pointer-events-none"
        style={{ x: fog_x, y: fog_y }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 80% 70% at 30% 40%, ${fogC1} 0%, transparent 70%),
              radial-gradient(ellipse 60% 60% at 70% 70%, ${fogC2} 0%, transparent 70%)
            `,
            transition: "background 2s ease",
          }}
        />
      </motion.div>

      {/* Layer 3: depth vignette */}
      <motion.div
        className="absolute inset-[-8%] pointer-events-none"
        style={{ x: vig_x, y: vig_y }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 110% 110% at 50% 50%,
                transparent 35%,
                rgba(2,1,12,0.5) 65%,
                rgba(1,0,8,0.85) 100%)
            `,
          }}
        />
      </motion.div>

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          mixBlendMode: "overlay",
        }}
      />

      {/* Foreground content */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
}
