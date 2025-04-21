import React, { createContext, useState, useContext, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import { getUserProfile, createInitialProfile, updateUserProfile } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
      setUser(currentUser);
      
      if (currentUser) {
        setProfileLoading(true);
        try {
          const profileResult = await getUserProfile(currentUser.uid);
          
          if (profileResult.success) {
            setUserProfile(profileResult.data);
          } else {
            console.log('No profile found, creating one...');
            await createInitialProfile(currentUser.uid, currentUser.email);
            const newProfileResult = await getUserProfile(currentUser.uid);
            if (newProfileResult.success) {
              setUserProfile(newProfileResult.data);
            }
          }
        } catch (error) {
          console.error('Profile loading error:', error);
          setUserProfile({
            displayName: currentUser.email ? currentUser.email.split('@')[0] : 'User',
            email: currentUser.email || '',
            photoURL: null,
            bio: '',
            interests: []
          });
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const result = await auth().signInWithEmailAndPassword(email, password);
      console.log('Sign in successful:', result.user.uid);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const result = await auth().createUserWithEmailAndPassword(email, password);
      await createInitialProfile(result.user.uid, email);
      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await auth().signOut();
      console.log('Sign out successful');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    setProfileLoading(true);
    const result = await updateUserProfile(user.uid, profileData);
    
    if (result.success) {
      setUserProfile(prev => ({ ...prev, ...profileData }));
    }
    
    setProfileLoading(false);
    return result;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FCC600" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile,
      profileLoading,
      signIn, 
      signUp, 
      signOut,
      updateProfile,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};