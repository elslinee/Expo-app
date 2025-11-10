import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface ChangelogFooterProps {
  text: string;
  color: any;
}

export const ChangelogFooter: React.FC<ChangelogFooterProps> = ({
  text,
  color,
}) => {
  return (
    <View style={styles.footer}>
      <Text style={[styles.footerText, { color: color.darkText }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    textAlign: "center",
  },
});

