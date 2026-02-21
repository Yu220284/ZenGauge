"use client";

import { useState, useEffect } from 'react';

const AUTH_KEY = 'wellv_auth_user';

interface User {
  email: string;
  displayName: string;
  userId?: string;
  profileImage?: string;
  isTrainer?: boolean;
  streamLinks?: { platform: string; url: string }[];
  tags?: string[];
  onboardingCompleted?: boolean;
}

export function useLocalAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const userJson = localStorage.getItem(AUTH_KEY);
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const signIn = (email: string, password: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('wellv_users') || '[]');
    const user = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const authUser = { email: user.email, displayName: user.displayName, profileImage: user.profileImage, isTrainer: user.isTrainer, streamLinks: user.streamLinks };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signUp = (email: string, password: string, displayName: string, userId?: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('wellv_users') || '[]');
    
    if (storedUsers.find((u: any) => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    
    const generatedUserId = userId || `user_${Date.now()}`;
    storedUsers.push({ email, password, displayName, userId: generatedUserId, onboardingCompleted: false });
    localStorage.setItem('wellv_users', JSON.stringify(storedUsers));
    
    const authUser = { email, displayName, userId: generatedUserId, onboardingCompleted: false };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { success: true };
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    const storedUsers = JSON.parse(localStorage.getItem('wellv_users') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.email === user.email);
    
    if (userIndex !== -1) {
      storedUsers[userIndex] = { ...storedUsers[userIndex], ...updates };
      localStorage.setItem('wellv_users', JSON.stringify(storedUsers));
      
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return {
    user,
    isLoaded,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
