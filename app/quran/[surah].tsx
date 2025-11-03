import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getSurahByNumber } from "@/utils/QuranApis";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AyahModal from "@/components/quranScreen/AyahModal";
import AyahItem from "@/components/quranScreen/AyahItem";
import InlineAyahView from "@/components/quranScreen/InlineAyahView";
import ListAyahView from "@/components/quranScreen/ListAyahView";
import GoBack from "@/components/GoBack";
import { FontSizeProvider, useFontSize } from "@/context/FontSizeContext";
import FontSizePopup from "@/components/FontSizePopup";
import OneTimeTip from "@/components/OneTimeTip";

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

export function SurahScreenContent() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const { fontSize } = useFontSize();
  const [showFontSizePopup, setShowFontSizePopup] = useState(false);

  // Create styles with current theme and font size
  const styles = createStyles(color, fontSize);
  const router = useRouter();
  const { surah } = useLocalSearchParams();
  const surahNumber = surah;

  const toArabicDigits = (value: number | string) => {
    const str = String(value);
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/[0-9]/g, (d) => arabicDigits[Number(d)]);
  };

  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [ayahHeights, setAyahHeights] = useState<{ [key: number]: number }>({});
  const [bookmark, setBookmark] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isInlineMode, setIsInlineMode] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  // Removed loading states for simpler bookmark functionality
  const VIEW_MODE_KEY = "quran_view_mode_inline"; // true => inline, false => list
  const [listPage, setListPage] = useState(10);

  useEffect(() => {
    if (surahNumber) {
      // تحميل متوازي للبيانات
      Promise.all([fetchSurahData(), loadFavorites(), loadBookmark()]).catch(
        (error) => {
          console.error("Error loading surah data:", error);
        }
      );
    }
  }, [surahNumber]);

  // Set initial listPage based on bookmark when both surah data and bookmark are loaded
  useEffect(() => {
    if (surahData && bookmark && !isInlineMode) {
      // Load enough ayahs to reach the bookmarked ayah + some buffer
      const requiredAyahs = Math.min(bookmark + 10, surahData.ayahs.length);
      setListPage(requiredAyahs);
      console.log(
        `Loading ${requiredAyahs} ayahs to reach bookmark at ayah ${bookmark}`
      );
    }
  }, [surahData, bookmark, isInlineMode]);

  // Remove automatic preloading to keep page lightweight

  useEffect(() => {
    const loadViewMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(VIEW_MODE_KEY);
        if (stored !== null) {
          setIsInlineMode(stored === "true");
        }
      } catch (e) {
        // ignore
      }
    };
    loadViewMode();
  }, []);

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

  // Removed loadTargetAyah function since all items are now loaded at once

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

      // إضافة تحسين للأداء - تحميل تدريجي
      const response = await getSurahByNumber(Number(surahNumber));

      // تحديث البيانات فوراً
      setSurahData(response.data.data);
    } catch (err) {
      console.error("Error fetching surah data:", err);
      setError("فشل في تحميل السورة");
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
        // Remove "بسم الله الرحمن الرحيم" if it's the first ayah
        const cleanText =
          ayahNumber === 1
            ? ayah.text
                .replace("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ ", "")
                .trim()
            : ayah.text;

        await saveFavoriteWithSurahInfo(
          ayahNumber,
          surahData.number,
          surahData.name,
          cleanText
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
        animated: true, // Restore smooth animation
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
        <Text style={styles.loadingText}>جاري تحميل السورة...</Text>
      </View>
    );
  }

  if (error || !surahData) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome5
          name="exclamation-triangle"
          size={48}
          color={color.text}
        />
        <Text style={styles.errorText}>
          {error || "لم يتم العثور على السورة"}
        </Text>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.retryButton}
          onPress={fetchSurahData}
        >
          <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const btnsBackgroundColors = color.bg20;
  const btnsIconsColors = color.darkText;

  const handleMainScroll = (event: any) => {
    if (isInlineMode) return; // Only handle scroll for list mode

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isCloseToBottom && surahData && listPage < surahData.ayahs.length) {
      console.log("Loading more ayahs from main scroll...");
      setListPage((prevPage) =>
        Math.min(prevPage + 10, surahData.ayahs.length)
      );
    }
  };
  const renderContent = () => {
    if (isSwitchingView) {
      return (
        <View style={styles.switchingViewContainer}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      );
    }

    if (isInlineMode) {
      return (
        <InlineAyahView
          ayahs={surahData.ayahs}
          bookmark={bookmark}
          onAyahPress={handleAyahPress}
          onToggleBookmark={toggleBookmark}
          toArabicDigits={toArabicDigits}
          color={color}
        />
      );
    }

    return (
      <ListAyahView
        ayahs={surahData.ayahs.slice(0, listPage)}
        bookmark={bookmark}
        onAyahPress={handleAyahPress}
        onToggleBookmark={toggleBookmark}
        renderAyah={renderAyah}
      />
    );
  };

  const renderBismillah = () => {
    if (surahData.number === 9 || surahData.number === 1) return null;
    return (
      <View style={styles.bismillahContainer}>
        <Text style={styles.bismillahText}>
          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FontSizePopup
        visible={showFontSizePopup}
        onClose={() => setShowFontSizePopup(false)}
      />
      <GoBack style={styles.goBackButton} />
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.surahInfoContainer}>
            <Text style={styles.surahName}>{surahData.name}</Text>
            <Text style={styles.surahEnglishName}>{surahData.englishName}</Text>
            <Text style={styles.surahDetails}>
              {toArabicDigits(surahData.numberOfAyahs)} آية •{" "}
              {surahData.revelationType === "Meccan" ? "مكية" : "مدنية"}
            </Text>
          </View>
          <View style={styles.actionButtonsContainer}>
            {bookmark && (
              <TouchableOpacity
                activeOpacity={1}
                style={styles.actionButton}
                onPress={() => {
                  if (isInlineMode) return;
                  goToBookmark();
                }}
              >
                <FontAwesome5
                  name="bookmark"
                  size={16}
                  color={btnsIconsColors}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={1}
              style={styles.actionButton}
              onPress={() => {
                setIsSwitchingView(true);
                setTimeout(() => {
                  setIsInlineMode((prev) => {
                    const next = !prev;
                    // persist preference
                    AsyncStorage.setItem(VIEW_MODE_KEY, String(next)).catch(
                      () => {}
                    );
                    return next;
                  });
                  setIsSwitchingView(false);
                }, 0);
              }}
            >
              <FontAwesome5
                name={isInlineMode ? "list-ul" : "align-right"}
                size={16}
                color={btnsIconsColors}
              />
            </TouchableOpacity>

            {/* Font Size Button */}
            <TouchableOpacity
              activeOpacity={1}
              style={styles.actionButton}
              onPress={() => setShowFontSizePopup(true)}
            >
              <FontAwesome5
                name="text-height"
                size={16}
                color={btnsIconsColors}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={handleMainScroll}
        onMomentumScrollEnd={handleMainScroll}
      >
        {renderBismillah()}
        <View
          style={
            isInlineMode && !isSwitchingView
              ? styles.contentContainer
              : styles.contentContainerTransparent
          }
        >
          {renderContent()}
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
      {/* One-time tip modal */}
      <OneTimeTip
        tipKey="quran_view_mode_tip_shown"
        title="نصائح مهمة"
        description={`1. يمكنك تغيير وضع القراءة بين عرض متجاور أو قائمة من زر التبديل في الأعلى
2.  الان يمكنك تغيير حجم الخط من زر النص العلوي `}
        color={color}
      />
    </View>
  );
}

const createStyles = (color: any, fontSize: number) =>
  StyleSheet.create({
    // Main container styles
    container: {
      flex: 1,
      backgroundColor: color.background,
      paddingTop: 32,
    },

    // Loading screen styles
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: color.background,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: FontFamily.medium,
      textAlign: "center",
      marginTop: 16,
      color: color.text,
    },

    // Error screen styles
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
      backgroundColor: color.background,
    },
    errorText: {
      fontSize: 18,
      fontFamily: FontFamily.medium,
      textAlign: "center",
      marginTop: 16,
      marginBottom: 24,
      color: color.text,
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: color.primary,
    },
    retryButtonText: {
      fontSize: 16,
      fontFamily: FontFamily.regular,
      color: color.white,
    },

    // GoBack button styles
    goBackButton: {
      position: "absolute",
      top: 65,
      left: 20,
      zIndex: 1000,
    },

    // Header styles
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 0,
      backgroundColor: color.background,
    },
    headerContent: {
      flex: 1,
      gap: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    surahInfoContainer: {
      alignItems: "center",
    },
    surahName: {
      fontSize: 22,
      fontFamily: FontFamily.quranBold,
      textAlign: "center",
      marginBottom: 6,
      color: color.darkText,
    },
    surahEnglishName: {
      fontSize: 16,
      fontFamily: FontFamily.regular,
      textAlign: "center",
      opacity: 0.9,
      marginBottom: 4,
      color: color.text20,
    },
    surahDetails: {
      fontSize: 14,
      fontFamily: FontFamily.regular,
      textAlign: "center",
      opacity: 0.9,
      color: color.text20,
    },

    // Action buttons container
    actionButtonsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      backgroundColor: color.background,
    },
    actionButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: color.bg20,
    },

    // ScrollView styles
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      padding: 16,
      paddingBottom: 40,
    },

    // Bismillah styles
    bismillahContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    bismillahText: {
      fontSize: fontSize + 4,
      fontFamily: FontFamily.quranBold,
      color: color.primary,
      textAlign: "center",
    },

    // Content container styles
    contentContainer: {
      backgroundColor: color.bg20,
      flexDirection: "column",
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 16,
      overflow: "hidden",
    },
    contentContainerTransparent: {
      backgroundColor: "transparent",
      flexDirection: "column",
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 16,
      overflow: "hidden",
    },

    // Switching view styles
    switchingViewContainer: {
      flex: 1,
      paddingVertical: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    // Inline mode styles
    inlineText: {
      fontSize: fontSize,
      fontFamily: FontFamily.quran,
      color: color.darkText,
      writingDirection: "rtl",
    },
    inlineAyahText: {
      backgroundColor: "transparent",
      borderRadius: 10,
      paddingHorizontal: 4,
      paddingVertical: 2,
      textAlign: "center",
    },
    inlineAyahTextBookmarked: {
      backgroundColor: color.primary20,
      borderRadius: 10,
      paddingHorizontal: 4,
      paddingVertical: 2,
      textAlign: "center",
    },
    inlineAyahNumber: {
      position: "relative",
      fontFamily: FontFamily.bold,
      fontSize: fontSize - 1,
      color: color.primary,
    },
  });

export default function SurahScreen() {
  return (
    <FontSizeProvider>
      <SurahScreenContent />
    </FontSizeProvider>
  );
}
