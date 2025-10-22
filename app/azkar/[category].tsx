import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { FontFamily } from "@/constants/FontFamily";
import GoBack from "@/components/GoBack";
import { useState, useEffect } from "react";
import AzkarData from "@/assets/json/Azkar.json";
import AzkarCard from "@/components/azkarScreen/AzkarCard";
import OneTimeTip from "@/components/OneTimeTip";

type Zikr = {
  category: string;
  count: string;
  description: string;
  reference: string;
  content: string;
};

const FAVORITES_KEY = "azkar_favorites";

export default function AzkarCategoryScreen() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const params = useLocalSearchParams();
  const router = useRouter();
  const category = params.category as string;

  const [azkar, setAzkar] = useState<Zikr[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await loadFavorites();
      loadAzkar();
    };
    initializeData();
  }, [category]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favArray = JSON.parse(stored);
        // Filter favorites for current category only and create unique keys
        const favKeys = favArray
          .filter((fav: Zikr) => fav.category === category)
          .map((fav: Zikr) => `${fav.category}|||${fav.content}`);
        setFavorites(favKeys);
      } else {
        // If no favorites stored, set to empty array
        setFavorites([]);
      }
      setFavoritesLoaded(true);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
      setFavoritesLoaded(true);
    }
  };

  const loadAzkar = () => {
    try {
      // Access the category from the JSON data
      const categoryAzkar = (AzkarData as any)[category];

      if (categoryAzkar && Array.isArray(categoryAzkar)) {
        setAzkar(categoryAzkar);
      } else {
        Alert.alert("خطأ", "لم يتم العثور على الأذكار");
        router.back();
      }
    } catch (error) {
      console.error("Error loading azkar:", error);
      Alert.alert("خطأ", "حدث خطأ في تحميل الأذكار");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !favoritesLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  // Separate favorite and regular azkar
  const favoriteAzkar = azkar.filter((zikr) => {
    const favoriteKey = `${zikr.category}|||${zikr.content}`;
    return favorites.includes(favoriteKey);
  });
  const regularAzkar = azkar.filter((zikr) => {
    const favoriteKey = `${zikr.category}|||${zikr.content}`;
    return !favorites.includes(favoriteKey);
  });

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={styles.header}>
        <GoBack
          style={{
            position: "absolute",
            left: 20,
            top: 20,
          }}
        />
        <Text style={[styles.headerTitle, { color: color.darkText }]}>
          {category}
        </Text>
        <Text style={[styles.headerSubtitle, { color: color.darkText }]}>
          {azkar.length} ذكر
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Favorite Azkar Section */}
        {favoriteAzkar.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: color.primary }]}>
                المفضلة
              </Text>
              <FontAwesome5
                name="heart"
                size={16}
                color={color.primary}
                solid
                style={{ marginLeft: 8 }}
              />
            </View>
            {favoriteAzkar.map((zikr, index) => (
              <AzkarCard
                key={`fav-${index}`}
                zikr={zikr}
                index={index}
                color={color}
                onFavoriteChange={loadFavorites}
                favorites={favorites}
              />
            ))}
            <View
              style={[styles.sectionDivider, { backgroundColor: color.border }]}
            />
          </View>
        )}

        {/* Regular Azkar Section */}
        <View>
          {favoriteAzkar.length > 0 && (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: color.darkText }]}>
                جميع الأذكار
              </Text>
            </View>
          )}
          {regularAzkar.map((zikr, index) => (
            <AzkarCard
              key={`reg-${index}`}
              zikr={zikr}
              index={favoriteAzkar.length + index}
              color={color}
              onFavoriteChange={loadFavorites}
              favorites={favorites}
            />
          ))}
        </View>
      </ScrollView>
      <OneTimeTip
        tipKey="azkar_view_mode_tip_shown"
        title="نصيحة مهمة"
        description={`يمكنك الضغط على الذكر لزيادة عدد المرات`}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
