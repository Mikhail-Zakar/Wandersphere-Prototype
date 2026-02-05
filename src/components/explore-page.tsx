import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Headphones, Circle, Compass } from 'lucide-react';
import { experiences, Experience } from '../data/mock-data';
import { Badge } from './ui/badge';

interface ExplorePageProps {
  onExperienceSelect: (experience: Experience) => void;
  quietMode: boolean;
}

export function ExplorePage({ onExperienceSelect, quietMode }: ExplorePageProps) {
  const [filter, setFilter] = useState<'all' | '360' | 'live' | 'still'>('all');

  const filteredExperiences = filter === 'all'
    ? experiences
    : experiences.filter(exp => exp.type === filter);

  return (
    <div className={`min-h-screen ${quietMode ? 'pt-16 md:pt-20' : 'pt-20 md:pt-24'} pb-12 px-4 md:px-6`}>
      <div className="max-w-7xl mx-auto">
        {!quietMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Compass className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <h2 className="text-2xl md:text-3xl text-white">
                Explore Moments
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-400">
              Immersive experiences from around the world
            </p>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6">
              {[
                { id: 'all', label: 'All Experiences' },
                { id: '360', label: '360° Views' },
                { id: 'live', label: 'Live Moments' },
                { id: 'still', label: 'Still Moments' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as any)}
                  className={`
                    px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all duration-200
                    ${filter === item.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <button
                onClick={() => onExperienceSelect(experience)}
                className="group w-full text-left overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={experience.imageUrl}
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20">
                      {experience.type === '360' && '360°'}
                      {experience.type === 'live' && (
                        <span className="flex items-center gap-1">
                          <Circle className="w-2 h-2 fill-red-500 text-red-500" />
                          Live
                        </span>
                      )}
                      {experience.type === 'still' && 'Still'}
                    </Badge>
                  </div>

                  {/* Audio Badge */}
                  {experience.audioUrl && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-500/20 backdrop-blur-md text-green-300 border-green-500/30">
                        <Headphones className="w-3 h-3 mr-1" />
                        Audio
                      </Badge>
                    </div>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl text-white mb-1">
                      {experience.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-300 text-xs md:text-sm">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{experience.location}, {experience.country}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <p className="text-slate-300 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 italic">
                    "{experience.description}"
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-1.5 md:space-y-2 text-xs text-slate-400">
                    {experience.timeOfDay && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{experience.timeOfDay} local time</span>
                      </div>
                    )}
                    {experience.soundscape && (
                      <div className="flex items-center gap-2">
                        <Headphones className="w-3 h-3" />
                        <span>{experience.soundscape}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {!quietMode && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {experience.tags.map((tag) => (
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
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}