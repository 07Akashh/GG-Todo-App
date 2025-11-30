import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface OnboardingSlideProps {
  icon: IconName;
  title: string;
  description: string;
}

export function OnboardingSlide({ icon, title, description }: OnboardingSlideProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={120} color={colors.tint} />
      </View>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
});

