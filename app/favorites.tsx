import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import { useRouter } from "expo-router";
import { getSurahByNumber } from "@/utils/QuranApis";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AyahModal from "@/components/quranScreen/AyahModal";

interface FavoriteAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const color = Colors[theme];
  const router = useRouter();

  const [favoriteAyahs, setFavoriteAyahs] = useState<FavoriteAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState<FavoriteAyah | null>(null);
  const [showAyahModal, setShowAyahModal] = useState(false);

  useEffect(() => {
    loadFavoriteAyahs();
  }, []);

  const loadFavoriteAyahs = async () => {
    try {
      setLoading(true);

      // Load detailed favorites only
      const detailedFavorites = await AsyncStorage.getItem(
        "quran_favorites_detailed"
      );
      if (detailedFavorites) {
        const detailedData = JSON.parse(detailedFavorites);
        const ayahsData: FavoriteAyah[] = detailedData.map((item: any) => ({
          surahNumber: item.surahNumber,
          surahName: item.surahName,
          ayahNumber: item.ayahNumber,
          text: item.text,
        }));
        setFavoriteAyahs(ayahsData);
      } else {
        // If no detailed favorites exist, show empty state
        setFavoriteAyahs([]);
      }
    } catch (error) {
      console.error("Error loading favorite ayahs:", error);
      Alert.alert("خطأ", "فشل في تحميل الآيات المفضلة");
    } finally {
      setLoading(false);
    }
  };

  const handleAyahPress = (ayah: FavoriteAyah) => {
    setSelectedAyah(ayah);
    setShowAyahModal(true);
  };

  const removeFromFavorites = async (
    ayahNumber: number,
    surahNumber: number
  ) => {
    try {
      // Remove from detailed favorites using both ayahNumber and surahNumber
      const detailedFavorites = await AsyncStorage.getItem(
        "quran_favorites_detailed"
      );
      if (detailedFavorites) {
        const detailedData = JSON.parse(detailedFavorites);
        const newDetailedFavorites = detailedData.filter(
          (item: any) =>
            !(
              item.ayahNumber === ayahNumber && item.surahNumber === surahNumber
            )
        );
        await AsyncStorage.setItem(
          "quran_favorites_detailed",
          JSON.stringify(newDetailedFavorites)
        );
      }

      // Also remove from simple favorites for backward compatibility
      const storedFavorites = await AsyncStorage.getItem("quran_favorites");
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        const newFavorites = favorites.filter(
          (num: number) => num !== ayahNumber
        );
        await AsyncStorage.setItem(
          "quran_favorites",
          JSON.stringify(newFavorites)
        );
      }

      // Update local state using both ayahNumber and surahNumber
      setFavoriteAyahs((prev) =>
        prev.filter(
          (ayah) =>
            !(
              ayah.ayahNumber === ayahNumber && ayah.surahNumber === surahNumber
            )
        )
      );
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const renderFavoriteAyah = ({ item }: { item: FavoriteAyah }) => (
    <TouchableOpacity
      style={{
        backgroundColor: color.neutral,
        marginBottom: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: "100%",
        borderWidth: 1,
        borderColor: color.border,
      }}
      onPress={() => handleAyahPress(item)}
      activeOpacity={0.7}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: color.primary,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#fff",
            marginRight: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
           
              color: "#fff",
            }}
          >
            {item.ayahNumber}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
          
              fontFamily: FontFamily.medium,
              lineHeight: 32,

              color: color.text,
              marginBottom: 4,
            }}
          >
            {item.text}
          </Text>

          {/* Surah name in small text */}
          <Text
            style={{
              fontSize: 12,
              fontFamily: FontFamily.medium,
              color: color.text,
              opacity: 0.6,
              textAlign: "right",
            }}
          >
            {item.surahName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
          جاري تحميل المفضلة...
        </Text>
      </View>
    );
  }

  if (favoriteAyahs.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        {/* Header */}
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
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 20,
              padding: 12,
              marginRight: 16,
              borderRadius: 8,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-right" size={20} color={color.primary} />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: FontFamily.medium,
                textAlign: "center",
                color: color.text,
              }}
            >
              المفضلة
            </Text>
          </View>
        </View>

        {/* Empty State */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <FontAwesome5
            name="heart"
            size={64}
            color={color.text}
            style={{ opacity: 0.3, marginBottom: 20 }}
          />
          <Text
            style={{
              fontSize: 18,
              fontFamily: FontFamily.medium,
              textAlign: "center",
              marginBottom: 12,
              color: color.text,
            }}
          >
            لا توجد آيات مفضلة
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: FontFamily.medium,
              textAlign: "center",
              opacity: 0.7,
              color: color.text,
              marginBottom: 24,
            }}
          >
            اضغط على أي آية في القرآن الكريم لإضافتها للمفضلة
          </Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: color.primary,
            }}
            onPress={() => router.push("/quran")}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: FontFamily.medium,
                color: color.white,
              }}
            >
              تصفح القرآن الكريم
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: color.background, paddingTop: 40 }}
    >
      {/* Header */}
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
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 20,
            padding: 12,
            marginRight: 16,
            borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-right" size={20} color={color.primary} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: FontFamily.medium,
              textAlign: "center",
              color: color.text,
            }}
          >
            المفضلة
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: FontFamily.medium,
              textAlign: "center",
              opacity: 0.7,
              color: color.text,
            }}
          >
            {favoriteAyahs.length} آية مفضلة
          </Text>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={favoriteAyahs}
        renderItem={renderFavoriteAyah}
        keyExtractor={(item) => `${item.surahNumber}-${item.ayahNumber}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Ayah Modal */}
      <AyahModal
        visible={showAyahModal}
        onClose={() => setShowAyahModal(false)}
        ayah={selectedAyah}
        showRemoveButton={true}
        onRemoveFromFavorites={() => {
          if (selectedAyah) {
            removeFromFavorites(
              selectedAyah.ayahNumber,
              selectedAyah.surahNumber
            );
          }
        }}
      />
    </View>
  );
}
