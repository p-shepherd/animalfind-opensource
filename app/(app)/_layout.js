// app/(app)/_layout.js

import React from 'react';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(createpost)" />
      <Stack.Screen name="(profilemenu)" />
      
     
    </Stack>
  );
}
