import React from 'react';
import { FlatList, StyleSheet, View , ActivityIndicator } from 'react-native';
import { EmptyState } from './EmptyState';
import { Task, TaskItem } from './TaskItem';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  showEmptyState?: boolean;
  onAddTask?: () => void;
  onEndReached?: () => void;
  hasMore?: boolean;
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  isLoading = false,
  isLoadingMore = false,
  showEmptyState = false,
  onAddTask,
  onEndReached,
  hasMore = false,
}: TaskListProps) {
  const { colors } = useTheme();

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading tasks...</ThemedText>
      </View>
    );
  }

  if (showEmptyState && tasks.length === 0) {
    return <EmptyState onAddTask={onAddTask} />;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={onToggle} onDelete={onDelete} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<EmptyState onAddTask={onAddTask} />}
      onEndReached={hasMore && !isLoadingMore ? onEndReached : undefined}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.tint} />
            <ThemedText style={styles.footerText}>Loading more...</ThemedText>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.6,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
});

