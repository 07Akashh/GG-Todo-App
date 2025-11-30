import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function FocusHeader() {
  return (
    <View style={styles.header}>
      <ThemedText type="title" style={styles.title}>
        Focus Mode
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Stay focused and boost productivity
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});

