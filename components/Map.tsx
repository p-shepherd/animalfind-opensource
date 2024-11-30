import React, { useRef } from 'react';
import { View, Text, Image } from 'react-native';
import MapView, { Marker, Region, MapMarker } from 'react-native-maps';
import pinIcon from '../assets/icons/pinicon.png';

type PostLocation = {
  latitude: number;
  longitude: number;
};

const Map = ({ postLocation }: { postLocation: PostLocation }) => {
  const { latitude, longitude } = postLocation;
  const markerRef = useRef<MapMarker | null>(null);

  if (!latitude || !longitude) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <Text>Location data not available.</Text>
      </View>
    );
  }

  const region: Region = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

 

  return (
    <MapView
      style={{ width: '100%', height: '100%' }}
      region={region}
      showsUserLocation={false}
    >
      <Marker
        ref={(ref) => (markerRef.current = ref)}
        coordinate={{ latitude, longitude }}
        title="Animal Location"
        image={pinIcon
        }
        onLayout={() => {
          markerRef.current?.showCallout();
        }}
      />
    </MapView>
  );
};

export default Map;
