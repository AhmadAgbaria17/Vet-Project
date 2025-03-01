import React, { useEffect, useState } from 'react';
import { View ,Text,StyleSheet, Image,TextInput ,TouchableOpacity,ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message'; 
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginScreenProps {
  navigation: any,
}

const LoginScreen = ({navigation}:LoginScreenProps) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]=useState(false);

    useEffect(() => {
      setEmail("");
      setPassword("");
    }, []);

  const handleLogin = async ()  => {
    if(!email || !password){
      Toast.show({
        type:'error',
        text1:'Error',
        text2:'Please fill all fields',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://192.168.10.126:5000/mongodb/auth/login',
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      await AsyncStorage.setItem("authToken",token)

      Toast.show({
        type:'success',
        text1:"Login Successful",
        text2: response.data.message,
      })

      
  
      
    } catch (error:any) {
      
        Toast.show({
          type:'error',
          text1:'Error',
          text2: error.response?.data.message || "An error occurred",
        }
      )
      
    } finally{
      navigation.navigate('Home');
      setLoading(false);
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.toast}>
            <Toast />
      </View>
      {/* Logo Section */}
      <Image  source={require("../assets/Vet emergency.png")} style={styles.logo}/>

      {/*Welcome Text*/}
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {/*Form Section*/}
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
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon}/>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={'#999'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          />
      </View>
      
      {/*Login Button*/}
      <TouchableOpacity
       onPress={handleLogin} 
       style={[styles.loginButton, loading && styles.disabledButton]} 
       disabled={loading}
       >
        {loading? (
          <ActivityIndicator size="small" color="#fff"/>
        ): (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Signup & Forgot Password */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    
    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo:{
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 50,
  },
  title:{
    fontSize:26,
    fontWeight:'bold',
    color:'#333',
  },
  subtitle:{
    fontSize:16,
    color:'#666',
    marginBottom: 30,
  },
  inputContainer:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff',
    width:'100%',
    paddingVertical:12,
    paddingHorizontal:15,
    borderRadius:10,
    marginBottom:15,
    shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:2,
    },
    shadowOpacity:0.1,
    shadowRadius:5,
    elevation:3,
  },
  icon:{
    marginRight:10,
  },
  input:{
    flex:1,
    fontSize:16,
    color:'#333',
  },
  loginButton:{
    width:'100%',
    padding:15,
    backgroundColor:"#3498db",
    borderRadius:10,
    alignItems:'center',
    marginTop:10,
  },
  disabledButton: {
    backgroundColor: "#7f8c8d",
  },
  loginText:{
    color:'#fff',
    fontSize:18,
    fontWeight:'bold',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: "#3498db",
    fontWeight: "bold",
  },
  toast:{
    position:"absolute",
    top:20,
    zIndex:1,
  },
})

export default LoginScreen
