import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";



const Header = ({navigation}:any) => {

  return (
  <View>
    <View style={styles.topWhiteBar} ></View>
    <View style={styles.header}>
    
    
      <Ionicons name="paw" size={32} color="#fff"/>
    
      <Text style={styles.headerTitle}>Veterinary Emergency</Text>
    
          {/* Menu Icon */}
      <TouchableOpacity
       onPress={() => navigation.openDrawer()} 
       style={styles.menuIcon}>
        <Ionicons name="menu" size={32} color="#fff" />
      </TouchableOpacity>
    
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  topWhiteBar:{
    backgroundColor:'#fff',
    height:30,
    width:"120%",
    position:'absolute',
    top:0,
    zIndex:1,
        
  },
  header:{
    backgroundColor:'#3498db',
    height:100,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    padding:10,
    paddingTop:30,
  },
  headerTitle:{
    color:'#fff',
    fontSize:24,
    fontWeight:'bold',
    marginLeft:10,

  },
  menuIcon: {
    padding: 10,
  },
  
  
});

export default Header
