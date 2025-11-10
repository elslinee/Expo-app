import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontFamily } from "@/constants/FontFamily";

interface SurahErrorProps {
  error: string | null;
  onRetry: () => void;
  color: any;
}

export const SurahError: React.FC<SurahErrorProps> = ({
  error,
  onRetry,
  color,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <FontAwesome5 name="exclamation-triangle" size={48} color={color.text} />
      <Text style={[styles.errorText, { color: color.text }]}>
        {error || "لم يتم العثور على السورة"}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: color.primary }]}
        onPress={onRetry}
      >
        <Text style={[styles.retryButtonText, { color: color.white }]}>
          إعادة المحاولة
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FontFamily.medium,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
  },
});

