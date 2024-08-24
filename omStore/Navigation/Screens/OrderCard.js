import React, { forwardRef, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ToastAndroid, TouchableOpacity, Image, TextInput } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import { Environment } from 'react-native';

export default function OrderCard({ orderId, TotalCost, orderRefferal, TotalDiscount, orderOTP, forBill, orderUserAddress, customerName, orderDeleviryCharge, customerEmail, orderDate, orderStatus, customerPhone, orderTotal, orderItems }) {
  var statusColor = 'blue';

  orderTotal = orderTotal.toFixed(2);
  
  const [otpModal, setotpModal] = useState(false);
  const [OTPspinner, setOTPspinner] = useState(false);
  const [otp, setotp] = useState('');

  // const externalFilePath = `${Environment.getExternalDirectory()}`;


  if (orderStatus === 'Delivered') {
    statusColor = 'grey'
  }
  else if (orderStatus === 'Cancelled') {
    statusColor = 'red'
  }
  else if (orderStatus === 'Pending') {
    statusColor = 'green'
  }
  else {
    statusColor = 'blue'
  }


  const onDelevired = () => {

    setotpModal(true);

    // firestore().collection('orders').doc(String(orderId)).update({
    //   orderStatus: 'Delivered',
    // }).then(() => {
    //   // setStatusColor('grey')
    // }).catch((error) => {
    //   console.log(error);
    // });


  }

  const verifyOTP = () => {

    setOTPspinner(true);

    if (otp == orderOTP) {
      firestore().collection('orders').doc(String(orderId)).update({
        orderStatus: 'Delivered',
      }).then(() => {
        setotpModal(false);
        setOTPspinner(false);
        // setStatusColor('grey')
      }).catch((error) => {
        console.log(error);
      });

    } else {
      setOTPspinner(false);
      alert('Wrong OTP');
    }




  }



  const onCancle = () => {

    firestore().collection('orders').doc(String(orderId)).update({
      orderStatus: 'Cancelled',
    }).then(() => {
      // setStatusColor('red')
    }).catch((error) => {
      console.log(error);
    });


  }

  const createPDF = () => {

    let string = `<h1 style="text-align: center; background-color: #f1f1f1; 
  ">InVoice</h1>

<h2 style="text-align: center; background-color: #f9f9f9; 
  ">OM.in</h2>

  <h5 style="text-align: center; 
  ">church road , minerva chauraha , jhansi +91 9451935427, +91 6386151853</h5>

<div style="flex-direction:column;">
<h4 style="text-align: left; padding-Left:3%; padding-Right:3%
  ">Invoice ID: ` + String(orderId) + `</h4>
  <h4 style="text-align: left; padding-Left:3%; padding-Right:3% 
  ">Date :` + String(orderDate) + `</h4>

</div>

<h4 style="text-align: left;  padding-Left:3%; padding-Right:3%
  ">Customer Name: ` + String(customerName) + `</h4>
  <h4 style="text-align: left;  padding-Left:3%; padding-Right:3%
  ">Customer Phone: `+ String(customerPhone) + `</h4>
  <h4 style="text-align: left; padding-Left:3%; padding-Right:3% 
  ">Customer Address:`+ String(orderUserAddress) + `</h4>

<table style="width:100%"; text-align:left;padding-Left:3%;padding-Right:3%;margin-Top:4%>
<tr>
<th>Product Name</th>
<th>Price</th>
<th>GST(%)</th>

<th>Discount</th>
<th>Quantity</th>
    ]
<th>Total</th>
</tr>

`+ String(forBill) + `




</table>

<h4 style="text-align: right;padding-Left:3%;padding-Right:3%;
  ">Total: ₹`+ String(TotalCost) + `</h4>
  <h4 style="text-align: right; padding-Left:3%;padding-Right:3%;
  ">Delevery:₹`+ String(orderDeleviryCharge) + `</h4>

  <h4 style="text-align: right; padding-Left:3%;padding-Right:3%;
  ">Discount:-₹`+ String(TotalDiscount) + `</h4>
  <h4 style="text-align: right; padding-Left:3%;padding-Right:3%;
  ">Grand Total: ₹`+ String(orderTotal) + ` + ₹` + String(orderDeleviryCharge) + `</h4>
`

    let options = {
      html: String(string),
      fileName: String(orderId),
      directory: "",
    };

    try {
      RNHTMLtoPDF.convert(options).then(file => {
        console.log('done');

        const targetDirectoryPath = RNFS.DownloadDirectoryPath;
        const targetFilePath = `${targetDirectoryPath}/${String(orderId)}.pdf`;

        
        console.log(file.filePath);
        console.log(targetFilePath);

        RNFS.moveFile(file.filePath, targetFilePath)
          .then(() => {

            console.log('File moved successfully! ');

          
          })
          .catch(error => {
            console.error('Error moving file:', error);
          });

        
        // ToastAndroid.show('PDF generated at ' + filePath.filePath, ToastAndroid.SHORT);
      });

    }
    catch (error) {
      console.log(error);
    }

  }
  return (

    <>

      <Modal onRequestClose={() => setotpModal(false)} isVisible={otpModal} style={{ flex: 1 }}>

        <Spinner
          visible={OTPspinner}
          textContent={'Verifying OTP...'}
          textStyle={{}}
        />
        <View style={{ width: "100%", height: 300, backgroundColor: 'white', borderRadius: 10 }}>

          <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10, color: 'black', textAlign: 'center' }}>OTP</Text>

          <TextInput onChangeText={(text) => setotp(text)} value={otp} placeholder='Enter Otp' placeholderTextColor={'grey'} keyboardType='number-pad' style={{ margin: 10, borderBottomWidth: 1, color: 'black', borderBottomColor: 'grey', fontSize: 20, fontWeight: 'bold' }}></TextInput>

          <TouchableOpacity onPress={verifyOTP} style={{ width: '100%', height: 60, position: 'absolute', bottom: 0, backgroundColor: '#8e44ad', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Verify</Text>
          </TouchableOpacity>
        </View>
      </Modal>


      <View style={{ flexDirection: 'row', marginEnd: 20 }}>



        <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', borderRadius: 10, borderWidth: 1, margin: 10 }}>
          <View style={{ flexDirection: 'column', width: '70%', justifyContent: 'space-between' }}>
            <ScrollView>
              <Text style={{ color: 'black', fontSize: 16, marginStart: 10, fontWeight: '600' }}>{orderDate}</Text>

              <Text style={{ color: 'grey', fontSize: 15, marginStart: 10, fontWeight: '400' }}>OrderID:{orderId}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#8e44ad', fontSize: 15, marginStart: 10, fontWeight: '600' }}>{customerName}</Text>

                <Text style={{ color: '#8e44ad', fontSize: 15, marginStart: 10, fontWeight: '400' }}>{customerPhone}</Text>
              </View>
              <Text style={{ color: '#8e44ad', fontSize: 15, marginStart: 10, fontWeight: '600' }}>{orderUserAddress}</Text>
              <Text style={{ color: '#8e44ad', fontSize: 15, marginStart: 10, fontWeight: '600' }}>Refferal: {orderRefferal}</Text>

              <Text style={{ color: statusColor, fontSize: 16, marginStart: 10, fontWeight: '900' }}>{orderStatus}</Text>
              <Text style={{ color: 'black', fontSize: 20, marginStart: 10, fontWeight: '400' }}>₹{orderTotal}</Text>
              <Text style={{ color: 'black', fontSize: 15, marginStart: 10, fontWeight: '400' }}>₹{orderDeleviryCharge}</Text>

              <Text style={{ color: 'black', fontSize: 15, margin: 10, fontWeight: '400' }}>Items:{orderItems}</Text>
            </ScrollView>
          </View>

          <View style={{ flexDirection: 'column', width: '30%', height: 150, marginEnd: 20 }}>
            <TouchableOpacity style={{ height: '40%' }} onPress={onDelevired}>
              <Image source={require('../../assests/icons/check.png')} style={{ width: '100%', height: '50%', resizeMode: 'contain', alignSelf: 'center', margin: 10, tintColor: 'black' }}></Image>

            </TouchableOpacity>

            <TouchableOpacity style={{ height: '30%' }} onPress={onCancle} >
              <Image source={require('../../assests/icons/bin.png')} style={{ width: '100%', height: '50%', resizeMode: 'contain', alignSelf: 'center', marginEnd: 10, tintColor: 'black' }}></Image>

            </TouchableOpacity>


            <TouchableOpacity style={{ paddingBottom: 10 }} onPress={createPDF}>
              <Image source={require('../../assests/icons/download.png')} style={{ width: '100%', height: '50%', resizeMode: 'contain', alignSelf: 'center', marginBottom: 10, marginEnd: 10, tintColor: 'black' }}></Image>

            </TouchableOpacity>



          </View>


        </View>



      </View>
    </>

  )
};

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     backgroundColor: 'rgba(52, 52, 52, 0.8)',
//   },
//   modalContent: {
//     width: '100%',
//     backgroundColor: 'white',
//     padding: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   modalOption: {
//     width: '100%',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e3e3e3',
//   },
//   modalOptionText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#8e44ad',
//     textAlign: 'center',
//   },
// });


