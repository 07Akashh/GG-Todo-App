// import { ThemedText } from '@/components/themed-text';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { useTheme } from '@/contexts/ThemeContext';
// import {
//   BottomSheetBackdrop,
//   BottomSheetModal,
//   BottomSheetScrollView,
// } from '@gorhom/bottom-sheet';
// import React, { useCallback, useEffect, useMemo, useRef } from 'react';
// import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

// interface BottomSheetProps {
//   visible: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   snapPoints?: (string | number)[];
// }

// export function BottomSheetComponent({ visible, onClose, title, children, snapPoints }: BottomSheetProps) {
//   const { colors, isDark } = useTheme();
//   const bottomSheetRef = useRef<BottomSheetModal>(null);

//   // Default snap points: 90% of screen height
//   const defaultSnapPoints = useMemo(() => ['90%'], []);
//   const sheetSnapPoints = snapPoints || defaultSnapPoints;

//   // Open/close sheet based on visible prop
//   useEffect(() => {
//     if (visible) {
//       bottomSheetRef.current?.present();
//     } else {
//       bottomSheetRef.current?.dismiss();
//     }
//   }, [visible]);

//   // Handle sheet changes
//   const handleSheetChanges = useCallback(
//     (index: number) => {
//       if (index === -1) {
//         onClose();
//       }
//     },
//     [onClose]
//   );

//   // Custom backdrop component
//   const renderBackdrop = useCallback(
//     (props: any) => (
//       <BottomSheetBackdrop
//         {...props}
//         disappearsOnIndex={-1}
//         appearsOnIndex={0}
//         opacity={0.5}
//         pressBehavior="close"
//       />
//     ),
//     []
//   );

//   return (
//     <BottomSheetModal
//       ref={bottomSheetRef}
//       snapPoints={sheetSnapPoints}
//       onChange={handleSheetChanges}
//       enablePanDownToClose
//       backgroundStyle={{
//         backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
//       }}
//       handleIndicatorStyle={{
//         backgroundColor: colors.tabIconDefault + '60',
//       }}
//       backdropComponent={renderBackdrop}
//       keyboardBehavior="interactive"
//       keyboardBlurBehavior="restore"
//       android_keyboardInputMode="adjustResize"
//       enableContentPanningGesture={true}
//       enableHandlePanningGesture={true}
//       enableOverDrag={false}
//       onDismiss={onClose}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={styles.keyboardView}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
//         <View
//           style={[
//             styles.header,
//             {
//               borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
//             },
//           ]}>
//           <ThemedText type="title" style={styles.title}>
//             {title}
//           </ThemedText>
//           <TouchableOpacity
//             onPress={() => {
//               Keyboard.dismiss();
//               onClose();
//             }}
//             style={styles.closeButton}>
//             <IconSymbol name="xmark" size={24} color={colors.text} />
//           </TouchableOpacity>
//         </View>
//         <BottomSheetScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.contentContainer}
//           keyboardShouldPersistTaps="handled"
//           keyboardDismissMode="interactive"
//           nestedScrollEnabled={true}>
//           {children}
//         </BottomSheetScrollView>
//       </KeyboardAvoidingView>
//     </BottomSheetModal>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 8,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 140,
//     flexGrow: 1,
//   },
// });

import React, { useEffect, useMemo, useRef, useCallback } from "react";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: string[];
}

export function BottomSheetComponent({
  visible,
  onClose,
  title = "",
  children,
  snapPoints,
}: Props) {
  const { colors, isDark } = useTheme();
  const sheetRef = useRef<BottomSheetModal>(null);

  const defaultSnap = useMemo(() => ["55%", "85%"], []);
  const points = snapPoints || defaultSnap;

  useEffect(() => {
    if (visible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={points}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
      backgroundStyle={{
        backgroundColor: isDark ? "#181818" : "#FFFFFF",
        borderRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#666" : "#AAA",
        width: 40,
      }}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          },
        ]}
      >
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>

        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <IconSymbol name="xmark" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView style={styles.body}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {children}
        </KeyboardAvoidingView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 6,
  },
  body: {
    paddingHorizontal: 20,
    // marginTop:80,
    paddingBottom: 140,
    flexGrow: 1,
  },
});
