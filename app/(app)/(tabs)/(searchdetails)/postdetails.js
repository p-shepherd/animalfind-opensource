import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, Alert, Pressable, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '@/components/Map';
import ReCaptcha from 'react-native-recaptcha-that-works';
import { verifyRecaptchaToken, reportPost } from '@/constants/api'; 

export default function PostDetails() {
  const { postData } = useLocalSearchParams();
  const post = JSON.parse(postData);

  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false); 
  const [selectedReason, setSelectedReason] = useState(null); 
  const [actionType, setActionType] = useState(null); // New state to track action type (contact or report)
  const recaptcha = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  const screenHeight = Dimensions.get('window').height;
  const imageHeight = isFullscreen ? screenHeight : screenHeight * 0.4;

  const postLocation = {
    latitude: parseFloat(post.latitude),
    longitude: parseFloat(post.longitude),
  };

  const handleVerify = async (token) => {
    setCaptchaToken(token);
  
    if (!token) {
      Alert.alert('Verification Required', 'Please complete the reCAPTCHA verification.');
      return;
    }
  
    try {
      const isValid = await verifyRecaptchaToken(token, actionType);
  
      if (isValid) {
        if (actionType === 'report') {
          if (selectedReason) {
            
            const normalizedReason = selectedReason.toLowerCase();
  
            console.log('Reporting post:', post.post_uid, normalizedReason);
            await reportPost(post.post_uid, normalizedReason); 
            Alert.alert(
              'Report Submitted',
              'Report was submitted! If this post gets reported by other users it will get taken down!'
            );
            setModalVisible(false); 
            setSelectedReason(null); 
          } else {
            Alert.alert('Error', 'Please select a reason for reporting.');
          }
        } else if (actionType === 'contactInfo') {
          setShowContactInfo(true); // Show contact info after successful reCAPTCHA verification
        }
        setCaptchaToken(null);
      } else {
        Alert.alert('Verification Failed', 'reCAPTCHA verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during reCAPTCHA verification:', error);
      Alert.alert('Error', 'An error occurred during reCAPTCHA verification.');
    }
  };
  
  

  const reasons = [
    'Vulgar content',
    'Explicit image',
    'Not related to the app',

    'Drastic image',
  ];

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-5">
          <Text className="text-2xl font-bold mb-4">
            {post.animal_name || post.animal_type}
          </Text>
        </View>

        <View
          style={{
            height: 15,
            backgroundColor: '#FAF7F2',
            width: '100%',
          }}
        />
        <View className="p-5">
          {/* Status */}
          <Text className="text-lg font-semibold mt-4">Animal Status</Text>
          <View
            style={{
              backgroundColor: post.status === 'found' ? '#FF9F1C' : '#9c5a9c',
              borderRadius: 4,
              paddingVertical: 2,
              paddingHorizontal: 8,
              alignSelf: 'flex-start',
              marginVertical: 5,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {post.status === 'found' ? 'Found' : 'Lost'}
            </Text>
          </View>

          {/* Image */}
          {post.image_url ? (
            <Pressable
              onPress={() => setIsFullscreen(!isFullscreen)}
              style={{ flex: 1 }}
              android_disableSound={true}
              android_ripple={null}
            >
              <Image
                source={{ uri: post.image_url }}
                className="w-full rounded-lg mt-4"
                style={{ height: imageHeight }}
                resizeMode="contain"
              />
            </Pressable>
          ) : (
            <Text className="text-base text-gray-700 mt-4">No image available.</Text>
          )}

          {/* Description */}
          <Text className="text-lg font-semibold mt-4">Description</Text>
          <Text className="text-base text-gray-700">
            {post.description || 'No description provided.'}
          </Text>

          {/* Special Traits */}
          <Text className="text-lg font-semibold mt-4">Special Traits</Text>
          <Text className="text-base text-gray-700">
            {post.special_traits || 'No special traits provided.'}
          </Text>

          {/* Map showing post location */}
          <Text className="text-lg font-semibold mt-4">Location</Text>
          <View className="w-full h-48 rounded-lg overflow-hidden mt-4">
            <Map postLocation={postLocation} />
          </View>
          <Text className="text-md">Click on the red pin, to open in Google Maps</Text>

          {/* Date */}
          <Text className="text-lg font-semibold mt-4">Date</Text>
          <Text className="text-base text-gray-700">
            {post.date ? new Date(post.date).toLocaleDateString() : 'Date not provided'}
          </Text>

          {/* Contact Info */}
          <Text className="text-lg font-semibold mt-4">Contact Info</Text>
          {showContactInfo ? (
            <Text className="text-base text-gray-700">
              {post.contact_info || 'No contact info provided.'}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setActionType('contactInfo');
                recaptcha.current.open();
              }}
              className="mt-2 px-4 py-2 bg-blue-500 rounded"
            >
              <Text className="text-white text-center">Click To View Contact Info</Text>
            </TouchableOpacity>
          )}

          {/* Has Been Secured */}
          <Text className="text-lg font-semibold mt-4">Status of Security</Text>
          <Text className="text-base text-gray-700">
            {post.has_been_secured === null
              ? 'Security status unknown'
              : post.has_been_secured
              ? 'The animal has been secured'
              : 'The animal has not been secured'}
          </Text>
        </View>
        <View
          style={{
            height: 15,
            backgroundColor: '#FAF7F2',
            width: '100%',
          }}
        />
        <View className="p-5">
          {/* Additional Information */}
          <Text className="text-lg font-semibold mt-4">Additional Information</Text>
          <Text className="text-base text-gray-700">Post ID: {post.post_uid}</Text>
          
          {/* Animal Type and Color */}
          <Text className="text-lg font-semibold mt-4">Animal Details</Text>
          <Text className="text-base text-gray-700">Type: {post.animal_type}</Text>
          <Text className="text-base text-gray-700">Color: {post.animal_color}</Text>
        </View>

        {/* Report Button */}
        <View className="p-5">
          <TouchableOpacity
            onPress={() => {
              setActionType('report');
              setModalVisible(true);
            }}
            className="mt-2 px-4 py-2 bg-red-500 rounded"
          >
            <Text className="text-white text-center">Report This Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Report Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-11/12 bg-white p-5 rounded-lg">
            <Text className="text-xl font-bold mb-4">Report Post</Text>
            <Text className="text-base mb-4">Select a reason for reporting:</Text>
            {reasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedReason(reason)}
                className={`p-2 border rounded mb-2 ${
                  selectedReason === reason ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                <Text className={`${selectedReason === reason ? 'text-white' : 'text-black'}`}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => {
                if (selectedReason) recaptcha.current.open();
                else Alert.alert('Error', 'Please select a reason for reporting.');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 rounded"
            >
              <Text className="text-white text-center">Submit Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelectedReason(null);
              }}
              className="mt-2 px-4 py-2 bg-gray-300 rounded"
            >
              <Text className="text-black text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ReCaptcha Component */}
      <ReCaptcha
        ref={recaptcha}
        siteKey="6LcDqHsqAAAAAIg7SMoe4YhLT2_hIfDubkdRkD3V"
        baseUrl="https://animalfind.shepherdpaul.com"
        onVerify={handleVerify}
        size="normal"
        lang="en"
        theme="light"
      />
    </SafeAreaView>
  );
}
