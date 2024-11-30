import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import upload from '@/assets/icons/upload.png';
import Dropdown from '@/components/Dropdown';
import GoogleTextInput from '@/components/GoogleTextInput';
import { updatePost, verifyRecaptchaToken, deletePost } from '@/constants/api'; 
import ReCaptcha from 'react-native-recaptcha-that-works'; 

export default function EditPost() {
  const { editid, postData } = useLocalSearchParams();
  const router = useRouter();
  const [form, setForm] = useState({
    animalName: "",
    postUid: editid,
    picture: null,
    image_url: "",
    animalType: "",
    animalColor: "",
    longitude: "",
    latitude: "",
    description: "",
    specialTraits: "",
    contactPhone: "",
    status: "",
    hasBeenSecured: false,
    user_uid: "", 
  });

  const [isSecured, setIsSecured] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const recaptcha = useRef(null); 
  const [captchaToken, setCaptchaToken] = useState(null);

 
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        user_uid: user.uid,
      }));
    }
  }, []);

  useEffect(() => {
    
    if (postData) {
      try {
        const post = JSON.parse(postData);
        console.log('Received post data:', post);

     
        setForm({
          animalName: post.animal_name || "",
          postUid: post.post_uid,
          picture: null,
          image_url: post.image_url || "",
          animalType: post.animal_type || "",
          animalColor: post.animal_color || "",
          longitude: post.longitude || "",
          latitude: post.latitude || "",
          user_uid: post.user_uid || "",
          description: post.description || "",
          specialTraits: post.special_traits || "",
          contactPhone: post.contact_info || "",
          status: post.status || "",
          hasBeenSecured: post.has_been_secured || false,
        });
        setIsSecured(post.has_been_secured);

  
        setInputValue(`Lat: ${post.latitude}, Lon: ${post.longitude}`);
      } catch (error) {
        console.error('Error parsing post data:', error);
        Alert.alert('Error', 'Failed to load post data.');
      }
    } else {
      Alert.alert('Error', 'No post data received.');
    }
  }, [postData]);

 
  const handleSwitchToggle = (value) => {
    setIsSecured(value);
    setForm((prevForm) => ({
      ...prevForm,
      hasBeenSecured: value,
    }));
  };

 
  const openPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        multiple: false, // only one file can be selected
      });

      if (!result.canceled) {
        const selectedFile = result.assets[0];
        setForm({
          ...form,
          picture: selectedFile,
        });
      } else {
        Alert.alert("Upload Cancelled", "No file was selected.");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "An error occurred while picking the file.");
    }
  };

 
  const handleLocationPress = ({ latitude, longitude, address }) => {
    setForm((prevForm) => ({
      ...prevForm,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
    setInputValue(address);
  };

 
  const handleAnimalTypeChange = (selectedOption) => {
    setForm({ ...form, animalType: selectedOption.value });
  };

 
  const handleAnimalColorChange = (selectedOption) => {
    setForm({ ...form, animalColor: selectedOption.value });
  };


  const validateTextInput = (text) => {
    return /^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ0-9\s.,!/-]*$/.test(text);
  };

 
  const validatePhoneNumber = (text) => {
    return /^[0-9+\-]*$/.test(text);
  };

 
  const handleAnimalNameChange = (text) => {
    if (validateTextInput(text)) {
      setForm({ ...form, animalName: text });
    } else {
      Alert.alert('Invalid Input', 'Only letters, numbers, spaces, ., ,, !, and - are allowed in this field.');
    }
  };


  const handleDescriptionChange = (text) => {
    if (validateTextInput(text)) {
      setForm({ ...form, description: text });
    } else {
      Alert.alert('Invalid Input', 'Only letters, numbers, spaces, ., ,, !, and - are allowed in this field.');
    }
  };

 
  const handleSpecialTraitsChange = (text) => {
    if (validateTextInput(text)) {
      setForm({ ...form, specialTraits: text });
    } else {
      Alert.alert('Invalid Input', 'Only letters, numbers, spaces, ., ,, !, and - are allowed in this field.');
    }
  };


  const handleContactPhoneChange = (text) => {
    if (validatePhoneNumber(text)) {
      setForm({ ...form, contactPhone: text });
    } else {
      Alert.alert('Invalid Input', 'Only numbers, plus sign, and hyphen are allowed in this field.');
    }
  };


  const handleStatusChange = (selectedOption) => {
    setForm({ ...form, status: selectedOption.value });
  };

  const handleSubmit = async () => {
    // Ensure required fields are not empty
    const requiredFields = ["animalType", "animalColor", "longitude", "latitude", "contactPhone"];
    const fieldNames = {
      animalType: "Animal Type",
      animalColor: "Animal Color",
      longitude: "Longitude",
      latitude: "Latitude",
      contactPhone: "Contact Phone",
    };
    for (let key of requiredFields) {
      if (!form[key]) {
        Alert.alert("Incomplete Form", `Please fill in the ${fieldNames[key]} field.`);
        return;
      }
    }

   
    recaptcha.current.open();
  };


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

       
        const payload = { ...form };
        delete payload.user_uid; 
        delete payload.image_url; // Always remove image_url as backend does not allow it
        if (!form.picture) delete payload.picture; // Remove picture if not set

        console.log("Updating post with payload:", payload);

        try {
          const response = await updatePost(payload);
          console.log("Response from updating post:", response);
          Alert.alert("Success", "Post updated successfully!");

         
          setForm({
            animalName: "",
            postUid: editid,
            picture: null,
            image_url: "",
            animalType: "",
            animalColor: "",
            longitude: "",
            latitude: "",
            description: "",
            specialTraits: "",
            contactPhone: "",
            status: "",
            hasBeenSecured: false,
            user_uid: "", 
          });
          setIsSecured(false);
          setInputValue("");

          router.replace("/(app)/(tabs)/profile");
        } catch (error) {
          console.error("Error while updating post:", error);
          if (error.message.includes("Network Error")) {
            Alert.alert(
              "Error",
              "Connection with the server failed. Please check your internet connection and try again."
            );
          } else {
            Alert.alert(
              "Error",
              "There was an error updating the post. Please ensure all fields are correctly filled and try again."
            );
          }
        } finally {
          setUploading(false);
          setCaptchaToken(null);
        }
      } else {
        Alert.alert("Verification Failed", "reCAPTCHA verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during reCAPTCHA verification:", error);
      Alert.alert("Error", "An error occurred during reCAPTCHA verification.");
    }
  };

  const handleDeletePost = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // console.log('Deleting post with UID:', form.postUid); 
              await deletePost(form.postUid);
              Alert.alert('Success', 'Post deleted successfully');
              router.replace('/(app)/(tabs)/profile'); 
            } catch (error) {
              // console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete the post. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View className="flex-1 p-5">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text className="text-2xl font-bold mb-5">Edit Post</Text>
            <TouchableOpacity
              onPress={handleDeletePost}
              style={{
                backgroundColor: 'red',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Post</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-lg font-semibold mt-4">Animal Status</Text>
<View
  style={{
    backgroundColor: form.status === 'found' ? '#FF9F1C' : '#9c5a9c',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginVertical: 5,
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>
    {form.status === 'found' ? 'Found' : 'Lost'}
  </Text>
</View>

  {/* Dropdown to Change Status */}
  <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Change Animal Status
            </Text>
            <Dropdown
              data={[
                { value: "lost", label: "Lost" },
                { value: "found", label: "Found" },
              ]}
              value={form.status}
              onChange={handleStatusChange}
              placeholder="Select Status"
            />
          </View>
          {/* Choose Location */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Choose Location
            </Text>
            <GoogleTextInput
              initialLocation={inputValue}
              inputValue={inputValue}
              handlePress={handleLocationPress}
              onDropdownToggle={(isVisible) => console.log('Dropdown visible:', isVisible)}
              className="w-full bg-white rounded-lg border border-gray-300 shadow"
            />
          </View>

          {/* Add Title */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Add Title (Optional)
            </Text>
            <TextInput
              value={form.animalName}
              onChangeText={handleAnimalNameChange}
              maxLength={30}
              className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 shadow"
              placeholder="Enter animal name"
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
              value={form.animalType}
              onChange={handleAnimalTypeChange}
              placeholder={form.animalType ? form.animalType : "Select Type"}
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
              value={form.animalColor}
              onChange={handleAnimalColorChange}
              placeholder={form.animalColor ? form.animalColor : "Select Color"}
            />
          </View>

          {/* Upload Picture */}
          <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Upload a Picture of the Animal
            </Text>
            <TouchableOpacity onPress={openPicker}>
              {form.picture ? (
                <Image
                  source={{ uri: form.picture.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-lg border border-gray-300 shadow"
                />
              ) : form.image_url ? (
                <Image
                  source={{ uri: form.image_url }}
                  resizeMode="contain"
                  className="w-full h-64 rounded-lg border border-gray-300 shadow"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-white rounded-lg border border-gray-300 flex justify-center items-center flex-row space-x-2 shadow">
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
              className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 shadow"
              placeholder='Describe the found animal and the circumstances of finding it.'
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
              className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 shadow"
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
              className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 shadow"
              placeholder='123-456-789'
            />
          </View>

          {/* Has Animal Been Secured? */}
          <Text className="text-base text-black-100 font-pmedium mt-7">
            Has the animal been secured?
          </Text>
          <View className="mt-2 flex-row items-center">
            <Text className="text-base text-black-100 font-pmedium ml-4">
              {isSecured ? 'Yes' : 'No'}
            </Text>
            <Switch
              value={isSecured}
              onValueChange={handleSwitchToggle}
              className="ml-2"
              thumbColor={isSecured ? "rgba(255, 165, 0, 1)" : "rgba(0, 0, 0, 1)"}
            />
          </View>

          {/* ReCaptcha Component */}
          <View className="mt-7">
            <ReCaptcha
              ref={recaptcha}
              siteKey="6LcDqHsqAAAAAIg7SMoe4YhLT2_hIfDubkdRkD3V" // Safe to be public
              baseUrl="https://animalfind.shepherdpaul.com"
              onVerify={handleVerify}
              size="normal"
              lang="en"
              theme="light"
            />
          </View>

          {/* Submit Button */}
          <View className="mt-7 space-y-2">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={uploading}
              style={{ backgroundColor: uploading ? '#A9A9A9' : '#3D3D49' }}
              className="w-full h-16 rounded-lg flex justify-center items-center shadow"
            >
              <Text className="text-base font-bold text-white">
                {uploading ? 'Submitting...' : 'Submit Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
