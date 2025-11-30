import { ThemedText } from '@/components/themed-text';
import { ColorTheme, useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const colorThemes: { value: ColorTheme; label: string; color: string }[] = [
  { value: 'default', label: 'Default', color: '#0a7ea4' },
  { value: 'blue', label: 'Blue', color: '#0066CC' },
  { value: 'green', label: 'Green', color: '#00AA44' },
  { value: 'purple', label: 'Purple', color: '#7C3AED' },
  { value: 'orange', label: 'Orange', color: '#EA580C' },
];

export function ColorThemeSelector() {
  const { colors, isDark, colorTheme, setColorTheme } = useTheme();

  return (
    <View style={styles.colorThemeContainer}>
      <ThemedText style={styles.settingLabel}>Color Theme</ThemedText>
      <View style={styles.colorThemeButtons}>
        {colorThemes.map((theme) => (
          <TouchableOpacity
            key={theme.value}
            style={[
              styles.colorThemeButton,
              {
                backgroundColor:
                  colorTheme === theme.value ? theme.color : isDark ? '#1F1F1F' : '#F5F5F5',
                borderColor: colorTheme === theme.value ? theme.color : colors.tabIconDefault,
              },
            ]}
            onPress={() => setColorTheme(theme.value)}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: colorTheme === theme.value ? (isDark ? '#000' : '#fff') : theme.color },
              ]}
            />
            <ThemedText
              style={[
                styles.colorThemeText,
                {
                  color:
                    colorTheme === theme.value
                      ? isDark
                        ? '#000'
                        : '#fff'
                      : colors.text,
                },
              ]}>
              {theme.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  colorThemeContainer: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    opacity: 0.8,
  },
  colorThemeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorThemeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    minWidth: 100,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  colorThemeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

