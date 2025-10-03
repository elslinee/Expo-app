import { I18nManager, Platform } from "react-native";
import "expo-router/entry";

// Force RTL layout for Arabic language support
if (Platform.OS !== "web") {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}
