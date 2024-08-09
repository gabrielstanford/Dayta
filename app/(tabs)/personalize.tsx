import {useAppContext, AppProvider} from '@/contexts/AppContext'
import {ButtonState} from '@/Types/ActivityTypes'
import {useAuth} from '@/contexts/AuthContext'
import {useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput} from 'react-native'
import { ThemedText } from '@/components/ThemedText'

const {width, height} = Dimensions.get("window");
const buttonWidth = width/5;
const buttonHeight = height/19;
const titleWidth = width/1.5;


function Logic() {
    const {addCustomActivity} = useAppContext();
    const {user} = useAuth();
    const [inputText, setInputText] = useState<string>("filler")

    const newButton: ButtonState =  { text: 'Appointment', iconLibrary: "materialIcons", icon: "schedule", keywords: ['Appointment', 'Doctor', 'Blood Test'], pressed: false, tags: ['Other']}

    const handleInputChange = (text: string) => {
        setInputText(text); 
       };

    const handleSubmit = (info: ButtonState) => {

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
        </>
    )
}

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
    textInputContainer: {
     backgroundColor: 'white',
     width: 100,
     height: 50
    },
  });