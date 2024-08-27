
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, View } from "react-native";

interface CategoryBarProps {
    onPress: (text: string) => void;
    current: string[];
    deleteCat: (text: string) => void;
  }

const CategoryBar: React.FC<CategoryBarProps> = ({ onPress, deleteCat, current }) => {



    return (
        <View style={styles.categoryBarContainer}>
        <TouchableOpacity onPress={() => {current.includes("sunlight") ? deleteCat("sunlight") : onPress("sunlight")}}>
            <Feather name="sun" size={30}/>
        </TouchableOpacity>
         <TouchableOpacity onPress={() => {current.includes("coffee") ? deleteCat("coffee") : onPress("coffee")}}>
            <Feather name="coffee" size = {30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {current.includes("exercise") ? deleteCat("exercise") : onPress("exercise")}}>
            <MaterialCommunityIcons name="dumbbell" size={30} />
         </TouchableOpacity>
         <TouchableOpacity onPress={() => {current.includes("meditation") ? deleteCat("meditation") : onPress("meditation")}}>
            <MaterialCommunityIcons name="meditation" size={30} />
         </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    }
}
)

export default CategoryBar