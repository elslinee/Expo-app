import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { ChangelogCategory as ChangelogCategoryType } from "./types";

interface ChangelogCategoryProps {
  category: ChangelogCategoryType;
  color: any;
}

export const ChangelogCategory: React.FC<ChangelogCategoryProps> = ({
  category,
  color,
}) => {
  return (
    <View style={styles.category}>
      <Text style={[styles.categoryTitle, { color: color.text }]}>
        {category.title}
      </Text>
      {category.items.map((item, index) => (
        <Text key={index} style={[styles.changelogItem, { color: color.darkText }]}>
          • {item.text}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  category: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginBottom: 8,
  },
  changelogItem: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    lineHeight: 22,
    marginBottom: 4,
  },
});

