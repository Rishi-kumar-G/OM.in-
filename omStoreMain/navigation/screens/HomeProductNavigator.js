import {View, Text} from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home'
import ProductView from './ProductView'
import OrderView from './OrderView';
import Profile from './ProfileScreen'
import Login from './login';
import ProductSaved from './ProductSaved';
const Stack = createNativeStackNavigator();

const HomeProductNavigator = () =>{


    return(

        
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name='HomeScreen' component={Home}/>
                <Stack.Screen name='ProductView' component={ProductView}/>
                <Stack.Screen name='ProductSaved' component={ProductSaved}/>
            </Stack.Navigator>



    );
}

export {HomeProductNavigator}

const ProfileNavigator = () =>{


    return(

        
            <Stack.Navigator initialRouteName='Profile' screenOptions={{headerShown:false}}>
                <Stack.Screen name='Profile' component={Profile}/>
                <Stack.Screen name='OrderView' component={OrderView}/>
                <Stack.Screen name='Login' component={Login}/>

            </Stack.Navigator>



    );
}

export {ProfileNavigator}