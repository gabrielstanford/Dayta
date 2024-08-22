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

  