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

    //physical
    { text: 'Walk', iconLibrary: "fontAwesome5", icon: "walking", keywords: ['Stroll'], pressed: false },
    { text: 'Gym', iconLibrary: "materialCommunityIcons", icon: "weight-lifter", keywords: ['Exercise', 'Workout'], pressed: false },
    { text: 'Home Workout', iconLibrary: "materialCommunityIcons", icon: "jump-rope", keywords: ['Working Out', 'Exercise', 'Gym'], pressed: false },
    { text: 'Home Physical Therapy', iconLibrary: "ionicons", icon: "med-kit", keywords: ['Working Out', 'Exercise', 'Gym', 'Physical Therapy', 'PT', 'Rehab'], pressed: false },
    { text: 'Playing a Sport', iconLibrary: "materialIcons", icon: "sports-football", keywords: ['Sport', 'Football', 'Soccer', 'Baseball'], pressed: false }, 
    //relax
    { text: 'Hot Tub', iconLibrary: "fontAwesome5", icon: "hot-tub", keywords: ['Relaxing', 'Jacuzzi', 'Bath', 'Hot Bath'], pressed: false }, 
    { text: 'Showering', iconLibrary: "fontAwesome5", icon: "shower", keywords: ['Shower', 'Water', 'Cleaning'], pressed: false }, 
    { text: 'Taking a Break', iconLibrary: "fontAwesome5", icon: "pause", keywords: ['Break', 'Quick Break', 'Rest', 'Resting', 'Pause', 'Pausing'], pressed: false }, 
    //
    { text: 'Scrolling', iconLibrary: "fontAwesome5", icon: "tiktok", keywords: ['Stroll'], pressed: false }, 
    { text: 'Driving', iconLibrary: "antDesign", icon: "car", keywords: ['Stroll'], pressed: false }, 
    { text: 'School', iconLibrary: "ionicons", icon: "school", keywords: ['Stroll'], pressed: false }, 
    { text: 'Relaxation', iconLibrary: "fontAwesome5", icon: "umbrella-beach", keywords: ['Stroll'], pressed: false},
    { text: 'Working', iconLibrary: "materialIcons", icon: "work", keywords: ['Concentrating', 'Concentration'], pressed: false },
    { text: 'Concentrating', iconLibrary: "materialIcons", icon: "center-focus-strong", keywords: ['Concentration', 'Focus', 'Focusing'], pressed: false },
    { text: 'Reading', iconLibrary: "fontAwesome5", icon: "book", keywords: ['Stroll'], pressed: false }, 
    { text: 'Errands', iconLibrary: "ionicons", icon: "cart", keywords: ['Stroll'], pressed: false }, 
    { text: 'Shopping', iconLibrary: "materialCommunityIcons", icon: "purse", keywords: ['Stroll'], pressed: false }, 
    { text: 'Watching Show', iconLibrary: "materialCommunityIcons", icon: "netflix", keywords: ['Stroll'], pressed: false }, 
    { text: 'Watching Movie', iconLibrary: "materialIcons", icon: "theaters", keywords: ['Stroll'], pressed: false }, 
    //social
    { text: 'Socializing', iconLibrary: "fontAwesome5", icon: "user-friends", keywords: ['Stroll'], pressed: false }, 
    { text: 'Partying', iconLibrary: "materialCommunityIcons", icon: "party-popper", keywords: ['Stroll'], pressed: false },
    { text: 'Snapchatting', iconLibrary: "fontAwesome5", icon: "snapchat", keywords: ['Responding', 'Snapping', 'Snap', 'Snapchat'], pressed: false }, 
    { text: 'Class', iconLibrary: "materialIcons", icon: "class", keywords: ['Stroll'], pressed: false }, 
    { text: 'Writing', iconLibrary: "materialCommunityIcons", icon: "typewriter", keywords: ['Stroll'], pressed: false }, 
    { text: 'Listening To Music', iconLibrary: "fontAwesome5", icon: "music", keywords: ['Stroll'], pressed: false }, 
    { text: 'Chores', iconLibrary: "materialIcons", icon: "local-laundry-service", keywords: ['Stroll'], pressed: false }, 
    { text: 'Laying In Bed', iconLibrary: "fontAwesome5", icon: "bed", keywords: ['Scrolling', 'Waking Up'], pressed: false }, 
    { text: 'Preparing a Meal', iconLibrary: "materialCommunityIcons", icon: "chef-hat", keywords: ['Cooking'], pressed: false }, 
    { text: 'Composing', iconLibrary: "ionicons", icon: "musical-note-sharp", keywords: ['Music'], pressed: false }, 
    { text: 'Journaling', iconLibrary: "ionicons", icon: "journal-sharp", keywords: ['Writing'], pressed: false }
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

export {ShuffledActivityButtons, FlippedActivityButtons, ActivityButtons}