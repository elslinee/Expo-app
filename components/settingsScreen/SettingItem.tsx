import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontFamily } from "@/constants/FontFamily";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Svg, { Path } from "react-native-svg";

interface SettingItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconName?: keyof typeof FontAwesome5.glyphMap;
  iconSize?: number;
  onPress: () => void;
  color: any;
  showBorder?: boolean;
  rightComponent?: React.ReactNode;
}

// أيقونة معلومات
const InfoIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 16V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8H12.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  icon,
  iconName,
  iconSize = 24,
  onPress,
  color,
  showBorder = false,
  rightComponent,
}) => {
  const renderIcon = () => {
    if (icon) return icon;
    if (iconName === "info-circle") {
      return <InfoIcon color={color.primary} size={iconSize} />;
    }
    if (iconName) {
      return (
        <FontAwesome5 name={iconName} size={iconSize} color={color.primary} />
      );
    }
    return null;
  };

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: color.primary20 }}
      style={[
        styles.pressable,
        showBorder && {
          borderBottomWidth: 1,
          borderBottomColor: `${color.text}10`,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {renderIcon()}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: color.text }]}>{title}</Text>
            <Text style={[styles.description, { color: color.darkText }]}>
              {description}
            </Text>
          </View>
        </View>
        {rightComponent}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 8,
  },
  content: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginRight: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
  },
});
