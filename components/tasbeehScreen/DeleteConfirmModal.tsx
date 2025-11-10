import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface DeleteConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  color: any;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  color,
}) => {
  if (!visible) return null;

  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: color.background + "59" },
      ]}
    >
      <View style={[styles.modal, { backgroundColor: color.background }]}>
        <Text style={[styles.title, { color: color.text }]}>تأكيد الحذف</Text>
        <Text style={[styles.message, { color: color.darkText }]}>
          هل تريد حذف هذا التسبيح؟ لا يمكن التراجع عن هذا الإجراء.
        </Text>
        <View style={styles.buttons}>
          <Pressable
            onPress={onConfirm}
            style={styles.button}
            android_ripple={{ color: color.primary20 }}
          >
            <View
              style={[
                styles.buttonContent,
                { backgroundColor: color.primary },
              ]}
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
              style={[
                styles.buttonContent,
                { backgroundColor: color.bg20 },
              ]}
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
    padding: 20,
  },
  modal: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
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
    gap: 12,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FontFamily.bold,
  },
});

