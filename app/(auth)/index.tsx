import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, BackHandler, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { registerOrUpdateGoogleUser } from '@/constants/api';
import { useFocusEffect } from '@react-navigation/native';

export default function StartScreen() {
  const router = useRouter();
  const Lapa = require('@/assets/images/lapatektyw.png');
  const Napis = require('@/assets/images/napis.png'); 

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '168448121889-lm4hfiktm3a29u4298oo4f27hrsuakk4.apps.googleusercontent.com', //safe to public 
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true; // Prevent default back behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
  
     
      const idToken = userInfo?.idToken || userInfo?.data?.idToken;
  
      if (!idToken) {
        console.error('No ID token returned from Google Sign-In');
        return;
      }
  
      
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      
      await auth().signInWithCredential(googleCredential);
  
      
      await registerOrUpdateGoogleUser();
  
     
      router.replace('search');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View style={styles.mainContent}>
        
          <Image source={Napis} style={styles.napisImage} />

          <View style={styles.picture}>
            <Image source={Lapa} style={{ width: 500, height: 500 }} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
            <Image
              source={require('@/assets/images/google_logo.png')}
              style={styles.googleLogo}
            />
          </TouchableOpacity>

          <View style={styles.subcontainer}>
            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('(auth)/login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={() => router.push('(auth)/register')}>
              <Text style={styles.buttonTextRegister}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  napisImage: {
    width: 300, 
    height: 100, 
    resizeMode: 'contain',
    marginTop: 50,
  },
  picture: {
    flex: 13,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#011627',
  },
  googleButtonText: {
    color: '#011627',
    fontWeight: 'bold',
    marginRight: 10,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#011627',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  registerButton: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
    borderColor: '#011627',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
  },
  buttonTextRegister: {
    color: 'white',
  },
});
