import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  status?: number;
  labels?: string[];
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress?: (task: Task) => void;
}


function formatTime(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export function TaskItem({ task, onToggle, onDelete, onPress }: TaskItemProps) {
  const { colors, isDark } = useTheme();

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return '#DC2626'; // Darker red for critical
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return colors.tabIconDefault;
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical':
        return 'Critical';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return '';
    }
  };

  const getStatusInfo = (status?: number) => {
    switch (status) {
      case 1:
        return { label: 'Pending', color: '#6B7280', icon: 'clock.fill' };
      case 2:
        return { label: 'In Progress', color: '#3B82F6', icon: 'arrow.right.circle.fill' };
      case 3:
        return { label: 'Completed', color: '#10B981', icon: 'checkmark.circle.fill' };
      case 4:
        return { label: 'Cancelled', color: '#EF4444', icon: 'xmark.circle.fill' };
      default:
        return { label: 'Pending', color: '#6B7280', icon: 'clock.fill' };
    }
  };

  const statusInfo = getStatusInfo(task.status);
  const isCompleted = task.status === 3;
  const isCancelled = task.status === 4;

  // const formatDate = (dateString?: string) => {
  //   if (!dateString) return '';
  //   try {
  //     const date = new Date(dateString);
  //     const now = new Date();
  //     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //     const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
  //     const diffTime = taskDate.getTime() - today.getTime();
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
  //     if (diffDays === 0) return 'Today';
  //     if (diffDays === 1) return 'Tomorrow';
  //     if (diffDays === -1) return 'Yesterday';
  //     if (diffDays < 0) {
  //       return `${Math.abs(diffDays)} days ago`;
  //     }
      
  //     return date.toLocaleDateString('en-US', {
  //       month: 'short',
  //       day: 'numeric',
  //       year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };

  const handleTaskPress = () => {
    if (onPress) {
      onPress(task);
    } else {
      onToggle(task.id);
    }
  };

  return (
    <View
      style={[
        styles.taskItem,
        {
          backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
          borderLeftColor: getPriorityColor(task.priority),
          opacity: isCancelled ? 0.6 : 1,
        },
      ]}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={handleTaskPress}
        activeOpacity={0.7}>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isCompleted ? colors.tint : 'transparent',
              borderColor: isCompleted ? colors.tint : statusInfo.color,
            },
          ]}>
          {isCompleted && (
            <IconSymbol name="checkmark" size={16} color={isDark ? '#000' : '#fff'} />
          )}
          {task.status === 2 && (
            <IconSymbol name="arrow.right" size={14} color={statusInfo.color} />
          )}
          {task.status === 4 && (
            <IconSymbol name="xmark" size={14} color={statusInfo.color} />
          )}
        </View>
        <View style={styles.taskTextContainer}>
          <View style={styles.titleRow}>
            <ThemedText
              style={[
                styles.taskTitle,
                (isCompleted || isCancelled) && { textDecorationLine: 'line-through', opacity: 0.6 },
              ]}
              numberOfLines={2}>
              {task.title}
            </ThemedText>
          </View>
          <View style={styles.metaRow}>
            {task.dueDate && (
              <View style={styles.metaItem}>
                <IconSymbol name="calendar" size={12} color={colors.tabIconDefault} />
                <ThemedText style={styles.metaText}>{formatTime(task.dueDate)}</ThemedText>
              </View>
            )}
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
              <IconSymbol name={statusInfo.icon} size={10} color={statusInfo.color} />
              <ThemedText style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </ThemedText>
            </View>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(task.priority) + '20' },
              ]}>
              <ThemedText
                style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {getPriorityLabel(task.priority)}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        style={styles.deleteButton}
        activeOpacity={0.7}>
        <IconSymbol name="trash.fill" size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  taskTextContainer: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    opacity: 0.7,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
});

