// ActivitySearch.tsx
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { SearchBar } from '@rneui/themed';

interface Activity {
  id: number;
  name: string;
  keywords: string[];
}

const activities: Activity[] = [
  { id: 1, name: 'Run', keywords: ['jog', 'sprint', 'dash'] },
  { id: 2, name: 'Walk', keywords: ['stroll', 'amble', 'saunter'] },
  // more activities...
];

const ActivitySearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Activity[]>(activities);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setResults(activities);
    } else {
      const filteredResults = activities.filter(activity =>
        activity.name.toLowerCase().includes(text.toLowerCase()) ||
        activity.keywords.some(keyword => keyword.toLowerCase().includes(text.toLowerCase()))
      );
      setResults(filteredResults);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(activities);
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.resultText}>{item.name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
    borderWidth: 3,
    borderColor: 'yellow'
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
    padding: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ActivitySearch;
