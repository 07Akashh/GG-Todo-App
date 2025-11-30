import { NavigationButtons } from '@/components/screens/onboarding/NavigationButtons';
import { OnboardingSlide } from '@/components/screens/onboarding/OnboardingSlide';
import { PageIndicator } from '@/components/screens/onboarding/PageIndicator';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const onboardingData: {
  id: number;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    id: 1,
    title: 'Welcome to Todo App',
    description: 'Organize your tasks and boost your productivity with our intuitive todo app.',
    icon: 'check-circle',
  },
  {
    id: 2,
    title: 'Stay Organized',
    description: 'Keep track of all your tasks in one place. Never miss a deadline again.',
    icon: 'calendar-today',
  },
  {
    id: 3,
    title: 'Focus Mode',
    description: 'Concentrate on what matters with our built-in focus timer and distraction-free mode.',
    icon: 'timer',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useAuth();

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace('/intro/welcome');
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentOffset={{ x: currentIndex * width, y: 0 }}>
        {onboardingData.map((slide) => (
          <View key={slide.id} style={{ width }}>
            <OnboardingSlide
              icon={slide.icon}
              title={slide.title}
              description={slide.description}
            />
          </View>
        ))}
      </ScrollView>

      <PageIndicator totalPages={onboardingData.length} currentPage={currentIndex} />

      <NavigationButtons
        currentIndex={currentIndex}
        totalPages={onboardingData.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        onFinish={handleFinish}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

