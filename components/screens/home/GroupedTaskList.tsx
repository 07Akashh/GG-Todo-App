import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/ThemeContext";
import { groupTasksByDate } from "@/utils/dateUtils";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import { EmptyState } from "./EmptyState";
import { Task, TaskItem } from "./TaskItem";

interface GroupedTaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTaskPress?: (task: Task) => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isRefreshing?: boolean;
  showEmptyState?: boolean;
  onAddTask?: () => void;
  onEndReached?: () => void;
  onRefresh?: () => void;
  hasMore?: boolean;
}

export function GroupedTaskList({
  tasks,
  onToggle,
  onDelete,
  onTaskPress,
  isLoading = false,
  isLoadingMore = false,
  isRefreshing = false,
  showEmptyState = false,
  onAddTask,
  onEndReached,
  onRefresh,
  hasMore = false,
}: GroupedTaskListProps) {
  const { colors } = useTheme();

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);

  // Convert to SectionList format
  const sections = useMemo(() => {
    return groupedTasks.map((group) => ({
      title: group.groupLabel,
      data: group.tasks,
      date: group.date,
    }));
  }, [groupedTasks]);

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading tasks...</ThemedText>
      </View>
    );
  }

  if (showEmptyState && tasks.length === 0) {
    return (
      <EmptyState
        onAddTask={onAddTask}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />
    );
  }

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <ThemedView style={[styles.sectionHeader]}>
      <ThemedText style={styles.sectionHeaderText}>{section.title}</ThemedText>
    </ThemedView>
  );

  const renderItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={onToggle}
      onDelete={onDelete}
      onPress={onTaskPress}
    />
  );

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <EmptyState
          onAddTask={onAddTask}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      }
      onEndReached={hasMore && !isLoadingMore ? onEndReached : undefined}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
          />
        ) : undefined
      }
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.tint} />
            <ThemedText style={styles.footerText}>Loading more...</ThemedText>
          </View>
        ) : null
      }
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.6,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
  sectionHeader: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
