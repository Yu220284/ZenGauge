"use client";

import { useState, useEffect } from 'react';

const FOLLOW_KEY = 'wellv_followed_trainers';

export function useFollowStore() {
  const [followedTrainers, setFollowedTrainers] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FOLLOW_KEY);
      if (stored) {
        setFollowedTrainers(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load followed trainers', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFollow = (trainerId: number) => {
    setFollowedTrainers(prev => {
      const newFollowed = prev.includes(trainerId)
        ? prev.filter(id => id !== trainerId)
        : [...prev, trainerId];
      localStorage.setItem(FOLLOW_KEY, JSON.stringify(newFollowed));
      return newFollowed;
    });
  };

  const isFollowing = (trainerId: number) => followedTrainers.includes(trainerId);

  return { followedTrainers, toggleFollow, isFollowing, isLoaded };
}
