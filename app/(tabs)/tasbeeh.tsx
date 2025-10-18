import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ViewStyle,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";
import LoadingScreen from "@/components/LoadingScreen";
import { TasbeehIcon } from "@/constants/Icons";
import Svg, { Path } from "react-native-svg";
import { useRouter, useFocusEffect } from "expo-router";

const STORAGE_KEY = "TASBEEH_LIST_V2";
const STATS_KEY = "TASBEEH_STATS_V1";

type TasbeehItem = {
  id: string;
  name: string;
  count: number;
  dailyGoal: number;
  totalCount?: number;
  lastUsedDate?: string;
  history?: { date: string; count: number }[];
};

type TasbeehStats = {
  totalTasbeeh: number;
  consecutiveDays: number;
  lastActiveDate: string;
};

export default function Tasbeeh() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const themeColors = getColors(theme, colorScheme)[theme];
  const router = useRouter();
  const [items, setItems] = useState<TasbeehItem[]>([]);
  const [stats, setStats] = useState<TasbeehStats>({
    totalTasbeeh: 0,
    consecutiveDays: 0,
    lastActiveDate: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newGoal, setNewGoal] = useState<string>("");
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [infoTitle, setInfoTitle] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const isAddDisabled = useMemo(() => {
    const trimmedName = newName.trim();
    const normalizedGoal = newGoal
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
      .replace(/[^0-9]/g, "");
    const parsedGoal = parseInt(normalizedGoal, 10);
    return !trimmedName || !Number.isFinite(parsedGoal) || parsedGoal <= 0;
  }, [newName, newGoal]);

  // Helper function to calculate consecutive days
  const calculateConsecutiveDays = useCallback((items: TasbeehItem[]) => {
    const today = new Date().toISOString().split("T")[0];
    const uniqueDates = new Set<string>();

    items.forEach((item) => {
      if (item.history && Array.isArray(item.history)) {
        item.history.forEach((h) => uniqueDates.add(h.date));
      }
    });

    const sortedDates = Array.from(uniqueDates).sort().reverse();
    if (sortedDates.length === 0) return 0;

    let consecutive = 0;
    let currentDate = new Date(today);

    for (const dateStr of sortedDates) {
      const checkDate = currentDate.toISOString().split("T")[0];
      if (dateStr === checkDate) {
        consecutive++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return consecutive;
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        // Migration from V1 to V2
        const oldData = await AsyncStorage.getItem("TASBEEH_LIST_V1");
        if (oldData && !(await AsyncStorage.getItem(STORAGE_KEY))) {
          try {
            const oldItems: TasbeehItem[] = JSON.parse(oldData);
            const migratedItems = oldItems.map((item) => ({
              ...item,
              totalCount: item.count || 0,
              lastUsedDate: new Date().toISOString().split("T")[0],
              history:
                item.count > 0
                  ? [
                      {
                        date: new Date().toISOString().split("T")[0],
                        count: item.count,
                      },
                    ]
                  : [],
            }));
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(migratedItems)
            );
            await AsyncStorage.removeItem("TASBEEH_LIST_V1");
          } catch {
            // ignore migration errors
          }
        }

        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const savedStats = await AsyncStorage.getItem(STATS_KEY);

        if (saved) {
          const parsed: TasbeehItem[] = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed);

            // Calculate stats
            const totalTasbeeh = parsed.reduce(
              (sum, item) => sum + (item.totalCount || 0),
              0
            );
            const consecutiveDays = calculateConsecutiveDays(parsed);
            const lastActiveDate =
              parsed
                .map((item) => item.lastUsedDate || "")
                .filter(Boolean)
                .sort()
                .reverse()[0] || "";

            setStats({ totalTasbeeh, consecutiveDays, lastActiveDate });
          }
        }

        if (savedStats) {
          const parsedStats: TasbeehStats = JSON.parse(savedStats);
          setStats((prev) => ({ ...prev, ...parsedStats }));
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
        setHasHydrated(true);
      }
    };
    load();
  }, [calculateConsecutiveDays]);

  useEffect(() => {
    if (!hasHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, hasHydrated]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const refresh = async () => {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (!isActive) return;
          if (saved) {
            const parsed: TasbeehItem[] = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              // Reset daily count if it's a new day
              const today = new Date().toISOString().split("T")[0];
              const updatedItems = parsed.map((item) => {
                if (item.lastUsedDate && item.lastUsedDate !== today) {
                  return { ...item, count: 0 };
                }
                return item;
              });

              setItems(updatedItems);

              // Save updated items if any were reset
              if (JSON.stringify(updatedItems) !== JSON.stringify(parsed)) {
                await AsyncStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify(updatedItems)
                );
              }

              // Recalculate stats
              const totalTasbeeh = updatedItems.reduce(
                (sum, item) => sum + (item.totalCount || 0),
                0
              );
              const consecutiveDays = calculateConsecutiveDays(updatedItems);
              const lastActiveDate =
                updatedItems
                  .map((item) => item.lastUsedDate || "")
                  .filter(Boolean)
                  .sort()
                  .reverse()[0] || "";

              setStats({ totalTasbeeh, consecutiveDays, lastActiveDate });
            }
          }
        } catch {
          // ignore
        }
      };
      refresh();
      return () => {
        isActive = false;
      };
    }, [calculateConsecutiveDays])
  );

  const addTasbeeh = useCallback(() => {
    const trimmedName = newName.trim();
    const normalizedGoal = newGoal
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
      .replace(/[^0-9]/g, "");
    const parsedGoal = parseInt(normalizedGoal, 10);
    if (!trimmedName) {
      setInfoTitle("تنبيه");
      setInfoMessage("الرجاء إدخال اسم التسبيح");
      setShowInfoModal(true);
      return;
    }
    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      setInfoTitle("تنبيه");
      setInfoMessage("الرجاء إدخال هدف يومي صالح");
      setShowInfoModal(true);
      return;
    }
    const newItem: TasbeehItem = {
      id: `${Date.now()}`,
      name: trimmedName,
      count: 0,
      dailyGoal: parsedGoal,
      totalCount: 0,
      lastUsedDate: "",
      history: [],
    };
    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setNewName("");
    setNewGoal("");
  }, [newName, newGoal]);

  const decrementItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, count: it.count > 0 ? it.count - 1 : 0 } : it
      )
    );
  }, []);

  const resetItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, count: 0 } : it))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const requestDelete = useCallback((id: string) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (pendingDeleteId) {
      removeItem(pendingDeleteId);
    }
    setPendingDeleteId(null);
    setShowDeleteModal(false);
  }, [pendingDeleteId, removeItem]);

  const cancelDelete = useCallback(() => {
    setPendingDeleteId(null);
    setShowDeleteModal(false);
  }, []);

  const circleSize = 220;

  const ringStyle = useMemo<ViewStyle>(
    () => ({
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      borderWidth: 0,
      backgroundColor: themeColors.bg20,
      alignItems: "center",
      justifyContent: "center",
    }),
    [circleSize, themeColors]
  );

  const renderItem = useCallback(
    ({ item }: { item: TasbeehItem }) => {
      const progress =
        item.dailyGoal > 0 ? Math.min(item.count / item.dailyGoal, 1) : 0;
      const isCompleted = progress >= 1;

      return (
        <Pressable
          onPress={() =>
            router.push({ pathname: "/tasbeeh/[id]", params: { id: item.id } })
          }
          android_ripple={{ color: themeColors.primary20 }}
          style={{
            backgroundColor: themeColors.bg20,
            borderRadius: 20,
            padding: 20,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  color: themeColors.text,
                  fontFamily: FontFamily.bold,
                  fontSize: 18,
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              height: 12,
              backgroundColor: themeColors.background,
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor: isCompleted
                  ? themeColors.focusColor
                  : themeColors.primary,
                borderRadius: 12,
              }}
            />
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text
                style={{
                  color: themeColors.text,
                  fontFamily: FontFamily.black,
                  fontSize: 20,
                }}
              >
                {item.count}
              </Text>
              <Text
                style={{
                  color: themeColors.darkText,
                  fontFamily: FontFamily.medium,
                  fontSize: 14,
                }}
              >
                {item.dailyGoal} /
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: themeColors.primary,
                }}
              >
                <Text
                  style={{
                    color: themeColors.white,
                    fontFamily: FontFamily.bold,
                    fontSize: 13,
                  }}
                >
                  فتح التسبيح
                </Text>
              </View>
              <Pressable
                onPress={() => requestDelete(item.id)}
                android_ripple={{ color: themeColors.primary20 }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                  borderRadius: 8,
                  backgroundColor: themeColors.background,
                }}
              >
                <Text
                  style={{
                    color: themeColors.darkText,
                    fontFamily: FontFamily.medium,
                    fontSize: 12,
                  }}
                >
                  حذف
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      );
    },
    [themeColors, router, requestDelete]
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
        }}
      >
        {isLoading ? (
          <LoadingScreen
            message="جاري التحميل..."
            customIcon={
              <TasbeehIcon width={88} height={88} color={color.primary} />
            }
          />
        ) : (
          <>
            {/* Statistics Section */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row-reverse",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {/* Total Tasbeeh Card */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row-reverse",
                    backgroundColor: themeColors.primary,
                    borderRadius: 20,
                    paddingVertical: 45,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: themeColors.white,
                        fontFamily: FontFamily.black,
                        fontSize: 38,
                        lineHeight: 30,
                      }}
                    >
                      {stats.totalTasbeeh}
                    </Text>
                    <Text
                      style={{
                        color: themeColors.white,
                        fontFamily: FontFamily.medium,
                        fontSize: 14,
                        opacity: 0.9,
                      }}
                    >
                      اجمالي التسابيح
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row-reverse",
                    backgroundColor: themeColors.bg20,
                    borderRadius: 20,
                    paddingVertical: 45,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: themeColors.darkText,
                        fontFamily: FontFamily.black,
                        fontSize: 38,
                        lineHeight: 30,
                      }}
                    >
                      {stats.consecutiveDays}
                    </Text>
                    <Text
                      style={{
                        color: themeColors.darkText,
                        fontFamily: FontFamily.medium,
                        fontSize: 14,
                        opacity: 0.9,
                      }}
                    >
                      ايام متتالية
                    </Text>
                  </View>
                </View>

                {/* Consecutive Days Card */}
              </View>

              {/* Add Button */}
              <Pressable
                onPress={() => setShowAddModal(true)}
                android_ripple={{ color: themeColors.primary20 }}
              >
                <View
                  style={{
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: themeColors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row-reverse",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.white,
                      fontFamily: FontFamily.bold,
                      fontSize: 16,
                    }}
                  >
                    إضافة تسبيح جديد
                  </Text>
                  <Text
                    style={{
                      color: themeColors.white,
                      fontFamily: FontFamily.black,
                      fontSize: 20,
                    }}
                  >
                    +
                  </Text>
                </View>
              </Pressable>
            </View>

            {items.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  marginTop: 60,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: themeColors.text,
                    fontFamily: FontFamily.bold,
                    fontSize: 18,
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  ابدأ رحلتك الروحانية
                </Text>
                <Text
                  style={{
                    color: themeColors.darkText,
                    fontFamily: FontFamily.medium,
                    fontSize: 14,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  أضف تسبيحك الأول واحصل على الأجر والثواب
                </Text>
              </View>
            ) : (
              <FlatList
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                }}
                data={items}
                keyExtractor={(it) => it.id}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingBottom: 24,
                  gap: 12,
                }}
                numColumns={1}
              />
            )}

            <Modal
              visible={showAddModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowAddModal(false)}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: themeColors.background + "66",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    backgroundColor: themeColors.background,
                    padding: 16,
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.text,
                      fontFamily: FontFamily.bold,
                      fontSize: 18,
                      textAlign: "center",
                    }}
                  >
                    إضافة تسبيح
                  </Text>

                  <Text
                    style={{
                      color: themeColors.darkText,
                      fontFamily: FontFamily.medium,
                      marginTop: 14,
                      marginBottom: 6,
                    }}
                  >
                    اسم التسبيح
                  </Text>
                  <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="مثال: سبحان الله"
                    placeholderTextColor={themeColors.darkText}
                    selectionColor={themeColors.primary}
                    style={{
                      height: 48,
                      borderWidth: 0,
                      backgroundColor: themeColors.bg20,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      color: themeColors.text,
                      fontFamily: FontFamily.medium,
                    }}
                  />

                  <Text
                    style={{
                      color: themeColors.darkText,
                      fontFamily: FontFamily.medium,
                      marginTop: 12,
                      marginBottom: 6,
                    }}
                  >
                    الهدف اليومي
                  </Text>
                  <TextInput
                    value={newGoal}
                    onChangeText={(t) =>
                      setNewGoal(
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
                    placeholderTextColor={themeColors.darkText}
                    selectionColor={themeColors.primary}
                    style={{
                      height: 48,
                      borderWidth: 0,
                      backgroundColor: themeColors.bg20,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      color: themeColors.text,
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
                      onPress={isAddDisabled ? undefined : addTasbeeh}
                      disabled={isAddDisabled}
                      style={{ flex: 1, opacity: isAddDisabled ? 0.5 : 1 }}
                    >
                      <View
                        style={{
                          height: 48,
                          borderRadius: 12,
                          backgroundColor: themeColors.primary,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: themeColors.background,
                            fontFamily: FontFamily.bold,
                          }}
                        >
                          إضافة
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => setShowAddModal(false)}
                      style={{ flex: 1 }}
                      android_ripple={{ color: themeColors.primary20 }}
                    >
                      <View
                        style={{
                          height: 48,
                          borderRadius: 12,
                          borderWidth: 0,
                          backgroundColor: themeColors.bg20,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: themeColors.text,
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
          </>
        )}
      </View>
      {showDeleteModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: themeColors.background + "59",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              borderRadius: 16,
              backgroundColor: themeColors.background,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: themeColors.text,
                fontFamily: FontFamily.black,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              تأكيد الحذف
            </Text>
            <Text
              style={{
                marginTop: 8,
                color: themeColors.darkText,
                fontFamily: FontFamily.medium,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              هل تريد حذف هذا التسبيح؟ لا يمكن التراجع عن هذا الإجراء.
            </Text>
            <View
              style={{
                marginTop: 16,
                flexDirection: "row-reverse",
                gap: 12,
              }}
            >
              <Pressable
                onPress={confirmDelete}
                style={{ flex: 1 }}
                android_ripple={{ color: themeColors.primary20 }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: themeColors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.white,
                      fontFamily: FontFamily.bold,
                    }}
                  >
                    تأكيد
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={cancelDelete}
                style={{ flex: 1 }}
                android_ripple={{ color: themeColors.primary20 }}
              >
                <View
                  style={{
                    height: 48,
                    borderRadius: 12,
                    borderWidth: 0,
                    backgroundColor: themeColors.bg20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: themeColors.text,
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
      )}
    </>
  );
}
