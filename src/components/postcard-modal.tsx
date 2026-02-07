import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Sparkles, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Experience } from '../data/mock-data';

interface PostcardModalProps {
  experience: Experience;
  isOpen: boolean;
  onClose: () => void;
  quote: string;
}

export function PostcardModal({ experience, isOpen, onClose, quote }: PostcardModalProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setSent(false);
        setShowEmailForm(false);
        setEmail('');
        setName('');
      }, 300);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-slate-900 border border-white/20 text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!showEmailForm ? (
            // Postcard View
            <div className="bg-gradient-to-br from-purple-900/30 via-slate-900/90 to-pink-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl text-white">Postcard from AYLA</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  A moment worth keeping
                </p>
              </div>

              {/* Postcard Content */}
              <div className="p-6 md:p-8">
                {/* Image */}
                <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={experience.imageUrl}
                    alt={experience.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white text-xl md:text-2xl mb-1">
                      {experience.title}
                    </h4>
                    <p className="text-slate-200 text-sm">
                      {experience.location}, {experience.country}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="mb-6 p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="text-3xl text-purple-400 mb-3">"</div>
                  <p className="text-slate-200 leading-relaxed italic text-base md:text-lg">
                    {quote}
                  </p>
                  <div className="text-3xl text-purple-400 text-right">"</div>
                  <p className="text-slate-400 text-sm text-right mt-3">
                    — Ayla
                  </p>
                </div>

                {/* Date */}
                <p className="text-slate-400 text-sm text-center mb-6">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>

                {/* CTA */}
                <div className="text-center">
                  <p className="text-slate-300 text-sm mb-4">
                    Want to keep this memory? I can send it to your email.
                  </p>
                  <Button
                    onClick={() => setShowEmailForm(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send to My Email
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Email Form View
            <div className="bg-gradient-to-br from-purple-900/30 via-slate-900/90 to-pink-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/20 overflow-hidden shadow-2xl">
              {!sent ? (
                <>
                  <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-6 h-6 text-purple-400" />
                      <h3 className="text-2xl text-white">Send Your Postcard</h3>
                    </div>
                    <p className="text-slate-300 text-sm">
                      I'll email this moment to you
                    </p>
                  </div>

                  <form onSubmit={handleSendEmail} className="p-6 md:p-8">
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="postcard-email" className="block text-slate-300 text-sm mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="postcard-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="postcard-name" className="block text-slate-300 text-sm mb-2">
                          Name (optional)
                        </label>
                        <Input
                          id="postcard-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setShowEmailForm(false)}
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Postcard
                      </Button>
                    </div>

                    <p className="text-slate-500 text-xs text-center mt-4">
                      Your email will only be used to send this postcard. No spam, ever.
                    </p>
                  </form>
                </>
              ) : (
                // Success Message
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl text-white mb-3">
                    Postcard Sent! 
                  </h3>
                  <p className="text-slate-300">
                    Check your inbox{name && `, ${name}`}. Your memory is on its way.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
