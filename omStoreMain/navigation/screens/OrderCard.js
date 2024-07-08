import React, {useState, useEffect} from 'react';
import {Text, View, Image, ToastAndroid, ScrollView, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
// import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

export default function OrderCard({userEmail, orderId,orderOTP ,AllItem, navigation}) {
  const [orderDate, setorderDate] = useState('');
  const [orderTime, setorderTime] = useState('');
  const [orderAmount, setorderAmount] = useState(0);
  const [orderStatus, setorderStatus] = useState('');
  const [orderDeleviryCharge, setorderDeleviryCharge] = useState(0);

  const [statusColor, setstatusColor] = useState('#F28500');

  firestore()
    .collection('orders')
    .doc(String(orderId))
    .get()
    .then(doc => {
      if (doc.exists) {
        setorderDate(doc.data().orderDate);
        setorderTime(doc.data().orderTime);
        setorderAmount(doc.data().orderAmount);
        setorderStatus(doc.data().orderStatus);
        setorderDeleviryCharge(doc.data().orderDeleviryCharge);
        // setorderAddress(doc.data().orderAddress);
        if (orderStatus == 'pending') {
          setstatusColor('#F28500');
        } else if (orderStatus == 'Delivered') {
          setstatusColor('green');
        } else if (orderStatus == 'Cancelled') {
          setstatusColor('red');
        } else {
          setstatusColor('#F28500');
        }
      } else {
        console.log('No such document!');
        // ToastAndroid.show('No such document!', ToastAndroid.SHORT);
      }
    })
    .catch(error => {
      console.log('Error getting document:', error);
      ToastAndroid.show('Error getting document!', ToastAndroid.SHORT);
    });

  const onOrderCard = () => {};

  return (
    <TouchableOpacity
      onPress={onOrderCard}
      style={{
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#514A9D',
        width: '94%',
        margin: 10,
        padding: 10,
        borderRadius: 15,
      }}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: '25%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/order.png')}
            style={{
              height: 80,
              tintColor: '#514A9D',
              width: 60,
              resizeMode: 'contain',
            }}
          />
        </View>

        <View style={{}}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: 'grey',
              marginTop: 0,
            }}>
            Order ID: {orderId}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: 'grey',
              marginTop: 0,
            }}>
            {orderTime} {orderDate}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: 'green',
              fontWeight: '800',
              marginTop: 0,
            }}>
            ₹{orderAmount}
          </Text>

          <Text
            style={{
              fontSize: 10,
              fontWeight: '400',
              color: 'green',
              fontWeight: '800',
              marginTop: 0,
            }}>
            +₹{orderDeleviryCharge}
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: 'green',
              fontWeight: '800',
              marginTop: 0,
            }}>
            Total: ₹{parseFloat(orderAmount) + parseFloat(orderDeleviryCharge)}
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: statusColor,
              fontWeight: '800',
              marginTop: 0,
            }}>
            status:{orderStatus}
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: 'black',
              fontWeight: '800',
              marginTop: 0,
            }}>
            OTP:{orderOTP}
          </Text>
        </View>
      </View>

      <View style={{margin: 10}}>
        <ScrollView>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '400',
              color: 'grey',
              marginTop: 0,
              flex: 1,
            }}>
            {AllItem}
          </Text>
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}
