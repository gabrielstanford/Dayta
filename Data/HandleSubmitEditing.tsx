import {DateTime} from 'luxon'
import Activity from '@/Types/ActivityTypes';

export default function HandleSubmitEditing(inputValue: string, input2Value: string, maxLength: number, activity: Activity, dateIncrement: number, updateActivity: any) {

    const validTimeNumsSec = ['0', '1', '2']
    const validTimeNumsOthers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    if (inputValue.length === maxLength) {
       if((inputValue[0]=='0' && validTimeNumsOthers.includes(inputValue[1]) && inputValue[1]!=='0') || (inputValue[0]=='1' && validTimeNumsSec.includes(inputValue[1]))) {
          if(inputValue[2]==':' && validTimeNumsOthers.includes(inputValue[3]) && validTimeNumsOthers.includes(inputValue[4]) && (inputValue[5]=='A' || inputValue[5]=='P') && inputValue[6]=='M') {
            //valid start time
            if (input2Value.length === maxLength) {
              if((input2Value[0]=='0' && validTimeNumsOthers.includes(input2Value[1]) && input2Value[1]!=='0') || (input2Value[0]=='1' && validTimeNumsSec.includes(input2Value[1]))) {
                 if(input2Value[2]==':' && validTimeNumsOthers.includes(input2Value[3]) && validTimeNumsOthers.includes(input2Value[4]) && (input2Value[5]=='A' || input2Value[5]=='P') && input2Value[6]=='M') {
                   //valid full time
                   function getUserTimeZone(): string {

                    return Intl.DateTimeFormat().resolvedOptions().timeZone;
                  }
                  
                  const userTimeZone = getUserTimeZone();
                  console.log('applied date increment: ', dateIncrement)
                  const nowInUserTimezone = DateTime.now().setZone(userTimeZone).plus({days: dateIncrement})
                  const startUnixTimestamp = convertLocalDateTimeToUnix(nowInUserTimezone, inputValue);
                  const endUnixTimestamp = convertLocalDateTimeToUnix(nowInUserTimezone, input2Value);
                  console.log(endUnixTimestamp)
                  if(endUnixTimestamp-startUnixTimestamp<0) {
                    alert('Make sure your end time is after your start time')
                  }
                  else { 
                    
                    const updates: Partial<Activity> = {
                      //first turn input value into unix. Create function for this. 
                      timeBlock: {
                        startTime: startUnixTimestamp, // New start time in Unix timestamp
                        duration: endUnixTimestamp-startUnixTimestamp,
                        endTime: endUnixTimestamp,   // New end time in Unix timestamp
                      },
                    };
                    console.log(nowInUserTimezone)
                    updateActivity(activity, updates)
                    alert('Activity Updated');
                  }
                 }
                 else {
                   alert("Invalid End Time")
                 }
               }
               else {
                 alert('Invalid First/Second Digit In End Time')
               }
              }
              else {
                alert("End Time Length Incorrect")
              }
            } 
            else {
              alert('Invalid Start Time. Check Format (11:00AM)')
            }
       }
       else {
        alert('Invalid First Two Digits In Start Time')
       }
    }
  else {
    alert('Start Time Length Incorrect; be sure format is 12:30PM')
  }
  };

  // Function to convert local date and time to Unix timestamp in UTC
const convertLocalDateTimeToUnix = (date: DateTime, time: string): number => {
    try {
      // Parse the time string into hours and minutes
      const [timePart, period] = time.split(/([APM]{2})/).filter(Boolean);
      const [hours, minutes] = timePart.split(':').map(Number);
      
      // Convert hours to 24-hour format
      let adjustedHours = hours;
      if (period === 'PM' && hours < 12) {
        adjustedHours += 12;
      } else if (period === 'AM' && hours === 12) {
        adjustedHours = 0;
      }
  
      // Combine date and time into a DateTime object
      const localDateTime = date.set({
        hour: adjustedHours,
        minute: minutes,
        second: 0,
        millisecond: 0
      });
  
      // Convert local DateTime to UTC and get Unix timestamp
      const utcDateTime = localDateTime.toUTC();
      return utcDateTime.toSeconds(); // Return Unix timestamp in seconds
    } catch (error) {
      console.error('Error converting local date and time to Unix timestamp:', error);
      return 0; // Return 0 or handle error as needed
    }
  };