import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";

interface ChangelogHeaderProps {
  title: string;
  subtitle: string;
  color: any;
}

export const ChangelogHeader: React.FC<ChangelogHeaderProps> = ({
  title,
  subtitle,
  color,
}) => {
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: `${color.primary}15`, paddingTop: 80 },
      ]}
    >
      <Text style={[styles.headerTitle, { color: color.text }]}>{title}</Text>
      <Text style={[styles.headerSubtitle, { color: color.darkText }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: FontFamily.medium,
  },
});

