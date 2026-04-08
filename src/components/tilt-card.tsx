/**
 * TiltCard — Wraps any card content with a mouse-tracking 3D perspective tilt.
 *
 * The card rotates along X and Y axes relative to mouse position within
 * the card bounds. Inner elements can be assigned a `data-depth` attribute
 * (0–1) to float at different parallax layers above the surface.
 *
 * Zero dependencies beyond Framer Motion (already in the project).
 */

import { useRef, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees (default 12) */
  maxTilt?: number;
  /** Perspective depth in px (default 900) */
  perspective?: number;
  /** Scale on hover (default 1.035) */
  hoverScale?: number;
  /** Shine overlay opacity (default 0.07) */
  shineOpacity?: number;
  onClick?: () => void;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  perspective = 900,
  hoverScale = 1.035,
  shineOpacity = 0.07,
  onClick,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw mouse values (0–1 within the card)
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  // Spring-smoothed values
  const smoothX = useSpring(rawX, { stiffness: 160, damping: 22 });
  const smoothY = useSpring(rawY, { stiffness: 160, damping: 22 });

  // Map to rotation degrees
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);
  const rotateX = useTransform(smoothY, [0, 1], [ maxTilt, -maxTilt]);

  // Shine gradient position (tracks mouse)
  const shineX = useTransform(smoothX, [0, 1], ["0%",   "100%"]);
  const shineY = useTransform(smoothY, [0, 1], ["0%",   "100%"]);
  const shineBackground = useTransform(
    [shineX, shineY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,${shineOpacity * 2.5}), rgba(255,255,255,0) 65%)`
  );

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left)  / rect.width);
    rawY.set((e.clientY - rect.top)   / rect.height);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.5);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      whileHover={{ scale: hoverScale, z: 10 }}
      transition={{ scale: { duration: 0.25, ease: "easeOut" } }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}

        {/* Specular shine overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{ background: shineBackground }}
        />

        {/* Subtle edge highlight on tilt */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
