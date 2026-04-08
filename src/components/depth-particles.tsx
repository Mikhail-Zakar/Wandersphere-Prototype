/**
 * DepthParticles — Replaces the flat purple particles on the landing page.
 *
 * Simulates z-depth via:
 *  - Size  (large = close, tiny = far)
 *  - Speed (fast = close, slow = far)
 *  - Blur  (far particles are blurred)
 *  - Opacity (far particles are dimmer)
 *
 * Reacts subtly to mouse position — near particles drift toward cursor,
 * far particles drift away (parallax effect).
 *
 * Zero new dependencies.
 */

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;   // 0–100 (vw%)
  y: number;   // 0–100 (vh%)
  vx: number;  // velocity vw/s
  vy: number;
  z: number;   // 0=far … 1=close
  hue: number; // purple range
  phase: number;
}

interface DepthParticlesProps {
  count?: number;
  className?: string;
}

export default function DepthParticles({ count = 55, className = "" }: DepthParticlesProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef({ x: 50, y: 50 });
  const rafRef     = useRef(0);

  // Seeded-random for consistent initial layout
  const particles = useRef<Particle[]>([]);

  const init = useCallback(() => {
    particles.current = Array.from({ length: count }, (_, i) => {
      const z    = Math.pow(Math.random(), 1.6);   // bias toward far
      const hue  = 260 + Math.random() * 70;       // purple–pink range
      const speed = 0.4 + z * 1.8;                 // far=slow, near=fast
      const angle = Math.random() * Math.PI * 2;
      return {
        x:     Math.random() * 100,
        y:     Math.random() * 100,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        z,
        hue,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [count]);

  useEffect(() => {
    init();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let lastTime = 0;

    function draw(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const W = canvas!.width, H = canvas!.height;

      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x / 100;  // 0–1
      const my = mouseRef.current.y / 100;

      for (const p of particles.current) {
        // Mouse parallax: near particles drift toward mouse, far drift away
        const parallaxStr = (p.z - 0.5) * 0.012;  // near=+, far=-
        const toCursorX   = mx - p.x / 100;
        const toCursorY   = my - p.y / 100;

        p.x += (p.vx + toCursorX * parallaxStr * 60) * dt;
        p.y += (p.vy + toCursorY * parallaxStr * 60) * dt;

        // Gentle oscillation (breathing)
        p.y += Math.sin(now * 0.0006 + p.phase) * 0.018;

        // Wrap around screen
        if (p.x < -2)   p.x += 104;
        if (p.x > 102)  p.x -= 104;
        if (p.y < -2)   p.y += 104;
        if (p.y > 102)  p.y -= 104;

        const sx = (p.x / 100) * W;
        const sy = (p.y / 100) * H;

        // Visual properties scaled by z
        const radius  = 0.6 + p.z * 3.2;            // 0.6–3.8 px
        const opacity = 0.08 + p.z * 0.55;           // far=dim, near=bright
        const blur    = (1 - p.z) * 2.5;             // far=blurry

        // Twinkle
        const twinkle = 0.7 + 0.3 * Math.sin(now * 0.0012 + p.phase * 3);

        ctx.save();
        if (blur > 0.3) ctx.filter = `blur(${blur.toFixed(1)}px)`;

        // Outer glow (near particles only)
        if (p.z > 0.5) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 4.5);
          glow.addColorStop(0,   `hsla(${p.hue}, 80%, 70%, ${opacity * 0.35 * twinkle})`);
          glow.addColorStop(1,   `hsla(${p.hue}, 80%, 70%, 0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, radius * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 75%, 72%, ${opacity * twinkle})`;
        ctx.fill();

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [init]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth)  * 100,
      y: (e.clientY / window.innerHeight) * 100,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    />
  );
}
