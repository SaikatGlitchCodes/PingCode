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

/**
 * Get all user chats with profiles and last messages
 * @param {string} userId - Current user ID
 * @returns {Promise<Object>} - Object containing chat data with profiles and last messages
 */
export const getUserChatsWithMessages = async (userId) => {
    try {
        // Step 1: Get user connections
        const userDoc = await firestore().collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return { success: false, error: 'User not found' };
        }

        const userData = userDoc.data();
        const connections = userData.connections || [];

        if (connections.length === 0) {
            return { success: true, chats: [] };
        }

        // Step 2: Get all connection profiles
        const profilePromises = connections.map(connectionId =>
            firestore().collection('users').doc(connectionId).get()
        );

        const profileSnapshots = await Promise.all(profilePromises);

        // Step 3: Get last message for each connection
        const chats = await Promise.all(
            profileSnapshots.map(async (profileDoc, index) => {
                if (!profileDoc.exists) return null;

                const connectionId = connections[index];
                const profileData = profileDoc.data();

                // Create chatId using consistent method (sorted user IDs)
                const chatId = [userId, connectionId].sort().join('_');

                // Get the last message between these users
                const lastMessageQuery = await messagesCollection()
                    .where('chatId', '==', chatId)
                    .orderBy('timestamp', 'desc')
                    .limit(1)
                    .get();

                // Format the chat data
                const chatData = {
                    userId: connectionId,
                    uuid: profileData.uuid,
                    displayName: profileData.displayName || 'Unknown User',
                    photoURL: profileData.photoURL,
                    lastMessage: null,
                    lastMessageTime: null,
                    unreadCount: 0
                };

                // Add last message if available
                if (!lastMessageQuery.empty) {
                    const lastMessage = lastMessageQuery.docs[0].data();
                    chatData.lastMessage = lastMessage.text;
                    chatData.lastMessageTime = lastMessage.timestamp?.toDate();
                    chatData.isMyMessage = lastMessage.senderId === userId;
                }

                // Count unread messages
                const unreadQuery = await messagesCollection()
                    .where('chatId', '==', chatId)
                    .where('receiverId', '==', userId)
                    .where('read', '==', false)
                    .get();

                chatData.unreadCount = unreadQuery.size;

                return chatData;
            })
        );

        // Remove any null values (connections that don't exist anymore)
        const validChats = chats.filter(chat => chat !== null);

        // Sort by last message time (most recent first)
        validChats.sort((a, b) => {
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return b.lastMessageTime - a.lastMessageTime;
        });

        return { success: true, chats: validChats };
    } catch (error) {
        console.error('Error fetching user chats with messages:', error);
        return { success: false, error: error.message };
    }
};
