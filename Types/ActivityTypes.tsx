export type ButtonState = {
  text: string;
  iconLibrary: string;
  icon: string;
  keywords: string[];
  tags?: string[];
  pressed: boolean;
  id?: string;
};

  export interface TimeBlock {
    startTime: number,   // Unix timestamp for the start time (or the date of the activity)
    duration: number,    // Duration in seconds
    endTime: number | null      // Unix timestamp for the end time (startTime + duration)
  }
  export interface Activity {
    id: string;
    button: ButtonState;
    timeBlock: TimeBlock;
    Multi?: Activity[]
  }

  export interface WithEndTime {
    startTime: number,   // Unix timestamp for the start time (or the date of the activity)
    duration: number,    // Duration in seconds
    endTime: number   
  }

  export interface ActivityWithEnd {
    id: string;
    button: ButtonState;
    timeBlock: WithEndTime;
    Multi?: Activity[]
  }