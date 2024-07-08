import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';


import Login from './navigation/screens/login';
import Register from './navigation/screens/Register';
import Home from './navigation/screens/Home';
import {HomeNavigator} from './navigation/screens/HomeNavigator';


const Stack = createNativeStackNavigator();



const App = () => {

  
  

  
 
 

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown:false}} >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={HomeNavigator} />
      
      
    </Stack.Navigator>
  </NavigationContainer>
  );
};


export default App;

