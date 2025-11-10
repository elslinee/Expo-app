import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import { FontAwesome5 } from "@expo/vector-icons";
import { TasbeehItem } from "./types";
import { CounterCircle } from "./CounterCircle";

interface CounterCardProps {
  item: TasbeehItem;
  progress: number;
  progressAnim: any;
  isSmallScreen: boolean;
  color: any;
  completedColor: string;
  onCopy: () => void;
  onShare: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
}

export const CounterCard: React.FC<CounterCardProps> = ({
  item,
  progress,
  progressAnim,
  isSmallScreen,
  color,
  completedColor,
  onCopy,
  onShare,
  onReset,
  onToggleSound,
  soundEnabled,
}) => {
  const size = isSmallScreen ? 150 : 200;
  const strokeWidth = isSmallScreen ? 12 : 16;

  return (
    <View style={[styles.container, { backgroundColor: color.bg20 }]}>
      <View
        style={{
          gap: isSmallScreen ? 18 : 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable onLongPress={onCopy} style={styles.nameContainer}>
          <Text
            style={[
              styles.name,
              {
                color: color.text,
                fontSize: isSmallScreen ? 17 : 20,
              },
            ]}
            numberOfLines={isSmallScreen ? 3 : 4}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.3}
          >
            {item.name}
          </Text>
        </Pressable>

        <CounterCircle
          item={item}
          progress={progress}
          progressAnim={progressAnim}
          size={size}
          strokeWidth={strokeWidth}
          color={color.primary}
          completedColor={completedColor}
          darkTextColor={color.darkText}
        />

        <View style={styles.actions}>
          <TouchableOpacity onPress={onShare} style={styles.actionButton}>
            <FontAwesome5
              name="share-alt"
              size={18}
              color={progress >= 1 ? completedColor : color.primary}
            />
          </TouchableOpacity>
          <Pressable
            onPress={onReset}
            style={[styles.resetButton, { width: "60%" }]}
            android_ripple={{ color: color.primary20 }}
          >
            <View
              style={[
                styles.resetButtonContent,
                {
                  height: isSmallScreen ? 40 : 48,
                  backgroundColor:
                    progress >= 1 ? completedColor : color.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.resetButtonText,
                  {
                    color: color.background,
                    fontSize: isSmallScreen ? 12 : 15,
                  },
                ]}
              >
                تصفير
              </Text>
            </View>
          </Pressable>
          <TouchableOpacity onPress={onToggleSound} style={styles.actionButton}>
            <FontAwesome5
              name={soundEnabled ? "volume-up" : "volume-mute"}
              size={18}
              color={progress >= 1 ? completedColor : color.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 140,
    borderRadius: 18,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  nameContainer: {
    maxHeight: 200,
    width: "100%",
    paddingHorizontal: 10,
  },
  name: {
    fontFamily: FontFamily.black,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  resetButton: {
    // width handled inline
  },
  resetButtonContent: {
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    fontFamily: FontFamily.bold,
  },
});
