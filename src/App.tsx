import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing-page';
import { OnboardingFlow } from './components/onboarding-flow';
import { MainApp } from './components/main-app';
import { Toaster } from './components/ui/sonner';

export type OnboardingChoice = 'presence' | 'connect' | 'quiet' | null;

export default function App() {
  const [hasVisited, setHasVisited] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingChoice, setOnboardingChoice] = useState<OnboardingChoice>(null);

  useEffect(() => {
    // Set document title
    document.title = 'Wandersphere Prototype';
    
    // Check if user has visited before
    const visited = localStorage.getItem('wandersphere_visited');
    const onboarded = localStorage.getItem('wandersphere_onboarded');
    const choice = localStorage.getItem('wandersphere_choice') as OnboardingChoice;
    
    if (visited) setHasVisited(true);
    if (onboarded) {
      setHasCompletedOnboarding(true);
      setOnboardingChoice(choice);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem('wandersphere_visited', 'true');
    setHasVisited(true);
  };

  const handleOnboardingComplete = (choice: OnboardingChoice) => {
    localStorage.setItem('wandersphere_onboarded', 'true');
    localStorage.setItem('wandersphere_choice', choice || '');
    setOnboardingChoice(choice);
    setHasCompletedOnboarding(true);
  };

  return (
    <>
      {!hasVisited && <LandingPage onEnter={handleEnter} />}
      {hasVisited && !hasCompletedOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
      {hasVisited && hasCompletedOnboarding && <MainApp initialChoice={onboardingChoice} />}
      <Toaster position="bottom-right" />
    </>
  );
}