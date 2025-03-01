
import React, { useEffect, useState } from 'react'
import { View,StyleSheet,Text, TouchableOpacity,TextInput ,ScrollView,ActivityIndicator} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message'; 
import axios from 'axios';

const SignupScreen = ({navigation}:any) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('client');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setUserType("client");
    
  }, []);


  const handleSignup = async () => {
    if(!firstName || !lastName || !email || !phone || !password || !confirmPassword){
      Toast.show({
        type:'error',
        text1:'Error',
        text2:'Please fill all fields',
        position:'top',
      });
      return;
    }
    if(password !== confirmPassword){
      Toast.show({
        type:'error',
        text1:'Error',
        text2:'Passwords do not match',
      });
      return;
    }

    setLoading(true);

    try{
      const response = await axios.post(
        'http://192.168.10.127:5000/mongodb/auth/signup',
        {
          firstName,
          lastName,
          email,
          phone,
          password,
          userType,
        }
      );

      Toast.show({
        type:'success',
        text1:"Account Created",
        text2: response.data.message,
      });
    }catch(error:any){
      console.error("signup error",error);

      Toast.show({
        type:'error',
        text1:'Error',
        text2: error.response?.data.message || "An error occurred",
      })
    }finally{
      setLoading(false);
      navigation.navigate('Login');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.empyHeader}>
      <Toast position='top' />
      </View>
      <ScrollView >
        {/* Welcome Text */}
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Join us today!</Text>
      
        {/* Form Section */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor={'#999'}
            value={firstName}
            onChangeText={setFirstName}
            />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor={'#999'}
            value={lastName}
            onChangeText={setLastName}
            />
        </View>
      
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'#999'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            />
        </View>
      
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor={'#999'}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            />
        </View>
      
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={'#999'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            />
          <TouchableOpacity onPress={()=> setSecureTextEntry(!secureTextEntry)}>
            <Ionicons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="#666"/>
          </TouchableOpacity>
        </View>
      
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon}/>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={'#999'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureTextEntry}
            />
        </View>
      
        <View style={styles.pickerContainer}>
          
          <Text style={styles.pickerLabel}>
            Sign up as:</Text>
          <Picker
            selectedValue={userType}
            onValueChange={(itemValue) => setUserType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Client" value="client" />
            <Picker.Item label="Veterinarian" value="vet" />
          </Picker>
        </View>
      
        <TouchableOpacity 
        style={[styles.signupButton, loading&&styles.disabledButton]}
         onPress={handleSignup}
         disabled={loading}
         >
          {loading?  (
            <ActivityIndicator size="small" color="#fff"/>
          ):
        (<Text style={styles.signupText}>Sign Up</Text>)}
        </TouchableOpacity>
      
        {/* Navigate to Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      
      
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  empyHeader:{
    height:30,
    zIndex:1,
  },
  container:{
    flex:1,
    backgroundColor:'#f8f9fa',
    paddingHorizontal:20,
  },
  title: {
    paddingTop: 40,
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",

  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    alignSelf: "center",

  },
  inputContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  pickerLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  picker: {
    width: "100%",
  },
  signupButton: {
    backgroundColor: "#3498db",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#7f8c8d",
  },
  signupText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    paddingBottom:40,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  linkText: {
    fontSize: 14,
    color: "#3498db",
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default SignupScreen
