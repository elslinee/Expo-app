import React, { useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { normalizeArabicNumbers, parseGoal } from "./utils";

interface AddTasbeehModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  newName: string;
  newGoal: string;
  setNewName: (name: string) => void;
  setNewGoal: (goal: string) => void;
  color: any;
}

export const AddTasbeehModal: React.FC<AddTasbeehModalProps> = ({
  visible,
  onClose,
  onAdd,
  newName,
  newGoal,
  setNewName,
  setNewGoal,
  color,
}) => {
  const isAddDisabled = useMemo(() => {
    const trimmedName = newName.trim();
    const parsedGoal = parseGoal(newGoal);
    return !trimmedName || !Number.isFinite(parsedGoal) || parsedGoal <= 0;
  }, [newName, newGoal]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: color.background + "66" }]}>
        <View style={[styles.modal, { backgroundColor: color.background }]}>
          <Text style={[styles.title, { color: color.text }]}>إضافة تسبيح</Text>

          <Text style={[styles.label, { color: color.darkText }]}>
            اسم التسبيح
          </Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="مثال: سبحان الله"
            placeholderTextColor={color.darkText}
            selectionColor={color.primary}
            style={[
              styles.input,
              { backgroundColor: color.bg20, color: color.text },
            ]}
          />

          <Text style={[styles.label, { color: color.darkText }]}>
            الهدف اليومي
          </Text>
          <TextInput
            value={newGoal}
            onChangeText={(t) => setNewGoal(normalizeArabicNumbers(t))}
            placeholder="مثال: 100"
            keyboardType="number-pad"
            placeholderTextColor={color.darkText}
            selectionColor={color.primary}
            style={[
              styles.input,
              { backgroundColor: color.bg20, color: color.text },
            ]}
          />

          <View style={styles.buttons}>
            <Pressable
              onPress={isAddDisabled ? undefined : onAdd}
              disabled={isAddDisabled}
              style={[styles.button, { opacity: isAddDisabled ? 0.5 : 1 }]}
            >
              <View
                style={[
                  styles.buttonContent,
                  { backgroundColor: color.primary },
                ]}
              >
                <Text
                  style={[styles.buttonText, { color: color.background }]}
                >
                  إضافة
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={onClose}
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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
    fontFamily: FontFamily.bold,
    fontSize: 18,
    textAlign: "center",
  },
  label: {
    fontFamily: FontFamily.medium,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: FontFamily.medium,
  },
  buttons: {
    flexDirection: "row-reverse",
    gap: 12,
    marginTop: 16,
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

