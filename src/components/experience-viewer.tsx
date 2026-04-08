import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Bookmark, BookmarkCheck, Sparkles, EyeOff } from 'lucide-react';
import { Experience } from '../data/mock-data';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { getAylaInsights } from '../utils/ayla-insights';
import { PostcardModal } from './postcard-modal';

// ── New immersive components ──────────────────────────────────────────────────
import ParallaxViewerBg   from './parallax-viewer-bg';
import Pseudo360Viewer    from './pseudo-360-viewer';
import PresenceContextBar from './presence-context-bar';
import CollectiveHeartbeat from './collective-heartbeat';
import BreathingGate      from './breathing-gate';
import ImmersiveAudioPlayer from './immersive-audio-player';
import { ambientLightShift } from '../utils/ambient-light-shift';
import { useWeatherMood }    from '../utils/use-weather-mood';

interface ExperienceViewerProps {
  experience: Experience;
  onBack: () => void;
  onNavigate?: (page: 'explore' | 'live-threads' | 'memory-garden') => void;
}

export function ExperienceViewer({ experience, onBack, onNavigate }: ExperienceViewerProps) {
  const [isSaved, setIsSaved] = useState(() => {
    const saved = localStorage.getItem('wandersphere_saved') || '[]';
    return JSON.parse(saved).includes(experience.id);
  });
  const [audioEnabled,      setAudioEnabled     ] = useState(true);
  const [showAylaInsight,   setShowAylaInsight  ] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [showPostcard,      setShowPostcard     ] = useState(false);
  const [postcardOffered,   setPostcardOffered  ] = useState(false);

  const aylaInsights = getAylaInsights(experience);

  // ── Atmospheric colour from timeOfDay ──────────────────────────────────────
  const ambientLight = ambientLightShift(experience.timeOfDay);

  // ── Live weather at destination ───────────────────────────────────────────
  const weatherMood = useWeatherMood(
    (experience as any).lat,
    (experience as any).lng
  );

  // ── Postcard timer ────────────────────────────────────────────────────────
  useEffect(() => {
    const offered = localStorage.getItem(`wandersphere_postcard_${experience.id}`);
    if (offered) { setPostcardOffered(true); return; }
    const timer = setTimeout(() => {
      if (!postcardOffered) {
        setShowPostcard(true);
        localStorage.setItem(`wandersphere_postcard_${experience.id}`, 'true');
        setPostcardOffered(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [experience.id, postcardOffered]);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('wandersphere_saved') || '[]');
    if (isSaved) {
      localStorage.setItem('wandersphere_saved', JSON.stringify(saved.filter((id: string) => id !== experience.id)));
      setIsSaved(false);
      toast('Removed from Memory Garden');
    } else {
      saved.push(experience.id);
      localStorage.setItem('wandersphere_saved', JSON.stringify(saved));
      setIsSaved(true);
      toast('Saved to Memory Garden');
    }
  };

  const handleAylaClick = () => {
    if (showAylaInsight) {
      setCurrentInsightIndex((prev) => (prev + 1) % aylaInsights.length);
    } else {
      setShowAylaInsight(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* ── Breathing gate — once per session mindfulness moment ── */}
      <BreathingGate onComplete={() => {}} />

      {/* ── Quiet Mode icon ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] p-2 md:p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-none"
        title="Quiet Mode (Coming Soon)"
      >
        <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
      </motion.div>

      {/* ── Parallax background (replaces static image + gradient) ── */}
      <ParallaxViewerBg
        imageUrl={experience.imageUrl}
        className="absolute inset-0 w-full h-full"
        ambientColor={ambientLight.fogColor}
        ambientIntensity={ambientLight.intensity}
        weatherColor={weatherMood?.fogColor}
        weatherIntensity={weatherMood?.intensity}
      />

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Top Bar */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 md:p-6 pr-16 md:pr-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent z-40"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 text-xs md:text-sm"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {/* Audio toggle lives in ImmersiveAudioPlayer below — keep bookmark here */}
            <Button
              onClick={handleSave}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              {isSaved
                ? <BookmarkCheck className="w-3 h-3 md:w-4 md:h-4 fill-white" />
                : <Bookmark      className="w-3 h-3 md:w-4 md:h-4" />
              }
            </Button>
          </div>
        </motion.div>

        {/* Centre Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full text-center"
          >
            {/* ── Real 360° drag viewer (replaces emoji placeholder) ── */}
            <Pseudo360Viewer
              imageUrl={experience.imageUrl}
              title={experience.title}
              location={experience.location}
              className="mb-6 md:mb-8 w-full aspect-video"
            />

            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl mb-3 md:mb-4">
                {experience.title}
              </h1>
              <p className="text-base md:text-xl text-slate-300 mb-2">
                {experience.location}, {experience.country}
              </p>
              <p className="text-sm md:text-lg text-slate-400 italic mb-4 md:mb-6 px-4">
                "{experience.description}"
              </p>

              {/* ── Live local time + distance ── */}
              {(experience as any).timezone && (
                <div className="flex justify-center mb-4">
                  <PresenceContextBar
                    timezone={(experience as any).timezone}
                    lat={(experience as any).lat ?? 0}
                    lng={(experience as any).lng ?? 0}
                    location={experience.location}
                  />
                </div>
              )}

              {/* Fallback static time if no timezone field */}
              {!(experience as any).timezone && experience.timeOfDay && (
                <p className="text-xs md:text-sm text-slate-400 mb-4 md:mb-6">
                  It's {experience.timeOfDay} in {experience.location} —{" "}
                  {experience.timeOfDay.includes('AM')
                    ? 'the day is just beginning'
                    : 'the golden hour approaches'}
                  {weatherMood && (
                    <span className="ml-2 text-slate-500">
                      · {weatherMood.condition}, {weatherMood.temperature}°C there now
                    </span>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div className="max-w-3xl mx-auto">

            {/* ── Immersive audio player + waveform ── */}
            {experience.audioUrl && (
              <div className="mb-5">
                <ImmersiveAudioPlayer
                  audioUrl={experience.audioUrl}
                  isEnabled={audioEnabled}
                  onToggle={() => setAudioEnabled(!audioEnabled)}
                  barHeight={32}
                  barCount={52}
                />
              </div>
            )}

            {/* ── Collective heartbeat ── */}
            <div className="mb-5 flex justify-center">
              <CollectiveHeartbeat baseCount={42 + Math.floor(Math.random() * 90)} />
            </div>

            {/* Host Info */}
            {experience.host && (
              <div className="mb-5 p-4 md:p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0">
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
            <div className="text-center">
              <AnimatePresence>
                {!showAylaInsight ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Button
                      onClick={() => setShowAylaInsight(true)}
                      variant="ghost"
                      className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ask Ayla for insight
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <motion.div
                      onClick={handleAylaClick}
                      className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl cursor-pointer hover:bg-purple-500/15 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {aylaInsights[currentInsightIndex]}
                      </p>
                      <p className="text-purple-400 text-xs mt-2 italic">
                        Tap for another insight
                      </p>
                    </motion.div>
                    <Button
                      onClick={() => setShowAylaInsight(false)}
                      variant="ghost"
                      size="sm"
                      className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                    >
                      Hide Ayla's insight
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Postcard Modal */}
      <PostcardModal
        experience={experience}
        isOpen={showPostcard}
        onClose={() => setShowPostcard(false)}
        quote={aylaInsights[0]}
      />
    </div>
  );
}
