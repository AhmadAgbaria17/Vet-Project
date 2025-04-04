import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // To manage login status


interface CustomDrawerContentProps {
  userId: string,
  navigation: any,
  setIsLoggedIn: (value: boolean) => void;
}

interface User {
  name: string;
  email: string;
  profileImg: string;
}

const CustomDrawerContent = ({userId, navigation,setIsLoggedIn}:CustomDrawerContentProps) => {

  const [User, setUser] = React.useState<User>({
    name: 'Ahmad',
    email: 'ah.agbaria.99@gmail.com',
    profileImg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  })


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
          source={{ uri: User.profileImg }}
          style={styles.drawerProfileImg}
        />
        <Text style={styles.drwerProfieName}>{User.name}</Text>
        <Text style={styles.drawerProfileEmail}>{User.email}</Text>
      </View>

      {/* Drawer Options */}
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
        <Ionicons name="call-outline" size={24} color="black" style={styles.drawerOptionIcon} />
        <Text style={styles.drawerOptionText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>handleLogout()} >
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
})


export default CustomDrawerContent
