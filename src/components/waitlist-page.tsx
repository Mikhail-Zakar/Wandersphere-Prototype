import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle, Sparkles, Globe, Heart } from 'lucide-react';
import { Button } from './ui/button';

interface WaitlistPageProps {
  onBack: () => void;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function WaitlistPage({ onBack }: WaitlistPageProps) {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setSubmitState('loading');

    try {
      const formData = new FormData();
      // ─── REPLACE the value below with your own Web3Forms access key ───
      // Get one free at https://web3forms.com (takes 30 seconds, no sign-up needed)
      formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
      formData.append('email', email);
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
    } catch (err) {
      setSubmitState('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && submitState === 'idle') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 md:mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {submitState !== 'success' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mb-8 md:mb-10"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Mail className="w-4 h-4 text-purple-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl text-white">Join the Waitlist</h2>
                </div>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  Be among the first to experience Wandersphere. We'll reach out when we're ready to welcome you.
                </p>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="grid grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10"
              >
                {[
                  { icon: Globe, label: 'Real moments', sub: 'from around the world' },
                  { icon: Heart, label: 'No algorithms', sub: 'human curation only' },
                  { icon: Sparkles, label: 'No ads', sub: 'ever, we promise' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className="bg-slate-900/50 border border-white/10 rounded-xl p-3 md:p-4 text-center"
                    >
                      <div className="flex justify-center mb-2">
                        <div className="bg-purple-500/20 p-1.5 rounded-lg">
                          <Icon className="w-4 h-4 text-purple-400" />
                        </div>
                      </div>
                      <p className="text-white text-xs md:text-sm font-medium">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Email form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 md:p-8"
              >
                <label className="block text-sm text-slate-300 mb-2">
                  Your email address
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                      if (submitState === 'error') setSubmitState('idle');
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="you@example.com"
                    disabled={submitState === 'loading'}
                    className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={submitState === 'loading' || !email}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 px-6 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {submitState === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Joining…
                      </span>
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>
                </div>

                {errorMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-3"
                  >
                    {errorMessage}
                  </motion.p>
                )}

                <p className="text-slate-500 text-xs mt-4">
                  No spam, ever. Just one quiet email when we're ready for you.
                </p>
              </motion.div>
            </motion.div>
          ) : (
            /* Success state */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 md:py-24"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
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
                className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-8"
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

      </div>
    </div>
  );
}
