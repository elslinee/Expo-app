import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { FontAwesome5 } from "@expo/vector-icons";

interface AddButtonProps {
  onPress: () => void;
  color: any;
}

export const AddButton: React.FC<AddButtonProps> = ({ onPress, color }) => {
  return (
    <Pressable onPress={onPress} android_ripple={{ color: color.primary20 }}>
      <View style={[styles.button, { backgroundColor: color.primary }]}>
        <Text style={[styles.text, { color: color.white }]}>
          إضافة تسبيح جديد
        </Text>
        <FontAwesome5 name="plus" size={18} color={color.white} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row-reverse",
    gap: 8,
  },
  text: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
});

