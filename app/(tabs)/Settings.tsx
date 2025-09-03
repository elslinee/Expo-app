import React from "react";
import { Text, View } from "@/components/Themed";
import ToggleTheme from "@/components/ToggleTheme";

export default function Settings() {

  return (
    <View className="flex-1 ">
      <View className="  ">
        <ToggleTheme />
      </View>
    </View>
  );
}
