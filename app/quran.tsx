import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useRouter } from "expo-router";
import { QuranIcon } from "@/constants/Icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "@/components/LoadingScreen";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import GoBack from "@/components/GoBack";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 380;
const CARD_SIZE = isSmallScreen ? (width - 48) / 2 : (width - 64) / 2;

// بيانات السور
const surahsData = [
  { number: 1, name: "الفاتحة", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "البقرة", numberOfAyahs: 286, revelationType: "Medinan" },
  {
    number: 3,
    name: "آل عمران",
    numberOfAyahs: 200,
    revelationType: "Medinan",
  },
  { number: 4, name: "النساء", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, name: "المائدة", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, name: "الأنعام", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, name: "الأعراف", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, name: "الأنفال", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, name: "التوبة", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, name: "يونس", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, name: "هود", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, name: "يوسف", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 13, name: "الرعد", numberOfAyahs: 43, revelationType: "Medinan" },
  { number: 14, name: "إبراهيم", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 15, name: "الحجر", numberOfAyahs: 99, revelationType: "Meccan" },
  { number: 16, name: "النحل", numberOfAyahs: 128, revelationType: "Meccan" },
  { number: 17, name: "الإسراء", numberOfAyahs: 111, revelationType: "Meccan" },
  { number: 18, name: "الكهف", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, name: "مريم", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, name: "طه", numberOfAyahs: 135, revelationType: "Meccan" },
  {
    number: 21,
    name: "الأنبياء",
    numberOfAyahs: 112,
    revelationType: "Meccan",
  },
  { number: 22, name: "الحج", numberOfAyahs: 78, revelationType: "Medinan" },
  {
    number: 23,
    name: "المؤمنون",
    numberOfAyahs: 118,
    revelationType: "Meccan",
  },
  { number: 24, name: "النور", numberOfAyahs: 64, revelationType: "Medinan" },
  { number: 25, name: "الفرقان", numberOfAyahs: 77, revelationType: "Meccan" },
  { number: 26, name: "الشعراء", numberOfAyahs: 227, revelationType: "Meccan" },
  { number: 27, name: "النمل", numberOfAyahs: 93, revelationType: "Meccan" },
  { number: 28, name: "القصص", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 29, name: "العنكبوت", numberOfAyahs: 69, revelationType: "Meccan" },
  { number: 30, name: "الروم", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, name: "لقمان", numberOfAyahs: 34, revelationType: "Meccan" },
  { number: 32, name: "السجدة", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 33, name: "الأحزاب", numberOfAyahs: 73, revelationType: "Medinan" },
  { number: 34, name: "سبأ", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, name: "فاطر", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, name: "يس", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 37, name: "الصافات", numberOfAyahs: 182, revelationType: "Meccan" },
  { number: 38, name: "ص", numberOfAyahs: 88, revelationType: "Meccan" },
  { number: 39, name: "الزمر", numberOfAyahs: 75, revelationType: "Meccan" },
  { number: 40, name: "غافر", numberOfAyahs: 85, revelationType: "Meccan" },
  { number: 41, name: "فصلت", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 42, name: "الشورى", numberOfAyahs: 53, revelationType: "Meccan" },
  { number: 43, name: "الزخرف", numberOfAyahs: 89, revelationType: "Meccan" },
  { number: 44, name: "الدخان", numberOfAyahs: 59, revelationType: "Meccan" },
  { number: 45, name: "الجاثية", numberOfAyahs: 37, revelationType: "Meccan" },
  { number: 46, name: "الأحقاف", numberOfAyahs: 35, revelationType: "Meccan" },
  { number: 47, name: "محمد", numberOfAyahs: 38, revelationType: "Medinan" },
  { number: 48, name: "الفتح", numberOfAyahs: 29, revelationType: "Medinan" },
  { number: 49, name: "الحجرات", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 50, name: "ق", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 51, name: "الذاريات", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 52, name: "الطور", numberOfAyahs: 49, revelationType: "Meccan" },
  { number: 53, name: "النجم", numberOfAyahs: 62, revelationType: "Meccan" },
  { number: 54, name: "القمر", numberOfAyahs: 55, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 56, name: "الواقعة", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 57, name: "الحديد", numberOfAyahs: 29, revelationType: "Medinan" },
  {
    number: 58,
    name: "المجادلة",
    numberOfAyahs: 22,
    revelationType: "Medinan",
  },
  { number: 59, name: "الحشر", numberOfAyahs: 24, revelationType: "Medinan" },
  {
    number: 60,
    name: "الممتحنة",
    numberOfAyahs: 13,
    revelationType: "Medinan",
  },
  { number: 61, name: "الصف", numberOfAyahs: 14, revelationType: "Medinan" },
  { number: 62, name: "الجمعة", numberOfAyahs: 11, revelationType: "Medinan" },
  {
    number: 63,
    name: "المنافقون",
    numberOfAyahs: 11,
    revelationType: "Medinan",
  },
  { number: 64, name: "التغابن", numberOfAyahs: 18, revelationType: "Medinan" },
  { number: 65, name: "الطلاق", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 66, name: "التحريم", numberOfAyahs: 12, revelationType: "Medinan" },
  { number: 67, name: "الملك", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 68, name: "القلم", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 69, name: "الحاقة", numberOfAyahs: 52, revelationType: "Meccan" },
  { number: 70, name: "المعارج", numberOfAyahs: 44, revelationType: "Meccan" },
  { number: 71, name: "نوح", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 72, name: "الجن", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 73, name: "المزمل", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 74, name: "المدثر", numberOfAyahs: 56, revelationType: "Meccan" },
  { number: 75, name: "القيامة", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 76, name: "الإنسان", numberOfAyahs: 31, revelationType: "Medinan" },
  { number: 77, name: "المرسلات", numberOfAyahs: 50, revelationType: "Meccan" },
  { number: 78, name: "النبأ", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 79, name: "النازعات", numberOfAyahs: 46, revelationType: "Meccan" },
  { number: 80, name: "عبس", numberOfAyahs: 42, revelationType: "Meccan" },
  { number: 81, name: "التكوير", numberOfAyahs: 29, revelationType: "Meccan" },
  { number: 82, name: "الانفطار", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 83, name: "المطففين", numberOfAyahs: 36, revelationType: "Meccan" },
  { number: 84, name: "الانشقاق", numberOfAyahs: 25, revelationType: "Meccan" },
  { number: 85, name: "البروج", numberOfAyahs: 22, revelationType: "Meccan" },
  { number: 86, name: "الطارق", numberOfAyahs: 17, revelationType: "Meccan" },
  { number: 87, name: "الأعلى", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 88, name: "الغاشية", numberOfAyahs: 26, revelationType: "Meccan" },
  { number: 89, name: "الفجر", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 90, name: "البلد", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 91, name: "الشمس", numberOfAyahs: 15, revelationType: "Meccan" },
  { number: 92, name: "الليل", numberOfAyahs: 21, revelationType: "Meccan" },
  { number: 93, name: "الضحى", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 94, name: "الشرح", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 95, name: "التين", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 96, name: "العلق", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 97, name: "القدر", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 98, name: "البينة", numberOfAyahs: 8, revelationType: "Medinan" },
  { number: 99, name: "الزلزلة", numberOfAyahs: 8, revelationType: "Medinan" },
  {
    number: 100,
    name: "العاديات",
    numberOfAyahs: 11,
    revelationType: "Meccan",
  },
  { number: 101, name: "القارعة", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 102, name: "التكاثر", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 103, name: "العصر", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 104, name: "الهمزة", numberOfAyahs: 9, revelationType: "Meccan" },
  { number: 105, name: "الفيل", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 106, name: "قريش", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 107, name: "الماعون", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 108, name: "الكوثر", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 109, name: "الكافرون", numberOfAyahs: 6, revelationType: "Meccan" },
  { number: 110, name: "النصر", numberOfAyahs: 3, revelationType: "Medinan" },
  { number: 111, name: "المسد", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 112, name: "الإخلاص", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفلق", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "الناس", numberOfAyahs: 6, revelationType: "Meccan" },
];

export default function QuranScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const router = useRouter();
  const [isReversed, setIsReversed] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pinnedSurahs, setPinnedSurahs] = useState<number[]>([]);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadPinned = async () => {
      try {
        const stored = await AsyncStorage.getItem("quran_pinned_surahs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setPinnedSurahs(parsed.filter((n) => typeof n === "number"));
          }
        }
      } catch (e) {
        // ignore
      }
    };
    loadPinned();
  }, []);

  const togglePin = async (surahNumber: number) => {
    try {
      const next = pinnedSurahs.includes(surahNumber)
        ? pinnedSurahs.filter((n) => n !== surahNumber)
        : [...pinnedSurahs, surahNumber];
      setPinnedSurahs(next);
      await AsyncStorage.setItem("quran_pinned_surahs", JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };
  // Filter surahs based on search text
  const filteredSurahs = surahsData.filter((surah) =>
    surah.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Separate pinned and unpinned surahs
  const pinnedSet = new Set(pinnedSurahs);
  const pinnedSurahsList = filteredSurahs.filter((surah) =>
    pinnedSet.has(surah.number)
  );
  // Show all surahs in the general list (including pinned ones)
  const unpinnedSurahsList = filteredSurahs;

  // Apply reverse if needed
  const sortedPinnedSurahs = isReversed
    ? [...pinnedSurahsList].reverse()
    : pinnedSurahsList;
  const sortedUnpinnedSurahs = isReversed
    ? [...unpinnedSurahsList].reverse()
    : unpinnedSurahsList;

  // Show loading screen while loading
  if (isLoading) {
    return (
      <LoadingScreen
        message="جاري تحميل السور..."
        customIcon={<QuranIcon width={84} height={84} color={color.primary} />}
      />
    );
  }

  const renderSurah = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.surahItem,
        {
          backgroundColor: color.bg20,
          borderColor: color.border,
        },
      ]}
      onPress={() => {
        router.push(`/quran/${item.number}` as any);
      }}
    >
      <View
        style={{
          backgroundColor: color.primary20,
          width: 60,
          height: 60,
          borderRadius: 99,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <QuranIcon width={40} height={40} color={color.primary} />
      </View>

      <View style={styles.surahInfo}>
        <Text style={[styles.surahName, { color: color.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.surahDetails, { color: color.darkText }]}>
          {item.numberOfAyahs} آية •{" "}
          {item.revelationType === "Meccan" ? "مكية" : "مدنية"}
        </Text>
      </View>

      <View style={styles.surahIcon}>
        <TouchableOpacity
          onPress={() => togglePin(item.number)}
          accessibilityRole="button"
          accessibilityLabel={
            pinnedSurahs.includes(item.number) ? "Unpin surah" : "Pin surah"
          }
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <FontAwesome5
            name={
              pinnedSurahs.includes(item.number) ? "thumbtack" : "thumbtack"
            }
            size={18}
            color={
              pinnedSurahs.includes(item.number) ? color.primary : color.text20
            }
            style={{
              transform: [
                {
                  rotate: pinnedSurahs.includes(item.number)
                    ? "0deg"
                    : "-20deg",
                },
              ],
            }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color.background, paddingTop: 50 },
      ]}
    >
      <View
        style={{
          padding: 20,
          paddingTop: 10,
          borderBottomWidth: 0,
          borderBottomColor: color.border,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GoBack
          style={{
            position: "absolute",
            left: 20,
            top: 20,
          }}
        />
        <Text style={[styles.headerTitle, { color: color.darkText }]}>
          سور القرآن الكريم
        </Text>
        <Text style={[styles.headerSubtitle, { color: color.darkText }]}>
          {searchText
            ? `${filteredSurahs.length} من ${surahsData.length} سورة`
            : `${surahsData.length} سورة`}
        </Text>

        {/* Favorites Button */}
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor: `${color.text20}22`,
          }}
          onPress={() => router.push("/favorites")}
        >
          <FontAwesome5 name="heart" size={20} color={color.text20} />
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            flexDirection: "row",

            marginTop: 10,
            justifyContent: "center",
            gap: 10,
          }}
        >
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: `${color.text20}22`,

                borderWidth: 0,
                flex: 1,
              },
            ]}
          >
            <EvilIcons name="search" size={28} color={color.text20} />
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: color.text,
                },
              ]}
              selectionColor={color.primary}
              placeholder="البحث في السور..."
              placeholderTextColor={color.text20}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                style={styles.clearButton}
              >
                <FontAwesome5 name="times" size={14} color={color.text} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor: "transparent",
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={() => setIsReversed(!isReversed)}
          >
            <FontAwesome5
              name={isReversed ? "sort-amount-up" : "sort-amount-down"}
              size={25}
              color={color.text20}
            />
          </TouchableOpacity>
        </View>
      </View>

      {filteredSurahs.length === 0 && searchText ? (
        <View style={styles.noResultsContainer}>
          <FontAwesome5
            name="search"
            size={48}
            color={color.text}
            style={{ opacity: 0.3 }}
          />
          <Text style={[styles.noResultsText, { color: color.text }]}>
            لم يتم العثور على نتائج
          </Text>
          <Text style={[styles.noResultsSubtext, { color: color.text }]}>
            جرب البحث بكلمات مختلفة
          </Text>
        </View>
      ) : (
        <FlatList
          style={{
            borderWidth: 0,
          }}
          data={[]}
          renderItem={() => null}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <>
              {/* Pinned Surahs Section */}
              {sortedPinnedSurahs.length > 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text
                      style={[styles.sectionTitle, { color: color.primary }]}
                    >
                      السور المثبتة
                    </Text>
                    <FontAwesome5
                      name="thumbtack"
                      size={16}
                      color={color.primary}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                  {sortedPinnedSurahs.map((item) => (
                    <View key={item.number}>{renderSurah({ item })}</View>
                  ))}
                  <View
                    style={[
                      styles.sectionDivider,
                      { backgroundColor: color.border },
                    ]}
                  />
                </View>
              )}

              {/* Unpinned Surahs Section */}
              {sortedUnpinnedSurahs.length > 0 && (
                <View>
                  {sortedPinnedSurahs.length > 0 && (
                    <View style={styles.sectionHeader}>
                      <Text
                        style={[styles.sectionTitle, { color: color.darkText }]}
                      >
                        جميع السور
                      </Text>
                    </View>
                  )}
                  {sortedUnpinnedSurahs.map((item) => (
                    <View key={item.number}>{renderSurah({ item })}</View>
                  ))}
                </View>
              )}
            </>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    textAlign: "center",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,

    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.regular,
    textAlign: "right",
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  surahItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 0,
  },

  numberText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    opacity: 0.7,
  },
  surahIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    textAlign: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    opacity: 0.7,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 12,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  sectionDivider: {
    height: 2,
    marginTop: 18,
    marginBottom: 12,
    marginHorizontal: 0,
    borderRadius: 1,
  },
});
