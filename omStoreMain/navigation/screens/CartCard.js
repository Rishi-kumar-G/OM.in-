import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import Spinner from 'react-native-loading-spinner-overlay';


export default function CartCard({
  productName,
  userEmail,
  productCount,
  productDescription,
  productUrl,
  productPrice,
  productDiscount,
  productID,
  productGST,
  navigation,
  productSellig,
}) {
  const productSP = parseInt(productPrice) - parseInt(productDiscount);

  const [isSpinnerVisible, setisSpinnerVisible] = useState(false);

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: 'grey',
      backgroundColor: 'white',
      padding: 0,
      margin: 10,
      borderRadius: 10,
      elevation: 10,

      // height: 150,
    },
    image: {
      // width: 120,
      // height: 150,
      height:'100%',
      flex:1,
      marginRight: 10,
      borderRadius: 10,
      overflow: 'hidden',
      // alignItems:'center',
      // alignSelf:'center',
      // justifyContent:'center',
      // resizeMode: 'contain',
    },
    details: {
      flex: 1,
      color: 'black',
    },
    productName: {
      fontSize: 18,
      color: 'black',
      marginBottom: 5,
    },
    productDiscount: {
      color: 'grey',
      textDecorationLine: 'line-through',
    },
  });

  // RNFS.readFile(path, 'utf8')
  // .then(contents => {
  //   setuserEmail(contents);
  //   setisSpinnerVisible(false);

  // })
  // .catch(err => {
  //   console.log(err.message);
  // });

  


  const onDeleteItem = async () => {
    try {
      setisSpinnerVisible(true);
      ToastAndroid.show('Deleting ' + userEmail + productID, ToastAndroid.SHORT);
      
  
      await firestore()
        .collection('cart')
        .doc(String(userEmail))
        .collection('products')
        .doc(String(productID))
        .delete();
  
      ToastAndroid.show('Deleted', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error removing document: ', error);
      ToastAndroid.show('Failed to delete. Please try again.', ToastAndroid.SHORT);
    } finally {
      setisSpinnerVisible(false);
    }
  };

  const handleDelete = async () => {
    if (onDeleteItem) {
      await onDeleteItem();
    }
  };




  return (
    // <TouchableOpacity >
    <View style={styles.card}>
      <Spinner visible={isSpinnerVisible} textContent={'Deleting'} textStyle={{ color: 'white' }} />
      <ImageBackground
        source={{ uri: productUrl }}
        style={styles.image}
        onPress={() => onitemClick()}></ImageBackground>

      <View style={styles.details}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productDiscount}>₹{(parseInt(productPrice) + (parseInt(productGST) / 100) * parseInt(productPrice))}</Text>
        <Text style={{ color: 'green', fontSize: 18 }}>₹{productSellig}</Text>
        <Text style={{ color: 'grey', fontSize: 12 }}>Qty: {productCount}</Text>
        <Text style={{ color: 'green', fontSize: 16 }}>
          Total: ₹{parseInt(productSellig) * parseInt(productCount)}
        </Text>
      </View>

      <View>
        <TouchableOpacity onPress={handleDelete}>
          <Image
            source={require('../../assets/Delete.png')}
            onPress={onDeleteItem}
            style={{ width: 30, height: 30, margin: 10, marginEnd: 20 }}></Image>
        </TouchableOpacity>
      </View>
    </View>

    // </TouchableOpacity>
  );
}
