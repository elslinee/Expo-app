import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface SurahLoadingProps {
  color: any;
}

export const SurahLoading: React.FC<SurahLoadingProps> = ({ color }) => {
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <ActivityIndicator size="large" color={color.primary} />
      <Text style={[styles.loadingText, { color: color.text }]}>
        جاري تحميل السورة...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    textAlign: "center",
    marginTop: 16,
  },
});

