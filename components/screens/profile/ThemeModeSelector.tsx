import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemeMode, useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const themeModes: { value: ThemeMode; label: string; icon: 'sun.max.fill' | 'moon.fill' | 'circle.lefthalf.filled' }[] = [
  { value: 'light', label: 'Light', icon: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', icon: 'moon.fill' },
  { value: 'auto', label: 'Auto', icon: 'circle.lefthalf.filled' },
];

export function ThemeModeSelector() {
  const { colors, isDark, themeMode, setThemeMode } = useTheme();

  return (
    <View style={styles.themeModeContainer}>
      <ThemedText style={styles.settingLabel}>Theme Mode</ThemedText>
      <View style={styles.themeModeButtons}>
        {themeModes.map((mode) => (
          <TouchableOpacity
            key={mode.value}
            style={[
              styles.themeModeButton,
              {
                backgroundColor:
                  themeMode === mode.value ? colors.tint : isDark ? '#1F1F1F' : '#F5F5F5',
                borderColor: themeMode === mode.value ? colors.tint : colors.tabIconDefault,
              },
            ]}
            onPress={() => setThemeMode(mode.value)}>
            <IconSymbol
              name={mode.icon}
              size={20}
              color={themeMode === mode.value ? (isDark ? '#000' : '#fff') : colors.text}
            />
            <ThemedText
              style={[
                styles.themeModeText,
                {
                  color:
                    themeMode === mode.value
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
    </View>
  );
}

const styles = StyleSheet.create({
  themeModeContainer: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    opacity: 0.8,
  },
  themeModeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  themeModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  themeModeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

