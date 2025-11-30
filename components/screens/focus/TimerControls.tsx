import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, isPaused, onStart, onPause, onReset }: TimerControlsProps) {
  const { colors, isDark } = useTheme();

  if (!isRunning && !isPaused) {
    return (
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.startButton, { backgroundColor: colors.tint }]}
          onPress={onStart}>
          <IconSymbol name="play.fill" size={24} color={isDark ? '#000' : '#fff'} />
          <ThemedText style={[styles.controlButtonText, { color: isDark ? '#000' : '#fff' }]}>
            Start
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (isRunning) {
    return (
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.pauseButton, { borderColor: colors.tint }]}
          onPress={onPause}>
          <IconSymbol name="pause.fill" size={24} color={colors.tint} />
          <ThemedText style={[styles.controlButtonText, { color: colors.tint }]}>
            Pause
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.controls}>
      <TouchableOpacity
        style={[styles.controlButton, styles.startButton, { backgroundColor: colors.tint }]}
        onPress={onStart}>
        <IconSymbol name="play.fill" size={24} color={isDark ? '#000' : '#fff'} />
        <ThemedText style={[styles.controlButtonText, { color: isDark ? '#000' : '#fff' }]}>
          Resume
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.controlButton, styles.resetButton, { borderColor: colors.tabIconDefault }]}
        onPress={onReset}>
        <IconSymbol name="arrow.clockwise" size={24} color={colors.tabIconDefault} />
        <ThemedText style={[styles.controlButtonText, { color: colors.tabIconDefault }]}>
          Reset
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButton: {
    minWidth: 120,
  },
  pauseButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  resetButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

