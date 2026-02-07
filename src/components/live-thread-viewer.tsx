import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, Send, MessageCircle, Sparkles, Gift, Info, Eye, EyeOff } from 'lucide-react';
import { LiveThread } from '../data/mock-data';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { AudioPlayer } from './audio-player';
import { toast } from 'sonner@2.0.3';
import { getAylaThreadInsights } from '../utils/ayla-insights';

interface LiveThreadViewerProps {
  thread: LiveThread;
  onBack: () => void;
  quietMode: boolean;
}

export function LiveThreadViewer({ thread, onBack, quietMode: initialQuietMode }: LiveThreadViewerProps) {
  const [showInteractions, setShowInteractions] = useState(false);
  const [quietMode, setQuietMode] = useState(initialQuietMode);
  const [showInfo, setShowInfo] = useState(!initialQuietMode);
  const [chatMessage, setChatMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true); // Start with audio ON by default for immersion
  const [showAylaInsight, setShowAylaInsight] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const handleSendOffering = () => {
    toast.success('✨ Virtual candle lit and sent to ' + thread.host.name);
  };

  const handleVoiceNote = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success('Voice note sent to ' + thread.host.name);
    } else {
      setIsRecording(true);
      toast('Recording... Click again to send');
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      toast('Message sent to quiet chat');
      setChatMessage('');
    }
  };

  const aylaInsights = getAylaThreadInsights(thread);

  const handleAylaClick = () => {
    if (showAylaInsight) {
      // Cycle to next insight
      setCurrentInsightIndex((prev) => (prev + 1) % aylaInsights.length);
    } else {
      setShowAylaInsight(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Floating Quiet Mode Toggle - Adjusted position to avoid overlap */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => {
          setQuietMode(!quietMode);
          setShowInfo(quietMode);
        }}
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] p-2 md:p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 hover:bg-slate-800/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
        title={quietMode ? "Show Navigation & Features" : "Enter Quiet Mode"}
      >
        {quietMode ? (
          <Eye className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </motion.button>

      {/* Live Video Background */}
      <div className="absolute inset-0">
        <img
          src={thread.imageUrl}
          alt={thread.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      {/* Hidden Audio Player - Always plays but doesn't show control */}
      {thread.audioUrl && (
        <AudioPlayer
          audioUrl={thread.audioUrl}
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
              className="p-4 md:p-6 pr-16 md:pr-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent"
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
                {thread.audioUrl && (
                  <AudioPlayer
                    audioUrl={thread.audioUrl}
                    isEnabled={audioEnabled}
                    onToggle={() => setAudioEnabled(!audioEnabled)}
                    showControl={true}
                  />
                )}

                {quietMode && (
                  <Button
                    onClick={() => setShowInfo(!showInfo)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-2"
                  >
                    <Info className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Content - Simulated Live Video */}
        <div className="flex-1 flex items-center justify-center">
          {!thread.isLive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 max-w-md"
            >
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl mb-3">
                Not streaming right now
              </h3>
              <p className="text-slate-300 mb-2">
                {thread.host.name} streams from {thread.host.location}
              </p>
              <p className="text-slate-400 text-sm">
                {thread.scheduledTime}
              </p>
              <p className="text-slate-500 text-sm mt-4 italic">
                "Come back then!"
              </p>
            </motion.div>
          )}
        </div>

        {/* Bottom Info and Interactions */}
        <AnimatePresence>
          {(!quietMode || showInfo) && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="p-6 bg-gradient-to-t from-black/90 to-transparent"
            >
              <div className="max-w-4xl mx-auto">
                {/* Thread Info */}
                <div className="mb-6">
                  <h1 className="text-3xl mb-2">{thread.title}</h1>
                  <p className="text-slate-300 italic mb-4">
                    "{thread.description}"
                  </p>

                  {/* Host */}
                  <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
                      {thread.host.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm mb-1">
                        {thread.host.name} • {thread.host.location}, {thread.host.country}
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {thread.host.bio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interaction Buttons */}
                {thread.isLive && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button
                      onClick={() => setShowInteractions(!showInteractions)}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {showInteractions ? 'Hide' : 'Show'} Interactions
                    </Button>

                    <Button
                      onClick={handleVoiceNote}
                      className={`${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-white/10 hover:bg-white/20'
                      } text-white border border-white/20`}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      {isRecording ? 'Stop Recording' : 'Voice Note'}
                    </Button>

                    <Button
                      onClick={handleSendOffering}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Light a Candle
                    </Button>

                    <Button
                      onClick={handleAylaClick}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ayla Insight
                    </Button>
                  </div>
                )}

                {/* Interaction Panel */}
                <AnimatePresence>
                  {showInteractions && thread.isLive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-4">
                        <div>
                          <h4 className="text-sm text-slate-400 mb-3">
                            Quiet Chat — Text only, no emojis
                          </h4>
                          <div className="flex gap-2">
                            <Textarea
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              placeholder="Share your thoughts quietly..."
                              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                              rows={2}
                            />
                            <Button
                              onClick={handleSendMessage}
                              disabled={!chatMessage.trim()}
                              size="icon"
                              className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-40"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 space-y-1">
                          <p>• Voice notes go directly to {thread.host.name}</p>
                          <p>• Digital offerings appear as gentle notifications</p>
                          <p>• Chat messages are visible to other viewers</p>
                          <p className="italic">No likes. No comments. Just human resonance.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ayla Insight Panel */}
                <AnimatePresence>
                  {showAylaInsight && thread.isLive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-4">
                        <div>
                          <h4 className="text-sm text-slate-400 mb-3">
                            Ayla Insight
                          </h4>
                          <p className="text-sm text-slate-300">
                            {aylaInsights[currentInsightIndex]}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Viewer Count - Adjusted position to not overlap with Quiet Mode toggle */}
      {thread.isLive && thread.viewers && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-20 right-6 px-3 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-sm text-slate-300"
        >
          {thread.viewers} others present
        </motion.div>
      )}
    </div>
  );
}