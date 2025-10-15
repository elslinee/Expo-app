// hooks/usePushNotifications.ts
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Audio } from "expo-av";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Check if this is a prayer notification
    const isPrayerNotification =
      notification.request.content.data?.type === "prayer";

    // Play adhan sound if it's a prayer notification
    if (isPrayerNotification) {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/audios/adhanVoice.mp3"),
          { shouldPlay: true }
        );

        // Cleanup after playing
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (error) {
        console.error("خطأ في تشغيل صوت الأذان:", error);
      }
    }

    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

interface UsePushNotificationsOptions {
  onNotificationResponse?: (
    response: Notifications.NotificationResponse
  ) => void;
}

export default function usePushNotifications(
  options?: UsePushNotificationsOptions
) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "adhanvoice",
      });
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {});

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (options?.onNotificationResponse) {
          options.onNotificationResponse(response);
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [options]);

  return expoPushToken;
}
