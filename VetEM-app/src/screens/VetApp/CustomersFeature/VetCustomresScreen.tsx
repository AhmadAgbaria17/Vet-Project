import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomerCard from "./components/CustomerCard";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string;
  phone: string;
  pets: string[];
}

interface VetHomeScreenProps {
  navigation: any;
}

const VetCustomresScreen = ({ navigation }: VetHomeScreenProps) => {
  const [customres, setCustomres] = useState<Customer[]>([]);
  const [customersRequests, setCustomersRequests] = useState<Customer[]>([]);
  const [customerWaitingApproval, setCustomerWaitingApproval] = useState<
    Customer[]
  >([]);

  const handleAcceptCustomer = (customerId: string) => {
    // Here you can call the API to accept the customer request
  };

  const handleDeleteCustomer = (customerId: string) => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // Logic to delete the customer
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.emptyHeader}></View>
      <Text style={styles.titletxt}>Manage Your Customers</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("VetAddCustomerScreen")}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Customer</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {customersRequests.length > 0 && (
          <View>
            <Text style={styles.customerRequstTxt}>Customers Requests</Text>
            <View style={styles.customerContaier}>
              {customersRequests.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onPress={() =>
                    navigation.navigate("VetClientProfileScreen", { customer })
                  }
                  onLongPress={() => {
                    Alert.alert(
                      "Customer Request",
                      `What do you want to do with ${customer.firstName} ${customer.lastName}?`,
                      [
                        {
                          text: "Accept",
                          onPress: () => handleAcceptCustomer(customer._id),
                          style: "default",
                        },

                        {
                          text: "Delete",
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
            </View>
          </View>
        )}

        {customerWaitingApproval.length > 0 && (
          <View>
            <Text style={styles.customerRequstTxt}>
              Waiting for customer approval
            </Text>
            <View style={styles.customerContaier}>
              {customerWaitingApproval.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onPress={() =>
                    navigation.navigate("VetClientProfileScreen", { customer })
                  }
                />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.customerRequstTxt}>Your Customers</Text>
        <View style={styles.customerContaier}>
          {customres.map((customer) => (
            <CustomerCard
              key={customer._id}
              customer={customer}
              onPress={() =>
                navigation.navigate("VetClientProfileScreen", { customer })
              }
              onLongPress={() => {
                Alert.alert(
                  "Customer",
                  `Do you want to delete ${customer.firstName} ${customer.lastName}?`,
                  [
                    {
                      text: "Delete",
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
          {customres.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              You don't have any customers yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default VetCustomresScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  emptyHeader: {
    height: 30,
    zIndex: 1,
  },
  titletxt: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  customerRequstTxt: {
    fontSize: 14,
    fontWeight: "bold",

    textAlign: "left",
    borderBottomColor: "#ccc",
  },
  customerContaier: {
    borderRadius: 8,
    marginBottom: 15,
  },
});
