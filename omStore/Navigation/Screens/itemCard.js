import React from 'react';
import { View, Text, StyleSheet, ImageBackground,TouchableOpacity} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const ItemCard = ({productName,productListUrl,productSeller,forDelivery,daily,productHindiName,productCategory,productSubCategory, productDescription, productUrl, productPrice,  productDiscount, productID,productCode, productGST, productSelling, navigation}) => {

  
  
  

  const onitemClick = () => {
    // ToastAndroid.show("Changing Screens", ToastAndroid.SHORT);

    navigation.navigate('ProductViewScreen', {productID: productID, 
                                              productName: productName, 
                                              productDescription: productDescription, 
                                              productPrice: productPrice, 
                                              productDiscount: productDiscount, 
                                              productUrl: productUrl,
                                              productListUrl: productListUrl,
                                            productGST: productGST,
                                          productCode: productCode,
                                        productSelling: productSelling,
                                      productCategory: productCategory,
                                    productSubCategory: productSubCategory,
                                  productHindiName: productHindiName,
                                forDelivery: forDelivery,
                                productSeller: productSeller,
                                daily: daily,});
    
  }

  const Stack = createNativeStackNavigator();
  

  return (

    <TouchableOpacity onPress={() => onitemClick()}>
    <View style={styles.card} >

      
      <ImageBackground source={{ uri: productUrl }} style={styles.image} onPress={()=>onitemClick()}>
      </ImageBackground>


      <View style={styles.details}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productDiscount}>Discount: {productDiscount}</Text>
        <Text style={styles.productDiscount}>MRP: {productPrice}</Text>

      </View>
      </View>

    </TouchableOpacity>

    
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    color:'black',
  },
  productName: {
    fontSize: 18,
    color:'black',
    marginBottom: 5,
  },
  productDiscount: {
    color: '#e74c3c',
  },
});

export default ItemCard;
