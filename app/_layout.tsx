import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { I18nManager, Platform, DevSettings } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
export { ErrorBoundary } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/context/ThemeContext";
import { PrayerTimesProvider } from "@/context/PrayerTimesContext";
import { LocationProvider } from "@/context/LocationContext";
import { StatusBar } from "expo-status-bar";
import usePushNotifications from "@/utils/usePushNotifications";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const expoPushToken = usePushNotifications();

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
  return (
    <ThemeProvider>
      <LocationProvider>
        <PrayerTimesProvider>
          <RootLayoutNav />
        </PrayerTimesProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}
function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[theme].background }}
    >
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        backgroundColor={Colors[theme].background}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[theme].background,
          },
          headerTintColor: Colors[theme].text,
          headerTitleStyle: {
            fontSize: 16,
            fontFamily: FontFamily.bold,
          },
          contentStyle: {
            backgroundColor: Colors[theme].background,
          },
          animation: "fade",
          animationDuration: 100,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          presentation: "card",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="quran"
          options={{
            title: "القرآن الكريم",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "حول التطبيق",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="surah"
          options={{
            title: "السورة",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="favorites"
          options={{
            title: "المفضلة",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
