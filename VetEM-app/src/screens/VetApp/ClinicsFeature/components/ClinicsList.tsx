import React from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Clinic, JWTUser } from '../../../../interfaces/types';

interface ClinicsListProps {
  clinics: Clinic[];
  loading: boolean;
  setEditMode: (editMode: boolean) => void;
  setClinicId: (clinicId: string) => void;
  setName: (name: string) => void;
  setOpenTime: (openTime: string) => void;
  fetchClinics: () => void;

}

const ClinicsList = ({
  clinics,
  loading,
  setEditMode,
  setClinicId,
  setName,
  setOpenTime,
  fetchClinics,

}:ClinicsListProps) => {

  // Function to handle deleting a clinic
  const handleDeleteClinic = async (clinicId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      await axios.delete(
        `http://192.168.10.126:5000/mongodb/clinics/${clinicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Clinic deleted successfully",
      });

      fetchClinics();
    } catch (error) {
      console.error("Error deleting clinic:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete clinic",
      });
    }
  };


  return (
<View style={styles.clinicsList}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            clinics?.map((clinic) => (
              <View key={clinic._id} style={styles.clinicCard}>
                <View style={styles.clinicHeader}>
                  <View>
                    <Text style={styles.clinicName}>{clinic.name}</Text>
                    <Text style={styles.clinicInfo}>Open: {clinic.openTime}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditMode(true);
                        setClinicId(clinic._id!);
                        setName(clinic.name);
                        setOpenTime(clinic.openTime);
                      }}
                    >
                      <Ionicons name="create-outline" size={24} color="#3498db" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Delete Clinic",
                          "Are you sure you want to delete this clinic?",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Delete",
                              onPress: () => handleDeleteClinic(clinic._id!),
                              style: "destructive",
                            },
                          ]
                        )
                      }
                    >
                      <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                </View>

                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: clinic.location.latitude,
                    longitude: clinic.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={clinic.location} title={clinic.name} />
                </MapView>
              </View>
            ))
          )}
        </View>
  )
}

const styles = StyleSheet.create({
  clinicsList: {
    gap: 15,
    paddingBottom: 20,
  },
  clinicCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clinicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  clinicInfo: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});

export default ClinicsList
