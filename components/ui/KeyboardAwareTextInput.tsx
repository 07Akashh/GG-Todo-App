import { useTheme } from '@/contexts/ThemeContext';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
    Keyboard,
    StyleSheet,
    TextInput,
    TextInputProps,
} from 'react-native';

interface KeyboardAwareTextInputProps extends TextInputProps {
  showKeyboardToolbar?: boolean;
  toolbarTitle?: string;
}

export interface KeyboardAwareTextInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export const KeyboardAwareTextInput = forwardRef<
  KeyboardAwareTextInputRef,
  KeyboardAwareTextInputProps
>(({ showKeyboardToolbar = true, toolbarTitle, style, ...props }, ref) => {
  const { colors, isDark } = useTheme();
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    clear: () => inputRef.current?.clear(),
  }));

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
  };

  return (
    <TextInput
      ref={inputRef}
      style={[
        styles.input,
        {
          color: colors.text,
          backgroundColor: isDark ? '#2F2F2F' : '#F5F5F5',
          borderColor: colors.tabIconDefault + '40',
        },
        style,
      ]}
      placeholderTextColor={colors.tabIconDefault}
      returnKeyType={props.multiline ? 'default' : 'done'}
      blurOnSubmit={!props.multiline}
      onSubmitEditing={() => {
        if (!props.multiline) {
          handleDismissKeyboard();
        }
      }}
      {...props}
    />
  );
});

KeyboardAwareTextInput.displayName = 'KeyboardAwareTextInput';

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
});
