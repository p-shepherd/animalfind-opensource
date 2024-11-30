import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const CreatePostLayout = () => {
  return (
   <Stack>
    <Stack.Screen name="addfound" options={
      {
       headerShown: false
      }
    }/>
     <Stack.Screen name="addlost" options={
      {
       headerShown: false
      }
    }/>
    
    </Stack>
  )
}

export default CreatePostLayout

