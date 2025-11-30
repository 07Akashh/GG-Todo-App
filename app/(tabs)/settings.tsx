import { CustomizationSheet } from "@/components/screens/profile/CustomizationSheet";
import { SettingItem } from "@/components/screens/profile/SettingItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [customizationSheetVisible, setCustomizationSheetVisible] =
    useState(false);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          App Settings
        </ThemedText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Customization</ThemedText>
          <SettingItem
            icon="paintbrush.fill"
            title="Customization"
            subtitle="Change color theme and mode theme"
            onPress={() => setCustomizationSheetVisible(true)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
          <SettingItem
            icon="bell.fill"
            title="Push Notifications"
            subtitle="Enable or disable push notifications"
          />
          <SettingItem
            icon="bell.badge.fill"
            title="Task Reminders"
            subtitle="Get notified about upcoming tasks"
          />
          <SettingItem
            icon="calendar.badge.clock"
            title="Calendar Events"
            subtitle="Sync with calendar events"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Privacy & Security
          </ThemedText>
          <SettingItem
            icon="lock.fill"
            title="Privacy"
            subtitle="Privacy and security settings"
          />
          <SettingItem
            icon="key.fill"
            title="Change Password"
            subtitle="Update your account password"
          />
          <SettingItem
            icon="eye.slash.fill"
            title="Data & Privacy"
            subtitle="Manage your data and privacy settings"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>General</ThemedText>
          <SettingItem
            icon="doc.text.fill"
            title="About"
            subtitle="App version and information"
          />
          <SettingItem
            icon="questionmark.circle.fill"
            title="Help & Support"
            subtitle="Get help and contact support"
          />
        </View>
      </ScrollView>
      <CustomizationSheet
        visible={customizationSheetVisible}
        onClose={() => setCustomizationSheetVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
