import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home'
import ProfileScreen from './ProfileScreen';
import CartScreen from './CartScreen';
import ContactUs from './ContactUs';
import {ProfileNavigator} from './HomeProductNavigator';
import React from 'react';
import { View, Text, Image } from 'react-native';
import Delivery from './Delivery';

import { HomeProductNavigator } from './HomeProductNavigator';


const Tab = createBottomTabNavigator();

const HomeNavigator = () => {

    return (

        <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name='HomeScreen'
          component={HomeProductNavigator}
          options={{
            tabBarLabel: "", // Hide the label
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 10,
                }}>
                <Image
                  source={require('../../assets/home.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#e32f45' : '#748c94',
                  }}
                />
              </View>
            ),
          }}
        />

<Tab.Screen
          name='ContectUs'
          component={ContactUs}
          options={{
            tabBarLabel: "", // Hide the label
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 10,
                }}>
                <Image
                  source={require('../../assets/phone.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#e32f45' : '#748c94',
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='Cart'
          component={CartScreen}
          options={{
            tabBarLabel: "", // Hide the label
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 10,
                }}>
                <Image
                  source={require('../../assets/shopping-cart.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#e32f45' : '#748c94',
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='Delivery'
          component={Delivery}
          options={{
            tabBarLabel: "", // Hide the label
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 10,
                }}>
                <Image
                  source={require('../../assets/delivery.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#e32f45' : '#748c94',
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='Profile'
          component={ProfileNavigator}
          options={{
            tabBarLabel: "", // Hide the label
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 10,
                }}>
                <Image
                  source={require('../../assets/user.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#e32f45' : '#748c94',
                  }}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      
    );
}

export {HomeNavigator};