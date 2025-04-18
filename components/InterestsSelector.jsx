import React, { useState, useEffect, memo } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';

const INTERESTS_STORAGE_KEY = '@user_interests';

// Interest categories with their options
const interestCategories = {
  'Arts & Culture': ['Music', 'Dance', 'Painting', 'Photography', 'Theatre', 'Poetry / Open Mic'],
  'Outdoor & Adventure': ['Hiking / Trekking', 'Camping', 'Nature Walks', 'Stargazing', 'Wildlife Tours'],
  'Health & Wellness': ['Yoga', 'Meditation', 'Fitness Bootcamps', 'Healthy Cooking', 'Mental Health Circles'],
  'Food & Drink': ['Food Festivals', 'Wine / Beer Tasting', 'Home Chef Events', 'Potluck Meetups', 'Cooking Classes'],
  'Tech & Learning': ['Hackathons', 'Startup Meetups', 'Coding Bootcamps', 'AI / Web3 Events', 'Workshops & Seminars'],
  'Gaming & Esports': ['LAN Parties', 'Online Tournaments', 'Game Nights', 'Indie Game Meetups'],
  'Social & Fun': ['Speed Dating', 'Weekend Brunch Clubs', 'Themed Parties', 'Board Game Nights', 'Movie Nights'],
  'Community & Social Good': ['Volunteering', 'Fundraisers', 'Environmental Events', 'Animal Welfare'],
  'Creative & Hobbies': ['DIY / Crafts', 'Writing', 'Calligraphy', 'Origami', 'Gardening'],
  'Travel & Culture': ['Travel Meetups', 'Cultural Exchanges', 'Language Exchange', 'Couchsurfing-style Hangouts']
};

// Category tab component with icon
const CategoryTab = memo(({ category, isActive, onPress, themeMode }) => {
  const colors = NAV_THEME[themeMode].interest;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: isActive ? colors.primary : colors.border,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: isActive ? colors.selectedBg : colors.unselectedBg,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: isActive ? 5 : 2
      }}
    >
      {/* <Text style={{ marginRight: 6 }}>{categoryIcons[category]}</Text> */}
      <Text
        style={{
          color: isActive ? colors.activeText : colors.inactiveText,
          fontWeight: isActive ? '600' : 'normal',
        }}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
});

// Individual interest item component
const InterestItem = memo(({ interest, isSelected, onToggle, themeMode }) => {
  const colors = NAV_THEME[themeMode].interest;
  
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        marginRight: 8,
        marginBottom: 8,
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: isSelected ? colors.selectedBg : colors.unselectedBg,
        borderWidth: isSelected ? 0 : 1,
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          color: isSelected ? colors.activeText : colors.inactiveText,
          fontWeight: isSelected ? '500' : 'normal',
        }}
      >
        {interest}
      </Text>
    </TouchableOpacity>
  );
});

// Toggle header component
const ToggleHeader = memo(({ count, isExpanded, onToggle, themeMode }) => {
  const colors = NAV_THEME[themeMode].interest;
  const themeColor = NAV_THEME[themeMode];
  
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: colors.toggleBg,
        borderWidth: 1,
        borderColor: colors.toggleBorder,
        marginBottom: 12
      }}
    >
      <Text style={{ color: themeColor.text}} className="text-base">
        Interests
      </Text>
      <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16
      }}>
        <Text style={{ 
          color: colors.activeText,
          marginRight: 4,
          fontWeight: '500'
        }}>
          {count} selected
        </Text>
        <Text style={{ color: colors.activeText }}>
          {isExpanded ? '▲' : '▼'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const InterestsSelector = ({ toggle = true }) => {
  const [activeCategory, setActiveCategory] = useState(Object.keys(interestCategories)[0]);
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [showInterests, setShowInterests] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const themeMode = isDarkColorScheme ? "dark" : "light";

  // Load saved interests on mount
  useEffect(() => {
    const loadInterests = async () => {
      try {
        const savedInterests = await AsyncStorage.getItem(INTERESTS_STORAGE_KEY);
        if (savedInterests) {
          setSelectedInterests(new Set(JSON.parse(savedInterests)));
        }
      } catch (error) {
        console.error('Failed to load interests:', error);
      }
    };

    loadInterests();
  }, []);

  // Save interests when they change
  const toggleInterest = async (interest) => {
    const newSelectedInterests = new Set(selectedInterests);

    if (newSelectedInterests.has(interest)) {
      newSelectedInterests.delete(interest);
    } else {
      newSelectedInterests.add(interest);
    }

    setSelectedInterests(newSelectedInterests);

    try {
      await AsyncStorage.setItem(
        INTERESTS_STORAGE_KEY,
        JSON.stringify(Array.from(newSelectedInterests))
      );
    } catch (error) {
      console.error('Failed to save interests:', error);
    }
  };

  // Get selected interests count
  const getSelectedCount = () => {
    return selectedInterests.size;
  };

  return (
    <View>
      {toggle && (
        <ToggleHeader
          count={getSelectedCount()}
          isExpanded={showInterests}
          onToggle={() => setShowInterests(!showInterests)}
          themeMode={themeMode}
        />
      )}

      {showInterests && (
        <View style={{ marginTop: 4, marginBottom: 16 }}>
          {/* Category tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {Object.keys(interestCategories).map((category) => (
              <CategoryTab
                key={category}
                category={category}
                isActive={activeCategory === category}
                onPress={() => setActiveCategory(category)}
                themeMode={themeMode}
              />
            ))}
          </ScrollView>

          {/* Interest items */}
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            marginTop: 12,
            paddingBottom: 8
          }}>
            {interestCategories[activeCategory].map((interest) => (
              <InterestItem
                key={interest}
                interest={interest}
                isSelected={selectedInterests.has(interest)}
                onToggle={() => toggleInterest(interest)}
                themeMode={themeMode}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default InterestsSelector;