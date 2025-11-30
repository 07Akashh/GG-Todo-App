import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export const TIMER_DURATIONS = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

interface TimerDisplayProps {
  timeLeft: number;
  mode: TimerMode;
  animatedValue: Animated.Value;
}

export function TimerDisplay({ timeLeft, mode, animatedValue }: TimerDisplayProps) {
  const { colors, isDark } = useTheme();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = (m: TimerMode) => {
    switch (m) {
      case 'pomodoro':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const progress = 1 - timeLeft / TIMER_DURATIONS[mode];
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <Animated.View style={[styles.timerContainer, { transform: [{ scale }] }]}>
      <View
        style={[
          styles.timerCircle,
          {
            borderColor: colors.tint,
            backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          },
        ]}>
        <View
          style={[
            styles.progressRing,
            {
              borderColor: colors.tint,
              borderWidth: 8,
              transform: [{ rotate: `${progress * 360}deg` }],
            },
          ]}
        />
        <ThemedText type="title" style={styles.timerText}>
          {formatTime(timeLeft)}
        </ThemedText>
        <ThemedText style={styles.modeLabel}>{getModeLabel(mode)}</ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    marginBottom: 40,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 140,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 72,   // <<< FIX
  },
  modeLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
});

