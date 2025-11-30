import { TIMER_DURATIONS, TimerMode } from '@/components/screens/focus/TimerDisplay';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useTimer(mode: TimerMode) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeLeft(TIMER_DURATIONS[mode]);
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [mode]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start();
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as NodeJS.Timeout;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, animatedValue]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  return {
    timeLeft,
    isRunning,
    isPaused,
    animatedValue,
    handleStart,
    handlePause,
    handleReset,
  };
}

