import React from 'react'
import { View, Text, Image, ToastAndroid, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';

export default function SellerCard({sellerName: sellerName}) {

    const onDelete = () => {
        firestore().collection('seller').doc(String(sellerName)).delete().then(() => {
            ToastAndroid.show("Seller Deleted", ToastAndroid.SHORT);

        });
        }


  return (
    <>    
    <View style={{margin:15, flexDirection:'row'}}>

        <Text style={{color:'black', flex:1,fontSize:16}}>{sellerName}</Text>
        
        <TouchableOpacity onPress={() => onDelete()}>
        <Image source={require('../../assests/icons/bin.png')} style={{width:20, height:20}}></Image>
        </TouchableOpacity>



    </View>
    <View style={{backgroundColor:'black', width:'90%', height:1, marginStart:20, marginEnd:20}}></View>
    </>
  )
}
