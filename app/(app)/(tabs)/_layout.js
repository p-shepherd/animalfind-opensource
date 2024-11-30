import { View, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';


import pet from '@/assets/icons/add_lapa.png';
import petClicked from '@/assets/icons/add_lapa_clicked.png';

import search from '@/assets/icons/search.png';
import searchClicked from '@/assets/icons/search_clicked.png';
import profile from '@/assets/icons/profile.png';
import profileClicked from '@/assets/icons/profile_clicked.png';

const TabIcon = ({ focused, icon, iconClicked }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={focused ? iconClicked : icon} 
        resizeMode="contain"
        style={{
          width: 35,
          height: 35,
        }}
      />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, 
      }}
    >
   
   

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={search} iconClicked={searchClicked} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={pet} iconClicked={petClicked} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={profile} iconClicked={profileClicked} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="(searchdetails)"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
