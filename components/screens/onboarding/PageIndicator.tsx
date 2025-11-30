import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
}

export function PageIndicator({ totalPages, currentPage }: PageIndicatorProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            {
              backgroundColor:
                index === currentPage ? colors.tint : isDark ? '#444' : '#ddd',
              width: index === currentPage ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
});

