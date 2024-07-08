import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ScrollView,
  TextInput,
  BackHandler,
} from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from 'react-native-fs';
import CartCard from './CartCard';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { firebase } from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFetchBlob from 'rn-fetch-blob';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import auth from '@react-native-firebase/auth';

// import { PermissionsAndroid,Platform } from 'react-native';


function fixNumberFormat(numberString) {
  // Regular expression to match a number with an optional decimal point and trailing digits
  const pattern = /^(\d+\.?\d*)/;

  // Match the number part
  const match = numberString.match(pattern);

  // If there's no match, return the original string
  if (!match) {
    return numberString;
  }

  // Extract the matched number
  const numberPart = match[1];

  // Split the number at the decimal point (if present)
  const parts = numberPart.split('.');

  // If there's no decimal point, return the number with ".00" appended
  if (parts.length === 1) {
    return parts[0] + ".00";
  }

  // Ensure there are at most two digits after the decimal
  const decimalPart = parts[1].slice(0, 2);

  // Return the combined string with ".00" if decimal part is empty
  return parts[0] + (decimalPart ? `.${decimalPart}` : ".00");
}



export default function CartScreen({ navigation, route }) {
  // const [email] = route.params();
  // ToastAndroid.show(email, ToastAndroid.SHORT);

  const [userEmail, setuserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [userPost, setUserPost] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [orderAmount, setOrderAmount] = useState('');
  const [TotalDiscount, setTotalDiscount] = useState('');
  const [TotalCost, setTotalCost] = useState('');
  const [orderID, setOrderID] = useState('');
  const [RefferalCode, setRefferalCode] = useState('0000');
  const [data, setData] = useState([]);
  const [TotalAmount, setToatalAmount] = useState(0);
  const [IsEmpty, setIsEmpty] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSpinnerVisible, setisSpinnerVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [DeliviryCharge, setDeliveryCharge] = useState(0);
  const [postOffice, setPostOffice] = useState('');
  const [orderOTP, setOrderOTP] = useState('');
  const [BillPDFPath, setBillPDFPath] = useState('');
  const [AllItems, setAllItems] = useState('');
  const [forBill, setForBill] = useState('');
  const [loddingText, setLoaddingText] = useState('Please Wait...');
  var allItemString = '';

  const [qrCode1, setQrCode1] = useState('');
  const [qrCode2, setQrCode2] = useState('');
  const [qrCode3, setQrCode3] = useState('');

  //1 --> List Empty
  //0 --> List Not Empty

  var path = RNFS.DocumentDirectoryPath + '/test.txt';


  // setisSpinnerVisible(true);

  firestore().collection('qrcode').doc('qrcode1').get().then(doc => {
    if (doc.exists) {
      setQrCode1(doc.data().qrcode);
    }
  })

  firestore().collection('qrcode').doc('qrcode2').get().then(doc => {
    if (doc.exists) {
      setQrCode2(doc.data().qrcode);
    }
  })
  firestore().collection('qrcode').doc('qrcode3').get().then(doc => {
    if (doc.exists) {
      setQrCode3(doc.data().qrcode);
    }
  })

  if(DeliviryCharge == 0 || DeliviryCharge == ''|| DeliviryCharge=='0'){
    // setisSpinnerVisible(true);
    // ToastAndroid.show('1',ToastAndroid.SHORT);
  

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




  useEffect(() => {
    setLoaddingText('Please Wait...');
    setisSpinnerVisible(true);
    auth().currentUser.email;
    // ToastAndroid.show(auth().currentUser.email,ToastAndroid.SHORT);
    // Reference to your Firestore collection
    let contents = auth().currentUser.email;
      
      setuserEmail(contents);
      

      const collectionRef = firestore()
        .collection('cart')
        .doc(contents)
        .collection('products');

        firestore().collection('users').doc(auth().currentUser.email).get().then(doc => {
          if (doc.exists) {
            setPostOffice(doc.data().postOffice);
            setRefferalCode(doc.data().refferal);
      
            // ToastAndroid.show('2',ToastAndroid.SHORT);
      
            firestore().collection('data').doc(doc.data().postOffice).get().then(doc => {
              if (doc.exists) {
          // ToastAndroid.show('3',ToastAndroid.SHORT);
      
                setDeliveryCharge(doc.data().postValue);
                setisSpinnerVisible(false);
              } else {
                // doc.data() will be undefined in this case
                console.log('No such document! in post ');
                setisSpinnerVisible(false);
      
              }
            })
      
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document! in user');
            setisSpinnerVisible(false);
          }
        })

      const unsubscribe = collectionRef.onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({
          productName: doc.data().productName,
          productDescription: doc.data().productDescription,
          productPrice: doc.data().productPrice,
          productDiscount: doc.data().productDiscount,
          productImageUrl: doc.data().productUrl,
          productID: doc.data().productID,
          productCount: doc.data().productCount,
          productSelling: doc.data().productSelling,
          productGST: doc.data().productGST,
          productCode: doc.data().productCode,
        }));

        setData(items);

        if (items.length == 0) {
          setIsEmpty(1);
        } else {
          setIsEmpty(0);
        }

        var total = 0;
        var discount = 0;
        var totalCost = 0;
        var TotalSelling = 0;
        allItemString = '';

        for (let index = 0; index < items.length; index++) {
          const element = items[index];
          let product_Cost = 0;
          product_Cost = parseInt(element.productSelling) / 1 + parseInt(element.productDiscount);
          totalCost = totalCost + (parseInt(element.productPrice) + parseFloat(element.productPrice) * parseFloat(element.productGST) / 100) * parseInt(element.productCount);

          discount = discount + parseInt(element.productDiscount) * parseInt(element.productCount) / 1;
          TotalSelling = TotalSelling + parseInt(element.productSelling) * parseInt(element.productCount) / 1;



          // ToastAndroid.show(String(parseInt(element.productSelling) + parseInt(element.productDiscount)), ToastAndroid.SHORT);
          allItemString = allItemString + `<tr>
                <td >`+ element.productName + `</td>
                <td>`+ product_Cost + `</td>
                <td>`+ element.productGST + `</td>

                <td>`+ element.productDiscount + `</td>
                <td>`+ element.productCount + `</td>

                <td>`+ parseInt(element.productSelling) * parseInt(element.productCount) + ` </td>
                
                </tr>`;
        }
        total = totalCost - discount;


        setTotalDiscount(discount);
        setToatalAmount(TotalSelling);
        setTotalCost(totalCost);
        setAllItems(allItemString);
        setForBill(allItemString);
        // setisSpinnerVisible(false);
      });

      return () => {
        unsubscribe();
      };



    


  }, []);


  // });



  let onBuy = () => {
    var orderOTP = Math.floor(1000 + Math.random() * 9000);

    setLoaddingText('Please Wait...');
    setisSpinnerVisible(true);
    if (data.length == 0) {
      ToastAndroid.show('Cart is Empty', ToastAndroid.SHORT);
      setisSpinnerVisible(false);

      
      return;

    } else {

      var val = Math.floor(1000 + Math.random() * 9000);
      setOrderOTP(String(val));
      // const orderID = String(generateUUID(10));

      const date = new Date().getDate(); //Current Date
      const month = new Date().getMonth() + 1; //Current Month
      const year = new Date().getFullYear(); //Current Year

      const min = new Date().getMinutes(); //Current Minutes
      const sec = new Date().getSeconds(); //Current Seconds
      const hour = new Date().getHours(); //Current Hours

      const currentDate = date + '/' + month + '/' + year;
      const currentTime = hour + ':' + min;

      const orderID = String(year) + String(month) +String(date) +   String(hour) + String(min) + String(sec);

      let contents = auth().currentUser.email;
          setuserEmail(contents);

          firestore().collection('users').doc(contents).update({
            refferal: RefferalCode,
          })


          firestore()
            .collection('users')
            .doc(contents)
            .get()
            .then(doc => {
              if (doc.exists) {
                const userName = doc.data().name;
                const userPhone = doc.data().phone;
                const userAddress = doc.data().address;
                const userEmail = doc.data().email;
                const userPost = doc.data().postOffice;
                const refferal = doc.data().refferal;

                setUserName(userName);
                setUserPhone(userPhone);
                setUserAddress(userAddress);
                setUserPost(userPost);
                setOrderDate(currentDate);
                setOrderTime(currentTime);
                setOrderAmount(TotalAmount);
                setOrderID(orderID);
                setRefferalCode(refferal);



                //setting orders for order screen
                ToastAndroid.show('Uploading in Orders', ToastAndroid.SHORT);
                var AllItem = '';
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];

                  AllItem =
                    AllItem +
                    element.productName + " " + element.productSelling + ' x ' + element.productCount + ' = ₹' + parseInt(element.productSelling) * parseInt(element.productCount) + '\n';

                }

                AllItem = fixNumberFormat(AllItem);

                let string = `<h1 style="text-align: center; background-color: #f1f1f1; 
  ">InVoice</h1>

<h2 style="text-align: center; background-color: #f9f9f9; 
  ">Om Store</h2>

  <h5 style="text-align: center; 
  ">church road , minerva chauraha , jhansi +91 9451935427, +91 6386151853</h5>

<div style="flex-direction:column;">
<h4 style="text-align: left; padding-Left:3%; padding-Right:3%
  ">Invoice ID: ` + orderID + `</h4>
  <h4 style="text-align: left; padding-Left:3%; padding-Right:3% 
  ">Date :` + currentDate + `</h4>

</div>

<h4 style="text-align: left;  padding-Left:3%; padding-Right:3%
  ">Customer Name: ` + userName + `</h4>
  <h4 style="text-align: left;  padding-Left:3%; padding-Right:3%
  ">Customer Phone: `+ userPhone + `</h4>
  <h4 style="text-align: left; padding-Left:3%; padding-Right:3% 
  ">Customer Address:`+ userAddress + `</h4>

<table style="width:100%"; text-align:left;padding-Left:3%;padding-Right:3%;margin-Top:4%>
<tr>
<th>Product Name</th>
<th>Price</th>
<th>GST(%)</th>

<th>Discount</th>
<th>Quantity</th>

<th>Total</th>
</tr>

`+ AllItems + `




</table>

<h4 style="text-align: right;padding-Left:3%;padding-Right:3%;
  ">Total: ₹`+ TotalCost + `</h4>
  <h4 style="text-align: right; padding-Left:3%;padding-Right:3%;
  ">Delevery:₹`+ DeliviryCharge + `</h4>

  <h4 style="text-align: right; padding-Left:3%;padding-Right:3%;
  ">Discount:-₹`+ TotalDiscount + `</h4>
  <h4 style="text-align: right; padding-Left:3%;padding-Right:3%;
  ">Grand Total: ₹`+ TotalAmount + ` + ₹` + DeliviryCharge + `</h4>
  


`

                //uploading orders for store
                firestore()
                  .collection('orders')
                  .doc(String(orderID))
                  .set({
                    orderID: orderID,
                    orderDate: currentDate,
                    orderTime: currentTime,
                    orderAmount: TotalAmount,
                    orderStatus: 'Pending',
                    orderUserEmail: userEmail,
                    orderUserName: userName,
                    orderUserPhone: userPhone,
                    orderUserAddress: userAddress,
                    orderUserPost: userPost,
                    orderAllItem: AllItem,
                    orderDeleviryCharge: DeliviryCharge,
                    orderOTP: orderOTP,
                    forBill: forBill,
                    orderDiscount: TotalDiscount,
                    orderCost: TotalCost,
                    orderRefferal: RefferalCode,


                  })
                  .then(() => {


                    for (let index = 0; index < data.length; index++) {
                      const element = data[index];

                      firestore()
                        .collection('cart')
                        .doc(String(userEmail))
                        .collection('products')
                        .doc(String(element.productID))
                        .delete()
                        .then(() => {
                          if (index == data.length - 1) {
                            // ToastAndroid.show('Cart Cleared', ToastAndroid.SHORT);
                            ToastAndroid.show('Order Placed', ToastAndroid.SHORT);
                            setIsModalVisible(false);
                            setisSpinnerVisible(false);
                          }

                        })
                        .catch(error =>
                          console.error('Error removing document: ', error),
                        );
                    }

                    createPDF(string, orderID);

                  });



              } else {
                console.log("User document doesn't exist");
              }
            })
            .catch(error => {
              console.error('Error getting user data:', error);
            });



        
    }
  };

  let createPDF = (str, orderID) => {

    setisSpinnerVisible(true);
    let options = {
      html: str,
      fileName: String(orderID),
      directory: "",
    };

    //in node_modules/react-native-html-to-pdf/android/src/main/java/com/rnhtmltopdf/RNHTMLtoPDFModule.java
    //change line 44 from
    //File output = new File(context.getCacheDir(), fileName);
    //to
    //File output = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), fileName);

    RNHTMLtoPDF.convert(options).then(filePath => {
      console.log('PDF generated', filePath);
      setBillPDFPath(filePath);
      setisSpinnerVisible(false);
      ToastAndroid.show('PDF generated at ' + filePath, ToastAndroid.SHORT);


    });
  }






  let saveToGallery = async (url) => {
    setisSpinnerVisible(true);
    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        let granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'App needs access to your storage to download Photos',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadImage(url);
        } else {
          downloadImage(url);

        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  }

  const downloadImage = (url) => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = url;
    // Getting the extention of the file
    let ext = '.png';
    // ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        ToastAndroid.show('Image Downloaded Successfully.', ToastAndroid.SHORT);
        setisSpinnerVisible(false);
        alert('Image Downloaded Successfully.');
      });
    setisSpinnerVisible(false);

  };



  return (
    <>
      <Spinner onBackButtonPress={()=>setisSpinnerVisible(false)} visible={isSpinnerVisible} textContent={loddingText} textStyle={{ color: 'white' }} />




      <Modal onBackButtonPress={() => setIsModalVisible(false)} visible={isModalVisible} transparent={true} >
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 20 }}>
            <Text style={{ fontSize: 30, margin: 20, color: '#514A9D', fontWeight: '900' }}>Pay At</Text>
            <Text style={{ textAlign: 'right',top:-30,paddingRight:30, color: '#514A9D',marginBottom:10 }}>Click Images To Save and Pay</Text>

            <View style={{flexDirection:'row', top:-30}}>

              <View style={{flexDirection:'column',flex:1}}>

            <Text style={{ textAlign: 'center', color: '#514A9D' }}>Phone Pay</Text>
            <Image style={{height:30, alignContent:'center', alignSelf:'center'}} resizeMode='contain' source={require('../../assets/phonepay.png')}></Image>
            <ImageBackground resizeMode='contain' style={{ height: 200, width: '100%', alignSelf: 'center' }}
              source={{ uri: qrCode1 }}

            >
              <TouchableOpacity onPress={() => saveToGallery(qrCode1)} style={{ height: 200, width: '100%' }}></TouchableOpacity>


            </ImageBackground>

            </View>

            <View style={{flexDirection:'column',flex:1}}>

            <Text style={{ textAlign: 'center', color: '#514A9D' }}>Google Pay</Text>
            <Image style={{height:30, alignContent:'center', alignSelf:'center'}} resizeMode='contain' source={require('../../assets/googlepay.png')}></Image>

            <ImageBackground resizeMode='contain' style={{ height: 200, width: '100%', alignSelf: 'center' }}
              source={{ uri: qrCode2 }}

            >
              <TouchableOpacity onPress={() => saveToGallery(qrCode2)} style={{ height: 200, width: '100%' }}></TouchableOpacity>


            </ImageBackground>

            </View>

            <View style={{flexDirection:'column',flex:1}}>

            
            <Text style={{ textAlign: 'center', color: '#514A9D' }}>Paytm</Text>
            <Image style={{height:30,width:30, alignContent:'center', alignSelf:'center'}} resizeMode='contain' source={require('../../assets/paytm.png')}></Image>


            <ImageBackground resizeMode='contain' style={{ height: 200, width: '100%', alignSelf: 'center' }}
              source={{ uri: qrCode3 }}

            >
              <TouchableOpacity onPress={() => saveToGallery(qrCode3)} style={{ height: 200, width: '100%' }}></TouchableOpacity>


            </ImageBackground>

            </View>
            </View>

            <Text style={{ fontSize: 30,top:-30, margin: 20, color: '#514A9D', fontWeight: '900' }}>Order</Text>

            <FlatList style={{ width: '90%',top:-30, alignSelf: 'center', borderRadius: 10, borderWidth: 0.5, borderColor: 'black' }}
              data={data}
              keyExtractor={item => item.productID}

              renderItem={({ item }) => (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                    <Text style={{ width: '70%', fontSize: 13, color: 'black', fontWeight: '900' }}>{item.productName} X {item.productCount}</Text>
                    <Text style={{ fontSize: 13, color: 'black', marginRight: 10, fontWeight: '700' }}>₹{parseInt(item.productSelling) * parseInt(item.productCount)}</Text>
                  </View>
                  <View style={{ height: 0.5, width: '100%', backgroundColor: '#514A9D' }}></View>
                </>

              )}

            />
            <Text style={{ fontSize: 20, color: '#514A9D', fontWeight: '700', margin: 10, alignSelf: 'flex-end' }}>Net: ₹{TotalAmount}</Text>
            <View style={{flexDirection:'row', alignContent:'flex-end', justifyContent:'flex-end'}}>
            <Text style={{ fontSize: 15, color: '#514A9D', fontWeight: '400', marginEnd: 10, alignSelf: 'flex-end' }}>Delivery Charge:</Text>
            
            <Text style={{ fontSize: 15, color: '#514A9D', fontWeight: '400', marginEnd: 10, alignSelf: 'flex-end', textDecorationLine: 'line-through' }}>+{parseInt(DeliviryCharge) + 10}</Text>

            <Text style={{ fontSize: 15, color: '#514A9D', fontWeight: '400', marginEnd: 10, alignSelf: 'flex-end' }}> +{DeliviryCharge}</Text>
            </View>

            <Text style={{ fontSize: 20, color: '#514A9D', fontWeight: '700', margin: 10, alignSelf: 'flex-end' }}>Total: ₹{(parseFloat(TotalAmount) + parseFloat(DeliviryCharge))/1.00}</Text>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, width: '90%', margin: 20, height: 100 }}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flex: 1, borderRadius: 10, margin: 5 }}>
                <Text style={{ fontSize: 20, color: '#514A9D', fontWeight: '900' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onBuy()} style={{ height: '100%', paddingStart: 20, paddingEnd: 20, backgroundColor: '#514A9D', justifyContent: 'center', alignItems: 'center', borderRadius: 10, flex: 1, margin: 5 }}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>


        <ImageBackground
          style={{ height: '100%', width: '100%' }}
          source={require('../../assets/background2.jpg')}>
          <View
            style={{
              width: '100%',
              height: 150,
              marginTop: 100,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ fontSize: 50, fontWeight: '800', color: '#e74c3c' }}>
                {' '}
                Your
              </Text>
              <Text style={{ fontSize: 45, fontWeight: '600', color: '#e74c3c' }}>
                {' '}
                Cart
              </Text>
              <Text
                style={{
                  fontSize: 30,
                  paddingTop: 0,
                  paddingStart: 25,
                  opacity: IsEmpty,
                  color: '#e74c3c'
                }}>
                {' '}
                is{' '}
              </Text>

              <Text
                style={{
                  fontSize: 30,
                  paddingTop: 0,
                  fontWeight: '800',
                  color: '#e74c3c',
                  opacity: IsEmpty,
                  paddingStart: 25,
                }}>
                {' '}
                Empty
              </Text>
            </View>
            <View style={{ width: '50%', alignItems: 'center', flexDirection: 'column' }}>

              <Image
                style={{ width: 100, height: 100, tintColor: '#e74c3c' }}
                source={require('../../assets/shopping-cart.png')}></Image>

              <Text style={{ top: -60, borderColor: 'grey', fontSize: 10, color: 'grey' }}
                              
                              
                            >Enter Refferal Code</Text>

              <TextInput style={{ top: -55,paddingStart:10,marginStart:10, borderColor: 'grey', fontSize: 10, color: 'grey' }}
                placeholder=""
                onChangeText={text => setRefferalCode(text)}
                
                value={RefferalCode}
              />

            </View>
          </View>

          {/* <Text style={{ fontSize: 18,margin:15,marginTop:55, fontWeight: '800', color: '#e74c3c' }}>Refferal Code:</Text> */}



          <FlatList
            style={{ width: '100%', alignContent: 'center', alignSelf: 'center' }}
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CartCard
                productName={item.productName}
                productID={item.productID}
                productPrice={item.productPrice}
                productDiscount={item.productDiscount}
                productUrl={item.productImageUrl}
                navigation={navigation}
                productDescription={item.productDescription}
                productCount={item.productCount}
                userEmail={userEmail}
                productSellig={item.productSelling}
                productGST={item.productGST}
              />
            )}
          />
          <View
            style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
            <View
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: 'grey',
                  alignSelf: 'flex-start',
                  marginStart: 10,
                  textDecorationLine: 'underline',
                }}>
                Total:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'green',
                  alignSelf: 'flex-start',
                  marginLeft: 25,
                }}>
                ₹{String(TotalAmount)} + ₹{String(DeliviryCharge)} = ₹{(parseFloat(DeliviryCharge) + parseFloat(TotalAmount))/1.00}
              </Text>
            </View>

            <View
              style={{
                width: '45%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
                margin: 5,
                borderRadius: 10,
              }}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                style={{
                  height: '100%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: '900' }}>
                  Buy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}




