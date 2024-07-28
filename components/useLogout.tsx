// app/utils/logout.ts
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(getAuth());
      router.replace('/loginscreen'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed', error);
      // Handle errors here (e.g., show an alert or toast)
    }
  };

  return logout;
};
