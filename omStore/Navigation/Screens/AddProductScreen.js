import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button,TouchableOpacity, StyleSheet, ScrollView,Pressable, ImageBackground, ToastAndroid } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';

import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';

const Catagory = [
  { label: 'Electrical', CatagoryValue: 'Electrical' },
  { label: 'Electronics', CatagoryValue: 'Electronics' },
  { label: 'Hardware', CatagoryValue: 'Hardware' },
  { label: 'Tape Fitting', CatagoryValue: 'Tape Fitting' },
  { label: 'Tools And PowerTools', CatagoryValue: 'Tools And PowerTools' },
  { label: 'Machinery Agriculture', CatagoryValue: 'Machinery Agriculture' },
  { label: 'Paint', CatagoryValue: 'Paint' },
  { label: 'General Store', CatagoryValue: 'General Store' },
  { label: 'Kirana', CatagoryValue: 'Kirana' },
  { label: 'Veg Fresh & Fruits', CatagoryValue: 'Veg Fresh & Fruits' },
  { label: 'Cosmatics', CatagoryValue: '' },
  { label: 'Garments', CatagoryValue: 'Garments' },
  { label: 'Plastic Product', CatagoryValue: 'Plastic Product' },
  { label: 'Pooja', CatagoryValue: 'Pooja' },
  { label: 'Stationary', CatagoryValue: 'Stationary' },
  { label: 'Games', CatagoryValue: 'Games' },
  { label: 'Shoes And Slippers', CatagoryValue: 'Shoes And Slippers' },
  { label: 'Home Care Products', CatagoryValue: 'Home Care Products' },
  { label: 'Mobile Accessories', CatagoryValue: 'Mobile Accessories' },
  { label: 'Furniture', CatagoryValue: 'Furniture' },
  { label: 'Gifts', CatagoryValue: 'Gifts' },


  { label: 'Sweets And Namkeen', CatagoryValue: 'Sweets And Namkeen' },
  { label: 'Food Delivery', CatagoryValue: 'Food Delivery' },
  { label: 'Servie Providers', CatagoryValue: 'Servie Providers' },
  { label: 'Om Carrior', CatagoryValue: 'Om Carrior' },
  

];

const SubCatagory = [
  { label: 'Electrical Fitting Products', SubCatagoryValue: '1' },
  { label: 'Electrical Home Applaince', SubCatagoryValue: '2' },
  { label: 'Electrical Home Applaince (Spare)', SubCatagoryValue: '2' },

  { label: 'Electrical Power Fitting Products', SubCatagoryValue: '3' },
  { label: 'Electrical Service Providers', SubCatagoryValue: '4' },
  { label: 'Electronice Home Appliance', SubCatagoryValue: '5' },
  { label: 'Electronice Home Appliance(Spare)', SubCatagoryValue: '5' },

  { label: 'Electronice Service (Providers)', SubCatagoryValue: '6' },
  { label: 'Sweets', SubCatagoryValue: '7' },
  { label: 'Namkeens', SubCatagoryValue: '8' },
  { label: 'Fresh Vegetables', SubCatagoryValue: '8' },
  { label: 'Fresh Fruits', SubCatagoryValue: '8' },
  { label: 'Fresh Milk', SubCatagoryValue: '8' },
  { label: 'Under Garment', SubCatagoryValue: '8' },
  { label: 'Boys Cloths', SubCatagoryValue: '8' },
  { label: 'Girls Cloths', SubCatagoryValue: '8' },

  

  { label: 'Kirana Dal', SubCatagoryValue: '8' },
  { label: 'Kirana Meva', SubCatagoryValue: '8' },
  { label: 'Papad And Achar', SubCatagoryValue: '8' },

];

const forDeleviry = [
  { label: 'None', SubCatagoryValue: '1' },
  { label: 'Half Delivery Charge', SubCatagoryValue: '2' },
  { label: 'Quarter Delivery Charge', SubCatagoryValue: '2' },

  
  { label: 'Free Delivery', SubCatagoryValue: '3' },
  { label: 'Delivery With Your Help', SubCatagoryValue: '3' },

  
 
  

];

const productStatus = [
  { label: 'Available', SubCatagoryValue: '1' },
  { label: 'Not Available', SubCatagoryValue: '2' },
  { label: 'Available on Request', SubCatagoryValue: '2' },


];





const AddProductScreen = () => {
  const [productName, setProductName] = useState('');
  const [productNameHindi, setProductNameHindi] = useState('');

  const [productCode, setProductCode] = useState('');
  const [productGST, setProductGST] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDiscount, setProductDiscount] = useState('0');
  const [productID, setProductID] = useState(generateUniqueId());
  const [ImageUrl, setImageUrl] = useState('');
  const [ImageUri, updateImageUri] = useState("");
  const [ListImageUrl, setListImageUrl] = useState('');
  const [ListImageUri, updateListImageUri] = useState('');
  const [hasListImage, setHasListImage] = useState("no");
  const [_productStatus, setProductStatus] = useState("Available")

  const [spinner, setSpinner] = useState(false);
  const [inImage, setInImage] = useState(false);
  const [Listmodal, setListmodal] = useState(false);
  const [SellerModal, setSellerModal] = useState(false);
  const [inputPass, setInputPass] = useState("");
  const [ForDelivery, setForDelivery] = useState("");

  var imageLink = "";
  var imageUri ="";

  var ListimageLink = "";
  var ListimageUri ="";

  const [modal, setmodal] = useState(false);

  const [CatagoryValue, setCatagoryValue] = useState("Electrical");
  const [CatagoryisFocus, setCatagoryIsFocus] = useState(false);

  
  const [SubCatagoryValue, setSubCatagoryValue] = useState("Electrical Fitting Products");
  const [SubCatagoryisFocus, setSubCatagoryIsFocus] = useState(false);

  const [Seller, setSeller] = useState("");
  const [SellerData , setSellerData] = useState([]);
  const [SellerIsFocus, setSellerIsFocus] = useState(false);
  const [passWordModal, setPassWordModal] = useState(false);



    const CatagoryrenderLabel = () => {
      if (CatagoryValue || CatagoryisFocus) {
        return (
          <Text style={[styles.dropdownlabel, CatagoryisFocus && { color: 'black' }]}>
            Catagory
          </Text>
        );
      }
      return null;
    };

    const SubCatagoryrenderLabel = () => {
      if (CatagoryValue || CatagoryisFocus) {
        return (
          <Text style={[styles.dropdownlabel, CatagoryisFocus && { color: 'black' }]}>
            Sub Catagory
          </Text>
        );
      }
      return null;
    };

    const StatusRender = () => {
      if (CatagoryValue || CatagoryisFocus) {
        return (
          <Text style={[styles.dropdownlabel, CatagoryisFocus && { color: 'black' }]}>
            Status
          </Text>
        );
      }
      return null;
    };

    const DeliviryRender = () => {
      if (CatagoryValue || CatagoryisFocus) {
        return (
          <Text style={[styles.dropdownlabel, CatagoryisFocus && { color: 'black' }]}>
            For Delivery
          </Text>
        );
      }
      return null;
    };

    const SellerRenderLable = () => {
      if (CatagoryValue || CatagoryisFocus) {
        return (
          <Text style={[styles.dropdownlabel, SellerIsFocus && { color: 'black' }]}>
            Sold By
          </Text>
        );
      }
      return null;
    };
  
   

  const clearData = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductGST('');
    setProductDiscount('0');
    setProductID(generateUniqueId());
    imageLink = "";
    ListImageUrl = "";
    updateImageUri("");

  }

  function generateUniqueId() {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36
    const randomPart = Math.random().toString(36).substr(2,5); // Generate a random string
  
    // Combine the timestamp and random part to create a unique ID
    const uniqueId = timestamp + randomPart;
  
    return uniqueId;
  }



  const uploadProductDetails = async () => {

  let search = '';
  for (let i = 0; i < productName.length; i++) {
    if (productName[i] !== ' ') {
      search += productName[i];
    }
  }



  
  ToastAndroid.show(search.toLowerCase(), ToastAndroid.SHORT);

    if(CatagoryValue == null || CatagoryValue == ""){
      setCatagoryValue("Electrical");
    }
    if(SubCatagoryValue == null || SubCatagoryValue == ""){
      setSubCatagoryValue("Electrical Fitting Products");
    }
    const sellingPrice = (parseInt(productPrice) + (parseInt(productGST)/100)*parseInt(productPrice) ) - parseInt(productDiscount);
    const usersCollection = firestore().collection('products').doc(productID);
    usersCollection.set({
      productName: productName,
      productDescription: productDescription,
      productPrice: productPrice,
      productDiscount: productDiscount,
      productImageUrl: imageLink,
      productID: productID,
      productCode: productCode,
      productGST: productGST,
      productSelling: sellingPrice,
      productNameHindi: productNameHindi,
      productCatagory: CatagoryValue,
      productSubCatagory: SubCatagoryValue,
      productSeller: Seller,
      productListImageUrl: ListimageLink,
      hasListImage: hasListImage,
      productSeller: Seller,
      forDelivery: ForDelivery,
      productStatus: _productStatus,
      search: search.toLowerCase(),
    }).then(() => {
      console.log('Product added!');
      setSpinner(false);

      ToastAndroid.show("Product Added ", ToastAndroid.SHORT);
      clearData();
    });
  }

  const handleAddProduct = async () => {

    // if(productCode == '' || productGST == '' || productDescription == '' || productPrice == '' || productName == '' || CatagoryValue == null || SubCatagoryValue == null || Seller == ''|| imageUri==""){

    //   ToastAndroid.show("Please fill all the details", ToastAndroid.SHORT);
    //   return;

    // }

    setSpinner(true);

// Uncomment the code below to upload the photo to Firebase Storage

if(ListImageUri != "" ){

storage().ref("/products/"+productID.toString()).putFile(ImageUri).then(async () => {
  const url = await storage().ref("/products/"+productID.toString()).getDownloadURL();
  ToastAndroid.show("Image Uploaded url:"+ url, ToastAndroid.SHORT);

  storage().ref("/listImages/"+productID.toString()).putFile(ListImageUri).then(async () => {
  const ListImageurl = await storage().ref("/listImages/"+productID.toString()).getDownloadURL();
          
            //from url you can fetched the uploaded image easily
    setListImageUrl(ListImageurl);

    ToastAndroid.show("List Image Uploaded url:"+ url, ToastAndroid.SHORT);
    ListimageLink = ListImageurl;

    imageLink = url;
    uploadProductDetails();

  })


})

}
else{
  storage().ref("/products/"+productID.toString()).putFile(ImageUri).then(async () => {
    const url = await storage().ref("/products/"+productID.toString()).getDownloadURL();
    ToastAndroid.show("Image Uploaded url:"+ url, ToastAndroid.SHORT);
    imageLink = url;
    
    uploadProductDetails();
  })
}




    // uploadProductDetails();

    // storage().ref("/products/"+productID.toString()).putFile(ImageUri).then(async () => {
    //   const url = await storage().ref("/products/"+productID.toString()).getDownloadURL();
    //   ToastAndroid.show("Image Uploaded "+ url, ToastAndroid.SHORT);
    //   imageLink = url;

    // })

    
    // ToastAndroid.show(generateUniqueId() + productID, ToastAndroid.SHORT);

    // if(inImage){
    // const reference = storage().ref("/products"+productID.toString());
    // ToastAndroid.show("Image Uploding... " + "/products/"+productID.toString(), ToastAndroid.SHORT);
    // reference.putFile(ImageUri).then(() => { 
    //   const url =  reference.getDownloadURL();
    //   imageLink = url;
    //   ToastAndroid.show("Image Uploaded "+ imageLink, ToastAndroid.SHORT);
    //   uploadProductDetails();

    // })
    // ToastAndroid.show(ImageUri, ToastAndroid.SHORT);

    // storage().ref("/products/"+productID.toString()).putFile(ImageUri).then(async () => {
    //   const url = await storage().ref("/products/"+productID.toString()).getDownloadURL();
      
      
    //   imageLink = url;
    //   ToastAndroid.show("Image Uploaded "+ imageLink, ToastAndroid.SHORT);
    //   uploadProductDetails();

    // })




  // }else if(!inImage){
  //   imageLink = url;
  //   ToastAndroid.show("Image Uploaded "+ imageLink, ToastAndroid.SHORT);
  //   uploadProductDetails();

  // }

  };

  const chooseImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setInImage(true);
      console.log(image);
      updateImageUri(image.path);
      imageUri = image.path;
      
      setmodal(false);
      

    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const chooseListImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setInImage(true);
      setHasListImage("yes");
      console.log(image);
      updateListImageUri(image.path);
      ListimageUri = image.path;
      
      setListmodal(false);
      

    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };
  
  
  const takePicture = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {

      setInImage(true);
      setmodal(false);
      console.log(image.path);
      updateImageUri(image.path);
      imageUri = image.path;
      ToastAndroid.show(image.path, ToastAndroid.SHORT);
      ToastAndroid.show(imageUri, ToastAndroid.SHORT);

      
    });
        
  }

  const takeListPicture = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setHasListImage("yes");


      setInImage(true);
      setListmodal(false);
      console.log(image.path);
      updateListImageUri(image.path);
      ListimageUri = image.path;
      ToastAndroid.show(image.path, ToastAndroid.SHORT);
      ToastAndroid.show(ListimageUri, ToastAndroid.SHORT);

      
    });
        
  }

  
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
    // Reference to your Firestore collection
    const collectionRef = firestore().collection('seller');

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const items = snapshot.docs.map((doc) => ({
          
          sellerName: doc.data().sellerName,
          
  
        }));
        setSellerData(items);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  
  

  return (
    <>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={()=>setmodal(false)}
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
        visible={!passWordModal}
        onRequestClose={()=>setPassWordModal(false)}
      >
        <View style={styles.modalContainer}>

          <View style={{backgroundColor:'white', borderRadius:10, padding:20, margin:20}}>

          <Text style={{fontSize:20, fontWeight:'bold', color:'black'}}>Enter Password</Text>
          <TextInput onChangeText={(text) => setInputPass(text)} style={{borderWidth:1, borderColor:'gray', borderRadius:10, padding:10,color:'black', marginTop:10}} placeholder="Enter Password" secureTextEntry={true} ></TextInput>
          <TouchableOpacity onPress={checkPassword} style={{backgroundColor:'purple',justifyContent:'center',alignItems:'center', padding:10, borderRadius:10, marginTop:10}}>
            <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Submit</Text>
          </TouchableOpacity>

          </View>
      

          
        </View>
      </Modal>



      <Modal
        animationType="slide"
        transparent={true}
        visible={SellerModal}
        onRequestClose={()=>setSellerModal(false)}
      >
        <View style={{flex:1, alignContent:'center', justifyContent:'center', backgroundColor:'white', borderRadius:10, marginBottom:50, margin:20 }}>

          <FlatList

            data={SellerData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                setSellerModal(false);
                setSeller(item.sellerName)}} style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:10, backgroundColor:'white', borderRadius:10, borderWidth:1, borderColor:'gray'}} >
                <Text style={{color:'black', fontSize:16, fontWeight:'bold'}}>{item.sellerName}</Text>
              </TouchableOpacity>
            )}
          />
          
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={Listmodal}
        onRequestClose={()=>setListmodal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={ takeListPicture}>
              <Text style={styles.modalOptionText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={chooseListImage}>
              <Text style={styles.modalOptionText}>Open Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={()=>setListmodal(false)}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    <Spinner
          visible={spinner}
          textContent={'Uploading...'}
          textStyle={styles.spinnerTextStyle}
        />

    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.heading}>Add Product</Text>

      
      <ImageBackground  style={{height:200, borderRadius:10}} source={{uri: ImageUri}} >
        

        <TouchableOpacity onPress={() => setmodal(true)} style={{height:200, borderRadius:10, backgroundColor:'rgba(0,0,0,0)', justifyContent:'center', alignItems:'center'}} >
        </TouchableOpacity>
        {/* <Button style={{color:'purple'}} onPress={takePicture} title='Add Image' ></Button> */}

      </ImageBackground>

       
      <TouchableOpacity onPress={() => setListmodal(true)} style={{marginTop:10, padding:10, backgroundColor:'purple', borderRadius:10, justifyContent:'center', alignItems:'center'}} >
        <Text style={{color:'white'}}>+ Add List Image</Text>
      </TouchableOpacity>

        

      <Text style={styles.label}>Product Name:</Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productName}
        onChangeText={(text) => setProductName(text)}
      />

      <Text style={styles.label}>Product Name (Hindi): </Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productName}
        onChangeText={(text) => setProductNameHindi(text)}
      />

      {/* Catagory Drop Down */}
<View style={styles.dropdowncontainer}>
        {CatagoryrenderLabel()}
        <Dropdown
          style={[styles.dropdown, CatagoryisFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={Catagory}
          itemTextStyle={{ fontSize: 16, color:'black' }}
          search
          maxHeight={300}
          labelField="label"
          CatagoryValueField="CatagoryValue"
          placeholder={!CatagoryisFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          CatagoryValue={CatagoryValue}
          onFocus={() => setCatagoryIsFocus(true)}
          onBlur={() => setCatagoryIsFocus(false)}
          onChange={item => {
            // ToastAndroid.show(CatagoryValue, ToastAndroid.SHORT)
            setCatagoryValue(item.label);
            setCatagoryIsFocus(false);

            

          }}
          
        />
      </View>

      <Text style={styles.label}>Custom Catagory: </Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productName}
        onChangeText={(text) => setCatagoryValue(text)}
      />

      {/* // Sub Catagory Drop Down */}

      <View style={styles.dropdowncontainer}>
        {SubCatagoryrenderLabel()}
        <Dropdown
          style={[styles.dropdown, SubCatagoryisFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={SubCatagory}
          itemTextStyle={{ fontSize: 16, color:'black' }}
          search
          maxHeight={300}
          labelField="label"
          CatagoryValueField="SubCatagoryValue"
          placeholder={!SubCatagoryisFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          SubCatagoryValue={SubCatagoryValue}
          onFocus={() => setSubCatagoryIsFocus(true)}
          onBlur={() => setSubCatagoryIsFocus(false)}
          onChange={item => {
            // ToastAndroid.show(SubCatagoryValue, ToastAndroid.SHORT)

            setSubCatagoryValue(item.label);
            setSubCatagoryIsFocus(false);
            // console.log(item.label);

          }}
          
        />
      </View>


      <Text style={styles.label}>Custom Sub-Catagory: </Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productName}
        onChangeText={(text) => setSubCatagoryValue(text)}
      />

          {/* Drop Down For Seller */}
      
      <View >

        <TouchableOpacity onPress={() => setSellerModal(true)} style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:10,marginTop:10, backgroundColor:'white', borderRadius:10, borderWidth:1, borderColor:'gray'}} >
          <Text style={{color:'black', fontSize:16, fontWeight:'bold'}}>Sold By</Text>
          <Text style={{color:'black', fontSize:16, fontWeight:'bold'}}>{Seller}</Text>
        </TouchableOpacity>

      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between'}}>

      <View style={{ flex: 1, flexDirection:'column' , paddingEnd:10}}>
      <Text style={styles.label}>Product Code:</Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productCode}
        onChangeText={(text) => setProductCode(text)}
      />
      </View>

      <View style={{ flex: 1, flexDirection:'column' }}>

      <Text style={styles.label}>Product GST(%):</Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productGST}
        onChangeText={(text) => setProductGST(text)}
      />
      </View>

      </View>


      <Text style={styles.label}>Product Description:</Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productDescription}
        onChangeText={(text) => setProductDescription(text)}
      />

      {/* For Deleviry DropDown */}


<View style={styles.dropdowncontainer}>
        {DeliviryRender()}
        <Dropdown
          style={[styles.dropdown, SubCatagoryisFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={forDeleviry}
          itemTextStyle={{ fontSize: 16, color:'black' }}
          search
          maxHeight={300}
          labelField="label"
          CatagoryValueField="SubCatagoryValue"
          placeholder={!SubCatagoryisFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          SubCatagoryValue={SubCatagoryValue}
          onFocus={() => setSubCatagoryIsFocus(true)}
          onBlur={() => setSubCatagoryIsFocus(false)}
          onChange={item => {
            // ToastAndroid.show(SubCatagoryValue, ToastAndroid.SHORT)

            // setSubCatagoryValue(item.label);
            // setSubCatagoryIsFocus(false);
            setForDelivery(item.label);
            // console.log(item.label);

          }}
          
        />
      </View>

      {/* For Status DropDown */}

      <View style={styles.dropdowncontainer}>
        {StatusRender()}
        <Dropdown
          style={[styles.dropdown, SubCatagoryisFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={productStatus}
          itemTextStyle={{ fontSize: 16, color:'black' }}
          search
          maxHeight={300}
          labelField="label"
          CatagoryValueField="SubCatagoryValue"
          placeholder={!SubCatagoryisFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          SubCatagoryValue={productStatus}
          
          
          onChange={item => {
            // ToastAndroid.show(SubCatagoryValue, ToastAndroid.SHORT)

            setProductStatus(item.label);
            
            // console.log(item.label);

          }}
          
        />
      </View>

    

      <View style={{ flexDirection: 'row', paddingBottom:20 }}>

        <View style={{ flex: 1, flexDirection:'column' , paddingEnd:10}}>

      <Text style={styles.label}>Product Price:</Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productPrice}
        onChangeText={(text) => setProductPrice(text)}
        keyboardType="numeric"
      />

      </View>

      <View style={{ flex: 1, flexDirection:'column' }}>

      <Text style={styles.label}>Product Discount:</Text>
      <TextInput
        style={styles.input}
        CatagoryValue={productDiscount}
        onChangeText={(text) => setProductDiscount(text)}
        keyboardType="numeric"
      />

      </View>

      </View>

      <Button
        title="Add Product"
        onPress={handleAddProduct}
        style={styles.button}
      />
    </View>

    </ScrollView>
    </>
  );
};

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


export default AddProductScreen;