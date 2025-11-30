import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CategorySelector } from './CategorySelector';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';
import { PrioritySelector } from './PrioritySelector';

export type Priority = 'low' | 'medium' | 'high';

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  category: string;
}

interface TaskFormProps {
  formData: TaskFormData;
  onFieldChange: (field: keyof TaskFormData, value: string | Priority) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function TaskForm({ formData, onFieldChange, onSubmit, isLoading = false }: TaskFormProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <ThemedText style={styles.label}>Task Title *</ThemedText>
        <FormInput
          value={formData.title}
          onChangeText={(value) => onFieldChange('title', value)}
          placeholder="Enter task title"
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <FormInput
          value={formData.description}
          onChangeText={(value) => onFieldChange('description', value)}
          placeholder="Add description (optional)"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Priority</ThemedText>
        <PrioritySelector
          selectedPriority={formData.priority}
          onSelect={(priority) => onFieldChange('priority', priority)}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Due Date</ThemedText>
        <FormInput
          value={formData.dueDate}
          onChangeText={(value) => onFieldChange('dueDate', value)}
          placeholder="YYYY-MM-DD (optional)"
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <CategorySelector
          selectedCategory={formData.category}
          onSelect={(category) => onFieldChange('category', category)}
        />
      </View>

      <FormButton
        label="Create Task"
        onPress={onSubmit}
        isLoading={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});

