import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function CalendarInformation() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<any[]>([]); // Change to array for FlatList

  useEffect(() => {
    if (authToken) {
      axios
        .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((res) => {
          setCalendarData(res.data.items); // Set the events data for FlatList
        })
        .catch((error) => {
          console.error('Error fetching calendar data:', error);
        });
    }
  }, [authToken]);

  // Render function for each calendar event item
  const renderItem = ({ item }: { item: any }) => {
    const { summary, start, end } = item;
    const startDate = start?.dateTime || start?.date;
    const endDate = end?.dateTime || end?.date;

    return (
      <View style={styles.item}>
        <Text style={styles.title}>{summary || 'No Title'}</Text>
        <Text style={styles.dates}>
          Start: {startDate || 'No Start Date'} | End: {endDate || 'No End Date'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {calendarData.length > 0 ? (
        <FlatList
          data={calendarData} // The array of calendar events
          keyExtractor={(item) => item.id} // Unique key for each item
          renderItem={renderItem} // Render each item using the render function
        />
      ) : (
        <Text>No events to display</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 14,
    color: '#555',
  },
});
