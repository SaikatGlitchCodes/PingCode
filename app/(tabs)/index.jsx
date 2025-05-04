import React, {useEffect, useState, useCallback} from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { NAV_THEME } from '../../lib/constants';
import { useColorScheme } from '../../contexts/useColorScheme';
import { useAuth } from '../../contexts/AuthContext';
import ProfileImg from '../../components/ProfileImg';
import { getUserChatsWithMessages } from '../../services/chatService';

const Chat = () => {
    const router = useRouter();
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    const [chatData, setChatData] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    
    useEffect(() => {
        const fetchChatData = async () => {
            try {
                setLoading(true);
                console.log('Fetching chat data for user:', user.uid);
                const result = await getUserChatsWithMessages(user.uid);
                
                if (result.success) {
                    setChatData(result.chats || []);
                } else {
                    console.error('Failed to fetch chat data:', result.error);
                    setChatData([]);
                }
            } catch (error) {
                console.error('Error in fetch chat data:', error);
                setChatData([]);
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.uid) {
            fetchChatData();
        }
    }, [user?.uid]);
    
    const navigateToChat = useCallback((userId) => {
        router.push({
            pathname: '/chat',
            params: { userId }
        });
    }, [router]);

    const formatTimestamp = useCallback((timestamp) => {
        if (!timestamp) return '';
        
        const now = new Date();
        const messageDate = new Date(timestamp);
        
        // If today, show time
        if (now.toDateString() === messageDate.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // If within the last week, show day name
        const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
            return messageDate.toLocaleDateString([], { weekday: 'short' });
        }
        
        // Otherwise show date
        return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }, []);
    
    return (
        <SafeAreaView style={{ padding: 20, flex: 1 }}>
            <View className="flex-row items-center justify-between ">
                <Text className="text-xl" style={{ color: themeColor.text }}>Chats</Text>
                {/* <Entypo name="dots-three-horizontal" size={20} color={themeColor.icon} /> */}
            </View>
            
            {loading ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator size="large" color={themeColor.primary} />
                </View>
            ) : (
                <ScrollView className="flex-1">
                    {chatData.length === 0 ? (
                        <View className="items-center justify-center flex-1 py-20">
                            <Text style={{ color: themeColor.textSecondary }}>No chats yet</Text>
                            <Text className="mt-2 text-sm" style={{ color: themeColor.textSecondary }}>
                                Search for users to start chatting
                            </Text>
                        </View>
                    ) : (
                        chatData.map((chat) => (
                            <TouchableOpacity
                                key={chat.userId}
                                className="flex-row items-center py-3 mb-4 gap-x-3 rounded-2xl"
                                style={{
                                    backgroundColor: chat.unreadCount > 0 
                                        ? isDarkColorScheme ? '#1E293B' : '#F0F9FF' 
                                        : 'transparent'
                                }}
                                onPress={() => navigateToChat(chat.userId)}
                            >
                                <ProfileImg userProfile={chat} size="50" />
                                <View className="flex-1">
                                    <View className="flex-row items-center justify-between">
                                        <Text 
                                            className="text-lg font-semibold" 
                                            style={{ color: themeColor.text }}
                                        >
                                            {chat.displayName || 'Unknown User'}
                                        </Text>
                                        
                                        {chat.lastMessageTime && (
                                            <Text className="text-sm" style={{ color: themeColor.text }}>
                                                {formatTimestamp(chat.lastMessageTime)}
                                            </Text>
                                        )}
                                    </View>
                                    
                                    <View className="flex-row items-center justify-between">
                                        <Text 
                                            numberOfLines={1}
                                            className="flex-1 mr-2 text-sm text-white" 
                                            style={{ 
                                                color: chat.unreadCount > 0 ? themeColor.text : themeColor.text,
                                                fontWeight: chat.unreadCount > 0 ? 'bold' : 'normal'
                                            }}
                                        >
                                            {chat.isMyMessage ? 'You: ' : ''}
                                            {chat.lastMessage || 'Start a conversation'}
                                        </Text>
                                        
                                        {chat.unreadCount > 0 && (
                                            <View className="items-center justify-center h-5 px-1 bg-blue-500 rounded-full min-w-5">
                                                <Text className="text-xs font-bold text-white">
                                                    {chat.unreadCount}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

export default Chat;
