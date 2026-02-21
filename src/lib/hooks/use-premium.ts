'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wellv-premium';
const AD_PREF_KEY = 'wellv-ad-preference';

interface PremiumData {
  isPremium: boolean;
  premiumUntil: string | null;
}

const getPremiumData = (): PremiumData => {
  if (typeof window === 'undefined') return { isPremium: false, premiumUntil: null };
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { isPremium: false, premiumUntil: null };
  return JSON.parse(data);
};

const setPremiumData = (data: PremiumData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getAdPreference = (): boolean => {
  if (typeof window === 'undefined') return true;
  const pref = localStorage.getItem(AD_PREF_KEY);
  return pref === null ? true : pref === 'true';
};

const setAdPreference = (show: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AD_PREF_KEY, String(show));
};

export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [showAds, setShowAds] = useState(true);

  useEffect(() => {
    const data = getPremiumData();
    setIsPremium(data.isPremium);
    setPremiumUntil(data.premiumUntil);
    setShowAds(getAdPreference());
  }, []);

  const setPremium = (premium: boolean, until?: string) => {
    const data = { isPremium: premium, premiumUntil: until || null };
    setPremiumData(data);
    setIsPremium(premium);
    setPremiumUntil(until || null);
  };

  const toggleAds = () => {
    const newValue = !showAds;
    setAdPreference(newValue);
    setShowAds(newValue);
  };

  const checkPremiumStatus = () => {
    const data = getPremiumData();
    if (!data.isPremium) return false;
    if (!data.premiumUntil) return true;
    const now = new Date();
    const until = new Date(data.premiumUntil);
    if (now > until) {
      setPremium(false);
      return false;
    }
    return true;
  };

  return { isPremium, premiumUntil, showAds, setPremium, toggleAds, checkPremiumStatus };
};
