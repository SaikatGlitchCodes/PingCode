import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();
  
  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/sign-in" />;
}
