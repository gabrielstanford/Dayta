import {useAppContext, AppProvider} from '@/contexts/AppContext'
import {ButtonState} from '@/Types/ActivityTypes'
import {useAuth} from '@/contexts/AuthContext'
import {Dispatch, SetStateAction, useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput} from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import RNPickerSelect from 'react-native-picker-select'

const {width, height} = Dimensions.get("window");
const buttonWidth = width/5;
const buttonHeight = height/19;
const titleWidth = width/1.5;


function Logic() {
    const {addCustomActivity} = useAppContext();
    const {user} = useAuth();
    const [inputText, setInputText] = useState<string>("filler")
    const [tagValue, setTagValue] = useState<string[]>([""])

    const [newButton, setNewButton] = useState<ButtonState>()
   
    const handleInputChange = (text: string) => {
        setInputText(text); 
       };

    const handleSubmit = () => {
        if(inputText.length>3 && tagValue.length>0) {
        const newButton = {text: inputText,  iconLibrary: "materialIcons", icon: "more-horiz", keywords: ['Miscellaneous'], pressed: false, tags: tagValue}
        addCustomActivity(newButton);
        alert("successfully added custom activity. feel free to use it now as often as you'd like!")
        }
        else {
        alert("invalid input")
        }
    }
    return (
        <>
        <View style={styles.modalOverlay}>
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <ThemedText type="titleText">Quick Add</ThemedText>
            </View>
            </View>
          <View style={styles.quickAddContainer}>
            <View style={styles.textSection}>
            <TextInput value={inputText} 
                onChangeText={handleInputChange}
                maxLength={30}
                keyboardType="default" 
                // onSubmitEditing={() => handleSubmit(newButton)}
                returnKeyType="done"
                style={styles.textInputContainer}
            />
            </View>
            <View style={styles.tagSection}>
            <TagDropdown setTagValue={setTagValue}/>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.closeButton}>
            <View style={styles.buttonContainer}>
              <Text style={{fontSize: 21, color: 'white'}}>Create Activity</Text>
          </View>
          </TouchableOpacity>
        </View>
        </>
    )
}

interface TagDropdownProps {
    setTagValue: Dispatch<SetStateAction<string[]>>;
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
      { label: 'Helping Others', value: 'Helping Others' },

      { label: 'Other', value: 'Other' },
    ]
    return (
      <RNPickerSelect
        onValueChange={(value) => setTagValue([value])}
        items={tags}
      />
    );
  };

const Personalize: React.FC = () => {
    return (
      <AppProvider>
        <Logic />
      </AppProvider>
    );
  };
  
  export default Personalize;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'darkcyan',
      paddingTop: height/18,
      position: 'relative'
    },
      headerSection: {
        flex: 1.5,
        flexDirection: 'row',
        position: 'relative'
      },
     titleContainer: {
      flex: 1,
      padding: 10,
      width: titleWidth,
      position: 'absolute',
      alignItems: 'center',
      left: (width / 2) - (titleWidth / 2), // Center horizontally more precisely
    },
    buttonTextContainer: {
      flex: 1,
      alignItems: 'flex-start'
    },
    quickAddContainer: {
      flex: 7,
      alignItems: 'center',
    },
    textSection: {
        flex: 1,
        flexDirection: 'row'
    },
    tagSection: {
        flex: 1,
        flexDirection: 'row'

    },
    buttonContainer: {
        alignItems: 'center',
        padding: 10
      },
      closeButton: {
        width: buttonWidth,
        height: buttonHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#b4245c',
      },
    textInputContainer: {
     backgroundColor: 'white',
     width: 100,
     height: 50
    },
  });