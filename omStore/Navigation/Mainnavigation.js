import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import SettingScreen from './Screens/SettingScreen';
import AddProductScreen from './Screens/AddProductScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreenNavigator} from './CustomNavigation';
import OrderScreen from './Screens/OrderScreen';
import PhoneScreen from './Screens/PhoneScreen';

export default function Mainnavigation() {
  const HomeName = 'HomeScreen';
  const OrderName = 'OrderScreen';
  const PhoneName ="PhoneScreen";
  const SettingName = 'SettingScreen';
  const AddProductName = 'AddProductScreen';
  const ProductViewName = 'ProductViewScreen';

  const Tab = createBottomTabNavigator();
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator

          screenOptions={{
            tabBarStyle:{paddingBottom:10},
          }}

          tabBarOptions={{
            hearderShown: false,
            showLabel: false,
            


            style: {
              // position: 'absolute',
              
              left: 20,
              right: 20,
              elevation: 0,
              backgroundColor: '#ffffff',
              borderRadius: 15,
              height: 100,
              elevation: 5,
              paddingBottom: 10,
            }
          }}>
          <Tab.Screen
            name={HomeName}
            component={HomeScreenNavigator}
            options={tabBarOptions => ({
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 10,
                  }}>
                  <Image
                    source={require('../assests/icons/home.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: focused ? '#e32f45' : '#748c94',
                    }}
                  />
                  <Text
                    style={{
                      color: focused ? '#e32f45' : '#748c94',
                      fontSize: 12,
                    }}>
                    Home
                  </Text>
                </View>
              ),
            })}
          />

          <Tab.Screen
            name={OrderName}
            component={OrderScreen}
            options={tabBarOptions => ({
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 10,
                  }}>
                  <Image
                    source={require('../assests/icons/shopping-bag.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: focused ? '#e32f45' : '#748c94',
                    }}
                  />
                  <Text
                    style={{
                      color: focused ? '#e32f45' : '#748c94',
                      fontSize: 12,
                    }}>
                    Orders
                  </Text>
                </View>
              ),
            })}
          />

          <Tab.Screen
            name={AddProductName}
            component={AddProductScreen}
            options={tabBarOptions => ({
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 10,
                  }}>
                  <Image
                    source={require('../assests/icons/add.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: focused ? '#e32f45' : '#748c94',
                    }}
                  />
                  <Text
                    style={{
                      color: focused ? '#e32f45' : '#748c94',
                      fontSize: 12,
                    }}>
                    Add Product
                  </Text>
                </View>
              ),
            })}
          />

<Tab.Screen
            name={PhoneName}
            component={PhoneScreen}
            options={tabBarOptions => ({
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 10,
                  }}>
                  <Image
                    source={require('../assests/icons/phone.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: focused ? '#e32f45' : '#748c94',
                    }}
                  />
                  <Text
                    style={{
                      color: focused ? '#e32f45' : '#748c94',
                      fontSize: 12,
                    }}>
                    Gifts
                  </Text>
                </View>
              ),
            })}
          />
          <Tab.Screen
            name={SettingName}
            component={SettingScreen}
            options={tabBarOptions => ({
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: 10,
                  }}>
                  <Image
                    source={require('../assests/icons/settings.png')}
                    resizeMode="contain"
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: focused ? '#e32f45' : '#748c94',
                    }}
                  />
                  <Text
                    style={{
                      color: focused ? '#e32f45' : '#748c94',
                      fontSize: 12,
                    }}>
                    Setting
                  </Text>
                </View>
              ),
            })}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
