import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Clinic, JWTUser } from '../../../../interfaces/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddEditFormProps {
  name: string;
  setName: (name: string) => void;
  openTime: string;
  setOpenTime: (openTime: string) => void;
  clinicId?: string;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  fetchClinics: () => void;
  user: JWTUser | null;
}


const AddEditForm = ({
  name,
  setName,
  openTime,
  setOpenTime,
  clinicId,
  editMode,
  setEditMode,
  fetchClinics,
  user,
}:AddEditFormProps) => {

  const [updateLocation, setUpdateLocation] = useState(false);

  // Function to handle adding a new clinic
  const handleAddClinic = async () => {
    if (!name || !openTime) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      if (!currentLocation?.coords) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not retrieve your location",
        });
        return;
      }

      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const newClinic: Clinic = {
        name,
        openTime,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        userId: user?.userId || "",
      };

      await axios.post(
        "http://192.168.10.126:5000/mongodb/clinic",
        newClinic,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Clinic added successfully",
      });

      setName("");
      setOpenTime("");
      fetchClinics();
    } catch (error: any) {
      console.error("Error adding clinic:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data.message || "Failed to add clinic",
      });
    }
  };

  // Function to handle editing a clinic
  const handleEditClinic = async () => {
    if (!name || !openTime) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      let updatedClinic: Partial<Clinic> = {
        name,
        openTime,
      };

      if (updateLocation) {
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (currentLocation?.coords) {
          updatedClinic.location = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };
        }
      }

      await axios.put(
        `http://192.168.10.126:5000/mongodb/clinics/${clinicId}`,
        updatedClinic,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Clinic updated successfully",
      });

      setEditMode(false);
      setName("");
      setOpenTime("");
      setUpdateLocation(false);
      fetchClinics();
    } catch (error) {
      console.error("Error updating clinic:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update clinic",
      });
    }
  };

  return (
      <View style={styles.formCard}>
          <TextInput
            placeholder="Clinic Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Opening Hours (e.g., 09:00-22:00)"
            value={openTime}
            onChangeText={setOpenTime}
            style={styles.input}
          />
          {editMode ? (
            <View>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => setUpdateLocation(!updateLocation)}
              >
                <Ionicons
                  name={updateLocation ? "location" : "location-outline"}
                  size={24}
                  color="#3498db"
                />
                <Text style={styles.locationButtonText}>
                  {updateLocation ? "Using Current Location" : "Keep Existing Location"}
                </Text>
              </TouchableOpacity>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleEditClinic}
                >
                  <Ionicons name="save-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setEditMode(false);
                    setName("");
                    setOpenTime("");
                    setUpdateLocation(false);
                  }}
                >
                  <Ionicons name="close-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddClinic}
            >
              <Ionicons name="add-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Add Clinic</Text>
            </TouchableOpacity>
          )}
        </View>

  )
}
const styles = StyleSheet.create({
    formCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  locationButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#3498db",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  addButton: {
    backgroundColor: "#2ecc71",
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
})

export default AddEditForm
