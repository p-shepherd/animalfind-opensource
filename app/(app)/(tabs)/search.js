// Search.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  BackHandler,
  InteractionManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FakeGoogleTextInput from '@/components/FakeGoogleTextInput';
import Dropdown from '@/components/Dropdown';
import GoogleTextInput from '@/components/GoogleTextInput';
import { searchAnimals } from '@/constants/api';
import { useRouter } from 'expo-router';
import lapaImage from '@/assets/images/lapa_gora.png';
export default function Search() {
  const router = useRouter();
  const scrollViewRef = useRef(null); 
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
  
   
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }, 0);
    }
  }, [searchResults]);
  
  const handlePostPress = (post) => {
    router.push({
      pathname: '/(app)/(searchdetails)/postdetails',
      params: { postData: JSON.stringify(post) },
    });
  };

  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [initialLocationText, setInitialLocationText] = useState('Search');
  const [searchedAtLeastOnce, setSearchedAtLeastOnce] = useState(false);

  const [form, setForm] = useState({
    animalType: 'allTypes',
    animalColor: 'allColors',
    status: '',
    distance: '',
    date: '',
    latitude: '',
    longitude: '',
  });

  const [selectedLabels, setSelectedLabels] = useState({
    animalType: 'All Types',
    animalColor: 'All Colors',
    status: '',
    date: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // Number of items per page

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModalOut = () => { 

    setModalVisible(false);
  };

  const handleCloseModal = async () => {
    // Check if mandatory fields are filled
    setSearchedAtLeastOnce(true);
    const requiredFields = ['latitude', 'longitude', 'status', 'distance', 'date'];
    for (let field of requiredFields) {
      if (!form[field]) {
        Alert.alert('Incomplete Form', `Please fill in the location, distance, date, and post type field.`);
        return;
      }
    }

    const locationText = inputValue || 'Search for a location';
    const distanceText = form.distance ? ` ${form.distance} km` : '';
    setInitialLocationText(`${locationText} +${distanceText}`);
    setModalVisible(false);
    // console.log('Form data:', form);

    setCurrentPage(1); // Reset to first page on new search

    try {
      const { posts, totalPages } = await searchAnimals({
        ...form,
        page: 1,
        pageSize: pageSize,
      });
      setSearchResults(posts);
      setTotalPages(totalPages || 1);
      // console.log('Total Pages after search:', totalPages);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchPage = async (pageNumber) => {
    try {
      const { posts, totalPages } = await searchAnimals({
        ...form,
        page: pageNumber,
        pageSize: pageSize,
      });
      setSearchResults(posts);
      setTotalPages(totalPages || 1);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };
  const handleAnimalTypeChange = (item) => {
    setForm({ ...form, animalType: item.value });
    setSelectedLabels({ ...selectedLabels, animalType: item.label });
  };

  const handleAnimalColorChange = (item) => {
    setForm({ ...form, animalColor: item.value });
    setSelectedLabels({ ...selectedLabels, animalColor: item.label });
  };

  const handleStatusChange = (item) => {
    setForm({ ...form, status: item.value });
    setSelectedLabels({ ...selectedLabels, status: item.label });
  };

  const handleDistanceChange = (item) => {
    setForm({ ...form, distance: item.value });
   
  };

  // Function to calculate date based on selected range
  const calculateDate = (value) => {
    const today = new Date();
    let date;

    switch (value) {
      case 'today':
        date = today;
        break;
      case 'last3days':
        date = new Date(today);
        date.setDate(today.getDate() - 3);
        break;
      case 'lastweek':
        date = new Date(today);
        date.setDate(today.getDate() - 7);
        break;
      case 'last2weeks':
        date = new Date(today);
        date.setDate(today.getDate() - 14);
        break;
      case 'lastmonth':
        date = new Date(today);
        date.setMonth(today.getMonth() - 1);
        break;
      case 'last3months':
        date = new Date(today);
        date.setMonth(today.getMonth() - 3);
        break;
      case 'lastyear':
        date = new Date(today);
        date.setFullYear(today.getFullYear() - 1);
        break;
      case 'ever':
        date = new Date(2000, 1, 5, 8, 0, 0); // February 5, 2000, 08:00 AM :)
        break;
      default:
        date = today;
        break;
    }

    if (date === null) {
      return null;
    } else {
      // Format the date to 'YYYY-MM-DD HH:MM'
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hours}:${minutes}`;
    }
  };

  const handleDateChange = (item) => {
    const calculatedDate = calculateDate(item.value);
    setForm({ ...form, date: calculatedDate });
    setSelectedLabels({ ...selectedLabels, date: item.label });
  };

  const handleLocationPress = ({ latitude, longitude, address }) => {
    setForm((prevForm) => ({
      ...prevForm,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
    setInputValue(address);
  };

 
  const selectedOptions = [
    selectedLabels.animalType,
    selectedLabels.animalColor,
    selectedLabels.status,
    selectedLabels.date,
  ].filter((label) => label);

  const customTextInputStyle = {
    borderWidth: 3,
    borderColor: '#C6C8D2',
    borderRadius: 4,
  };

  return (
    <SafeAreaView className="h-full"
    style={{backgroundColor: "#FAF7F2"}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
          }
        }}
      >
        <View className="flex-1 p-5 items-left">
          <View className="mt-2 space-y-2">
            
            <FakeGoogleTextInput
              onPress={handleOpenModal}
              initialLocation={initialLocationText}
            />
            {/* Render tags */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
              }}
            >
              {selectedOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={handleOpenModal}
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 4,
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Modal Section */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
             <TouchableWithoutFeedback
              onPress={() => {
                
                handleCloseModalOut(); // Close the modal when clicked outside the modal
              }}
            >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              style={{ flex: 1 }}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ marginTop: 50, marginHorizontal: 20 }}>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 20 }}
                  >
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 20,
                      }}
                    >
                      <Text className="text-lg font-bold mb-4">
                        Enter Your Location
                      </Text>
                      <GoogleTextInput
                        placeholder="Enter city name"
                        inputValue={inputValue}
                        handlePress={handleLocationPress}
                        textInputBackgroundColor="white"
                        containerStyle={{ marginBottom: 10 }}
                        textInputStyle={customTextInputStyle} 
                      />

                      {/* Dropdowns  */}
                      <View className="w-full mb-4">
                        <Text>Animal Type</Text>
                        <Dropdown
                          data={[
                            { value: 'allTypes', label: 'All Types' },
                            { value: 'dog', label: 'Dog' },
                            { value: 'cat', label: 'Cat' },
                            { value: 'parrot', label: 'Parrot' },
                            { value: 'other', label: 'Other' },
                          ]}
                          onChange={handleAnimalTypeChange}
                          value={form.animalType}
                          placeholder={selectedLabels.animalType || 'Select Animal Type'}
                        />
                      </View>

                      <View className="w-full mb-4">
                        <Text>Animal Color</Text>
                        <Dropdown
                          data={[
                            { value: 'allColors', label: 'All Colors' },
                            { value: 'black', label: 'Black' },
                            { value: 'brown', label: 'Brown' },
                            { value: 'white', label: 'White' },
                            { value: 'manycolors', label: 'More than one color' },
                          ]}
                          onChange={handleAnimalColorChange}
                          value={form.animalColor}
                          placeholder={selectedLabels.animalColor || 'Select Color'}
                        />
                      </View>

                      <View className="w-full mb-4">
                        <Text>Distance</Text>
                        <Dropdown
                          data={[
                            { value: '1', label: '1 km' },
                            { value: '2', label: '2 km' },
                            { value: '3', label: '3 km' },
                            { value: '5', label: '5 km' },
                            { value: '8', label: '8 km' },
                            { value: '10', label: '10 km' },
                            { value: '20', label: '20 km' },
                            { value: '50', label: '50 km' },
                            { value: '100', label: '100 km' },
                            { value: '500', label: '500 km' },
                          ]}
                          onChange={handleDistanceChange}
                          value={form.distance}
                          placeholder={form.distance ? `${form.distance} km` : 'Distance (km)'}
                        />
                      </View>

                      <View className="w-full mb-4">
                        <Text>Date Range</Text>
                        <Dropdown
                          data={[
                            { value: 'today', label: 'Today' },
                            { value: 'last3days', label: 'Last 3 Days' },
                            { value: 'lastweek', label: 'Last Week' },
                            { value: 'last2weeks', label: 'Last 2 Weeks' },
                            { value: 'lastmonth', label: 'Last Month' },
                            { value: 'last3months', label: 'Last 3 Months' },
                            { value: 'lastyear', label: 'Last Year' },
                            { value: 'ever', label: 'Ever' },
                          ]}
                          onChange={handleDateChange}
                          value={form.date}
                          placeholder={selectedLabels.date || 'Date Range'}
                        />
                      </View>

                      <View className="w-full mb-4">
                        <Text>Post Type</Text>
                        <Dropdown
                          data={[
                            { value: 'found', label: 'Search for found animals' },
                            { value: 'lost', label: 'Search for lost animals' },
                          ]}
                          onChange={handleStatusChange}
                          value={form.status}
                          placeholder={selectedLabels.status || 'Found/Lost'}
                        />
                      </View>

                      <TouchableOpacity
                        className="w-full h-10 justify-center items-center rounded"
                        style={{ backgroundColor: '#3D3D49' }}
                        onPress={handleCloseModal}
                      >
                        <Text className="text-white text-base font-bold">Search</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </Modal>

          {/*Search Results */}
          <View className="mt-3">
            {searchResults.length > 0 ? (
              <View>
                {searchResults.map((post, index) => (
                  <View key={index} style={{ width: '100%' }}>
                    <TouchableOpacity
                      onPress={() => handlePostPress(post)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: 'white',
                        width: '100%',
                        borderRadius: 4,
                      }}
                    >
                      {/* Content of the post */}
                      <View className="flex-row justify-between items-start flex-wrap h-auto">
                        <Text className="font-bold text-lg mb-2 max-w-[70%]">
                          {post.animal_name || post.animal_type}
                        </Text>
                        <Text className="font-bold text-sm pt-1">
                          {parseFloat(post.distance).toFixed(2)} km away
                        </Text>
                      </View>
                      {/* Image Lapa*/}
                      {post.image_url ? (
                        <Image
                          source={{ uri: post.image_url }}
                          style={{
                            width: '100%',
                            height: 200,
                            borderRadius: 10,
                            marginBottom: 10,
                          }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text>No image available.</Text>
                      )}
                      
                      {post.description ? (
                        <Text className="mb-2" style={{textAlign:'center', fontSize: 12}}>{post.description}</Text>
                      ) : (
                        <Text>No description provided.</Text>
                      )}
                    
                      <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}
    >
                      <Text className='font-bold'>{new Date(post.date).toLocaleDateString()}</Text>
                      <View
        style={{
          backgroundColor: post.status === 'found' ? '#FF9F1C' : '#9c5a9c',
          borderRadius: 4,
          paddingVertical: 2,
          paddingHorizontal: 5,
        }}
      >
       <Text style={{ color: 'white' }}>
  {post.status === 'found' ? 'Found' : 'Lost'}
</Text>

      </View>
      </View>
                    </TouchableOpacity>
                    {/* Line Seperating posts stylish effect */}
                    <View
                      style={{
                        height: 15,
                        backgroundColor: '#FAF7F2', 
                        width: '100%',
                      }}
                    />
                  </View>
                ))}

{totalPages > 1 && (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      alignItems: 'center',
    }}
  >
    {/* First Page Button */}
    {currentPage > 1 && (
      <TouchableOpacity
        onPress={() => fetchPage(1)} 
        style={{
          marginHorizontal: 5,
          width: 20, 
          height: 20,
          borderRadius: 5,
          backgroundColor: '#3D3D49',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>{'<<'}</Text>
      </TouchableOpacity>
    )}

    
    {/* Page Numbers */}
    {getPageNumbers().map((pageNumber) => (
      <TouchableOpacity
        key={pageNumber}
        onPress={() => fetchPage(pageNumber)} 
        style={{
          marginHorizontal: 5,
          width: 25, 
          height: 25,
          borderRadius: 5,
          backgroundColor: '#3D3D49',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: pageNumber === currentPage ? '#FF9F1C' : 'white', // Current page text color
            fontSize: 15,
            fontWeight: pageNumber === currentPage ? 'bold' : 'normal',
          }}
        >
          {pageNumber}
        </Text>
      </TouchableOpacity>
    ))}

  

    {/* Last Page Button */}
    {currentPage < totalPages && (
      <TouchableOpacity
        onPress={() => fetchPage(totalPages)} 
        style={{
          marginHorizontal: 5,
          width: 20,
          height: 20,
          borderRadius: 5,
          backgroundColor: '#3D3D49',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>{'>>'}</Text>
      </TouchableOpacity>
    )}
  </View>
)}
              </View>
            ) : (
              <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
             {searchedAtLeastOnce && (
              <>
    <Text className="text-2xl font-bold mb-4">No results found</Text>
    <Text className="text-md">Try searching for other location or changing parameters</Text></>
  )}
              <Image
                source={lapaImage}
                style={{
                  width: 400,
                  height: 400,
                  resizeMode: 'contain',
                }}
              />
            </View>
              
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
