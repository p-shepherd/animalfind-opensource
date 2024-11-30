
const router = useRouter();
  const [location, setLocation] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [form, setForm] = useState({
    latitude: '',
    longitude: '',
  });

const handleLocationPress = ({ latitude, longitude, address }) => {
    setForm((prevForm) => ({
      ...prevForm,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
    setInputValue(address);
  };  
  
  
  {/* <View className="mt-7 space-y-2">
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
              className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center"
            >
              <Text>Grab Location</Text>
            </TouchableOpacity>
            <Text>
              Your location is:
              {location
                ? `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
                : 'Location not available'}
            </Text>
          </View> */}
