import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { TasbeehStats } from "./types";

interface TasbeehStatsCardProps {
  stats: TasbeehStats;
  color: any;
}

export const TasbeehStatsCard: React.FC<TasbeehStatsCardProps> = ({
  stats,
  color,
}) => {
  return (
    <View style={styles.container}>
      {/* Total Tasbeeh Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: color.primary },
        ]}
      >
        <View style={styles.content}>
          <Text style={[styles.number, { color: color.white }]}>
            {stats.totalTasbeeh}
          </Text>
          <Text style={[styles.label, { color: color.white }]}>
            اجمالي التسابيح
          </Text>
        </View>
      </View>

      {/* Consecutive Days Card */}
      <View style={[styles.card, { backgroundColor: color.bg20 }]}>
        <View style={styles.content}>
          <Text style={[styles.number, { color: color.darkText }]}>
            {stats.consecutiveDays}
          </Text>
          <Text style={[styles.label, { color: color.darkText }]}>
            ايام متتالية
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    flexDirection: "row-reverse",
    borderRadius: 20,
    paddingVertical: 45,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flex: 1,
  },
  number: {
    fontFamily: FontFamily.black,
    fontSize: 38,
    lineHeight: 30,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    opacity: 0.9,
  },
});

