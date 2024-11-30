import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { v4 as uuidv4 } from 'uuid';
import upload from '@/assets/icons/upload.png';
import Dropdown from '@/components/Dropdown';
import GoogleTextInput from '@/components/GoogleTextInput';

import { postTokenToBackend, verifyRecaptchaToken } from '@/constants/api';

import ReCaptcha from 'react-native-recaptcha-that-works';
export default function AddLost() {
  const [location, setLocation] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const recaptcha = useRef();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [form, setForm] = useState({
    postUid: uuidv4(), 
    animalName: '',
    picture: null,
    animalType: '',
    animalColor: '',
    longitude: '',
    latitude: '',
    
    description: '',
    specialTraits: '',
    contactPhone: '',
    status: 'lost',
  });

  const [uploading, setUploading] = useState(false);

  

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'], // Only image types allowed
    });
  
    if (!result.canceled) {
      const fileSize = result.assets[0].size; 
      const maxFileSize = 10 * 1024 * 1024; // 10 MB in bytes
      console.log('File size:', fileSize);
      console.log('maxFileSize:', maxFileSize);
      if (fileSize > maxFileSize) {
        Alert.alert('File too large', 'The selected file must be smaller than 5 MB.');
        return;
      }
  
      setForm({
        ...form,
        picture: result.assets[0],
      });
    } else {
      setTimeout(() => {
        Alert.alert('Document picked', JSON.stringify(result, null, 2));
      }, 100);
    }
  };
  

  const formatCoordinates = (coords) => {
    return `Lat: ${coords.latitude.toFixed(4)}, Lon: ${coords.longitude.toFixed(4)}`;
  };

  const handleLocationPress = ({ latitude, longitude, address }) => {
    setForm((prevForm) => ({
      ...prevForm,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
    setInputValue(address);
  };

  useEffect(() => {
    if (form.latitude && form.longitude) {
      console.log(
        `Form's Current Location: Latitude: ${form.latitude}, Longitude: ${form.longitude}`
      );
    }
  }, [form.latitude, form.longitude]);

  const handleSubmit = async () => {
    // Ensure required fields are not empty
    const requiredFields = [
      'picture',
      'animalType',
      'animalColor',
      'longitude',
      'latitude',
      'contactPhone',
    ];
    for (let key of requiredFields) {
      if (!form[key]) {
        Alert.alert('Incomplete Form', `Please fill in the ${key} field.`);
        return;
      }
    }
  
   
    recaptcha.current.open();
  };
  useEffect(() => {
    console.log("Form updated:", form);
  }, [form]);
  
  const handleVerify = async (token) => {
    setCaptchaToken(token);
  
    if (!token) {
      Alert.alert("Verification Required", "Please complete the reCAPTCHA verification.");
      return;
    }
  
    try {
      const isValid = await verifyRecaptchaToken(token);
      if (isValid) {
        setUploading(true);
        console.log("Posting form:", form);
  
        try {
          const response = await postTokenToBackend(form);
          console.log("Response from posting:", response);
          Alert.alert("Post added!", "You can see it in Profile - My posts.");
  
          // Reset the form
          setForm({
            postUid: uuidv4(),
            picture: null,
            animalType: '',
            animalColor: '',
            longitude: '',
            latitude: '',
            description: '',
            specialTraits: '',
            contactPhone: '',
            animalName: '',
            status: 'found',
            hasBeenSecured: false,
          });
  
          setInputValue('');
          setLocation(null);
          setCaptchaToken(null);
          console.log("Form reset successfully.");
        } catch (error) {
          console.error("Error while trying to post:", error);
          if (error.message.includes("Network Error")) {
            Alert.alert(
              "Error",
              "Connection with the server failed. Please check your internet connection and try again."
            );
          } else {
            Alert.alert(
              "Error",
              "There was an error submitting the post. Please ensure all fields are correctly filled and try again."
            );
          }
        } finally {
          setUploading(false);
        }
      } else {
        Alert.alert("Verification Failed", "reCAPTCHA verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during reCAPTCHA verification:", error);
      Alert.alert("Error", "An error occurred during reCAPTCHA verification.");
    }
  };
    

  const handleAnimalTypeChange = (selectedOption) => {
    setForm({ ...form, animalType: selectedOption.value });
  };

  const handleAnimalColorChange = (selectedOption) => {
    setForm({ ...form, animalColor: selectedOption.value });
  };
// Validation functions
const validateTextInput = (text) => {
  return /^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ0-9\s.,!/-]*$/.test(text); // Allows letters, Polish characters, numbers, spaces, ., , !, and -
};


const validatePhoneNumber = (text) => {
  return /^[0-9+\-]*$/.test(text); // Allows numbers, plus sign, and hyphen
};

// Input handlers with validation
const handleAnimalNameChange = (text) => {
  if (validateTextInput(text)) {
    setForm({ ...form, animalName: text });
  } else {
    Alert.alert('Invalid Input', 'Only letters are allowed in this field.');
  }
};

const handleDescriptionChange = (text) => {
  if (validateTextInput(text)) {
    setForm({ ...form, description: text });
  } else {
    Alert.alert('Invalid Input', 'Only letters are allowed in this field.');
  }
};

const handleSpecialTraitsChange = (text) => {
  if (validateTextInput(text)) {
    setForm({ ...form, specialTraits: text });
  } else {
    Alert.alert('Invalid Input', 'Only letters are allowed in this field.');
  }
};

const handleContactPhoneChange = (text) => {
  if (validatePhoneNumber(text)) {
    setForm({ ...form, contactPhone: text });
  } else {
    Alert.alert('Invalid Input', 'Only numbers are allowed in this field.');
  }
};

  return (
    <SafeAreaView
  style={{ backgroundColor: '#CECFFF', flex: 1 }}
>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View className="flex-1 p-5 items-left">
        <View className="mt-7 items-center">
  <Text className="text-3xl font-bold text-black-100">Add Lost Animal</Text>
</View>
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Get my Location
            </Text>
            <TouchableOpacity
              onPress={async () => {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission to access location was denied');
                  return;
                }
                const locationGrab = await Location.getCurrentPositionAsync({});
                setLocation(locationGrab);
                setForm((prevForm) => ({
                  ...prevForm,
                  latitude: locationGrab.coords.latitude.toString(),
                  longitude: locationGrab.coords.longitude.toString(),
                }));
                setInputValue(formatCoordinates(locationGrab.coords));
              }}
              className="w-full h-16 px-4 bg-white rounded-lg border border-black-300 flex justify-center items-center shadow"
            >
              <Text>Grab Location</Text>
            </TouchableOpacity>
            <Text>
              Your location is:
              {location
                ? `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
                : 'Location not available'}
            </Text>
          </View>

          {/* Choose Location by Yourself */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Choose Location by yourself
            </Text>
            <GoogleTextInput
              initialLocation={location ? formatCoordinates(location.coords) : undefined}
              inputValue={inputValue}
              handlePress={handleLocationPress}
              className="w-full bg-white rounded-lg border border-black-300 shadow"
            />
          </View>

          {/* Choose Animal Type */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Choose Animal Type
            </Text>
            <Dropdown
              data={[
                { value: "dog", label: "Dog" },
                { value: "cat", label: "Cat" },
                { value: "parrot", label: "Parrot" },
                { value: "other", label: "Other" },
              ]}
              value={form.animalType || null} 
              onChange={handleAnimalTypeChange}
              placeholder="Select"
            />
          </View>

          {/* Choose Animal Color */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Choose Animal Color
            </Text>
            <Dropdown
              data={[
                { value: "black", label: "Black" },
                { value: "brown", label: "Brown" },
                { value: "white", label: "White" },
                { value: "manycolors", label: "More than one color" },
              ]}
              value={form.animalColor || null} 
              onChange={handleAnimalColorChange}
              placeholder="Select"
            />
          </View>

          {/* Animal Name */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Animal Name
            </Text>
            <TextInput
              value={form.animalName}
              onChangeText={handleAnimalNameChange}
              maxLength={30}
              className="w-full px-4 py-2 bg-white rounded-lg border border-black-300 shadow"
            />
          </View>

          {/* Upload Picture */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Upload a picture of the animal
            </Text>
            <TouchableOpacity onPress={openPicker}>
              {form.picture ? (
                <Image
                  source={{ uri: form.picture.uri }}
                  resizeMode="contain"
                  className="w-full h-64 rounded-lg border border-black-300 shadow"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-white rounded-lg border border-black-300 flex justify-center items-center flex-row space-x-2 shadow">
                  <Image
                    source={upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-black-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Description (max 250 chars)
            </Text>
            <TextInput
              value={form.description}
              onChangeText={handleDescriptionChange}
              maxLength={250}
              multiline
              numberOfLines={4}
              className="w-full px-4 py-2 bg-white rounded-lg border border-black-300 shadow"
              placeholder='Describe how the animal got lost, its behavior, etc.'
            />
          </View>

          {/* Special Traits */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Special Traits (max 80 chars)
            </Text>
            <TextInput
              value={form.specialTraits}
              onChangeText={handleSpecialTraitsChange}
              maxLength={80}
              className="w-full px-4 py-2 bg-white rounded-lg border border-black-300 shadow"
              placeholder='Any special traits like a collar, a limp, etc.'
            />
          </View>

          {/* Contact Phone */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Contact Phone (max 20 chars)
            </Text>
            <TextInput
              value={form.contactPhone}
              onChangeText={handleContactPhoneChange}
              maxLength={20}
              keyboardType="phone-pad"
              className="w-full px-4 py-2 bg-white rounded-lg border border-black-300 shadow"
              placeholder='123-456-789'
            />
          </View>
          <View className="mt-7">
              <ReCaptcha
                ref={recaptcha}
                siteKey="6LcDqHsqAAAAAIg7SMoe4YhLT2_hIfDubkdRkD3V" // Replace with your actual site key
                baseUrl="https://animalfind.shepherdpaul.com" // Replace with your actual domain
                onVerify={handleVerify}
                size="normal"
                lang="en"
                theme="light"
              />
            </View>
          {/* Submit Button */}
          <View className="mt-2 space-y-2">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={uploading}
              className="w-full h-12 bg-white rounded-lg flex justify-center items-center shadow"
              style={{ backgroundColor: '#3D3D49' }}
            >
              <Text className="text-base font-bold text-white">
                {uploading ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}