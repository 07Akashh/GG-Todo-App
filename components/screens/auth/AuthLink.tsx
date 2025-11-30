import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface AuthLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export function AuthLink({ text, linkText, onPress }: AuthLinkProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.linkButton} onPress={onPress}>
      <ThemedText style={[styles.linkText, { color: colors.tint }]}>
        {text}{' '}
        <ThemedText style={styles.linkTextBold}>{linkText}</ThemedText>
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: '600',
  },
});

