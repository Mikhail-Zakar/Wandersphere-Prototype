/**
 * WorldMapPath — Renders on the Memory Garden page above the saved cards.
 *
 * Shows a minimal dark world map (simplified continent outlines) with:
 *  - Glowing dots for each saved experience destination
 *  - Animated dotted arcs connecting the user's location to each destination
 *  - A pulsing dot for the user's location (via Geolocation API)
 *  - Falls back gracefully if location denied (shows destinations only)
 *
 * Uses an equirectangular projection (simple lat→x, lng→y mapping).
 * Continent outlines are simplified polygons — recognisable without being
 * a full GeoJSON render.
 *
 * Zero new dependencies. Pure SVG + React.
 */

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";

// ── Projection ────────────────────────────────────────────────────────────────
const MAP_W = 900;
const MAP_H = 440;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat)  / 180) * MAP_H;
  return [x, y];
}

// ── Simplified continent outlines (lat/lng polygon points) ───────────────────
// Each continent is an array of [lat, lng] pairs forming a closed polygon.
// These are intentionally simplified (~20–40 points) for a clean cartographic feel.
const CONTINENTS: Array<{ name: string; points: [number,number][] }> = [
  { name: "North America", points: [
    [70,-140],[72,-120],[68,-100],[60,-85],[60,-65],[45,-53],[25,-77],[10,-83],
    [8,-77],[8,-72],[12,-68],[18,-65],[25,-77],[32,-80],[40,-74],[47,-53],[50,-55],
    [55,-65],[58,-68],[60,-65],[65,-85],[70,-100],[72,-120],[70,-140]
  ]},
  { name: "South America", points: [
    [12,-72],[10,-62],[6,-52],[2,-50],[-5,-35],[-10,-37],[-15,-38],[-23,-43],
    [-33,-52],[-40,-62],[-55,-67],[-56,-67],[-55,-64],[-50,-58],[-45,-65],
    [-38,-57],[-28,-48],[-22,-42],[-15,-39],[-5,-35],[2,-50],[6,-52],[10,-62],[12,-72]
  ]},
  { name: "Europe", points: [
    [71,28],[70,18],[65,14],[60,5],[53,5],[45,10],[37,15],[36,28],[40,30],
    [42,42],[45,38],[48,22],[52,13],[55,10],[58,5],[62,5],[65,14],[70,18],[71,28]
  ]},
  { name: "Africa", points: [
    [37,10],[32,32],[22,37],[10,43],[0,42],[-10,40],[-20,35],[-34,26],
    [-35,20],[-30,17],[-18,12],[-5,10],[5,0],[5,-5],[10,-15],[0,-5],[-5,10],
    [5,0],[10,8],[5,3],[0,10],[0,42],[10,43],[22,37],[32,32],[37,10]
  ]},
  { name: "Asia", points: [
    [70,30],[72,80],[68,140],[60,150],[55,140],[45,145],[35,140],[25,120],
    [10,105],[0,105],[-5,110],[5,100],[10,77],[25,68],[22,60],[28,48],
    [36,35],[40,42],[45,38],[42,30],[48,22],[52,13],[55,10],[65,30],[70,30]
  ]},
  { name: "Australia", points: [
    [-15,130],[-12,136],[-15,145],[-22,150],[-32,152],[-38,148],[-38,140],
    [-35,138],[-32,128],[-22,114],[-18,122],[-15,130]
  ]},
  { name: "Greenland", points: [
    [83,-45],[82,-25],[76,-18],[72,-25],[65,-38],[65,-52],[68,-55],[72,-55],[80,-50],[83,-45]
  ]},
];

// ── Arc path between two projected points ────────────────────────────────────
function arcPath(
  from: [number, number],
  to:   [number, number],
  curvature = 0.3
): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Control point perpendicular to the midpoint
  const cx = mx - dy * curvature;
  const cy = my + dx * curvature;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

// ── Destination colours per experience id ────────────────────────────────────
const PIN_COLORS: Record<string, string> = {
  "lk": "#c084fc", // Sri Lanka  — purple
  "pt": "#818cf8", // Portugal   — indigo
  "jp": "#e879f9", // Japan      — fuchsia
  "mx": "#a78bfa", // Mexico City — violet
  "gd": "#f472b6", // Guadalajara — pink
};

export interface SavedLocation {
  id:    string;   // matches EXPERIENCE_GEO keys (lk, pt, jp, mx, gd) OR experience.id
  lat:   number;
  lng:   number;
  label: string;
  color?: string;
}

interface WorldMapPathProps {
  savedLocations: SavedLocation[];
  className?:     string;
}

export default function WorldMapPath({ savedLocations, className = "" }: WorldMapPathProps) {
  const [userPos,    setUserPos   ] = useState<[number, number] | null>(null);
  const [hoveredId,  setHoveredId ] = useState<string | null>(null);
  const [arcLengths, setArcLengths] = useState<Record<string, number>>({});

  // ── Geolocation ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      ()  => setUserPos(null),
      { timeout: 6000 }
    );
  }, []);

  // ── Measure arc path lengths for dash animation ──────────────────────────
  const measureArc = useCallback((id: string, el: SVGPathElement | null) => {
    if (!el) return;
    const len = el.getTotalLength();
    setArcLengths(prev => prev[id] === len ? prev : { ...prev, [id]: len });
  }, []);

  if (savedLocations.length === 0) return null;

  const userProj = userPos ? project(userPos[0], userPos[1]) : null;

  return (
    <motion.div
      className={`w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="px-4 pt-4 pb-1 flex items-center justify-between">
        <span className="text-xs text-slate-500 tracking-[0.2em] uppercase">Your journeys</span>
        {userPos && (
          <span className="text-xs text-slate-600">
            {savedLocations.length} {savedLocations.length === 1 ? "destination" : "destinations"}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="w-full"
        style={{ maxHeight: 280 }}
        aria-label="World map showing your saved experience locations"
      >
        {/* ── Background grid ── */}
        <defs>
          <pattern id="wm-grid" width="90" height="44" patternUnits="userSpaceOnUse">
            <path d="M 90 0 L 0 0 0 44" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width={MAP_W} height={MAP_H} fill="url(#wm-grid)" />

        {/* ── Continent outlines ── */}
        {CONTINENTS.map(cont => {
          const pts = cont.points.map(([la, ln]) => project(la, ln));
          const d   = "M " + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ") + " Z";
          return (
            <path
              key={cont.name}
              d={d}
              fill="rgba(148,163,184,0.055)"
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="0.7"
              strokeLinejoin="round"
            />
          );
        })}

        {/* ── Arc paths from user to each destination ── */}
        {userProj && savedLocations.map(loc => {
          const dest = project(loc.lat, loc.lng);
          const d    = arcPath(userProj, dest, 0.25);
          const len  = arcLengths[loc.id] ?? 600;
          const col  = loc.color ?? PIN_COLORS[loc.id] ?? "#a78bfa";
          const isHovered = hoveredId === loc.id;

          return (
            <motion.path
              key={`arc-${loc.id}`}
              ref={el => measureArc(loc.id, el)}
              d={d}
              fill="none"
              stroke={col}
              strokeWidth={isHovered ? 1.5 : 0.9}
              strokeOpacity={isHovered ? 0.7 : 0.35}
              strokeDasharray={`6 8`}
              strokeDashoffset={len}
              strokeLinecap="round"
              animate={{ strokeDashoffset: [len, 0] }}
              transition={{
                duration: 3.5,
                delay: 0.4,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          );
        })}

        {/* ── User position dot ── */}
        {userProj && (
          <g transform={`translate(${userProj[0]}, ${userProj[1]})`}>
            <motion.circle
              r="7"
              fill="rgba(148,163,184,0.1)"
              stroke="rgba(148,163,184,0.4)"
              strokeWidth="1"
              animate={{ r: [7, 13, 7], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            />
            <circle r="3.5" fill="rgba(203,213,225,0.9)" />
            <circle r="1.5" fill="white" />
          </g>
        )}

        {/* ── Destination pins ── */}
        {savedLocations.map(loc => {
          const [px, py] = project(loc.lat, loc.lng);
          const col      = loc.color ?? PIN_COLORS[loc.id] ?? "#a78bfa";
          const isHov    = hoveredId === loc.id;
          return (
            <g
              key={`pin-${loc.id}`}
              transform={`translate(${px}, ${py})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredId(loc.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Glow pulse */}
              <motion.circle
                r="10"
                fill={`${col}22`}
                stroke={`${col}55`}
                strokeWidth="1"
                animate={{ r: [8, 16, 8], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeOut", delay: Math.random() * 2 }}
              />
              {/* Pin body */}
              <circle
                r={isHov ? 6 : 4.5}
                fill={col}
                style={{ filter: `drop-shadow(0 0 ${isHov ? 8 : 4}px ${col})`, transition: "r 0.2s" }}
              />
              <circle r="2" fill="white" opacity="0.9" />

              {/* Label on hover */}
              {isHov && (
                <foreignObject
                  x={8} y={-24}
                  width="120" height="50"
                  style={{ overflow: "visible" }}
                >
                  <div
                    style={{
                      background: "rgba(8,4,24,0.92)",
                      border: `1px solid ${col}55`,
                      borderRadius: 8,
                      padding: "3px 8px",
                      color: col,
                      fontSize: 10,
                      whiteSpace: "nowrap",
                      backdropFilter: "blur(6px)",
                      boxShadow: `0 2px 12px ${col}33`,
                    }}
                  >
                    {loc.label}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {!userPos && savedLocations.length > 0 && (
        <p className="text-center text-[10px] text-slate-600 pb-3 -mt-1">
          Allow location access to see your connection lines
        </p>
      )}
    </motion.div>
  );
}
