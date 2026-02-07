import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { Page } from './main-app';
import { Button } from './ui/button';

interface AylaGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
}

export function AylaGuide({ isOpen, onClose, currentPage }: AylaGuideProps) {
  const messages = {
    explore: [
      "These aren't just places — they're invitations to be present. Every location holds a thousand unspoken stories.",
      "Each experience is curated by someone who wants you to understand their world, not as a tourist, but as a soul passing through.",
      "Take your time. There's no rush here. The temple bells will still ring. The fisherman will still mend his nets. Just breathe and be.",
      "Notice the small things: the way light falls, the texture of stone worn by a million hands, the particular smell of morning in a place you've never been.",
    ],
    live: [
      "Shh… listen. These are real moments, happening right now, thousands of miles away. You're not watching — you're witnessing.",
      "The people you'll meet here aren't performing. They're living. Their ordinary is someone else's extraordinary.",
      "Remember: no likes, no comments. Just quiet witnessing. Your presence is enough. Your attention is the gift.",
      "Feel the rhythm of their day. Morning tea. Evening prayers. The universal cadence of human life unfolding in its infinite variety.",
    ],
    garden: [
      "This is your sanctuary. A place to return when the world feels too loud, too fast, too much.",
      "Each moment here is a reminder of beauty you chose to notice. Not because it was trending. Because it moved you.",
      "Your garden grows with intention, not with volume. Ten meaningful moments matter more than a thousand scrolls.",
      "Come back here when you need grounding. These images, these sounds — they're portals back to presence.",
    ],
    share: [
      "Your presence matters. Your perspective is unique. The way you see morning light in your city is unlike anyone else in the world.",
      "Share what moves you, so others can feel what you've felt. Not to perform. Not to impress. To connect.",
      "Every moment you contribute becomes part of someone else's journey. You become the host, and that's sacred.",
      "The world doesn't need more content. It needs more truth. More raw, beautiful, ordinary truth.",
    ],
    promise: [
      "You deserve experiences that honor your humanity, not harvest your attention.",
      "Wandersphere was built on a promise: real connection over engineered engagement. Presence over performance.",
      "We will never sell your data. Never optimize for addiction. Never mistake your worth for your metrics.",
      "This platform exists to help you travel through time and space with wonder, not doom-scroll into numbness.",
    ],
  };

  const currentMessages = messages[currentPage] || messages.explore;
  const [messageIndex, setMessageIndex] = useState(0);

  const nextMessage = () => {
    setMessageIndex((prev) => (prev + 1) % currentMessages.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="mx-4 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/10 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {/* Ayla Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl text-white mb-2">
                  Ayla
                </h3>
                <p className="text-sm text-purple-300">
                  Your gentle guide
                </p>
              </div>

              {/* Message */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <p className="text-lg text-slate-200 leading-relaxed text-center italic">
                    "{currentMessages[messageIndex]}"
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {currentMessages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setMessageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === messageIndex
                          ? 'bg-purple-400 w-8'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                {messageIndex < currentMessages.length - 1 ? (
                  <Button
                    onClick={nextMessage}
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={onClose}
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Thank you, Ayla
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}