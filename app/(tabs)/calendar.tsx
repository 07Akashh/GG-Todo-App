import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

import { CalendarEvent } from "@/components/screens/calendar/CalendarGrid";
import { CalendarHeader } from "@/components/screens/calendar/CalendarHeader";
import { EventList } from "@/components/screens/calendar/EventList";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSheet } from "@/contexts/SheetContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppSelector } from "@/hooks/redux";
import { useCalendarTodos } from "@/hooks/useTodos";
import { Todo } from "@/services/todoService";

export default function CalendarScreen() {
  const { colors, isDark } = useTheme();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { openEditTask } = useSheet();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDateSelect = useCallback((day: { dateString: string }) => {
    setSelectedDate(new Date(day.dateString));
  }, []);

  // Fetch todos for calendar
  const { data, isLoading, error, refetch, isRefetching } = useCalendarTodos({
    accessToken,
    enabled: !!accessToken,
  });

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Get priority color: 1=low, 2=medium, 3=high, 4=critical
  const getPriorityColor = (priority?: number): string => {
    switch (priority) {
      case 1:
        return '#10B981'; // Low - Green
      case 2:
        return '#F59E0B'; // Medium - Orange
      case 3:
        return '#EF4444'; // High - Red
      case 4:
        return '#DC2626'; // Critical - Dark Red
      default:
        return colors.tint;
    }
  };

  // Store todos map for quick lookup
  const todosMap = useMemo(() => {
    if (!data?.todos) return new Map<string, Todo>();
    const map = new Map<string, Todo>();
    data.todos.forEach((todo: Todo) => {
      map.set(todo._id, todo);
    });
    return map;
  }, [data?.todos]);

  // Convert todos to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    if (!data?.todos) return [];

    return data.todos
      .filter((todo: Todo) => todo.dueDate) // Only include todos with due dates
      .map((todo: Todo) => {
        const dueDate = new Date(todo.dueDate);
        const dateStr = dueDate.toISOString().split('T')[0];
        const timeStr = dueDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return {
          id: todo._id,
          title: todo.title,
          date: dateStr,
          time: timeStr,
          type: 'task' as const,
          priority: todo.priority,
        };
      });
  }, [data?.todos]);

  // Handle event press - open edit task sheet
  const handleEventPress = useCallback(
    (event: CalendarEvent) => {
      const todo = todosMap.get(event.id);
      if (todo) {
        openEditTask(event.id, todo);
      }
    },
    [todosMap, openEditTask]
  );

  // Create event dots for calendar marking
  const eventDots = useMemo(() => {
    const map: Record<string, any> = {};

    events.forEach((event) => {
      const dateStr = event.date;

      if (!map[dateStr]) {
        map[dateStr] = { dots: [] };
      }

      // Use priority color for dots
      const dotColor = getPriorityColor(event.priority);

      map[dateStr].dots.push({
        key: event.id,
        color: dotColor,
      });
    });

    return map;
  }, [events, colors.tint]);

  const todayEvents = useMemo(() => {
    return events.filter(
      (e) => new Date(e.date).toDateString() === selectedDate.toDateString()
    );
  }, [events, selectedDate]);

  const markedDates = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
  
    return {
      ...eventDots,
      [dateStr]: {
        ...(eventDots[dateStr] || {}),
        selected: true,
        selectedColor: colors.tint,
        selectedTextColor: isDark ? "#000" : "#fff",
      },
    };
  }, [selectedDate, eventDots, colors.tint, isDark]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <CalendarHeader selectedDate={selectedDate} />
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Loading calendar...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <CalendarHeader selectedDate={selectedDate} />
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {error instanceof Error ? error.message : 'Failed to load calendar'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <CalendarHeader selectedDate={selectedDate} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            ...calendarTheme(colors, isDark),
            textDayFontWeight: "500" as const,
            textMonthFontWeight: "bold" as const,
            textDayHeaderFontWeight: "600" as const,
          }}
          style={styles.calendar}
        />

        <EventList events={todayEvents} selectedDate={selectedDate} onEventPress={handleEventPress} />
      </ScrollView>
    </ThemedView>
  );
}

/** 🎨 Extracted Theme for Cleaner Code */
function calendarTheme(colors: any, isDark: boolean) {
  return {
    backgroundColor: isDark ? "#1F1F1F" : "#FFFFFF",
    calendarBackground: isDark ? "#1F1F1F" : "#FFFFFF",
    textSectionTitleColor: colors.text,
    selectedDayBackgroundColor: colors.tint,
    selectedDayTextColor: isDark ? "#000" : "#fff",
    todayTextColor: colors.tint,
    dayTextColor: colors.text,
    textDisabledColor: colors.tabIconDefault + "60",
    dotColor: colors.tint,
    selectedDotColor: isDark ? "#000" : "#fff",
    arrowColor: colors.tint,
    monthTextColor: colors.text,
    textDayFontWeight: "500",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "600",
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
  },
});
