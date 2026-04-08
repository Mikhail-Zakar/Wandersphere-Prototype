/**
 * Pseudo360Viewer — Replaces the 🌍 emoji placeholder in ExperienceViewer.
 *
 * Works with regular wide Unsplash images (no equirectangular needed).
 * Technique:
 *  - Displays the image scaled up (140% width), centred on a focal point
 *  - Mouse/touch drag pans left/right (Y-axis limited)
 *  - CSS perspective + rotateY applied for a subtle "looking around" illusion
 *  - Subtle vignette + scanline overlay for immersive feel
 *  - Ken Burns gentle drift when not interacting
 *  - Keyboard arrows also work
 *
 * Zero new dependencies.
 */

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface Pseudo360ViewerProps {
  imageUrl: string;
  title: string;
  location: string;
  className?: string;
}

export default function Pseudo360Viewer({
  imageUrl,
  title,
  location,
  className = "",
}: Pseudo360ViewerProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const isDragging     = useRef(false);
  const lastX          = useRef(0);
  const autoKenBurns   = useRef(true);

  const rawPanX = useMotionValue(0);   // –100 to +100 (%)
  const rawPanY = useMotionValue(0);   // –15  to +15  (%)
  const panX    = useSpring(rawPanX, { stiffness: 55, damping: 18 });
  const panY    = useSpring(rawPanY, { stiffness: 55, damping: 18 });

  // Map pan to subtle Y-axis rotation for "looking around" feel
  const rotateY = useTransform(panX, [-100, 100], [-8, 8]);

  // Ken Burns automatic drift
  useEffect(() => {
    let raf: number;
    let t = 0;
    function drift() {
      t += 0.0008;
      if (autoKenBurns.current) {
        rawPanX.set(Math.sin(t) * 22);
        rawPanY.set(Math.sin(t * 0.7) * 6);
      }
      raf = requestAnimationFrame(drift);
    }
    raf = requestAnimationFrame(drift);
    return () => cancelAnimationFrame(raf);
  }, [rawPanX, rawPanY]);

  // Clamp helper
  function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current     = true;
    lastX.current          = e.clientX;
    autoKenBurns.current   = false;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    rawPanX.set(clamp(rawPanX.get() - dx * 0.18, -100, 100));
  }, [rawPanX]);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  }, []);

  // Touch
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    lastX.current        = e.touches[0].clientX;
    autoKenBurns.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - lastX.current;
    lastX.current = e.touches[0].clientX;
    rawPanX.set(clamp(rawPanX.get() - dx * 0.18, -100, 100));
  }, [rawPanX]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { autoKenBurns.current = false; rawPanX.set(clamp(rawPanX.get() - 8, -100, 100)); }
      if (e.key === "ArrowRight") { autoKenBurns.current = false; rawPanX.set(clamp(rawPanX.get() + 8, -100, 100)); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [rawPanX]);

  // image translateX: map panX (–100…+100) → moves the 140%-wide image left/right
  const imgTranslateX = useTransform(panX, [-100, 100], ["10%",  "-10%"]);
  const imgTranslateY = useTransform(panY, [-15,   15],  ["2%",  "-2%"]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl select-none ${className}`}
      style={{ cursor: "grab", perspective: "900px" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => {}}
    >
      {/* Image layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            x: imgTranslateX,
            y: imgTranslateY,
            scale: 1.22,
            filter: "brightness(0.75)",
          }}
        />
      </motion.div>

      {/* Horizontal fade edges — reinforce the "world extending beyond" feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Subtle scanlines for cinematic feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          opacity: 0.6,
        }}
      />

      {/* Top-left label */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 text-[10px] text-white/70 border border-white/10 tracking-widest uppercase">
          360° View
        </span>
      </div>

      {/* Compass ring hint — bottom center */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-black/35 backdrop-blur-sm px-4 py-1.5 border border-white/10">
          <CompassIcon />
          <span className="text-[10px] text-white/60 tracking-wider">Drag to look around</span>
        </div>
      </div>
    </div>
  );
}

function CompassIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" className="text-purple-400">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="12,2 15,11 12,9 9,11" fill="currentColor" className="text-purple-400"/>
      <polygon points="12,22 9,13 12,15 15,13" fill="currentColor" className="text-slate-600"/>
    </svg>
  );
}
