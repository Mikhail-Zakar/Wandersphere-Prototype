/**
 * BreathingGate — A brief mindfulness prompt shown once when entering any
 * experience or live thread for the first time per session.
 *
 * Shows a gently pulsing circle with the instruction to take a breath,
 * then fades away after the breath cycle completes (~5 seconds)
 * or when the user clicks/taps.
 *
 * Only shown once per session (tracked via sessionStorage).
 * Stays true to Wandersphere's "presence over performance" philosophy.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SESSION_KEY = "wandersphere_breathed";

interface BreathingGateProps {
  /** Called once the gate closes — mount your experience content in this callback */
  onComplete: () => void;
}

export default function BreathingGate({ onComplete }: BreathingGateProps) {
  const [show, setShow]   = useState(false);
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "done">("in");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      onComplete();
      return;
    }
    setShow(true);

    // Breath cycle: 2s inhale → 1s hold → 2s exhale → done
    const t1 = setTimeout(() => setPhase("hold"),  2000);
    const t2 = setTimeout(() => setPhase("out"),   3000);
    const t3 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(SESSION_KEY, "1");
      setTimeout(onComplete, 800);
    }, 5200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const skip = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("done");
    setTimeout(onComplete, 400);
  };

  const label =
    phase === "in"   ? "breathe in…"   :
    phase === "hold" ? "hold…"         :
    phase === "out"  ? "breathe out…"  : "";

  return (
    <AnimatePresence>
      {show && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: "rgba(4, 2, 18, 0.97)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          onClick={skip}
        >
          {/* Pulsing ring */}
          <div className="relative flex items-center justify-center">
            {/* Outer ripple */}
            <motion.div
              className="absolute rounded-full border border-purple-500/20"
              animate={{
                scale:   phase === "in" ? [1, 1.8] : phase === "out" ? [1.8, 1] : 1.8,
                opacity: phase === "in" ? [0.5, 0] : phase === "out" ? [0, 0.5] : 0,
              }}
              transition={{ duration: phase === "hold" ? 0 : 2, ease: "easeInOut" }}
              style={{ width: 160, height: 160 }}
            />
            {/* Main breathing circle */}
            <motion.div
              className="rounded-full"
              animate={{
                scale:      phase === "in" ? [0.55, 1] : phase === "out" ? [1, 0.55] : 1,
                background: phase === "in"
                  ? ["rgba(109,40,217,0.25)", "rgba(139,92,246,0.45)"]
                  : phase === "out"
                  ? ["rgba(139,92,246,0.45)", "rgba(109,40,217,0.25)"]
                  : "rgba(139,92,246,0.45)",
              }}
              transition={{ duration: phase === "hold" ? 0 : 2, ease: "easeInOut" }}
              style={{
                width: 120, height: 120,
                border: "1px solid rgba(139, 92, 246, 0.4)",
                boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
              }}
            />
          </div>

          {/* Breath label */}
          <motion.p
            key={phase}
            className="mt-10 text-slate-300 text-sm tracking-[0.25em] uppercase"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {label}
          </motion.p>

          {/* Skip hint */}
          <p className="absolute bottom-10 text-slate-600 text-xs tracking-wider">
            tap to skip
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
