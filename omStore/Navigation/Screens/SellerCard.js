import React from 'react'
import { View, Text, Image, ToastAndroid, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import prompt from 'react-native-prompt-android';

export default function SellerCard({sellerName: sellerName}) {

    const onDelete = () => {
        firestore().collection('seller').doc(String(sellerName)).delete().then(() => {
            ToastAndroid.show("Seller Deleted", ToastAndroid.SHORT);

        });
        }


    const updateSeller = (oldName,newName) => {
      console.log(oldName,newName)
        firestore().collection('seller').doc(String(oldName)).set({
            sellerName: newName
        }).then(() => {
            
            ToastAndroid.show("Seller Updated", ToastAndroid.SHORT);
        });
    }

    
      const editSellerName = () => {
        console.log("Edit Post Value")

    

        prompt(
            'Enter New Name',
            '',
            [
             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: newName => updateSeller(sellerName,newName)},
            ],
            {
                
                cancelable: true,
                defaultValue: sellerName,
                placeholder: 'New Name'
            }
        );
        
        

    }
    




  return (
    <>    
    <TouchableOpacity onLongPress={editSellerName}>
    <View style={{margin:15, flexDirection:'row'}}>

        <Text style={{color:'black', flex:1,fontSize:16}}>{sellerName}</Text>
        
        <TouchableOpacity onPress={() => onDelete()}>
        <Image source={require('../../assests/icons/bin.png')} style={{width:20, height:20}}></Image>
        </TouchableOpacity>



    </View>
    <View style={{backgroundColor:'black', width:'90%', height:1, marginStart:20, marginEnd:20}}></View>
    </TouchableOpacity>
    </>
  )
}
