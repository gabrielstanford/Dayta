import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, FlatList, TouchableOpacity} from 'react-native'
import {ThemedText} from './ThemedText'
import React, {useState, useEffect} from 'react'
import {Button} from '@rneui/themed'
import {Activity} from '@/Types/ActivityTypes'
import { useAppContext } from '@/contexts/AppContext';
import RNPickerSelect from 'react-native-picker-select'
import { AntDesign } from '@expo/vector-icons';
import CategoryBar from './CategoryBar'
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons'

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
    changeTags: boolean;
    updatedCat: string[];
    setChangeTags: React.Dispatch<React.SetStateAction<boolean>>
    onTap: () => void
  }

  const ActivityItem = ({ activity, updatedCat, changeTags, setChangeTags, updateActivity, onTap }: ActivityItemProps) => {
    const iconMapping: { [key: string]: JSX.Element } = {
      sunlight: <Feather name="sun" style={styles.category} />,
      coffee: <Feather name="coffee" style={styles.category} />,
      exercise: <MaterialCommunityIcons name="dumbbell" style={styles.category} />,
      meditation: <MaterialCommunityIcons name="meditation" style={styles.category} />,
      // Add more categories and corresponding JSX elements here
    };
    if(changeTags == true) {   
      
    const tags = activity.button.tags

    const newTag = "Entertainment"
    const finalTags = [newTag]
    
    const updates: Partial<Activity> = {
      //first turn input value into unix. Create function for this. 
      button: {
        text: activity.button.text,
        keywords: activity.button.keywords,
        iconLibrary: activity.button.iconLibrary,
        icon: activity.button.icon,
        pressed: false,
        tags: finalTags
      },
    };
    updateActivity(activity, updates)
    setChangeTags(false)
    }
    console.log(updatedCat)
    return (
    <>
      <View style={styles.activityContainer}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={onTap} style={styles.touchableContent}>
            <Text style={styles.activityName}>{activity.button.text} </Text>
          </TouchableOpacity>
          <View style={styles.categoryContainer}>
          {updatedCat.length>0 ? updatedCat.map((cat) => (
              <View key={cat}>
                {iconMapping[cat] || <Feather name="help-circle" style={styles.category} />}
              </View>
            )) : <></>}          
          </View>
          <View style={styles.tagContainer}>
          {activity.button.tags.map(tag => <Text key={tag} style={styles.tags}>{tag}</Text>)}
          </View>
        </View>
      </View>

          </>
  );}
const ActivityDescribeModal: React.FC<MultitaskModalProps> = ({ ActivityDescribeVisible, Info, onClose, onTapOut, ...modalProps }) => {

    const {updateActivity} = useAppContext();
    const [changeTags, setChangeTags] = useState(false);
    const startingCat: string[] = Info.button.category ? Info.button.category : []
    const [updatedCat, setUpdatedCat] = useState<string[]>(startingCat as string[]);

    useEffect(() => {
      if(Info.button.category) {
        setUpdatedCat(Info.button.category)
      }
      else {
        setUpdatedCat([])
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
          category: newCat
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
                <ActivityItem activity={Info} changeTags={changeTags} updatedCat={updatedCat} setChangeTags={setChangeTags} updateActivity={updateActivity} onTap={() => alert("Not Pressable")}/> : 
                <Text>Invalid Activity</Text>}
                <CategoryBar current={updatedCat} onPress={addCategory} deleteCat={onDelete}/>
                <View style={styles.nextContainer}>
                  <Button title="Next" style={styles.nextButton} onPress={onClose} />
                </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

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

      categoryContainer: {

      },
      category: { 
        fontSize: 15,
        color: 'red',

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
        flexDirection: 'row',
        // alignItems: 'center',
      },
      detailsContainer: {
        flexDirection: 'row',
        flex: 1, // Allows this section to take up the remaining space
      },
      touchableContent: {
        // flexDirection: 'row',
        // marginRight: 30,
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