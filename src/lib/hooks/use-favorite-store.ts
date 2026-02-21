"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'wellv_favorites';

export function useFavoriteStore() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const favoritesJson = localStorage.getItem(FAVORITES_KEY);
      if (favoritesJson) {
        setFavorites(JSON.parse(favoritesJson));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((sessionId: string) => {
    return favorites.includes(sessionId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
  };
}
