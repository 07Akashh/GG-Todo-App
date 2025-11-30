import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { User } from '@/store/slices/authSlice';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface ProfileDetailsProps {
  user: User | null;
  isLoading?: boolean;
}

export function ProfileDetails({ user, isLoading }: ProfileDetailsProps) {
  const { colors, isDark } = useTheme();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No profile data available</ThemedText>
      </View>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getRoleName = (role: number) => {
    switch (role) {
      case 1:
        return 'Admin';
      case 2:
        return 'User';
      default:
        return `Role ${role}`;
    }
  };

  const profileItems = [
    { label: 'User ID', value: user._id },
    { label: 'Email', value: user.email },
    { label: 'Name', value: user.name },
    { label: 'Role', value: getRoleName(user.role) },
    { label: 'Status', value: user.status ? 'Active' : 'Inactive' },
    { label: 'Firebase UID', value: user.firebaseUid || 'N/A' },
    { label: 'Last Login', value: formatDate(user.lastLogin) },
    { label: 'Account Created', value: formatDate(user.createdAt) },
    { label: 'Last Updated', value: formatDate(user.updatedAt) },
  ];

  return (
    <View style={styles.container}>
      {/* <ThemedText style={styles.sectionTitle}>Profile Information</ThemedText> */}
      <View
        style={[
          styles.detailsCard,
          {
            backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          },
        ]}>
        {profileItems.map((item, index) => (
          <View
            key={index}
            style={[
              styles.detailRow,
              index !== profileItems.length - 1 && styles.detailRowBorder,
              { borderBottomColor: isDark ? '#2F2F2F' : '#E0E0E0' },
            ]}>
            <ThemedText style={styles.detailLabel}>{item.label}</ThemedText>
            <ThemedText style={styles.detailValue}>{item.value}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailsCard: {
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1.5,
    textAlign: 'right',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
});

