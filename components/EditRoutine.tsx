// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
// import { Routine, Activity } from '@/Types/ActivityTypes'; // Adjust import based on your file structure
// import { timeStringToSeconds } from '@/utils/DateTimeUtils'; // Adjust import based on your file structure
// import uuid from 'react-native-uuid'

// interface RoutineEditorProps {
//   routine: Routine;
//   onSave: (routine: Routine) => void;
//   onCancel: () => void;
// }

// const RoutineEditor: React.FC<RoutineEditorProps> = ({ routine, onSave, onCancel }) => {
//   const [editableRoutine, setEditableRoutine] = useState<Routine>(routine);

//   const handleActivityChange = (index: number, updatedActivity: Activity) => {
//     const updatedActivities = [...editableRoutine.activities];
//     updatedActivities[index] = updatedActivity;
//     setEditableRoutine({
//       ...editableRoutine,
//       activities: updatedActivities
//     });
//   };

//   const handleAddActivity = () => {
//     const newActivity: Activity = {
//       id: uuid.v4() as string,
//       button: { text: '', icon: '' }, // Adjust based on your ButtonState structure
//       timeBlock: { startTime: 0, duration: 0, endTime: 0 }
//     };
//     setEditableRoutine({
//       ...editableRoutine,
//       activities: [...editableRoutine.activities, newActivity]
//     });
//   };

//   const handleRemoveActivity = (index: number) => {
//     const updatedActivities = editableRoutine.activities.filter((_, i) => i !== index);
//     setEditableRoutine({
//       ...editableRoutine,
//       activities: updatedActivities
//     });
//   };

//   const handleSave = () => {
//     onSave(editableRoutine);
//   };

//   const renderItem = ({ item, index }: { item: Activity; index: number }) => (
//     <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//       <TextInput
//         value={item.button.text}
//         onChangeText={(text) => handleActivityChange(index, { ...item, button: { ...item.button, text } })}
//         style={{ flex: 1 }}
//       />
//       <TextInput
//         value={item.timeBlock.duration.toString()}
//         onChangeText={(text) => handleActivityChange(index, { ...item, timeBlock: { ...item.timeBlock, duration: timeStringToSeconds(text) } })}
//         style={{ flex: 1 }}
//         keyboardType="numeric"
//       />
//       {index < editableRoutine.activities.length - 1 && (
//         <TextInput
//           value={editableRoutine.durationBetween ? editableRoutine.durationBetween[index].toString() : '0'}
//           onChangeText={(text) => {
//             const updatedDurationBetween = [...editableRoutine.durationBetween!];
//             updatedDurationBetween[index] = timeStringToSeconds(text);
//             setEditableRoutine({ ...editableRoutine, durationBetween: updatedDurationBetween });
//           }}
//           style={{ flex: 1 }}
//           keyboardType="numeric"
//         />
//       )}
//       <TouchableOpacity onPress={() => handleRemoveActivity(index)}>
//         <Text>🗑️</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={{ padding: 20 }}>
//       <FlatList
//         data={editableRoutine.activities}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//       />
//       <Button title="Add Activity" onPress={handleAddActivity} />
//       <Button title="Save" onPress={handleSave} />
//       <Button title="Cancel" onPress={onCancel} />
//     </View>
//   );
// };

// export default RoutineEditor;
