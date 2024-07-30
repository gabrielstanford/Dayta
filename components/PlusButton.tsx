import {Link} from 'expo-router'
import {Pressable, Text, Dimensions} from 'react-native'
import {ThemedText} from './ThemedText'
import AntDesign from '@expo/vector-icons/AntDesign';


export default function PlusButton() {
const {width} = Dimensions.get('window');

return(
<Link href="/"
asChild>
 <Pressable>
    <AntDesign name="pluscircle" size={width/6.25} color="black" />
 </Pressable>
</Link>
);

}