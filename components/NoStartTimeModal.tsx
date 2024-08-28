// ActivitySearch.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Modal, Dimensions, TouchableWithoutFeedback , TouchableOpacity} from 'react-native';
import { SearchBar } from '@rneui/themed';
import {ButtonState} from '@/Types/ActivityTypes'
import {useAppContext} from '@/contexts/AppContext'
import { getSunriseSunset } from '@/utils/DateTimeUtils';
import { decimalToTime } from '@/utils/DateTimeUtils';
import {Activity} from '@/Types/ActivityTypes'
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

const {width, height} = Dimensions.get("window");
const buttonWidth = width/6.25

interface SearchProps  {
  visible: boolean;
  onClose: () => void;
  remove: (activity: Activity) => void;
  otherArray: Activity[];
}

interface ActivityItemProps {
  activity: Activity;
  onRemove: (activity: Activity) => void 
}


const ActivityItem = ({ activity, onRemove}: ActivityItemProps) => {

  return (

    <View>

        <View style={styles.activityContainer}>
          {/* <TouchableOpacity onPress={() => onTap(activity)} style={styles.allTouchables}> */}
        {/* <TouchableOpacity onPress={() => onTimeTap(activity)} style={styles.touchableTime}> */}

        {/* </TouchableOpacity> */}
        <View style={styles.touchableActivity}>
          <Text style={styles.activityName}>{activity.button.text}</Text>
          </View>
          <View style={{}}>
            </View>
      <TouchableOpacity onPress={() => onRemove(activity)} style={styles.touchableDelete}>
        <MaterialIcons name="delete" size={width / 15} color="black" />
      </TouchableOpacity>
      {/* </TouchableOpacity> */}
    </View>
    </View>
);}

const NoStartTimeModal: React.FC<SearchProps> = ({visible, onClose, remove, otherArray}) => {

  return (
    
    <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={onClose}
    >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContent}>     
        {otherArray.length==0 ? <View><ThemedText type="default">This is where you can see other activities that don't have a defined start/end time. Use this for activities done throughout the day, or when you don't exactly remember the time when you did an activity but you remember how long you did it for! E.g. throughout the day, you spent about 20 mins texting friends, or about 15 minutes doing dishes at varying times.</ThemedText></View>:
        <FlatList 
        data={otherArray}
        renderItem={({ item }) => <ActivityItem activity={item} onRemove={remove}/>}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        />}
        </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
    
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        flex: 0.65,
        width: width/1.1,
        height: height/1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
       titleContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 15
      },
      layoutContainer: {
        flex: 1,
        paddingTop: height/18,
        backgroundColor: 'darkcyan',
        position: 'relative', // Container must be relative for absolute positioning of child
      },
      contentContainer: {
        flex: 1,
        paddingBottom: height/9, // Space at the bottom to accommodate the button
      },
      headerContainer: {
        marginHorizontal: width/13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      dateContainer: {
        alignItems: 'center'
      },
      incrementButtonContainer: {
        backgroundColor: 'white'
      },
      container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: 20,
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
        alignItems: 'center',
      },
      category: { 
        fontSize: 15,
        color: 'red',
      },
      detailsContainer: {
        flex: 1, // Allows this section to take up the remaining space
      },
      allTouchables: {
        flex: 1,
        flexDirection: 'row',
      },
      touchableActivity: {
        flexShrink: 1,
        marginHorizontal: 10,
      },
      touchableDelete: {
        marginLeft: 'auto'
      },
      touchableTime: {
      
      },
      timeContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // borderColor: 'yellow',
        // borderWidth: 3
      },
      timeText: {
        fontSize: 13,
        flexWrap: 'nowrap',
        color: '#333',
      },
      activityName: {
        flex: 3,
        fontSize: 16,
        fontWeight: 'bold',
      },
      durationModal: {
        flex: 1
      },
      plusButtonContainer: {
          position: 'absolute', // Absolute positioning to overlay everything
          bottom: height/40.6, // Space from the bottom of the container
          left: (width / 2) - (buttonWidth / 2), // Center horizontally more precisely
          width: buttonWidth
      },
      otherButtonContainer: {
        position: 'absolute', // Absolute positioning to overlay everything
        bottom: height/40.6, // Space from the bottom of the container
        left: width-buttonWidth-20, // Center horizontally more precisely
        width: buttonWidth
      },
})



export default NoStartTimeModal;