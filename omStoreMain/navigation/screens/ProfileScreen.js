import React, { Image, BackHandler } from 'react-native';
import { useState, useEffect } from 'react';
import {ImageBackground, Text, ToastAndroid, TextInput, FlatList, ScrollView, TouchableOpacity, View, StyleSheet, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import OrderCard from './OrderCard';
import Modal from 'react-native-modal';
import RNRestart from 'react-native-restart';
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({navigation, route}) {
  
  const [userEmail, setuserEmail] = useState('');
  const [userName, setuserName] = useState('');
  const [userPhone, setuserPhone] = useState('');
  const [userAddress, setuserAddress] = useState('');
  const [userPost, setUserPost] = useState('');
  const [AddressToUpdate, setAddressToUpdate] = useState('');
  const [Locality, setLocality] = useState('');
  const [LocalityModal, setLocalityModalVisible] = useState(false);
  const [newPostValue, setNewPostValue] = useState(0);
  const [isOrders, setisOrders] = useState(0);
  const [isModalVisible, setisModalVisible] = useState(false);

  const [data, setData] = useState([]);
  const [localityData, setLocalityData] = useState([]);

  const path = RNFS.DocumentDirectoryPath + '/test.txt';

  const {fromCart} = route.params ? route.params : false;

  useEffect(() => {
    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!navigation.canGoBack()) {
          return false;
        }
        navigation.goBack();
        return true;
      }
    );

    return () => backHandlerSubscription.remove();
  }, [navigation]);

  useEffect(() => {
    RNFS.readFile(path, 'utf8')
      .then(contents => {
        setuserEmail(contents);

        const collectionRef = firestore()
          .collection('orders')
          .where('orderUserEmail', '==', contents);

        const unsubscribe = collectionRef.onSnapshot(snapshot => {
          const items = snapshot.docs.map(doc => ({
            AllItem: doc.data().orderAllItem,
            orderId: doc.data().orderID,
            orderOTP: doc.data().orderOTP,
            orderDate: doc.data().orderDate
          }))

          const sortedItems = items.sort((itemA, itemB) => {
            const dateA = itemA.orderDate || new Date(-Infinity);
            const dateB = itemB.orderDate || new Date(-Infinity);
            return dateA.getTime - dateB.getTime;
          });

          sortedItems.reverse();
          setData(sortedItems);

          if (items.length == 0) {
            setisOrders(1);
          } else {
            setisOrders(0);
          }
        });

        firestore()
          .collection('users')
          .doc(contents)
          .get()
          .then(doc => {
            if (doc.exists) {
              setuserName(doc.data().name);
              setuserPhone(doc.data().phone);
              setuserAddress(doc.data().address);
              setuserEmail(doc.data().email);
              setUserPost(doc.data().postOffice);
              setLocality(doc.data().postOffice);
            } else {
              console.log('No such document!');
              ToastAndroid.show('No such document!', ToastAndroid.SHORT);
            }
          })
          .catch(error => {
            console.log('Error getting document:', error);
            ToastAndroid.show('Error getting document!', ToastAndroid.SHORT);
          });

        return () => {
          unsubscribe();
        };
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  }, []);

  useEffect(() => {
    const collectionRef = firestore().collection('data');

    const unsubscribe = collectionRef.onSnapshot(snapshot => {
      const items = snapshot.docs.map(doc => ({
        postName: doc.data().postName,
        postValue: doc.data().postValue,
      }));
      setLocalityData(items);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onLogout = () => {
    RNFS.unlink(path)
      .then(() => {
        auth()
          .signOut()
          .then(() => {
            console.log('User signed out!');
            ToastAndroid.show('User signed out!', ToastAndroid.SHORT);
            navigation.replace("Login");
          });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const updateFirestore = async () => {
    ToastAndroid.show('Updating...', ToastAndroid.SHORT);
    try {
      const collectionRef = firestore().collection('users');
      
      await collectionRef.doc(userEmail).update({
        address: AddressToUpdate,
        postOffice: Locality,
      }).then(() => {
        ToastAndroid.show('Updated successfully', ToastAndroid.SHORT);
        setuserAddress(AddressToUpdate);
        setisModalVisible(false);
      }).catch((error) => {
        console.error('Error updating ', error.message);
        ToastAndroid.show('Error updating', ToastAndroid.SHORT);
      });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const renderLocalityItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.localityItem}
      onPress={() => {
        setLocality(item.postName);
        setNewPostValue(item.postValue);
        setLocalityModalVisible(false);
      }}
    >
      <Text style={styles.localityText}>{item.postName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Update Address Modal */}
      <Modal 
        isVisible={isModalVisible}
        onBackButtonPress={() => setisModalVisible(false)}
        onBackdropPress={() => setisModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="rgba(0,0,0,0.5)"
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Address</Text>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              value={AddressToUpdate}
              style={styles.textInput}
              onChangeText={text => setAddressToUpdate(text)}
              placeholder="Enter your address"
              placeholderTextColor="#A0A0A0"
              multiline={true}
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Post Office</Text>
            <TouchableOpacity 
              style={styles.postOfficeSelector}
              onPress={() => setLocalityModalVisible(true)}
            >
              <Text style={styles.postOfficeText}>{Locality || 'Select Post Office'}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setisModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.updateButton]}
              onPress={updateFirestore}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Locality Selection Modal */}
      <Modal 
        isVisible={LocalityModal}
        onBackButtonPress={() => setLocalityModalVisible(false)}
        onBackdropPress={() => setLocalityModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="rgba(0,0,0,0.5)"
        style={styles.modalContainer}
      >
        <View style={styles.localityModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Post Office</Text>
          </View>
          
          <FlatList
            data={localityData}
            keyExtractor={(item) => item.postName}
            renderItem={renderLocalityItem}
            showsVerticalScrollIndicator={false}
            style={styles.localityList}
          />
        </View>
      </Modal>

      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../assets/backGround_3.jpg')}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.greetingContainer}>
              <Text style={styles.helloText}>Hello,</Text>
              <Text style={styles.nameText}>{userName}.</Text>
              <Text style={styles.phoneText}>+91 {userPhone}</Text>
            </View>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userEmail}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Post Office</Text>
                <Text style={styles.infoValue}>{userPost}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{userAddress}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                setisModalVisible(true);
                setAddressToUpdate(userAddress);
              }}
            >
              <Image 
                source={require('../../assets/edit.png')} 
                style={styles.editIcon} 
              />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Orders Section */}
          <View style={styles.ordersSection}>
            <Text style={styles.sectionTitle}>Orders</Text>
            
            {isOrders === 1 ? (
              <View style={styles.noOrdersContainer}>
                <Text style={styles.noOrdersText}>No Orders Found</Text>
                <Text style={styles.noOrdersSubtext}>Your order history will appear here</Text>
              </View>
            ) : (
              <View style={styles.ordersContainer}>
                <FlatList
                  data={data}
                  keyExtractor={item => item.orderId}
                  renderItem={({item}) => (
                    <OrderCard 
                      AllItem={item.AllItem} 
                      orderId={item.orderId} 
                      orderOTP={item.orderOTP} 
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  helloText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#514A9D',
    letterSpacing: 2,
  },
  nameText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#514A9D',
    letterSpacing: 3,
    marginTop: 5,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#514A9D',
    letterSpacing: 1,
    marginTop: 5,
    opacity: 0.8,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 30,
  },
  profileInfo: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#514A9D',
    marginTop: 5,
    lineHeight: 22,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#514A9D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    flexDirection: 'row',
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  ordersSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#514A9D',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 20,
  },
  noOrdersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    elevation: 5,
  },
  noOrdersText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#514A9D',
    marginBottom: 8,
  },
  noOrdersSubtext: {
    fontSize: 14,
    color: '#666',
    opacity: 0.7,
  },
  ordersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    elevation: 8,
    paddingVertical: 10,
  },
  logoutContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#514A9D',
  },
  logoutText: {
    color: '#514A9D',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  // Modal Styles
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
    elevation: 10,
  },
  modalHeader: {
    backgroundColor: '#514A9D',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#514A9D',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  postOfficeSelector: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  postOfficeText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderBottomLeftRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  updateButton: {
    borderBottomRightRadius: 20,
    backgroundColor: '#514A9D',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  // Locality Modal Styles
  localityModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    elevation: 10,
  },
  localityList: {
    maxHeight: height * 0.5,
  },
  localityItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  localityText: {
    fontSize: 16,
    color: '#514A9D',
    fontWeight: '500',
  },
});