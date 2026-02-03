import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Headphones, Circle } from 'lucide-react';
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
    <div className={`min-h-screen ${quietMode ? 'pt-0' : 'pt-24'} pb-12`}>
      <div className="max-w-7xl mx-auto px-6">
        {!quietMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl text-white mb-2">
              Explore Moments
            </h2>
            <p className="text-slate-400">
              Immersive experiences from around the world
            </p>

            {/* Filters */}
            <div className="flex gap-2 mt-6">
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
                    px-4 py-2 rounded-full text-sm transition-all duration-200
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl text-white mb-1">
                      {experience.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}, {experience.country}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2 italic">
                    "{experience.description}"
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 text-xs text-slate-400">
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