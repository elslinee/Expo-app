import { aladhanClient } from "./axiosClient";

interface PrayerTimesParams {
  latitude: number;
  longitude: number;
  method?: number;
  school?: number;
  timezonestring?: string;
  calendarMethod?: string;
  iso8601?: boolean;
}

const getAladhanTime = async (params: PrayerTimesParams) => {
  // Format date as DD-MM-YYYY
  const today = new Date();
  const dateString = today
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const response = await aladhanClient.get(`/timings/${dateString}`, {
    params: {
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      method: params.method || 3, // Default to Muslim World League
      school: params.school || 0, // Default to Shafi
      timezonestring: params.timezonestring,
      calendarMethod: params.calendarMethod || "HJCoSA",
      iso8601: params.iso8601 || false,
    },
  });
  return response.data;
};

export default getAladhanTime;
