import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NavigationButtonsProps {
  currentIndex: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

export function NavigationButtons({
  currentIndex,
  totalPages,
  onNext,
  onPrevious,
  onSkip,
  onFinish,
}: NavigationButtonsProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.buttonContainer}>
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onPrevious}>
          <ThemedText style={[styles.buttonText, { color: colors.tint }]}>
            Previous
          </ThemedText>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, styles.primaryButton, { backgroundColor: colors.tint }]}
        onPress={currentIndex === totalPages - 1 ? onFinish : onNext}>
        <ThemedText style={[styles.buttonText, { color: isDark ? '#000' : '#fff' }]}>
          {currentIndex === totalPages - 1 ? 'Get Started' : 'Next'}
        </ThemedText>
      </TouchableOpacity>
      {currentIndex < totalPages - 1 && (
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={onSkip}>
          <ThemedText style={[styles.buttonText, { color: colors.tabIconDefault }]}>
            Skip
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    minWidth: 120,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

