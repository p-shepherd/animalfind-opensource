import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


import lapaDol from '@/assets/images/lapa_dol.png';
import lapaGoralewo from '@/assets/images/lapa_goralewo.png';

const AddScreen = () => {
  const router = useRouter(); 

  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: "#FAF7F2" }}>
      <View className="flex-1 justify-start items-center pt-10">
        
        <Image
          source={lapaDol}
          style={{ width: 220 * 1.25, height: 220 * 1.25, marginLeft: 20 }}
          resizeMode="contain"
        />

       
        <View className="flex-row items-center mt-0">
          <Text className="text-2xl font-bold">Have You </Text>
          <TouchableOpacity
            onPress={() => router.push('(app)/(createpost)/addlost')}
          >
            <Text
              className="text-2xl font-bold text-white px-3 py-1 rounded-md"
              style={{ backgroundColor: '#9c5a9c' }}
            >
              Lost
            </Text>
          </TouchableOpacity>
        </View>

      
        <Text className="text-xl font-bold mt-2">Or</Text>

       
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => router.push('(app)/(createpost)/addfound')}
          >
            <Text
              className="text-2xl font-bold text-white px-3 py-1 rounded-md"
              style={{ backgroundColor: '#FF9F1C' }}
            >
              Found
            </Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold"> the animal?</Text>
        </View>

      
        <Image
          source={lapaGoralewo}
          style={{ width: 200 * 1.25, height: 250 * 1.25, marginTop: 20, marginRight: 20 }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default AddScreen;
