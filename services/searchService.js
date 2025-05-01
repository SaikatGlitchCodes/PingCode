import firestore from '@react-native-firebase/firestore';

// Collection reference - use proper method chain
const usersCollection = () => firestore().collection('users');

export const getUserByUuid = async (uuid) => {
    const snapshot = await usersCollection()
        .where('uuid', '==', uuid)
        .get();

    const users = [];
    snapshot.forEach(doc => {
        users.push(doc.data());
    });

    if (users.length === 0) {
        return { success: true, message: 'No user found', users };
    }
    return { success: true, message: 'Multiple users found', users };
};

export const getUserByDisplayName = async (displayName) => {
    const snapshot = await usersCollection()
        .where('displayName', '==', displayName)
        .get();

    const users = [];
    snapshot.forEach(doc => {
        users.push(doc.data());
    });

    if (users.length === 0) {
        return { success: true, message: 'No user found', users };
    }
    return { success: true, message: 'Multiple users found', users };
}