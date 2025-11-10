import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface ResetModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  color: any;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  color,
}) => {
  if (!visible) return null;

  return (
    <View
      style={[styles.overlay, { backgroundColor: color.background + "99" }]}
    >
      <View style={[styles.modal, { backgroundColor: color.background }]}>
        <Text style={[styles.title, { color: color.text }]}>تأكيد التصفير</Text>
        <Text style={[styles.message, { color: color.darkText }]}>
          هل تريد تصفير العداد؟ لا يمكن التراجع عن هذا الإجراء.
        </Text>
        <View style={styles.buttons}>
          <Pressable
            onPress={onConfirm}
            style={styles.button}
            android_ripple={{ color: color.primary20 }}
          >
            <View
              style={[styles.buttonContent, { backgroundColor: color.primary }]}
            >
              <Text style={[styles.buttonText, { color: color.white }]}>
                تأكيد
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={onCancel}
            style={styles.button}
            android_ripple={{ color: color.primary20 }}
          >
            <View
              style={[styles.buttonContent, { backgroundColor: color.bg20 }]}
            >
              <Text style={[styles.buttonText, { color: color.text }]}>
                إلغاء
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontFamily: FontFamily.black,
    fontSize: 18,
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    fontFamily: FontFamily.medium,
    fontSize: 14,
    textAlign: "center",
  },
  buttons: {
    marginTop: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
  },
});
