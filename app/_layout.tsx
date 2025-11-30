import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { AuthProvider } from "@/contexts/AuthContext";
import { SheetProvider } from "@/contexts/SheetContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { store } from "@/store/store";
import { queryClient } from "@/config/queryClient";
import { GlobalSheet } from "@/components/GlobalSheet";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const { isDark } = useTheme();
  useAuthRedirect();

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <GlobalSheet />
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ThemeProvider>
            <AuthProvider>
              <SheetProvider>
                <SafeAreaProvider>
                  <BottomSheetModalProvider>
                    <RootLayoutNav />
                  </BottomSheetModalProvider>
                </SafeAreaProvider>
              </SheetProvider>
            </AuthProvider>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
