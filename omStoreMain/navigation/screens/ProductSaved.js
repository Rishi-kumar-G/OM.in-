import React, {useEffect, useState} from 'react';
import {Text, View,StyleSheet, ImageBackground, FlatList, TextInput, Image, TouchableOpacity, ToastAndroid, ScrollView, BackHandler, LogBox} from 'react-native';
// import  {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ItemCard from './ItemCard';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemCardSaved from './ItemCardSaved';
import ItemDaily from './ItemDaily';
import { firebase } from '@react-native-firebase/storage';

export default function ProductSaved({navigation, route}) {
  const [data, setData] = useState([]);
  const [dailyData , setDailyData] = useState([]);
  const [searchQuerry, setSearchQuerry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ImagesData, setImagesData] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  useEffect(() => {
  ToastAndroid.show('Long Press To Remove Product From Wishlist', ToastAndroid.SHORT);

  }, []);

  
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

 



  const collectionRef = firestore().collection('users').doc('rishikumargautam2005@gmail.com').collection('fav');

  useEffect(() => {
    // Reference to your Firestore collection
    // const collectionRef = firestore().collection('products');

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        productName: doc.data().productName,
        productDescription: doc.data().productDescription,
        productPrice: doc.data().productPrice,
        productDiscount: doc.data().productDiscount,
        productImageUrl: doc.data().productUrl,
        productID: doc.data().productID,
        productGST: doc.data().productGST,
        productSelling: doc.data().productSelling,
        productCode: doc.data().productCode,  
        productSeller: doc.data().productSeller,
        productCatagory: doc.data().productCatagory,
        productSubCatagory: doc.data().productSubCatagory,
        ListImageUrl: doc.data().listImageUri,
        productNameHindi: doc.data().productNameHindi,
        productForDelivery: doc.data().forDelivery,
        productStatus: doc.data().productStatus
      }));
      

      setData(items);


      
    });

    return () => {
      unsubscribe();
    };
  }, []);





  const renderItem = ({ item }) => (
    <View style={{margin:2, height:90,width:70,  justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
      <View style={{position:'absolute', height:60, width:60, backgroundColor:'white', borderRadius:40, overflow:'hidden'}}>
      <TouchableOpacity onPress={()=>searchCategory(String(item.search))} >
      <ImageBackground source={item.items} style={{width: 60,borderRadius:30,overflow:'hidden', height: 60, justifyContent:'center', alignItems:'center'}}>
      </ImageBackground>
      </TouchableOpacity>
      </View>
      {/* <Text style={{fontSize:15}}>{item.category}</Text> */}




      <Text style={{fontSize:13,fontWeight:'900',position:'absolute', bottom:0, color:'black'}}>{item.category}</Text>


      {/* <View style={{alignItems: "center", position:'absolute',bottom:0}}>
      <Text style={{fontSize:13,fontWeight:'900',height:'50', position:'absolute', bottom:0, color:'black'}}>{item.category}</Text>
    
      </View> */}
    </View>
  );

  return (
    
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>

      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />

      


      <ImageBackground
        source={require('../../assets/home_Background.jpg')}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          elevation: 100,
        }}>

        


      <ScrollView>
        
        <Text style={{fontSize:20,alignSelf:'center',padding:10,color:'red',fontWeight:'900'}} >Wishlist Products</Text>

        <FlatList
          style={{
            width: '100%',
            paddingEnd: 15,
            // marginEnd: 15,
            marginStart: 15,
            marginTop:10,
            
            alignSelf:'center',
            flex: 1,
            alignContent: 'center',
          }}
          numColumns={2}
          horizontal={false}
          data={data}
          keyExtractor={item => item.productID}
          renderItem={({item}) => (
            <ItemCardSaved
              productName={item.productName}
              productID={item.productID}
              productPrice={item.productPrice}
              productDiscount={item.productDiscount}
              productUrl={item.productImageUrl}
              navigation={navigation}
              productDescription={item.productDescription}
              productGST={item.productGST}
              productSelling={item.productSelling}
              productCode={item.productCode}
              ListImageURL={item.ListImageUrl}
              productSeller={item.productSeller}
              productCatagory={item.productCatagory}
              productSubCatagory={item.productSubCatagory}
              productNameHindi={item.productNameHindi}
              productForDelivery={item.productForDelivery}
              productStatus = {item.productStatus}

            />
          )}
        />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
