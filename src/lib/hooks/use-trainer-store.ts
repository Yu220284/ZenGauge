"use client";

import { useState, useEffect, useCallback } from 'react';

const FOLLOWED_TRAINERS_KEY = 'wellv_followed_trainers';

export function useTrainerStore() {
  const [followedTrainers, setFollowedTrainers] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const followedJson = localStorage.getItem(FOLLOWED_TRAINERS_KEY);
      if (followedJson) {
        setFollowedTrainers(JSON.parse(followedJson));
      }
    } catch (error) {
      console.error("Failed to load followed trainers from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveFollowed = useCallback((followed: number[]) => {
    setFollowedTrainers(followed);
    localStorage.setItem(FOLLOWED_TRAINERS_KEY, JSON.stringify(followed));
  }, []);

  const isFollowing = useCallback((trainerId: number) => {
    return followedTrainers.includes(trainerId);
  }, [followedTrainers]);

  return {
    isLoaded,
    followedTrainers,
    isFollowing,
  };
}