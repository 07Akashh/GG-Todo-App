import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface FormInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormInput({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
}: FormInputProps) {
  const { colors, isDark } = useTheme();

  return (
    <TextInput
      style={[
        multiline ? styles.textArea : styles.input,
        {
          color: colors.text,
          backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          borderColor: colors.tabIconDefault,
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.tabIconDefault}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
  },
});

