import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flower2, MapPin, Trash2 } from 'lucide-react';
import { experiences, Experience } from '../data/mock-data';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface MemoryGardenProps {
  quietMode: boolean;
  onExperienceSelect?: (experience: Experience) => void;
}

export function MemoryGarden({ quietMode, onExperienceSelect }: MemoryGardenProps) {
  const [savedExperiences, setSavedExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wandersphere_saved') || '[]');
    const filtered = experiences.filter(exp => saved.includes(exp.id));
    setSavedExperiences(filtered);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the experience when removing
    const saved = JSON.parse(localStorage.getItem('wandersphere_saved') || '[]');
    const filtered = saved.filter((expId: string) => expId !== id);
    localStorage.setItem('wandersphere_saved', JSON.stringify(filtered));
    setSavedExperiences(prev => prev.filter(exp => exp.id !== id));
    toast('Removed from Memory Garden');
  };

  const handleExperienceClick = (experience: Experience) => {
    if (onExperienceSelect) {
      onExperienceSelect(experience);
    }
  };

  return (
    <div className={`min-h-screen ${quietMode ? 'pt-0' : 'pt-20 md:pt-24'} pb-12 px-4 md:px-6`}>
      <div className="max-w-7xl mx-auto">
        {!quietMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <Flower2 className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <h2 className="text-2xl md:text-3xl text-white">
                Memory Garden
              </h2>
            </div>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
              Your personal collection of moments that moved you. 
              A quiet space to revisit the places that touched your heart.
            </p>
          </motion.div>
        )}

        {savedExperiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 md:py-20 px-4"
          >
            <div className="max-w-md mx-auto">
              <Flower2 className="w-12 h-12 md:w-16 md:h-16 text-slate-700 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl text-white mb-2 md:mb-3">
                Your garden is empty
              </h3>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                As you explore, save the moments that resonate with you. 
                They'll bloom here, ready for you to revisit whenever you need them.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleExperienceClick(experience)}
                className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 cursor-pointer hover:border-purple-400/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={experience.imageUrl}
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemove(experience.id, e)}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500/80 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                    title="Remove from garden"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>

                  {/* Content Overlay */}
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

                {/* Description */}
                <div className="p-6">
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                    "{experience.description}"
                  </p>
                  
                  {experience.host && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
                          {experience.host.name[0]}
                        </div>
                        <span className="text-slate-400 text-xs">
                          Shared by {experience.host.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reflection Quote */}
        {!quietMode && savedExperiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-500 italic max-w-2xl mx-auto">
              "These moments are not just memories — they are witnesses to the beauty 
              you chose to notice in the world."
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}