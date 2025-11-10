import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { FontAwesome5 } from "@expo/vector-icons";
import { TasbeehItem } from "./types";
import { TasbeehItemCard } from "./TasbeehItemCard";

interface TasbeehListProps {
  items: TasbeehItem[];
  onDelete: (id: string) => void;
  color: any;
}

export const TasbeehList: React.FC<TasbeehListProps> = ({
  items,
  onDelete,
  color,
}) => {
  const [showCompletedSection, setShowCompletedSection] = useState<boolean>(true);

  const { completedItems, incompleteItems } = useMemo(() => {
    const completed = items.filter((item) => {
      const progress =
        item.dailyGoal > 0 ? Math.min(item.count / item.dailyGoal, 1) : 0;
      return progress >= 1;
    });
    const incomplete = items.filter((item) => {
      const progress =
        item.dailyGoal > 0 ? Math.min(item.count / item.dailyGoal, 1) : 0;
      return progress < 1;
    });
    return { completedItems: completed, incompleteItems: incomplete };
  }, [items]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Completed Items Section */}
        {completedItems.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowCompletedSection(!showCompletedSection)}
              style={styles.sectionHeader}
            >
              <Text style={[styles.sectionTitle, { color: color.primary }]}>
                التسابيح المكتملة اليوم
              </Text>
              <FontAwesome5
                name={showCompletedSection ? "chevron-down" : "chevron-left"}
                size={19}
                color={color.focusColor}
              />
            </TouchableOpacity>

            {showCompletedSection && (
              <View style={styles.itemsContainer}>
                {completedItems.map((item) => (
                  <TasbeehItemCard
                    key={item.id}
                    item={item}
                    onDelete={onDelete}
                    color={color}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Incomplete Items Section */}
        {incompleteItems.length > 0 && (
          <>
            {completedItems.length > 0 && (
              <Text style={[styles.remainingTitle, { color: color.text }]}>
                التسابيح المتبقية
              </Text>
            )}
            <View style={styles.itemsContainer}>
              {incompleteItems.map((item) => (
                <TasbeehItemCard
                  key={item.id}
                  item={item}
                  onDelete={onDelete}
                  color={color}
                />
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    flex: 1,
  },
  itemsContainer: {
    gap: 16,
  },
  remainingTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    marginBottom: 12,
  },
});

