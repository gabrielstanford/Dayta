import {useAppContext, AppProvider} from '@/contexts/AppContext'
import {ButtonState} from '@/Types/ActivityTypes'
import {useAuth} from '@/contexts/AuthContext'
import {Dispatch, SetStateAction, useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import RNPickerSelect from 'react-native-picker-select'
import { Routine, Activity } from '@/Types/ActivityTypes'
import CreateRoutineModal from '@/components/CreateRoutineModal'
import uuid from 'react-native-uuid'

const {width, height} = Dimensions.get("window");
const buttonWidth = width/5;
const buttonHeight = height/19;
const titleWidth = width/1.5;

function Personalize() {
    const {addCustomActivity, addCustomRoutine, customActivities} = useAppContext();
    const {user} = useAuth();
    const [MultitaskModalVisible, setMultitaskModalVisible] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>("")
    const [tag1Value, setTag1Value] = useState<string>("")
    const [tag2Value, setTag2Value] = useState<string>("")
    const [routineName, setRoutineName] = useState<string>("");
    const [routineActivities, setRoutineActivities] = useState<Activity[]>([])
   
    const handleInputChange = (text: string) => {
        setInputText(text); 
       };

    const handleRoutineInputChange = (name: string) => {
      setRoutineName(name);
    }

    const handleMultitaskNext = (texts: (string | number)[][]) => {
      // const activities = customActivities.filter((item: ButtonState) => texts.includes(item.text))
      // if(activities) {
      // setMultiActivity(activities)
      // setSelectedActivity(null)
      // }
      setMultitaskModalVisible(false)
      const button1 = customActivities.find(act => act.text==texts[0][0])
      const button2 = customActivities.find(act => act.text==texts[1][0])
      const button3 = customActivities.find(act => act.text==texts[2][0])
      const button4 = customActivities.find(act => act.text==texts[3][0])
    
      if(button1) {
      const act1: Activity = {id: uuid.v4() as string, button: button1, timeBlock: {startTime: 0, duration: texts[0][1] as number, endTime: 0}}
      setRoutineActivities([act1])
      }
      if(button2) {
        const act2: Activity = {id: uuid.v4() as string, button: button2, timeBlock: {startTime: 0, duration: texts[1][1] as number, endTime: 0}}
        setRoutineActivities((prevActs: Activity[]) => {return [...prevActs, act2]})
      }
      if(button3) {
      const act3 = {id: uuid.v4() as string, button: button3, timeBlock: {startTime: 0, duration: texts[2][1] as number, endTime: 0}}
      setRoutineActivities((prevActs: Activity[]) => {return [...prevActs, act3]})

      }
      if(button4) {
        const act4 = {id: uuid.v4() as string, button: button4, timeBlock: {startTime: 0, duration: texts[3][1] as number, endTime: 0}}
        setRoutineActivities((prevActs: Activity[]) => {return [...prevActs, act4]})
      }

    }
    const handleSubmit = () => {
        if(inputText.length>3 && tag1Value.length>0) {
        let tags=[""];
        if(tag1Value.length>0 && tag2Value.length>0) {
            tags=[tag1Value, tag2Value]
        }
        else if (tag1Value.length>0 && tag2Value=="") {
          tags=[tag1Value]
        }
        else if(tag2Value.length>0 && tag1Value=="") {
          tags=[tag2Value]
        }
        const newButton = {text: inputText,  iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: tags}
        setTimeout(() => {
          addCustomActivity(newButton);
        }, 0)
        alert("successfully added custom activity. feel free to use it now as often as you'd like!")
        }
        else {
        alert("invalid input")
        }
    }
    const handleRoutineSubmit = () => {
        if(routineName.length>0) {
          if(routineActivities.length>1) {
            alert("success")
            const newRoutine: Routine = {name: routineName, activities: routineActivities}
              setTimeout(() => {
                console.log(newRoutine.activities)
              addCustomRoutine(newRoutine);
            }, 0)
          }
          else {
            alert("Problem with activities. Try again.")
          }
        }
        else {
          alert("Add a Routine Name")
        }
        // const newRoutine: Routine = {name: routineName, activities: routineActivities}
        // setTimeout(() => {
        //   addCustomRoutine(newRoutine);
        // }, 0)
    }
    
    return (
        <>
        <View style={styles.modalOverlay}>
        <CreateRoutineModal style={{}} MultitaskModalVisible={MultitaskModalVisible} onNext={handleMultitaskNext} onTapOut={() => setMultitaskModalVisible(false)}/>
        <View style={styles.titleContainer}>
              <ThemedText type="titleText" style={{fontSize: width/12}}>Personalization</ThemedText>
            </View>
          {/* <View style={styles.headerSection}>
          </View> */}
          <View style={styles.createActivityContainer}>
          <View style={styles.textSection}>
            <Text style={{fontSize: width/16, color: 'white', fontStyle: 'italic'}}>Create Custom Activity</Text>
            <View style={styles.textContainer}>
            <ThemedText type="subtitle">Activity Name: </ThemedText>
            <View style={styles.inputText}>
            <TextInput value={inputText} 
                onChangeText={handleInputChange}
                maxLength={30}
                keyboardType="default" 
                // onSubmitEditing={() => handleSubmit(newButton)}
                returnKeyType="done"
                style={styles.textInputContainer}
            />
            </View>
            </View>
          </View>
          <View style={styles.tagSection}>
            <ThemedText type="subtitle">Add Tags: </ThemedText>
            <TagDropdown setTagValue={setTag1Value}/>
            <TagDropdown setTagValue={setTag2Value}/>
          </View>
          <View style={styles.createContainer}>
              <TouchableOpacity onPress={() => handleSubmit()} style={styles.closeButton}>
                <Text style={styles.buttonText}>Create Activity</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Create Custom Routine Interface */}
          <View style={styles.createActivityContainer}>
          <View style={styles.textSection}>
            <Text style={{fontSize: width/16, color: 'white', fontStyle: 'italic'}}>Create Custom Routine</Text>
            <View style={styles.textContainer}>
            <ThemedText type="subtitle">Routine Name: </ThemedText>
            <View style={styles.inputText}>
            <TextInput value={routineName} 
                onChangeText={handleRoutineInputChange}
                maxLength={30}
                keyboardType="default" 
                // onSubmitEditing={() => handleSubmit(newButton)}
                returnKeyType="done"
                style={styles.textInputContainer}
            />
            </View>
            </View>
          </View>
          <View style={styles.setUp}>
            <ThemedText type="subtitle">Set Up Routine: </ThemedText>
            <TouchableOpacity style={styles.addRoutineButton} onPress={() => setMultitaskModalVisible(true)}>
              <Text>Add Activities</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.createContainer}>
              <TouchableOpacity onPress={() => handleRoutineSubmit()} style={styles.closeButton}>
                <Text style={styles.buttonText}>Create Routine</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </>
    )
}

interface TagDropdownProps {
    setTagValue: Dispatch<SetStateAction<string>>;
  }
  const TagDropdown: React.FC<TagDropdownProps> = ({ setTagValue }) => {
    const tags = [
      { label: 'Food/Drink', value: 'Food/Drink'},
      { label: 'Physical', value: 'Physical' },
      { label: 'Relax', value: 'Relax' },
      { label: 'Music', value: 'Music' },
      { label: 'Entertainment', value: 'Entertainment' },
      { label: 'Social', value: 'Social' },
      { label: 'Work/Study', value: 'Work/Study' },
      { label: 'Travel/Commute', value: 'Travel/Commute' },
      { label: 'Hobbies', value: 'Hobbies' },
      { label: 'Chores', value: 'Chores' },
      { label: 'Self-Improvement', value: 'Self-Improvement' },
      {label: 'Family Time', value: 'Family Time'},
      { label: 'Helping Others', value: 'Helping Others' },

      { label: 'Other', value: 'Other' },
    ]
    return (
      <RNPickerSelect
        onValueChange={(value) => setTagValue(value)}
        items={tags}
      />
    );
  };

// const Personalize: React.FC = () => {
//     return (
//       <AppProvider>
//         <Logic />
//       </AppProvider>
//     );
//   };
  
  export default Personalize;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'darkcyan',
      paddingTop: height/18,
      position: 'relative'
    },
     titleContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 15
    },
    addRoutineButton: {
      padding: 10,
      backgroundColor: 'yellow'
    },
    createActivityContainer: {
      flex: 10,
    },
    buttonTextContainer: {
      flex: 1,
      alignItems: 'flex-start'
    },
    textContainer: {

      flexDirection: 'row',
    },
    inputText: {
        // flex: 1,
        // flexDirection: 'row'
    },
    textSection: {
      padding: 30,
      rowGap: 20,
    },
    setUp: {
    padding: 30,
    flexDirection: 'row'
    },
    tagSection: {
        padding: 30,
        rowGap: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'

    },

    createContainer: {
 
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: 'blue', // Example background color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 21,
      color: 'white',
    },
    textInputContainer: {
     backgroundColor: 'white',
     width: width/2,
     height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    },
  });