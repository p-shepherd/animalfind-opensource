import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const CreateProfilemenuLayout = () => {
  return (
   <Stack>
   <Stack.Screen name="[editId]" options={
        {
        headerShown: false
        }
    }/>
  
    
    </Stack>
  )
}

export default CreateProfilemenuLayout

