// ActivitySearch.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Modal, Dimensions, TouchableWithoutFeedback , TouchableOpacity} from 'react-native';
import { SearchBar } from '@rneui/themed';
import {ButtonState} from '@/Types/ActivityTypes'
import {useAppContext} from '@/contexts/AppContext'

const {width, height} = Dimensions.get("window");

interface SearchProps  {
  visible: boolean;
  onClose: () => void;
  speel: string;
}
const RecDescribeModal: React.FC<SearchProps> = ({visible, onClose, speel}) => {
  // console.log('Did activity search find it ', customActivities.filter((button: ButtonState) => button.text==="Runnana"))
  const {customActivities} = useAppContext();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ButtonState[]>(customActivities);

  useEffect(() => {
    setResults(customActivities);
  }, [customActivities])
  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setResults(customActivities);
    } else {
      const filteredResults = results.filter((activity: ButtonState) =>
        activity.text.toLowerCase().includes(text.toLowerCase()) ||
        activity.keywords.some(keyword => keyword.toLowerCase().includes(text.toLowerCase()))
      );
      setResults(filteredResults);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(customActivities);
  };

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
            <Text>{speel}</Text>
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