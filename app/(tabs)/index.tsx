import {
  View,
  ScrollView,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import HeroSection from "@/components/homeScreen/HeroSection";
import PrayerTimesComponent from "@/components/homeScreen/PrayerTimesComponent";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import ScreenBtn from "@/components/homeScreen/ScreenBtn";
import { QuranIcon } from "@/constants/Icons";
import { navigateToPage } from "@/utils/navigationUtils";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const router = useRouter();
  const [showChangelog, setShowChangelog] = useState(false);
  const CHANGELOG_KEY = "app_changelog_shown_v1"; // bump suffix on new releases

  useEffect(() => {
    const maybeShowChangelog = async () => {
      try {
        const shown = await AsyncStorage.getItem(CHANGELOG_KEY);
        if (!shown) {
          setShowChangelog(true);
        }
      } catch (e) {
        // ignore
      }
    };
    maybeShowChangelog();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
      <HeroSection color={color} />
      <PrayerTimesComponent color={color} />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 24,
        }}
      >
        <ScreenBtn
          color={color}
          title="القرآن الكريم"
          Icon={QuranIcon}
          onPress={() => navigateToPage("/quran")}
        />
      </View>

      {/* First-run changelog modal */}
      <Modal
        visible={showChangelog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChangelog(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          onPress={() => setShowChangelog(false)}
        >
          <Pressable
            style={{
              width: "100%",
              borderRadius: 16,
              backgroundColor: color.background,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text
              style={{
                color: color.text,
                fontFamily: "Cairo-Black",
                fontSize: 20,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              آخر التغييرات اصدار 0.3 بيتا
            </Text>
            <Text
              style={{
                color: color.darkText,
                fontFamily: "Cairo-Regular",
                fontSize: 14,
                textAlign: "center",
                lineHeight: 22,
                marginBottom: 16,
              }}
            >
               • يمكنك الان قراءة القرآن من دون إنترنت.
              {"\n"}• إمكانية التبديل بين عرض متجاور وقائمة في السور.
              {"\n"}• أرقام عربية وتحسينات في المفضلة والإشارات.
              {"\n"}• إضافة صوت تكبير عند اشعار الأذان.
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: color.primary,
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                }}
                onPress={async () => {
                  setShowChangelog(false);
                  try {
                    await AsyncStorage.setItem(CHANGELOG_KEY, "true");
                  } catch (e) {}
                }}
              >
                <Text
                  style={{
                    color: color.background,
                    textAlign: "center",
                    fontFamily: "Cairo-Bold",
                    fontSize: 16,
                  }}
                >
                  حسنًا
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: color.bg20,
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                }}
                onPress={async () => {
                  setShowChangelog(false);
                  try {
                    await AsyncStorage.setItem(CHANGELOG_KEY, "true");
                  } catch (e) {}
                  router.push("/changelog");
                }}
              >
                <Text
                  style={{
                    color: color.text,
                    textAlign: "center",
                    fontFamily: "Cairo-Bold",
                    fontSize: 16,
                  }}
                >
                  عرض التفاصيل
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
