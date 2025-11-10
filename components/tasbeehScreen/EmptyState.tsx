import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface EmptyStateProps {
  color: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ color }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: color.text }]}>
        ابدأ رحلتك الروحانية
      </Text>
      <Text style={[styles.description, { color: color.darkText }]}>
        أضف تسبيحك الأول واحصل على الأجر والثواب
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});

