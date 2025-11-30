import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'orange';

interface ThemeContextType {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  isDark: boolean;
  colors: typeof Colors.light | typeof Colors.dark;
  setThemeMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Extended color themes
const colorThemes = {
  default: {
    light: { tint: '#0a7ea4' },
    dark: { tint: '#fff' },
  },
  blue: {
    light: { tint: '#0066CC' },
    dark: { tint: '#4DA6FF' },
  },
  green: {
    light: { tint: '#00AA44' },
    dark: { tint: '#4ADE80' },
  },
  purple: {
    light: { tint: '#7C3AED' },
    dark: { tint: '#A78BFA' },
  },
  orange: {
    light: { tint: '#EA580C' },
    dark: { tint: '#FB923C' },
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('purple');

  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        const savedColorTheme = await AsyncStorage.getItem('colorTheme');
        
        if (savedThemeMode) {
          setThemeModeState(savedThemeMode as ThemeMode);
        }
        if (savedColorTheme) {
          setColorThemeState(savedColorTheme as ColorTheme);
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  // Determine if dark mode should be used
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  // Get colors based on theme mode and color theme
  const baseColors = isDark ? Colors.dark : Colors.light;
  const themeTint = colorThemes[colorTheme][isDark ? 'dark' : 'light'].tint;
  const colors = {
    ...baseColors,
    tint: themeTint,
    tabIconSelected: themeTint,
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const setColorTheme = async (theme: ColorTheme) => {
    setColorThemeState(theme);
    try {
      await AsyncStorage.setItem('colorTheme', theme);
    } catch (error) {
      console.error('Error saving color theme:', error);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'auto') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('auto');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colorTheme,
        isDark,
        colors,
        setThemeMode,
        setColorTheme,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

