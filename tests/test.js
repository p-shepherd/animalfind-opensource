import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { triggerTest400Error } from '@/constants/api';

const TestScreen = () => {
    const handleTestError = () => {
      triggerTest400Error(); // No try-catch, let the global interceptor handle errors
    };
  return (
    <SafeAreaView className="h-full" style={{ backgroundColor: "#FAF7F2" }}>
      <View className="flex-1 justify-center items-center pt-10">
        <TouchableOpacity onPress={handleTestError}>
          <Text style={{ backgroundColor: 'black', color: 'white', padding: 10 }}>
            Test 400 Error
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TestScreen;



