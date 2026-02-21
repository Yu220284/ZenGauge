'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getUserFavorites, toggleUserFavorite } from '@/lib/supabase/database';

export function useSupabaseFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setError(null);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser?.id) {
          const { data: userFavorites, error: favError } = await getUserFavorites(currentUser.id);
          if (favError) {
            console.error('Failed to load favorites:', favError);
            setError('お気に入りの読み込みに失敗しました');
          } else {
            setFavorites(userFavorites || []);
          }
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setError('お気に入りの読み込みに失敗しました');
      } finally {
        setIsLoaded(true);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (sessionId: string) => {
    if (!user?.id) {
      setError('ログインが必要です');
      return;
    }
    
    try {
      const { error: toggleError } = await toggleUserFavorite(user.id, sessionId);
      if (toggleError) {
        console.error('Failed to toggle favorite:', toggleError);
        setError('お気に入りの更新に失敗しました');
      } else {
        setFavorites(prev => 
          prev.includes(sessionId) 
            ? prev.filter(id => id !== sessionId)
            : [...prev, sessionId]
        );
        setError(null);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setError('お気に入りの更新に失敗しました');
    }
  };

  const isFavorite = (sessionId: string) => {
    return favorites.includes(sessionId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoaded,
    user,
    error
  };
}