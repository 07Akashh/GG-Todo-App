import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Priority } from './TaskForm';

interface PrioritySelectorProps {
  selectedPriority: Priority;
  onSelect: (priority: Priority) => void;
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
];

export function PrioritySelector({ selectedPriority, onSelect }: PrioritySelectorProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.priorityContainer}>
      {priorities.map((p) => (
        <TouchableOpacity
          key={p.value}
          style={[
            styles.priorityButton,
            {
              backgroundColor:
                selectedPriority === p.value ? p.color : isDark ? '#1F1F1F' : '#F5F5F5',
              borderColor: selectedPriority === p.value ? p.color : colors.tabIconDefault,
            },
          ]}
          onPress={() => onSelect(p.value)}>
          <ThemedText
            style={[
              styles.priorityText,
              { color: selectedPriority === p.value ? (isDark ? '#000' : '#fff') : colors.text },
            ]}>
            {p.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

