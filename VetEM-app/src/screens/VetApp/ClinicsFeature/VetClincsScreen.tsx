import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialIcons";
import RadioGroup from "react-native-radio-buttons-group";

interface Clinic {
  _id?: string;
  name: string;
  openTime: string;
  location: { latitude: number; longitude: number };
  userId: string;
}

const VetClinicsScreen = ({ route }: any) => {
  const user = route.params?.user;
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinicId, setClinicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [editMode, setEditMode] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);
  const [selectedId, setSelectedId] = useState("no");

  //require Location Permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to add clinics."
        );
        return;
      }
    })();
  }, []);

  // get the clinics of the user
  const fetchClinics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.10.126:5000/mongodb/clinic/${user.userId}`
      );
      setClinics(response.data.UserClinics);
    } catch (error: any) {
      console.error(
        "Error fetching clinics:",
        error.response?.data || error.message
      );
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchClinics();
  }, []);

  const handleAddClinic = async () => {
    if (!name || !openTime) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    if (!currentLocation?.coords) {
      Alert.alert("Location Error", "Could not retrieve your location.");
      return;
    }

    const Token = await AsyncStorage.getItem("authToken");
    const newClinic: Clinic = {
      name,
      openTime,
      location: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      userId: user.userId,
    };

    try {
      const response = await axios.post(
        "http://192.168.10.126:5000/mongodb/clinic",
        newClinic,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Clincs Added",
        text2: response.data.message,
      });
    } catch (error: any) {
      console.error("error add clinic: ", error.response?.data.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data.message || "An error occurred",
      });
    }
    fetchClinics();
    setName("");
    setOpenTime("");
  };

  const handleDeleteClinic = async (clinicId: string) => {
    Alert.alert(
      "Delete Clinic",
      "Are you sure you want to delete this clinic?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const Token = await AsyncStorage.getItem("authToken");
              await axios.delete(
                `http://192.168.10.126:5000/mongodb/clinic/item/${clinicId}`,
                {
                  headers: {
                    Authorization: `Bearer ${Token}`,
                  },
                }
              );
              fetchClinics();
              Toast.show({
                type: "success",
                text1: "Clinic Deleted",
                text2: "Clinic deleted successfully",
              });
            } catch (error: any) {
              console.error(
                "Error deleting clinic:",
                error.response?.data || error.message
              );
              Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data.message || "An error occurred",
              });
            }
          },
        },
      ]
    );
  };

  const handleEditClinic = async () => {
    if (!name || !openTime) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }
    let newLocation = location;
    if (updateLocation) {
      const currentLocation = await Location.getCurrentPositionAsync({});
      if (!currentLocation?.coords) {
        Alert.alert("Location Error", "Could not retrieve your location.");
        return;
      }
      newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
    }
    const Token = await AsyncStorage.getItem("authToken");
    if (!Token) {
      console.error("No auth token found");
      return;
    }

    const updatedClinic: Clinic = {
      name,
      openTime,
      location: newLocation,
      userId: user.userId,
    };
    try {
      const response = await axios.put(
        `http://192.168.10.126:5000/mongodb/clinic/item/${clinicId}`,
        updatedClinic,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      fetchClinics();
      setEditMode(false);
      setName("");
      setOpenTime("");

      Toast.show({
        type: "success",
        text1: "Clinic Updated",
        text2: response.data.message,
      });
    } catch (error: any) {
      console.error(
        "Error updating clinic:",
        error.response?.data || error.message
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data.message || "An error occurred",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.emptyHeader}>
        <Toast position="top" />
      </View>
      <Text style={styles.title}>Manage Your Clinics</Text>

      <TextInput
        placeholder="Clinic Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Opening Time (exp: 09:00-22:00)"
        value={openTime}
        onChangeText={setOpenTime}
        style={styles.input}
      />

      {editMode ? (
        <View>
          <Text style={styles.locationText}>Change Location?</Text>
          <RadioGroup
            radioButtons={[
              { id: "yes", label: "Yes", value: "yes" },
              { id: "no", label: "No", value: "no" },
            ]}
            onPress={(value) => {
              setUpdateLocation(value === "yes");
              setSelectedId(value === "yes" ? "yes" : "no");
            }}
            selectedId={selectedId}
            layout="row"
          />

          <View style={styles.editBTNS}>
            <View style={styles.editBTN}>
              <Button title="Edit Clinic" onPress={() => handleEditClinic()} />
            </View>
            <View style={styles.editBTN}>
              <Button
                title="Cancel"
                onPress={() => {
                  setEditMode(false);
                  setName("");
                  setOpenTime("");
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.WarningMessage}>
            Location: Your current location
          </Text>
          <Button title="Add Clinic" onPress={handleAddClinic} />
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={clinics}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.clinicCard}>
              <View style={styles.headCard}>
                <Text style={styles.clinicName}>{item.name}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditMode(true);
                      setClinicId(item._id!);
                      setName(item.name);
                      setOpenTime(item.openTime);
                      setLocation(item.location);
                      setUpdateLocation(false);
                      setSelectedId("no");
                    }}
                  >
                    <Icon
                      name="edit"
                      size={24}
                      color="#007AFF"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteClinic(item._id!)}
                  >
                    <Icon
                      name="delete"
                      size={24}
                      color="#FF3B30"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text>Open: {item.openTime}</Text>

              {item.location && (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={item.location} title={item.name} />
                </MapView>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyHeader: {
    height: 30,
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  headCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  WarningMessage: {
    fontSize: 12,
    marginBottom: 10,
  },
  clinicCard: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  map: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 5,
  },
  editBTNS: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  editBTN: {
    width: "45%",
  },
  locationText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default VetClinicsScreen;
