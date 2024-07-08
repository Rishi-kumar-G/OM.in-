import React from 'react'
import { View,Text, Image,BackHandler, ImageBackground, Touchable, TouchableOpacity} from 'react-native'
// import { Text } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore';
import { useState, useEffect } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

export default function Delivery({navigation}) {

    const [phone, setPhone] = useState('');

    useEffect(() => {
        const backHandlerSubscription = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            // Check if you want to handle back button press for this screen
            if (!navigation.canGoBack()) {
              // If there's no previous screen, exit the app (optional)
              return false;
            }
    
            navigation.goBack();
            return true; // Prevent default navigation handling
          }
        );
    
        return () => backHandlerSubscription.remove();
      }, [navigation]);

    useEffect(() => {
        const fetchContactUsData = async () => {
            try {
                const docRef = firestore().collection('helpline').doc('delivery');
                const docSnapshot = await docRef.get();
                const data = docSnapshot.data();
                setPhone(data.phone);
            } catch (error) {
                console.error('Error fetching contact us data:', error);
            }
        };

        fetchContactUsData();
    }, []);

    const copyToClipboard = () => {
        Clipboard.setString(phone);
        alert('Phone number copied to clipboard');
    }
    

    

  return (
    <ImageBackground source={require('../../assets/backGround_3.jpg')} resizeMode='cover' style={{width:'100%', height:'100%',alignContent:'center',justifyContent:'center'}}>
   <View>
    <Text style={{fontSize: 40, color:'#514A9D', fontWeight:'900',letterSpacing:5, textAlign:'center',margin:10}}>For Delivery</Text>

    <View style={{flexDirection:'row',justifyContent:'space-evenly', alignItems:'center'}}>
    <Image source={require('../../assets/phone.png')} resizeMode='contain' style={{width:'50%',tintColor:'#514A9D', height:80,margin:10}}/>
    <Image source={require('../../assets/whatsapp.png')} resizeMode='contain' style={{width:'50%', height:80,margin:10}}/>
    
    </View>

    <Text style={{fontSize: 30, color:'#514A9D', fontWeight:'800',letterSpacing:5, textAlign:'center',margin:10}}>At</Text>
    <TouchableOpacity onPress={copyToClipboard}>
    <Text style={{fontSize: 30, color:'#514A9D', fontWeight:'800',letterSpacing:5, textAlign:'center',margin:10}}>+91 {phone}</Text>
    </TouchableOpacity>
   </View>
    </ImageBackground>
  )
}
