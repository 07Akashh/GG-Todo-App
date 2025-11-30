import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StatsDisplayProps {
  sessionsToday?: number;
  focusTime?: string;
}

export function StatsDisplay({ sessionsToday = 0, focusTime = '0h 0m' }: StatsDisplayProps) {
  return (
    <View style={styles.stats}>
      <View style={styles.statItem}>
        <ThemedText style={styles.statValue}>{sessionsToday}</ThemedText>
        <ThemedText style={styles.statLabel}>Sessions Today</ThemedText>
      </View>
      <View style={styles.statItem}>
        <ThemedText style={styles.statValue}>{focusTime}</ThemedText>
        <ThemedText style={styles.statLabel}>Focus Time</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

