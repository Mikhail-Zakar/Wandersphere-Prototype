/**
 * CursorTrail — Leaves a fading purple sparkle trail behind the cursor.
 *
 * Renders onto a full-screen canvas. Each spark:
 *  - Spawns at cursor position with random velocity offset
 *  - Fades out (opacity) and shrinks over ~600ms
 *  - Has a randomised hue in the purple/pink range
 *
 * Only active on non-touch devices. Mounts/unmounts cleanly.
 * Zero new dependencies.
 */

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;      // 0–1, decreases over time
  decay: number;
}

const SPARK_COUNT = 4;  // spawned per mousemove event

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Don't run on touch-primary devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const sparks: Spark[] = [];
    let lastTime = 0;
    let raf = 0;

    function addSparks(x: number, y: number) {
      for (let i = 0; i < SPARK_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.8;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,  // slight upward drift
          size:  1.5 + Math.random() * 2.5,
          hue:   260 + Math.random() * 80,     // violet → pink
          life:  1,
          decay: 0.04 + Math.random() * 0.04,
        });
      }
    }

    function draw(now: number) {
      const dt = Math.min((now - lastTime) / 16.67, 3);   // normalise to 60fps
      lastTime = now;

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= s.decay * dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }

        s.x  += s.vx * dt;
        s.y  += s.vy * dt;
        s.vy += 0.05 * dt;   // gentle gravity

        const alpha = s.life * s.life;    // quadratic fade
        const r     = s.size * s.life;

        // Glow
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3);
        glow.addColorStop(0,   `hsla(${s.hue}, 85%, 72%, ${alpha * 0.55})`);
        glow.addColorStop(1,   `hsla(${s.hue}, 85%, 72%, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 90%, 80%, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => addSparks(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize",    resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
