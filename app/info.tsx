import {ThemedText} from '@/components/ThemedText'
import { saveUserData, getUserData } from '@/utils/firestore';
import {useAuth} from '@/contexts/AuthContext'
import {useState, useEffect} from 'react'

export default function Info() {
    const [userData, setUserData] = useState<any>(null);
    const {user} = useAuth()
    //fetch user data (e.g. settings data)
    useEffect(() => {
    if (user) {
      // Fetch user data when the component mounts
      getUserData(user.uid).then((data) => {
        if (data) {
          setUserData(data);
        }
      });
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      saveUserData(user.uid, { name: 'John Doe', age: 30 });
    }
  };
  console.log(userData)

  return(
    <>
      {userData ? <ThemedText type="journalText">Age: {userData.age}, Name: {userData.name}</ThemedText> : <ThemedText type="journalText">Add "Data" To Firestore</ThemedText>}
      <ThemedText>Change data... to be implemented for now everyone's john doe</ThemedText>
    </>
  );
}