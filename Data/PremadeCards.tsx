import {Text, View, StyleSheet} from 'react-native'
import { RenderAfternoon, RenderMorning, RenderEvening } from './RenderExplanations';

export const PremadeCards = 
[
    { title: 'Improve Logging Habits', recCategory: 'Tracking', impactScore: 10, recDetails: `In order to generate meaningful recommendations, we need enough information. This is gathered completely through the journal. Over the last two weeks, you have logged an average of x hours of your day. The benchmark to aim for is 8 hours a day. We believe this is realistic and will give us enough to generate real stats and recommendations. The more the merrier though! For detailed suggestions on improving your logging habits, click below!` },
    { title: 'Morning Routine', recCategory: 'Reading', impactScore: 10, recDetails: 'A well setup morning routine gives your day structure and sets you up properly for the rest of the day. Lets get you setup with the perfect one, using science-based principles to build a routine that is both structured and allows for variety & spontaneity. ' },
    { title: 'Afternoon Routine', recCategory: 'Reading', impactScore: 10, recDetails: 'A well setup morning routine gives your day structure and sets you up properly for the rest of the day. Lets get you setup with the perfect one, using science-based principles to build a routine that is both structured and allows for variety & spontaneity. ' },
    { title: "Evening Routine", recCategory: 'Sleep Hygiene', impactScore: 10, recDetails: 'Based on your entries, we gather that your sleep habits could use some serious improvement. Sleep is one of the most important parts of our health and well-being, and improving your sleep is proven to have numerous incredible benefits. A few simple shifts in your routine will make all the difference. Click below to generate a detailed report on your current habits and an actionable plan to improve!' },
    { title: 'Improve Movement Habits', recCategory: 'Reading', impactScore: 10, recDetails: 'Read a calming book before bed.' }
]

// const afternoonMarkdown = () => {
//     // Define your dynamic variables
//     const userName = "John Doe";
//     const userScore = 87;
//     const goal = "100";
  
//     // Use template literals to create the dynamic Markdown text
// // const markdownText = 
// // `# h1 Heading 8-)

// // **This is some bold text!**

// // This is normal text
// // ## ${userName}
// // `;
// const markdownText = `
// ## Midday Through Evening (Hours 5–13)
// #### Use exercise to optimize your energy levels
// `
//     return markdownText
// }

export const CardLogic = [
    
    { title: 'Morning Routine', explanation: <RenderMorning/>},
    { title: 'Afternoon Routine', explanation: <RenderAfternoon/>},
    { title: 'Evening Routine', explanation: <RenderEvening/>},
    { title: 'Improve Logging Habits', explanation: <Text>No info yet, please explore other recommendations for now!</Text>},
    { title: 'Improve Movement Habits', explanation: <Text>No info yet, please come back later!</Text>},
    { title: 'Electronics', explanation: <RenderAfternoon/>},
]