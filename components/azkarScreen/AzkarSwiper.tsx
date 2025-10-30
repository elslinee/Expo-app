import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Share,
} from "react-native";

import PagerView from "react-native-pager-view";
import { FontFamily } from "@/constants/FontFamily";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

type Zikr = {
  category: string;
  count: string;
  description: string;
  reference: string;
  content: string;
};

interface Props {
  azkar: Zikr[];
  color: any;
}

// Pager-based swiper
export default function AzkarSwiper({ azkar, color }: Props) {
  const [index, setIndex] = useState(0);
  const target = useMemo(() => {
    const raw = azkar && azkar[index] ? azkar[index].count : "1";
    const digits =
      typeof raw === "string" ? raw.replace(/[^0-9]/g, "") : String(raw ?? "1");
    const parsed = parseInt(digits || "1", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [index, azkar]);
  const [count, setCount] = useState(0);
  const pagerRef = useRef<PagerView | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const current = azkar && azkar.length > 0 ? azkar[index] : undefined;

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (!current) return;
      let text = current.content;
      if (current.description) {
        text += `\n\n${current.description}`;
      }
      if (current.reference) {
        text += `\n\n${current.reference}`;
      }
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ في النسخ");
    }
  }, [current]);

  const handleShare = useCallback(async () => {
    try {
      if (!current) return;
      let message = current.content;
      if (current.description) {
        message += `\n\n${current.description}`;
      }
      if (current.reference) {
        message += `\n\n${current.reference}`;
      }
      await Share.share({ message });
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ في المشاركة");
    }
  }, [current]);

  // Reset to first item when data changes, and ensure valid index
  useEffect(() => {
    if (!azkar || azkar.length === 0) {
      setIndex(0);
      setCount(0);
      return;
    }
    if (index >= azkar.length) {
      setIndex(0);
      setCount(0);
      pagerRef.current?.setPage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [azkar?.length]);

  const onTick = () => {
    const newCount = count + 1;
    if (newCount >= target) {
      const next = index + 1;
      if (next < azkar.length) {
        pagerRef.current?.setPage(next);
      } else {
        // finished all; keep last as completed
        setCount(target);
        setShowCompleted(true);
      }
    } else {
      setCount(newCount);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <View style={[styles.topBar]}>
        <Text style={[styles.progress, { color: color.text20 }]}>
          {azkar?.length ? `${index + 1} / ${azkar.length}` : "0 / 0"}
        </Text>
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1, paddingHorizontal: 12 }}
        scrollEnabled={false}
        initialPage={0}
        onPageSelected={(e: any) => {
          setIndex(e.nativeEvent.position);
          setCount(0);
        }}
      >
        {azkar && azkar.length > 0 ? (
          azkar.map((z, i) => (
            <View
              key={i}
              style={[
                styles.card,
                {
                  backgroundColor: color.bg20,
                 
                },
              ]}
            >
              <View style={styles.actionBtns}>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: `${color.text20}22`,
                    },
                  ]}
                >
                  <FontAwesome5
                    name={copied ? "check" : "copy"}
                    size={16}
                    color={copied ? color.primary : color.darkText}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: `${color.text20}22`,
                    },
                  ]}
                >
                  <FontAwesome5
                    name="share-alt"
                    size={16}
                    color={color.darkText}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 28,
                  flexGrow: 1,
                  justifyContent: "center",
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  ellipsizeMode="tail"
                  style={[styles.content, { color: color.darkText }]}
                >
                  {z.content}
                </Text>
                {z.reference ? (
                  <Text style={[styles.reference, { color: color.text20 }]}>
                    {z.reference}
                  </Text>
                ) : null}
                {z.description ? (
                  <Text style={[styles.description, { color: color.text20 }]}>
                    {z.description}
                  </Text>
                ) : null}
              </ScrollView>
            </View>
          ))
        ) : (
          <View
            key={"empty"}
            style={[
              styles.card,
              {
                backgroundColor: color.white,
                shadowColor: color.primary,
              },
            ]}
          >
            <Text style={[styles.description, { color: color.text20 }]}>
              لا توجد أذكار متاحة
            </Text>
          </View>
        )}
      </PagerView>

      <View style={styles.counterRow}>
        <TouchableOpacity
          disabled={!current}
          onPress={onTick}
          activeOpacity={1}
          style={[
            styles.tickBtn,
            {
              backgroundColor: color.primary,
            },
          ]}
        >
          <Text style={[styles.counterText, { color: color.primary20 }]}>
            {current ? `${count} / ${target}` : "0 / 0"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Copied Toast */}

      {/* Completion Modal */}
      <Modal
        transparent
        visible={showCompleted}
        animationType="fade"
        onRequestClose={() => setShowCompleted(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalCard, { backgroundColor: color.background }]}
          >
            <Text style={[styles.modalTitle, { color: color.darkText }]}>
              أحسنت!
            </Text>
            <Text style={[styles.modalText, { color: color.text20 }]}>
              لقد أكملت جميع الاذكار.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setShowCompleted(false);
                }}
                style={[
                  styles.modalBtn,
                  { borderColor: color.border, backgroundColor: color.bg20 },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.modalBtnTextOutline,
                    { color: color.darkText },
                  ]}
                >
                  إغلاق
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(0);
                  setCount(0);
                  pagerRef.current?.setPage(0);
                  setShowCompleted(false);
                }}
                style={[styles.modalBtn, { backgroundColor: color.primary }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalBtnText, { color: color.white }]}>
                  إعادة البدء
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Copied Toast */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  topBar: {
    alignItems: "center",
    marginBottom: 20,
  },
  progress: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    opacity: 1,
    letterSpacing: 0.5,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 24,

    minHeight: 280,
  },
  content: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    lineHeight: 32,

    textAlign: "center",

    letterSpacing: 0.5,
  },
  reference: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: FontFamily.medium,
    fontSize: 11,
    opacity: 1,
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  description: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: FontFamily.regular,
    fontSize: 11,
    opacity: 1,
    letterSpacing: 0.3,
    lineHeight: 14,
  },
  counterRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    paddingHorizontal: 20,
  },
  counterBox: {
    borderWidth: 0,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 0,
    marginBottom: 12,
    minWidth: 80,
    alignItems: "center",
  },
  counterText: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  tickBtn: {
    borderRadius: 99,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  tickText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  modalText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
  },
  modalBtnTextOutline: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
  },
  actionBtns: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  actionBtn: {
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
