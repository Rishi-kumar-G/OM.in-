import React, {useState, useEffect} from 'react'
import {View, FlatList, TextInput,Image, TouchableOpacity, BackHandler} from 'react-native'
import firestore from '@react-native-firebase/firestore';
import ItemCard from './itemCard';
// import { Image } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

export default function MainScreen({navigation}) {
  const [data, setData] = useState([]);
  const [allProducts,setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading , setIsLoading] = useState(false);

  useEffect(() => {
    // Reference to your Firestore collection
    const collectionRef = firestore().collection('products');

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {

      const items = snapshot.docs.map((doc) => ({
        
        productName: doc.data().productName,
        productHindiName: doc.data().productNameHindi,
        productCategory: doc.data().productCatagory,
        productSubCategory: doc.data().productSubCatagory,
        productDescription: doc.data().productDescription,
        productPrice: doc.data().productPrice,
        productDiscount: doc.data().productDiscount,
        productImageUrl: doc.data().productImageUrl,
        productListImageUrl: doc.data().productListImageUrl,
        productID: doc.data().productID,
        productGST: doc.data().productGST,
        productCode: doc.data().productCode,
        productSelling: doc.data().productSelling,
        forDelivery:doc.data().forDelivery,
        productSeller:doc.data().productSeller,
        daily:doc.data().daily,
        productStatus: doc.data().productStatus
      }));
      setData(items);
      setAllProducts(items);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    const backAction = () => {
     setSearchQuery('');
      setData(allProducts);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  

  function search() {
    setIsLoading(true);
    
    try{
    const items = allProducts.filter((item) => {

      if(item.productName === undefined || item.productCategory === undefined || item.productCode === undefined || searchQuery === undefined || searchQuery === '' || item.productName === null || item.productCategory === null || item.productCode === null){
        return false;
      }

      const name = item.productName.toLowerCase().replace(/\s/g, '');
      const category = item.productCategory.toLowerCase().replace(/\s/g, '');
      const code = item.productCode.toLowerCase().replace(/\s/g, '');
      const search = searchQuery.toLowerCase().replace(/\s/g, '');
      // console.log(name, category, code, search);
      return name.includes(search) || category.includes(search) || code.includes(search);
    });
    setData(items); 
    setIsLoading(false);
  }catch(e){
    console.log(e);
    setIsLoading(false);  

  }
}


  return (
    <View>
      <Spinner
          visible={isLoading}
          textContent={'Loading...'}
          textStyle={{color:'#fff'}}
        />

<View style={{flexDirection:'row', justifyContent:'space-between', margin:10}}>

      <TextInput 
      onChangeText={(text) => setSearchQuery(text)}
      style={{margin:10, borderRadius:20, padding:10,flex:1, backgroundColor:'#a5b1c2'}} placeholder='Search' placeholderTextColor={'grey'}></TextInput>

      <TouchableOpacity onPress={search} >
        <Image style={{width:30, height:30, margin:10}} source={require('../../assests/icons/search.png')}></Image>
      </TouchableOpacity>
</View>

<View style={{flexDirection:'row', justifyContent:'space-between', margin:10}}>


</View>
      <FlatList
        data={data}
        // initialNumToRender={10}
        style={{marginBottom:100}}
        keyExtractor={(item) => item.productID}
        renderItem={({ item }) => <ItemCard productName={item.productName} 
                                            productID={item.productID}
                                            productPrice={item.productPrice}
                                            productDiscount={item.productDiscount}
                                            productUrl={item.productImageUrl}
                                            productListUrl={item.productListImageUrl}
                                            navigation={navigation}
                                            productDescription={item.productDescription} 
                                            productCode={item.productCode}
                                            productGST={item.productGST}
                                            productSelling={item.productSelling}
                                            productCategory={item.productCategory}
                                            productSubCategory={item.productSubCategory}
                                            productHindiName={item.productHindiName}
                                            forDelivery={item.forDelivery}
                                            productSeller={item.productSeller}
                                            daily={item.daily}
                                            productStatus={item.productStatus} />}
      />
    </View>
  )
}
