import firestore from '@react-native-firebase/firestore';

// Collection reference - use proper method chain
const usersCollection = () => firestore().collection('users');

/**
 * Get a user profile by ID
 */
export const getUserProfile = async (userId) => {
  try {
    const doc = await usersCollection().doc(userId).get();
    if (doc.exists) {
      return { success: true, data: doc.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create or update user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    await usersCollection().doc(userId).set(profileData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create initial profile after signup
 */
export const createInitialProfile = async (userId, email) => {
  const initialProfile = {
    email,
    displayName: email.split('@')[0], // Default display name from email
    photoURL: null,
    bio: '',
    interests: [],
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  
  return updateUserProfile(userId, initialProfile);
};