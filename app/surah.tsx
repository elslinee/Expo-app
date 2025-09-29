import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getSurahByNumber } from "@/utils/QuranApis";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AyahModal from "@/components/quranScreen/AyahModal";
import AyahItem from "@/components/quranScreen/AyahItem";

interface Ayah {
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export default function SurahScreen() {
  const { theme } = useTheme();
  const color = Colors[theme];
  const router = useRouter();
  const { surahNumber } = useLocalSearchParams();

  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [ayahHeights, setAyahHeights] = useState<{ [key: number]: number }>({});
  const [bookmark, setBookmark] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (surahNumber) {
      fetchSurahData();
      loadFavorites();
      loadBookmark();
    }
  }, [surahNumber]);

  const loadFavorites = async () => {
    try {
      // Load detailed favorites for this specific surah
      const detailedFavorites = await AsyncStorage.getItem(
        "quran_favorites_detailed"
      );
      if (detailedFavorites) {
        const detailedData = JSON.parse(detailedFavorites);
        const currentSurahNumber = Number(surahNumber);

        const surahFavorites = detailedData
          .filter((item: any) => item.surahNumber === currentSurahNumber)
          .map((item: any) => item.ayahNumber);

        setFavorites(surahFavorites);
      } else {
        // Fallback to old method if detailed favorites don't exist
        const storedFavorites = await AsyncStorage.getItem("quran_favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const loadBookmark = async () => {
    try {
      const currentSurahNumber = Number(surahNumber);
      const storedBookmark = await AsyncStorage.getItem(
        `bookmark_surah_${currentSurahNumber}`
      );
      if (storedBookmark) {
        const bookmarkData = JSON.parse(storedBookmark);
        setBookmark(bookmarkData.ayahNumber);
      }
    } catch (error) {
      console.error("Error loading bookmark:", error);
    }
  };

  const saveBookmark = async (ayahNumber: number) => {
    try {
      const currentSurahNumber = Number(surahNumber);
      const bookmarkData = {
        surahNumber: currentSurahNumber,
        ayahNumber: ayahNumber,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        `bookmark_surah_${currentSurahNumber}`,
        JSON.stringify(bookmarkData)
      );
      setBookmark(ayahNumber);
    } catch (error) {
      console.error("Error saving bookmark:", error);
    }
  };

  const removeBookmark = async () => {
    try {
      const currentSurahNumber = Number(surahNumber);
      await AsyncStorage.removeItem(`bookmark_surah_${currentSurahNumber}`);
      setBookmark(null);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const toggleBookmark = async (ayahNumber: number) => {
    if (bookmark === ayahNumber) {
      await removeBookmark();
    } else {
      await saveBookmark(ayahNumber);
    }
  };

  const goToBookmark = () => {
    if (bookmark) {
      scrollToAyah(bookmark);
    }
  };

  const saveFavorites = async (newFavorites: number[]) => {
    try {
      await AsyncStorage.setItem(
        "quran_favorites",
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const saveFavoriteWithSurahInfo = async (
    ayahNumber: number,
    surahNumber: number,
    surahName: string,
    ayahText: string
  ) => {
    try {
      const existingFavorites = await AsyncStorage.getItem(
        "quran_favorites_detailed"
      );
      let detailedFavorites = existingFavorites
        ? JSON.parse(existingFavorites)
        : [];

      // Check if already exists
      const exists = detailedFavorites.find(
        (fav: any) =>
          fav.ayahNumber === ayahNumber && fav.surahNumber === surahNumber
      );

      if (!exists) {
        detailedFavorites.push({
          ayahNumber,
          surahNumber,
          surahName,
          text: ayahText,
          timestamp: new Date().toISOString(),
        });

        await AsyncStorage.setItem(
          "quran_favorites_detailed",
          JSON.stringify(detailedFavorites)
        );
      }
    } catch (error) {
      console.error("Error saving detailed favorites:", error);
    }
  };

  const fetchSurahData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSurahByNumber(Number(surahNumber));
      setSurahData(response.data.data);
    } catch (err) {
      console.error("Error fetching surah data:", err);
      setError("فشل في تحميل السورة");
      Alert.alert("خطأ", "فشل في تحميل السورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleAyahPress = (ayah: Ayah) => {
    setSelectedAyah(ayah);
    setShowAyahModal(true);
  };

  const toggleFavorite = async (ayahNumber: number) => {
    const newFavorites = favorites.includes(ayahNumber)
      ? favorites.filter((num) => num !== ayahNumber)
      : [...favorites, ayahNumber];

    setFavorites(newFavorites);
    await saveFavorites(newFavorites);

    // If adding to favorites, save detailed info
    if (!favorites.includes(ayahNumber) && surahData) {
      const ayah = surahData.ayahs.find((a) => a.numberInSurah === ayahNumber);
      if (ayah) {
        await saveFavoriteWithSurahInfo(
          ayahNumber,
          surahData.number,
          surahData.name,
          ayah.text
        );
      }
    }
  };

  // Function to scroll to specific ayah using stored positions
  const scrollToAyah = (ayahNumber: number) => {
    // Calculate position using actual heights
    let calculatedPosition = 0;
    for (let i = 1; i < ayahNumber; i++) {
      if (ayahHeights[i]) {
        calculatedPosition += ayahHeights[i];
      } else {
        // Use default height if not measured yet
        calculatedPosition += 100;
      }
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: calculatedPosition,
        animated: true,
      });
    }
  };

  const renderAyah = (ayah: Ayah, index: number) => (
    <View
      key={ayah.numberInSurah}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setAyahHeights((prev) => ({
          ...prev,
          [ayah.numberInSurah]: height,
        }));
      }}
    >
      <AyahItem
        ayah={ayah}
        onPress={handleAyahPress}
        isBookmarked={bookmark === ayah.numberInSurah}
        onToggleBookmark={toggleBookmark}
      />
    </View>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: color.background,
        }}
      >
        <ActivityIndicator size="large" color={color.primary} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: FontFamily.medium,
            textAlign: "center",
            marginTop: 16,
            color: color.text,
          }}
        >
          جاري تحميل السورة...
        </Text>
      </View>
    );
  }

  if (error || !surahData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          backgroundColor: color.background,
        }}
      >
        <FontAwesome5
          name="exclamation-triangle"
          size={48}
          color={color.text}
        />
        <Text
          style={{
            fontSize: 18,
            fontFamily: FontFamily.medium,
            textAlign: "center",
            marginTop: 16,
            marginBottom: 24,
            color: color.text,
          }}
        >
          {error || "لم يتم العثور على السورة"}
        </Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: color.primary,
          }}
          onPress={fetchSurahData}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: FontFamily.regular,
              color: color.white,
            }}
          >
            إعادة المحاولة
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: color.background, paddingTop: 40 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          borderBottomWidth: 2,
          borderBottomColor: color.border,
          backgroundColor: color.background,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 4,
              top: 10,
              padding: 12,
              marginRight: 16,
              borderRadius: 8,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-right" size={20} color={color.primary} />
          </TouchableOpacity>

          {bookmark && (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 4,
                top: 10,
                padding: 12,
                borderRadius: 8,
                backgroundColor: color.primary,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
              onPress={goToBookmark}
            >
              <FontAwesome5 name="bookmark" size={16} color={color.white} />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: FontFamily.medium,
                  color: color.white,
                }}
              >
                آية {bookmark}
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: 18,
              fontFamily: FontFamily.bold,
              textAlign: "center",
              marginBottom: 6,
              color: color.text,
            }}
          >
            {surahData.name}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: FontFamily.regular,
              textAlign: "center",
              opacity: 0.7,
              marginBottom: 4,
              color: color.text,
            }}
          >
            {surahData.englishName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: FontFamily.regular,
              textAlign: "center",
              opacity: 0.7,
              color: color.text,
            }}
          >
            {surahData.numberOfAyahs} آية •{" "}
            {surahData.revelationType === "Meccan" ? "مكية" : "مدنية"}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <View
          style={{
            flexDirection: "column",
            paddingVertical: 8,
          }}
        >
          {surahData.ayahs.map((ayah, index) => {
            const cleanText = ayah.text
              .replace(/بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/g, "")
              .trim();
            const updatedAyah = { ...ayah, text: cleanText };
            return (
              <View key={ayah.numberInSurah}>
                {renderAyah(updatedAyah, index + 1)}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <AyahModal
        visible={showAyahModal}
        onClose={() => setShowAyahModal(false)}
        ayah={selectedAyah}
        surahName={surahData?.name}
        isFavorite={
          selectedAyah ? favorites.includes(selectedAyah.numberInSurah) : false
        }
        onToggleFavorite={() => {
          if (selectedAyah) {
            toggleFavorite(selectedAyah.numberInSurah);
          }
        }}
      />
    </View>
  );
}
