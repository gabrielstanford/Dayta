import {ModalProps, Modal, View, StyleSheet} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'

interface DurationModalProps extends ModalProps {
    durationModalVisible: boolean;
    onClose: () => void;
  }

const DurationModal: React.FC<DurationModalProps> = ({ durationModalVisible, onClose, ...modalProps }) => {

    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={durationModalVisible}
        onRequestClose={onClose}
        {...modalProps}>
            <View style={styles.durationModalOverlay}>
                <View style={styles.durationModalContent}>
                    <ThemedText style={styles.durationModalTitle}>Enter Duration for Activity</ThemedText>
                <Button title="Submit" onPress={onClose} />
            </View>
        </View>
      </Modal>
    );
    
}

const styles = StyleSheet.create({
    durationModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      durationModalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      durationModalTitle: {
        fontSize: 20,
        marginBottom: 20,
      },
})

export default DurationModal;