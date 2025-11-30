import { useAuth } from '@/contexts/AuthContext';
import { router, usePathname, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = pathname === '/intro/onboarding' || pathname === '/auth/login' || pathname === '/auth/register';
    const isProtectedRoute = segments[0] === '(tabs)';

    if (!hasCompletedOnboarding && !isPublicRoute) {
      router.replace('/intro/onboarding');
      return;
    }

    if (hasCompletedOnboarding && !isAuthenticated && isProtectedRoute) {
      router.replace('/auth/login');
      return;
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace('/(tabs)/home');
      return;
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, segments, pathname]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

