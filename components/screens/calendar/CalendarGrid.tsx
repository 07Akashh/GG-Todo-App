import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'task' | 'meeting' | 'reminder';
  priority?: number;
}

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
}

export function CalendarGrid({ currentDate, selectedDate, events, onDateSelect }: CalendarGridProps) {
  const { colors, isDark } = useTheme();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasEvents = (day: number) => {
    return events.some(
      (e) => new Date(e.date).getDate() === day &&
        new Date(e.date).getMonth() === currentDate.getMonth() &&
        new Date(e.date).getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarGrid}>
        {dayNames.map((day) => (
          <View key={day} style={styles.dayNameContainer}>
            <ThemedText style={styles.dayName}>{day}</ThemedText>
          </View>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dayCell} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === currentDate.getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();
          const isSelected = day === selectedDate.getDate() &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayCell,
                isToday && { backgroundColor: colors.tint },
                isSelected && !isToday && { backgroundColor: colors.tint + '40' },
              ]}
              onPress={() => onDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}>
              <ThemedText
                style={[
                  styles.dayNumber,
                  (isToday || isSelected) && { color: isDark ? '#000' : '#fff', fontWeight: 'bold' },
                ]}>
                {day}
              </ThemedText>
              {hasEvents(day) && (
                <View
                  style={[
                    styles.eventDot,
                    { backgroundColor: (isToday || isSelected) ? (isDark ? '#000' : '#fff') : colors.tint },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginBottom: 32,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
  dayNameContainer: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

