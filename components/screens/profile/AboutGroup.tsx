import { LogoutButton } from '@/components/screens/profile/LogoutButton';
import { SettingItem } from '@/components/screens/profile/SettingItem';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AboutGroupProps {
  onAboutUs?: () => void;
  onFAQ?: () => void;
}

export function AboutGroup({ onAboutUs, onFAQ }: AboutGroupProps) {
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
        <ThemedText style={styles.groupTitle}>About</ThemedText>
      </ThemedView>

      <View style={styles.groupContent}>
        <SettingItem
          icon="info.circle.fill"
          title="About Us"
          subtitle="Learn more about the app"
          onPress={onAboutUs}
        />
        <SettingItem
          icon="questionmark.circle.fill"
          title="FAQ"
          subtitle="Frequently asked questions"
          onPress={onFAQ}
        />
        <LogoutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    // marginBottom: 24,
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

