import React from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity, ToastAndroid, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';


const ItemCardSaved = ({productName,productStatus,productForDelivery,productNameHindi,productCatagory, productSubCatagory,productCode,productSeller, productGST, productSelling, productDescription, productUrl, productPrice,  productDiscount, productID,ListImageURL, navigation}) => {

  
  const onitemClick = () => {

    let images = [
      {
        url: productUrl,
      }
    ];

    if (ListImageURL != null || ListImageURL != undefined || ListImageURL != '') {
      images.push({
        url: ListImageURL,
      });
    }



    navigation.navigate("ProductView",  {productID: productID, 
                                        productName: productName, 
                                        productDescription: productDescription, 
                                        productPrice: productPrice, 
                                        productDiscount: productDiscount, 
                                        productUrl: productUrl,
                                        productCode: productCode,
                                        productGST: productGST,
                                        productSelling: productSelling,
                                        ListImageURL: ListImageURL,
                                        productSeller: productSeller,
                                        productCatagory: productCatagory,
                                        productSubCatagory: productSubCatagory,
                                        productNameHindi: productNameHindi,
                                        productForDelivery: productForDelivery,
                                        images: images,
                                        productStatus:productStatus,  
                                      })
    
    
  }

  function onLongPress(){
    Alert.alert(
      "Remove Product",
      "Do you want to remove this product from wishlist?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Remove", onPress: () => {firestore()
          .collection('users').doc('rishikumargautam2005@gmail.com')
          .collection('fav')
          .doc(productID)
          .delete()
          .then(() => {
          ToastAndroid.show('Product Removed From Wishlist', ToastAndroid.SHORT);
          
         });
      }}
      ],
      { cancelable: false }
    );
   
  }

  

  const ProductSP =parseInt(productPrice) - parseInt(productDiscount);
  productSelling = parseInt(productSelling)/1;


  return (

    <TouchableOpacity style={{width:'50%', padding:5, paddingEnd:5,paddingStart:0}} onPress={onitemClick} onLongPress={onLongPress}>
    <View style={styles.card}>

      <Image source={{ uri: productUrl }} style={styles.image} />

        <View style={{flexDirection:'row'}}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productDiscount}>-{productDiscount}₹</Text>

        </View>
        <View style={{flexDirection:'row', alignSelf:'baseline'}}>
        <Text style={{alignSelf:'flex-start', flex:1,textDecorationLine:'line-through',color:'black', marginStart:5, marginTop:10}}>₹{parseInt(productPrice) + (parseInt(productGST)/100)*parseInt(productPrice) }</Text>
        <Text style={{color:'green', fontWeight:'900',  marginEnd:5, marginTop:10}}>₹{productSelling}</Text>
        </View>

        
      
      </View>

    </TouchableOpacity>

    
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 10,
    alignSelf:'center',
    height:200,
    backgroundColor:'white',
    flex:1,
    width:'100%',
    margin:5,
    elevation:5,
    

  },
  image: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
    overflow:'hidden',
    
    
  },
  details: {
    // flex: 1,
    color:'black',
  },
  productName: {
    fontSize: 16,
    color:'black',
    textAlign:'left',
    alignSelf:'flex-start',
    height:18,
    flex:1,

    // // marginLeft:10,
    // margin:10,
    marginStart:5,
    fontWeight:'700',
  },
  productDiscount: {
    color: '#e74c3c',
    alignSelf:'flex-end',
    fontSize:15,
    height:18,
    fontWeight:'900',
    marginEnd:5,

  },
});

export default ItemCardSaved;
