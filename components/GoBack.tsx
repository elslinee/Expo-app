import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { router } from "expo-router";

type GoBackProps = {
  style?: any;
  color?: string;
};

export default function GoBack({ style, color: customColor }: GoBackProps) {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];
  const iconColor = customColor || color.primary;
  const bgColor = customColor ? `${customColor}22` : `${color.text20}22`;

  return (
    <View style={style}>
      <TouchableOpacity
        style={{
          position: "absolute",
          padding: 10,
          borderRadius: 8,
          backgroundColor: bgColor,
        }}
        onPress={() => router.back()}
      >
        <MaterialIcons
          style={{
            transform: [{ rotate: "180deg" }],
          }}
          name="arrow-back-ios-new"
          size={22}
          color={iconColor}
        />
      </TouchableOpacity>
    </View>
  );
}
