
"use client";

import { useState, useEffect, useCallback } from 'react';
import { isToday, isYesterday, differenceInCalendarDays, parseISO, startOfToday } from 'date-fns';
import type { LoggedSession } from '@/lib/types';

const SESSION_HISTORY_KEY = 'wellv_session_history';
const FAVORITES_KEY = 'wellv_favorites';

export function useSessionStore() {
  const [sessionHistory, setSessionHistory] = useState<LoggedSession[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const historyJson = localStorage.getItem(SESSION_HISTORY_KEY);
      const favoritesJson = localStorage.getItem(FAVORITES_KEY);

      if (historyJson) {
        setSessionHistory(JSON.parse(historyJson));
      }
      if (favoritesJson) {
        setFavorites(JSON.parse(favoritesJson));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveHistory = useCallback((history: LoggedSession[]) => {
    setSessionHistory(history);
    localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
  }, []);

  const saveFavorites = useCallback((favs: string[]) => {
    setFavorites(favs);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }, []);

  const addSession = useCallback((sessionId: string) => {
    const newSession: LoggedSession = {
      sessionId,
      completedAt: new Date().toISOString(),
    };
    saveHistory([...sessionHistory, newSession]);
  }, [sessionHistory, saveHistory]);

  const toggleFavorite = useCallback((sessionId: string) => {
    const newFavorites = favorites.includes(sessionId)
      ? favorites.filter(id => id !== sessionId)
      : [...favorites, sessionId];
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((sessionId: string) => {
    return favorites.includes(sessionId);
  }, [favorites]);

  const getTodayCount = useCallback(() => {
    if (!isLoaded) return 0;
    return sessionHistory.filter(s => isToday(parseISO(s.completedAt))).length;
  }, [sessionHistory, isLoaded]);

  const getUniqueSortedDates = useCallback(() => {
    return [...new Set(sessionHistory.map(s => s.completedAt.split('T')[0]))]
      .map(dateStr => parseISO(dateStr))
      .sort((a, b) => b.getTime() - a.getTime());
  }, [sessionHistory]);

  const getCurrentStreak = useCallback(() => {
    if (!isLoaded || sessionHistory.length === 0) return 0;
  
    const uniqueDates = getUniqueSortedDates();
    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const today = startOfToday();
    
    // Check if the last session was today or yesterday
    const lastSessionDate = uniqueDates[0];
    const diffFromToday = differenceInCalendarDays(today, lastSessionDate);

    if (diffFromToday <= 1) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const diff = differenceInCalendarDays(uniqueDates[i], uniqueDates[i+1]);
            if (diff === 1) {
                streak++;
            } else {
                break;
            }
        }
    }
  
    return streak;
  }, [sessionHistory, isLoaded, getUniqueSortedDates]);

  const isStreakBroken = useCallback(() => {
    if (!isLoaded || sessionHistory.length === 0) return false;
    
    const uniqueDates = getUniqueSortedDates();
    if (uniqueDates.length === 0) return false;

    const lastSessionDate = uniqueDates[0];
    const diffFromToday = differenceInCalendarDays(startOfToday(), lastSessionDate);
    
    // If the last session was more than a day ago, the streak is broken.
    return diffFromToday > 1;

  }, [sessionHistory, isLoaded, getUniqueSortedDates]);

  return {
    isLoaded,
    sessionHistory,
    addSession,
    getTodayCount,
    getCurrentStreak,
    isStreakBroken,
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
