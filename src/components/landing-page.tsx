import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_50%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-7xl mb-6 tracking-tight">
            Wandersphere
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 italic">
            Not tourism. Not sightseeing. But presence.
          </p>
        </motion.div>

        <AnimatePresence>
          {showAyla && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
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
          
          <p className="mt-8 text-sm text-slate-400">
            A platform for those who seek to feel, not just see
          </p>
        </motion.div>
      </div>

      {/* Floating particles effect */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}