// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Partial<Record<string, ComponentProps<typeof MaterialIcons>['name']>>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'checkmark.circle.fill': 'check-circle',
  'calendar': 'calendar-today',
  'timer': 'timer',
  'bell.fill': 'notifications',
  'rocket.fill': 'rocket-launch',
  'envelope.fill': 'email',
  'lock.fill': 'lock',
  'person.crop.circle.badge.plus': 'person-add',
  'person.fill': 'person',
  'magnifyingglass': 'search',
  'checklist': 'checklist',
  'trash.fill': 'delete',
  'video.fill': 'videocam',
  'chevron.left': 'chevron-left',
  'plus.circle.fill': 'add-circle',
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'arrow.clockwise': 'refresh',
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'dark-mode',
  'circle.lefthalf.filled': 'brightness-6',
  'arrow.right.square.fill': 'logout',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
