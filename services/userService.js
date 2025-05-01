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
  console.log('Creating initial profile for user:', userId);
  const initialProfile = {
    uuid: userId,
    email,
    displayName: email.split('@')[0],
    photoURL: null,
    bio: '',
    interests: [],
    connections: [],
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  
  return updateUserProfile(userId, initialProfile);
};

/**
 * Add a user to current user's connections
 * @param {string} currentUserId - ID of the current user
 * @param {string} connectionUserId - ID of the user to add as a connection
 * @returns {Promise<Object>} - Result of the operation
 */
export const addUserConnection = async (currentUserId, connectionUserId) => {


  try {
    // Don't allow adding self as connection
    if (currentUserId === connectionUserId) {
      return { success: false, error: 'Cannot add yourself as a connection' };
    }
    
    // Check if connection user exists
    const connectionDoc = await usersCollection().doc(connectionUserId).get();
    if (!connectionDoc.exists) {
      return { success: false, error: 'User does not exist' };
    }
    
    // Update the current user's connections array using arrayUnion to avoid duplicates
    await usersCollection().doc(currentUserId).update({
      connections: firestore.FieldValue.arrayUnion(connectionUserId),
      lastUpdated: firestore.FieldValue.serverTimestamp()
    });

    // Update the connection user's
    await usersCollection().doc(connectionUserId).update({
      connections: firestore.FieldValue.arrayUnion(currentUserId),
      lastUpdated: firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Added ${connectionUserId} to ${currentUserId}'s connections`);
    return { 
      success: true, 
      message: 'Connection added successfully' 
    };
  } catch (error) {
    console.error('Error adding user connection:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a user from current user's connections
 * @param {string} currentUserId - ID of the current user
 * @param {string} connectionUserId - ID of the user to remove from connections
 * @returns {Promise<Object>} - Result of the operation
 */
export const removeUserConnection = async (currentUserId, connectionUserId) => {
  try {
    await usersCollection().doc(currentUserId).update({
      connections: firestore.FieldValue.arrayRemove(connectionUserId),
      lastUpdated: firestore.FieldValue.serverTimestamp()
    });
    
    return { 
      success: true, 
      message: 'Connection removed successfully' 
    };
  } catch (error) {
    console.error('Error removing user connection:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all connections for a user with their full profiles
 * Optimized version with better querying and optional real-time updates
 * 
 * @param {string} userId - ID of the user
 * @param {Object} options - Optional parameters
 * @param {number} options.limit - Max number of connections to fetch (pagination)
 * @param {function} options.onUpdate - Callback for real-time updates
 * @returns {Promise<Object>} - Result with array of connection profiles
 */
export const getUserConnections = async (userId, options = {}) => {
  try {
    const { limit = 50, onUpdate } = options;
    
    // If real-time updates are requested, return a subscription
    if (onUpdate && typeof onUpdate === 'function') {
      const unsubscribe = usersCollection().doc(userId)
        .onSnapshot(async (doc) => {
          if (!doc.exists) {
            onUpdate({ success: false, error: 'User not found' });
            return;
          }
          
          const userData = doc.data();
          const connections = userData.connections || [];
          
          if (connections.length === 0) {
            onUpdate({ success: true, connections: [] });
            return;
          }
          
          // Use "in" query operator to get all connections in a single query
          const connectionDocs = await usersCollection()
            .where('uuid', 'in', connections.slice(0, Math.min(connections.length, 10)))
            .get();
            
          const profiles = connectionDocs.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          onUpdate({ success: true, connections: profiles });
        }, error => {
          console.error('Connection listener error:', error);
          onUpdate({ success: false, error: error.message });
        });
        
      return { success: true, unsubscribe };
    }
    
    // One-time fetch logic
    const userDoc = await usersCollection().doc(userId).get();
    
    if (!userDoc.exists) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data();
    const connections = userData.connections || [];
    
    if (connections.length === 0) {
      return { success: true, connections: [] };
    }
    
    // Batch the connections in groups of 10 (Firestore "in" query limit)
    const profiles = [];
    const batchSize = 10;
    
    for (let i = 0; i < connections.length; i += batchSize) {
      const batch = connections.slice(i, i + batchSize);
      
      // Use "in" query to fetch multiple docs in one query
      const batchDocs = await usersCollection()
        .where('uuid', 'in', batch)
        .limit(limit)
        .get();
        
      profiles.push(...batchDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      
      // Stop if we've reached the limit
      if (profiles.length >= limit) break;
    }
    
    return { success: true, connections: profiles };
    
  } catch (error) {
    console.error('Error fetching user connections:', error);
    return { success: false, error: error.message };
  }
};
