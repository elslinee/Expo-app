/**
 * Formats time remaining in a more readable Arabic format
 * @param hours - Number of hours remaining
 * @param minutes - Number of minutes remaining
 * @returns Formatted string in Arabic
 */
export const formatTimeRemaining = (hours: number, minutes: number): string => {
  if (hours === 0 && minutes === 0) {
    return "حان وقت الصلاة";
  }

  let result = "";

  if (hours > 0) {
    if (hours === 1) {
      result += "ساعة واحدة";
    } else if (hours === 2) {
      result += "ساعتان";
    } else if (hours <= 10) {
      result += `${hours} ساعات`;
    } else {
      result += `${hours} ساعة`;
    }
  }

  if (minutes > 0) {
    if (hours > 0) {
      result += " و ";
    }

    if (minutes === 1) {
      result += "دقيقة واحدة";
    } else if (minutes === 2) {
      result += "دقيقتان";
    } else if (minutes <= 10) {
      result += `${minutes} دقائق`;
    } else {
      result += `${minutes} دقيقة`;
    }
  }

  return result;
};

/**
 * Formats time remaining in HH:MM format
 * @param hours - Number of hours remaining
 * @param minutes - Number of minutes remaining
 * @returns Formatted string in HH:MM format
 */
export const formatTimeRemainingHHMM = (
  hours: number,
  minutes: number
): string => {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
