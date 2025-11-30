import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps {
  message?: string;
  icon?: string;
  onAddTask?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function EmptyState({
  message = 'No tasks yet',
  icon = 'checklist',
  onAddTask,
  onRefresh,
  isRefreshing = false,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.emptyContainer}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        ) : undefined
      }>
      <View style={styles.emptyContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
          <IconSymbol name={icon} size={80} color={colors.tint} />
        </View>
        <ThemedText type="title" style={styles.emptyTitle}>
          {message}
        </ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          Get started by creating your first task
        </ThemedText>
        {onAddTask && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={onAddTask}>
            <IconSymbol name="plus" size={24} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add Your First Task</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 32,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

