'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalAuth } from '@/lib/hooks/use-local-auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useLocalAuth();
  const router = useRouter();

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('wellv_onboarding_completed') === 'true';
    
    if (isLoaded && !user && !onboardingCompleted) {
      router.push('/language-select');
    } else if (isLoaded && user && !user.onboardingCompleted && !onboardingCompleted) {
      router.push('/onboarding/profile');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  const onboardingCompleted = typeof window !== 'undefined' && localStorage.getItem('wellv_onboarding_completed') === 'true';
  
  if ((!user || !user.onboardingCompleted) && !onboardingCompleted) {
    return null;
  }

  return <>{children}</>;
}