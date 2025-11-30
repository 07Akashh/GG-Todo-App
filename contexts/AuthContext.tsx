import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { completeOnboarding as completeOnboardingAction, loadAuthState, logout as logoutAction } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated, hasCompletedOnboarding } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutAction());
    router.replace('/intro/welcome');
  };

  const handleCompleteOnboarding = async () => {
    await dispatch(completeOnboardingAction());
  };

  // Map Redux user to context user format
  const contextUser = user
    ? {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        lastLogin: user.lastLogin,
        status: user.status,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user: contextUser,
        isLoading,
        isAuthenticated,
        hasCompletedOnboarding,
        completeOnboarding: handleCompleteOnboarding,
        logout: handleLogout,
      }}>
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
