import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { I18nManager, Platform, DevSettings } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { Colors } from "@/constants/Colors";
export { ErrorBoundary } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
export const unstable_settings = {
  initialRouteName: "(tabs)",
};
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [FontFamily.extraLight]: require("../assets/fonts/Cairo-ExtraLight.ttf"),
    [FontFamily.light]: require("../assets/fonts/Cairo-Light.ttf"),
    [FontFamily.regular]: require("../assets/fonts/Cairo-Regular.ttf"),
    [FontFamily.medium]: require("../assets/fonts/Cairo-Medium.ttf"),
    [FontFamily.bold]: require("../assets/fonts/Cairo-Bold.ttf"),
    [FontFamily.extraBold]: require("../assets/fonts/Cairo-ExtraBold.ttf"),
    [FontFamily.black]: require("../assets/fonts/Cairo-Black.ttf"),
    ...FontAwesome.font,
  });
  useEffect(() => {
    if (error) throw error;
  }, [error]);
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  useEffect(() => {
    if (Platform.OS === "web") return;
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      try {
        DevSettings.reload();
      } catch {}
    }
  }, []);
  if (!loaded) {
    return null;
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
