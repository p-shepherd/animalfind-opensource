import { View, Text, ScrollView, Linking } from 'react-native';
import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

const AppInfo = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View>

       
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#011627' }}>
            Current Version:
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
          1.0.0 </Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#011627' }}>
            About AnimalFind
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            AnimalFind is a platform designed to help pet owners and animal lovers reconnect with their lost pets or help reunite found animals with their rightful owners. Our mission is to make finding and reporting lost or found animals simple, fast, and effective.
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#011627' }}>
  About the Author
</Text>
<Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
  I have been developing React Native applications for over two years. This app was created to verify and showcase my skills in building full-stack React Native applications.
</Text>
<Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
  If you would like to hire me or collaborate on creating an app together, feel free to connect with me{' '}
  <Text
    style={{ color: '#0077b5', textDecorationLine: 'underline' }}
    onPress={() => Linking.openURL(encodeURI('https://www.linkedin.com/in/paul-shepherd-programming/')) }

  >
    here
  </Text>.
</Text>
          
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            Contact
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            Have questions, suggestions, or feedback? Contact me at animalfind.shepherdpaul@gmail.com. I’d love to hear from you!
          </Text>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppInfo;
