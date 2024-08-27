// ActivitySearch.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Modal, Dimensions, TouchableWithoutFeedback , TouchableOpacity} from 'react-native';
import { SearchBar } from '@rneui/themed';
import {ButtonState} from '@/Types/ActivityTypes'
import {useAppContext} from '@/contexts/AppContext'
import { getSunriseSunset } from '@/utils/DateTimeUtils';
import { decimalToTime } from '@/utils/DateTimeUtils';
import {Activity} from '@/Types/ActivityTypes'

const {width, height} = Dimensions.get("window");

interface SearchProps  {
  visible: boolean;
  onClose: () => void;
  remove: (activity: Activity) => void;
  otherArray: Activity[];
}
const RecDescribeModal: React.FC<SearchProps> = ({visible, onClose, remove, otherArray}) => {

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
            
        {/* <FlatList 
        data={withSunriseSunset}
        renderItem={({ item }) => <ActivityItem activity={item} onRemove={remove}/>}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        /> */}
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
      
})


export default RecDescribeModal;