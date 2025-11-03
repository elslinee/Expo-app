import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Alert,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TextInput,
} from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { FontFamily } from "@/constants/FontFamily";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type Zikr = {
  category: string;
  count: string;
  description: string;
  reference: string;
  content: string;
};

type AzkarCardProps = {
  zikr: Zikr;
  index: number;
  color: any;
  onFavoriteChange?: () => void;
  favorites?: string[];
};

type TasbeehItem = {
  id: string;
  name: string;
  count: number;
  dailyGoal: number;
  totalCount?: number;
  lastUsedDate?: string;
  history?: { date: string; count: number }[];
};

const FAVORITES_KEY = "azkar_favorites";
const TASBEEH_STORAGE_KEY = "TASBEEH_LIST_V2";
const AZKAR_COUNTER_KEY = "azkar_counters";

export default function AzkarCard({
  zikr,
  index,
  color,
  onFavoriteChange,
  favorites = [],
}: AzkarCardProps) {
  const [currentCount, setCurrentCount] = useState(parseInt(zikr.count) || 1);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showAddTasbeehModal, setShowAddTasbeehModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tasbeehGoal, setTasbeehGoal] = useState("");
  const copiedAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Create unique key for this zikr
  const zikrKey = `${zikr.category}|||${zikr.content}`;

  // Load favorite status and counter data on mount
  useEffect(() => {
    loadFavoriteStatus();
    loadCounterData();
  }, []);

  // Check for daily reset
  useEffect(() => {
    const checkDailyReset = async () => {
      try {
        const savedData = await AsyncStorage.getItem(AZKAR_COUNTER_KEY);
        if (savedData) {
          const counters = JSON.parse(savedData);
          const today = new Date().toDateString();

          if (counters[zikrKey] && counters[zikrKey].date !== today) {
            // Data is from previous day, reset
            setCompletedCount(0);
            setIsCompleted(false);
            await saveCounterData(0, false);
          }
        }
      } catch (error) {
        console.error("Error checking daily reset:", error);
      }
    };

    checkDailyReset();
  }, [zikrKey]);

  // Update favorite status when favorites prop changes
  useEffect(() => {
    const favoriteKey = `${zikr.category}|||${zikr.content}`;
    setIsFavorite(favorites.includes(favoriteKey));
  }, [favorites, zikr.content, zikr.category]);

  const loadFavoriteStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const favArray = JSON.parse(favorites);
        const isFav = favArray.some(
          (fav: Zikr) =>
            fav.content === zikr.content && fav.category === zikr.category
        );
        setIsFavorite(isFav);
      } else {
        // No favorites stored, set to false
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setIsFavorite(false);
    }
  };

  const loadCounterData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(AZKAR_COUNTER_KEY);
      if (savedData) {
        const counters = JSON.parse(savedData);
        const today = new Date().toDateString();

        // Check if we have data for this zikr
        if (counters[zikrKey]) {
          const zikrData = counters[zikrKey];

          // Check if data is from today
          if (zikrData.date === today) {
            setCompletedCount(zikrData.completedCount || 0);
            setIsCompleted(zikrData.isCompleted || false);
          } else {
            // Data is from previous day, reset
            setCompletedCount(0);
            setIsCompleted(false);
            // Save reset data
            await saveCounterData(0, false);
          }
        }
      }
    } catch (error) {
      console.error("Error loading counter data:", error);
    }
  };

  const saveCounterData = async (count: number, completed: boolean) => {
    try {
      const savedData = await AsyncStorage.getItem(AZKAR_COUNTER_KEY);
      const counters = savedData ? JSON.parse(savedData) : {};
      const today = new Date().toDateString();

      counters[zikrKey] = {
        completedCount: count,
        isCompleted: completed,
        date: today,
      };

      await AsyncStorage.setItem(AZKAR_COUNTER_KEY, JSON.stringify(counters));
    } catch (error) {
      console.error("Error saving counter data:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        // Remove from favorites - match by both content AND category
        favArray = favArray.filter(
          (fav: Zikr) =>
            !(fav.content === zikr.content && fav.category === zikr.category)
        );
      } else {
        // Add to favorites
        favArray.push(zikr);
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favArray));
      setIsFavorite(!isFavorite);

      // Notify parent to refresh
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("خطأ", "حدث خطأ في حفظ المفضلة");
    }
  };

  const handleCopy = useCallback(async () => {
    try {
      let text = zikr.content;
      if (zikr.description) {
        text += `\n\n${zikr.description}`;
      }
      if (zikr.reference) {
        text += `\n\n${zikr.reference}`;
      }

      await Clipboard.setStringAsync(text);
      setShowCopied(true);

      Animated.sequence([
        Animated.timing(copiedAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.delay(1500),
        Animated.timing(copiedAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start(() => {
        setShowCopied(false);
        copiedAnim.setValue(0);
      });
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ في النسخ");
    }
  }, [zikr, copiedAnim]);

  const handleShare = async () => {
    try {
      let text = zikr.content;
      if (zikr.description) {
        text += `\n\n${zikr.description}`;
      }
      if (zikr.reference) {
        text += `\n\n${zikr.reference}`;
      }

      await Share.share({
        message: text,
      });
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ في المشاركة");
    }
  };

  const handleTasbeeh = () => {
    setShowAddTasbeehModal(true);
  };

  const addToTasbeeh = async () => {
    try {
      const normalizedGoal = tasbeehGoal
        .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
        .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
        .replace(/[^0-9]/g, "");
      const parsedGoal = parseInt(normalizedGoal, 10);

      if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
        Alert.alert("تنبيه", "الرجاء إدخال هدف يومي صالح");
        return;
      }

      // Load existing tasbeeh items
      const saved = await AsyncStorage.getItem(TASBEEH_STORAGE_KEY);
      let items: TasbeehItem[] = saved ? JSON.parse(saved) : [];

      // Create new tasbeeh item
      const newItem: TasbeehItem = {
        id: `${Date.now()}`,
        name: zikr.content,
        count: 0,
        dailyGoal: parsedGoal,
        totalCount: 0,
        lastUsedDate: "",
        history: [],
      };

      // Add to beginning of list
      items = [newItem, ...items];

      // Save back to storage
      await AsyncStorage.setItem(TASBEEH_STORAGE_KEY, JSON.stringify(items));

      // Close modal and reset
      setShowAddTasbeehModal(false);
      setTasbeehGoal("");

      // Show success modal
      setShowSuccessModal(true);
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }).start();
    } catch (error) {
      console.error("Error adding tasbeeh:", error);
      Alert.alert("خطأ", "حدث خطأ في إضافة التسبيح");
    }
  };

  const handleGoToTasbeeh = () => {
    setShowSuccessModal(false);
    successAnim.setValue(0);
    router.push("/tasbeeh");
  };

  const handleCloseSuccess = () => {
    Animated.timing(successAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => {
      setShowSuccessModal(false);
      successAnim.setValue(0);
    });
  };

  const decrementCount = () => {
    if (currentCount > 0) {
      setCurrentCount(currentCount - 1);
    }
  };

  const resetCount = async () => {
    setCurrentCount(parseInt(zikr.count) || 1);
    setCompletedCount(0);
    setIsCompleted(false);
    // Save reset data
    await saveCounterData(0, false);
  };

  const handleCardPress = async () => {
    if (isCompleted) return; // Don't allow pressing if already completed

    const newCompletedCount = completedCount + 1;
    setCompletedCount(newCompletedCount);

    // Check if completed
    const isNowCompleted = newCompletedCount >= currentCount;
    if (isNowCompleted) {
      setIsCompleted(true);
    }

    // Save data
    await saveCounterData(newCompletedCount, isNowCompleted);
  };

  return (
    <View style={{ position: "relative", marginBottom: 8 }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleCardPress}
        disabled={isCompleted}
        style={[
          styles.container,
          {
            backgroundColor: color.bg20,
            borderColor: color.border,
            opacity: isCompleted ? 0.3 : 1,
          },
        ]}
      >
        {/* Header with index */}
        <View style={styles.header}>
          <View
            style={[
              styles.indexBadge,
              {
                backgroundColor: color.primary20,
              },
            ]}
          >
            <Text
              style={[
                styles.indexText,
                {
                  fontFamily: FontFamily.bold,
                  color: color.primary,
                },
              ]}
            >
              {index + 1}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={toggleFavorite}
            style={styles.favoriteBtn}
          >
            <FontAwesome5
              name={isFavorite ? "heart" : "heart"}
              size={18}
              color={isFavorite ? color.primary : color.text20}
              solid={isFavorite}
            />
          </TouchableOpacity>
        </View>

        {/* Zikr Content */}
        <Text
          style={[
            styles.content,
            {
              color: color.darkText,
            },
          ]}
        >
          {zikr.content}
        </Text>

        {/* Description */}
        {zikr.description ? (
          <View
            style={[
              styles.descriptionBox,
              {
                backgroundColor: color.primary + "10",
              },
            ]}
          >
            <Text
              style={[
                styles.description,
                {
                  color: color.darkText,
                },
              ]}
            >
              {zikr.description}
            </Text>
          </View>
        ) : null}

        {/* Reference */}
        {zikr.reference ? (
          <Text
            style={[
              styles.reference,
              {
                color: color.darkText,
              },
            ]}
          >
            {zikr.reference}
          </Text>
        ) : null}

        {/* Progress Counter */}
        {parseInt(zikr.count) > 1 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, { color: color.darkText }]}>
                {completedCount} / {currentCount}
              </Text>
              {isCompleted && (
                <Text style={[styles.completedText, { color: color.primary }]}>
                  ✓ مكتمل
                </Text>
              )}
            </View>
            <Text style={[styles.dateText, { color: color.text20 }]}>
              اليوم: {new Date().toLocaleDateString("ar-SA")}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: color.bg20 }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: isCompleted
                      ? color.primary
                      : color.primary20,
                    width: `${(completedCount / currentCount) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Action Buttons and Counter */}
        <View style={styles.actionsRow}>
          {/* Left side - Counter/Reset */}

          {/* Right side - Action buttons */}
          <View style={styles.actionsContainer}>
            <View style={styles.leftActions}>
              {isCompleted ? (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={resetCount}
                  style={[
                    styles.actionBtn,
                    {
                      height: 50,
                      backgroundColor: color.primary20,
                    },
                  ]}
                >
                  <FontAwesome5 name="redo" size={18} color={color.primary} />
                </TouchableOpacity>
              ) : parseInt(zikr.count) > 1 ? (
                <View
                  style={[
                    styles.actionBtn,
                    styles.counterBadge,
                    {
                      backgroundColor: isCompleted
                        ? color.primary
                        : color.primary20,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterBadgeText,
                      {
                        color: isCompleted ? color.white : color.primary,
                      },
                    ]}
                  >
                    {zikr.count}×
                  </Text>
                </View>
              ) : null}
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleCopy}
              style={[
                styles.actionBtn,
                {
                  height: 50,
                  backgroundColor: `${color.text20}22`,
                },
              ]}
            >
              <FontAwesome5 name="copy" size={18} color={color.darkText} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={handleShare}
              style={[
                styles.actionBtn,
                {
                  height: 50,
                  backgroundColor: `${color.text20}22`,
                },
              ]}
            >
              <FontAwesome5 name="share-alt" size={18} color={color.darkText} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={handleTasbeeh}
              style={[
                styles.actionBtn,
                styles.actionBtnPrimary,
                {
                  height: 50,
                  backgroundColor: color.primary,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: FontFamily.bold,
                  color: color.white,
                }}
              >
                اضف للتسبيح
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Copied Toast */}
      {showCopied && (
        <Animated.View
          style={[
            styles.copiedToast,
            {
              backgroundColor: color.primary,
              opacity: copiedAnim,
              transform: [
                {
                  translateY: copiedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.copiedText, { color: color.white }]}>
            تم النسخ
          </Text>
          <FontAwesome5 name="check" size={15} color={color.white} />
        </Animated.View>
      )}

      {/* Add Tasbeeh Modal */}
      <Modal
        visible={showAddTasbeehModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowAddTasbeehModal(false);
          setTasbeehGoal("");
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: color.background + "99",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 16,
              backgroundColor: color.background,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: color.text,
                fontFamily: FontFamily.bold,
                fontSize: 18,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              إضافة للتسبيح
            </Text>

            <Text
              style={{
                color: color.darkText,
                fontFamily: FontFamily.regular,
                fontSize: 14,
                textAlign: "center",
                marginBottom: 16,
                opacity: 0.8,
              }}
              numberOfLines={2}
            >
              {zikr.content}
            </Text>

            <Text
              style={{
                color: color.darkText,
                fontFamily: FontFamily.medium,
                marginBottom: 6,
              }}
            >
              الهدف اليومي
            </Text>
            <TextInput
              value={tasbeehGoal}
              onChangeText={(t) =>
                setTasbeehGoal(
                  t
                    .replace(/[\u0660-\u0669]/g, (d) =>
                      String(d.charCodeAt(0) - 0x0660)
                    )
                    .replace(/[\u06F0-\u06F9]/g, (d) =>
                      String(d.charCodeAt(0) - 0x06f0)
                    )
                    .replace(/[^0-9]/g, "")
                )
              }
              placeholder="مثال: 100"
              keyboardType="number-pad"
              placeholderTextColor={color.darkText}
              selectionColor={color.primary}
              style={{
                height: 48,
                borderWidth: 0,
                backgroundColor: color.bg20,
                borderRadius: 12,
                paddingHorizontal: 12,
                color: color.text,
                fontFamily: FontFamily.medium,
              }}
            />

            <View
              style={{
                flexDirection: "row-reverse",
                gap: 12,
                marginTop: 16,
              }}
            >
              <Pressable
                onPress={addToTasbeeh}
                disabled={!tasbeehGoal.trim()}
                style={{ flex: 1, opacity: !tasbeehGoal.trim() ? 0.5 : 1 }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: color.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: color.white,
                      fontFamily: FontFamily.bold,
                    }}
                  >
                    إضافة
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowAddTasbeehModal(false);
                  setTasbeehGoal("");
                }}
                style={{ flex: 1 }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 12,
                    borderWidth: 0,
                    backgroundColor: color.bg20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: color.text,
                      fontFamily: FontFamily.bold,
                    }}
                  >
                    إلغاء
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="none"
          onRequestClose={handleCloseSuccess}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: color.background + "DD",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onPress={handleCloseSuccess}
          >
            <Animated.View
              style={{
                width: "100%",
                borderRadius: 20,
                backgroundColor: color.background,
                padding: 24,
                alignItems: "center",
                transform: [
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: successAnim,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: color.primary + "20",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <FontAwesome5
                  name="check-circle"
                  size={40}
                  color={color.primary}
                  solid
                />
              </View>

              <Text
                style={{
                  color: color.text,
                  fontFamily: FontFamily.bold,
                  fontSize: 20,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                تم إضافة التسبيح بنجاح
              </Text>

              <Text
                style={{
                  color: color.darkText,
                  fontFamily: FontFamily.regular,
                  fontSize: 14,
                  textAlign: "center",
                  marginBottom: 24,
                  opacity: 0.8,
                }}
              >
                يمكنك الآن البدء في التسبيح والذكر
              </Text>

              <View
                style={{
                  flexDirection: "row-reverse",
                  gap: 12,
                  width: "100%",
                }}
              >
                <Pressable onPress={handleGoToTasbeeh} style={{ flex: 1 }}>
                  <View
                    style={{
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: color.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: color.white,
                        fontFamily: FontFamily.bold,
                        fontSize: 15,
                      }}
                    >
                      سبح الان
                    </Text>
                  </View>
                </Pressable>
                <Pressable onPress={handleCloseSuccess} style={{ flex: 1 }}>
                  <View
                    style={{
                      height: 48,
                      borderRadius: 12,
                      borderWidth: 0,
                      backgroundColor: color.bg20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: color.text,
                        fontFamily: FontFamily.bold,
                        fontSize: 15,
                      }}
                    >
                      البقاء هنا
                    </Text>
                  </View>
                </Pressable>
              </View>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create<any>({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    borderWidth: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  indexBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  indexText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  favoriteBtn: {
    padding: 8,
  },
  content: {
    fontSize: 20,
    fontFamily: FontFamily.bold,

    lineHeight: 38,
    marginBottom: 16,
  },
  descriptionBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: FontFamily.regular,

    lineHeight: 24,
    opacity: 0.8,
  },
  reference: {
    fontSize: 12,
    fontFamily: FontFamily.regular,

    marginBottom: 12,
    opacity: 0.7,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 16,
    gap: 16,
  },
  resetBtn: {
    padding: 8,
  },
  counterCircle: {
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  counterNumber: {
    fontSize: 32,
    fontFamily: FontFamily.black,
  },
  counterLabel: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    width: 50,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  counterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
  },
  counterBadgeText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  actionBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
    flex: 1,
  },
  actionBtnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 140,
    width: "100%",
  },
  copiedToast: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  copiedText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
  },
  completedText: {
    fontSize: 14,
    fontFamily: FontFamily.bold,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  dateText: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    textAlign: "center",
    marginTop: 4,
    opacity: 0.7,
  },
});
