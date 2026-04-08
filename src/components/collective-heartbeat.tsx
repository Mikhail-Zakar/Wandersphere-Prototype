/**
 * CollectiveHeartbeat — A gently pulsing "X others are present right now"
 * indicator. Shows the emotional reality that other humans are experiencing
 * this exact moment alongside the viewer.
 *
 * The number fluctuates slightly ±2 every few seconds for realism.
 * The pulse animation mimics a real heartbeat (lub-dub rhythm).
 *
 * Usage: Drop this anywhere in the ExperienceViewer or LiveThreadViewer.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CollectiveHeartbeatProps {
  /** Base viewer count (from mock data or API) */
  baseCount: number;
  className?: string;
}

export default function CollectiveHeartbeat({
  baseCount,
  className = "",
}: CollectiveHeartbeatProps) {
  const [count,   setCount  ] = useState(baseCount);
  const [beating, setBeating] = useState(false);

  // Subtle fluctuation ±2 every 8–15 seconds
  useEffect(() => {
    function fluctuate() {
      const delta = Math.floor(Math.random() * 5) - 2;
      setCount(c => Math.max(1, c + delta));
    }
    const id = setInterval(fluctuate, 8000 + Math.random() * 7000);
    return () => clearInterval(id);
  }, []);

  // Heartbeat pulse every ~1.1 seconds (realistic resting HR ~55bpm)
  useEffect(() => {
    function beat() {
      setBeating(true);
      setTimeout(() => setBeating(false), 220);  // first beat
      // Lub-dub: second beat 200ms after first
      setTimeout(() => {
        setBeating(true);
        setTimeout(() => setBeating(false), 160);
      }, 200);
    }
    beat();
    const id = setInterval(beat, 1090);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className={`flex items-center gap-2.5 ${className}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      {/* Heart icon with lub-dub pulse */}
      <motion.div
        animate={beating ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <HeartIcon />
      </motion.div>

      <span className="text-xs text-slate-400">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y:  0 }}
            exit={{    opacity: 0, y:  6 }}
            transition={{ duration: 0.3 }}
            className="inline-block text-slate-200 font-medium"
          >
            {count.toLocaleString()}
          </motion.span>
        </AnimatePresence>
        {" "}others are present right now
      </span>
    </motion.div>
  );
}

function HeartIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="rgba(244, 114, 182, 0.85)"
      style={{ filter: "drop-shadow(0 0 4px rgba(244,114,182,0.6))" }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
