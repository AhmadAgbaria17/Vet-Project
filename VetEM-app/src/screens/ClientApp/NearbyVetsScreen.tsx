import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface NearbyVetsScreenProps {
  navigation: any;
}

interface Clinic {
  _id: string;
  name: string;
  openTime: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const NearbyVetsScreen = ({ navigation }: NearbyVetsScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    const getLocationAndClinics = async () => {
      try {
        // Get user's location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        // Get user's current location
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);

        // Get nearby clinics
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const response = await axios.get('http://192.168.10.126:5000/mongodb/clinics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClinics(response.data.clinics);
      } catch (error) {
        console.error('Error fetching location or clinics:', error);
      } finally {
        setLoading(false);
      }
    };

    getLocationAndClinics();
  }, []);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      
      <ScrollView>
        <Text style={styles.title}>Nearby Veterinary Clinics</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {userLocation && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {/* User's location marker */}
                <Marker
                  coordinate={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                  }}
                  title="You are here"
                  pinColor="blue"
                />

                {/* Clinic markers */}
                {clinics.map((clinic) => (
                  <Marker
                    key={clinic._id}
                    coordinate={{
                      latitude: clinic.location.latitude,
                      longitude: clinic.location.longitude,
                    }}
                    title={clinic.name}
                    description={`Open: ${clinic.openTime}`}
                  />
                ))}
              </MapView>
            )}

            <View style={styles.clinicsList}>
              {clinics.map((clinic) => (
                <View key={clinic._id} style={styles.clinicCard}>
                  <Text style={styles.clinicName}>{clinic.name}</Text>
                  <Text>Opening Hours: {clinic.openTime}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  clinicsList: {
    padding: 20,
  },
  clinicCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default NearbyVetsScreen; 