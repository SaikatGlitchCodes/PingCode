import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import { Ionicons } from '@expo/vector-icons';
import ProfileImg from '../../components/ProfileImg';
import { getUserByUuid } from '../../services/searchService';
import { useAuth } from '../../contexts/AuthContext';
import { sendMessage, subscribeToMessages, markMessagesAsRead } from '../../services/chatService';

const Chat = () => {
    const { userId } = useLocalSearchParams();
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    const router = useRouter();
    const { userProfile } = useAuth();

    const [chatUser, setChatUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const flatListRef = useRef(null);
    const unsubscribeRef = useRef(null);

    // Load user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userId) {
                    const { users } = await getUserByUuid(userId);
                    if (users && users.length > 0) {
                        setChatUser(users[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    // Subscribe to messages
    useEffect(() => {
        if (!userId || !userProfile?.uuid) return;

        setLoading(true);

        try {
            // Subscribe to messages between both users
            unsubscribeRef.current = subscribeToMessages(
                userProfile.uuid,
                userId,
                (newMessages) => {
                    setMessages(newMessages);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error in message subscription:', error);
                    setLoading(false);
                    setMessages([{
                        id: 'error',
                        text: 'Setting up your chat. Please try again in a moment.',
                        timestamp: Date.now(),
                        isError: true
                    }]);
                }
            );
            markMessagesAsRead(userProfile.uuid, userId);
        } catch (error) {
            console.error('Error setting up message subscription:', error);
            setLoading(false);
        }

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [userId, userProfile?.uuid]);

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !chatUser || !userProfile) return;

        try {
            setSending(true);
            const result = await sendMessage(userProfile.uuid, chatUser.uuid, newMessage.trim());
            if (result.success) {
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    // Render message item
    const renderMessage = ({ item }) => {
        const isCurrentUser = item.senderId === userProfile?.uuid;

        return (

            <View
                style={{
                    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                    backgroundColor: isCurrentUser ? themeColor.chatTextBg : themeColor.border,
                    borderRadius: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginVertical: 4,
                    maxWidth: '80%',
                }}
            >
                <Text style={{ color: 'black' }}>
                    {item.text}
                </Text>
                <Text style={{
                    fontSize: 10,
                    color: themeColor.icon,
                    alignSelf: 'flex-end',
                    marginTop: 4
                }}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView className={`flex-1 p-2 ${Platform.OS === 'android' ? 'pt-16' : ''}`}>
            {/* Header */}
            <View className="flex-row items-center py-2 border-b-[1px] gap-x-5" style={{
                borderBottomColor: themeColor.border
            }}>
                <Ionicons name="arrow-back" size={24} color={themeColor.text} onPress={() => router.push('(tabs)')} />

                {chatUser ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                        <ProfileImg size={40} userProfile={chatUser} />
                        <Text style={{
                            fontSize: 18,
                            color: themeColor.text
                        }}>
                            {chatUser.displayName}
                        </Text>
                    </View>
                ) : (
                    <Text style={{ color: themeColor.text, fontSize: 18 }}>Loading...</Text>
                )}
            </View>

            {/* Messages */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={themeColor.primary_background} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 4 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListEmptyComponent={
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: themeColor.textSecondary }}>
                                No messages yet. Send a message to start chatting.
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Input area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View className="flex-row items-center my-2 border-[1px] p-1 rounded-full" style={{
                    borderColor: themeColor.border
                }}>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        placeholderTextColor={themeColor.textSecondary}
                        style={{
                            flex: 1,
                            backgroundColor: themeColor.background || themeColor.secondary_background,
                            padding: 12,
                            borderRadius: 24,
                            color: themeColor.text,
                            marginRight: 8
                        }}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                        style={{
                            backgroundColor: themeColor.primary_background,
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: sending || !newMessage.trim() ? 0.6 : 1
                        }}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color={themeColor.icon} />
                        ) : (
                            <Ionicons name="send" size={20} color={themeColor.icon} />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Chat;