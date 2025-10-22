import { useState, useEffect } from "react";
import PrayerTimesService, { PrayerTimesData } from "./prayerTimesService";
import { useLocation } from "@/context/LocationContext";
import * as Location from "expo-location";

// Helper function to check if location permission is granted
const hasLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.warn("Error checking location permission:", error);
    return false;
  }
};

// Helper function to safely start location monitoring
const safeStartLocationMonitoring = async (
  service: PrayerTimesService
): Promise<void> => {
  try {
    if (await hasLocationPermission()) {
      await service.startLocationMonitoring();
    }
  } catch (error) {
    console.warn("Could not start location monitoring:", error);
  }
};

export const usePrayerTimesService = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useLocation();

  useEffect(() => {
    const service = PrayerTimesService.getInstance();

    // Subscribe to updates
    const unsubscribe = service.subscribe((data, isLoading, errorMessage) => {
      setPrayerTimes(data);
      setLoading(isLoading);
      setError(errorMessage);
    });

    // Check if we have cached data first
    const initializeService = async () => {
      const hasCachedData = await service.hasValidCachedData();

      if (hasCachedData) {
        // We have cached data, load it without requesting location
        await service.getPrayerTimes();
        // Only start location monitoring if we already have location permission
        await safeStartLocationMonitoring(service);
      } else if (location) {
        // Use shared location data
        const data = await service.getPrayerTimesWithLocation(
          location.coords.latitude,
          location.coords.longitude
        );
        if (data) {
          try {
            await service.startLocationMonitoring();
          } catch (error) {
            console.warn(
              "Could not start location monitoring, continuing without it:",
              error
            );
          }
        }
      } else {
        // Fallback to service's own location fetching
        const data = await service.getPrayerTimes();
        if (data) {
          try {
            await service.startLocationMonitoring();
          } catch (error) {
            console.warn(
              "Could not start location monitoring, continuing without it:",
              error
            );
          }
        }
      }
    };

    initializeService();

    return () => {
      unsubscribe();
      // Note: We don't stop location monitoring here as it should continue
      // even when components unmount, since other components might still need it
    };
  }, [location]);

  const refreshPrayerTimes = async () => {
    const service = PrayerTimesService.getInstance();
    const result = await service.refreshPrayerTimes();

    // Start location monitoring after manual refresh only if we have permission
    if (result) {
      await safeStartLocationMonitoring(service);
    }

    return result;
  };

  const clearCache = async () => {
    const service = PrayerTimesService.getInstance();
    await service.clearCache();
  };

  const stopLocationMonitoring = () => {
    const service = PrayerTimesService.getInstance();
    service.stopLocationMonitoring();
  };

  const startLocationMonitoring = async () => {
    const service = PrayerTimesService.getInstance();
    try {
      await service.startLocationMonitoring();
    } catch (error) {
      console.warn("Could not start location monitoring:", error);
    }
  };

  const isLocationMonitoringActive = () => {
    const service = PrayerTimesService.getInstance();
    return service.isLocationMonitoringActive();
  };

  const hasValidCachedData = async () => {
    const service = PrayerTimesService.getInstance();
    return service.hasValidCachedData();
  };

  return {
    prayerTimes,
    loading,
    error,
    refreshPrayerTimes,
    clearCache,
    stopLocationMonitoring,
    startLocationMonitoring,
    isLocationMonitoringActive,
    hasValidCachedData,
  };
};
