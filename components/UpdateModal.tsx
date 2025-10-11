import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontFamily } from "@/constants/FontFamily";

interface UpdateModalProps {
  visible: boolean;
  onRestart: () => void;
  onLater: () => void;
}

export default function UpdateModal({
  visible,
  onRestart,
  onLater,
}: UpdateModalProps) {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onLater}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
        onPress={onLater}
      >
        <Pressable
          style={{
            width: "100%",
            borderRadius: 16,
            backgroundColor: color.background,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* العنوان */}
          <Text
            style={{
              color: color.text,
              fontFamily: FontFamily.black,
              fontSize: 20,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            تحديث جديد متاح
          </Text>

          {/* الوصف */}
          <Text
            style={{
              color: color.darkText,
              fontFamily: FontFamily.medium,
              fontSize: 15,
              textAlign: "center",
              lineHeight: 24,
              marginBottom: 24,
            }}
          >
            تم تحميل تحديث جديد. سيتم إعادة تشغيل التطبيق لتطبيق التحديث.
          </Text>

          {/* الأزرار */}
          <View style={{ gap: 12 }}>
            {/* زر إعادة التشغيل */}
            <TouchableOpacity
              onPress={onRestart}
              style={{
                backgroundColor: color.primary,
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  color: color.background,
                  fontFamily: FontFamily.bold,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                إعادة التشغيل الآن
              </Text>
            </TouchableOpacity>

            {/* زر لاحقاً */}
            <TouchableOpacity
              onPress={onLater}
              style={{
                backgroundColor: color.bg20,
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  color: color.text,
                  fontFamily: FontFamily.bold,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                لاحقاً
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

