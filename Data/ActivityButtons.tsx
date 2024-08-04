import getAllActivitiesForUser from '@/Data/GetAllActivities'
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'


type ButtonState = {
    text: string;
    iconLibrary: string;
    icon: string;
    keywords: string[];
    pressed: boolean;
    id?: string;
  };

const ActivityButtons: ButtonState[] = [
    //this is where you add buttons. it's all configured so you just need to add it here and all will work
    //this base of work will make it very easy in the future to add a search component.
    //food/drink related
    { text: 'Breakfast', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Meal'], pressed: false },
    { text: 'Snacking', iconLibrary: "fontAwesome5", icon: "apple-alt", keywords: ['Eating', 'Meal', 'Snack', 'Quick Snack'], pressed: false },
    { text: 'Coffee', iconLibrary: "materialCommunityIcons", icon: "coffee", keywords: ['Cafe', 'Espresso', 'Black Coffee'], pressed: false },
    { text: 'Preparing My Coffee', iconLibrary: "materialIcons", icon: "coffee-maker", keywords: ['Cafe', 'Espresso', 'Espresso Machine', 'Coffee Machine'], pressed: false },
    { text: 'Lunch', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Meal'], pressed: false },
    { text: 'Dinner', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Meal'], pressed: false },
    { text: 'Meal', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Breakfast', 'Lunch', 'Dinner', 'Snack'], pressed: false },
    { text: 'Watching Educational Video', iconLibrary: "fontAwesome5", icon: "video", keywords: ['Educational Video', 'Video', 'Watching Video'] , pressed: false },
    //physical
    { text: 'Walking', iconLibrary: "fontAwesome5", icon: "walking", keywords: ['Stroll'], pressed: false },
    { text: 'Gym', iconLibrary: "materialCommunityIcons", icon: "weight-lifter", keywords: ['Exercise', 'Workout'], pressed: false },
    { text: 'Home Workout', iconLibrary: "materialCommunityIcons", icon: "jump-rope", keywords: ['Working Out', 'Exercise', 'Gym'], pressed: false },
    { text: 'Home Physical Therapy', iconLibrary: "ionicons", icon: "medkit", keywords: ['Working Out', 'Exercise', 'Gym', 'Physical Therapy', 'PT', 'Rehab'], pressed: false },
    { text: 'Playing a Sport', iconLibrary: "materialIcons", icon: "sports-football", keywords: ['Sport', 'Football', 'Soccer', 'Baseball'], pressed: false }, 
    //relax
    { text: 'Hot Tub', iconLibrary: "fontAwesome5", icon: "hot-tub", keywords: ['Relaxing', 'Jacuzzi', 'Bath', 'Hot Bath'], pressed: false }, 
    { text: 'Showering', iconLibrary: "fontAwesome5", icon: "shower", keywords: ['Shower', 'Water', 'Cleaning'], pressed: false }, 
    { text: 'Taking a Break', iconLibrary: "fontAwesome5", icon: "pause", keywords: ['Break', 'Quick Break', 'Rest', 'Resting', 'Pause', 'Pausing'], pressed: false }, 
    { text: 'Wound Care', iconLibrary: "ionicons", icon: "bandage", keywords: ['Bandade', 'Injury'], pressed: false }, 
    { text: 'Hygiene/Skin Care', iconLibrary: "fontAwesome5", icon: "smile-beam", keywords: ['Brushing Teeth', 'Tooth Brush', 'Brush', 'Washing Face', 'Face Mask'], pressed: false }, 
    { text: 'Briefly Woke Up', iconLibrary: "ionicons", icon: "moon", keywords: ['Awoke', 'Woke Up', 'Fell Back Asleep'], pressed: false }, 
    { text: 'Woke Up', iconLibrary: "materialIcons", icon: "sunny", keywords: ['Awoke', 'Woke Up', 'Fell Back Asleep'], pressed: false }, 
    { text: 'Fell Asleep', iconLibrary: "materialCommunityIcons", icon: "sleep", keywords: ['Sleep', 'Asleep', 'Went To Bed', 'Night'], pressed: false }, 

    //Music
    { text: 'Composing', iconLibrary: "ionicons", icon: "musical-note-sharp", keywords: ['Music'], pressed: false }, 
    { text: 'Listening To Music', iconLibrary: "fontAwesome5", icon: "music", keywords: ['Stroll'], pressed: false }, 
    { text: 'Playing an Instrument', iconLibrary: "materialCommunityIcons", icon: "piano", keywords: ['Piano', 'Playing Piano', 'Guitar', 'Plaing Guitar', 'Violin', 'Playing Violin'], pressed: false }, 
    { text: 'Playing Piano', iconLibrary: "materialCommunityIcons", icon: "piano", keywords: ['Piano'], pressed: false }, 
    { text: 'Playing Guitar', iconLibrary: "fontAwesome5", icon: "guitar", keywords: ['Guitar'], pressed: false }, 

    //
    { text: 'Scrolling', iconLibrary: "fontAwesome5", icon: "tiktok", keywords: ['Stroll'], pressed: false }, 
    { text: 'Driving', iconLibrary: "antDesign", icon: "car", keywords: ['Stroll'], pressed: false }, 
    { text: 'School', iconLibrary: "ionicons", icon: "school", keywords: ['Stroll'], pressed: false }, 
    { text: 'Relaxing', iconLibrary: "fontAwesome5", icon: "umbrella-beach", keywords: ['Relaxation'], pressed: false},
    { text: 'Working', iconLibrary: "materialIcons", icon: "work", keywords: ['Concentrating', 'Concentration'], pressed: false },
    { text: 'Concentrating', iconLibrary: "materialIcons", icon: "center-focus-strong", keywords: ['Concentration', 'Focus', 'Focusing'], pressed: false },
    { text: 'Reading', iconLibrary: "fontAwesome5", icon: "book", keywords: ['Stroll'], pressed: false }, 
    { text: 'Errands', iconLibrary: "ionicons", icon: "cart", keywords: ['Stroll'], pressed: false }, 
    { text: 'Shopping', iconLibrary: "materialCommunityIcons", icon: "purse", keywords: ['Stroll'], pressed: false }, 
    { text: 'Watching Show', iconLibrary: "materialCommunityIcons", icon: "netflix", keywords: ['Stroll'], pressed: false }, 
    { text: 'Watching Movie', iconLibrary: "materialIcons", icon: "theaters", keywords: ['Stroll'], pressed: false }, 
    { text: 'Entering Activities', iconLibrary: "materialCommunityIcons", icon: "clock-digital", keywords: ['Journaling', 'Digital Journaling', 'App'], pressed: false }, 

    //social
    { text: 'Socializing', iconLibrary: "fontAwesome5", icon: "user-friends", keywords: ['Stroll'], pressed: false }, 
    { text: 'Partying', iconLibrary: "materialCommunityIcons", icon: "party-popper", keywords: ['Stroll'], pressed: false },
    { text: 'Snapchatting', iconLibrary: "fontAwesome5", icon: "snapchat", keywords: ['Responding', 'Snapping', 'Snap', 'Snapchat'], pressed: false }, 
    { text: 'Class', iconLibrary: "materialIcons", icon: "class", keywords: ['Stroll'], pressed: false }, 
    { text: 'Writing', iconLibrary: "materialCommunityIcons", icon: "typewriter", keywords: ['Stroll'], pressed: false }, 
    { text: 'Chores', iconLibrary: "materialIcons", icon: "local-laundry-service", keywords: ['Stroll'], pressed: false }, 
    { text: 'Laying In Bed', iconLibrary: "fontAwesome5", icon: "bed", keywords: ['Scrolling', 'Waking Up'], pressed: false }, 
    { text: 'Preparing a Meal', iconLibrary: "materialCommunityIcons", icon: "chef-hat", keywords: ['Cooking'], pressed: false }, 
    { text: 'Family Time', iconLibrary: "antDesign", icon: "heart", keywords: ['Spending Time With Family', 'Socializing with family', 'Family Social', 'Game Night', 'Talking With parents'], pressed: false }, 
    { text: 'Helping Family', iconLibrary: "materialCommunityIcons", icon: "mother-heart", keywords: ['Services', 'Performing Services', 'Duties', 'Chores', 'Family Chores', 'Mother'], pressed: false }, 
    { text: 'Volunteering', iconLibrary: "materialIcons", icon: "volunteer-activism", keywords: ['Services', 'Doing Volunteer Work', 'Work'], pressed: false }, 
    { text: 'Journaling', iconLibrary: "ionicons", icon: "journal-sharp", keywords: ['Writing'], pressed: false },
    { text: 'Getting Ready', iconLibrary: "ionicons", icon: "shirt", keywords: ['Preparing', 'Night Out', 'Make Up', 'Dressing', 'Getting Dressed', 'Putting On Make Up'], pressed: false },
    { text: 'Outing', iconLibrary: "fontAwesome5", icon: "car", keywords: ['Going Out', 'Eating Out', 'Having Lunch Out', 'Brunch', 'Family Lunch'], pressed: false },
    { text: 'Driving', iconLibrary: "fontAwesome5", icon: "car", keywords: ['Drive', 'Navigating'], pressed: false },


  ]
const shuffle = (array: ButtonState[]) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
}

const flip = (array: ButtonState[]) => {
   return array.reverse()
}
const ShuffledActivityButtons = shuffle(ActivityButtons)
const FlippedActivityButtons = flip(ShuffledActivityButtons)

interface ValueCounts {
  [key: string]: number;
}
// Define the type for the summary result
interface ActivitySummary {
  text: string;
  totalDuration: number;
}

const countValues = (array: string[]): ValueCounts => {
  return array.reduce((acc: ValueCounts, value: string) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};
const useCustomSet = (): any => {
  const { user } = useAuth();
  const [finalArray, setFinalArray] = useState<ButtonState[]>([]);
  const [entries, setEntries] = useState<[string, number][]>([])
  const [durationSummary, setDurationSummary] = useState<ActivitySummary[]>([])
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activities = await getAllActivitiesForUser(user);
        
        const activityText = activities.map((activity) => activity.button.text);
        // Step 1: Group activities by name and sum durations
        const totalTimePerActivity = activities.reduce<Record<string, number>>((acc, activity) => {
          if (acc[activity.button.text]) {
            acc[activity.button.text] += activity.timeBlock.duration/60;
          } else {
            acc[activity.button.text] = activity.timeBlock.duration/60;
          }
          return acc;
        }, {});
        // Step 2: Convert the result into an array of ActivitySummary objects
        const result: ActivitySummary[] = Object.entries(totalTimePerActivity).map(([text, totalDuration]) => ({
          text,
          totalDuration
        }));
        setDurationSummary(result)
        console.log(result)
        const activityCounts = countValues(activityText);
        const entries = Object.entries(activityCounts);
        setEntries(entries)
        entries.sort(([, valueA], [, valueB]) => valueB - valueA);
        const topEntries = entries.slice(0, 9);
        const sortedDictTop = Object.fromEntries(topEntries);
        const textKeys = Object.keys(sortedDictTop);
        const correspondingButtons = ActivityButtons.filter((button) =>
          textKeys.includes(button.text)
        );

        let updatedArray: ButtonState[] = [...correspondingButtons];
        if (updatedArray.length < 9) {
          const remainingSlots = 9 - updatedArray.length;
          const additionalButtons = ShuffledActivityButtons.filter(
            (button) => !textKeys.includes(button.text)
          ).slice(0, remainingSlots);
          updatedArray = [...updatedArray, ...additionalButtons];
        }
        setFinalArray(updatedArray);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchActivities();
  }, [user]);

  return {finalArray, entries, durationSummary};
};

export {useCustomSet, ShuffledActivityButtons, FlippedActivityButtons, ActivityButtons}