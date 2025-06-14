import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';
import { Customer } from '../../../interfaces/types';

interface VetClientProfileScreenProps {
  navigation: any;
  route: {
    params: {
      customerId: string;
    };
  };
}



const VetClientProfileScreen = ({ navigation, route }: VetClientProfileScreenProps) => {
  const { customerId } = route.params;
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer>(
    {
      _id: customerId,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      profileImg: '',
      clientInfo: {
        pets: [],
        clientVet: [],
        clientVetRequests: [],
        clientVetWaitApproval: [],
      },
    }
  );

  useEffect(() => {
    // Simulate a delay for fetching customer data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleAddMedicalRecord = (petId: string) => {
    navigation.navigate('AddMedicalRecord', { petId, customerId });
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <ScrollView style={styles.content}>
        {/* Customer Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={24} color="#3498db" />
            <Text style={styles.sectionTitle}>Customer Information</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.name}>{customer.firstName} {customer.lastName}</Text>
            <Text style={styles.info}>
              <Ionicons name="mail-outline" size={16} color="#666" /> {customer.email}
            </Text>
            <Text style={styles.info}>
              <Ionicons name="call-outline" size={16} color="#666" /> {customer.phone}
            </Text>
          </View>
        </View>

        {/* Pets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="paw-outline" size={24} color="#3498db" />
            <Text style={styles.sectionTitle}>Pets</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.petsContainer}>
              {customer.clientInfo?.pets.map((pet) => (
                <View key={pet._id} style={styles.petCard}>
                  <View style={styles.petHeader}>
                    <View>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petInfo}>
                        {pet.species} • {pet.breed} • {pet.age} years
                      </Text>
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
                    <Text style={styles.medicalHistoryText}>{}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  petsContainer: {
    gap: 15,
  },
  petCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  petInfo: {
    fontSize: 14,
    color: '#666',
  },
  addRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    padding: 8,
    borderRadius: 8,
  },
  addRecordButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  medicalHistoryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
  },
  medicalHistoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  medicalHistoryText: {
    fontSize: 14,
    color: '#666',
  },
});

export default VetClientProfileScreen; 