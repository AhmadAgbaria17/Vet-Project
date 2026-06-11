import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../../../components/Header';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Clinic } from '../../../interfaces/types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface NearbyVetsScreenProps {
  navigation: any;
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

        const token = await AsyncStorage.getItem('authToken');
         if (!token) return;

        const response = await axios.get('http://192.168.10.126:5000/mongodb/clinics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });

        setClinics(response.data.clinics || response.data.UserClinics || []);
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
                    description={`Open: ${clinic.openTime}${getVetName(clinic) ? ` | Dr. ${getVetName(clinic)}` : ''}`}
                  />
                ))}
              </MapView>
            )}

            <View style={styles.clinicsList}>
              {clinics.map((clinic) => (
                <View key={clinic._id} style={styles.clinicCard}>
                  <Text style={styles.clinicName}>{clinic.name}</Text>
                  <Text style={styles.clinicInfo}>Opening Hours: {clinic.openTime}</Text>
                  {getVetName(clinic) && (
                    <Text style={styles.clinicInfo}>Vet Doctor: Dr. {getVetName(clinic)}</Text>
                  )}
                  {getVetContact(clinic) && (
                    <Text style={styles.clinicInfo}>Contact: {getVetContact(clinic)}</Text>
                  )}
                  {clinic.distanceKm !== undefined && (
                    <Text style={styles.clinicInfo}>{clinic.distanceKm} km away</Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const getVetName = (clinic: Clinic) => {
  if (!clinic.userId || typeof clinic.userId === 'string') return '';
  return `${clinic.userId.firstName} ${clinic.userId.lastName}`.trim();
};

const getVetContact = (clinic: Clinic) => {
  if (!clinic.userId || typeof clinic.userId === 'string') return '';
  return clinic.userId.phone || clinic.userId.email || '';
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
  clinicInfo: {
    color: '#555',
    marginBottom: 4,
  },
});

export default NearbyVetsScreen; 
