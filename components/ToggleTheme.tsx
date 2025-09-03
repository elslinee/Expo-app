import { View, Text } from "@/components/Themed";
import React from "react";
import { Switch } from "react-native-switch";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();
  const color = Colors[theme]; 

  return (
    <View
      style={{ backgroundColor: color.grey }}
      className="px-4 py-2 flex flex-row items-center justify-between"
    >
      <Text className="text-lg font-medium">الوضع الليلي</Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        circleSize={25}
        barHeight={25}
        backgroundActive={color.primary}
        backgroundInactive={color.tabIconDefault}
        circleActiveColor="#fff"
        circleInActiveColor="#ccc"
        renderActiveText={false}
        renderInActiveText={false}
        switchWidthMultiplier={2}
        switchBorderRadius={30}
      />
    </View>
  );
};

export default ToggleTheme;
