import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // To manage login status


interface CustomDrawerContentProps {
  userId: string,
  navigation: any,
  setIsLoggedIn: (value: boolean) => void;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string;
}

const CustomDrawerContent = ({userId, navigation,setIsLoggedIn}:CustomDrawerContentProps) => {

  const [user, setUser] = React.useState<User|null>(null);


  useEffect(()=>{
    const fetchUserInfo = async () =>{
      try {
        const token = await AsyncStorage.getItem("authToken");
        if(!token) return;

        const respone = await fetch(`http://192.168.10.126:5000/mongodb/user/${userId}`,{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          }
      });
      const data = await respone.json();  
      setUser(data.user);                
      } catch (error) {
        console.error("Error getting user info:", error);
      }

    }
    fetchUserInfo();
  },[])


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsLoggedIn(false);     
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (

    <View style={styles.drawerContainer}>
      {/* Profile Section */}
      <View style={styles.drawerProfileView}>
        <Image
          source={{ uri: user?.profileImg }}
          style={styles.drawerProfileImg}
        />
        <Text style={styles.drwerProfieName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.drawerProfileEmail}>{user?.email}</Text>
      </View>

      {/* Drawer Options */}

      <TouchableOpacity
        style={styles.drawerOption}
        onPress={() => navigation.navigate("Contact")}
      >
        <Ionicons name="person-circle-outline" size={24} color="black" style={styles.drawerOptionIcon} />
        <Text style={styles.drawerOptionText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerOption}
        onPress={() => navigation.navigate("Contact")}
      >
        <Ionicons name="call-outline" size={24} color="black" style={styles.drawerOptionIcon} />
        <Text style={styles.drawerOptionText}>Contact Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerOption}
        onPress={() => navigation.navigate("About-us")}
      >
        <Ionicons name="people-outline" size={24} color="black" style={styles.drawerOptionIcon} />
        <Text style={styles.drawerOptionText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.logOutBTN}
      onPress={()=>handleLogout()} >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerContainer :{
    flex:1,
    padding:50,
    paddingHorizontal:20,
  },
  drawerProfileView:{
    alignItems:'center',
    marginBottom:20,
  },
  drawerProfileImg:{
    width:80,
    height:80,
    borderRadius:40,
    marginBottom:10,
  },
  drwerProfieName:{
    fontSize:18,
    fontWeight:'bold',
  },
  drawerProfileEmail:{
    color:'gray',
  },
  drawerOption:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:10,
  },
  drawerOptionIcon:{
    marginRight:10,
  },
  drawerOptionText:{
    fontSize:16,
  },
  logOutBTN:{
    backgroundColor:'#e74c3c',
    alignItems:'center',
    padding:10,
    borderRadius:10,
    justifyContent:'center',
    position:'absolute',
    bottom:20,
    left:20,
    right:20,
  }
})


export default CustomDrawerContent
