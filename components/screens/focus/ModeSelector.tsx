import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TimerMode } from './TimerDisplay';

interface ModeSelectorProps {
  selectedMode: TimerMode;
  onSelect: (mode: TimerMode) => void;
}

const modes: { value: TimerMode; label: string }[] = [
  { value: 'pomodoro', label: 'Focus' },
  { value: 'shortBreak', label: 'Short Break' },
  { value: 'longBreak', label: 'Long Break' },
];

export function ModeSelector({ selectedMode, onSelect }: ModeSelectorProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.modeSelector}>
      {modes.map((mode) => (
        <TouchableOpacity
          key={mode.value}
          style={[
            styles.modeButton,
            {
              backgroundColor: selectedMode === mode.value ? colors.tint : isDark ? '#1F1F1F' : '#F5F5F5',
              borderColor: selectedMode === mode.value ? colors.tint : colors.tabIconDefault,
            },
          ]}
          onPress={() => onSelect(mode.value)}>
          <ThemedText
            style={[
              styles.modeText,
              {
                color:
                  selectedMode === mode.value
                    ? isDark
                      ? '#000'
                      : '#fff'
                    : colors.text,
              },
            ]}>
            {mode.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});

