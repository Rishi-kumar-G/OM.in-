import React, { Image, BackHandler } from 'react-native';
import { useState, useEffect } from 'react';
import {ImageBackground, Text, ToastAndroid, TextInput,FlatList,ScrollView,TouchableOpacity, View} from 'react-native';
// import {FlatList, ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import OrderCard from './OrderCard';
import Modal from 'react-native-modal';

import RNFS from 'react-native-fs';

export default function ProfileScreen({navigation, route}) {
  
  const [userEmail, setuserEmail] = useState('');
  const [userName, setuserName] = useState('');
  const [userPhone, setuserPhone] = useState('');
  const [userAddress, setuserAddress] = useState('');
  const [userPost, setUserPost] = useState('');
  const [AddressToUpdate, setAddressToUpdate] = useState('');
  const [Locality, setLocality] = useState('');
  const [LocalityModal, setLocalityModalVisible] = useState(false);

  const [isOrders, setisOrders] = useState(0);
  const [isModalVisible, setisModalVisible] = useState(false);

  const [data, setData] = useState([]);
  const [localityData, setLocalityData] = useState([]);

  const path = RNFS.DocumentDirectoryPath + '/test.txt';

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
    RNFS.readFile(path, 'utf8')
      .then(contents => {
        setuserEmail(contents);

        const collectionRef = firestore()
          .collection('orders')
          .where('orderUserEmail', '==', contents);

          

        const unsubscribe = collectionRef.onSnapshot(snapshot => {
          const items = snapshot.docs.map(doc => ({
            AllItem: doc.data().orderAllItem,
            orderId: doc.data().orderID,
            orderOTP: doc.data().orderOTP,
            orderDate: doc.data().orderDate
          }))

          const sortedItems = items.sort((itemA, itemB) => {
            // Handle potential cases where orderDate might be null or undefined
            const dateA = itemA.orderDate || new Date(-Infinity); // Assign an invalid date if missing
            const dateB = itemB.orderDate || new Date(-Infinity); // Assign an invalid date if missing
        
            // Sort dates in descending order
            return dateA.getTime - dateB.getTime;
          });

          sortedItems.reverse();

          setData(sortedItems);

          if (items.length == 0) {
            setisOrders(1);
          }
          else{
            setisOrders(0);
          }
        });

        firestore()
          .collection('users')
          .doc(contents)
          .get()
          .then(doc => {
            if (doc.exists) {
              setuserName(doc.data().name);
              setuserPhone(doc.data().phone);
              setuserAddress(doc.data().address);
              setuserEmail(doc.data().email);
              setUserPost(doc.data().postOffice);
              setLocality(doc.data().postOffice);
            } else {
              console.log('No such document!');
              ToastAndroid.show('No such document!', ToastAndroid.SHORT);
            }
          })
          .catch(error => {
            console.log('Error getting document:', error);
            ToastAndroid.show('Error getting document!', ToastAndroid.SHORT);
          });

        return () => {
          unsubscribe();
        };
      })
      .catch(err => {
        console.log(err.message, err.code);
      });

    // Reference to your Firestore collection
  }, []);

  useEffect(() => {
    // Reference to your Firestore collection
    const collectionRef = firestore().collection('data');

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        postName: doc.data().postName,
       
      }));
      setLocalityData(items);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  


  const onLogout = () => {
    
    RNFS.unlink(path)
      .then(() => {
        auth()
          .signOut()
          .then(() => {

          
            console.log('User signed out!');
            ToastAndroid.show('User signed out!', ToastAndroid.SHORT);
            throw{};
            // navigation.navigate('Login');
            // navigation.navigate('Login');
          }
          );



      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const updateFirestore = async () => {
    ToastAndroid.show('updating...', ToastAndroid.SHORT);
    try {
      // Reference to your Firestore collection
      const collectionRef = firestore().collection('users');
      
      // Update the document in the collection
      await collectionRef.doc(userEmail).update({
        address: AddressToUpdate,
        postOffice:Locality,
      });

      

      ToastAndroid.show('updated successfully', ToastAndroid.SHORT);
      setuserAddress(AddressToUpdate);
      setisModalVisible(false);
    } catch (error) {
      console.error('Error updating ', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{margin:5,  justifyContent:'center', alignItems:'center', borderWidth:0.5,borderRadius:5}}>
     <Text style={{color:'#514A9D', fontSize:20}} onPress={()=>{setLocality(item.postName)
      setLocalityModalVisible(false)}}>{item.postName}</Text>

    </View>
  );

  return (
    <View>


      <Modal onBackButtonPress={()=>setisModalVisible(false)} visible={isModalVisible} animationType="slide" transparent>
        <View style={{backgroundColor:'white', height:400,width:330 ,borderRadius:20, borderWidth:1, elevation:10, borderColor:'white'}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:20, fontWeight:'900',color:'#514A9D',margin:20, textAlign:'center'}}>Update Address</Text>
            <TextInput
              value={AddressToUpdate}
              style={{color:'#514A9D', padding:10, margin:10, borderRadius:15, borderWidth:1, borderColor:'#514A9D'}}
              onChangeText={text => setAddressToUpdate(text)}
            />

        <Text style={{fontSize:15, fontWeight:'900',color:'#514A9D',margin:20, textAlign:'center'}}>Change Locality</Text>
        
        <TouchableOpacity style={{width:150, flex:1,justifyContent:'center', alignItems:'center'}}>
              <Text style={{color:'#514A9D', fontSize:18}} onPress={()=>setLocalityModalVisible(true)}>{Locality}</Text>

            </TouchableOpacity>
            
          </View>
          <View style={{height:70, alignSelf:'baseline', flexDirection:'row', width:'100%'}}>
            <TouchableOpacity style={{width:150, flex:1,justifyContent:'center', alignItems:'center'}}>
              <Text style={{color:'#514A9D', fontSize:18}} onPress={()=>setisModalVisible(false)}>Cancle</Text>

            </TouchableOpacity>

            <TouchableOpacity  
            onPress={updateFirestore}
            
            style={{borderColor:'#514A9D',flex:1,alignItems:'center', justifyContent:'center', width:150,borderWidth:1,backgroundColor:'#514A9D' ,borderRadius:20, margin:10, alignSelf:'center'}}>

              <Text style={{color:'white',flex:1 ,fontSize:18, margin:10}} onPress={updateFirestore} >Update</Text>

            </TouchableOpacity>
            </View>
        </View>
      </Modal>


      <Modal onBackButtonPress={()=>setLocalityModalVisible(false)} visible={LocalityModal} animationType="slide" transparent onSwipeCancel={()=>setLocalityModalVisible(false)}>
        <View style={{backgroundColor:'white', height:400,width:330 ,borderRadius:20, borderWidth:1, elevation:10, borderColor:'white'}}>
          
        <FlatList
              
              
              
              data={localityData}
              keyExtractor={(item) => item.postName}
              
              renderItem={renderItem}
            />

        
          
        </View>
      </Modal>

      <ImageBackground
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}
        source={require('../../assets/backGround_3.jpg')}>

          <ScrollView style={{height: '100%'}}>

        <Text
          style={{
            fontSize: 30,
            fontWeight: '700',
            color: '#514A9D',
            margin: 20,
            marginBottom: 0,
            marginTop: 20,
            letterSpacing: 4,
            textDecorationLine: 'underline',
          }}>
          Hello,
        </Text>
        <Text
          style={{
            fontSize: 40,
            fontWeight: '900',
            color: '#514A9D',
            marginLeft: 20,
            marginTop: 0,
            marginTop: 5,
            letterSpacing: 4,
          }}>
          {userName}.
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '300',
            color: '#514A9D',
            marginLeft: 22,
            marginTop: 5,
            letterSpacing: 4,
          }}>
          +91 {userPhone}.
        </Text>


        <View style={{width:'100%', flexDirection:'row'}}>
          <View style={{width:'70%', flexDirection:'column'}}>
          <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#514A9D',
            marginLeft: 22,
            marginTop: 5,
            letterSpacing: 1,
          }}>
          {userEmail}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#514A9D',
            marginLeft: 22,
            marginTop: 5,
            letterSpacing: 1,
          }}>
          {userPost}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#514A9D',
            marginLeft: 22,
            marginTop: 5,
            letterSpacing: 1,
          }}>
          {userAddress}
        </Text>

          </View>

          <View>
            <TouchableOpacity onPress={()=>{setisModalVisible(true)
            setAddressToUpdate(userAddress)}}>

            <Image source={require('../../assets/edit.png')} style={{width:40,tintColor:'#514A9D' ,height:40, margin:10, alignSelf:'center',padding:20, resizeMode:'contain'}} />
            </TouchableOpacity>
          </View>

        </View>

        

        <Text
          style={{
            fontSize: 35,
            fontWeight: '400',
            color: '#514A9D',
            marginTop: 40,
            textAlign: 'center',
            letterSpacing: 4,
          }}>
          Orders
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '400',
            opacity: isOrders,
            color: '#514A9D',
            textAlign: 'center',
            marginTop: 5,
            letterSpacing: 4,
            
          }}>
          No Orders
        </Text>

        <FlatList
          style={{
            backgroundColor: 'white',
            flex: 1,
            marginLeft: 20,
            marginEnd: 20,
            borderRadius: 15,
            elevation: 20,
          }}
          data={data}
          
          keyExtractor={item => item.orderId}
          // inverted={true}
          renderItem={({item}) => (
            <OrderCard AllItem={item.AllItem} orderId={item.orderId} orderOTP={item.orderOTP} />
          )}></FlatList>
          <View style={{height: 60, alignItems:'center', justifyContent:'center'}}>

            <TouchableOpacity onPress={onLogout}>

          <Text style={{color:'#514A9D', fontSize:25, fontWeight:'600', textDecorationLine:'underline'}}>
            Logout
          </Text>

          </TouchableOpacity>


          </View>


            </ScrollView>

      </ImageBackground>
    </View>
  );
}



// useEffect(() => {
//   // Reference to your Firestore collection
//   const collectionRef = firestore().collection('products');

//   const unsubscribe = collectionRef.onSnapshot(snapshot => {
//     const items = snapshot.docs.map(doc => ({
//       postName:doc.data.postName,
//       postValue:doc.data.postValue,

//     }));
//     setData(items);



//   });

//   return () => {
//     unsubscribe();
//   };
// }, []);
