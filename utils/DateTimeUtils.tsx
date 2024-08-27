import SunCalc from 'suncalc';
import { DateTime } from 'luxon';

export const convertTimeToUnix = (timeString: string, date: Date = new Date()): number => {
    // Parse the time string
    if(timeString!=="888") {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
  
    // Convert 12-hour format to 24-hour format
    let hours24 = hours;
    if (period === 'PM' && hours !== 12) {
      hours24 += 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
  
    // Set the UTC time based on the input
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours24, minutes));
  
    // Convert to Unix timestamp and return
    return Math.floor(utcDate.getTime() / 1000);
  }
  else {
    // Convert the local Date object to UTC time
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,  // Hours
      10, // Minutes
      31  // Seconds
    );
    return localDate.getTime() / 1000;
  }
  };

  export const timeStringToSeconds = (timeString: string): number => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);
  
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
      return 0; // Default value for invalid time input
    }
  
    // Convert hours and minutes to seconds
    return (hours * 3600) + (minutes * 60);
  };
  

  export function adjustDateByDays(date: Date, days: number): Date {
    // Create a copy of the original date to avoid mutating it
    const adjustedDate = new Date(date);
  
    // Get the current date components
    const currentDate = adjustedDate.getDate();
  
    // Set the new date
    adjustedDate.setDate(currentDate + days);
  
    // Preserve time components (hours, minutes, seconds, milliseconds)
    adjustedDate.setHours(date.getHours());
    adjustedDate.setMinutes(date.getMinutes());
    adjustedDate.setSeconds(date.getSeconds());
    adjustedDate.setMilliseconds(date.getMilliseconds());
  
    return adjustedDate;
  }

  export const decimalToTime = (decimal: number): string => {
    // Normalize the decimal by handling values above 24 (i.e., past midnight)
    if (decimal >= 24) {
      decimal -= 24;
    }
  
    // Extract hours and minutes from the decimal number
    const hours24 = Math.floor(decimal);
    const minutes = Math.round((decimal - hours24) * 60);
  
    // Convert 24-hour time to 12-hour format
    const period = hours24 >= 12 ? 'PM' : 'AM';
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12; // Handle midnight and noon cases
  
    // Format minutes to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
  
    // Return time in 'HH:MM AM/PM' format
    return `${hours12}:${formattedMinutes} ${period}`;
  };
  
  export const decimalToDurationTime = (decimal: number): string => {
    // Extract hours and minutes from the decimal number
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
  
    // Format hours and minutes to always be two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
  
    // Return time in 'HH:MM' format
    return `${formattedHours}:${formattedMinutes}`;
  };
  
export function getSunriseSunset(date: Date, timeZone: string): { sunrise: string; sunset: string } {
  // Create a DateTime object in the given time zone
  
  // Calculate sunrise and sunset times using SunCalc
  const coords = getCoordinatesFromTimeZone(timeZone)
  if(coords) {
    const sunTimes = SunCalc.getTimes(date, coords.latitude, coords.longitude);
    // Convert sunrise and sunset times to the local time zone
    const sunrise = DateTime.fromJSDate(sunTimes.sunrise).setZone(timeZone).toFormat('yyyy-MM-dd HH:mm:ss');
    const sunset = DateTime.fromJSDate(sunTimes.sunset).setZone(timeZone).toFormat('yyyy-MM-dd HH:mm:ss');
    console.log(sunrise, sunset)
    return { sunrise, sunset };
  }
  else {
    console.log('no coords');
    return {sunrise: "oui", sunset: "non"}
  }
}
interface TimeZoneCoordinates {
  latitude: number;
  longitude: number;
}
function getCoordinatesFromTimeZone(timeZone: string): TimeZoneCoordinates | null {
  const timeZoneMap: { [key: string]: TimeZoneCoordinates } = {
    'America/New_York': { latitude: 40.7128, longitude: -74.0060 }, // New York City, USA
    'America/Los_Angeles': { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles, USA
    'America/Chicago': { latitude: 41.8781, longitude: -87.6298 }, // Chicago, USA
    'America/Denver': { latitude: 39.7392, longitude: -104.9903 }, // Denver, USA
    'Europe/London': { latitude: 51.5074, longitude: -0.1278 }, // London, UK
    'Europe/Paris': { latitude: 48.8566, longitude: 2.3522 }, // Paris, France
    'Europe/Berlin': { latitude: 52.5200, longitude: 13.4050 }, // Berlin, Germany
    'Asia/Tokyo': { latitude: 35.6895, longitude: 139.6917 }, // Tokyo, Japan
    'Asia/Shanghai': { latitude: 31.2304, longitude: 121.4737 }, // Shanghai, China
    'Asia/Kolkata': { latitude: 22.5726, longitude: 88.3639 }, // Kolkata, India
    'Australia/Sydney': { latitude: -33.8688, longitude: 151.2093 }, // Sydney, Australia
    'Africa/Johannesburg': { latitude: -26.2041, longitude: 28.0473 }, // Johannesburg, South Africa
    // Add more time zones as needed
  };

  return timeZoneMap[timeZone] || null;
}

export const generateISODate = (adjustment: number, userTimeZone: string) => {
  const nowInUserTimezone = DateTime.now().setZone(userTimeZone).plus({ days: adjustment })
  const dateIso = nowInUserTimezone.toISO()
  let finalIso = ""
  if(dateIso) {
    finalIso = dateIso
  }
  
  return finalIso
  
}