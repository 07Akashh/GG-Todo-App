import { ThemedText } from '@/components/themed-text';
import { BottomSheetComponent } from '@/components/ui/BottomSheet';
import { DateTimePickerComponent } from '@/components/ui/DateTimePicker';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { KeyboardAwareTextInput } from '@/components/ui/KeyboardAwareTextInput';
import { useSheet } from '@/contexts/SheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppSelector } from '@/hooks/redux';
import { useUpdateTodo } from '@/hooks/useTodos';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface EditTaskSheetProps {
  visible: boolean;
  onClose: () => void;
  taskId: string;
}

export function EditTaskSheet({ visible, onClose, taskId }: EditTaskSheetProps) {
  const { colors, isDark } = useTheme();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { editTaskData } = useSheet();

  const updateTodoMutation = useUpdateTodo({
    accessToken,
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number | undefined>(undefined);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<number>(1);

  // Load the task data from context or reset
  useEffect(() => {
    if (visible && editTaskData) {
      setTitle(editTaskData.title || '');
      setDescription(editTaskData.description || '');
      setPriority(editTaskData.priority);
      setLabels(editTaskData.labels || []);
      setStatus(editTaskData.status);
      if (editTaskData.dueDate) {
        setDueDate(new Date(editTaskData.dueDate));
      }
    } else if (!visible) {
      // Reset form when sheet closes
      setTitle('');
      setDescription('');
      setPriority(undefined);
      setLabels([]);
      setLabelInput('');
      setDueDate(null);
      setStatus(1);
    }
  }, [visible, editTaskData]);

  const addLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter((label) => label !== labelToRemove));
  };

  const validateForm = () => {
    if (title.trim().length > 200) {
      Alert.alert('Error', 'Title cannot exceed 200 characters');
      return false;
    }
    if (description.trim() && description.trim().length < 5) {
      Alert.alert('Error', 'Description must be at least 5 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updateData: any = {};
      
      if (title.trim()) updateData.title = title.trim();
      if (description.trim()) updateData.description = description.trim();
      if (dueDate) updateData.dueDate = dueDate.toISOString();
      if (priority !== undefined) updateData.priority = priority;
      // Always include labels (even if empty array to clear labels)
      updateData.labels = labels;
      if (status !== undefined) updateData.status = status;

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        Alert.alert('Info', 'No changes to update');
        return;
      }

      await updateTodoMutation.mutateAsync({
        todoId: taskId,
        data: updateData,
      });
      Alert.alert('Success', 'Task updated successfully');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update task');
    }
  };

  if (!visible) return null;

  return (
    <BottomSheetComponent visible={visible} onClose={onClose} title="Edit Task">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Title</ThemedText>
            <KeyboardAwareTextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              maxLength={200}
              toolbarTitle="Task Title"
            />
            <ThemedText style={styles.hint}>{title.length}/200</ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <KeyboardAwareTextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (minimum 5 characters)"
              multiline
              numberOfLines={4}
              toolbarTitle="Description"
              style={styles.textArea}
            />
            <ThemedText style={styles.hint}>
              {description.length} characters (minimum 5)
            </ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Priority</ThemedText>
            <View style={styles.priorityContainer}>
              {[
                { value: 1, label: 'Low' },
                { value: 2, label: 'Medium' },
                { value: 3, label: 'High' },
                { value: 4, label: 'Critical' },
              ].map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor:
                        priority === p.value
                          ? colors.tint
                          : isDark
                            ? '#2F2F2F'
                            : '#F5F5F5',
                      borderColor: priority === p.value ? colors.tint : colors.tabIconDefault + '40',
                    },
                  ]}
                  onPress={() => setPriority(p.value)}>
                  <ThemedText
                    style={[
                      styles.priorityText,
                      {
                        color:
                          priority === p.value
                            ? isDark
                              ? '#000'
                              : '#fff'
                            : colors.text,
                      },
                    ]}>
                    {p.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Status</ThemedText>
            <View style={styles.statusContainer}>
              {[
                { value: 1, label: 'Pending' },
                { value: 2, label: 'In Progress' },
                { value: 3, label: 'Completed' },
                { value: 4, label: 'Cancelled' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        status === s.value
                          ? colors.tint
                          : isDark
                            ? '#2F2F2F'
                            : '#F5F5F5',
                      borderColor: status === s.value ? colors.tint : colors.tabIconDefault + '40',
                    },
                  ]}
                  onPress={() => setStatus(s.value)}>
                  <ThemedText
                    style={[
                      styles.statusText,
                      {
                        color:
                          status === s.value
                            ? isDark
                              ? '#000'
                              : '#fff'
                            : colors.text,
                      },
                    ]}>
                    {s.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Labels</ThemedText>
            <View style={styles.labelInputContainer}>
              <KeyboardAwareTextInput
                value={labelInput}
                onChangeText={setLabelInput}
                placeholder="Add a label"
                onSubmitEditing={addLabel}
                toolbarTitle="Add Label"
                style={styles.labelInput}
              />
              <TouchableOpacity
                style={[styles.addLabelButton, { backgroundColor: colors.tint }]}
                onPress={addLabel}>
                <IconSymbol name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            {labels.length > 0 && (
              <View style={styles.labelsContainer}>
                {labels.map((label, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.labelChip, { backgroundColor: colors.tint + '20' }]}
                    onPress={() => removeLabel(label)}>
                    <ThemedText style={[styles.labelText, { color: colors.tint }]}>
                      {label}
                    </ThemedText>
                    <IconSymbol name="xmark" size={14} color={colors.tint} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Due Date & Time</ThemedText>
            <DateTimePickerComponent
              value={dueDate}
              onChange={setDueDate}
              minimumDate={new Date()}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.tint }]}
            onPress={handleSubmit}
            disabled={updateTodoMutation.isPending}>
            {updateTodoMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.submitButtonText}>Update Task</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BottomSheetComponent>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  labelInput: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  addLabelButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

