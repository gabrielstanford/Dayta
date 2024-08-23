import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, FlatList, TouchableOpacity} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import {Activity} from '@/Types/ActivityTypes'

const {width, height} = Dimensions.get("window");
const buttonWidth = width/6.25

  
  interface MultitaskModalProps extends ModalProps {
    ActivityDescribeVisible: boolean;
    Info: Activity[]
    onClose: () => void;
    onTapOut: () => void;
  }
  interface ActivityItemProps {
    activity: Activity;
    onTap: () => void
  }

  const ActivityItem = ({ activity, onTap }: ActivityItemProps) => {

    return (
    <>
      <View style={styles.activityContainer}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={onTap} style={styles.touchableContent}>
            <Text style={styles.activityName}>{activity.button.text} </Text>
          </TouchableOpacity>
        </View>
      </View>
            <View style={styles.activityContainer}>
            <View style={styles.detailsContainer}>
              <TouchableOpacity onPress={onTap} style={styles.touchableContent}>
                <Text style={styles.activityName}>{activity.button.tags} </Text>
              </TouchableOpacity>
            </View>
          </View>
          </>
  );}
const ActivityDescribeModal: React.FC<MultitaskModalProps> = ({ ActivityDescribeVisible, Info, onClose, onTapOut, ...modalProps }) => {

    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={ActivityDescribeVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={onTapOut}>
            <View style={styles.MultitaskModalOverlay}>
            <TouchableWithoutFeedback>
                <View style={styles.ActivityDescribeModalContent}>
                  <View style={styles.titleContainer}>
                    <ThemedText type="title">Activity Info</ThemedText>
                  </View>
                  <FlatList 
                    data={Info}
                    renderItem={({ item }) => <ActivityItem activity={item} onTap={() => alert("Not Pressable")}/>}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    />
                <View style={styles.nextContainer}>
                  <Button title="Next" style={styles.nextButton} onPress={onClose} />
                </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

const styles = StyleSheet.create({
    MultitaskModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      ActivityDescribeModalContent: {
        flex: 0.5,
        width: width/1.1,
        height: height/2,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      titleContainer: {
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center'
      },
      activityName: {
        flex: 3,
        fontSize: 16,
        fontWeight: 'bold',
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
      detailsContainer: {
        flex: 1, // Allows this section to take up the remaining space
      },
      touchableContent: {
        // flexDirection: 'row',
        alignItems: 'center',
      },
      nextContainer: {
        left: ((width/1.1) / 2) - (buttonWidth / 2), // Center horizontally more precisely
        marginTop: 'auto'
      },
      slider: {
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          height: 40,
      },
      nextButton: {
        paddingTop: 10,
        width: buttonWidth,
      }
})

const androidCustom = StyleSheet.create({
  dropdownContainer: {
    height: height/6, // Adjust this value as needed
    width: '100%', // Or a fixed width if required
    overflow: 'hidden', // Ensures dropdown content does not spill outside
    padding: 10, // Optional padding
  },
})
export default ActivityDescribeModal;