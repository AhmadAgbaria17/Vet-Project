import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  medicalHistory: string;
}

interface MyPetsScreenProps {
  navigation: any;
}

const MyPetsScreen = ({ navigation }: MyPetsScreenProps) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    medicalHistory: '',
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('http://192.168.10.126:5000/mongodb/pets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPets(response.data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      await axios.post(
        'http://192.168.10.126:5000/mongodb/pets',
        {
          ...newPet,
          age: parseInt(newPet.age),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModalVisible(false);
      setNewPet({
        name: '',
        species: '',
        breed: '',
        age: '',
        medicalHistory: '',
      });
      fetchPets();
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Pets</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Pet</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.petsContainer}>
            {pets.map((pet) => (
              <View key={pet._id} style={styles.petCard}>
                <View style={styles.petHeader}>
                  <Ionicons name="paw-outline" size={24} color="#3498db" />
                  <Text style={styles.petName}>{pet.name}</Text>
                </View>
                <Text style={styles.petInfo}>Species: {pet.species}</Text>
                <Text style={styles.petInfo}>Breed: {pet.breed}</Text>
                <Text style={styles.petInfo}>Age: {pet.age} years</Text>
                <Text style={styles.petInfo}>Medical History: {pet.medicalHistory}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Pet</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Pet Name"
              value={newPet.name}
              onChangeText={(text) => setNewPet({ ...newPet, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Species"
              value={newPet.species}
              onChangeText={(text) => setNewPet({ ...newPet, species: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Breed"
              value={newPet.breed}
              onChangeText={(text) => setNewPet({ ...newPet, breed: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={newPet.age}
              onChangeText={(text) => setNewPet({ ...newPet, age: text })}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Medical History"
              value={newPet.medicalHistory}
              onChangeText={(text) => setNewPet({ ...newPet, medicalHistory: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddPet}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 5,
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
    alignItems: 'center',
    marginBottom: 10,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  petInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MyPetsScreen; 