import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Customer } from '../../../../interfaces/types'; // Assuming you have a types file for Customer interface
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';


interface CustomerCardProps {
  customer: Customer;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  status: string; 
  fetchCustomers: () => void; 

}

const CustomerCard = ({ customer, onPress, disabled = false , status , fetchCustomers}: CustomerCardProps) => {

const [IsInvited, setIsInvited] = useState<boolean>(false);

  // Function to handle accepting a customer request
    const handleAcceptCustomer = async (customerId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.put(
        `http://192.168.10.126:5000/mongodb/user/vet/customers/${customerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Customer request accepted',
      });

      fetchCustomers();
    } catch (error) {
      console.error("Error accepting customer:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to accept customer request',
      });
    }
  };

  // Function to handle deleting a customer
    const handleDeleteCustomer = async (customerId: string) => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return;
  
        await axios.delete(
          `http://192.168.10.126:5000/mongodb/user/vet/customers/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Customer removed successfully',
        });
  
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to remove customer',
        });
      }
    };

  // Function to handle inviting a customer
    const handleInviteCustomer = async (customerId:string) => {
        try {
          const token = await AsyncStorage.getItem("authToken");
          const response = await axios.post(`http://192.168.10.126:5000/mongodb/user/vet/customers/${customerId}`,{},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          } );
          
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: response.data.message,
          });
          setIsInvited(true);
          fetchCustomers();

        } catch (error:any) {
          console.error("Error accepting customer:", error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response.data.message,
          });
        } 
      };


  return (
    <View >
      <TouchableOpacity
        style={[styles.card, disabled && styles.disabledCard]}
        onPress={onPress}
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

        <View style={styles.MiddleContent}>
      
          <Text style={styles.name}>{customer.firstName} {customer.lastName}</Text>
          <Text style={styles.text}>📧 {customer.email}</Text>
          <Text style={styles.text}>📞 {customer.phone}</Text>
          <Text style={styles.text}>🐾 {customer.clientInfo?.pets.length}</Text>

            {status === 'invite'  && IsInvited &&  (
            <Text style={styles.invitedText }>{customer.firstName} {customer.lastName} is successfully invited</Text>  
          )}
        
        </View>


        <View style={styles.rightContent}>
            {status === 'request' &&(
              <View style={styles.rightContentbetween}>
                <TouchableOpacity
                  onPress={()=> handleAcceptCustomer(customer._id)}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {
                  Alert.alert(
                    "Remove Customer Request",
                    `Do you want to remove ${customer.firstName} ${customer.lastName}?`,
                    [{
                        text: "Remove",
                        onPress: () => handleDeleteCustomer(customer._id),
                        style: "destructive",
                     },{
                     text: "Cancel",
                     style: "cancel",
                      },],      
                    );
                  }}
                >
                  <Ionicons name="remove-circle-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}



            {status === 'waiting' && (
              <View style={styles.rightContentbetween}>
                <TouchableOpacity
                  onPress={() => {
                  Alert.alert(
                    "Remove Customer waiting Approval",
                    `Do you want to remove ${customer.firstName} ${customer.lastName}?`,
                    [{
                        text: "Remove",
                        onPress: () => handleDeleteCustomer(customer._id),
                        style: "destructive",
                     },{
                     text: "Cancel",
                     style: "cancel",
                      },]);
                  }}
                >
                  <Ionicons name="remove-circle-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}



            {status === 'current' && (
              <View style={styles.rightContentbetween}>
                <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Remove Customer",
                    `Do you want to remove ${customer.firstName} ${customer.lastName}?`,
                    [{
                        text: "Remove",
                        onPress: () => handleDeleteCustomer(customer._id),
                        style: "destructive",
                     },{
                     text: "Cancel",
                     style: "cancel",
                      },]);
                  }}
                >
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}




            {status === 'invite' && IsInvited==false && (
              <View style={styles.rightContentbetween}>
                <TouchableOpacity
                onPress={() => handleInviteCustomer(customer._id)}
                >
                  <Ionicons name="add-circle" size={24} color="blue" />
                </TouchableOpacity>
              </View>
            )}
            
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
  MiddleContent: {
    flex: 1,
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  rightContentbetween: {

    gap: 10,
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
  invitedText: {
    color: 'green',
    fontWeight: 'bold',
  }
})