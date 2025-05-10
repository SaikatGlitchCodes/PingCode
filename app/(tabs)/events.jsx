import React, { useState, useEffect } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import EventCard from '../../components/EventCard';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import { Ionicons } from '@expo/vector-icons';

const Events = () => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Simulate API call
                setTimeout(() => {
                    setEvents([
                        {
                            title: "Bonfire Meetup",
                            description: "Chill night with music & food at Koramangala Bangalore lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            type: "private",
                            uuid: "q8x2d7u3",
                            location: {
                                latitude: 12.934,
                                longitude: 77.614,
                                address: "Toit Koramangala, Bangalore"
                            },
                            interests: ["music", "outdoors", "bonfire"],
                            tags: ["chill", "friends"],
                            isPaid: true,
                            price: 299,
                            currency: "INR",
                            maxCapacity: 20,
                            createdBy: "8Ojor2GWY6PFRwmySIqTdZN7A0r1",
                            startTime: "2025-05-05T18:30:00Z",
                            endTime: "2025-05-06T01:00:00Z",
                            status: "active",
                            coverImageUrl: "https://www.shutterstock.com/image-vector/bonfire-night-guy-fawkes-vector-600nw-2204130943.jpg",
                            disableScreenshots: true,
                            allowComments: true,
                            allowQRCheckin: true,
                            interestedUsers: [],
                            joinedUsers: ["8Ojor2GWY6PFRwmySIqTdZN7A0r1", "YuxJZHdWmsXl89Lkc3Z74ZbYUCm1"],
                            paidUsers: ["YuxJZHdWmsXl89Lkc3Z74ZbYUCm1"],
                            photos: [
                                "https://www.sykescottages.co.uk/blog/wp-content/uploads/2019/09/bonfire-resixed.jpg",
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy4uQ7ojkwW8bM2WQgQTa42f-_NZLD0KX_YkA1wdYzTnZG5KOCL6shqnN1y0MwHqqJ7sk&usqp=CAU"
                            ],
                            createdAt: "2025-04-29T10:12:00Z",
                            updatedAt: "2025-04-29T11:00:00Z"
                        },
                        {
                            title: "Bonfire Meetup",
                            description: "Chill night with music & food",
                            type: "private",
                            uuid: "q8x2d7u3",
                            location: {
                                latitude: 12.934,
                                longitude: 77.614,
                                address: "Koramangala, Bangalore"
                            },
                            interests: ["music", "outdoors", "bonfire"],
                            tags: ["chill", "friends"],
                            isPaid: true,
                            price: 299,
                            currency: "INR",
                            maxCapacity: 20,
                            createdBy: "8Ojor2GWY6PFRwmySIqTdZN7A0r1",
                            startTime: "2025-05-05T18:30:00Z",
                            endTime: "2025-05-06T01:00:00Z",
                            status: "active",
                            coverImageUrl: "https://compassohio.com/wp-content/uploads/2024/10/Thursday-Bonfire-Blog-no-logo-1024x1024.jpg",
                            disableScreenshots: true,
                            allowComments: true,
                            allowQRCheckin: true,
                            joinedUsers: ["8Ojor2GWY6PFRwmySIqTdZN7A0r1", "YuxJZHdWmsXl89Lkc3Z74ZbYUCm1"],
                            paidUsers: ["YuxJZHdWmsXl89Lkc3Z74ZbYUCm1"],
                            photos: [
                                "https://www.sykescottages.co.uk/blog/wp-content/uploads/2019/09/bonfire-resixed.jpg",
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy4uQ7ojkwW8bM2WQgQTa42f-_NZLD0KX_YkA1wdYzTnZG5KOCL6shqnN1y0MwHqqJ7sk&usqp=CAU"
                            ],
                            createdAt: "2025-04-29T10:12:00Z",
                            updatedAt: "2025-04-29T11:00:00Z"
                        }
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColor.background }]}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeColor.primary} />
                </View>
            ) : (
                <ScrollView className="flex-1 px-4">
                    <View className="flex-row items-center px-2 border border-gray-400 rounded-full mb-7">
                        <Ionicons name="search" size={23} color={themeColor.text} />
                        <TextInput
                            placeholder="Music event, standUp"
                            placeholderTextColor={themeColor.text}
                            onChangeText={()=>{}}
                            className="block h-12 px-4 text-base border-none"
                            style={{
                                color: themeColor.text,
                            }}
                            autoCapitalize="none"
                            returnKeyType="search"
                            onSubmitEditing={()=>{}}
                        />
                    </View>
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between">
                            <Text className="mb-3 text-lg">Popular Events</Text>
                            <TouchableOpacity > <Text>more</Text> </TouchableOpacity>
                        </View>

                        <FlatList
                            data={events}
                            renderItem={(event) => <EventCard event={event} />}
                            keyExtractor={item => item.uuid}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.eventsList}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={{ color: themeColor.textSecondary }}>No events found</Text>
                                </View>
                            }
                        />
                    </View>
                    <View className="mb-8">
                        <Text className="mb-3 text-lg">NearBy Events</Text>
                        <FlatList
                            data={events}
                            renderItem={(event) => <EventCard event={event} />}
                            keyExtractor={item => item.uuid}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.eventsList}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={{ color: themeColor.textSecondary }}>No events found</Text>
                                </View>
                            }
                        />
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    eventsList: {
        paddingRight: 16,
    },
    themeColor: {
        padding: 20,
        alignItems: 'center',
    },
});

export default Events;
