import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Circle, Users, Clock, Headphones, Radio } from 'lucide-react';
import { liveThreads, LiveThread } from '../data/mock-data';
import { Badge } from './ui/badge';

interface LiveThreadsPageProps {
  onThreadSelect: (thread: LiveThread) => void;
}

export function LiveThreadsPage({ onThreadSelect }: LiveThreadsPageProps) {
  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/25">
              <Radio className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl md:text-3xl text-white">
              Community Live Threads
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl">
            Real moments from real people. No polish. No filters. Just beautiful, ordinary life as it unfolds.
          </p>
        </motion.div>

        {/* Live Threads List */}
        <div className="space-y-4 md:space-y-6">
          {liveThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <button
                onClick={() => onThreadSelect(thread)}
                className="group w-full text-left overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative md:w-2/5 aspect-[16/10] md:aspect-[4/3] overflow-hidden">
                    <img
                      src={thread.imageUrl}
                      alt={thread.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/60" />
                    
                    {/* Live Badge */}
                    {thread.isLive && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white border-0 animate-pulse">
                          <Circle className="w-2 h-2 fill-white text-white mr-1" />
                          LIVE NOW
                        </Badge>
                      </div>
                    )}

                    {/* Audio Badge */}
                    {thread.audioUrl && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500/20 backdrop-blur-md text-green-300 border-green-500/30">
                          <Headphones className="w-3 h-3 mr-1" />
                          Audio
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="mb-3 md:mb-4">
                      <h3 className="text-xl md:text-2xl text-white mb-2">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs md:text-sm mb-2 md:mb-3">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{thread.host.location}, {thread.host.country}</span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm md:text-base mb-3 md:mb-4 italic">
                      "{thread.description}"
                    </p>

                    {/* Host Info */}
                    <div className="p-3 md:p-4 bg-white/5 rounded-lg mb-3 md:mb-4">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm md:text-base flex-shrink-0">
                          {thread.host.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs md:text-sm mb-1">
                            {thread.host.name}
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {thread.host.bio}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                      {thread.isLive ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Users className="w-4 h-4" />
                          <span>{thread.viewers} watching now</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{thread.scheduledTime}</span>
                        </div>
                      )}

                      {thread.tags && (
                        <div className="flex gap-2">
                          {thread.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 md:mt-12 p-4 md:p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl"
        >
          <h4 className="text-white text-base md:text-lg mb-2">
            About Live Threads
          </h4>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            These aren't polished documentaries — they're raw, beautiful, ordinary moments that make you feel: 
            "I'm witnessing real life, right now." After watching, you can leave a voice note, send a digital offering, 
            or join a quiet chat room. No likes. No comments. Just human resonance.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
