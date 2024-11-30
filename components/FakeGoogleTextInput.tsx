import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from 'react';
import search from "../assets/icons/search.png"; // Adjust this path based on your file structure

type FakeGoogleTextInputProps = {
  icon?: any;
  initialLocation?: string;
  containerStyle?: any;
  textInputBackgroundColor?: string;
  onPress?: () => void; // Event handler for the button press
};

const FakeGoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  onPress,
}: FakeGoogleTextInputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        style={[styles.inputWrapper, { backgroundColor: textInputBackgroundColor || "white" }]} 
        onPress={onPress}
        activeOpacity={0.7} // Control the opacity when pressed
      >
        <Image
          source={icon || search}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.placeholderText}>
          {initialLocation ?? "Search"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
    position: "relative", // Added for zIndex to work
    zIndex: 1, // Added to ensure it's above other elements
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 35,
    height: "100%",
    lineHeight: 50, // Align text vertically within the button
    color: "gray", // Customize text color as needed
  },
  icon: {
    position: "absolute",
    left: 5,
    height: 30,
    width: 30,
    zIndex: 1,
  },
});

export default FakeGoogleTextInput;
