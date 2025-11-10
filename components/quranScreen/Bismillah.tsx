import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { useFontSize } from "@/context/FontSizeContext";

interface BismillahProps {
  surahNumber: number;
  color: any;
}

export const Bismillah: React.FC<BismillahProps> = ({ surahNumber, color }) => {
  const { fontSize } = useFontSize();

  if (surahNumber === 9 || surahNumber === 1) return null;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.bismillahText,
          { fontSize: fontSize + 4, color: color.primary },
        ]}
      >
        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  bismillahText: {
    fontFamily: FontFamily.quranBold,
    textAlign: "center",
  },
});
