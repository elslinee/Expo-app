import { View, Text } from "react-native";
import React from "react";
import { useLocation } from "@/context/LocationContext";

export default function DateAndLocation({
  color,
  inHomeScreen = true,
}: {
  color: any;
  inHomeScreen?: boolean;
}) {
  const { address, errorMsg } = useLocation();

  let text = address;
  if (errorMsg) {
    text = errorMsg;
  }

  const date = new Date();
  const dayNumber = date.getDate();
  const day = date.toLocaleDateString("ar-EG", { weekday: "long" });
  const month = date.toLocaleDateString("ar-EG", { month: "long" });
  const year = date.getFullYear();
  const dayNumberIslamic = date.toLocaleDateString("ar-SA", {
    day: "numeric",
    calendar: "islamic",
  });
  const islamicDay = date.toLocaleDateString("ar-SA", {
    weekday: "long",
    calendar: "islamic",
  });
  const islamicMonth = date.toLocaleDateString("ar-SA", {
    month: "long",
    calendar: "islamic",
  });
  const islamicYear = date.toLocaleDateString("ar-SA", {
    year: "numeric",
    calendar: "islamic",
  });

  return (
    <View className="px-4 flex overflow-hidden  flex-row gap-4 justify-around items-center">
      <View className="flex flex-col gap-1">
        <Text
          style={{
            color: color.grey,
          }}
          className="text-xs font-light"
        >
          {dayNumber} {day} {month} {year}
        </Text>
        <Text
          style={{
            color: inHomeScreen ? color.text : color.primary,
          }}
          className="text-base font-medium "
        >
          {dayNumberIslamic} {islamicDay} {islamicMonth} {islamicYear}
        </Text>
      </View>
      <View className="flex flex-col gap-1">
        <Text
          style={{
            color: color.grey,
          }}
          className="text-xs font-light"
        >
          المكان
        </Text>
        <Text
          style={{
            color: inHomeScreen ? color.text : color.primary,
          }}
          className="text-base font-medium "
        >
          {text}
        </Text>
      </View>
    </View>
  );
}
