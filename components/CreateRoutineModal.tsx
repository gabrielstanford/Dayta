import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Platform, TouchableOpacity, Keyboard, KeyboardAvoidingView} from 'react-native'
import {ThemedText} from './ThemedText'
import CustomButton from './CustomButton'
import TimeDropdown from './TimeDropdown'
import {useState, useEffect} from 'react'
import Slider from '@react-native-community/slider';
import {useAppContext} from '@/contexts/AppContext'
import {useAuth} from '@/contexts/AuthContext'
import FetchDayActivities from '@/Data/FetchDayActivities'
import ActivitySearchModal from './ActivitySearchModal'
import { SearchBar } from '@rneui/themed'
import TimeInput from './TimeInput'
import { create } from 'react-test-renderer'
import RNPickerSelect from 'react-native-picker-select'

const {width, height} = Dimensions.get("window");
const buttonWidth = width*0.6
  
  interface MultitaskModalProps extends ModalProps {
    MultitaskModalVisible: boolean;
    onNext: (text: [string, number, number][]) => void;
    onTapOut: () => void;
  }

  function timeStringToSeconds(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
  
    const totalSeconds = (hours * 3600) + (minutes * 60);
    return totalSeconds;
  }

const CreateRoutineModal: React.FC<MultitaskModalProps> = ({ MultitaskModalVisible, onNext, onTapOut, ...modalProps }) => {

  const [multiSearchVisible, setMultiSearchVisible] = useState(false);
  const [activityNum, setActivityNum] = useState<number>(1)
  const [activityOne, setActivityOne] = useState<string>("Activity One")
  const [durationOne, setDurationOne] = useState<string>("00:10");
  const [tagValue, setTagValue] = useState<string>("Consecutive")
  const [gapBetween1, setGapBetween1] = useState<string>("00:01");
  const [activityTwo, setActivityTwo] = useState<string>("Activity Two")
  const [durationTwo, setDurationTwo] = useState<string>("00:10");
  const [tag2Value, setTag2Value] = useState<string>("Consecutive")
  const [gapBetween2, setGapBetween2] = useState<string>("00:01");
  const [activityThree, setActivityThree] = useState<string>("Activity Three")
  const [durationThree, setDurationThree] = useState<string>("00:10");
  const [gapBetween3, setGapBetween3] = useState<string>("00:01");
  const [tag3Value, setTag3Value] = useState<string>("Consecutive")
  const [activityFour, setActivityFour] = useState<string>("Activity Four")
  const [durationFour, setDurationFour] = useState<string>("00:10");

  // const [tag4Value, setTag4Value] = useState<string>("Consecutive")

  const multiSearchPress = (text: string) => {

        if(activityNum==1) {
            setActivityOne(text)
        }
        if(activityNum==2) {
            setActivityTwo(text)
        }
        if(activityNum==3) {
            setActivityThree(text)
        }
        if(activityNum==4) {
            setActivityFour(text)
        }
        setMultiSearchVisible(false);
    }

    const createFull: () => [string, number, number][] = () => {
      const durOne =  timeStringToSeconds(durationOne);
      const durTwo =  timeStringToSeconds(durationTwo);
      const durThree =  timeStringToSeconds(durationThree);

      let durBetweenOne: number = timeStringToSeconds(gapBetween1);
      let durBetweenTwo: number = timeStringToSeconds(gapBetween2);
      let durBetweenThree: number = timeStringToSeconds(gapBetween3);

        if(tagValue=="Overlapping") {
          durBetweenOne = -durOne
        }

        if(tag2Value=="Overlapping") {
          durBetweenTwo = -durTwo
        }

        if(tag3Value=="Overlapping") {
          durBetweenTwo = -durThree
        }

        return [[activityOne, durOne, durBetweenOne], [activityTwo, durTwo, durBetweenTwo], [activityThree, durThree, durBetweenThree], [activityFour, timeStringToSeconds(durationFour), 0]]
    }
  
    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={MultitaskModalVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={onTapOut}>
            <View 
            style={styles.MultitaskModalOverlay}>
            
            <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView 
            style={styles.MultitaskModalContent}
            // enabled={false}
            keyboardVerticalOffset={250}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // contentContainerStyle={styles.contContStyle}
            >
            {/* <View style={styles.MultitaskModalContent}> */}
                  <View style={styles.titleContainer}>
                    <ThemedText type="title"> Select Activities </ThemedText>
                  </View>
                <View style={styles.stepContainer}>
                  <TouchableOpacity style={styles.actSearchButton} onPress={() => {setActivityNum(1); setMultiSearchVisible(true)}}>
                        <Text>{activityOne}</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <TimeInput custom={"Type1"} time={durationOne} onTimeChange={setDurationOne}/>
                  </View>
                </View>
                <View style={styles.intraStepContainer}>
                  <TagDropdown tagValue={tagValue} setTagValue={setTagValue} />
                  {tagValue=='Gap Between' ? <TimeInput custom={"Type2"} time={gapBetween1} onTimeChange={setGapBetween1}/> : <></>}
                </View>
                <View style={styles.stepContainer}>
                  <TouchableOpacity style={styles.actSearchButton} onPress={() => {setActivityNum(2); setMultiSearchVisible(true)}}>
                        <Text>{activityTwo}</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <TimeInput custom={"Type1"} time={durationTwo} onTimeChange={setDurationTwo}/>
                  </View>
                </View>
                <View style={styles.intraStepContainer}>
                  <TagDropdown tagValue={tag2Value} setTagValue={setTag2Value} />
                  {tag2Value=='Gap Between' ? <TimeInput custom={"Type2"} time={gapBetween2} onTimeChange={setGapBetween2}/> : <></>}
                </View>
                <View style={styles.stepContainer}>
                  <TouchableOpacity style={styles.actSearchButton} onPress={() => {setActivityNum(3); setMultiSearchVisible(true)}}>
                        <Text>{activityThree}</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <TimeInput custom={"Type1"} time={durationThree} onTimeChange={setDurationThree}/>
                  </View>
                </View>
                <View style={styles.intraStepContainer}>
                  <TagDropdown tagValue={tag3Value} setTagValue={setTag3Value} />
                  {tag3Value=='Gap Between' ? <TimeInput custom={"Type2"} time={gapBetween3} onTimeChange={setGapBetween3}/> : <></>}
                </View>
                <View style={styles.stepContainer}>
                  <TouchableOpacity style={styles.actSearchButton} onPress={() => {setActivityNum(4); setMultiSearchVisible(true)}}>
                        <Text>{activityFour}</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <TimeInput custom={"Type1"} time={durationFour} onTimeChange={setDurationFour}/>
                  </View>
                </View>
                {/* <View style={styles.intraStepContainer}>
                  <TagDropdown tagValue={tag4Value} setTagValue={setTag4Value} />
                </View> */}
                <ActivitySearchModal visible={multiSearchVisible} onClick={multiSearchPress} onClose={() => setMultiSearchVisible(false)} />

            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            <View style={styles.nextContainer}>
                  <CustomButton title="Next" onPress={() => onNext(createFull())} />
              </View>
            </View>
          
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

interface TagDropdownProps {
  tagValue: string;
  setTagValue: React.Dispatch<React.SetStateAction<string>>;
}
const TagDropdown: React.FC<TagDropdownProps> = ({tagValue, setTagValue}) => {
  const tags = [
    {label: "Consecutive", value: "Consecutive"},
    {label: "Overlapping", value: "Overlapping"},
    {label: "Gap Between", value: "Gap Between"}
  ];
  return (
    <View style={{borderColor: 'grey', borderWidth: 1, borderRadius: 20, padding: 3}}>
    <RNPickerSelect
      value={tagValue}
      onValueChange={(value) => setTagValue(value)}
      items={tags}
    />
    </View>
  );
};

const styles = StyleSheet.create({
    MultitaskModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      MultitaskModalContent: {
        flex: 0.67,
        width: width/1,
        height: height,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      titleContainer: {
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center'
      },
      stepContainer: {
        // flex: .7,
        flexDirection: 'row',
        alignItems: 'center',
      },
      intraStepContainer: {
        
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      actSearchButton: {
        backgroundColor: '#DDDDDD',
        padding: 20,
        flex: 1
      },

      nextContainer: {
        alignItems: 'center'
        // left: ((width) / 2) - (buttonWidth / 2), // Center horizontally more precisely
      },
})

const androidCustom = StyleSheet.create({
  dropdownContainer: {
    height: height/6, // Adjust this value as needed
    width: '100%', // Or a fixed width if required
    overflow: 'hidden', // Ensures dropdown content does not spill outside
    padding: 10, // Optional padding
  },
})
export default CreateRoutineModal;