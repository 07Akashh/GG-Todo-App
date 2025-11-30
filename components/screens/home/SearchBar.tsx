import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search tasks...' }: SearchBarProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          borderColor: colors.tabIconDefault,
        },
      ]}>
      <IconSymbol name="magnifyingglass" size={20} color={colors.tabIconDefault} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.tabIconDefault}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        blurOnSubmit={true}
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            Keyboard.dismiss();
          }}
          style={styles.clearButton}>
          <IconSymbol name="xmark.circle.fill" size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
});

