import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './Screens/MainScreen'
import ProductView from './Screens/ProductView';
import OrderScreen from './Screens/OrderScreen';

const Stack = createNativeStackNavigator();


const HomeScreenNavigator = () => {

    const HomeName = 'HomeScreen';
    const SettingName = 'SettingScreen';
    const AddProductName = 'AddProductScreen';
    const ProductViewName = 'ProductViewScreen';

    return(

    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name={HomeName} component={HomeScreen}/>
        <Stack.Screen name={ProductViewName} component={ProductView}/>
    </Stack.Navigator>

    );


}
export {HomeScreenNavigator};

