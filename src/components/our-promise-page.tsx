import React from 'react';
import { motion } from 'motion/react';
import { Check, Heart, Shield, Users, Sparkles, Clock, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

interface OurPromisePageProps {
  quietMode: boolean;
}

export function OurPromisePage({ quietMode }: OurPromisePageProps) {
  const tiers = [
    {
      name: 'Garden Membership',
      price: '$3/month',
      description: 'Access to all Moments + Memory Garden + Quiet Mode',
      reason: 'Low barrier, recurring support',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Live Threads Pass',
      price: '$5/session',
      description: 'Join scheduled Live Windows + send voice notes',
      reason: 'Pay-per-meaningful-moment',
      icon: Clock,
      color: 'from-blue-500 to-purple-500',
    },
    {
      name: 'Whisper Requests',
      price: 'Host-set price',
      description: 'Custom 1:1 sessions',
      reason: 'Host controls value, user pays for intimacy',
      icon: MessageCircle,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const pledges = [
    {
      title: '70% to Hosts',
      description: 'Every paid experience directly supports the person sharing it',
      icon: Users,
    },
    {
      title: 'No Data Selling',
      description: 'We never store or sell your data',
      icon: Shield,
    },
    {
      title: 'No Ads',
      description: 'Immersion is sacred — commerce is optional and never intrusive',
      icon: Sparkles,
    },
    {
      title: 'Human Curation',
      description: 'No algorithms — only real people vetting real stories',
      icon: Heart,
    },
  ];

  const verifiedMeans = [
    'They share because they want to be understood — not for profit',
    'Their moments are unedited, raw, and real',
    'They control what to share and when',
  ];

  return (
    <div className={`min-h-screen ${quietMode ? 'pt-16 md:pt-20' : 'pt-20 md:pt-24'} pb-12 px-4 md:px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        {!quietMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <h2 className="text-2xl md:text-3xl text-white">
                Our Promise
              </h2>
            </div>
            <p className="text-lg md:text-xl text-slate-300 font-light italic mb-2 md:mb-3">
              "Not tourism. Not sightseeing. But presence."
            </p>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
              We help people who can't travel feel truly present in real moments around the world — through the eyes of those who live there.
            </p>
          </motion.div>
        )}

        {quietMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <p className="text-lg md:text-xl text-slate-300 font-light italic mb-2 md:mb-3">
              "Not tourism. Not sightseeing. But presence."
            </p>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
              We help people who can't travel feel truly present in real moments around the world — through the eyes of those who live there.
            </p>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <h3 className="text-xl md:text-2xl text-white mb-4 md:mb-6">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'For You', color: 'text-purple-300', description: 'Explore Still Moments, join Live Threads, save moments in your Garden' },
              { title: 'For Hosts', color: 'text-pink-300', description: 'Share your world on your terms — no scripts, no performance' },
              { title: 'For Everyone', color: 'text-blue-300', description: 'Quiet Mode, no ads, no algorithms' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 md:p-6 hover:border-white/20 transition-all duration-300"
              >
                <h4 className={`text-base md:text-lg ${item.color} mb-2 md:mb-3`}>{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Ethical Pledge */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <h3 className="text-xl md:text-2xl text-white mb-4 md:mb-6">Our Ethical Pledge</h3>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {pledges.map((pledge, index) => {
              const Icon = pledge.icon;
              return (
                <motion.div
                  key={pledge.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  className="bg-slate-900/50 border border-white/10 rounded-xl p-4 md:p-5 flex items-start gap-3 md:gap-4 hover:border-white/20 transition-all duration-300"
                >
                  <div className="bg-purple-500/20 p-2 md:p-2.5 rounded-lg flex-shrink-0">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <h4 className="text-sm md:text-base text-white">{pledge.title}</h4>
                    </div>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{pledge.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Supporting the Ecosystem */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <h3 className="text-xl md:text-2xl text-white mb-2 md:mb-3">Supporting the Ecosystem</h3>
          <p className="text-sm md:text-base text-slate-400 mb-4 md:mb-6">
            <span className="text-purple-300 font-medium">70%</span> goes directly to hosts • 
            <span className="ml-2">Free tier exists for basic access</span> • 
            <span className="ml-2">No ads, no data selling</span>
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 md:p-6 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${tier.color} p-2 md:p-2.5 mb-3 md:mb-4 flex items-center justify-center`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h4 className="text-base md:text-lg text-white mb-1 md:mb-2">{tier.name}</h4>
                  <p className="text-xl md:text-2xl text-purple-300 mb-2 md:mb-3">{tier.price}</p>
                  <p className="text-xs md:text-sm text-slate-300 mb-2 md:mb-3 leading-relaxed">{tier.description}</p>
                  <p className="text-xs text-slate-500 italic">{tier.reason}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 md:p-6"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="bg-purple-500/20 p-2 rounded-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm md:text-base text-purple-300 mb-2">Giving Back</h4>
                <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-300">
                  <p><span className="text-purple-400 font-medium">5% for Good:</span> Revenue funds Host Scholarships in underserved regions</p>
                  <p><span className="text-purple-400 font-medium">User Grants:</span> Let members vote on which new locations to add</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Verified Hosts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <h3 className="text-xl md:text-2xl text-white mb-4 md:mb-6">Verified Hosts</h3>
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
              {/* Verified Badge */}
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                      <Shield className="w-8 h-8 md:w-10 md:h-10 text-purple-300" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 md:p-1.5 border-2 border-slate-900">
                    <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg md:text-xl text-white mb-3 md:mb-4">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Wandersphere Verified
                  </span> means:
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {verifiedMeans.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                      className="flex items-start gap-2 md:gap-3"
                    >
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-xs md:text-sm leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 md:p-12">
            <h3 className="text-xl md:text-2xl text-white mb-3 md:mb-4">Ready to explore differently?</h3>
            <p className="text-sm md:text-base text-slate-400 mb-6 md:mb-8 max-w-xl mx-auto">
              Join us in building a platform that values presence over performance, and connection over consumption.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl"
            >
              Join the Waitlist
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}