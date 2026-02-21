"use client";

import { useState, useEffect } from 'react';

const TUTORIAL_KEY = 'wellv_tutorial_active';
const TUTORIAL_STEP_KEY = 'wellv_tutorial_step';

export function useTutorial() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const checkTutorial = () => {
      const active = localStorage.getItem(TUTORIAL_KEY) === 'true';
      const step = parseInt(localStorage.getItem(TUTORIAL_STEP_KEY) || '0');
      setIsActive(active);
      setCurrentStep(step);
    };
    
    checkTutorial();
    const interval = setInterval(checkTutorial, 100);
    return () => clearInterval(interval);
  }, []);

  const startTutorial = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true');
    localStorage.setItem(TUTORIAL_STEP_KEY, '0');
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    const next = currentStep + 1;
    localStorage.setItem(TUTORIAL_STEP_KEY, next.toString());
    setCurrentStep(next);
  };

  const endTutorial = () => {
    localStorage.removeItem(TUTORIAL_KEY);
    localStorage.removeItem(TUTORIAL_STEP_KEY);
    setIsActive(false);
    setCurrentStep(0);
  };

  return { isActive, currentStep, startTutorial, nextStep, endTutorial };
}
