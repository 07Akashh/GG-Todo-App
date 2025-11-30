import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
  categories?: string[];
}

const defaultCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];

export function CategorySelector({
  selectedCategory,
  onSelect,
  categories = defaultCategories,
}: CategorySelectorProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.categoryContainer}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.categoryChip,
            {
              backgroundColor:
                selectedCategory === cat ? colors.tint : isDark ? '#1F1F1F' : '#F5F5F5',
              borderColor: selectedCategory === cat ? colors.tint : colors.tabIconDefault,
            },
          ]}
          onPress={() => onSelect(cat)}>
          <ThemedText
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory === cat
                    ? isDark
                      ? '#000'
                      : '#fff'
                    : colors.text,
              },
            ]}>
            {cat}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

