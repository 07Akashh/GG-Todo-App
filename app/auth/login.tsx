import { AuthButton } from '@/components/screens/auth/AuthButton';
import { AuthHeader } from '@/components/screens/auth/AuthHeader';
import { AuthInput } from '@/components/screens/auth/AuthInput';
import { AuthLink } from '@/components/screens/auth/AuthLink';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearError, login as loginAction } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Navigate to home when authenticated
    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Show error alert if there's an error
    if (error) {
      Alert.alert('Login Failed', error, [
        {
          text: 'OK',
          onPress: () => dispatch(clearError()),
        },
      ]);
    }
  }, [error, dispatch]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    dispatch(loginAction({ email: email.trim(), password: password.trim() }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ThemedView style={styles.content}>
        <AuthHeader
          icon="checkmark.circle.fill"
          title="Welcome Back"
          subtitle="Sign in to continue to your tasks"
        />

        <AuthInput
          icon="envelope.fill"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
        />

        <AuthInput
          icon="lock.fill"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <AuthButton label="Sign In" onPress={handleLogin} isLoading={isLoading} />

        <AuthLink
          text="Don't have an account?"
          linkText="Sign Up"
          onPress={() => router.push('/auth/register')}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
});
