import React from "react";
import { View, StyleSheet } from "react-native";

interface SettingCardProps {
  children: React.ReactNode;
  color: any;
  padding?: number;
}

export const SettingCard: React.FC<SettingCardProps> = ({
  children,
  color,
  padding = 16,
}) => {
  return (
    <View
      style={[styles.card, { backgroundColor: color.bg20, padding: padding }]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 0,
    marginBottom: 8,
  },
});
