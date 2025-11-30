import { SplashScreen } from '@/components/screens/splash/SplashScreen';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function IndexScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (!showSplash && !isLoading) {
      // Navigate based on app state
      if (!hasCompletedOnboarding) {
        router.replace('/intro/onboarding');
      } else if (!isAuthenticated) {
        router.replace('/intro/welcome');
      } else {
        router.replace('/(tabs)/home');
      }
    }
  }, [showSplash, isLoading, isAuthenticated, hasCompletedOnboarding]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return null;
}
