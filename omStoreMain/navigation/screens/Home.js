import React, {useEffect, useState} from 'react';
import {Text, View,StyleSheet, ImageBackground, FlatList, TextInput, Image, TouchableOpacity, ToastAndroid, ScrollView, BackHandler, LogBox, Alert} from 'react-native';
// import  {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ItemCard from './ItemCard';
import Spinner from 'react-native-loading-spinner-overlay';

import ItemDaily from './ItemDaily';

const Category_data = [
  { category: 'Technical\nCategory', items: require('../../assets/all.png') ,search:''},

  { category: 'Electrical \n& Spare', items: require('../../assets/electrical.jpeg'),search:'Electrical' },
  { category: 'Electronics \n Home Appliance', items: require('../../assets/electronics.jpeg'),search:'Electronics' },
  { category: 'Hardware \n Products', items: require('../../assets/nutbolt.jpeg'),search:'Hardware'},
  { category: 'Tap Fittings \n& Sanitery', items: require('../../assets/tape.jpeg'),search:'Tape Fitting'},
  { category: 'Tools & \nPower Tools', items: require('../../assets/hardware.jpeg'),search:'Tools And PowerTools'},
  { category: 'Washing\nMachine Spare', items: require('../../assets/washing.jpg'),search:'Washing Machine Spare'},
  { category: 'Mixi\nSpare', items: require('../../assets/mixi.jpg'),search:'Mixi Spare'},  
  { category: 'Provision &\nBakery', items: require('../../assets/bakery.jpeg') ,search:'Bakery'},
  { category: 'Garments', items: require('../../assets/garments.jpeg'),search:'Garments'},
  { category: 'Kirana &\n Dry Fruits', items: require('../../assets/kirana.jpeg'),search:'Kirana'},
  { category: 'Fresh Vegi\n&  Fruits', items: require('../../assets/vegitables.jpeg') ,search:'Veg Fresh & Fruits'},
  { category: 'Cosmatics', items: require('../../assets/cosmatics.jpeg'),search:'Cosmatics'},
  { category: 'Sweets \n& Namkeen', items: require('../../assets/sweets.jpeg'),search:'Sweets And Namkeen' },
  { category: 'Food Deleviry', items: require('../../assets/foodDeliviry.png'),search:'Food Delivery' },
  { category: 'Pooja &\nAggarbatti',items: require('../../assets/pooja.jpeg'), search: 'Pooja' },
  { category: 'Stationary',items: require('../../assets/stationary.jpeg'), search: 'Stationary' },
  { category: 'Games \n& Sports',items: require('../../assets/sports.jpeg'), search: 'Games' },
  { category: 'General\n& Plastic',items: require('../../assets/plastic.jpeg'), search: 'Plastic Product' },
  { category: 'Shoes &\nSleepers',items: require('../../assets/shoes.jpeg'), search: 'Shoes And Slippers' },
  { category: 'Home Care',items: require('../../assets/HomeCare.jpeg'), search: 'Home Care Products' },
  { category: 'Mobile &\nLaptop Accessories',items: require('../../assets/mobile.jpeg'), search: 'Mobile Accessories' },
  { category: 'Furniture',items: require('../../assets/furniture.jpeg'), search: 'Furniture' },
  { category: 'Gifts',items: require('../../assets/gifts.jpeg'), search: 'Gifts' },
  { category: 'Service Providers', items: require('../../assets/service.png') ,search:'Servie Providers'},
  { category: 'Om Carrier', items: require('../../assets/carrier.jpeg') ,search:'Om Carrior'},
  // Add more categories as needed
];


export default function Home({navigation, route}) {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dailyData , setDailyData] = useState([]);
  const [searchQuerry, setSearchQuerry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ImagesData, setImagesData] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);


  useEffect(() => {
    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // showExitConfirmation();
        setSearchQuerry("");
  
        return true; 
      }
    );

    return () => backHandlerSubscription.remove();
  }, [navigation]);

  const showExitConfirmation = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ]
    );
  };


  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
       [{ text: 'OK' }],
      { cancelable: true },
    );
  };


  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding:1
    },
    imageContainer: {
      alignItems: 'center',
      margin:10,
    },
    image: {
      width: 15,
      height: 15,

    },
    text: {
      fontSize: 12,
      color: 'black',
      textAlign: 'center',
    },
  });
  



  const collectionRef = firestore().collection('products');
//main products data
  useEffect(() => {
    // Reference to your Firestore collection
    // const collectionRef = firestore().collection('products');

    const filter = [

      Category_data[0].search,Category_data[1].search,Category_data[2].search,Category_data[3].search,Category_data[4].search,
      Category_data[5].search,

    ];

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs
     // Filter based on productCatagory
    .map(doc => ({
      productName: doc.data().productName,
      productDescription: doc.data().productDescription,
      productPrice: doc.data().productPrice,
      productDiscount: doc.data().productDiscount,
      productImageUrl: doc.data().productImageUrl,
      productID: doc.data().productID,
      productGST: doc.data().productGST,
      productSelling: doc.data().productSelling,
      productCode: doc.data().productCode,
      productSeller: doc.data().productSeller,
      productCatagory: doc.data().productCatagory,
      productSubCatagory: doc.data().productSubCatagory,
      ListImageUrl: doc.data().productListImageUrl,
      productNameHindi: doc.data().productNameHindi,
      productForDelivery: doc.data().forDelivery,
      productStatus: doc.data().productStatus
    }));

    const homeData = items.filter(doc => filter.includes(doc.productCatagory));
      

      setAllProducts(items);
      setData(homeData);

      
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //daily deal products data
  useEffect(() => {
    // Reference to your Firestore collection
    const collectionRef = firestore().collection('products').where('daily', '!=', '0');

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        productName: doc.data().productName,
        productDescription: doc.data().productDescription,
        productPrice: doc.data().productPrice,
        productDiscount: doc.data().productDiscount,
        productImageUrl: doc.data().productImageUrl,
        productID: doc.data().productID,
        productGST: doc.data().productGST,
        productSelling: doc.data().productSelling,
        productCode: doc.data().productCode,  
        productSeller: doc.data().productSeller,
        productCatagory: doc.data().productCatagory,
        productSubCatagory: doc.data().productSubCatagory,
        ListImageUrl: doc.data().productListImageUrl,
        productNameHindi: doc.data().productNameHindi,
        productForDelivery: doc.data().forDelivery,
        daily : doc.data().daily,
        productStatus: doc.data().productStatus

      }));

      const sortedData = items.sort((objA, objB) => {
        // Handle potential cases where 'daily' might be null or undefined
        const dailyA = parseInt(objA.daily || '0', 10); // Convert 'daily' to integer (assign 0 if missing)
        const dailyB = parseInt(objB.daily || '0', 10); // Convert 'daily' to integer (assign 0 if missing)
      
        // Sort numerically in descending order
        return dailyB - dailyA;
      });

      console.log(sortedData);

      
      

      setDailyData(sortedData);


      
    });

    return () => {
      unsubscribe();
    };
  }, []);



  
 //for photo of ads
  useEffect(() => {
    // Reference to your Firestore collection
    const collectionRef = firestore().collection('adphoto');

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
       url: doc.data().url,
      }));
      setIsLoadingImages(false);
      

      setImagesData(items);

      console.log(ImagesData);      
    });

    return () => {
      unsubscribe();
    };
  }, []);


  
  
  
  


  async function searchProducts(query) {

    setIsLoading(true);
    
    query = query.toLowerCase();
    query = query.replace(/ /g, '')

    
    if(query != ""){


    const filtered = allProducts.filter(item =>{
      
      var lowerProductName = item.productName.toLowerCase();
      lowerProductName = lowerProductName.replace(/ /g,'');
      var productNameMatch = lowerProductName.includes(query);
      return productNameMatch;

    })

    setFilterData(filtered);

    setData(filtered);
    setIsLoading(false);

  }
  else{

    setData(allProducts);
    setIsLoading(false)

  }



  }


  async function searchCategory(query) {
    setIsLoading(true);
    
    if(query != ''){
     
    
    const filtered = allProducts.filter(item =>{
      
      var lowerProductName = item.productCatagory;
     
      var productNameMatch = lowerProductName==(query);
      return productNameMatch;

    })

    if(filtered.length == 0){
      showAlert("No Products" , "No Currently Available Products");
    }



    setIsLoading(false);
    setData(filtered); 

  }
  else{


    const filter = [

      Category_data[0].search,Category_data[1].search,Category_data[2].search,Category_data[3].search,Category_data[4].search,
      Category_data[5].search,

    ];

    const filtered = allProducts.filter(doc => filter.includes(doc.productCatagory));

    setData(filtered);
    setIsLoading(false);
  }
  

}

const onSaved = ()=>{
    navigation.navigate("ProductSaved");
}



  const renderItem = ({ item }) => (
    <View
      style={{
        margin: 10,
        height: 140,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          position: 'absolute',
          height: 60,
          width: 60,
          backgroundColor: 'white',
          borderRadius: 40,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity onPress={() => searchCategory(String(item.search))}>
          <ImageBackground
            source={item.items}
            style={{
              width: 60,
              borderRadius: 30,
              overflow: 'hidden',
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            imageStyle={{ resizeMode: 'cover' }}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '900',
          position: 'absolute',
          top: 95,
          textAlign:'center',
          color: 'black',
          flex: 1,
          flexWrap: 'wrap',
        }}
      >
        {item.category}
      </Text>
    </View>
  );

  const Toolbar = () => {
    const image1 = { uri: require('../../assets/list.png'), text: 'Index' };
    const image2 = { uri: require('../../assets/coupon.png'), text: 'Voucher' };
    const image3 = { uri: require('../../assets/wallet.png'), text: 'Wallet' };
    const image4 = { uri: require('../../assets/wishlist.png'), text: 'Wish List' };
   

  
    return (
      <View style={styles.container}>
        <View key={image1.text} style={styles.imageContainer}>
          <Image source={image1.uri} style={styles.image} />
          <Text style={styles.text}>{image1.text}</Text>
        </View>
        <View key={image2.text} style={styles.imageContainer}>
          <Image source={image2.uri} style={styles.image} />
          <Text style={styles.text}>{image2.text}</Text>
        </View>
        <View key={image3.text} style={styles.imageContainer}>
          <Image source={image3.uri} style={styles.image} />
          <Text style={styles.text}>{image3.text}</Text>
        </View>

        <View key={image3.text} style={styles.imageContainer}>
          <Image source={require('../../assets/filter.png')} style={styles.image} />
          <Text style={styles.text}>Filter</Text>
        </View>

        <TouchableOpacity onPress={onSaved} >

        <View key={image4.text} style={styles.imageContainer}>
          <Image source={image4.uri} style={styles.image} />
          <Text style={styles.text}>{image4.text}</Text>
        </View>
        </TouchableOpacity>
      </View>
    );
  };


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

          <Toolbar></Toolbar>



      <ScrollView>
        <Text
          style={{
            fontSize: 48,
            color: 'white',
            width: '100%',
            padding: 15,
            paddingTop: 35,
            fontWeight: '900',
            textAlign: 'center',
            fontFamily: 'impact',
          }}>
          OM.in
        </Text>

        <Text
          style={{
            fontSize: 28,
            color: 'white',
            width: '100%',
            
            
            fontWeight: '900',
            textAlign: 'center',
            fontFamily: 'impact',
          }}>
          आधे दाम की दुकान
        </Text>

        <FlatList 
        horizontal
        style={{margin:20,marginBottom:0,borderRadius:10,backgroundColor:'white', borderWidth:1 ,flex:1, height:200}}
        data={ImagesData}
        indicatorStyle={{backgroundColor:'white',height:10, width:10, borderRadius:5, margin:5}}
        // indicatorStyle='white'
        showsHorizontalScrollIndicator={true}
        
        keyExtractor={(item) => item.url}
        renderItem={({item}) => (
          <View style={{flex:1,width:300, height:195, marginBottom:5}}>
      <Spinner
        visible={isLoadingImages}
        textContent={''}
        textStyle={{color: '#FFF'}}
        style={{height:200}}
      />
          <ImageBackground overflow='hidden' source={{uri:item.url}} style={{flex:1, height:200, resizeMode:'contain',marginRight:2,borderRadius:5,overflow:'hidden'}}></ImageBackground>
          </View>
        )}
        />

        <Text style={{textAlign:'center',top:-40,fontSize:60,color:'black' }}>. . . . .</Text>

        <Text style={{fontSize: 20,textDecorationLine:'underline',top:-65, color: 'red',textAlign:'center', padding: 15, fontWeight: '900'}}> Deals of The Day </Text>

<FlatList
          removeClippedSubviews={true}
          style={{
            width: '100%',
            paddingEnd: 15,
            // marginEnd: 15,
            marginStart: 15,
            marginTop:10,
            alignSelf:'center',
            flex: 1,
            top:-85,
            alignContent: 'center',
            
          }}
          
          horizontal={true}
          data={dailyData}
          keyExtractor={item => item.productID}
          renderItem={({item}) => (
            <ItemDaily
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

          <View style={{flexDirection:'row', top:-85}}>
        <TextInput
          style={{
            padding: 10,
            color: 'grey',
            paddingStart: 15,
            margin: 15,
            marginEnd:0,
            backgroundColor: 'white',
            borderWidth:0.5,
            borderColor:'grey',
            borderRadius: 15,
            flex:1,
          }}
          placeholder="Search"
          placeholderTextColor={'grey'}
          
          onChangeText={(text) => setSearchQuerry(text)}
          ></TextInput>
          <TouchableOpacity onPress={()=>searchProducts(searchQuerry)}>

          <Image source={require('../../assets/search.png')} style={{width: 30, height: 30, margin: 15,tintColor:'black', alignSelf:'center',justifyContent:'center', alignItems:'center'}}>
          </Image>
          </TouchableOpacity>
          </View>

          

          

          <Text style={{top:-45, marginStart:10, fontSize:18,fontWeight:'900',color:'red'}}>Select Your Category:</Text>


        <FlatList
              horizontal
              
              style={{maxHeight:150,top:-85}}
              data={Category_data}
              keyExtractor={(item) => item.category}
              
              renderItem={renderItem}
            />



        <FlatList
          style={{
            width: '100%',
            paddingEnd: 15,
            // marginEnd: 15,
            marginStart: 15,
            marginTop:10,
            top:-85,
            alignSelf:'center',
            flex: 1,
            alignContent: 'center',
          }}
          numColumns={2}
          horizontal={false}
          data={data}
          keyExtractor={item => item.productID}
          renderItem={({item}) => (
            <ItemCard
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

export {Category_data};
