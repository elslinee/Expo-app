import { View } from "react-native";
import React from "react";
import { Switch } from "react-native-switch";
import { getColors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

const ToggleTheme = () => {
  const { theme, colorScheme, toggleTheme } = useTheme();
  const color = getColors(theme, colorScheme)[theme];

  return (
    <View style={{ backgroundColor: color.bg20 }}>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        circleSize={25}
        barHeight={25}
        backgroundActive={color.primary}
        backgroundInactive={color.primary20}
        circleActiveColor="#fff"
        circleInActiveColor="#fff"
        circleBorderActiveColor="transparent"
        circleBorderInactiveColor="transparent"
        renderActiveText={false}
        renderInActiveText={false}
        switchWidthMultiplier={2}
        switchBorderRadius={30}
      />
    </View>
  );
};

export default ToggleTheme;
