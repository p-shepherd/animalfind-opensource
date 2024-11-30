import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const SearchDetailsLayout = () => {
  return (
   <Stack>
    <Stack.Screen name="postdetails" options={
          {
          headerShown: false
          }
     }/>
    
    </Stack>
  )
}

export default SearchDetailsLayout

