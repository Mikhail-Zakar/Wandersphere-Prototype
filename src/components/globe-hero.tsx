/**
 * GlobeHero — Interactive 3D canvas globe for the Wandersphere landing page.
 *
 * Pure Canvas + RAF — zero new dependencies.
 * Features:
 *  - Auto-rotating WebGL-style globe via 2D canvas projection
 *  - Atmospheric glow (purple/indigo)
 *  - Latitude/longitude grid lines (front-face only)
 *  - Glowing location pins for all 5 experience destinations
 *  - Mouse/touch drag to rotate
 *  - Tooltip labels on pin hover
 *  - Rings that pulse outward from each pin
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "motion/react";

// ── Experience locations ──────────────────────────────────────────────────────
const LOCATIONS = [
  { id: "lk", label: "Kandy", sublabel: "Sri Lanka",     lat:  7.29,  lng:  80.63, color: "#c084fc" },
  { id: "pt", label: "Nazaré", sublabel: "Portugal",     lat: 39.60,  lng:  -9.07, color: "#818cf8" },
  { id: "jp", label: "Kyoto", sublabel: "Japan",         lat: 35.01,  lng: 135.77, color: "#e879f9" },
  { id: "mx", label: "Mexico City", sublabel: "Mexico",  lat: 19.43,  lng: -99.13, color: "#a78bfa" },
  { id: "gd", label: "Guadalajara", sublabel: "Mexico",  lat: 20.66,  lng:-103.35, color: "#f472b6" },
] as const;

// ── Math helpers ──────────────────────────────────────────────────────────────
const DEG = Math.PI / 180;

/** Convert lat/lng (degrees) to unit 3-D Cartesian, standard geographic convention */
function latLngTo3D(lat: number, lng: number): [number, number, number] {
  const φ = lat * DEG;
  const λ = lng * DEG;
  return [
    Math.cos(φ) * Math.sin(λ),   // x  — east
    Math.sin(φ),                  // y  — up
    Math.cos(φ) * Math.cos(λ),   // z  — front (lng=0 faces +z)
  ];
}

/** Apply Y-rotation (yaw) then X-rotation (pitch) to a 3-D point */
function rotate(
  x: number, y: number, z: number,
  yaw: number, pitch: number
): [number, number, number] {
  // Yaw around Y axis
  const cosY = Math.cos(yaw),  sinY = Math.sin(yaw);
  const x1 =  x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  // Pitch around X axis
  const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
  const y2 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;

  return [x1, y2, z2];
}

// ── Component ─────────────────────────────────────────────────────────────────
interface GlobeHeroProps {
  /** Size in CSS pixels (canvas is 2× for HiDPI) */
  size?: number;
  /** Called when a location pin is clicked */
  onLocationClick?: (locationId: string) => void;
  className?: string;
}

export default function GlobeHero({
  size = 340,
  onLocationClick,
  className = "",
}: GlobeHeroProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef({
    yaw:      0,
    pitch:   -0.18,     // slight north-tilt so globe looks "real"
    dragging: false,
    lastX:    0,
    lastY:    0,
    hovered:  null as string | null,
    rings:    [] as { id: string; t: number }[],  // pulse rings
    raf:      0,
  });
  const [tooltip, setTooltip] = useState<{ id: string; x: number; y: number } | null>(null);

  // ── Spawn a pulse ring when a pin is hovered ──────────────────────────────
  const spawnRing = useCallback((id: string) => {
    stateRef.current.rings.push({ id, t: 0 });
  }, []);

  // ── Canvas draw loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R  = size * 0.38;   // globe radius

    let lastTime = 0;

    // ── Projected location cache (rebuilt each frame) ──────────────────────
    const projectedPins: Array<{
      id: string; label: string; sublabel: string;
      color: string; sx: number; sy: number; z: number;
    }> = [];

    function draw(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const s = stateRef.current;

      if (!s.dragging) s.yaw += dt * 0.18;   // gentle auto-rotate

      ctx.clearRect(0, 0, size, size);

      // ── 1. Outer atmosphere glow ───────────────────────────────────────
      const atmos = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.28);
      atmos.addColorStop(0,   "rgba(139, 92, 246, 0.22)");
      atmos.addColorStop(0.5, "rgba(99, 55, 210, 0.09)");
      atmos.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2);
      ctx.fillStyle = atmos;
      ctx.fill();

      // ── 2. Sphere body ─────────────────────────────────────────────────
      const sphereGrad = ctx.createRadialGradient(
        cx - R * 0.25, cy - R * 0.3, R * 0.05,
        cx, cy, R
      );
      sphereGrad.addColorStop(0,    "rgba(55, 35, 90, 0.95)");
      sphereGrad.addColorStop(0.45, "rgba(20, 12, 45, 0.97)");
      sphereGrad.addColorStop(1,    "rgba(5,  4,  18, 1)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // ── 3. Grid lines ──────────────────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();  // keep lines inside sphere

      const GRID_LATS = [-60, -30, 0, 30, 60];
      const GRID_LNGS = Array.from({ length: 12 }, (_, i) => i * 30);
      const GRID_STEPS = 72;

      // Latitude circles
      for (const lat of GRID_LATS) {
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= GRID_STEPS; i++) {
          const lng = (i / GRID_STEPS) * 360 - 180;
          const [x, y, z] = rotate(...latLngTo3D(lat, lng), s.yaw, s.pitch);
          if (z < 0) { first = true; continue; }
          const sx = cx + x * R;
          const sy = cy - y * R;
          if (first) { ctx.moveTo(sx, sy); first = false; } else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(139,92,246,0.13)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Longitude meridians
      for (const lng of GRID_LNGS) {
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= GRID_STEPS; i++) {
          const lat = (i / GRID_STEPS) * 180 - 90;
          const [x, y, z] = rotate(...latLngTo3D(lat, lng), s.yaw, s.pitch);
          if (z < 0) { first = true; continue; }
          const sx = cx + x * R;
          const sy = cy - y * R;
          if (first) { ctx.moveTo(sx, sy); first = false; } else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(139,92,246,0.09)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      ctx.restore();

      // ── 4. Limb highlight (thin crescent on the lit side) ─────────────
      const limb = ctx.createRadialGradient(
        cx - R * 0.5, cy - R * 0.45, R * 0.55,
        cx, cy, R
      );
      limb.addColorStop(0,   "rgba(180, 140, 255, 0)");
      limb.addColorStop(0.85,"rgba(160, 120, 240, 0)");
      limb.addColorStop(0.93,"rgba(160, 120, 240, 0.18)");
      limb.addColorStop(1,   "rgba(120,  80, 200, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();

      // ── 5. Location pins (project all, draw back→front) ───────────────
      projectedPins.length = 0;
      for (const loc of LOCATIONS) {
        const [x, y, z] = rotate(...latLngTo3D(loc.lat, loc.lng), s.yaw, s.pitch);
        projectedPins.push({
          id: loc.id, label: loc.label, sublabel: loc.sublabel,
          color: loc.color,
          sx: cx + x * R,
          sy: cy - y * R,
          z,
        });
      }
      projectedPins.sort((a, b) => a.z - b.z);  // back-to-front

      for (const p of projectedPins) {
        const isBack    = p.z < -0.05;
        const nearEdge  = Math.abs(p.z) < 0.1;
        const isHovered = s.hovered === p.id;
        const alpha     = isBack ? 0.3 : nearEdge ? 0.6 : 1;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Pulse rings (only front-facing)
        if (!isBack) {
          for (const ring of s.rings.filter(r => r.id === p.id)) {
            const rAlpha = (1 - ring.t) * 0.6;
            const rRadius = (isHovered ? 16 : 12) + ring.t * 22;
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, rRadius, 0, Math.PI * 2);
            ctx.strokeStyle = p.color.replace(")", `, ${rAlpha})`).replace("rgb(", "rgba(").replace("#", "rgba(").includes("rgba") 
              ? p.color 
              : p.color;
            // use hex alpha trick
            const ringColor = hexToRgba(p.color, rAlpha);
            ctx.strokeStyle = ringColor;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Pin glow
        if (!isBack) {
          const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, isHovered ? 18 : 11);
          glow.addColorStop(0,   hexToRgba(p.color, 0.55));
          glow.addColorStop(1,   hexToRgba(p.color, 0));
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, isHovered ? 18 : 11, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Pin dot
        const dotR = isHovered ? 5.5 : isBack ? 2.5 : 4;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, dotR, 0, Math.PI * 2);
        ctx.fillStyle = isBack ? hexToRgba(p.color, 0.35) : p.color;
        ctx.fill();

        // Inner white dot
        if (!isBack) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, dotR * 0.42, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fill();
        }

        ctx.restore();
      }

      // ── 6. Advance + cull rings ────────────────────────────────────────
      s.rings = s.rings
        .map(r => ({ ...r, t: r.t + dt * 0.7 }))
        .filter(r => r.t < 1);

      // ── 7. Auto-spawn rings on hovered pin ─────────────────────────────
      if (s.hovered && Math.random() < dt * 1.5) spawnRing(s.hovered);

      stateRef.current.raf = requestAnimationFrame(draw);
    }

    stateRef.current.raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(stateRef.current.raf);
  }, [size, spawnRing]);

  // ── Mouse interaction ─────────────────────────────────────────────────────
  const getHitPin = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx   = clientX - rect.left;
    const my   = clientY - rect.top;
    const cx   = size / 2, cy = size / 2, R = size * 0.38;
    const s    = stateRef.current;

    for (const loc of LOCATIONS) {
      const [x, y, z] = rotate(...latLngTo3D(loc.lat, loc.lng), s.yaw, s.pitch);
      if (z < 0) continue;
      const sx = cx + x * R;
      const sy = cy - y * R;
      const dx = mx - sx, dy = my - sy;
      if (Math.sqrt(dx * dx + dy * dy) < 12) return { id: loc.id, sx, sy };
    }
    return null;
  }, [size]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const s = stateRef.current;
    if (s.dragging) {
      s.yaw   += (e.clientX - s.lastX) * 0.006;
      s.pitch += (e.clientY - s.lastY) * 0.004;
      s.pitch  = Math.max(-0.6, Math.min(0.6, s.pitch));
      s.lastX  = e.clientX;
      s.lastY  = e.clientY;
      setTooltip(null);
    } else {
      const hit = getHitPin(e.clientX, e.clientY);
      const newId = hit?.id ?? null;
      if (newId !== s.hovered) {
        s.hovered = newId;
        if (newId) spawnRing(newId);
      }
      if (hit) {
        const rect = canvasRef.current!.getBoundingClientRect();
        setTooltip({ id: hit.id, x: hit.sx, y: hit.sy });
      } else {
        setTooltip(null);
      }
      canvasRef.current!.style.cursor = hit ? "pointer" : "grab";
    }
  }, [getHitPin, spawnRing]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const s    = stateRef.current;
    s.dragging = true;
    s.lastX    = e.clientX;
    s.lastY    = e.clientY;
    canvasRef.current!.style.cursor = "grabbing";
  }, []);

  const onMouseUp = useCallback(() => {
    stateRef.current.dragging = false;
    canvasRef.current!.style.cursor = "grab";
  }, []);

  const onClick = useCallback((e: React.MouseEvent) => {
    const hit = getHitPin(e.clientX, e.clientY);
    if (hit && onLocationClick) onLocationClick(hit.id);
  }, [getHitPin, onLocationClick]);

  // Touch support
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const s = stateRef.current;
    s.dragging = true;
    s.lastX    = t.clientX;
    s.lastY    = t.clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const s = stateRef.current;
    if (!s.dragging) return;
    s.yaw   += (t.clientX - s.lastX) * 0.006;
    s.pitch += (t.clientY - s.lastY) * 0.004;
    s.pitch  = Math.max(-0.6, Math.min(0.6, s.pitch));
    s.lastX  = t.clientX;
    s.lastY  = t.clientY;
  }, []);

  const onTouchEnd = useCallback(() => {
    stateRef.current.dragging = false;
  }, []);

  // ── Tooltip data ──────────────────────────────────────────────────────────
  const tooltipLoc = tooltip
    ? LOCATIONS.find(l => l.id === tooltip.id)
    : null;

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, cursor: "grab" }}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Tooltip */}
      {tooltipLoc && tooltip && (
        <motion.div
          key={tooltipLoc.id}
          initial={{ opacity: 0, y: 4, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute z-10"
          style={{
            left: tooltip.x,
            top:  tooltip.y - 54,
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="rounded-lg px-3 py-1.5 text-center text-xs"
            style={{
              background: "rgba(10, 5, 25, 0.88)",
              border: `1px solid ${tooltipLoc.color}55`,
              backdropFilter: "blur(8px)",
              boxShadow: `0 4px 20px ${tooltipLoc.color}33`,
            }}
          >
            <div className="font-medium text-white" style={{ color: tooltipLoc.color }}>
              {tooltipLoc.label}
            </div>
            <div className="text-slate-400 text-[10px]">{tooltipLoc.sublabel}</div>
          </div>
          {/* connector line */}
          <div
            className="mx-auto mt-0.5 h-3 w-px"
            style={{ background: `${tooltipLoc.color}66` }}
          />
        </motion.div>
      )}

      {/* Drag hint — fades after first interaction */}
      <motion.p
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 pointer-events-none"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 2 }}
      >
        drag to rotate
      </motion.p>
    </motion.div>
  );
}

// ── Utility ───────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
