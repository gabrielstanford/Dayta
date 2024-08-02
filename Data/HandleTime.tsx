import {toZonedTime, fromZonedTime} from 'date-fns-tz'

function getUserTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  // Function to get the current date range in UTC
  function getCurrentDateRangeInUtc(adjustment: number): {startUtc: Date; endUtc: Date}  {
    try {
      const userTimeZone = getUserTimeZone();
      const currentDate = new Date()
      console.log(adjustment)
      const preferredDate = currentDate.setDate(currentDate.getUTCDate()+adjustment)
      // Get the current date in user's time zone
      const nowInUserTimezone = toZonedTime(preferredDate, userTimeZone);
      // Get the start and end of the day in user's time zone
      const startOfDayInUserTimezone = new Date(nowInUserTimezone.setHours(0, 0, 0, 0));
      const endOfDayInUserTimezone = new Date(nowInUserTimezone.setHours(23, 59, 59, 999));
      
      // Convert to UTC
      const startUtc = fromZonedTime(startOfDayInUserTimezone, userTimeZone);
      const endUtc = fromZonedTime(endOfDayInUserTimezone, userTimeZone);

      return {
        startUtc,
        endUtc
      };
    } catch (error) {
      console.error('Error getting date range in UTC:', error);
      throw error;
    }
  }

function getFilteredActivityRefs(adjustment: number): any[] {
      const { startUtc, endUtc } = getCurrentDateRangeInUtc(adjustment);
      const dateRefs = [startUtc.toISOString().split('T')[0], endUtc.toISOString().split('T')[0], Math.floor(startUtc.getTime() / 1000), Math.floor(endUtc.getTime() / 1000)]
      return dateRefs;
  }

  export default getFilteredActivityRefs