import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarEvent } from './CalendarGrid';
import { EventItem } from './EventItem';

interface EventListProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventPress?: (event: CalendarEvent) => void;
}

export function EventList({ events, selectedDate, onEventPress }: EventListProps) {
  const { colors } = useTheme();

  if (events.length === 0) {
    return (
      <View style={styles.emptyEvents}>
        <IconSymbol name="calendar" size={48} color={colors.tabIconDefault} />
        <ThemedText style={styles.emptyText}>No events scheduled</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.eventsSection}>
      <ThemedText type="subtitle" style={styles.eventsTitle}>
        Events for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </ThemedText>
      <View style={styles.eventsList}>
        {events.map((event) => (
          <EventItem key={event.id} event={event} onPress={onEventPress} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventsSection: {
    marginBottom: 20,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  eventsList: {
    gap: 12,
  },
  emptyEvents: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.6,
  },
});

