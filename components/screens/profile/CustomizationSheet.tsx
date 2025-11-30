import { ColorThemeSelector } from '@/components/screens/profile/ColorThemeSelector';
import { ThemeModeSelector } from '@/components/screens/profile/ThemeModeSelector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CustomizationSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function CustomizationSheet({ visible, onClose }: CustomizationSheetProps) {
  const { colors, isDark } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
              Customization
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <ThemeModeSelector />
            <ColorThemeSelector />
          </View>
        </ThemedView>
      </View>
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
  content: {
    gap: 24,
  },
});

