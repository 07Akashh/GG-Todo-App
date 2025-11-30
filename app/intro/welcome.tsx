import { WelcomeScreen } from '@/components/screens/welcome/WelcomeScreen';
import { router } from 'expo-router';
import React from 'react';

export default function WelcomePage() {
  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  return <WelcomeScreen onLogin={handleLogin} onRegister={handleRegister} />;
}

