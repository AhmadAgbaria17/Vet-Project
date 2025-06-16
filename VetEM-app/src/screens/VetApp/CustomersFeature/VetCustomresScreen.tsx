import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
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

  return (
    <View style={styles.container}>
      <View style={styles.emptyHeader}></View>
      <Toast topOffset={70} />
      <Text style={styles.titletxt}>Manage Your Customers</Text>
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
                  onPress={() => {
                    Alert.alert(
                      "Customer Request",
                      `Accept request from ${customer.firstName} ${customer.lastName}?`,
                      [
                        {
                          text: "Accept",
                          onPress: () => handleAcceptCustomer(customer._id),
                          style: "default",
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
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
                  onPress={() => {}}
                  disabled={true}
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
                  onPress={() =>
                    
                    navigation.navigate("VetClientProfileScreen", {userId:customer._id})
                  }
                  onLongPress={() => {
                    Alert.alert(
                      "Remove Customer",
                      `Do you want to remove ${customer.firstName} ${customer.lastName}?`,
                      [
                        {
                          text: "Remove",
                          onPress: () => handleDeleteCustomer(customer._id),
                          style: "destructive",
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
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
    marginBottom: 16,
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
