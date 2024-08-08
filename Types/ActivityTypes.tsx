type ButtonState = {
    text: string;
    iconLibrary: string;
    icon: string;
    pressed: boolean;
    id?: string;
  };
  interface TimeBlock {
    startTime: number,   // Unix timestamp for the start time
    duration: number,    // Duration in seconds
    endTime: number      // Unix timestamp for the end time (startTime + duration)
  }
  export default interface Activity {
    id: string;
    button: ButtonState;
    timeBlock: TimeBlock;
    Multi?: Activity[]
  }