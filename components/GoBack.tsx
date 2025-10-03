import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getColors } from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { router } from "expo-router";

export default function GoBack({ style }: { style: any }) {
  const { theme, colorScheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  return (
    <View style={style}>
      <TouchableOpacity
        style={{
          position: "absolute",
          padding: 10,
          borderRadius: 8,
          backgroundColor: `${color.text20}22`,
        }}
        onPress={() => router.back()}
      >
        <MaterialIcons
          style={{
            transform: [{ rotate: "180deg" }],
          }}
          name="arrow-back-ios-new"
          size={22}
          color={color.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
