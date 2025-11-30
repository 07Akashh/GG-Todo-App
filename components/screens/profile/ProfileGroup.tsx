import { SettingItem } from '@/components/screens/profile/SettingItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProfileGroupProps {
  onViewDetails: () => void;
  onUpdateDetails: () => void;
}

export function ProfileGroup({ onViewDetails, onUpdateDetails }: ProfileGroupProps) {
  // const { isDark } = useTheme();

  return (
    <View style={styles.groupContainer}>
      <ThemedView
        style={[
          styles.groupHeader,
          // {
          //   backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          // },
        ]}>
        <ThemedText style={styles.groupTitle}>Profile</ThemedText>
      </ThemedView>

      <View style={styles.groupContent}>
        <SettingItem
          icon="eye.fill"
          title="View Details"
          subtitle="View your complete profile information"
          onPress={onViewDetails}
        />

        <SettingItem
          icon="pencil.fill"
          title="Update Details"
          subtitle="Edit your profile information"
          onPress={onUpdateDetails}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    // marginBottom: 4,
  },
  groupHeader: {
    padding: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  groupContent: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    // paddingBottom: 12,
  },
});

