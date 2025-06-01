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
import DateTimePicker from '@react-native-community/datetimepicker';

interface Appointment {
  _id: string;
  clinicId: string;
  clinicName: string;
  petId: string;
  petName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface Pet {
  _id: string;
  name: string;
}

interface Clinic {
  _id: string;
  name: string;
}

interface AppointmentsScreenProps {
  navigation: any;
}

const AppointmentsScreen = ({ navigation }: AppointmentsScreenProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [newAppointment, setNewAppointment] = useState({
    clinicId: '',
    petId: '',
    date: new Date(),
    time: new Date(),
    reason: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchPets();
    fetchClinics();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('http://192.168.10.126:5000/mongodb/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const fetchClinics = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('http://192.168.10.126:5000/mongodb/clinics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClinics(response.data.clinics);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    }
  };

  const handleAddAppointment = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      await axios.post(
        'http://192.168.10.126:5000/mongodb/appointments',
        {
          ...newAppointment,
          date: newAppointment.date.toISOString().split('T')[0],
          time: newAppointment.time.toLocaleTimeString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModalVisible(false);
      setNewAppointment({
        clinicId: '',
        petId: '',
        date: new Date(),
        time: new Date(),
        reason: '',
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#2ecc71';
      case 'pending':
        return '#f1c40f';
      case 'completed':
        return '#3498db';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Appointments</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.addButtonText}>New Appointment</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.appointmentsContainer}>
            {appointments.map((appointment) => (
              <View key={appointment._id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Ionicons name="calendar-outline" size={24} color="#3498db" />
                  <Text style={styles.clinicName}>{appointment.clinicName}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(appointment.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>
                <Text style={styles.petName}>Pet: {appointment.petName}</Text>
                <Text style={styles.appointmentInfo}>Date: {appointment.date}</Text>
                <Text style={styles.appointmentInfo}>Time: {appointment.time}</Text>
                <Text style={styles.appointmentInfo}>Reason: {appointment.reason}</Text>
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
            <Text style={styles.modalTitle}>Schedule Appointment</Text>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Clinic:</Text>
              <View style={styles.picker}>
                {clinics.map((clinic) => (
                  <TouchableOpacity
                    key={clinic._id}
                    style={[
                      styles.pickerItem,
                      newAppointment.clinicId === clinic._id && styles.pickerItemSelected,
                    ]}
                    onPress={() => setNewAppointment({ ...newAppointment, clinicId: clinic._id })}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        newAppointment.clinicId === clinic._id && styles.pickerItemTextSelected,
                      ]}
                    >
                      {clinic.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Pet:</Text>
              <View style={styles.picker}>
                {pets.map((pet) => (
                  <TouchableOpacity
                    key={pet._id}
                    style={[
                      styles.pickerItem,
                      newAppointment.petId === pet._id && styles.pickerItemSelected,
                    ]}
                    onPress={() => setNewAppointment({ ...newAppointment, petId: pet._id })}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        newAppointment.petId === pet._id && styles.pickerItemTextSelected,
                      ]}
                    >
                      {pet.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                Select Date: {newAppointment.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newAppointment.date}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewAppointment({ ...newAppointment, date: selectedDate });
                  }
                }}
              />
            )}

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                Select Time: {newAppointment.time.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={newAppointment.time}
                mode="time"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setNewAppointment({ ...newAppointment, time: selectedTime });
                  }
                }}
              />
            )}

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Reason for visit"
              value={newAppointment.reason}
              onChangeText={(text) => setNewAppointment({ ...newAppointment, reason: text })}
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
                onPress={handleAddAppointment}
              >
                <Text style={styles.buttonText}>Schedule</Text>
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
  appointmentsContainer: {
    gap: 15,
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  petName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  appointmentInfo: {
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerItemSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  pickerItemText: {
    color: '#666',
  },
  pickerItemTextSelected: {
    color: 'white',
  },
  datePickerButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  datePickerButtonText: {
    color: '#666',
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

export default AppointmentsScreen; 