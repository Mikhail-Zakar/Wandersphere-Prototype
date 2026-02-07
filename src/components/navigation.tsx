import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Radio, Flower2, Eye, EyeOff, Sparkles, Heart, Menu, Shield } from 'lucide-react';
import { Page } from './main-app';
import { Button } from './ui/button';
import { WandersphereLogo } from './wandersphere-logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onAylaClick: () => void;
}

export function Navigation({
  currentPage,
  onPageChange,
  onAylaClick,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const navItems = [
    { id: 'explore' as const, label: 'Explore', icon: Compass },
    { id: 'live' as const, label: 'Live Threads', icon: Radio },
    { id: 'garden' as const, label: 'Memory Garden', icon: Flower2 },
    { id: 'promise' as const, label: 'Our Promise', icon: Shield },
    { id: 'share' as const, label: 'Share', icon: Heart },
  ];

  const handleNavClick = (page: Page) => {
    onPageChange(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Quiet Mode Icon - No functionality */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-3 right-4 md:top-4 md:right-6 z-[60] p-2.5 md:p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-none"
        title="Quiet Mode (Coming Soon)"
      >
        <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
      </motion.div>

      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Menu Button - Shown on left for mobile */}
              <Button
                onClick={() => setMobileMenuOpen(true)}
                variant="ghost"
                size="sm"
                className="md:hidden text-white hover:bg-white/10 -ml-2"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Logo - Hidden on mobile, shown on desktop */}
              <WandersphereLogo className="hidden md:block w-10 h-10" style={{ transform: 'scale(1)' }} />

              {/* Desktop Nav Items */}
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
            <div className="flex items-center gap-2 md:gap-4 pr-12 md:pr-14">
              {/* Ayla Button - Hidden on mobile, shown in sidebar instead */}
              <Button
                onClick={onAylaClick}
                variant="ghost"
                size="sm"
                className="hidden md:flex text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs md:text-sm"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-purple-400" />
                Ayla
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="bg-slate-900 border-slate-700 text-white w-[280px]">
          <SheetHeader className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <WandersphereLogo className="w-10 h-10" style={{ transform: 'scale(1)' }} />
              <SheetTitle className="text-white text-xl">Wandersphere</SheetTitle>
            </div>
            <SheetDescription className="sr-only">
              Navigation menu for Wandersphere
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col gap-2 mt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left
                    ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-base">{item.label}</span>
                </button>
              );
            })}
            
            {/* Ayla Button in Sidebar */}
            <button
              onClick={() => {
                onAylaClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 mt-4 border-t border-white/10 pt-6"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-base">Ask Ayla</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
