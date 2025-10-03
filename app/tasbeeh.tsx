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
import { useRouter, useFocusEffect } from "expo-router";
import GoBack from "@/components/GoBack";

const STORAGE_KEY = "TASBEEH_LIST_V1";

type TasbeehItem = {
  id: string;
  name: string;
  count: number;
  dailyGoal: number;
};

export default function Tasbeeh() {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const themeColors = getColors(theme, colorScheme)[theme];
  const router = useRouter();
  const [items, setItems] = useState<TasbeehItem[]>([]);
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

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: TasbeehItem[] = JSON.parse(saved);
          if (Array.isArray(parsed)) setItems(parsed);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
        setHasHydrated(true);
      }
    };
    load();
  }, []);

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
            if (Array.isArray(parsed)) setItems(parsed);
          }
        } catch {
          // ignore
        }
      };
      refresh();
      return () => {
        isActive = false;
      };
    }, [])
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
      return (
        <Pressable
          onPress={() =>
            router.push({ pathname: "/tasbeeh/[id]", params: { id: item.id } })
          }
          android_ripple={{ color: themeColors.primary20 }}
          style={{
            minHeight: 150,
            flex: 1,
            borderWidth: 0,
            backgroundColor: themeColors.bg20,
            borderRadius: 16,
            padding: 14,
            marginBottom: 12,
            marginHorizontal: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => requestDelete(item.id)}
              android_ripple={{ color: themeColors.primary20 }}
            >
              <Text
                style={{
                  color: themeColors.darkText,
                  fontFamily: FontFamily.medium,
                }}
              >
                حذف
              </Text>
            </Pressable>
            <Text
              style={{
                color: themeColors.text,
                fontFamily: FontFamily.bold,
                fontSize: 15,
                overflow: "hidden",
                textOverflow: "ellipsis",

                maxWidth: "80%",
              }}
            >
              {item.name}
            </Text>
          </View>

          <View
            style={{
              height: 8,
              backgroundColor: themeColors.text20,
              borderRadius: 8,
              marginTop: 12,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor: themeColors.primary,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
            }}
          >
            <Text
              style={{
                color: themeColors.darkText,
                fontFamily: FontFamily.medium,
              }}
            >
              {item.count} / {item.dailyGoal}
            </Text>
            <Text
              style={{ color: themeColors.text, fontFamily: FontFamily.bold }}
            >
              فتح
            </Text>
          </View>
        </Pressable>
      );
    },
    [themeColors, router, removeItem]
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 60,
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
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Pressable
                onPress={() => setShowAddModal(true)}
                android_ripple={{ color: themeColors.primary20 }}
              >
                <View
                  style={{
                    height: 40,
                    paddingHorizontal: 14,
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
                    + إضافة
                  </Text>
                </View>
              </Pressable>
              <GoBack
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
              <Text
                style={{
                  color: themeColors.darkText,
                  fontFamily: FontFamily.bold,
                  fontSize: 20,
                  marginLeft: 80,
                }}
              >
                جميع التسابيح
              </Text>
            </View>

            {items.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <Text
                  style={{
                    color: themeColors.darkText,
                    fontFamily: FontFamily.medium,
                  }}
                >
                  لا توجد تسابيح بعد. اضغط "إضافة" لإضافة تسبيح جديد.
                </Text>
                <View style={{ marginTop: 20 }}>
                  <View style={ringStyle}>
                    <Text
                      style={{
                        color: themeColors.primary,
                        fontFamily: FontFamily.black,
                        fontSize: 32,
                      }}
                    >
                      0
                    </Text>
                    <Text
                      style={{
                        marginTop: 8,
                        color: themeColors.darkText,
                        fontFamily: FontFamily.medium,
                        fontSize: 14,
                      }}
                    >
                      أضف أول تسبيح لك
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <FlatList
                style={{
                  marginTop: 20,
                  borderWidth: 0,
                }}
                data={items}
                keyExtractor={(it) => it.id}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingBottom: 24,
                  paddingTop: 4,
                  gap: 8,
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
