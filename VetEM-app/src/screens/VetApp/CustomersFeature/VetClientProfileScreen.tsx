// VetClientProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';
import { Customer } from '../../../interfaces/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MedicalHistoryCard from './components/MedicalHistoryCard';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../../navigation/types';


type VetClientProfileScreenProps = DrawerScreenProps<
  RootDrawerParamList,
  'VetClientProfileScreen'
>;

const VetClientProfileScreen: React.FC<VetClientProfileScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer>({
    _id: userId,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImg: '',
    clientInfo: {
      pets: [],
      clientVet: [],
      clientVetRequests: [],
      clientVetWaitApproval: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
        const response = await axios.get(
          `http://192.168.10.126:5000/mongodb/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCustomer(response.data.user);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddMedicalRecord = (petId: string) => {
    navigation.navigate('AddMedicalRecord', { petId, userId });
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={customer.clientInfo?.pets}
          keyExtractor={(pet) => pet._id}
          ListHeaderComponent={() => (
            <View>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person-outline" size={24} color="#3498db" />
                  <Text style={styles.sectionTitle}>Customer Information</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.name}>{customer.firstName} {customer.lastName}</Text>
                  <Text style={styles.info}><Ionicons name="mail-outline" size={16} color="#666" /> {customer.email}</Text>
                  <Text style={styles.info}><Ionicons name="call-outline" size={16} color="#666" /> {customer.phone}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="paw-outline" size={24} color="#3498db" />
                  <Text style={styles.sectionTitle}>Pets</Text>
                </View>
              </View>
            </View>
          )}
          renderItem={({ item: pet }) => (
            <View style={styles.petCard}>
              <View style={styles.petHeader}>
                <View>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petInfo}>{pet.species} • {pet.breed} • {pet.age} years</Text>
                </View>
                <TouchableOpacity
                  style={styles.addRecordButton}
                  onPress={() => handleAddMedicalRecord(pet._id)}
                >
                  <Ionicons name="add-circle-outline" size={24} color="white" />
                  <Text style={styles.addRecordButtonText}>Add Record</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.medicalHistoryContainer}>
                <Text style={styles.medicalHistoryTitle}>Medical History</Text>
                <MedicalHistoryCard medicalHistory={pet.medicalHistory} petId={pet._id} />
              </View>
            </View>
          )}
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, color: '#666', marginBottom: 5 },
  petCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  petHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  petName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  petInfo: { fontSize: 14, color: '#666' },
  addRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    padding: 8,
    borderRadius: 8,
  },
  addRecordButtonText: { color: 'white', marginLeft: 5 },
  medicalHistoryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  medicalHistoryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
});

export default VetClientProfileScreen;
