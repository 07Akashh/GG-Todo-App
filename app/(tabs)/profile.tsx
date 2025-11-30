import { AboutGroup } from '@/components/screens/profile/AboutGroup';
import { CustomizationSheet } from '@/components/screens/profile/CustomizationSheet';
import { ProfileGroup } from '@/components/screens/profile/ProfileGroup';
import { ProfileHeader } from '@/components/screens/profile/ProfileHeader';
import { SettingsGroup } from '@/components/screens/profile/SettingsGroup';
import { UpdateProfileSheet } from '@/components/screens/profile/UpdateProfileSheet';
import { ViewProfileSheet } from '@/components/screens/profile/ViewProfileSheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProfile } from '@/store/slices/authSlice';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [viewSheetVisible, setViewSheetVisible] = useState(false);
  const [updateSheetVisible, setUpdateSheetVisible] = useState(false);
  const [customizationSheetVisible, setCustomizationSheetVisible] = useState(false);

  useEffect(() => {
    // Fetch profile when screen loads
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleAboutUs = () => {
    Alert.alert('About Us', 'This is a TODO app built with React Native and Expo.');
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'Frequently asked questions will be displayed here.');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ProfileHeader />

        <SettingsGroup onCustomization={() => setCustomizationSheetVisible(true)} />

        <ProfileGroup
          onViewDetails={() => setViewSheetVisible(true)}
          onUpdateDetails={() => setUpdateSheetVisible(true)}
        />

        <AboutGroup onAboutUs={handleAboutUs} onFAQ={handleFAQ} />
      </ScrollView>

      <ViewProfileSheet
        visible={viewSheetVisible}
        onClose={() => setViewSheetVisible(false)}
        user={user}
        isLoading={isLoading}
      />

      <UpdateProfileSheet
        visible={updateSheetVisible}
        onClose={() => setUpdateSheetVisible(false)}
      />

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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});
