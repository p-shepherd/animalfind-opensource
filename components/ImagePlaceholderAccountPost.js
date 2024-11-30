import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ImagePlaceholderAccountPost = ({ title, imageSource, date }) => {
  return (
    <View style={styles.postContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={imageSource}
          style={styles.postImage}
          resizeMode="contain"
        />
      </View>
      {/* Optional Text */}
      <Text style={styles.postTitle}>{title}</Text>
      <Text style={styles.postDate}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    height: 220,               // Fixed height for the container
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    margin: 1,                 // Minimal margin to create small gaps
    alignItems: 'center',      // Center content horizontally
  },
  imageWrapper: {
    width: '100%',
    height: 150,               // Fixed height for the image container
    justifyContent: 'center',  // Center the image vertically
    alignItems: 'center',      // Center the image horizontally
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 2,
  },
  postDate: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
    color: '#666',
  },
});

export default ImagePlaceholderAccountPost;
