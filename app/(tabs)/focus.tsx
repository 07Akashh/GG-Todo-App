import { FocusHeader } from '@/components/screens/focus/FocusHeader';
import { ModeSelector } from '@/components/screens/focus/ModeSelector';
import { StatsDisplay } from '@/components/screens/focus/StatsDisplay';
import { TimerControls } from '@/components/screens/focus/TimerControls';
import { TimerDisplay, TimerMode } from '@/components/screens/focus/TimerDisplay';
import { ThemedView } from '@/components/themed-view';
import { useTimer } from '@/hooks/use-timer';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function FocusScreen() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const { timeLeft, isRunning, isPaused, animatedValue, handleStart, handlePause, handleReset } =
    useTimer(mode);

  return (
    <ThemedView style={styles.container}>
      <FocusHeader />
      <ModeSelector selectedMode={mode} onSelect={setMode} />
      <TimerDisplay timeLeft={timeLeft} mode={mode} animatedValue={animatedValue} />
      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />
      <StatsDisplay />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
  },
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
  },
  modeLabel: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
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
  stats: {
    flexDirection: 'row',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
});

