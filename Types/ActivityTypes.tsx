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
    startTime: number,   // Unix timestamp for the start time
    duration: number,    // Duration in seconds
    endTime: number      // Unix timestamp for the end time (startTime + duration)
  }
  export interface Activity {
    id: string;
    button: ButtonState;
    timeBlock: TimeBlock;
    Multi?: Activity[]
  }