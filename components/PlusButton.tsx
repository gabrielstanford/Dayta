import {Link} from 'expo-router'
import {Pressable, Text} from 'react-native'

export default function PlusButton() {

return(
<Link href="/journal"
style={{position: 'absolute', bottom: 20, right: 20}}
asChild>
 <Pressable>
   <Text>Add</Text>
 </Pressable>
</Link>
);

}