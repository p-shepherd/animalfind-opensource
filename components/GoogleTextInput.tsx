import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import searchIcon from '../assets/icons/search.png'; // Adjust this path based on your file structure
import { functions } from '../constants/firebaseConfig'; // Adjust import path as necessary

type GoogleTextInputProps = {
  icon?: any;
  initialLocation?: string;
  inputValue?: string;
  containerStyle?: any;
  textInputStyle?: any;
  textInputBackgroundColor?: string;
  handlePress?: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  placeholder?: string;
};

type AutocompletePrediction = {
  description: string;
  place_id: string;
};

type PlaceDetailsResult = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
};

const GoogleTextInput = ({
  icon,
  initialLocation,
  inputValue,
  containerStyle,
  textInputStyle,
  textInputBackgroundColor,
  handlePress,
  placeholder,
}: GoogleTextInputProps) => {
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [query, setQuery] = useState(inputValue || initialLocation || '');
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle inputValue prop changes
  useEffect(() => {
    if (inputValue !== undefined && inputValue !== query) {
      setQuery(inputValue);
    }
  }, [inputValue]);

  // Handle initialLocation prop changes
  useEffect(() => {
    if (initialLocation !== undefined && initialLocation !== query) {
      setQuery(initialLocation);
    }
  }, [initialLocation]);

  // Focus the TextInput when isFocused becomes true
  useEffect(() => {
    if (isFocused && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isFocused]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const fetchAutocompleteResults = (input: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (!input.trim()) {
        setAutocompleteResults([]);
        return;
      }

      setLoading(true);
      try {
        const getPlacesAutocomplete = functions().httpsCallable('getPlacesAutocomplete');
        const response = await getPlacesAutocomplete({ input });
        const data = response.data as { predictions: AutocompletePrediction[] };
        setAutocompleteResults(data.predictions || []);
      } catch (error) {
        console.error('Error fetching autocomplete results:', error);
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce delay
  };

  const fetchPlaceDetails = async (placeId: string, description: string) => {
    setIsLoadingDetails(true);
    setQuery(`${description} (Loading...)`); // Set loading text immediately
    setAutocompleteResults([]);
    setIsFocused(false); // Close the dropdown
    Keyboard.dismiss();

    try {
      const getPlaceDetails = functions().httpsCallable('getPlaceDetails');
      const response = await getPlaceDetails({ placeId });
      const data = response.data as { result: PlaceDetailsResult };
      const details = data.result;

      setQuery(description); // Update the input with the selected place
      if (handlePress) {
        handlePress({
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          address: description,
        });
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      setQuery(description); // Reset to description in case of an error
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.textInputContainer]}>
        <Image source={icon || searchIcon} style={styles.icon} resizeMode="contain" />
        {isFocused ? (
          <TextInput
            ref={textInputRef}
            style={[
              styles.textInput,
              textInputStyle,
              { backgroundColor: textInputBackgroundColor || 'white' },
            ]}
            placeholder={placeholder || 'Enter search location'}
            placeholderTextColor="gray"
            value={query}
            editable={!isLoadingDetails} // Disable input during loading
            onChangeText={(text) => {
              setQuery(text);
              fetchAutocompleteResults(text);
            }}
            onBlur={() => setIsFocused(false)}
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.textInputTouchable,
              textInputStyle,
              { backgroundColor: textInputBackgroundColor || 'white' },
            ]}
            onPress={() => setIsFocused(true)}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.textInputText,
                { color: query ? 'black' : 'gray' },
              ]}
            >
              {query || placeholder || 'Enter search location'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {autocompleteResults.length > 0 && (
        <ScrollView
          style={styles.listView}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          {autocompleteResults.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.row}
              onPress={() => fetchPlaceDetails(item.place_id, item.description)}
            >
              <Text style={styles.itemText}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1, // Ensure the container has a higher zIndex
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0,
    paddingRight: 0,
    borderRadius: 5,
    backgroundColor: 'white',
    height: 50,
    marginBottom: 10,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 35,
    height: '100%',
    borderRadius: 0,
    textAlign: 'left',
  },
  textInputTouchable: {
    flex: 1,
    paddingLeft: 35,
    height: '100%',
    justifyContent: 'center',
  },
  textInputText: {
    fontSize: 16,
    paddingRight: 10, // Optional: to prevent text clipping
  },
  icon: {
    position: 'absolute',
    left: 5,
    height: 30,
    width: 30,
    zIndex: 1,
    tintColor: 'black',
  },
  listView: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 45, // Adjusted to match the input height
    left: 0,
    right: 0,
    zIndex: 99,
    maxHeight: 200,
    borderRadius: 0,
    borderTopWidth: 0,
    borderColor: '#e8ebf7',
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    backgroundColor: '#e8ebf7',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    color: '#000',
  },
  loadingText: {
    marginTop: 5,
    color: 'gray',
  },
});

export default GoogleTextInput;
