import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Customer } from '../../../../interfaces/types'; // Assuming you have a types file for Customer interface


interface CustomerCardProps {
  customer: Customer;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
}

const CustomerCard = ({ customer, onPress, onLongPress, disabled = false }: CustomerCardProps) => {

  return (
    <View >
      <TouchableOpacity
        style={[styles.card, disabled && styles.disabledCard]}
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        disabled={disabled}
      >
        <View style={styles.leftContent}>
          {customer.profileImg ? (
            <Image source={{ uri: customer.profileImg }} style={styles.image} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Ionicons name="person-outline" size={24} color="#666" />
            </View>
          )}
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.name}>{customer.firstName} {customer.lastName}</Text>
          <Text style={styles.text}>📧 {customer.email}</Text>
          <Text style={styles.text}>📞 {customer.phone}</Text>
          <Text style={styles.text}>🐾 {customer.clientInfo?.pets.length}</Text>
      
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default CustomerCard

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledCard: {
    opacity: 0.6,
  },
  leftContent: {
    marginRight: 15,
  },
  rightContent: {
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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