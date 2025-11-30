import { useAuth } from '@/contexts/AuthContext';
import { router, usePathname, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useAuthRedirect() {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = 
      pathname === '/' || 
      pathname === '/intro/onboarding' || 
      pathname === '/intro/welcome' || 
      pathname === '/auth/login' || 
      pathname === '/auth/register';
    const isProtectedRoute = segments[0] === '(tabs)';

    // Don't redirect if on splash screen (root index)
    if (pathname === '/') {
      return;
    }

    if (!hasCompletedOnboarding && !isPublicRoute) {
      router.replace('/intro/onboarding');
      return;
    }

    if (hasCompletedOnboarding && !isAuthenticated && isProtectedRoute) {
      router.replace('/intro/welcome');
      return;
    }

    if (isAuthenticated && isPublicRoute && pathname !== '/') {
      router.replace('/(tabs)/home');
      return;
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, segments, pathname]);
}

