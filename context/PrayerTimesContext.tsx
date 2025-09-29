import React, { createContext, useContext, ReactNode } from "react";
import { usePrayerTimesService } from "@/utils/usePrayerTimesService";
import { PrayerTimesData } from "@/utils/prayerTimesService";

interface PrayerTimesContextType {
  prayerTimes: PrayerTimesData | null;
  loading: boolean;
  error: string | null;
  refreshPrayerTimes: () => Promise<PrayerTimesData | null>;
  clearCache: () => Promise<void>;
  stopLocationMonitoring: () => void;
  startLocationMonitoring: () => Promise<void>;
  isLocationMonitoringActive: () => boolean;
  hasValidCachedData: () => Promise<boolean>;
}

const PrayerTimesContext = createContext<PrayerTimesContextType | undefined>(
  undefined
);

interface PrayerTimesProviderProps {
  children: ReactNode;
}

export const PrayerTimesProvider: React.FC<PrayerTimesProviderProps> = ({
  children,
}) => {
  const prayerTimesData = usePrayerTimesService();

  return (
    <PrayerTimesContext.Provider value={prayerTimesData}>
      {children}
    </PrayerTimesContext.Provider>
  );
};

export const usePrayerTimes = (): PrayerTimesContextType => {
  const context = useContext(PrayerTimesContext);
  if (context === undefined) {
    throw new Error("usePrayerTimes must be used within a PrayerTimesProvider");
  }
  return context;
};
