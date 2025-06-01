import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

interface AddMedicalRecordProps {
  navigation: any;
  route: {
    params: {
      petId: string;
      customerId: string;
    };
  };
}

const AddMedicalRecord = ({ navigation, route }: AddMedicalRecordProps) => {
  const { petId, customerId } = route.params;
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState({
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!record.diagnosis || !record.treatment) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Diagnosis and treatment are required',
      });
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      await axios.post(
        `http://192.168.10.126:5000/mongodb/pets/${petId}/medical-records`,
        {
          ...record,
          customerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Medical record added successfully',
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error adding medical record:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add medical record',
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
        <View style={styles.header}>
          <Ionicons name="medical-outline" size={24} color="#3498db" />
          <Text style={styles.title}>Add Medical Record</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Diagnosis *</Text>
            <TextInput
              style={styles.input}
              value={record.diagnosis}
              onChangeText={(text) => setRecord({ ...record, diagnosis: text })}
              placeholder="Enter diagnosis"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Treatment *</Text>
            <TextInput
              style={styles.input}
              value={record.treatment}
              onChangeText={(text) => setRecord({ ...record, treatment: text })}
              placeholder="Enter treatment details"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prescription</Text>
            <TextInput
              style={styles.input}
              value={record.prescription}
              onChangeText={(text) => setRecord({ ...record, prescription: text })}
              placeholder="Enter prescription details"
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={record.notes}
              onChangeText={(text) => setRecord({ ...record, notes: text })}
              placeholder="Enter any additional notes"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="white" />
                <Text style={styles.submitButtonText}>Save Record</Text>
              </>
            )}
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AddMedicalRecord; 