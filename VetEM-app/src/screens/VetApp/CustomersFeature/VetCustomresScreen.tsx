import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomerCard from "./components/CustomerCard";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { Customer } from "../../../interfaces/types"; // Assuming you have a types file for Customer interface

interface VetCustomersScreenProps {
  navigation: any;
}

const VetCustomresScreen = ({ navigation }: VetCustomersScreenProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerRequests, setCustomerRequests] = useState<Customer[]>([]);
  const [customerWaitingApproval, setCustomerWaitingApproval] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;
      
      const response = await axios.get(
        `http://192.168.10.126:5000/mongodb/user/vet/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers(response.data.customers.vetClients);
      setCustomerRequests(response.data.customers.vetClientRequests);
      setCustomerWaitingApproval(response.data.customers.vetClientWaitApproval);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load customers',
      });
    } finally {
      setLoading(false);
    }
  };





  return (
    <View style={styles.container}>
      <View style={styles.emptyHeader}></View>
      <View style={styles.toast}>
          <Toast/>
      </View>
      
      {/*Title and Add Customer Button*/}
      <Text style={styles.titletxt}>Manage Your Customers</Text>
      
      <ScrollView contentContainerStyle={{ paddingBottom: 15 }}>

        {/* Customer Requests Section */}
        {customerRequests.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>New Requests</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View style={styles.customerContainer}>
              {customerRequests.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onPress={() => navigation.navigate("VetClientProfileScreen", {userId:customer._id})}
                  status="request" 
                  fetchCustomers={fetchCustomers}
                />
              ))}
            </View>
            )}
          
          </View>
        )}
        
        {/* Waiting Approval Section */}
        {customerWaitingApproval.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Waiting for Customer Approval</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />

            ): (
                  <View style={styles.customerContainer}>
              {customerWaitingApproval.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  disabled={true}
                  status="waiting"
                  onPress={() => navigation.navigate("VetClientProfileScreen", {userId:customer._id})}
                  fetchCustomers={fetchCustomers}
                />
              ))}
            </View>
            )}
          </View>
        )}

        {/* Current Customers Section */}
        <View>
          <Text style={styles.sectionTitle}>Your Customers</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.customerContainer}>
              {customers.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onPress={() => navigation.navigate("VetClientProfileScreen", {userId:customer._id})}
                  status="current"
                  fetchCustomers={fetchCustomers}
              
                />
              ))}
              {customers.length === 0 && !loading && (
                <Text style={styles.emptyMessage}>
                  You don't have any customers yet.
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("VetAddCustomerScreen",{
          customers,
          customerRequests,
          customerWaitingApproval,
          fetchCustomers,
        })}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Customer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  toast:{
    position:"absolute",
    top:20,
    right:200,
    zIndex:1,
  },
  emptyHeader: {
    height: 30,
  },
  titletxt: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 12,
    
    borderRadius: 8,
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  customerContainer: {
    gap: 10,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
});

export default VetCustomresScreen;
