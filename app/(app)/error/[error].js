import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import auth from '@react-native-firebase/auth';
import lapaBiedny from '@/assets/images/lapa_biedny.png'; 

export default function ErrorCode() {
  const { errorcode } = useLocalSearchParams();
  const router = useRouter();

  const handleLogoutAndNavigate = async () => {
    try {
      await auth().signOut();
      router.replace('/(auth)/x');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
     
      <Image 
        source={lapaBiedny}
        style={{ width: 300, height: 300, marginBottom: 0 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Oh no, there was an error nr {errorcode}.
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        Please contact me at{' '}
        <Text style={{ fontWeight: 'bold' }}>animalfind.shepherdpaul@gmail.com</Text> and describe what happened so I
        can fix that!
      </Text>
      <TouchableOpacity
        onPress={handleLogoutAndNavigate}
        style={{
          backgroundColor: '#3D3D49',
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Click here to login again</Text>
      </TouchableOpacity>
    </View>
  );
}
