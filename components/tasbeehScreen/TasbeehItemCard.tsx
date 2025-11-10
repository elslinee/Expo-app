import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontFamily } from "@/constants/FontFamily";
import { TasbeehItem } from "./types";

interface TasbeehItemCardProps {
  item: TasbeehItem;
  onDelete: (id: string) => void;
  color: any;
}

export const TasbeehItemCard: React.FC<TasbeehItemCardProps> = ({
  item,
  onDelete,
  color,
}) => {
  const router = useRouter();
  const progress =
    item.dailyGoal > 0 ? Math.min(item.count / item.dailyGoal, 1) : 0;
  const isCompleted = progress >= 1;

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/tasbeeh/[id]", params: { id: item.id } })
      }
      android_ripple={{ color: color.primary20 }}
      style={[
        styles.container,
        {
          backgroundColor: isCompleted
            ? color.focusColor + "20"
            : color.bg20,
          opacity: isCompleted ? 0.7 : 1,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text
            style={[styles.name, { color: color.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressBarContainer,
          { backgroundColor: color.background },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress * 100}%`,
              backgroundColor: isCompleted ? color.focusColor : color.primary,
            },
          ]}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.countContainer}>
          <Text style={[styles.count, { color: color.text }]}>
            {item.count}
          </Text>
          <Text style={[styles.goal, { color: color.darkText }]}>
            {item.dailyGoal} /
          </Text>
        </View>
        <View style={styles.actions}>
          <View
            style={[
              styles.openButton,
              { backgroundColor: color.primary },
            ]}
          >
            <Text style={[styles.openButtonText, { color: color.white }]}>
              فتح التسبيح
            </Text>
          </View>
          <Pressable
            onPress={() => onDelete(item.id)}
            android_ripple={{ color: color.primary20 }}
            style={[
              styles.deleteButton,
              { backgroundColor: color.background },
            ]}
          >
            <Text style={[styles.deleteButtonText, { color: color.darkText }]}>
              حذف
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 12,
  },
  footer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  count: {
    fontFamily: FontFamily.black,
    fontSize: 20,
  },
  goal: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  openButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  openButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
});

