import React,{useState,useEffect} from 'react'
import { ImageBackground,BackHandler,StyleSheet, Pressable,TextInput, ScrollView, Text, View, ToastAndroid, Button, TouchableOpacity } from 'react-native'
import ItemCard from './itemCard'
import Product from '../ItemData';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import storage from '@react-native-firebase/storage';
import { Modal } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';


function ProductView({route, navigation}) {


  const [spinner, setSpinner] = useState(false);
  const [ImageModal, setmodal] = useState(false);
  const [inImage, setInImage] = useState(false);
  const [inListImage, setLnInImage] = useState(false);

  const productCollection = firestore().collection('products');

  let {productID,productStatus,daily,productListUrl,forDelivery,productSeller, productName,productHindiName,productCategory,productSubCategory, productDescription, productPrice, productDiscount, productUrl, productGST, productCode, productSelling} = route.params;
  const productMRP = parseInt(productPrice) -parseInt(productDiscount);

  if(productStatus==undefined || productStatus==null || productStatus==''){
    productStatus = "Available";
    
  }
  
  const [updateProducName, setUpdateProductName] = useState(productName);
  const [updateProductHindiName , setUpdateProductHindiName] = useState(productHindiName);
  const [updateProductCategory, setUpdateProductCategory] = useState(productCategory);
  const [updateProductSubCategory, setUpdateProductSubCategory] = useState(productSubCategory);
  const [updateProductDescription, setUpdateProductDescription] = useState(productDescription);
  const [updateProductPrice, setUpdateProductPrice] = useState(productPrice);
  const [updateProductDiscount, setUpdateProductDiscount] = useState(productDiscount);
  const [updateProductGST, setUpdateProductGST] = useState(productGST);
  const [updateProductCode, setUpdateProductCode] = useState(productCode);
  const [updateProductSelling, setUpdateProductSelling] = useState(productSelling);
  const [updateProductSeller, setUpdateProductSeller] = useState(productSeller);
  const [updateDaily  , setUpdateDaily] = useState(daily);
  const [updateForDelivery, setUpdateForDelivery] = useState(forDelivery);
  const [updateProductStatus, setUpdateProductStatus] = useState(productStatus);

  const [inputPass, setInputPass] = useState("");
  const [passWordModal , setPassWordModal] = useState(false);


 
  

  const deleteProduct = async (productID) => {

    setSpinner(true)

    try {

      await storage().refFromURL(productUrl).delete();
      await firestore().collection('products').doc(productID).delete();
      ToastAndroid.show('Product deleted successfully!', ToastAndroid.SHORT);
      setSpinner(false)
      navigation.goBack();

    } catch (error) {
      console.error(error);
      setSpinner(false)
      ToastAndroid.show('Error deleting product!', ToastAndroid.SHORT);
    }
  }

 

  const onUpdate = async () => {
    setSpinner(true);

    if (daily == '' || daily == null || daily == undefined) {
      setUpdateDaily('0');
    }

    if (forDelivery == '' || forDelivery == null || forDelivery == undefined) {
      setUpdateForDelivery(" ");
    }
    if(updateDaily == '' || updateDaily == null || updateDaily == undefined){
      setUpdateDaily('0');
    }

    ToastAndroid.show('Updating product...', ToastAndroid.SHORT);
    // ToastAndroid.show(toString(updateProductPrice)+toString(updateProductGST)+toString(updateProductDiscount), ToastAndroid.SHORT);
    const sellingPrice = (parseInt(updateProductPrice) + (parseInt(updateProductGST)/100)*parseInt(updateProductPrice) ) - parseInt(updateProductDiscount);

    setUpdateProductSelling(parseInt(updateProductPrice)*parseInt(updateProductGST)/100 + parseInt(updateProductPrice)-parseInt(updateProductDiscount));
    const updatedFields = {
      productName: updateProducName,
      productDescription: updateProductDescription,
      productPrice: updateProductPrice,
      productDiscount: updateProductDiscount,
      productGST: updateProductGST,
      productCode: updateProductCode,
      productSelling: sellingPrice,
      productNameHindi: updateProductHindiName,
      productCatagory: updateProductCategory,
      productSubCatagory: updateProductSubCategory,
      productSeller: updateProductSeller,
      daily: updateDaily,
      forDelivery: updateForDelivery,
      productStatus: updateProductStatus,
    };
    if(updatedFields.daily==undefined){
      updatedFields.daily="0";
    }
    console.log('Fields to be updated:', updatedFields);

    const collectionRef = firestore().collection('products').doc(productID);
    await collectionRef.update(updatedFields)
      .then(() => {
        setSpinner(false);
        ToastAndroid.show('Product updated successfully!', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.error("Error updating product: ", error);
        setSpinner(false);
        ToastAndroid.show('Error updating product!', ToastAndroid.SHORT);
      });
  }

  // Rest of the code...
  
  const checkPassword = async () => {
    try {
      // Fetch password from Firestore
      const passwordDoc = await firestore().collection('password').doc('password').get();
      const password = passwordDoc.data().password;
  
      // Verify password
      if (password === inputPass) {
        setPassWordModal(true);
        // Perform actions if password is correct
      } else {
        // Perform actions if password is incorrect
        alert('Incorrect password!');
      }
    } catch (error) {
      console.log('Error fetching password:', error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
      
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);


  const takePicture = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {

      setInImage(false);
      console.log(image.path);

      storage().ref('products/' + productID).putFile(image.path).then((snapshot) => {
        console.log('Uploaded a data_url string!');

          const downloadURL= storage().ref('products/' + productID).getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);

          firestore().collection('products').doc(productID).update({
            productImageUrl: downloadURL

          }).then(() => {
            
            ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
          }).catch((error) => {
            console.error("Error updating product: ", error);
            
            ToastAndroid.show('Error updating product!', ToastAndroid.SHORT);
          }
          );
          
          
          });

      });

      setmodal(false);


      
    });
        
  }

  

  const chooseImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setInImage(true);
      console.log(image);
      
      storage().ref('products/' + productID).putFile(image.path).then((snapshot) => {
        console.log('Uploaded a data_url string!');
        storage.ref('products/'+productID).getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);

          firestore().collection('products').doc(productID).update({
            productUrl: downloadURL

          }).then(() => {
            setSpinner(false);
            ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
          }).catch((error) => {
            console.error("Error updating product: ", error);
            setSpinner(false);
            ToastAndroid.show('Error updating product!', ToastAndroid.SHORT);
          }
          );
          
        });
      });
      




      
      setmodal(false);
      

    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };



  const takeListPicture = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {

      setInImage(false);
      console.log(image.path);

      storage().ref('listImages/' + productID).putFile(image.path).then((snapshot) => {
        console.log('Uploaded a data_url string!');

          storage().ref('listImages/' + productID).getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);

          firestore().collection('products').doc(productID).update({
            productListImageUrl: downloadURL

          }).then(() => {
            ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
          }).catch((error) => {
            console.error("Error updating product: ", error);
            
            ToastAndroid.show('Error updating product!', ToastAndroid.SHORT);
          }
          );
          
          
          });

      });

      setLnInImage(false);


      
    });
        
  }

  

  const chooseListImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setInImage(true);
      console.log(image);
      
      storage().ref('listimage/' + productID).putFile(image.path).then((snapshot) => {
        console.log('Uploaded a data_url string!');
        storage().ref('listImages/' + productID).getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);

          firestore().collection('products').doc(productID).update({
            productListImageUrl: downloadURL

          }).then(() => {
            setSpinner(false);
            ToastAndroid.show('Image uploaded successfully!', ToastAndroid.SHORT);
          }).catch((error) => {
            console.error("Error updating product: ", error);
            setSpinner(false);
            ToastAndroid.show('Error updating product!', ToastAndroid.SHORT);
          }
          );
          
        });
      });
      




      
      setLnInImage(false);

      

    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };





  const onDeleteImage = async () => {
    setSpinner(true);
    ToastAndroid.show('Deleting image...', ToastAndroid.SHORT);
    try {
      await storage().refFromURL(productUrl).delete();
      await firestore().collection('products').doc(productID).update({
        productImageUrl: ''
      });
      setSpinner(false);
      ToastAndroid.show('Image deleted successfully!', ToastAndroid.SHORT);
      // navigation.goBack();
    } catch (error) {
      console.error(error);
      setSpinner(false);
      ToastAndroid.show('Error deleting image!', ToastAndroid.SHORT);
    }
  }


  const onDeleteListImage = async () => {
    setSpinner(true);
    ToastAndroid.show('Deleting List image...', ToastAndroid.SHORT);
    try {
      await storage().refFromURL(productListUrl).delete();
      await firestore().collection('products').doc(productID).update({
        productListImageUrl: ''
      });
      setSpinner(false);
      ToastAndroid.show('List Image deleted successfully!', ToastAndroid.SHORT);
      // navigation.goBack();
    } catch (error) {
      console.error(error);
      setSpinner(false);
      ToastAndroid.show('Error deleting list image!', ToastAndroid.SHORT);
    }
  }


  
  return (

    
    <>

    <Modal
        animationType="slide"
        transparent={true}
        visible={inImage}
        onRequestClose={()=>setInImage(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={ takePicture}>
              <Text style={styles.modalOptionText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={chooseImage}>
              <Text style={styles.modalOptionText}>Open Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={()=>setmodal(false)}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={inListImage}
        onRequestClose={()=>setLnInImage(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={ takeListPicture}>
              <Text style={styles.modalOptionText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={chooseListImage}>
              <Text style={styles.modalOptionText}>Open Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={()=>setmodal(false)}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

<Modal
        animationType="slide"
        transparent={true}
        visible={!passWordModal}
        
        onRequestClose={()=>navigation.goBack()}
      >
        <View style={{flex: 1,
    justifyContent: 'center',
    alignItems: 'center',marginBottom:20}}>

          <View style={{backgroundColor:'white', borderRadius:10, padding:20, margin:20}}>

          <Text style={{fontSize:20, fontWeight:'bold', color:'black'}}>Enter Password</Text>
          <TextInput inputMode='numeric' onChangeText={(text) => setInputPass(text)} style={{borderWidth:1, borderColor:'gray', borderRadius:10, padding:10,color:'black', marginTop:10}} placeholder="Enter Password" secureTextEntry={true} ></TextInput>
          <TouchableOpacity onPress={checkPassword} style={{backgroundColor:'purple',justifyContent:'center',alignItems:'center', padding:10, borderRadius:10, marginTop:10}}>
            <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Submit</Text>
          </TouchableOpacity>

          </View>

          

          
        </View>
      </Modal>
    <ScrollView>
    <Spinner
          visible={spinner}
          textContent={'Uploading...'}
          textStyle={{color:'white'}}
          
          onRequestClose={() => setSpinner(false)}
          onBackButtonPress={() => setSpinner(false)}
        />

      <ImageBackground style={{flex: 1,
                    
                    height: 300,
                    resizeMode: 'contain'}} source={{uri:productUrl}}></ImageBackground>

      <TouchableOpacity onPress={()=>onDeleteImage()}>
      <Text style={{marginLeft:10, fontSize:15, color:'black',textAlign:'right' ,marginRight:10,marginTop:10 }}>Delete Image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>setInImage(true)}>
      <Text style={{marginLeft:10, fontSize:15, color:'black',textAlign:'right',marginRight:10 ,marginTop:10}}>Upload Image</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={()=>onDeleteListImage()}>
      <Text style={{marginLeft:10, fontSize:15, color:'black',textAlign:'right' ,marginRight:10,marginTop:10 }}>Delete List Image</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>setLnInImage(true)}>
      <Text style={{marginLeft:10, fontSize:15, color:'black',textAlign:'right',marginRight:10 ,marginTop:10}}>Upload list Image</Text>
      </TouchableOpacity>
      



      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Daily(put 1 for Daily Deal) :</Text>
      <TextInput style={{margin:10, fontSize:30, fontWeight:'800',  color:'black', borderWidth:0.5, borderColor:'black', borderRadius:10}} onChangeText={(text) => setUpdateDaily(text) } >{daily}</TextInput>


      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>For delivery :</Text>
      <TextInput style={{margin:10, fontSize:30, fontWeight:'800',  color:'black', borderWidth:0.5, borderColor:'black', borderRadius:10}}  onChangeText={(text) => setUpdateForDelivery(text)}>{forDelivery}</TextInput>


      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Name :</Text>
      <TextInput style={{margin:10, fontSize:30, fontWeight:'800',  color:'black', borderWidth:0.5, borderColor:'black', borderRadius:10}} onChangeText={(text) => setUpdateProductName(text)}>{updateProducName}</TextInput>


      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Hindi Name :</Text>
      <TextInput style={{margin:10, fontSize:30, fontWeight:'800',  color:'black', borderWidth:0.5, borderColor:'black', borderRadius:10}}  onChangeText={(text) => setUpdateProductHindiName(text)}>{updateProductHindiName}</TextInput>
      
      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Category :</Text>
      <TextInput style={{margin:10, fontSize:30, fontWeight:'800',  color:'black', borderWidth:0.5, borderColor:'black', borderRadius:10}}  onChangeText={(text) => setUpdateProductCategory(text)}>{updateProductCategory}</TextInput>
      
      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Sub Category :</Text>
      <TextInput style={{margin:10, fontSize:30, fontWeight:'800',  color:'black', borderWidth:0.5, borderColor:'black', borderRadius:10}} onChangeText={(text) => setUpdateProductSubCategory(text)}>{updateProductSubCategory}</TextInput>

      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Seller:</Text>
      <TextInput style={{margin:10, fontSize:30, fontWeight:'800',  color:'black', borderWidth:0.5, borderColor:'black', borderRadius:10}}  onChangeText={(text) => setUpdateProductSeller(text)}>{updateProductSeller}</TextInput>

      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Description:</Text>
      <TextInput style={{marginLeft:10, fontSize:20, color:'grey', borderWidth:0.5, borderColor:'black', borderRadius:10}}  onChangeText={(text) => setUpdateProductDescription(text)}>{updateProductDescription}</TextInput>

      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Produst Status:</Text>
      <TextInput style={{marginLeft:10, fontSize:20, color:'grey', borderWidth:0.5, borderColor:'black', borderRadius:10}}  onChangeText={(text) => setUpdateProductStatus(text)}>{updateProductStatus}</TextInput>
      
      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Product Code :</Text>
      <TextInput style={{marginLeft:10, fontSize:15, color:'black',borderWidth:0.5, borderColor:'black', borderRadius:10 }} 
      onChangeText={(text) => setUpdateProductCode(text)}
      >{updateProductCode}</TextInput>

      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Price :</Text>
      <TextInput 
      
      onChangeText={(text) => setUpdateProductPrice(text)}
      style={{marginLeft:10, fontSize:15, color:'black',borderWidth:0.5, borderColor:'black', borderRadius:10 }}>{updateProductPrice}</TextInput>

      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>GST :</Text>
      <TextInput 
      
      onChangeText={(text) => setUpdateProductGST(text)}
      style={{marginLeft:10, fontSize:15, color:'black',borderWidth:0.5, borderColor:'black', borderRadius:10 }}>{updateProductGST}</TextInput>

      <Text style={{marginLeft:10, fontSize:15, color:'black'}}>Discount :</Text>
      <TextInput 
      
      onChangeText={(text) => setUpdateProductDiscount(text)}

      style={{marginLeft:10, fontSize:15, color:'black',borderWidth:0.5, borderColor:'black', borderRadius:10 }}>{updateProductDiscount}</TextInput>

      <Text style={{marginLeft:10, fontSize:20, color:'black', textAlign:'center'}}>{updateProductSelling}</Text>

      


    </ScrollView>
    <View style={{height:70, 
      alignContent:'center', 
      justifyContent:'center', flexDirection:'row'}}  >
        <View style={{flex:1, justifyContent:'center', alignContent:'center'}}>

        <TouchableOpacity onPress={onUpdate} style={{margin:5, flex:1, justifyContent:'center', alignContent:'center', borderRadius:5, backgroundColor:'red' }}>

          <Text style={{ alignSelf:'center',fontSize:20, textAlign:'center' ,fontWeight:'600', color:'white'}}>Update</Text>
        </TouchableOpacity>

        
        </View>
        <TouchableOpacity onPress={() => deleteProduct(productID)}
        style={{margin:5, flex:1, justifyContent:'center', alignContent:'center', borderRadius:5, backgroundColor:'red'}}>
          <Text style={{ alignSelf:'center',fontSize:20, textAlign:'center' ,fontWeight:'600', color:'white'}}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    
    color: 'black',
  },
  button: {
    marginTop: 20,
    padding:20, 

  },



  //For Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
     
  },
  modalText: {
    fontSize: 20,
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'lightblue',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: 'black',
  },


  //Drop Down Styles

  dropdowncontainer: {
    backgroundColor: '',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    // color: 'black',
  },
  icon: {
    marginRight: 5,
  },
  dropdownlabel: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color:'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color:'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color:'black',
  },

});

export default ProductView;

