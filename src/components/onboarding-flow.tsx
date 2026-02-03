import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Moon, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { OnboardingChoice } from '../App';

interface OnboardingFlowProps {
  onComplete: (choice: OnboardingChoice) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [selectedChoice, setSelectedChoice] = useState<OnboardingChoice>(null);

  const choices = [
    {
      id: 'presence' as const,
      icon: Heart,
      title: 'I want to feel present',
      description: 'Immerse yourself in moments of stillness and beauty from around the world',
      gradient: 'from-rose-500/20 to-pink-500/20',
    },
    {
      id: 'connect' as const,
      icon: Users,
      title: 'I want to connect with locals',
      description: 'Experience real moments shared by people who want you to understand their world',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      id: 'quiet' as const,
      icon: Moon,
      title: 'I want to explore quietly',
      description: 'Enter without distraction — just you and the experience',
      gradient: 'from-purple-500/20 to-indigo-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm tracking-wide text-purple-300">AYLA</span>
          </div>
          <h2 className="text-3xl md:text-4xl mb-4">
            How would you like to begin?
          </h2>
          <p className="text-slate-300 text-lg">
            Choose your path, and I'll guide you there
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {choices.map((choice, index) => {
            const Icon = choice.icon;
            const isSelected = selectedChoice === choice.id;
            
            return (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedChoice(choice.id)}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all duration-300 text-left
                  ${isSelected 
                    ? 'border-white/40 bg-white/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }
                `}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${choice.gradient} opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`} />
                
                <div className="relative z-10">
                  <Icon className={`w-10 h-10 mb-4 transition-colors ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <h3 className="text-xl mb-3">
                    {choice.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {choice.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            onClick={() => onComplete(selectedChoice)}
            disabled={!selectedChoice}
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-12 py-6 text-lg rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
}