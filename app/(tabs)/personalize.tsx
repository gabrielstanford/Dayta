import {useAppContext, AppProvider} from '@/contexts/AppContext'
import {ButtonState} from '@/Types/ActivityTypes'
import {useAuth} from '@/contexts/AuthContext'
import {Dispatch, SetStateAction, useState, useRef} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard, FlatList} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import RNPickerSelect from 'react-native-picker-select'
import { Routine, Activity } from '@/Types/ActivityTypes'
import CreateRoutineModal from '@/components/CreateRoutineModal'
import uuid from 'react-native-uuid'
import CustomButton from '@/components/CustomButton'

const {width, height} = Dimensions.get("window");
const buttonWidth = width/5;
const buttonHeight = height/19;
const titleWidth = width/1.5;

function Personalize() {
    const {addCustomActivity, addCustomRoutine, customActivities} = useAppContext();
    const {user} = useAuth();
    const [createRoutineModalVisible, setCreateRoutineModalVisible] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>("")
    const [tag1Value, setTag1Value] = useState<string>("null")
    const [tag2Value, setTag2Value] = useState<string>("null")
    const [routineName, setRoutineName] = useState<string>("");
    const [durationBetween, setDurationBetween] = useState<number[]>([]);
    const [routineActivities, setRoutineActivities] = useState<Activity[]>([])
    const [value, setValue] = useState<string>("Activity");
    const [pageType, setPageType] = useState<string>("Create")
    const flatListRef = useRef<FlatList>(null);
    const handleInputChange = (text: string) => {
        setInputText(text); 
       };

    const handleRoutineInputChange = (name: string) => {
      setRoutineName(name);
    }

    const handleMultitaskNext = (texts: [string, number, number][]) => {
      // Close the modal
      setCreateRoutineModalVisible(false);
  
      // Create a new array to hold the activities
      const newActivities: Activity[] = [];
  
      // Iterate over the texts array to build the activities
      texts.forEach((text, index) => {
          const [name, duration, gapBetween] = text;
          const button = customActivities.find(act => act.text === name);
  
          if (button) {
              const newActivity: Activity = {
                  id: uuid.v4() as string,
                  button: button,
                  timeBlock: {
                      startTime: 0,
                      duration: duration,
                      endTime: 0
                  }
              };
              newActivities.push(newActivity);
          }
      });
  
      // Update the routine activities state
      setRoutineActivities(newActivities);
      // Set duration between activities
      setDurationBetween(texts.map(text => text[2]));
  };
  
    const handleSubmit = () => {
        if(inputText.length>2 && (tag1Value!=="null" || tag2Value!=="null")) {
          if(tag1Value==tag2Value) {
            alert("Make sure the tags are not the same")
            return;
          }
        let tags=[""];
        if(tag1Value!=="null" && tag2Value!=="null") {
            tags=[tag1Value, tag2Value]
        }
        else if (tag1Value!=="null") {
          tags=[tag1Value]
        }
        else if(tag2Value!=="null") {
          tags=[tag2Value]
        }
        if(tags[0].length>0) {
        const newButton = {text: inputText,  iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: tags}
        setTimeout(() => {
          addCustomActivity(newButton);
        }, 0)
        alert("successfully added custom activity. feel free to use it now as often as you'd like!")
         }
         else {
          alert("Problem with tags. Try again.")
         }
        }
        else {
        alert("invalid input")
        }
    }
    const handleRoutineSubmit = () => {
        if(routineName.length>0) {
          if(routineActivities.length>=2) {
            if(durationBetween.length==routineActivities.length) {
            alert("success")
            const newRoutine: Routine = {name: routineName, durationBetween: durationBetween, activities: routineActivities}
              setTimeout(() => {

                addCustomRoutine(newRoutine);
            
            }, 0)
            }
            else {
              alert("Please make sure the duration betweens are set correctly.")
            }
          }
          else {
            alert("Please make sure you have enough activities.")
          }
        }
        else {
          alert("Add a Routine Name")
        }

    }

    const renderContent = () => {
      if (pageType === "Create" && value === 'Activity') {
        return (
          <View style={styles.container}>
          <View style={styles.textSection}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.inputTitle}>Create Custom Activity</Text>
          </View>
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
            <View style={styles.tagsContainer}>
              <View style={styles.tagStyle}>
              <TagDropdown setTagValue={setTag1Value}/>
              </View>
              <View style={styles.tagStyle}>
              <TagDropdown setTagValue={setTag2Value}/>
              </View>
            </View>
         </View>
        <View style={styles.createContainer}>
            <TouchableOpacity onPress={() => handleSubmit()} style={styles.closeButton}>
              <Text style={styles.buttonText}>Create Activity</Text>
            </TouchableOpacity>
          </View>
        </View>
        );
      } else if (pageType === "Create" && value === 'Routine') {
        return (
          <View style={styles.container}>
          <View style={styles.textSection}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.inputTitle}>Create Custom Routine</Text>
            </View>
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
            <TouchableOpacity style={styles.addRoutineButton} onPress={() => setCreateRoutineModalVisible(true)}>
              <Text>Add Activities</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.createContainer}>
              <TouchableOpacity onPress={() => handleRoutineSubmit()} style={styles.closeButton}>
                <Text style={styles.buttonText}>Create Routine</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else if (pageType === "Edit" && value === 'Activity') {
        return (
          <View style={styles.container}>
              <FlatList
                ref={flatListRef}
                data={customActivities}
                keyExtractor={(item) => item.text}
                style={styles.flatList}
                renderItem={({ item}) => ( 
                  <View style={styles.resultContainer}>
                      <Text >{item.text}</Text>  
                  </View>
                )}
              />

            {/* Add your content here */}
          </View>
        );
      } else if (pageType === "Edit" && value === 'Routine') {
        return (
          <View style={styles.container}>
            <Text>Edit Routine Page</Text>
            {/* Add your content here */}
          </View>
        );
      } else {
        return null;
      }
    };
    
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalOverlay}>
          <CreateRoutineModal style={{}} MultitaskModalVisible={createRoutineModalVisible} onNext={handleMultitaskNext} onTapOut={() => setCreateRoutineModalVisible(false)}/>
          <View style={styles.titleContainer}>
              <ThemedText type="titleText" style={{fontSize: width/12}}>Personalization</ThemedText>
          </View>
          <View style={styles.startButtons}>
            <CustomButton title="Activity" width={width*0.4} onPress={() => setValue('Activity')} />
            <CustomButton title="Routine" width={width*0.4} onPress={() => setValue('Routine')}/>
          </View>
            {renderContent()}
          <View style={styles.endButtons}>
            <CustomButton title="Create" width={width*0.4} onPress={() => {setPageType("Create")}} />
            <CustomButton title="Edit" width={width*0.4} onPress={() => {setPageType("Edit")}} />
          </View>
        </View>
        </TouchableWithoutFeedback>
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
      {label: 'Intaking Knowledge', value: 'Intaking Knowledge'},
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
    valueButtonContainer: {
      flexDirection: 'row',
      marginVertical: 8,
      borderColor: 'orange',
      borderWidth: 2,
    },
    container: {
      borderWidth: 4,
      borderColor: 'orange',
      borderRadius: 20,
      flex: 10,
    },
    inputTitle: {
      fontSize: width/16, 
      color: 'white', 
      fontStyle: 'italic',
      alignItems: 'center'
    },
    buttonTextContainer: {
      flex: 1,
      alignItems: 'flex-start',
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    inputText: {
        // flex: 1,
        // flexDirection: 'row'
    },
    textSection: {
      // padding: 30,
      paddingVertical: 20,
      rowGap: 20,
      
    },
    setUp: {
    padding: 30,
    flexDirection: 'row'
    },
    tagSection: {
        rowGap: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingBottom: 30,

    },
    tagsContainer: {
      
    },
    tagStyle: {
      borderColor: 'black', 
      borderWidth: 2,
      borderRadius: 20,
      // backgroundColor: 'black',
      padding: 15,
      margin: 5
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
    startButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    resultContainer: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginTop: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      flexDirection: 'row',
      alignItems: 'center',
    },
    endButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      paddingBottom: 50,
    },
    flatList: {
      // flex: 1,
    },
  });