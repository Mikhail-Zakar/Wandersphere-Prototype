import React from 'react';
import { motion } from 'motion/react';
import { Heart, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface SharePresencePageProps {
  quietMode: boolean;
}

export function SharePresencePage({ quietMode }: SharePresencePageProps) {
  const handleOpenForm = () => {
    window.open('https://forms.gle/6Rw6SfZYeuVKU6XDA', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen relative ${quietMode ? 'pt-16 md:pt-20' : 'pt-20 md:pt-24'} pb-12 px-4 md:px-6`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-pink-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        {!quietMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white">
                Share Your Presence
              </h2>
            </div>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
              Help us shape the future of virtual presence
            </p>
          </motion.div>
        )}

        {quietMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12 text-center"
          >
            <p className="text-xl md:text-2xl text-slate-300 font-light italic">
              "Help us shape the future of virtual presence"
            </p>
          </motion.div>
        )}

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 mb-8 md:mb-12 shadow-2xl"
        >
          <div className="space-y-8 mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-start gap-4 md:gap-5"
            >
              <div className="flex-shrink-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl mb-2 md:mb-3 text-white font-light">Your Voice Matters</h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  We're building something different — an experience that transcends traditional virtual tourism. 
                  Your insights will help us create deeper, more authentic connections between people and places.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-start gap-4 md:gap-5"
            >
              <div className="flex-shrink-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl mb-2 md:mb-3 text-white font-light">What We're Asking</h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Share your thoughts on immersive experiences, the moments that move you, and what "presence" 
                  means to you. Your feedback shapes how we design for genuine human connection.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-start gap-4 md:gap-5"
            >
              <div className="flex-shrink-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-3 md:p-4 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl mb-2 md:mb-3 text-white font-light">A Quiet Approach</h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Just like Wandersphere itself, this survey focuses on meaningful reflection rather than 
                  quick clicks. Take your time. Be thoughtful. Your genuine response is what matters.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <Button
              onClick={handleOpenForm}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 px-10 md:px-12 py-6 md:py-7 text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <span className="mr-2">Open Survey</span>
              <ExternalLink className="w-5 h-5 md:w-6 md:h-6 inline" />
            </Button>
            <p className="text-sm text-slate-400 mt-4 md:mt-5">
              Opens in a new window • Takes about 5-10 minutes
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-sm md:text-base text-slate-400 space-y-3 px-4"
        >
          <p className="italic text-slate-300">
            "Every voice adds depth to the experience we're creating together."
          </p>
          <p className="text-slate-500">
            — The Wandersphere Team
          </p>
        </motion.div>
      </div>
    </div>
  );
}
