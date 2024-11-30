import { View, Text, ScrollView, Linking } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF7F2' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#011627' }}>
            Privacy Policy for AnimalFind
          </Text>
          <Text style={{ fontSize: 16, color: '#011627', marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Last Updated:</Text> 22.11.2024
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            Thank you for choosing <Text style={{ fontWeight: 'bold' }}>AnimalFind</Text>. This Privacy Policy explains how we collect, use, and protect your information when you use our application. By using AnimalFind, you agree to the terms outlined in this policy.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            1. Information We Collect
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            <Text style={{ fontWeight: 'bold' }}>1.1 Account Registration</Text>
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            - <Text style={{ fontWeight: 'bold' }}>Email Address:</Text> Collected during registration through Firebase and our VPS backend.
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            - <Text style={{ fontWeight: 'bold' }}>Phone Number:</Text> Collected only when a user posts about a lost or found animal. The phone number is protected from bots using CAPTCHA and is only visible to users who complete the CAPTCHA verification.
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            <Text style={{ fontWeight: 'bold' }}>1.2 Uploaded Content</Text>
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            - <Text style={{ fontWeight: 'bold' }}>Images:</Text> Uploaded images of animals are stored securely on Bunny CDN.
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            <Text style={{ fontWeight: 'bold' }}>1.3 Third-Party Integrations</Text>
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            We integrate with the following services:
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Firebase Authentication</Text>: For account creation and login.
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Bunny Storage</Text>: For secure storage of uploaded images.
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Google Maps API</Text>: To provide location-based functionalities.
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Google Vision API</Text>: To enhance image-related features.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            2. How We Use Your Information
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            - To enable account creation and login.
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            - To allow users to post about lost or found animals.
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            - To facilitate connections between users (e.g., sharing contact information securely through CAPTCHA-protected phone numbers).
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            3. User Rights
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            <Text style={{ fontWeight: 'bold' }}>3.1 Account Deletion</Text>
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            If you wish to delete your account, please send an email to <Text style={{ fontWeight: 'bold', color: '#011627', textDecorationLine: 'underline' }} onPress={() => Linking.openURL('mailto:animalfind.shepherdpaul@gmail.com')}>animalfind.shepherdpaul@gmail.com</Text> with the subject line "Account Deletion." Include your Firebase UID and email address in the message. Note that the email must be sent from the same email address linked to the account.
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            <Text style={{ fontWeight: 'bold' }}>3.2 Access to Collected Data</Text>
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            Users can request a copy of the data we have collected about them by contacting us at <Text style={{ fontWeight: 'bold', color: '#011627', textDecorationLine: 'underline' }} onPress={() => Linking.openURL('mailto:paul.shepherd.animalfind@gmail.com')}>animalfind.shepherdpaul@gmail.com</Text>.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            4. Data Retention
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            We retain user data only for as long as the account exists. All data is deleted when a user deletes their account.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            5. Data Security
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            The app was secured and penetration-tested by <Text style={{ fontWeight: 'bold' }}>SHG - Security Harden Group</Text>. For more details about SHG, visit{' '}
            <Text
              style={{ color: '#1E90FF', textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL('https://www.linkedin.com/in/dcwikla/')}
            >
              here
            </Text>.
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            CAPTCHA mechanisms protect sensitive information like phone numbers from bots.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            6. Third-Party Services
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 10, color: '#011627' }}>
            We share some of your data with the following third-party services to provide core functionalities:
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Firebase Authentication</Text>: To manage user accounts.
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Bunny Storage</Text>: To store uploaded images.
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Google Maps API</Text>: To provide location services.
            {'\n'}- <Text style={{ fontWeight: 'bold' }}>Google Vision API</Text>: To analyze uploaded images for better app functionality.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            7. Ads and Marketing
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            AnimalFind does not display ads or use your data for marketing purposes.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            8. Feedback and Contact
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            We welcome user feedback. If you have any questions, suggestions, or concerns about this Privacy Policy, please contact us at:
            {'\n'}<Text style={{ fontWeight: 'bold' }}>Email:</Text> <Text style={{ fontWeight: 'bold', color: '#011627', textDecorationLine: 'underline' }} onPress={() => Linking.openURL('mailto:animalfind.shepherdpaul@gmail.com')}>animalfind.shepherdpaul@gmail.com</Text>
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            9. Compliance
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            AnimalFind does not follow specific data regulations such as GDPR or CCPA. However, we are committed to protecting your privacy and implementing best practices.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            10. Changes to This Policy
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            We may update this Privacy Policy from time to time. Changes will be posted within the app, and the "Last Updated" date will be revised.
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#011627' }}>
            11. User Responsibilities
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20, color: '#011627' }}>
            By using AnimalFind, you agree to provide accurate information and adhere to our community guidelines. Misuse of the app, such as posting inaccurate or harmful content, may result in account suspension or deletion.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
