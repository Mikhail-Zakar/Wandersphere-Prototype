/**
 * ParallaxViewerBg — Three-layer depth parallax for the immersive viewers.
 *
 * Layers (back → front):
 *   1. Background image — moves slowly (subtle zoom-out feel)
 *   2. Mid colour fog — moves at medium speed (depth haze)
 *   3. Vignette / overlay — moves fastest (foreground depth)
 *
 * Also renders a very subtle CSS noise grain to add texture/film-feel.
 * Zero new dependencies.
 */

import { useRef, useCallback, useEffect, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface ParallaxViewerBgProps {
  imageUrl: string;
  /** Overlay children (UI on top of the parallax layers) */
  children: ReactNode;
  className?: string;
  /** Strength multiplier for parallax movement (default 1) */
  strength?: number;
}

export default function ParallaxViewerBg({
  imageUrl,
  children,
  className = "",
  strength = 1,
}: ParallaxViewerBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalised mouse position: 0–1
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const smoothX = useSpring(rawX, { stiffness: 40, damping: 14 });
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 14 });

  // Layer 1 — image (slowest, 2.5% travel)
  const img_x = useTransform(smoothX, [0, 1], [`${-2.5 * strength}%`, `${2.5 * strength}%`]);
  const img_y = useTransform(smoothY, [0, 1], [`${-2.5 * strength}%`, `${2.5 * strength}%`]);

  // Layer 2 — fog (medium, 5%)
  const fog_x = useTransform(smoothX, [0, 1], [`${-5 * strength}%`, `${5 * strength}%`]);
  const fog_y = useTransform(smoothY, [0, 1], [`${-5 * strength}%`, `${5 * strength}%`]);

  // Layer 3 — vignette (fastest, 8%)
  const vig_x = useTransform(smoothX, [0, 1], [`${-8 * strength}%`, `${8 * strength}%`]);
  const vig_y = useTransform(smoothY, [0, 1], [`${-8 * strength}%`, `${8 * strength}%`]);

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

  // Gyroscope on mobile (DeviceOrientation)
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) rawX.set(Math.min(1, Math.max(0, (e.gamma + 30) / 60)));
      if (e.beta  != null) rawY.set(Math.min(1, Math.max(0, (e.beta  - 20) / 60)));
    };
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Layer 1: background image (blurred, enlarged, slow) ── */}
      <motion.div
        className="absolute inset-[-8%]"
        style={{ x: img_x, y: img_y }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: "blur(0px) brightness(0.55)",
          }}
        />
      </motion.div>

      {/* ── Layer 2: mid fog / colour haze ── */}
      <motion.div
        className="absolute inset-[-8%] pointer-events-none"
        style={{ x: fog_x, y: fog_y }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 80% 70% at 30% 40%,  rgba(80, 40, 140, 0.30) 0%, transparent 70%),
              radial-gradient(ellipse 60% 60% at 70% 70%,  rgba(20, 10,  50, 0.45) 0%, transparent 70%)
            `,
          }}
        />
      </motion.div>

      {/* ── Layer 3: depth vignette (darkens edges, floats on top) ── */}
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
                rgba(2, 1, 12, 0.5) 65%,
                rgba(1, 0,  8, 0.85) 100%)
            `,
          }}
        />
      </motion.div>

      {/* ── Film grain texture overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Foreground content ── */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
}
