import React,{useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList ,ToastAndroid} from 'react-native'
// import { TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { Modal } from 'react-native';


export default function PhoneScreen() {

    const [data, setData] = useState([]);
    const [phone, setPhone] = useState('');
    const [inputPass, setInputPass] = useState("");
    const [passWordModal , setPassWordModal] = useState(false);

    useEffect(() => {
        // Reference to your Firestore collection
        const collectionRef = firestore().collection('phone');
    
        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
    
          const items = snapshot.docs.map((doc) => ({
            
            phoneNumber: doc.data().phoneNumber,
           
    
          }));
          setData(items);
        });
    
        return () => {
          unsubscribe();
        };
      }, []);


    async function search(query) {
        setPhone(query);
        const collectionRef = firestore().collection('phone');
        const snapshot = await collectionRef
          .where('phoneNumber', '>=', query)
          .where('phoneNumber', '<=', query + '\uf8ff')
          .get();
        const items = snapshot.docs.map(doc => ({
           
          phoneNumber: doc.data().phoneNumber,
          
    
        }));
        setData(items); 
      }

    const onSave = () => {    

      if(phone.length >= 10){
        firestore().collection('phone').doc(phone).set({
          phoneNumber: String(phone),
        }).then(() => {
            setPhone('');
            search('');
            ToastAndroid.show("Phone Number Saved", ToastAndroid.SHORT);
            
          
        });
      }else{
        ToastAndroid.show("Phone Number Should be 10 Digits", ToastAndroid.SHORT);
      }

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



  return (
    <View>

<Modal
        animationType="slide"
        transparent={true}
        visible={!passWordModal}
        onRequestClose={()=>setPassWordModal(false)}
      >
        <View style={{flex: 1,
    justifyContent: 'center',
    alignItems: 'center',}}>

          <View style={{backgroundColor:'white', borderRadius:10, padding:20, margin:20}}>

          <Text style={{fontSize:20, fontWeight:'bold', color:'black'}}>Enter Password</Text>
          <TextInput onChangeText={(text) => setInputPass(text)} style={{borderWidth:1, borderColor:'gray', borderRadius:10, padding:10,color:'black', marginTop:10}} placeholder="Enter Password" secureTextEntry={true} ></TextInput>
          <TouchableOpacity onPress={checkPassword} style={{backgroundColor:'purple',justifyContent:'center',alignItems:'center', padding:10, borderRadius:10, marginTop:10}}>
            <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Submit</Text>
          </TouchableOpacity>

          </View>

          

          
        </View>
      </Modal>
        
        <TextInput 
      onChangeText={(text) => search(text)}
      style={{margin:10, borderRadius:20, padding:10, backgroundColor:'#a5b1c2'}} placeholder='Search' placeholderTextColor={'grey'}></TextInput>

      <TouchableOpacity onPress={onSave} style={{alignItems:'center', borderRadius:20, backgroundColor:'grey', margin:10}}>
        <Text style={{margin:10, color:'white',fontWeight:'800', fontSize:16}}>Save</Text>
        </TouchableOpacity>

        <FlatList
  data={data}
  style={{ width: '90%', alignSelf: 'center', height: '100%' }}
  keyExtractor={(item) => item.phoneNumber}
  renderItem={({ item }) => (
    <Text style={{ margin: 5,fontSize:16, color: 'black',textAlign:'center' }}>{item.phoneNumber}</Text>
  )}
/>


    </View>
  )
}
