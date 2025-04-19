import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string; 
  phone: string; 
  pets: string[]; 
}

interface CustomerCardProps {
  customer: Customer;
  onPress?: () => void;
  onLongPress?: () => void;
}


const CustomerCard = ({customer,onPress,onLongPress}:CustomerCardProps) => {
  

  return (
    <View >
      <TouchableOpacity style={styles.card}
        onLongPress={onLongPress}
        onPress={onPress}>
        <Image source={{ uri: customer.profileImg}} style={styles.image} />
        <View style={{flex:1}}>
          <Text style={styles.name}>{customer.firstName} {customer.lastName}</Text>
          <Text style={styles.text}>📧 {customer.email}</Text>
          <Text style={styles.text}>📞 {customer.phone}</Text>
          <Text style={styles.text}>🐾 Pets: {customer.pets}</Text>
        </View>
      
      
      </TouchableOpacity>
    </View>
  )
}

export default CustomerCard

const styles = StyleSheet.create({
  card:{

    flexDirection:"row",
    backgroundColor:"#f2f2f2",
    borderRadius:10,
    padding:10,
    marginVertical:6,
    alignItems:"center",
    
  },
  image:{
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
})