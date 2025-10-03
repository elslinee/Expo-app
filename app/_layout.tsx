import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { View } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
export { ErrorBoundary } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/context/ThemeContext";
import { PrayerTimesProvider } from "@/context/PrayerTimesContext";
import { LocationProvider } from "@/context/LocationContext";
import { StatusBar } from "expo-status-bar";
import { getColors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [FontFamily.extraLight]: require("../assets/fonts/Cairo/Cairo-ExtraLight.ttf"),
    [FontFamily.light]: require("../assets/fonts/Cairo/Cairo-Light.ttf"),
    [FontFamily.regular]: require("../assets/fonts/Cairo/Cairo-Regular.ttf"),
    [FontFamily.medium]: require("../assets/fonts/Cairo/Cairo-Medium.ttf"),
    [FontFamily.bold]: require("../assets/fonts/Cairo/Cairo-Bold.ttf"),
    [FontFamily.extraBold]: require("../assets/fonts/Cairo/Cairo-ExtraBold.ttf"),
    [FontFamily.black]: require("../assets/fonts/Cairo/Cairo-Black.ttf"),
    [FontFamily.quran]: require("../assets/fonts/Amiri/Amiri-Regular.ttf"),
    [FontFamily.quranBold]: require("../assets/fonts/Amiri/Amiri-Bold.ttf"),
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

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1D1915" }}>
        <StatusBar style="light" backgroundColor="#1D1915" />
      </View>
    );
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
  const { theme, colorScheme } = useTheme();
  const Colors = getColors(theme, colorScheme);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[theme].background }}
      edges={["left", "right", "bottom"]}
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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "حول التطبيق",
            headerShown: false,
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
        <Stack.Screen
          name="tasbeeh"
          options={{
            title: "التسبيح",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="tasbeeh/[id]"
          options={{
            title: "التسبيح",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
