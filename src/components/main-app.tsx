import React, { useState, useEffect } from 'react';
import { OnboardingChoice } from '../App';
import { Navigation } from './navigation';
import { ExplorePage } from './explore-page';
import { LiveThreadsPage } from './live-threads-page';
import { MemoryGarden } from './memory-garden';
import { SharePresencePage } from './share-presence-page';
import { OurPromisePage } from './our-promise-page';
import { WaitlistPage } from './waitlist-page';
import { ExperienceViewer } from './experience-viewer';
import { LiveThreadViewer } from './live-thread-viewer';
import { AylaGuide } from './ayla-guide';
import { Experience, LiveThread } from '../data/mock-data';

interface MainAppProps {
  initialChoice: OnboardingChoice;
}

export type Page = 'explore' | 'live' | 'garden' | 'share' | 'promise' | 'waitlist';

export function MainApp({ initialChoice }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (initialChoice === 'presence') return 'explore';
    if (initialChoice === 'connect') return 'live';
    return 'explore';
  });

  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedLiveThread, setSelectedLiveThread] = useState<LiveThread | null>(null);
  const [showAyla, setShowAyla] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page: 'explore' | 'live-threads' | 'memory-garden') => {
    setSelectedExperience(null);
    setSelectedLiveThread(null);
    if (page === 'explore') setCurrentPage('explore');
    else if (page === 'live-threads') setCurrentPage('live');
    else if (page === 'memory-garden') setCurrentPage('garden');
    window.scrollTo(0, 0);
  };

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
        <ExplorePage onExperienceSelect={handleExperienceSelect} />
      )}

      {currentPage === 'live' && (
        <LiveThreadsPage onThreadSelect={handleLiveThreadSelect} />
      )}

      {currentPage === 'garden' && (
        <MemoryGarden onExperienceSelect={handleExperienceSelect} />
      )}

      {currentPage === 'share' && (
        <SharePresencePage />
      )}

      {currentPage === 'promise' && (
        <OurPromisePage
          onJoinWaitlist={() => setCurrentPage('waitlist')}
        />
      )}

      {currentPage === 'waitlist' && (
        <WaitlistPage
          onBack={() => setCurrentPage('promise')}
        />
      )}

      <AylaGuide
        isOpen={showAyla}
        onClose={() => setShowAyla(false)}
        currentPage={currentPage === 'waitlist' ? 'promise' : currentPage}
      />
    </div>
  );
}
