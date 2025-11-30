import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SettingItemProps {
  icon:
    | 'bell.fill'
    | 'lock.fill'
    | 'doc.text.fill'
    | 'bell.badge.fill'
    | 'calendar.badge.clock'
    | 'key.fill'
    | 'eye.slash.fill'
    | 'questionmark.circle.fill'
    | 'gearshape.fill'
    | 'paintbrush.fill'
    | 'pencil.fill'
    | 'info.circle.fill'
    | 'eye.fill';
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

export function SettingItem({ icon, title, subtitle, onPress, rightComponent }: SettingItemProps) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
        },
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
          <IconSymbol name={icon} size={24} color={colors.tint} />
        </View>
        <View style={styles.settingText}>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
          {subtitle && <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>}
        </View>
      </View>
      {rightComponent || (onPress && <IconSymbol name="chevron.right" size={20} color={colors.tabIconDefault} />)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
});

