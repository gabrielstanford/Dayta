import {DateTime} from 'luxon';

function getUserTimeZone(): string {

    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  // Function to get the current date range in UTC
  function getCurrentDateRangeInUtc(adjustment: number): {startUtc: DateTime; endUtc: DateTime}  {
    try {
      const userTimeZone = getUserTimeZone();
    
      const nowInUserTimezone = DateTime.now().setZone(userTimeZone).plus({ days: adjustment })
      // Get the start and end of the day in user's time zone
    // Get the start and end of the day in user's time zone
      const startOfDayInUserTimezone = nowInUserTimezone.startOf('day');
      const endOfDayInUserTimezone = nowInUserTimezone.endOf('day');
      
      // Convert start and end of day to UTC
    const startUtc: DateTime = startOfDayInUserTimezone.toUTC();
    const endUtc: DateTime = endOfDayInUserTimezone.toUTC();

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
      
    // Safely handle possible null values from toISO
      const startUtcISO: string = startUtc.toISO() || '';
      const endUtcISO: string = endUtc.toISO() || '';
      const startUtcTimestamp: number = startUtc ? (Math.floor(startUtc.toMillis() / 1000) + 14400) : 0;
      const endUtcTimestamp: number = endUtc ? (Math.floor(endUtc.toMillis() / 1000) + 14400) : 0;

      // Create array of date references
      const dateRefs = [
        startUtcISO.split('T')[0],
        endUtcISO.split('T')[0],
        startUtcTimestamp,
        endUtcTimestamp
      ];
      return dateRefs;
  }

  export default getFilteredActivityRefs