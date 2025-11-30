import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface WelcomeButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function WelcomeButton({ label, onPress, variant = 'primary' }: WelcomeButtonProps) {
  const { colors, isDark } = useTheme();

  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? colors.tint : 'transparent',
          borderColor: isPrimary ? colors.tint : colors.tabIconDefault,
          borderWidth: isPrimary ? 0 : 2,
        },
      ]}
      onPress={onPress}>
      <ThemedText
        style={[
          styles.buttonText,
          {
            color: isPrimary
              ? isDark
                ? '#000'
                : '#fff'
              : colors.text,
            fontWeight: isPrimary ? '600' : '500',
          },
        ]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

