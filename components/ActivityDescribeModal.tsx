import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, TextInput, FlatList, TouchableOpacity} from 'react-native'
import {ThemedText} from './ThemedText'
import React, {useState, useEffect} from 'react'
import {Button} from '@rneui/themed'
import {Activity} from '@/Types/ActivityTypes'
import { useAppContext } from '@/contexts/AppContext';
import RNPickerSelect from 'react-native-picker-select'
import { AntDesign } from '@expo/vector-icons';
import CategoryBar from './CategoryBar'
import {Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, MaterialIcons} from '@expo/vector-icons'

const {width, height} = Dimensions.get("window");
const buttonWidth = width/6.25

  
  interface MultitaskModalProps extends ModalProps {
    ActivityDescribeVisible: boolean;
    Info: Activity
    onClose: () => void;
    onTapOut: () => void;
  }
  interface ActivityItemProps {
    activity: Activity;
    updateActivity: (activity: Activity, updates: Partial<Activity>) => void;
    updatedTags: string[];
    setUpdatedTags: React.Dispatch<React.SetStateAction<string[]>>
    updatedCat: string[];
    movementIntensity: string;
    setMovementIntensity: React.Dispatch<React.SetStateAction<string>>
    onTap: () => void
  }

  const ActivityItem = ({ activity, updatedCat, updatedTags, setUpdatedTags, movementIntensity, setMovementIntensity, updateActivity, onTap }: ActivityItemProps) => {
    const iconMapping: { [key: string]: JSX.Element } = {
      "sunlight": <Feather name="sun" style={styles.category} />,
      "coffee": <Feather name="coffee" style={styles.category} />,
      "intense activity": <MaterialCommunityIcons name="dumbbell" style={styles.category} />,
      "exercise": <MaterialCommunityIcons name="dumbbell" style={styles.category} />,
      "light activity": <FontAwesome5 name="heartbeat" style={styles.category} />,
      "mental stimulation": <FontAwesome5 name="brain" style={styles.category} />,
      "meditation": <MaterialCommunityIcons name="meditation" style={styles.category} />,
      "electronics": <MaterialIcons name="phone-iphone" style={styles.category} />,
      "dopamine rush": <FontAwesome5 name="bolt" style={styles.category} />
      // Add more categories and corresponding JSX elements here
    };

    const handleSetTagValue = (index: number, value: string) => {
      const newTags = [...updatedTags];
      newTags[index] = value;
      setUpdatedTags(newTags);
    };
  
    // Add a new tag
    const handleAddTag = () => {
      setUpdatedTags([...updatedTags, '']); // Adding a new empty tag
    };
  
    // Delete a tag
    const handleDeleteTag = (index: number) => {
      if (updatedTags.length > 1) {
        const newTags = updatedTags.filter((_, i) => i !== index);
        setUpdatedTags(newTags);
      }
    };
    const [error, setError] = useState<string | null>(null);

  const handleChangeText = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/\D/g, '');

    // Convert to number
    const number = parseInt(numericValue, 10);

    // Check if the number is within the range 0-10
    if (!isNaN(number) && number >= 0 && number <= 10) {
      setMovementIntensity(numericValue);
      setError(null);
    } else if (numericValue === '') {
      // Allow empty input
      setMovementIntensity('')
      setError(null);
    } else {
      setError('Value must be between 0 and 10');
    }
  };
  console.log('intensity: ', movementIntensity)

    return (
      <View style={styles.activityContainer}>
        <View style={styles.rowContainer}>
        <View style={styles.detailsContainer}>
          <View style={styles.name}>
            <Text style={styles.activityName}>{activity.button.text} </Text>
            <View style={styles.categoryContainer}>
            {updatedCat.length>0 ? updatedCat.map((cat) => (
              <View key={cat}>
                {iconMapping[cat.toLowerCase()] || <Feather name="help-circle" style={styles.category} />}
                
              </View>
            )) : <></>}          
          </View>
          </View>

          <View style={styles.tagContainer}>
          {updatedTags.map((tag, index) => (
        <View key={index} style={styles.tagItem}>
          <TagDropdown
            tagValue={tag}
            setTagValue={(value) => handleSetTagValue(index, value as string)}
          />
          {updatedTags.length > 1 && (
            <TouchableOpacity onPress={() => handleDeleteTag(index)}>
              <FontAwesome name="minus-circle" size={16} color="red" style={styles.minusIcon} />
            </TouchableOpacity>
          )}
        </View>
        
      ))}

      {updatedTags.length < 4 && (
        <TouchableOpacity onPress={handleAddTag} style={styles.addButton}>
          <FontAwesome name="plus-circle" size={20} color="green" />
        </TouchableOpacity>
        )}
          </View>
        </View>
          </View>
          {updatedTags.includes("Physical") && 
            <View style={styles.exerciseSection}>
            <Text style={{fontSize: 18, color: 'darkcyan'}}>Customize Exercise</Text>
            <View style={{flexDirection: 'row'}}>
              <Text>Movement Intensity:</Text>
              <TextInput         
              value={movementIntensity.toString()}
              onChangeText={handleChangeText}
              maxLength={2} // This mask allows single digit input
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: 'gray', padding: 10 }}
               />
               {error && <Text >{error}</Text>}
            </View>
          </View>}
      </View>

  );}
const ActivityDescribeModal: React.FC<MultitaskModalProps> = ({ ActivityDescribeVisible, Info, onClose, onTapOut, ...modalProps }) => {

    const {updateActivity} = useAppContext();
    const startingTags: string[] = Info.button.tags
    const [updatedTags, setUpdatedTags] = useState(startingTags);
    const startingCat: string[] = Info.button.category ? Info.button.category : []
    const [updatedCat, setUpdatedCat] = useState<string[]>(startingCat as string[]);
    const startingMovementIntensity: number = (Info.button.movementIntensity && Info.button.movementIntensity>=0 && Info.button.movementIntensity<=10) ? Info.button.movementIntensity : 0
    const [movementIntensity, setMovementIntensity] = useState<string>(startingMovementIntensity.toString())
    console.log('intensity passed in: ', movementIntensity)
    console.log('')
    // Submit the tags to the database
    const handleSubmitTags = () => {
      let cat: string[] = []
      if(Info.button.category) {
        cat = Info.button.category
      }
      const updates: Partial<Activity> = {
        //first turn input value into unix. Create function for this. 
        button: {
          text: Info.button.text,
          keywords: Info.button.keywords,
          iconLibrary: Info.button.iconLibrary,
          icon: Info.button.icon,
          pressed: false,
          tags: updatedTags,
          category: cat,
          movementIntensity: parseInt(movementIntensity)
        },
      };
      console.log('updates: ', updates)
      updateActivity(Info, updates);
      // Add your database logic here
    };

    useEffect(() => {
      if(Info.button.category) {
        setUpdatedCat(Info.button.category)
      }
      else {
        setUpdatedCat([])
      }
      if(Info.button.tags) {
        setUpdatedTags(Info.button.tags)
      }
      else {
        setUpdatedTags([]);
      }
    }, [Info])

    const addCategory = (text: string) => {
      console.log('adding category')
      if(Info && text) {
        let newCat: string[] = [""]
        if(updatedCat.length>0) {
          newCat = [...updatedCat, text]
        }
        else {
          newCat = [text]
        }

      const updates: Partial<Activity> = {
        //first turn input value into unix. Create function for this. 
        button: {
          text: Info.button.text,
          keywords: Info.button.keywords,
          iconLibrary: Info.button.iconLibrary,
          icon: Info.button.icon,
          pressed: false,
          tags: Info.button.tags,
          category: newCat,
          movementIntensity: Info.button.movementIntensity
        },
      };
      updateActivity(Info, updates)
      setUpdatedCat(prevCat => {
        
        const prev = prevCat.some(cat => cat === text)
        if(prev) {
          alert("duplicate")
        }
        return prev ? prevCat : [...prevCat, text]
      })
       }
    }

    const onDelete = (text: string) => {
      console.log("To delete: ", text, "Current cat: ", Info.button.category)
      let newCat=[""]
      if(updatedCat.length>0) {
        newCat = updatedCat.filter(cat => cat!==text)

      }
      console.log(newCat)
      const updates: Partial<Activity> = {
        //first turn input value into unix. Create function for this. 
        button: {
          text: Info.button.text,
          keywords: Info.button.keywords,
          iconLibrary: Info.button.iconLibrary,
          icon: Info.button.icon,
          pressed: false,
          tags: Info.button.tags,
          category: newCat
        },
      };
      updateActivity(Info, updates)
      setUpdatedCat(newCat)
      
    }
    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={ActivityDescribeVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={onTapOut}>
            <View style={styles.MultitaskModalOverlay}>
            <TouchableWithoutFeedback>
                <View style={styles.ActivityDescribeModalContent}>
                  <View style={styles.titleContainer}>
                    <ThemedText type="title">Activity Info</ThemedText>
                  </View>
                {Info ? 
                <ActivityItem activity={Info} updatedTags={updatedTags} movementIntensity={movementIntensity} setMovementIntensity={setMovementIntensity} updatedCat={updatedCat} setUpdatedTags={setUpdatedTags} updateActivity={updateActivity} onTap={() => alert("Not Pressable")}/> : 
                <Text>Invalid Activity</Text>}
                <CategoryBar current={updatedCat} onPress={addCategory} deleteCat={onDelete}/>
                <View style={styles.nextContainer}>
                  <Button title="Next" style={styles.nextButton} onPress={() => {handleSubmitTags(); onClose()}} />
                </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}
interface TagDropdownProps {
  tagValue: string;
  setTagValue: React.Dispatch<React.SetStateAction<string>>;
}
const TagDropdown: React.FC<TagDropdownProps> = ({ tagValue, setTagValue }) => {
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
      value={tagValue}
      onValueChange={(value) => setTagValue(value)}
      items={tags}
    />
  );
};
const styles = StyleSheet.create({
    MultitaskModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      ActivityDescribeModalContent: {
        flex: 0.5,
        width: width/1.1,
        height: height/2,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      titleContainer: {
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center'
      },
      
      activityName: {
        // flex: 3,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkcyan'
      },
      exerciseSection: {
        marginTop: 'auto'
      },
      categoryContainer: {
        flexDirection: 'row',
        
      },
      category: { 
        fontSize: 15,
        color: 'red',
        marginHorizontal: 5

      },
      tagContainer: {
        marginLeft: 'auto'
      },
      tags: {
        fontSize: 12, 
        color: 'black'
      },
      
      listContent: {
        paddingHorizontal: 20,
      },
      activityContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        // alignItems: 'center',
      },
      rowContainer: {
        flexDirection: 'row',
      },
      tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      minusIcon: {
        marginLeft: 8,
      },
      addButton: {
        marginTop: 8,
      },
      detailsContainer: {
        flexDirection: 'row',
        flex: 1, // Allows this section to take up the remaining space
      },
      name: {
        // flexDirection: 'row',
        // marginRight: 30,
          flexShrink: 1,
      },
      nextContainer: {
        left: ((width/1.1) / 2) - (buttonWidth / 2), // Center horizontally more precisely
        marginTop: 'auto'
      },
      slider: {
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          height: 40,
      },
      nextButton: {
        paddingTop: 10,
        width: buttonWidth,
      }
})

const androidCustom = StyleSheet.create({
  dropdownContainer: {
    height: height/6, // Adjust this value as needed
    width: '100%', // Or a fixed width if required
    overflow: 'hidden', // Ensures dropdown content does not spill outside
    padding: 10, // Optional padding
  },
})
export default ActivityDescribeModal;