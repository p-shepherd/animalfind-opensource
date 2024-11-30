// utils/auth.js
import auth from '@react-native-firebase/auth';

export const getIdToken = async () => {
  const user = auth().currentUser;

  if (!user) {
    throw new Error('No authenticated user found');
  }

  return await user.getIdToken();
};
