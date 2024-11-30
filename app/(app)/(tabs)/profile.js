import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  const menuItems = [
    { label: "My Account", route: "(app)/(profilemenu)/accountinfo", icon: require('@/assets/icons/account.png') },
    { label: "My Posts", route: "(app)/(profilemenu)/myposts", icon: require('@/assets/icons/posts2.png') },
    { label: "Privacy Policy", route: "(app)/(profilemenu)/privacypolicy", icon: require('@/assets/icons/policy.png') },
    { label: "App Info", route: "(app)/(profilemenu)/appinfo", icon: require('@/assets/icons/app_info2.png') },
  ];

  const arrowIcon = require('@/assets/icons/right_arrow.png');

  return (
    <SafeAreaView
      className="h-full"
      style={{
        backgroundColor: "#FAF7F2",
      }}
    >
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="flex-1 justify-start items-center w-full">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route)}
              className="w-full flex-row items-center border-b border-gray-300 px-4 py-4"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
             
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={item.icon}
                  style={{ width: 36, height: 36, marginRight: 10 }}
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 16, color: '#000' }}>{item.label}</Text>
              </View>
            
              <Image
                source={arrowIcon}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
