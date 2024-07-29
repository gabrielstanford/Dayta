// app/utils/firestore.ts
import { firestore } from '@/firebase/firebase';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Function to create or update a user document
export const saveUserData = async (userId: string, data: Record<string, any>) => {
  try {
    await setDoc(doc(firestore, 'users', userId), data, { merge: true });
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Function to get user data
export const getUserData = async (userId: string) => {
  try {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
  }
};

// Function to update user data
export const updateUserData = async (userId: string, data: Record<string, any>) => {
  try {
    await updateDoc(doc(firestore, 'users', userId), data);
  } catch (error) {
    console.error('Error updating user data:', error);
  }
};

// Function to delete user data
export const deleteUserData = async (userId: string) => {
  try {
    await deleteDoc(doc(firestore, 'users', userId));
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
};
