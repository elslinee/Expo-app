import { View } from "react-native";
import DateAndLocation from "@/components/homeScreen/DateAndLocation";
import PrayerTimesComponent from "@/components/homeScreen/PrayerTimesComponent";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import MosqueBackground from "@/components/homeScreen/MosqueBackground";
import ScreenBtn from "@/components/homeScreen/ScreenBtn";
import { QuranIcon } from "@/constants/Icons";
import { useRouter } from "expo-router";
import { navigateToPage } from "@/utils/navigationUtils";
export default function HomeScreen() {
  const { theme } = useTheme();
  const color = Colors[theme];
  const router = useRouter();
  return (
    <View>
      <DateAndLocation color={color} />
      <PrayerTimesComponent color={color} />
      <MosqueBackground color={color} />
      <View
        style={{
          flexWrap: "wrap",
          gap: 24,
        }}
        className=" px-6 flex-row      items-center "
      >
        <ScreenBtn
          color={color}
          title="القرآن الكريم"
          Icon={QuranIcon}
          onPress={() => navigateToPage("/quran")}
        />
        {/* <ScreenBtn
          color={color}
          title="القرآن الكريم"
          icon={<QuranIcon width={55} height={55} color={color.primary} />}
        /> */}
      </View>
    </View>
  );
}
