import getAllActivitiesForUser from '@/Data/GetAllActivities'
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'


type ButtonState = {
    text: string;
    iconLibrary: string;
    icon: string;
    keywords: string[];
    tags?: string[];
    pressed: boolean;
    id?: string;
  };

  const ActivityButtons: ButtonState[] = [
    // Food/Drink Related
    { text: 'Breakfast', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Meal'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Snacking', iconLibrary: "fontAwesome5", icon: "apple-alt", keywords: ['Eating', 'Meal', 'Snack', 'Quick Snack'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Coffee', iconLibrary: "materialCommunityIcons", icon: "coffee", keywords: ['Cafe', 'Espresso', 'Black Coffee'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Preparing My Coffee', iconLibrary: "materialIcons", icon: "coffee-maker", keywords: ['Cafe', 'Espresso', 'Espresso Machine', 'Coffee Machine'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Lunch', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Meal'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Dinner', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Meal'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Meal', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Eating', 'Breakfast', 'Lunch', 'Dinner', 'Snack'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Brunch', iconLibrary: "materialIcons", icon: "brunch-dining", keywords: ['Eating', 'Meal'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Baking', iconLibrary: "materialCommunityIcons", icon: "bread-slice", keywords: ['Cooking', 'Bread', 'Desserts'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Cooking Dinner', iconLibrary: "materialCommunityIcons", icon: "pot-steam", keywords: ['Cooking', 'Dinner'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Cooking Lunch', iconLibrary: "materialCommunityIcons", icon: "food-steak", keywords: ['Cooking', 'Lunch'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Preparing Breakfast', iconLibrary: "materialCommunityIcons", icon: "egg-fried", keywords: ['Cooking', 'Breakfast'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Eating Out', iconLibrary: "fontAwesome5", icon: "utensils", keywords: ['Restaurant', 'Cafe'], pressed: false, tags: ['Food/Drink'] },
    { text: 'Other Food/Drink', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Food/Drink'] },
  
    // Physical
    { text: 'Walking', iconLibrary: "fontAwesome5", icon: "walking", keywords: ['Stroll'], pressed: false, tags: ['Physical'] },
    { text: 'Running', iconLibrary: "materialCommunityIcons", icon: "run-fast", keywords: ['Jogging'], pressed: false, tags: ['Physical'] },
    { text: 'Jogging', iconLibrary: "materialCommunityIcons", icon: "run", keywords: ['Jogging'], pressed: false, tags: ['Physical'] },
    { text: 'Cycling', iconLibrary: "fontAwesome5", icon: "bicycle", keywords: ['Biking'], pressed: false, tags: ['Physical'] },
    { text: 'Swimming', iconLibrary: "materialCommunityIcons", icon: "swim", keywords: ['Pool', 'Laps'], pressed: false, tags: ['Physical'] },
    { text: 'Gym', iconLibrary: "materialCommunityIcons", icon: "weight-lifter", keywords: ['Exercise', 'Workout'], pressed: false, tags: ['Physical'] },
    { text: 'Home Workout', iconLibrary: "materialCommunityIcons", icon: "jump-rope", keywords: ['Working Out', 'Exercise', 'Gym'], pressed: false, tags: ['Physical'] },
    { text: 'Home Physical Therapy', iconLibrary: "ionicons", icon: "medkit", keywords: ['Working Out', 'Exercise', 'Gym', 'Physical Therapy', 'PT', 'Rehab'], pressed: false, tags: ['Physical'] },
    { text: 'Yoga', iconLibrary: "materialCommunityIcons", icon: "yoga", keywords: ['Stretching', 'Meditation'], pressed: false, tags: ['Physical'] },
    { text: 'Pilates', iconLibrary: "materialCommunityIcons", icon: "yoga", keywords: ['Stretching', 'Core'], pressed: false, tags: ['Physical'] },
    { text: 'Playing Soccer', iconLibrary: "materialIcons", icon: "sports-soccer", keywords: ['Sport', 'Football'], pressed: false, tags: ['Physical', 'Sports'] },
    { text: 'Playing Basketball', iconLibrary: "materialIcons", icon: "sports-basketball", keywords: ['Sport'], pressed: false, tags: ['Physical', 'Sports'] },
    { text: 'Playing Tennis', iconLibrary: "materialIcons", icon: "sports-tennis", keywords: ['Sport'], pressed: false, tags: ['Physical', 'Sports'] },
    { text: 'Playing Golf', iconLibrary: "materialIcons", icon: "sports-golf", keywords: ['Sport'], pressed: false, tags: ['Physical', 'Sports'] },
    { text: 'Playing Ping Pong', iconLibrary: "materialIcons", icon: "sports-tennis", keywords: ['Sport', 'Table Tennis'], pressed: false, tags: ['Physical', 'Sports'] },
    { text: 'Hiking', iconLibrary: "fontAwesome5", icon: "hiking", keywords: ['Going For A Hike', 'Taking A Hike', 'Hike'], pressed: false, tags: ['Physical', 'Outdoor'] },
    { text: 'Maximum Tabata', iconLibrary: "materialCommunityIcons", icon: "run", keywords: ['Jogging'], pressed: false, tags: ['Physical'] },
    { text: 'Other Physical Activity', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Physical'] },
  
    // Relax
    { text: 'Hot Tub', iconLibrary: "fontAwesome5", icon: "hot-tub", keywords: ['Relaxing', 'Jacuzzi', 'Bath', 'Hot Bath'], pressed: false, tags: ['Relax'] },
    { text: 'Showering', iconLibrary: "fontAwesome5", icon: "shower", keywords: ['Shower', 'Water', 'Cleaning'], pressed: false, tags: ['Relax'] },
    { text: 'Taking a Break', iconLibrary: "fontAwesome5", icon: "pause", keywords: ['Break', 'Quick Break', 'Rest', 'Resting', 'Pause', 'Pausing'], pressed: false, tags: ['Relax'] },
    { text: 'Wound Care', iconLibrary: "ionicons", icon: "bandage", keywords: ['Bandage', 'Injury'], pressed: false, tags: ['Relax'] },
    { text: 'Hygiene/Skin Care', iconLibrary: "fontAwesome5", icon: "smile-beam", keywords: ['Brushing Teeth', 'Tooth Brush', 'Brush', 'Washing Face', 'Face Mask'], pressed: false, tags: ['Relax'] },
    { text: 'Briefly Woke Up', iconLibrary: "ionicons", icon: "moon", keywords: ['Awoke', 'Woke Up', 'Fell Back Asleep'], pressed: false, tags: ['Relax'] },
    { text: 'Went To Bed', iconLibrary: "materialCommunityIcons", icon: "sleep", keywords: ['Sleep', 'Fell Asleep', 'Fall Asleep', 'Asleep', 'Good Night', 'Night', 'Konked Out'], pressed: false, tags: ['Relax'] },
    { text: 'Woke Up', iconLibrary: "ionicons", icon: "alarm", keywords: ['Awoke', 'Good Morning', 'Woken Up', 'Wake Up', 'Alarm Rang', 'Started Day'], pressed: false, tags: ['Relax'] },
    { text: 'Meditating', iconLibrary: "materialCommunityIcons", icon: "meditation", keywords: ['Relaxing', 'Mindfulness'], pressed: false, tags: ['Relax'] },
    { text: 'Taking a Nap', iconLibrary: "materialIcons", icon: "bed", keywords: ['Rest', 'Sleep'], pressed: false, tags: ['Relax'] },
    { text: 'Other Relaxing Activity', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Relax'] },
  
    // Music
    { text: 'Composing', iconLibrary: "ionicons", icon: "musical-note-sharp", keywords: ['Music'], pressed: false, tags: ['Music'] },
    { text: 'Listening To Music', iconLibrary: "fontAwesome5", icon: "music", keywords: ['Music'], pressed: false, tags: ['Music'] },
    { text: 'Playing an Instrument', iconLibrary: "ionicons", icon: "musical-instruments", keywords: ['Music'], pressed: false, tags: ['Music'] },
    { text: 'Singing', iconLibrary: "ionicons", icon: "mic", keywords: ['Music'], pressed: false, tags: ['Music'] },
    { text: 'Other Music Activity', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Music'] },
  
    // Entertainment
    { text: 'TV Watching', iconLibrary: "materialIcons", icon: "tv", keywords: ['Television', 'Netflix', 'Hulu', 'TV Shows', 'Movies'], pressed: false, tags: ['Entertainment'] },
    { text: 'Movie Watching', iconLibrary: "fontAwesome5", icon: "film", keywords: ['Cinema', 'Film', 'Theater', 'Theatre'], pressed: false, tags: ['Entertainment'] },
    { text: 'Social Media', iconLibrary: "materialCommunityIcons", icon: "twitter", keywords: ['Instagram', 'Facebook', 'Twitter', 'Snapchat', 'Socializing', 'Online'], pressed: false, tags: ['Entertainment'] },
    { text: 'Gaming', iconLibrary: "materialCommunityIcons", icon: "gamepad-variant-outline", keywords: ['Video Games', 'Computer Games', 'PlayStation', 'Xbox', 'Nintendo'], pressed: false, tags: ['Entertainment'] },
    { text: 'Reading', iconLibrary: "materialIcons", icon: "menu-book", keywords: ['Books', 'Novels', 'Comics'], pressed: false, tags: ['Entertainment'] },
    { text: 'Going to a Museum', iconLibrary: "fontAwesome5", icon: "university", keywords: ['Art', 'History', 'Exhibits'], pressed: false, tags: ['Entertainment'] },
    { text: 'Going to a Concert', iconLibrary: "ionicons", icon: "musical-notes", keywords: ['Music', 'Live Music', 'Band'], pressed: false, tags: ['Entertainment'] },
    { text: 'Going to a Party', iconLibrary: "materialCommunityIcons", icon: "party-popper", keywords: ['Celebration', 'Friends', 'Social'], pressed: false, tags: ['Entertainment'] },
    { text: 'Other Entertainment Activity', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Entertainment'] },
  
    // Work/Study
    { text: 'Working', iconLibrary: "materialIcons", icon: "work", keywords: ['Job', 'Occupation'], pressed: false, tags: ['Work/Study'] },
    { text: 'Studying', iconLibrary: "ionicons", icon: "school", keywords: ['Learning', 'Homework'], pressed: false, tags: ['Work/Study'] },
    { text: 'Researching', iconLibrary: "ionicons", icon: "search", keywords: ['Academic', 'Work', 'Project'], pressed: false, tags: ['Work/Study'] },
    { text: 'Reading Articles', iconLibrary: "materialIcons", icon: "menu-book", keywords: ['News', 'Online Reading', 'Research'], pressed: false, tags: ['Work/Study'] },
    { text: 'Meeting', iconLibrary: "materialIcons", icon: "meeting-room", keywords: ['Work', 'Business'], pressed: false, tags: ['Work/Study'] },
    { text: 'Writing', iconLibrary: "materialIcons", icon: "create", keywords: ['Typing', 'Journal', 'Work', 'Study'], pressed: false, tags: ['Work/Study'] },
    { text: 'Other Work/Study Activity', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Work/Study'] },
  
    // Travel/Commute
    { text: 'Commuting', iconLibrary: "fontAwesome5", icon: "car", keywords: ['Travel', 'Driving', 'Train', 'Bus', 'Metro'], pressed: false, tags: ['Travel/Commute'] },
    { text: 'Driving', iconLibrary: "materialCommunityIcons", icon: "car", keywords: ['Travel', 'Commuting'], pressed: false, tags: ['Travel/Commute'] },
    { text: 'Flying', iconLibrary: "materialCommunityIcons", icon: "airplane", keywords: ['Travel', 'Flight'], pressed: false, tags: ['Travel/Commute'] },
    { text: 'Taking a Train', iconLibrary: "materialCommunityIcons", icon: "train", keywords: ['Travel', 'Commuting'], pressed: false, tags: ['Travel/Commute'] },
    { text: 'Taking a Bus', iconLibrary: "materialCommunityIcons", icon: "bus", keywords: ['Travel', 'Commuting'], pressed: false, tags: ['Travel/Commute'] },
    { text: 'Traveling', iconLibrary: "fontAwesome5", icon: "suitcase-rolling", keywords: ['Vacation', 'Trip'], pressed: false, tags: ['Travel/Commute'] },
    { text: 'Other Travel/Commute Activity', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Travel/Commute'] },
  
    // Hobbies
    { text: 'Gardening', iconLibrary: "materialCommunityIcons", icon: "flower", keywords: ['Plants', 'Outdoors'], pressed: false, tags: ['Hobbies'] },
    { text: 'Painting', iconLibrary: "materialIcons", icon: "brush", keywords: ['Art'], pressed: false, tags: ['Hobbies'] },
    { text: 'Drawing', iconLibrary: "materialIcons", icon: "pencil", keywords: ['Art'], pressed: false, tags: ['Hobbies'] },
    { text: 'Photography', iconLibrary: "fontAwesome5", icon: "camera", keywords: ['Photos', 'Art'], pressed: false, tags: ['Hobbies'] },
    { text: 'Knitting', iconLibrary: "materialIcons", icon: "knit", keywords: ['Crafts'], pressed: false, tags: ['Hobbies'] },
    { text: 'Woodworking', iconLibrary: "materialIcons", icon: "handyman", keywords: ['Crafts'], pressed: false, tags: ['Hobbies'] },
    { text: 'Playing Chess', iconLibrary: "fontAwesome5", icon: "chess", keywords: ['Game', 'Board Game'], pressed: false, tags: ['Hobbies'] },
    { text: 'Playing Board Games', iconLibrary: "materialCommunityIcons", icon: "game-board", keywords: ['Games', 'Board Games'], pressed: false, tags: ['Hobbies'] },
    { text: 'Collecting', iconLibrary: "materialIcons", icon: "collections", keywords: ['Stamps', 'Coins', 'Antiques'], pressed: false, tags: ['Hobbies'] },
    { text: 'Other Hobbies', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Hobbies'] },
  
    // Other
    { text: 'Shopping', iconLibrary: "materialIcons", icon: "shopping-cart", keywords: ['Buying', 'Stores', 'Online Shopping'], pressed: false, tags: ['Other'] },
    { text: 'Running Errands', iconLibrary: "materialIcons", icon: "local-grocery-store", keywords: ['Tasks', 'Chores'], pressed: false, tags: ['Other'] },
    { text: 'Cleaning', iconLibrary: "materialIcons", icon: "cleaning-services", keywords: ['Housework'], pressed: false, tags: ['Other'] },
    { text: 'Cooking', iconLibrary: "materialIcons", icon: "restaurant", keywords: ['Food Preparation'], pressed: false, tags: ['Other'] },
    { text: 'Other', iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: ['Other'] },
  ];
  
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
            acc[activity.button.text] += activity.timeBlock.duration/3600;
          } else {
            acc[activity.button.text] = activity.timeBlock.duration/3600;
          }
          return acc;
        }, {});
        // Step 2: Convert the result into an array of ActivitySummary objects
        const result: ActivitySummary[] = Object.entries(totalTimePerActivity).map(([text, totalDuration]) => ({
          text,
          totalDuration
        }));
        setDurationSummary(result)

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