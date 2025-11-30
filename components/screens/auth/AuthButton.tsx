import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AuthButton({ label, onPress, isLoading = false, disabled = false }: AuthButtonProps) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.tint },
        (isLoading || disabled) && { opacity: 0.6 },
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}>
      {isLoading ? (
        <ActivityIndicator color={isDark ? '#000' : '#fff'} />
      ) : (
        <ThemedText style={[styles.buttonText, { color: isDark ? '#000' : '#fff' }]}>
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

