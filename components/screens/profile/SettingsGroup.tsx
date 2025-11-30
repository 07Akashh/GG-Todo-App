import { SettingItem } from '@/components/screens/profile/SettingItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SettingsGroupProps {
  onCustomization: () => void;
}

export function SettingsGroup({ onCustomization }: SettingsGroupProps) {
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
        <ThemedText style={styles.groupTitle}>Settings</ThemedText>
      </ThemedView>

      <View style={styles.groupContent}>
        <SettingItem
          icon="gearshape.fill"
          title="App Settings"
          subtitle="Manage app preferences and settings"
          onPress={() => router.push('/(tabs)/settings')}
        />
        {/* <SettingItem
          icon="paintbrush.fill"
          title="Customization"
          subtitle="Change color theme and mode theme"
          onPress={onCustomization}
        /> */}
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

