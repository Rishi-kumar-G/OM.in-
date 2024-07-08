import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [ForgotEmail, setForgotEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);


  var path = RNFS.DocumentDirectoryPath + '/test.txt';

  // write the file

  if (auth().currentUser) {
    navigation.navigate('Home', email);
    
  }

  const gotoRegister = () => {
    navigation.navigate('Register');
    
  };

  const ForgotPassword = () => {
    
    auth().sendPasswordResetEmail(String(ForgotEmail))
    .then(function (user) {
      ToastAndroid.show('Email sent, Check Your Gmail App', ToastAndroid.SHORT);
      setIsModalVisible(false);
    })
    .catch(function (e) {

      console.log(e);
      
    });


  };

  const onLogin = () => {
    auth()
      .signInWithEmailAndPassword(String(email), String(password))
      .then(() => {
        RNFS.writeFile(path, String(email), 'utf8')
          .then(success => {
            console.log('FILE WRITTEN!');
            ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
        navigation.navigate('Home');
          })
          .catch(err => {
            console.log(err.message);
          });

        
      })
      .catch(error => {
        if (error.code === 'auth/invalid-login') {
          ToastAndroid.show('Invalid Email or Password', ToastAndroid.SHORT);
        }
      });
  };

  return (
    <View style={styles.container}>

      <Modal onBackButtonPress={() => setIsModalVisible(false)} isVisible={isModalVisible}>
        <View style={{flex: 1, backgroundColor:'white', borderRadius:10, padding:50}}>
          <Text style={{fontSize:30,fontWeight:'900',textAlign:'center', color:'black'}}>Forgot Password</Text>
          <Text style={{fontSize:20,fontWeight:'900',marginTop:10 ,textAlign:'center', color:'black'}}>Enter your email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={ForgotEmail}
            onChangeText={text => setForgotEmail(text)}
            placeholderTextColor={'grey'}
          />
          <TouchableOpacity onPress={ForgotPassword}>
            <Text style={{color:'black', textAlign:'center', fontSize:20, textDecorationLine:'underline'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <TouchableOpacity
          style={{margin: 20}}
          
          onPress={gotoRegister}
          textAlign="center"
          justifyContent="center"
          alignItems="center">
          <Text textDecorationLine="Underline" style={{fontSize:25,color:'white',textDecorationLine:'underline'}} textAlign="center">Create New Account</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            placeholderTextColor={'grey'}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            placeholderTextColor={'grey'}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={{margin: 10}}
          onPress={gotoRegister}
          textAlign="center"
          justifyContent="center"
          alignItems="center">
          <Text textAlign="center">New Here? Create Account !</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={{margin: 10}}
          onPress={() => setIsModalVisible(true)}
          textAlign="right"
          justifyContent="center"
          alignItems="center">
          <Text textAlign="center" style={{fontSize:20}}>Forgot Password?</Text>
        </TouchableOpacity>


      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 32,
    alignSelf: 'flex-start',
    paddingStart: 32,
    color: 'white',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: 'grey',
    borderRadius: 8,
    borderColor:'grey',
    borderWidth:0.5,
    padding: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Login;