import React , {useState, useEffect}from 'react'
import {Text, TouchableOpacity, View, FlatList, ScrollView, Image, ToastAndroid} from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore';
import PostCard from './PostCard';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import SellerCard from './SellerCard';

export default function SettingScreen() {

  const [postOffice, setPostOffice] = useState("");
  const [deleveryCharge, setDeleveryCharge] = useState("");
  const [data, setData] = useState([]);
  const [Sellerdata, setSellerData] = useState([]);

  const [selectedImage, setSelectedImage] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [sellerName, setSellerName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [helpNo, setHelpNo] = useState("");
  const [deliveryNo, setDeliveryNo] = useState("");

  function generateUniqueId() {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36
    const randomPart = Math.random().toString(36).substr(2,5); // Generate a random string
  
    // Combine the timestamp and random part to create a unique ID
    const uniqueId = timestamp + randomPart;
  
    return uniqueId;
  }

  const onChangeQRCode = ()=>{

  }



  const onPostAdd = () => {

    
    if(postOffice != "" || deleveryCharge != ""){
    firestore().collection('data').doc(postOffice).set({
      postName:String(postOffice),
      postValue: String(deleveryCharge),
    }).then(() => {
      
    });
  }else{
    ToastAndroid.show("Please Fill All Fields", ToastAndroid.SHORT);
  }
    
  }

  const onSellerAdd = () => {

    
    if(sellerName != "" ){
    firestore().collection('seller').doc(sellerName).set({
      sellerName:String(sellerName),
      
    }).then(() => {
      ToastAndroid.show("Seller Added", ToastAndroid.SHORT);
      
    });
  }else{
    ToastAndroid.show("Please Fill All Fields", ToastAndroid.SHORT);
  }
    
  }

  const setHelplineNO = () => {

    
    if(helpNo != "" ){
    firestore().collection('helpline').doc('contactUs').set({
      phone:String(helpNo),
      
    }).then(() => {
      ToastAndroid.show("Helpline Updated", ToastAndroid.SHORT);
      
    });
  }else{
    ToastAndroid.show("Please Fill All Fields", ToastAndroid.SHORT);
  }
    
  }

  const updateDeliveryNo = () => {

    
    if(deliveryNo != "" ){
    firestore().collection('helpline').doc('delivery').set({
      phone:String(deliveryNo),
      
    }).then(() => {
      ToastAndroid.show("Delivery Updated", ToastAndroid.SHORT);
      
    });
  }else{
    ToastAndroid.show("Please Fill All Fields", ToastAndroid.SHORT);
  }
    
  }

  useEffect(() => {
    // Reference to your Firestore collection
    const collectionRef = firestore().collection('data');

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        
        postName: doc.data().postName,
        postValue: doc.data().postValue,

      }));
      setData(items);
    });



    


    return () => {
      unsubscribe();
    };
  }, []);


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
  


  const chooseImage = async (s) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setSpinner(true);
      setSelectedImage({ uri: image.path });

      

      const reference = storage().ref("/qrcode" + String(s));
      reference.putFile(String(image.path)).then(async () => {
        const url = await reference.getDownloadURL();
        console.log(url);
        firestore().collection('qrcode').doc('qrcode'+String(s)).set({
          qrcode: url,
        }).then(() => {
          
          setSpinner(false);
        ToastAndroid.show("Image Uploaded"+ url, ToastAndroid.SHORT);
          
        });

      })


    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  useEffect(() => {
    // Reference to your Firestore collection
    const collectionRef = firestore().collection('qrcode');

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        
        qrcode: doc.data().qrcode,
        

      }));
      setSelectedImage({uri:items[0].qrcode});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const AddAdPhoto = async () => {

    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        // cropping: true,
        multiple:true,
      });

      
      setSpinner(true);

      // console.log(image);

      for(let i=1; i<=image.length; i++){

        const reference = storage().ref("/adphoto/u"+String(i));

      reference.putFile(String(image[i-1].path)).then(async () => {
        const url = await reference.getDownloadURL();
        console.log(url);
        firestore().collection('adphoto').doc(String(i)).set({
          url: url,
        }).then(() => {
          if(i==image.length){
            setSpinner(false);
            ToastAndroid.show("Images Uploaded", ToastAndroid.SHORT);
          }
        });

      })
      }
     


    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }

  }



  const UpdatePassword = async () => {

    const passwordDoc = await firestore().collection('password').doc('password').get();
    const oldPas = passwordDoc.data().password;

    if(oldPassword == oldPas){
      firestore().collection('password').doc('password').update({
        password: newPassword,
      }).then(() => {
        ToastAndroid.show("Password Updated", ToastAndroid.SHORT);
      });

    }else{
      ToastAndroid.show("Wrong Password", ToastAndroid.SHORT);
    }



  }


  return (
    <ScrollView>
      <Spinner
          visible={spinner}
          textContent={'Uploading...'}
          textStyle={{color:'white'}}
        />
    <View>
        <View style={{margin:10}} >
        <Text style={{color:'black', fontSize:16}}>Enter Post office:</Text>
        <TextInput style={{}} onChangeText={(text) => setPostOffice(String(text))} value={postOffice}  placeholder='Post Office Name'></TextInput>
        
        </View>

        <View style={{margin:10}} >
        <Text style={{color:'black', fontSize:16}}>Delevery Charge:</Text>
        <TextInput style={{}} onChangeText={(text) => setDeleveryCharge(String(text))} value={deleveryCharge}  placeholder='Post Office Delevery Charge' keyboardType='numeric'></TextInput>

        
        </View>


        <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={onPostAdd}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>+Add</Text>

          </TouchableOpacity>
        </View>   

        <FlatList
        nestedScrollEnabled
        style={{margin:20, maxHeight:200}}
        data={data}
        keyExtractor={(item) => item.postName}
        renderItem={({ item }) => <PostCard postOffice={item.postName} 

                                            deleveryCharge={item.postValue}
                                            postId={item.postId}
        
                                           />}
      />

      <View style={{margin:10}} >
        <Text style={{color:'black', fontSize:16}}>Seller Name:</Text>
        <TextInput style={{}} onChangeText={(text) => setSellerName(String(text))} value={sellerName}  placeholder='Seller Name'></TextInput>

        
        </View>


        <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={onSellerAdd}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>+Add Seller</Text>

          </TouchableOpacity>
        </View>

        <FlatList
        nestedScrollEnabled
        style={{margin:20, maxHeight:200}}
        data={Sellerdata}
        keyExtractor={(item) => item.sellerName}
        renderItem={({ item }) =><SellerCard sellerName={item.sellerName}/> }
      />

      <View style={{borderRadius:10,width:'90%', height:300 ,borderWidth:0.5, borderColor:'#9b59b6', alignSelf:'center'}}>
        <Image  style={{height:'100%', width:'100%', overflow:'hidden'}} source={selectedImage}>
           
        </Image>


      </View>

      <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={() =>chooseImage('1')}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>Change Qr Code 1</Text>

          </TouchableOpacity>
      </View>  

      <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={() => chooseImage('2')}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>Change Qr Code 2</Text>

          </TouchableOpacity>
      </View>  

      <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={()=>chooseImage('3')}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>Change Qr Code 3</Text>

          </TouchableOpacity>
      </View>  

      <View style={{margin:10}} >
        <Text style={{color:'black', fontSize:16}}>Enter Old:</Text>
        <TextInput style={{}} onChangeText={(text) => setOldPassword(String(text))} value={oldPassword} ></TextInput>
        
        </View>

        <View style={{margin:10}} >
        <Text style={{color:'black', fontSize:16}}>New Password</Text>
        <TextInput style={{}} onChangeText={(text) => setNewPassword(String(text))} value={newPassword} ></TextInput>

        
        </View>

        <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={UpdatePassword}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>Update</Text>

          </TouchableOpacity>
        </View>   

        <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={AddAdPhoto}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>Upload Ad Photo</Text>

          </TouchableOpacity>
        </View>  

        <View style={{margin:10}} >
        <Text style={{color:'black', fontSize:16}}>Helpline No.</Text>
        <TextInput style={{}} onChangeText={(text) => setHelpNo(String(text))} value={helpNo} ></TextInput>

        
        </View>

        <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={setHelplineNO}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>Update</Text>

          </TouchableOpacity>
        </View> 

        <View style={{margin:10}} >
        <Text style={{color:'black', fontSize:16}}>Delivery No.</Text>
        <TextInput style={{}} onChangeText={(text) => setDeliveryNo(String(text))} value={deliveryNo} ></TextInput>

        
        </View>

        <View style={{margin:10, padding:16, borderRadius:10,justifyContent:'center', alignItems:'center', backgroundColor:'#9b59b6'}} >
          <TouchableOpacity onPress={updateDeliveryNo}>
            <Text style={{color:'white', fontSize:16, fontWeight:'900'}}>Update</Text>

          </TouchableOpacity>
        </View> 

 



      
    </View>
    </ScrollView>
  )
}
