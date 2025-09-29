import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import * as Location from "expo-location";
import { TranslationService } from "@/utils/translationService";

interface LocationContextType {
  location: Location.LocationObject | null;
  address: string;
  errorMsg: string | null;
  isLoading: boolean;
  refreshLocation: () => Promise<void>;
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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("تم رفض صلاحية الوصول إلى الموقع");
        setAddress("الموقع غير متاح");
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

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

