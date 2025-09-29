export const isCurrentPrayerTime = (
  prayerTime24: string,
  prayerIndex: number,
  prayers: any
) => {
  if (!prayerTime24 || !prayers) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [hours, minutes] = prayerTime24.split(":");
  const prayerTime = parseInt(hours) * 60 + parseInt(minutes);

  // Define prayer order
  const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  // Get next prayer time
  const nextPrayerIndex = (prayerIndex + 1) % prayerOrder.length;
  const nextPrayerKey = prayerOrder[nextPrayerIndex];
  const nextPrayerTime24 = prayers[nextPrayerKey];

  if (!nextPrayerTime24) return false;

  const [nextHours, nextMinutes] = nextPrayerTime24.split(":");
  const nextPrayerTime = parseInt(nextHours) * 60 + parseInt(nextMinutes);

  let adjustedNextPrayerTime = nextPrayerTime;
  if (nextPrayerTime < prayerTime) {
    adjustedNextPrayerTime = nextPrayerTime + 24 * 60; // Add 24 hours in minutes
  }

  return currentTime >= prayerTime && currentTime < adjustedNextPrayerTime;
};
