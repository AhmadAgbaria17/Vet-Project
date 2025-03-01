import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomDrawerContentProps {
  User: any,
  navigation: any,
}

const CustomDrawerContent = ({User, navigation}:CustomDrawerContentProps) => {
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
