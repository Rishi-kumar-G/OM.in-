import React from 'react'
import { View, Text, Image, ToastAndroid, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';

export default function PostCard({postOffice: postName, deleveryCharge: postValue, postId: postId}) {
    
    const onDelete = () => {
        firestore().collection('data').doc(String(postName)).delete().then(() => {
            ToastAndroid.show("Post Deleted", ToastAndroid.SHORT);

        });
        }
  
  
  
    return (

    


    <>    
    <View style={{margin:15, flexDirection:'row'}}>

        <Text style={{color:'black', flex:1,fontSize:16}}>{postName}</Text>
        <Text style={{color:'black', marginEnd:20,fontSize:16}}>₹{postValue}</Text>
        <TouchableOpacity onPress={() => onDelete()}>
        <Image source={require('../../assests/icons/bin.png')} style={{width:20, height:20}}></Image>
        </TouchableOpacity>



    </View>
    <View style={{backgroundColor:'black', width:'90%', height:1, marginStart:20, marginEnd:20}}></View>
    </>


  )
}
