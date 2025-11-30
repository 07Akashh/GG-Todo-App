import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.logoutButton, { borderColor: '#EF4444' }]}
      onPress={handleLogout}>
      <IconSymbol name="arrow.right.square.fill" size={24} color="#EF4444" />
      <ThemedText style={[styles.logoutText, { color: '#EF4444' }]}>Logout</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

