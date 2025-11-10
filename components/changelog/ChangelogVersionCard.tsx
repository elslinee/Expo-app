import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { ChangelogVersion } from "./types";
import { ChangelogCategory } from "./ChangelogCategory";

interface ChangelogVersionCardProps {
  version: ChangelogVersion;
  color: any;
}

export const ChangelogVersionCard: React.FC<ChangelogVersionCardProps> = ({
  version,
  color,
}) => {
  return (
    <View style={[styles.changelogCard, { backgroundColor: color.bg20 }]}>
      <View
        style={[
          styles.versionHeader,
          { borderBottomColor: color.primary + "30" },
        ]}
      >
        <Text style={[styles.versionNumber, { color: color.primary }]}>
          {version.version}
        </Text>
        <Text style={[styles.versionSubtitle, { color: color.darkText }]}>
          {version.subtitle}
        </Text>
      </View>

      {version.categories.map((category, index) => (
        <ChangelogCategory key={index} category={category} color={color} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  changelogCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  versionHeader: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  versionNumber: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  versionSubtitle: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});

