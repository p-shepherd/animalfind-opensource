import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const CreateProfilemenuLayout = () => {
  return (
   <Stack>
   <Stack.Screen name="accountinfo" options={
        {
        headerShown: false
        }
    }/>
    <Stack.Screen name="myposts" options={
        {
        headerShown: false
        }
    }/>
    <Stack.Screen name="privacypolicy" options={
        {
        headerShown: false
        }
    }/>
    <Stack.Screen name="appinfo" options={
        {
        headerShown: false
        }
    }/>
    <Stack.Screen name="(editpost)" options={
        {
        headerShown: false
        }
    }/>
    
    </Stack>
  )
}

export default CreateProfilemenuLayout

