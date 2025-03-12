import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Toast from 'react-native-toast-message'; 



interface Clinic {
  name: string;
  openTime: string;
  location: { latitude: number; longitude: number };
  userId: string;
}

const VetClinicsScreen = ({route}:any) => {
  const user = route.params?.user;
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [name, setName] = useState('');
  const [openTime, setOpenTime] = useState('');


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to add clinics.');
        return;
      }

      // get the clinics of this user form the DB and put it in setClinics

    
    })();
  }, []);

  const handleAddClinic = async () => {
    if (!name || !openTime) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    if (!currentLocation?.coords) {
      Alert.alert('Location Error', 'Could not retrieve your location.');
      return;
    }

    const newClinic: Clinic = {
      name,
      openTime,
      location: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      userId : user.userId, 
    };

  
    try {
      const response = await axios.post(
        'http://192.168.10.126:5000/mongodb/clinic/home',
        newClinic
      );

      Toast.show({
        type:'success',
        text1:"Clincs Added",
        text2: response.data.message,
      });    
    } catch (error:any) {
      console.error("error add clinic: ",error);

      Toast.show({
        type:'error',
        text1:"Error",
        text2: error.response?.data.message || "An error occurred",
      })
    }
    
    //setName('');
    //setOpenTime('');
  };

  return (
    <View style={styles.container}>
        <View style={styles.emptyHeader}>
            <Toast position='top' />
            </View>
      <Text style={styles.title}>Manage Your Clinics  </Text>

      <TextInput placeholder="Clinic Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Opening Time (exp: 9:00-22:00)" value={openTime} onChangeText={setOpenTime} style={styles.input} />
      <Text style={styles.WarningMessage} >Location: Your current location</Text>

      <Button title="Add Clinic" onPress={handleAddClinic} />

      <FlatList
        
        data={clinics}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.clinicCard}>
            <Text style={styles.clinicName}>{item.name}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  emptyHeader:{
    height:30,
    zIndex:1,
  },
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' , marginTop:10  },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' },
  WarningMessage:{fontSize:12 , marginBottom:10},
  clinicCard: { padding: 15, borderWidth: 1, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff', marginTop: 10 },
  clinicName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  map: { width: '100%', height: 150, marginTop: 10, borderRadius: 5 },
});

export default VetClinicsScreen;
