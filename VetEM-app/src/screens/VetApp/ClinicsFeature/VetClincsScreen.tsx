import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header";

interface Clinic {
  _id?: string;
  name: string;
  openTime: string;
  location: { latitude: number; longitude: number };
  userId: string;
}

interface VetClinicsScreenProps {
  navigation: any;
  route: any;
}

const VetClinicsScreen = ({ navigation, route }: VetClinicsScreenProps) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicId, setClinicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);


// Request location permission and fetch clinics on component mount
  useEffect(() => {
      const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to add clinics."
      );
    }
  };

    requestLocationPermission();
    fetchClinics();
  }, []);
  
    const fetchClinics = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(
        `http://192.168.10.126:5000/mongodb/clinics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClinics(response.data.UserClinics);
  
    } catch (error: any) {
      console.error(
        "Error fetching clinics:",
        error.response?.data || error.message
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load clinics",
      });
    } finally {
      setLoading(false);
    }
  };



// Function to fetch clinics from the server
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
        userId: route.params?.user?.userId,
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
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Toast />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Manage Your Clinics</Text>

        {/* Add/Edit Form */}
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

        {/* Clinics List */}
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
        <View style={{ height: 70 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
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

export default VetClinicsScreen;
