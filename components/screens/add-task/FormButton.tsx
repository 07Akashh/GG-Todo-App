import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

interface FormButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function FormButton({ label, onPress, isLoading = false, disabled = false }: FormButtonProps) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.saveButton,
        { backgroundColor: colors.tint },
        (isLoading || disabled) && { opacity: 0.6 },
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}>
      {isLoading ? (
        <ActivityIndicator color={isDark ? '#000' : '#fff'} />
      ) : (
        <ThemedText style={[styles.saveButtonText, { color: isDark ? '#000' : '#fff' }]}>
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

