import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bookmark, BookmarkCheck, Sparkles, Info, Sun, Moon } from 'lucide-react';
import { Experience } from '../data/mock-data';
import { Button } from './ui/button';
import { AudioPlayer } from './audio-player';
import { toast } from 'sonner@2.0.3';

interface ExperienceViewerProps {
  experience: Experience;
  onBack: () => void;
  quietMode: boolean;
}

export function ExperienceViewer({ experience, onBack, quietMode: initialQuietMode }: ExperienceViewerProps) {
  const [isSaved, setIsSaved] = useState(() => {
    const saved = localStorage.getItem('wandersphere_saved') || '[]';
    return JSON.parse(saved).includes(experience.id);
  });
  const [quietMode, setQuietMode] = useState(initialQuietMode);
  const [showInfo, setShowInfo] = useState(!initialQuietMode);
  const [audioEnabled, setAudioEnabled] = useState(false); // Start with audio OFF so user must click to enable
  const [showAylaInsight, setShowAylaInsight] = useState(false);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('wandersphere_saved') || '[]');
    if (isSaved) {
      const filtered = saved.filter((id: string) => id !== experience.id);
      localStorage.setItem('wandersphere_saved', JSON.stringify(filtered));
      setIsSaved(false);
      toast('Removed from Memory Garden');
    } else {
      saved.push(experience.id);
      localStorage.setItem('wandersphere_saved', JSON.stringify(saved));
      setIsSaved(true);
      toast('Saved to Memory Garden');
    }
  };

  const aylaInsights = [
    `The stone is ${experience.location === 'Kandy' ? 'ancient granite, worn smooth by millions of hands' : 'weathered by centuries of ocean spray'}.`,
    `Listen closely — that sound is ${experience.soundscape?.split(',')[0] || 'the essence of this place'}.`,
    `${experience.host?.name} has been sharing this moment for ${Math.floor(Math.random() * 10) + 5} years.`,
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Floating Quiet Mode Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => {
          setQuietMode(!quietMode);
          setShowInfo(quietMode); // Show info when exiting quiet mode
        }}
        className="fixed top-6 right-6 z-[60] p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 hover:bg-slate-800/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
        title={quietMode ? "Exit Quiet Mode" : "Enter Quiet Mode"}
      >
        {quietMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.button>

      {/* Immersive Image Background */}
      <div className="absolute inset-0">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Audio Player */}
      {experience.audioUrl && (
        <AudioPlayer
          audioUrl={experience.audioUrl}
          isEnabled={audioEnabled}
          onToggle={() => setAudioEnabled(!audioEnabled)}
          showControl={false}
        />
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <AnimatePresence>
          {(!quietMode || showInfo) && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="p-6 pr-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-40"
            >
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                {experience.audioUrl && (
                  <AudioPlayer
                    audioUrl={experience.audioUrl}
                    isEnabled={audioEnabled}
                    onToggle={() => setAudioEnabled(!audioEnabled)}
                    showControl={true}
                  />
                )}

                <Button
                  onClick={handleSave}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 fill-white" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>

                {quietMode && (
                  <Button
                    onClick={() => setShowInfo(!showInfo)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-center"
          >
            {/* Simulated 360 viewer placeholder */}
            <div className="mb-8 p-12 border-2 border-white/20 border-dashed rounded-2xl bg-black/40 backdrop-blur-sm">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-sm text-slate-300 mb-2">360° Immersive View</p>
              <p className="text-xs text-slate-400">
                Drag to explore • Scroll to zoom
              </p>
            </div>

            <AnimatePresence>
              {(!quietMode || showInfo) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h1 className="text-4xl md:text-5xl mb-4">
                    {experience.title}
                  </h1>
                  <p className="text-xl text-slate-300 mb-2">
                    {experience.location}, {experience.country}
                  </p>
                  <p className="text-lg text-slate-400 italic mb-6">
                    "{experience.description}"
                  </p>

                  {experience.timeOfDay && (
                    <p className="text-sm text-slate-400 mb-8">
                      It's {experience.timeOfDay} in {experience.location} — {
                        experience.timeOfDay.includes('AM') 
                          ? 'the day is just beginning' 
                          : 'the golden hour approaches'
                      }
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <AnimatePresence>
          {(!quietMode || showInfo) && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="p-6 bg-gradient-to-t from-black/80 to-transparent"
            >
              {/* Host Info */}
              {experience.host && (
                <div className="max-w-3xl mx-auto mb-6 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl flex-shrink-0">
                      {experience.host.name[0]}
                    </div>
                    <div>
                      <div className="text-white mb-1">{experience.host.name}</div>
                      <p className="text-slate-300 text-sm leading-relaxed italic">
                        "{experience.host.bio}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ayla Insight */}
              <div className="max-w-3xl mx-auto text-center">
                <Button
                  onClick={() => setShowAylaInsight(!showAylaInsight)}
                  variant="ghost"
                  className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {showAylaInsight ? 'Hide' : 'Ask'} Ayla for insight
                </Button>

                <AnimatePresence>
                  {showAylaInsight && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"
                    >
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {aylaInsights[Math.floor(Math.random() * aylaInsights.length)]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}