import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Keyboard, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface KeyboardToolbarProps {
  title?: string;
  onDone?: () => void;
}

export function KeyboardToolbar({ title, onDone }: KeyboardToolbarProps) {
  const { colors, isDark } = useTheme();

  const handleDone = () => {
    Keyboard.dismiss();
    onDone?.();
  };

  if (Platform.OS !== 'ios') {
    return null; // Only show on iOS
  }

  return (
    <View
      style={[
        styles.toolbar,
        {
          backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      ]}>
      {title && <ThemedText style={styles.toolbarTitle}>{title}</ThemedText>}
      <TouchableOpacity
        onPress={handleDone}
        style={[styles.doneButton, { backgroundColor: colors.tint }]}>
        <ThemedText style={styles.doneButtonText}>Done</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    height: 44,
  },
  toolbarTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

