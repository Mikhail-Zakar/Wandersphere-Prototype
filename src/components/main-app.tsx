import React, { useState, useEffect } from 'react';
import { OnboardingChoice } from '../App';
import { Navigation } from './navigation';
import { ExplorePage } from './explore-page';
import { LiveThreadsPage } from './live-threads-page';
import { MemoryGarden } from './memory-garden';
import { SharePresencePage } from './share-presence-page';
import { ExperienceViewer } from './experience-viewer';
import { LiveThreadViewer } from './live-thread-viewer';
import { AylaGuide } from './ayla-guide';
import { Experience, LiveThread } from '../data/mock-data';

interface MainAppProps {
  initialChoice: OnboardingChoice;
}

export type Page = 'explore' | 'live' | 'garden' | 'share';

export function MainApp({ initialChoice }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (initialChoice === 'presence') return 'explore';
    if (initialChoice === 'connect') return 'live';
    return 'explore';
  });
  
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedLiveThread, setSelectedLiveThread] = useState<LiveThread | null>(null);
  const [quietMode, setQuietMode] = useState(initialChoice === 'quiet');
  const [showAyla, setShowAyla] = useState(false);

  const handleExperienceSelect = (experience: Experience) => {
    setSelectedExperience(experience);
  };

  const handleLiveThreadSelect = (thread: LiveThread) => {
    setSelectedLiveThread(thread);
  };

  const handleBack = () => {
    setSelectedExperience(null);
    setSelectedLiveThread(null);
  };

  // Show different content based on current state
  if (selectedExperience) {
    return (
      <ExperienceViewer
        experience={selectedExperience}
        onBack={handleBack}
        quietMode={quietMode}
      />
    );
  }

  if (selectedLiveThread) {
    return (
      <LiveThreadViewer
        thread={selectedLiveThread}
        onBack={handleBack}
        quietMode={quietMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        quietMode={quietMode}
        onQuietModeToggle={() => setQuietMode(!quietMode)}
        onAylaClick={() => setShowAyla(true)}
      />

      {currentPage === 'explore' && (
        <ExplorePage
          onExperienceSelect={handleExperienceSelect}
          quietMode={quietMode}
        />
      )}

      {currentPage === 'live' && (
        <LiveThreadsPage
          onThreadSelect={handleLiveThreadSelect}
          quietMode={quietMode}
        />
      )}

      {currentPage === 'garden' && (
        <MemoryGarden 
          quietMode={quietMode}
          onExperienceSelect={handleExperienceSelect}
        />
      )}

      {currentPage === 'share' && (
        <SharePresencePage quietMode={quietMode} />
      )}

      {!quietMode && (
        <AylaGuide
          isOpen={showAyla}
          onClose={() => setShowAyla(false)}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}