// ActivitySearch.tsx
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable } from 'react-native';
import { SearchBar } from '@rneui/themed';
import {FlippedActivityButtons} from '@/Data/ActivityButtons'

type ButtonState = {
  text: string;
  iconLibrary: string;
  icon: string;
  pressed: boolean;
  id?: string;
};
interface SearchProps  {
  onclick: (text: string) => void
}
const ActivitySearch: React.FC<SearchProps> = ({onclick}) => {
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
    <View style={styles.container}>
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
        renderItem={({ item }) => <Pressable onPress={() => onclick(item.text)}><Text style={styles.resultText}>{item.text}</Text></Pressable>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBarContainer: {
    backgroundColor: '#f5f5f5',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInputContainer: {
    backgroundColor: '#fff',
  },
  searchBarInput: {
    fontSize: 16,
  },
  resultText: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ActivitySearch;
