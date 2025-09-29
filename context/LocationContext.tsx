import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import * as Location from "expo-location";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TranslationService } from "@/utils/translationService";

interface LocationContextType {
  location: Location.LocationObject | null;
  address: string;
  errorMsg: string | null;
  isLoading: boolean;
  refreshLocation: () => Promise<void>;
  openLocationSettingsAndRefresh: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] = useState<string>("جاري التحميل...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Ensure device location services are enabled (separate from permission)
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setErrorMsg("خدمات الموقع معطّلة");
        setAddress("الرجاء تفعيل خدمات الموقع");
        setIsLoading(false);
        return;
      }

      const PERMISSION_ASKED_KEY = "locationPermissionAsked";

      // Check existing permission without prompting first
      let { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      // If not granted, only request once (persist flag)
      if (existingStatus !== "granted") {
        const askedBefore = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);
        if (!askedBefore) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
          existingStatus = status;
        }
      }

      if (existingStatus !== "granted") {
        setErrorMsg("تم رفض صلاحية الوصول إلى الموقع");
        setAddress("الموقع غير متاح");
        setIsLoading(false);
        return;
      }

      // Try to get current position with a reasonable configuration
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(location);

      let reverseGeocode: Location.LocationGeocodedAddress[] = [];
      try {
        reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (e) {
        // Non-fatal: continue with generic address
      }

      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];

        const translatedAddress = TranslationService.translateAddressComponents(
          {
            region: addr.region || undefined,
            country: addr.country || undefined,
          }
        );

        setAddress(translatedAddress || "الموقع غير محدد");
      } else {
        setAddress("الموقع غير محدد");
      }
    } catch (error) {
      console.error("خطأ في تحديد الموقع:", error);
      setErrorMsg("خطأ في تحديد الموقع");
      setAddress("خطأ في تحديد الموقع");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLocation = async () => {
    await getCurrentLocation();
  };

  const openLocationSettingsAndRefresh = async () => {
    try {
      // Open platform location settings (Android). On iOS, this opens app settings.
      await Location.enableNetworkProviderAsync().catch(() => {});
    } catch {}
    try {
      // Open app settings page as a fallback (works on iOS and Android)
      await Linking.openSettings();
    } catch {}
    // Small delay to allow user to toggle then return
    setTimeout(() => {
      refreshLocation();
    }, 1000);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        address,
        errorMsg,
        isLoading,
        refreshLocation,
        openLocationSettingsAndRefresh,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
