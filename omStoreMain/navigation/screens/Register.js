import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet,FlatList ,TouchableOpacity ,ImageBackground, ScrollView, ToastAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [postOffice, setPostOffice] = useState("Select A Post Office");
  const [modalVisible, setModalVisible] = useState(false);

 

  const [data, setData] = useState([]);

  

  const handleRegister = async () => {

    var path = RNFS.DocumentDirectoryPath + '/test.txt';
    
    if(email == '' || name=='' || phone == '' || address == ''){
      ToastAndroid.show('Please Fill All Details', ToastAndroid.SHORT);
      return;
    }
    if(postOffice == 'Select A Post Office' || postOffice == null){
      ToastAndroid.show('Please Select Post Office', ToastAndroid.SHORT);
      return;
    }

    
    
   

    auth()
  .createUserWithEmailAndPassword(String(email), String(password))
  .then(() => {
    firestore().collection('users').doc(email).set({
        name: name,
        phone: phone,
        address: address,
        email: email,
        postOffice: postOffice,
        refferal: '0000',
        
        
    }).then(() => {

      RNFS.writeFile(path, String(email), 'utf8')
      .then(success => {
        console.log('User added!');
        ToastAndroid.show('User account created & signed in!', ToastAndroid.SHORT);
        navigation.replace('Home');

      })
      .catch(err => {
        console.log(err.message);
      });


        

    });

  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      ToastAndroid.show('That email address is already in use!', ToastAndroid.SHORT);
    }

    if (error.code === 'auth/invalid-email') {
      ToastAndroid.show('That email address is Invalid!', ToastAndroid.SHORT);
    }
    if (error.code === 'auth/weak-password') {
        ToastAndroid.show('Password must be at least 6 characters', ToastAndroid.SHORT);
        }

  });
};

useEffect(() => {
  const collectionRef = firestore().collection('data');

  const unsubscribe = collectionRef.onSnapshot(
    snapshot => {
      if (snapshot) {
        const items = snapshot.docs.map(doc => ({
          postName: doc.data().postName,
          postValue: doc.data().postValue,
        }));
        setData(items);
      }
    },
    error => {
      console.error('Error fetching data from Firestore:', error);
    
    }
  );

  return () => {
    unsubscribe();
  };
}, []);


  return (



    <ImageBackground source={require('../../assets/background.jpg')} style={{width: '100%', height: '100%', flex:1}}>


        <Modal 
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        >
        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0)'}}>
        <View style={{backgroundColor:'white', width:'90%', height:'90%', borderRadius:10, padding:10}}>
        <Text style={{fontSize:18, color:'black', marginStart:20, marginTop:30, fontWeight:'700'}}>Select Post Office</Text>
        
        <FlatList 
        data={data}
        keyExtractor={item => item.postName}
        style={{marginTop:20, borderRadius:15, borderWidth:1, borderColor:'grey'}}

        renderItem={({item}) => (
          <>
          <TouchableOpacity onPress={() => {
            setPostOffice(item.postName);
            setModalVisible(false);
          }}>
          <Text style={{fontSize:18, color:'black', marginStart:20, marginTop:30, fontWeight:'700'}}>{item.postName}</Text>
          </TouchableOpacity>
          <View style={{width:'90%', height:1, backgroundColor:'grey', alignSelf:'center'}}>

          </View>
          </>
        )}></FlatList>

        </View>
        </View>
        </Modal>



        <ScrollView>
        <Text style={{fontSize:48, color:'white', marginStart:20, marginTop:30, fontWeight:'700'}}>Register</Text>
        <View style={{width:'100%',padding:20, flex:1, alignItems:'flex-start'}}>
        <Text style={styles.label}>Name:</Text>
        <TextInput value={name} onChangeText={(text) => setName((text))} style={styles.input} placeholderTextColor={'grey'} placeholder='Enter Name'></TextInput>

        <Text style={styles.label}>Phone Number:</Text>
        <TextInput value={phone} onChangeText={(text) => setPhone(text)} style={styles.input} placeholderTextColor={'grey'} placeholder='Enter Phone: ' inputMode='tel'></TextInput>

        <Text style={styles.label}>Address:</Text>
        <TextInput value={address} onChangeText={(text) => setAddress(text)} style={styles.input} placeholderTextColor={'grey'} placeholder='Enter Address'></TextInput>

        <Text style={styles.label}>Post Office:</Text>

        <TouchableOpacity style={{width:'100%'}} onPress={() => setModalVisible(true)} >

        <Text style={styles.input} > {postOffice}</Text>
        </TouchableOpacity>
        


        <Text style={styles.label}>Email:</Text>
        <TextInput value={email}  onChangeText={(text) => setEmail(text)} style={styles.input} placeholderTextColor={'grey'} placeholder='Enter Email' inputMode='email'></TextInput>

        <Text style={styles.label}>Password:</Text>
        <TextInput value={password} onChangeText={(text) => setPassword(text)} style={styles.input} placeholderTextColor={'grey'} placeholder='Enter Password' secureTextEntry></TextInput>
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{margin:10, flex:1}} 
            onPress={() => navigation.navigate('Login')} 
            textAlign='center' 
            justifyContent='center' 
            
            alignItems='center'>
        <Text textAlign="center" style={{flex:1,fontSize:20}} >Already have an account? Login !</Text>
        </TouchableOpacity>

        </View>
     
        </ScrollView>
    
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems:'center',
    justifyContent:'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    width:'100%',
    color:'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 20,
    color:'grey',
    width:'100%',
    
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:18,
  },
});

export default Register;
