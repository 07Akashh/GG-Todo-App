import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { KeyboardAwareTextInput } from '@/components/ui/KeyboardAwareTextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProfile, updateProfile } from '@/store/slices/authSlice';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface UpdateProfileSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function UpdateProfileSheet({ visible, onClose }: UpdateProfileSheetProps) {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [status, setStatus] = useState(user?.status ?? true);

  // Sync form fields when user changes or sheet opens
  useEffect(() => {
    if (visible && user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setStatus(user.status ?? true);
    }
  }, [visible, user]);

  const handleUpdate = async () => {
    if (!name.trim() && !avatar.trim() && status === user?.status) {
      Alert.alert('Error', 'Nothing to update');
      return;
    }

    try {
      const updateData: any = {};
      if (name.trim() && name !== user?.name) {
        updateData.name = name.trim();
      }
      if (avatar.trim()) {
        updateData.avatar = avatar.trim();
      }
      if (status !== user?.status) {
        updateData.status = status;
      }

      if (Object.keys(updateData).length === 0) {
        Alert.alert('Error', 'Nothing to update');
        return;
      }

      await dispatch(updateProfile(updateData)).unwrap();
      // Refetch profile to ensure UI is updated
      await dispatch(fetchProfile());
      Alert.alert('Success', 'Profile updated successfully');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update profile');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}>
        <View style={styles.modalOverlay}>
          <ThemedView
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
              },
            ]}>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Update Profile
              </ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled">
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Name</ThemedText>
                  <KeyboardAwareTextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    toolbarTitle="Name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Avatar URL</ThemedText>
                  <KeyboardAwareTextInput
                    value={avatar}
                    onChangeText={setAvatar}
                    placeholder="Enter avatar URL"
                    autoCapitalize="none"
                    keyboardType="url"
                    toolbarTitle="Avatar URL"
                  />
                </View>

            <View style={styles.inputGroup}>
              <View style={styles.switchRow}>
                <ThemedText style={styles.label}>Status</ThemedText>
                <TouchableOpacity
                  style={[
                    styles.switch,
                    {
                      backgroundColor: status ? colors.tint : colors.tabIconDefault + '40',
                    },
                  ]}
                  onPress={() => setStatus(!status)}>
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        transform: [{ translateX: status ? 20 : 0 }],
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
              <ThemedText style={styles.hint}>
                {status ? 'Account is active' : 'Account is inactive'}
              </ThemedText>
            </View>

                <TouchableOpacity
                  style={[styles.updateButton, { backgroundColor: colors.tint }]}
                  onPress={handleUpdate}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ThemedText style={styles.updateButtonText}>Update Profile</ThemedText>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ThemedView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
  },
  updateButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

