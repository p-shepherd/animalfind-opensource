import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AccountInfo() {
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setEmail(user.email);
      setUid(user.uid);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      Alert.alert('Logged out', 'You have been successfully logged out.');
      router.replace('/(auth)/index');
    } catch (error) {
      console.log('Logout error: ', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Account Info</Text>
          <Text style={styles.infoLabel}>Email Address:</Text>
          <Text style={styles.infoValue}>{email || 'Loading...'}</Text>
          <Text style={styles.infoLabel}>Firebase UID:</Text>
          <Text style={styles.infoValue}>{uid || 'Loading...'}</Text>
          <Text style={styles.sectionTitle}>Report an issue:</Text>
          <Text style={styles.instructions}>
            If you want to report an issue, please send an email to:
          </Text>
          <Text style={styles.emailAddress}>animalfind.shepherdpaul@gmail.com</Text>
          <Text style={styles.instructions}>
            Include the Your user UID in the massage of the email
          </Text>
          <Text style={styles.instructions}>
            The email must be sent from the same email address linked to this account.
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#011627',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#011627',
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 10,
    color: '#011627',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#011627',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
    color: '#011627',
  },
  emailAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FF6B6B',
  },
  bulletPoint: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 2,
    color: '#011627',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: 200,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
