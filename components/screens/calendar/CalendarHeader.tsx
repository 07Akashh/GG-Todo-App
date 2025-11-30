import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CalendarHeaderProps {
  selectedDate: Date;
}

export function CalendarHeader({ selectedDate }: CalendarHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText type="title" style={styles.title}>
        Calendar
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
});

