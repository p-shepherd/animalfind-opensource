// app/+not-found.js
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';

const NotFoundScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogoutAndRedirect = async () => {
      try {
        await auth().signOut();
        router.replace('/(auth)/index');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
  
    handleLogoutAndRedirect();
  }, []); 
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Redirecting...</Text>
    </View>
  );
};

export default NotFoundScreen;
