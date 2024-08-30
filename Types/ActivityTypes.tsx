    export interface ButtonState {
      text: string;
      iconLibrary: string;
      icon: string;
      keywords: string[];
      tags: string[];
      movementIntensity?: number;
      category?: string[]
      pressed: boolean;
      id?: string;
    };

    export interface Card {
      title: string,
      recCategory: string,
      impactScore: number,
      recDetails: string
    }

  export interface TimeBlock {
    startTime: number,   // Unix timestamp for the start time (or the date of the activity)
    duration: number,    // Duration in seconds
    endTime: number | null      // Unix timestamp for the end time (startTime + duration)
  }
  export interface Activity {
    id: string;
    parentRoutName?: string;
    button: ButtonState;
    timeBlock: TimeBlock;
    Multi?: Activity[]
  }

  export interface DatedActivities {
    date: string;
    activities: Activity[];
  }

  export interface WithEndTime {
    startTime: number,   // Unix timestamp for the start time (or the date of the activity)
    duration: number,    // Duration in seconds
    endTime: number   
  }

  export interface ActivityWithEnd {
    id: string;
    parentRoutName?: string;
    button: ButtonState;
    timeBlock: WithEndTime;
    Multi?: Activity[]
  }

  export interface ActivitySummary {
    text: string;
    totalDuration: number;
  }
  export interface RoutineActivity {
  name: string;
  duration: string;
  tag: string;
  gapBetween: string;
}
  export interface Routine {
    name: string;
    durationBetween?: number[]
    activities: Activity[];
  }

  export interface StatisticsState {
    durationSummary: ActivitySummary[];
    avgSleepTime: number;
    avgWakeTime: number;
    weekDurationSummary: ActivitySummary[];
    sleepSum: any[];
    tagDurationSum: ActivitySummary[];
    avgTimeByTag: ActivitySummary[];
    todayTagDurationSum: ActivitySummary[];
    summaryDurs: [string, number][];
  }