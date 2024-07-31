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
    { text: 'Walk', iconLibrary: "fontAwesome5", icon: "walking", keywords: ['Stroll'], pressed: false }, //fontawesome
    { text: 'Breakfast', iconLibrary: "materialCommunityIcons", icon: "food-variant", keywords: ['Stroll'], pressed: false }, //community
    { text: 'Coffee', iconLibrary: "materialCommunityIcons", icon: "coffee", keywords: ['Stroll'], pressed: false }, //community
    { text: 'Gym', iconLibrary: "materialCommunityIcons", icon: "weight-lifter", keywords: ['Stroll'], pressed: false }, //community
    { text: 'Scrolling', iconLibrary: "fontAwesome5", icon: "tiktok", keywords: ['Stroll'], pressed: false }, //fontawesome5
    { text: 'Driving', iconLibrary: "antDesign", icon: "car", keywords: ['Stroll'], pressed: false }, //antdesign
    { text: 'School', iconLibrary: "ionicons", icon: "school", keywords: ['Stroll'], pressed: false }, //ionicons
    { text: 'Relaxation', iconLibrary: "fontAwesome5", icon: "umbrella-beach", keywords: ['Stroll'], pressed: false}, //fontawesome
    { text: 'Work', iconLibrary: "materialIcons", icon: "work", keywords: ['Stroll'], pressed: false }, //materialicons
    { text: 'Sport', iconLibrary: "materialIcons", icon: "sports-football", keywords: ['Stroll'], pressed: false }, 
    { text: 'Reading', iconLibrary: "fontAwesome5", icon: "book", keywords: ['Stroll'], pressed: false }, 
    { text: 'Errands', iconLibrary: "ionicons", icon: "cart", keywords: ['Stroll'], pressed: false }, 
    { text: 'Shopping', iconLibrary: "materialCommunityIcons", icon: "purse", keywords: ['Stroll'], pressed: false }, 
    { text: 'Watching Show', iconLibrary: "materialCommunityIcons", icon: "netflix", keywords: ['Stroll'], pressed: false }, 
    { text: 'Watching Movie', iconLibrary: "materialIcons", icon: "theaters", keywords: ['Stroll'], pressed: false }, 
    { text: 'Socializing', iconLibrary: "fontAwesome5", icon: "user-friends", keywords: ['Stroll'], pressed: false }, 
    { text: 'Partying', iconLibrary: "materialCommunityIcons", icon: "party-popper", keywords: ['Stroll'], pressed: false }, 
    { text: 'Class', iconLibrary: "materialIcons", icon: "class", keywords: ['Stroll'], pressed: false }, 
    { text: 'Writing', iconLibrary: "materialCommunityIcons", icon: "typewriter", keywords: ['Stroll'], pressed: false }, 
    { text: 'Listening To Music', iconLibrary: "fontAwesome5", icon: "music", keywords: ['Stroll'], pressed: false }, 
    { text: 'Chores', iconLibrary: "materialIcons", icon: "local-laundry-service", keywords: ['Stroll'], pressed: false }, 
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