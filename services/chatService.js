import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Collection reference
const messagesCollection = () => firestore().collection('messages');

/**
 * Send a new message between users
 */
export const sendMessage = async (senderId, receiverId, text) => {
    try {
        // Create a unique chat ID using both user IDs (sorted to ensure consistency)
        const chatId = [senderId, receiverId].sort().join('_');

        await messagesCollection().add({
            chatId,
            senderId,
            receiverId,
            text,
            timestamp: firestore.FieldValue.serverTimestamp(),
            read: false
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Subscribe to messages between two users
 */
// Update the subscribe function:
export const subscribeToMessages = (currentUserId, otherUserId, callback, errorCallback) => {
    // Create a unique chat ID using both user IDs (sorted to ensure consistency)
    const chatId = [currentUserId, otherUserId].sort().join('_');

    try {
        // Create query for messages in this chat, ordered by timestamp
        const unsubscribe = messagesCollection()
            .where('chatId', '==', chatId)
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().getTime() : Date.now()
                }));

                callback(messages);
            }, error => {
                console.error('Error subscribing to messages:', error);
                if (errorCallback) errorCallback(error);
                else callback([]);
            });

        return unsubscribe;
    } catch (error) {
        console.error('Exception in subscription setup:', error);
        if (errorCallback) errorCallback(error);
        return () => { };
    }
};
/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (currentUserId, otherUserId) => {
    try {
        const chatId = [currentUserId, otherUserId].sort().join('_');

        const unreadMessages = await messagesCollection()
            .where('chatId', '==', chatId)
            .where('receiverId', '==', currentUserId)
            .where('read', '==', false)
            .get();

        const batch = firestore().batch();
        unreadMessages.docs.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });

        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error('Error marking messages as read:', error);
        return { success: false, error: error.message };
    }
};

export const fetchUsersYouTexted = async () => {
    const currentUserId = auth().currentUser.uid.slice(0, 5);
    console.log('Current User ID:', currentUserId);
    try {
      // Get all messages where the user is sender or receiver
      const sentSnapshot = await messagesCollection()
        .where('senderId', '==', currentUserId)
        .get();
  
      const receivedSnapshot = await messagesCollection()
        .where('receiverId', '==', currentUserId)
        .get();
  
      // Combine messages and get unique chat IDs
      const allMessages = [...sentSnapshot.docs, ...receivedSnapshot.docs];
      const chatIds = new Set(allMessages.map(doc => doc.data().chatId));
  
      // Extract other user IDs from chatIds
      const otherUserIds = new Set();
      chatIds.forEach(chatId => {
        const [uid1, uid2] = chatId.split('_');
        const otherUid = uid1 === currentUserId ? uid2 : uid1;
        otherUserIds.add(otherUid);
      });
  
      // Fetch profiles of these users
      const profilePromises = Array.from(otherUserIds).map(uid =>
        firestore().collection('users').doc(uid).get()
      );
  
      const profileDocs = await Promise.all(profilePromises);
      const users = profileDocs
        .filter(doc => doc.exists)
        .map(doc => ({ uid: doc.id, ...doc.data() }));
  
      return users;
    } catch (error) {
      console.error('Error fetching chatted users:', error);
      return [];
    }
  };