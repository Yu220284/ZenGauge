'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalAuth } from '@/lib/hooks/use-local-auth';

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, signIn: localSignIn, signOut: localSignOut } = useLocalAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  const signIn = async (email: string, password: string) => {
    const result = localSignIn(email, password);
    if (!result.success) {
      return { error: result.error };
    }
    return {};
  };

  const signOut = async () => {
    localSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}