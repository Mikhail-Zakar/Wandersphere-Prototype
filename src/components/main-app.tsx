import React, { useState, useEffect } from 'react';
import { OnboardingChoice } from '../App';
import { Navigation } from './navigation';
import { ExplorePage } from './explore-page';
import { LiveThreadsPage } from './live-threads-page';
import { MemoryGarden } from './memory-garden';
import { SharePresencePage } from './share-presence-page';
import { OurPromisePage } from './our-promise-page';
import { ExperienceViewer } from './experience-viewer';
import { LiveThreadViewer } from './live-thread-viewer';
import { AylaGuide } from './ayla-guide';
import { Experience, LiveThread } from '../data/mock-data';

interface MainAppProps {
  initialChoice: OnboardingChoice;
}

export type Page = 'explore' | 'live' | 'garden' | 'share' | 'promise';

export function MainApp({ initialChoice }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (initialChoice === 'presence') return 'explore';
    if (initialChoice === 'connect') return 'live';
    return 'explore';
  });
  
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedLiveThread, setSelectedLiveThread] = useState<LiveThread | null>(null);
  const [showAyla, setShowAyla] = useState(false);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Scroll to top when opening experience or thread
  useEffect(() => {
    if (selectedExperience || selectedLiveThread) {
      window.scrollTo(0, 0);
    }
  }, [selectedExperience, selectedLiveThread]);

  const handleExperienceSelect = (experience: Experience) => {
    setSelectedExperience(experience);
  };

  const handleLiveThreadSelect = (thread: LiveThread) => {
    setSelectedLiveThread(thread);
  };

  const handleBack = () => {
    setSelectedExperience(null);
    setSelectedLiveThread(null);
    // Scroll to top when going back
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page: 'explore' | 'live-threads' | 'memory-garden') => {
    // Close current viewer
    setSelectedExperience(null);
    setSelectedLiveThread(null);
    
    // Navigate to the requested page
    if (page === 'explore') setCurrentPage('explore');
    else if (page === 'live-threads') setCurrentPage('live');
    else if (page === 'memory-garden') setCurrentPage('garden');
    
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Show different content based on current state
  if (selectedExperience) {
    return (
      <ExperienceViewer
        experience={selectedExperience}
        onBack={handleBack}
        onNavigate={handleNavigate}
      />
    );
  }

  if (selectedLiveThread) {
    return (
      <LiveThreadViewer
        thread={selectedLiveThread}
        onBack={handleBack}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAylaClick={() => setShowAyla(true)}
      />

      {currentPage === 'explore' && (
        <ExplorePage
          onExperienceSelect={handleExperienceSelect}
        />
      )}

      {currentPage === 'live' && (
        <LiveThreadsPage
          onThreadSelect={handleLiveThreadSelect}
        />
      )}

      {currentPage === 'garden' && (
        <MemoryGarden 
          onExperienceSelect={handleExperienceSelect}
        />
      )}

      {currentPage === 'share' && (
        <SharePresencePage />
      )}

      {currentPage === 'promise' && (
        <OurPromisePage />
      )}

      <AylaGuide
        isOpen={showAyla}
        onClose={() => setShowAyla(false)}
        currentPage={currentPage}
      />
    </div>
  );
}