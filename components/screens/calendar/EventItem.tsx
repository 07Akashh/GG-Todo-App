import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CalendarEvent } from './CalendarGrid';

interface EventItemProps {
  event: CalendarEvent;
  onPress?: (event: CalendarEvent) => void;
}

export function EventItem({ event, onPress }: EventItemProps) {
  const { colors, isDark } = useTheme();

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return '#3B82F6';
      case 'task':
        return colors.tint;
      case 'reminder':
        return '#F59E0B';
      default:
        return colors.tabIconDefault;
    }
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'video.fill';
      case 'task':
        return 'checkmark.circle.fill';
      case 'reminder':
        return 'bell.fill';
      default:
        return 'circle.fill';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.eventItem,
        {
          backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          borderLeftColor: getEventTypeColor(event.type),
        },
      ]}
      onPress={() => onPress?.(event)}
      activeOpacity={0.7}>
      <View style={styles.eventIconContainer}>
        <IconSymbol
          name={getEventTypeIcon(event.type)}
          size={24}
          color={getEventTypeColor(event.type)}
        />
      </View>
      <View style={styles.eventContent}>
        <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
        <ThemedText style={styles.eventTime}>{event.time}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    gap: 12,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    opacity: 0.6,
  },
});

