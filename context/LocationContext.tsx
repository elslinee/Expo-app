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

  const SAVED_LOCATION_KEY = "savedLocation";
  const SAVED_ADDRESS_KEY = "savedAddress";

  // Load saved location data from AsyncStorage
  const loadSavedLocationData = async () => {
    try {
      const savedLocationStr = await AsyncStorage.getItem(SAVED_LOCATION_KEY);
      const savedAddress = await AsyncStorage.getItem(SAVED_ADDRESS_KEY);

      if (savedLocationStr && savedAddress) {
        const savedLocation = JSON.parse(savedLocationStr);
        setLocation(savedLocation);
        setAddress(savedAddress);
        return true; // Data was loaded
      }
      return false; // No saved data
    } catch (error) {
      console.error("خطأ في تحميل البيانات المحفوظة:", error);
      return false;
    }
  };

  // Save location data to AsyncStorage
  const saveLocationData = async (
    locationData: Location.LocationObject,
    addressData: string
  ) => {
    try {
      await AsyncStorage.setItem(
        SAVED_LOCATION_KEY,
        JSON.stringify(locationData)
      );
      await AsyncStorage.setItem(SAVED_ADDRESS_KEY, addressData);
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
    }
  };

  const getCurrentLocation = async (forceRequest: boolean = false) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // إذا لم يكن forceRequest، تحقق من وجود بيانات محفوظة أولاً
      if (!forceRequest) {
        const savedLocationStr = await AsyncStorage.getItem(SAVED_LOCATION_KEY);
        const savedAddress = await AsyncStorage.getItem(SAVED_ADDRESS_KEY);

        if (savedLocationStr && savedAddress) {
          // البيانات محفوظة، لا نحتاج لفحص خدمات الموقع أو طلب الصلاحية
          setIsLoading(false);
          return;
        }
      }

      // Ensure device location services are enabled (separate from permission)
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        // التحقق من وجود بيانات محفوظة أولاً
        const savedLocationStr = await AsyncStorage.getItem(SAVED_LOCATION_KEY);
        const savedAddress = await AsyncStorage.getItem(SAVED_ADDRESS_KEY);

        if (savedLocationStr && savedAddress) {
          // البيانات المحفوظة موجودة، استخدمها ولا تظهر رسالة الخطأ
          setIsLoading(false);
          return;
        }

        // فقط إذا لم تكن هناك بيانات محفوظة، اعرض رسالة الخطأ
        // ولكن فقط إذا لم يتم السؤال من قبل أو كان forceRequest
        if (forceRequest) {
          setErrorMsg("الرجاء تفعيل خدمات الموقع في إعدادات الهاتف");
          setAddress("خدمات الموقع معطلة");
          setIsLoading(false);
          return;
        } else {
          // إذا لم يكن forceRequest، لا تعرض رسالة خطأ مزعجة
          // فقط اعرض عنوان افتراضي
          setAddress("الموقع غير متاح");
          setIsLoading(false);
          return;
        }
      }

      const PERMISSION_ASKED_KEY = "locationPermissionAsked";

      // Check existing permission without prompting first
      let { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      // If not granted, only request if forced or never asked before
      if (existingStatus !== "granted") {
        const askedBefore = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);

        // Only ask for permission if:
        // 1. Force request is true (user manually requested from settings)
        if (forceRequest) {
          const { status } = await Location.requestForegroundPermissionsAsync();
          await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
          existingStatus = status;
        } else {
          // لا نطلب الصلاحية تلقائياً، فقط نعرض عنوان افتراضي
          setAddress("الموقع غير متاح");
          setIsLoading(false);
          return;
        }
      }

      if (existingStatus !== "granted") {
        // لا نطلب الصلاحية تلقائياً، فقط نعرض عنوان افتراضي
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

      let finalAddress = "الموقع غير محدد";
      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];

        const translatedAddress = TranslationService.translateAddressComponents(
          {
            region: addr.region || undefined,
            country: addr.country || undefined,
          }
        );

        finalAddress = translatedAddress || "الموقع غير محدد";
      }

      setAddress(finalAddress);

      // حفظ البيانات للاستخدام دون إنترنت
      await saveLocationData(location, finalAddress);
    } catch (error) {
      console.error("خطأ في تحديد الموقع:", error);

      // التحقق من وجود بيانات محفوظة قبل إظهار الخطأ
      const savedLocationStr = await AsyncStorage.getItem(SAVED_LOCATION_KEY);
      const savedAddress = await AsyncStorage.getItem(SAVED_ADDRESS_KEY);

      if (!savedLocationStr || !savedAddress) {
        // فقط إذا لم تكن هناك بيانات محفوظة، اعرض رسالة الخطأ
        setErrorMsg("خطأ في تحديد الموقع");
        setAddress("خطأ في تحديد الموقع");
      }
      // إذا كانت هناك بيانات محفوظة، لا تعرض رسالة الخطأ
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
    // Force request permission when user comes back from settings
    setTimeout(() => {
      getCurrentLocation(true);
    }, 1000);
  };

  useEffect(() => {
    const initLocation = async () => {
      // محاولة تحميل البيانات المحفوظة أولاً
      const hasData = await loadSavedLocationData();

      if (hasData) {
        // إذا كانت هناك بيانات محفوظة، عرضها مباشرة
        setIsLoading(false);
        // لا نحاول تحديث البيانات في الخلفية إذا كانت البيانات محفوظة
        // لتجنب طلب الصلاحية مرة أخرى
        return;
      } else {
        // إذا لم تكن هناك بيانات محفوظة، لا تطلب الموقع تلقائياً
        // فقط اعرض عنوان افتراضي
        setAddress("الموقع غير متاح");
        setIsLoading(false);
      }
    };

    initLocation();
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
