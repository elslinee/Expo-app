import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import { usePrayerTimes } from "@/context/PrayerTimesContext";
import getNextPrayerTime from "@/utils/getNextPrayerTime";
import { formatTo12Hour } from "@/utils/formatTo12Hour";

export default function MosqueBackground({ color }: { color: any }) {
  const image = require("../../assets/images/homeFrame1.png");
  const date = new Date();
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [nextPrayerTime, setNextPrayerTime] = useState<string>("");
  const { prayerTimes } = usePrayerTimes();
  const getNextPrayer = async () => {
    if (prayerTimes?.timings) {
      const response = getNextPrayerTime(prayerTimes?.timings);
      setNextPrayer(response?.nextPrayer || "غير متوفر");
      setNextPrayerTime(
        formatTo12Hour(response?.nextPrayerTime || "غير متوفر")
      );
    }
  };

  useEffect(() => {
    getNextPrayer();
  }, [prayerTimes]);
  return (
    <View className="w-full  px-6 py-3.5">
      <LinearGradient
        className="w-full   relative"
        colors={[color.primary, color.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1.8 }}
        style={{
          height: 150,
          borderRadius: 16,
        }}
      >
        {nextPrayer && (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 24,
              paddingRight: 24,
            }}
            className="   "
          >
            <Text
              style={{
                color: color.white,
                lineHeight: 14,
                marginRight: "auto",
                paddingTop: 12,
                paddingBottom: 4,
              }}
              className="text-xs   font-light "
            >
              الصلاة التالية: <Text className="font-bold"> {nextPrayer}</Text>
            </Text>
            <View className="flex  flex-row   ">
              <Text
                style={{
                  lineHeight: 44,

                  fontSize: 34,
                  color: color.white,
                  zIndex: 1,
                }}
                className="font-bold  "
              >
                {nextPrayerTime.split("م")[0] || nextPrayerTime.split("ص")[0]}
              </Text>
            </View>

            {/* <Text
            style={{ color: color.white, lineHeight: 14, marginLeft: "auto" }}
            className="text-xs  font-light "
          >
            {nextPrayerTime}
          </Text> */}
          </View>
        )}
        <View style={{ marginTop: "auto" }} className="w-full   ">
          <Image source={image} />
        </View>
      </LinearGradient>
    </View>
  );
}
