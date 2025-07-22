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
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import Header from "../../../components/Header";
import { Clinic } from "../../../interfaces/types";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../../../navigation/types";
import AddEditForm from "./components/AddEditForm";
import ClinicsList from "./components/ClinicsList";



type VetClinicsScreenProps = DrawerScreenProps<RootDrawerParamList, 'VetClinics'>;

const VetClinicsScreen: React.FC<VetClinicsScreenProps> = ({ navigation, route }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicId, setClinicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [editMode, setEditMode] = useState(false);

  const {user} = route.params || {};


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


  // Function to fetch clinics from the server
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

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Toast />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Manage Your Clinics</Text>

        {/* Add/Edit Form */}
      <AddEditForm
          name={name}
          setName={setName}
          openTime={openTime}
          setOpenTime={setOpenTime}
          clinicId={clinicId}
          editMode={editMode}
          setEditMode={setEditMode}
          fetchClinics={fetchClinics}
          user={user}
        />

        {/* Clinics List */}
        <ClinicsList
          clinics={clinics}
          loading={loading}
          setEditMode={setEditMode}
          setClinicId={setClinicId}
          setName={setName}
          setOpenTime={setOpenTime}
          fetchClinics={fetchClinics}
        />

        
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
});

export default VetClinicsScreen;
