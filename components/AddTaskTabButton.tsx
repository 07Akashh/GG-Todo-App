import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSheet } from '@/contexts/SheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface AddTaskTabButtonProps {
  onPress?: () => void;
  color?: string;
}

export function AddTaskTabButton({ onPress, color }: AddTaskTabButtonProps) {
  const { colors } = useTheme();
  const { openAddTask } = useSheet();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      openAddTask();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.tint,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center', 
        marginTop: -8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <IconSymbol name="plus" size={28} color="#fff" />
    </TouchableOpacity>
  );
}

