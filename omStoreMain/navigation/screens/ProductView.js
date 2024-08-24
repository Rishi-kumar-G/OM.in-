import React , {useEffect,useState} from 'react'
import {View, Text, ToastAndroid,ScrollView,BackHandler, TouchableOpacity ,ImageBackground, StyleSheet, Image, TextInput} from 'react-native'
// import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';

export default function ProductView({route, navigation}) {

    let {productID,images,productNameHindi, productForDelivery,productCatagory,productStatus, productSubCatagory,productName,productSeller ,productCode, productSelling,productDescription, productPrice, productDiscount, productUrl, ListImageURL,productGST} = route.params;

    const productSP = parseInt(productPrice) - parseInt(productDiscount);
const [userEmail , setUserEmail] = useState('');

    const [productCount, setproductCount] = useState(1);
    const [isSpinnerVisible, setisSpinnerVisible] = useState(false);
    const [isModalVisible, setisModalVisible] = useState(false);
    const [index, setindex] = useState(0);
    const [note,setNote] = useState("");

    const [Images, setimages] = useState([
        productUrl, ListImageURL
      ]);



      

      

      

    if(productStatus == "" || productStatus == null){
        productStatus = "Available";
    }



    var path = RNFS.DocumentDirectoryPath + '/test.txt';

    
    if(productGST == '0' || productGST == 0){
        productGST = 'Paid';
    }
    else{
        productGST = String(productGST)+'%';
    }
   

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
    

    console.log(images);

    const onIncrease = ()=>{
        setproductCount(productCount + 1)
    }

    const onDecrease = ()=>{
        if(productCount > 1){
        setproductCount(productCount - 1)
        }
    }

      
  const uploadProductDetails = async () => {

    if(ListImageURL==null || ListImageURL == ""){
        ListImageURL = "";
    }
    
      setisSpinnerVisible(true)
      const sellingPrice = (parseInt(productPrice) + (parseInt(productGST)/100)*parseInt(productPrice) ) - parseInt(productDiscount);
      const usersCollection = firestore().collection('users').doc(auth().currentUser.email).collection("fav").doc(productID);
      usersCollection.set({
        
        productID: productID,
        productName: productName,
        productDescription: productDescription,
        productPrice: productPrice,
        productDiscount: productDiscount,
        productUrl: productUrl,
        listImageUri: ListImageURL,
        productSelling: productSelling,
        productCode: productCode,
        productGST: productGST,


      }).then(() => {
        console.log('Product Saved!');
        setisSpinnerVisible(false)
  
        ToastAndroid.show("Product Saved ", ToastAndroid.SHORT);

      });
    }

    const onAddCart = async ()=>{

        setisSpinnerVisible(true);
        // setUserEmail(auth().currentUser.email);
        
        
        firestore().collection('cart').doc(auth().currentUser.email).collection('products').doc(productID).set({
            productID: productID,
            productName: productName,
            productDescription: productDescription,
            productPrice: productPrice,
            productDiscount: productDiscount,
            productUrl: productUrl,
            listImageUri: ListImageURL,
            productSelling: productSelling,
            productCode: productCode,
            productGST: productGST,
            productCount: productCount,
            
        }).then(() => {
    
            setisSpinnerVisible(false);
          ToastAndroid.show('Added to Cart', ToastAndroid.SHORT);
          navigation.goBack();
          
    
        }).catch((error) => {
            console.log(error.message);
            setisSpinnerVisible(false);
            ToastAndroid.show('Failed to add. Please try again.', ToastAndroid.SHORT);

        });
        

    }
  
  return (
    <>
    <ScrollView style={{height:'100%', flex:1,backgroundColor:'white'}}>

        <Modal 
        isVisible={isModalVisible}
        onBackdropPress={() => setisModalVisible(false)}
        onSwipeComplete={() => setisModalVisible(false)}
        onBackButtonPress={() => setisModalVisible(false)}
        swipeDirection="down"
        style={{justifyContent: 'flex-end', margin: 0,}}
        >
        <View style={{backgroundColor:'white', height:'100%', width:'100%', borderRadius:10, padding:10}}>
            <ImageViewer
                imageUrls={images}
                renderIndicator={() => null}

                style={{height: 300, flex:1, }}
                />
        </View>
        </Modal>

        <Spinner visible={isSpinnerVisible} textContent={'Adding ...'} textStyle={{color:'white'}} />

        <ImageViewer
                        imageUrls={images}
                        renderIndicator={() => null}
                        backgroundColor='white'


                        style={{height: 300, flex:1 }}
                        />
        

        



        
        <Text style={{color:'red',padding:5,alignSelf:'center', textAlign:'center'}}>{productForDelivery}</Text>

        <TouchableOpacity onPress={uploadProductDetails} >
        <Text style={{color:'pink',fontSize:20, fontWeight:900,alignSelf:'center' }} >+Add To WishList</Text>
        </TouchableOpacity>

        <Text style={[style.productDescription,{textAlign:'right' , top:90,color:'blue',fontWeight:'bold'}]}>{productStatus}</Text>
        <View style={{flexDirection:'row'}}>

        <Text style={style.productTitle}>{productName}</Text>


        <Text style={style.productDiscount}>-{productDiscount}₹ off</Text>
        </View>
        
        <Text style={style.productTitle}>{productNameHindi}</Text>

        <Text style={style.productTitle}>{productCode}</Text>
        <Text style={style.productDescription}>{productCatagory} , {productSubCatagory}</Text>

        


        <Text style={style.productDescription}>by:{productSeller}</Text>
        <Text style={style.productDescription}>GST: {productGST}</Text>

        <Text style={style.productDescription}>{productDescription}</Text>

        <Text style={{ textDecorationLine:'line-through', margin:10, color:'black', fontSize:20}} >₹{parseInt(productPrice) + (parseInt(productGST)/100*parseInt(productPrice)) }</Text>
        <Text style={{ margin:10, color:'green', fontSize:25}} >₹{productSelling} only</Text>

        


    </ScrollView>

  

    <Text style={{color:'grey',backgroundColor:'white', textAlign:'right', paddingEnd:15}} >{productCount}X{productSelling}={parseInt(productSelling)*parseInt(productCount) }</Text>
    <View style={{ width:'95%',backgroundColor:'white' ,alignSelf:'baseline', height:60, flexDirection:'row',margin:5 ,paddingBottom:15}}>
    
    <View style={{width:'50%',backgroundColor:'white' ,alignContent:'center',alignItems:'center' ,justifyContent:"center"}}>

        <View style={{flexDirection:'row',backgroundColor:'white', marginTop:10}}>
            <TouchableOpacity onPress={onDecrease}>
                <Text style={{color:'black', fontSize:30}}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={{color:'black', fontSize:30, marginStart:10, marginEnd:10}}>{productCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onIncrease}>
                <Text style={{color:'black', fontSize:30}}>+</Text>
            </TouchableOpacity>



        </View>

    </View>

    <View style={{width:'50%' }}>

        <TouchableOpacity onPress={onAddCart} style={{backgroundColor:'red',borderRadius:15 ,width:'100%', height:'100%', margin:5, padding:5, alignItems:'center',alignContent:'center' ,justifyContent:'center'}}>
            <Text style={{fontSize:15,padding:10 ,flex:1,color:'white',width:'100%',fontWeight:'600',textAlign:'center',justifyContent:'center', alignSelf:'center',height:'100%'}}>+Add</Text>
        </TouchableOpacity>


    </View>
    
</View>
</>
  )
}

const style = StyleSheet.create({

    productTitle:{
        flex:1,

        fontSize:30,
        flex:1,
        margin:10,
        fontWeight:'900',
        color:'black',



    },

    productDiscount:{
        color:'red',
        fontWeight:'600',
        margin:10,
        fontSize:30

    },

    productDescription:{

        margin:10,
        fontSize:18,
        
        color:'grey',


    }


}

    

)
