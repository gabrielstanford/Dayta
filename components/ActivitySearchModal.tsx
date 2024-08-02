// ActivitySearch.tsx
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Modal, Dimensions, TouchableWithoutFeedback , TouchableOpacity} from 'react-native';
import { SearchBar } from '@rneui/themed';
import {FlippedActivityButtons} from '@/Data/ActivityButtons'

const {width, height} = Dimensions.get("window");
type ButtonState = {
  text: string;
  iconLibrary: string;
  icon: string;
  pressed: boolean;
  id?: string;
};
interface SearchProps  {
  visible: boolean;
  onClose: () => void;
  onClick: (text: string) => void;
}
const ActivitySearchModal: React.FC<SearchProps> = ({visible, onClose, onClick}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ButtonState[]>(FlippedActivityButtons);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setResults(FlippedActivityButtons);
    } else {
      const filteredResults = FlippedActivityButtons.filter(activity =>
        activity.text.toLowerCase().includes(text.toLowerCase()) ||
        activity.keywords.some(keyword => keyword.toLowerCase().includes(text.toLowerCase()))
      );
      setResults(filteredResults);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(FlippedActivityButtons);
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
        <SearchBar
          placeholder="Search activities"
          value={query}
          onChangeText={handleSearch}
          onClear={clearSearch}
          platform="default" // Adjust to your platform, e.g., "ios" or "android"
          round
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
        />
        
        <FlatList
          data={results}
          keyExtractor={(item) => item.text}
          style={styles.flatList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onClick(item.text)}>
            <View style={styles.resultContainer}>
              
                <Text style={styles.resultText}>{item.text}</Text>
              
            </View>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
        />
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
    flex: 0.5,
    width: width/1.1,
    height: height/2,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInputContainer: {
    backgroundColor: '#fff',
  },
  searchBarInput: {
    fontSize: 16,
  },
  flatList: {
    flex: 1,
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
  resultText: {

    padding: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ActivitySearchModal;
