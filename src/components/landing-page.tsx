import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import GlobeHero      from './globe-hero';
import DepthParticles from './depth-particles';
import CursorTrail    from './cursor-trail';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [showAyla, setShowAyla] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAyla(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">

      {/* ── Depth particle field (replaces flat particles) ── */}
      <DepthParticles count={55} />

      {/* ── Sparkle cursor trail ── */}
      <CursorTrail />

      {/* Subtle radial bloom behind the globe */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(109,40,217,0.12),transparent_70%)]" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* Globe hero — IS the logo on the landing page */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-5"
        >
          <GlobeHero
            size={300}
            onLocationClick={() => onEnter()}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <h1 className="text-4xl md:text-6xl tracking-tight mb-4">
            Wandersphere
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 italic">
            Not tourism. Not sightseeing. But presence.
          </p>
        </motion.div>

        <AnimatePresence>
          {showAyla && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 mb-6">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale:  [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </motion.div>
                <span className="text-sm tracking-wide text-purple-300">AYLA</span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed"
              >
                "I'm Ayla. I'll show you moments that matter — not just sights, but stories.
                Places where you can truly be present, even from afar."
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Button
            onClick={onEnter}
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-8 py-6 text-lg rounded-full transition-all duration-300"
          >
            Begin Your Journey
          </Button>

          <p className="mt-8 text-sm text-slate-500">
            A platform for those who seek to feel, not just see
          </p>
        </motion.div>
      </div>
    </div>
  );
}
