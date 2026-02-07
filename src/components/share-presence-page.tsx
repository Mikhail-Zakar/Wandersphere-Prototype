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
    <div className={`min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white ${quietMode ? 'pt-16 md:pt-20' : 'pt-20 md:pt-24'} px-4 md:px-6`}>
      <div className="max-w-4xl mx-auto py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 md:mb-8"
          >
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 tracking-tight px-4"
          >
            Share Your Presence
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Help us shape the future of virtual presence
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 mb-8 md:mb-12"
        >
          <div className="space-y-5 md:space-y-6 mb-8 md:mb-10">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg mb-1 md:mb-2 text-white">Your Voice Matters</h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  We're building something different — an experience that transcends traditional virtual tourism. 
                  Your insights will help us create deeper, more authentic connections between people and places.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg mb-1 md:mb-2 text-white">What We're Asking</h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Share your thoughts on immersive experiences, the moments that move you, and what "presence" 
                  means to you. Your feedback shapes how we design for genuine human connection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base md:text-lg mb-1 md:mb-2 text-white">A Quiet Approach</h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Just like Wandersphere itself, this survey focuses on meaningful reflection rather than 
                  quick clicks. Take your time. Be thoughtful. Your genuine response is what matters.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              onClick={handleOpenForm}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="mr-2">Open Survey</span>
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5 inline" />
            </Button>
            <p className="text-xs text-slate-500 mt-3 md:mt-4">
              Opens in a new window • Takes about 5-10 minutes
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-xs md:text-sm text-slate-400 space-y-2 px-4"
        >
          <p className="italic">
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