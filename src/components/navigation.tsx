import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Radio, Flower2, Moon, Sun, Sparkles, Heart } from 'lucide-react';
import { Page } from './main-app';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  quietMode: boolean;
  onQuietModeToggle: () => void;
  onAylaClick: () => void;
}

export function Navigation({
  currentPage,
  onPageChange,
  quietMode,
  onQuietModeToggle,
  onAylaClick,
}: NavigationProps) {
  const navItems = [
    { id: 'explore' as const, label: 'Explore', icon: Compass },
    { id: 'live' as const, label: 'Live Threads', icon: Radio },
    { id: 'garden' as const, label: 'Memory Garden', icon: Flower2 },
    { id: 'share' as const, label: 'Share', icon: Heart },
  ];

  return (
    <>
      {/* Floating Quiet Mode Toggle - Always visible */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onQuietModeToggle}
        className="fixed top-6 right-6 z-[60] p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 hover:bg-slate-800/90 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
        title={quietMode ? "Exit Quiet Mode" : "Enter Quiet Mode"}
      >
        {quietMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.button>

      {/* Main Navigation - Hidden in Quiet Mode */}
      <AnimatePresence>
        {!quietMode && (
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-8">
                  <h1 className="text-xl tracking-tight text-white">
                    Wandersphere
                  </h1>

                  {/* Nav Items */}
                  <div className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => onPageChange(item.id)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                            ${isActive
                              ? 'bg-white/10 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-4 mr-16">
                  {/* Ayla Button */}
                  <Button
                    onClick={onAylaClick}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ayla
                  </Button>
                </div>
              </div>

              {/* Mobile Nav */}
              <div className="md:hidden flex items-center gap-2 mt-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={`
                        flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}