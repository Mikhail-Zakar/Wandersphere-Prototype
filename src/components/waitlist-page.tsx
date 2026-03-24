import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface WaitlistPageProps {
  onBack: () => void;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistPage({ onBack }: WaitlistPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setSubmitState('loading');

    try {
      const formData = new FormData();
      formData.append('access_key', '983544d7-a5d8-4e6e-a65e-d440158963c7');
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('message', note.trim() || '(no note left)');
      formData.append('subject', 'New Wandersphere Waitlist Signup');
      formData.append('from_name', 'Wandersphere Waitlist');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitState('success');
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch {
      setSubmitState('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-20 md:pt-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto py-12 md:py-20">

        {/* Header — mirrors share-presence-page exactly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 md:mb-8"
          >
            <Mail className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 tracking-tight px-4"
          >
            Join the Waitlist
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Be among the first to experience Wandersphere
          </motion.p>
        </motion.div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          {submitState !== 'success' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 mb-8 md:mb-12"
            >
              <div className="space-y-5 md:space-y-6 mb-8 md:mb-10">

                {/* Name */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Your name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrorMessage(''); }}
                    placeholder="How should we call you?"
                    disabled={submitState === 'loading'}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Email address <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                    placeholder="you@example.com"
                    disabled={submitState === 'loading'}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-50"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    A note for us{' '}
                    <span className="text-slate-500 text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What draws you to Wandersphere? What do you hope to feel?"
                    disabled={submitState === 'loading'}
                    rows={4}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-50 resize-none"
                  />
                </div>

              </div>

              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mb-5 text-center"
                >
                  {errorMessage}
                </motion.p>
              )}

              {/* CTA — matches share page button style */}
              <div className="text-center">
                <Button
                  onClick={handleSubmit}
                  disabled={submitState === 'loading' || !name || !email}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitState === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Joining…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                      Join the Waitlist
                    </span>
                  )}
                </Button>
                <p className="text-xs text-slate-500 mt-3 md:mt-4">
                  No spam, ever. Just one quiet email when we're ready for you.
                </p>
              </div>
            </motion.div>
          ) : (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 mb-8 md:mb-12 text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 md:mb-8"
              >
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl md:text-3xl text-white mb-3"
              >
                You're on the list.
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-slate-300 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed"
              >
                Thank you for believing in something different. We'll reach out quietly — when the time feels right.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button
                  onClick={onBack}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-xl text-sm"
                >
                  Back to Our Promise
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note — mirrors share page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-xs md:text-sm text-slate-400 space-y-2 px-4"
        >
          <p className="italic">
            "Every voice adds depth to the experience we're creating together."
          </p>
          <p className="text-slate-500">
            — The Wandersphere Team
          </p>
        </motion.div>

      </div>
    </div>
  );
}
