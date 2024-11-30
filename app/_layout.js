import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import { setRouterRef } from '@/utils/routerRefError'; 

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const segments = useSegments();
  const router = useRouter();


  useEffect(() => {
    if (!__DEV__) {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
    }
  }, []);

 
  useEffect(() => {
    setRouterRef(router);
  }, [router]);

 
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe; 
  }, [initializing]);

  
  useEffect(() => {
    if (initializing) return;

    const isAuthGroup = segments[0] === '(auth)';

    if (!user && !isAuthGroup) {
      setTimeout(() => {
        router.replace('/(auth)/');
      }, 500);
    } else if (user && isAuthGroup) {
   
      router.replace('/(app)/(tabs)/search');
    }
  }, [user, segments]);

  if (initializing) {
   
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
