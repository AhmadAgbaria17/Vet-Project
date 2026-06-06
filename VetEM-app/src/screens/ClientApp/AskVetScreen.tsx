import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import { Clinic, Pet, Question } from '../../interfaces/types';
import axios from 'axios';

interface VetOption {
  _id: string;
  name: string;
}

interface AskVetScreenProps {
  navigation: any;
}

const AskVetScreen = ({ navigation }: AskVetScreenProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [vets, setVets] = useState<VetOption[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vetId, setVetId] = useState('');
  const [petName, setPetName] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectedVetName = useMemo(
    () => vets.find((vet) => vet._id === vetId)?.name || 'Select veterinarian',
    [vetId, vets]
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [questionsResponse, clinicsResponse, petsResponse] = await Promise.all([
        axios.get('http://192.168.10.126:5000/mongodb/questions'),
        axios.get('http://192.168.10.126:5000/mongodb/clinics'),
        axios.get('http://192.168.10.126:5000/mongodb/pets'),
      ]);

      setQuestions(questionsResponse.data.questions || []);
      setPets(petsResponse.data.pets || []);

      const vetMap = new Map<string, VetOption>();
      (clinicsResponse.data.clinics || []).forEach((clinic: Clinic) => {
        if (typeof clinic.userId === 'object' && clinic.userId?._id) {
          vetMap.set(clinic.userId._id, {
            _id: clinic.userId._id,
            name: `${clinic.userId.firstName} ${clinic.userId.lastName}`,
          });
        }
      });

      const vetOptions = Array.from(vetMap.values());
      setVets(vetOptions);
      if (!vetId && vetOptions[0]) setVetId(vetOptions[0]._id);
    } catch (error) {
      console.error('Error loading Q&A data:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load Q&A data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitQuestion = async () => {
    if (!vetId || questionText.trim().length < 5) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Choose a vet and write a question' });
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://192.168.10.126:5000/mongodb/questions', {
        vetId,
        petName,
        questionText: questionText.trim(),
      });

      setQuestionText('');
      setPetName('');
      await loadData();
      Toast.show({ type: 'success', text1: 'Success', text2: 'Question sent' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to send question',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Toast />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="chatbubbles-outline" size={24} color="#3498db" />
          <Text style={styles.title}>Ask a Veterinarian</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : (
          <>
            <View style={styles.form}>
              <Text style={styles.label}>{selectedVetName}</Text>
              <View style={styles.optionRow}>
                {vets.map((vet) => (
                  <TouchableOpacity
                    key={vet._id}
                    style={[styles.option, vetId === vet._id && styles.optionSelected]}
                    onPress={() => setVetId(vet._id)}
                  >
                    <Text style={[styles.optionText, vetId === vet._id && styles.optionTextSelected]}>
                      {vet.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Pet name"
                value={petName}
                onChangeText={setPetName}
              />
              {pets.length > 0 && (
                <View style={styles.optionRow}>
                  {pets.map((pet) => (
                    <TouchableOpacity key={pet._id} style={styles.option} onPress={() => setPetName(pet.name)}>
                      <Text style={styles.optionText}>{pet.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your question"
                value={questionText}
                onChangeText={setQuestionText}
                multiline
              />

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.disabledButton]}
                onPress={submitQuestion}
                disabled={submitting}
              >
                <Text style={styles.submitText}>{submitting ? 'Sending...' : 'Send Question'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Previous Questions</Text>
            {questions.length === 0 ? (
              <Text style={styles.emptyText}>No questions yet.</Text>
            ) : (
              questions.map((question) => (
                <View key={question._id} style={styles.questionCard}>
                  <Text style={styles.questionText}>{question.questionText}</Text>
                  <Text style={styles.metaText}>Status: {question.status}</Text>
                  {!!question.answer && <Text style={styles.answerText}>{question.answer}</Text>}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  form: { backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  option: { borderWidth: 1, borderColor: '#ddd', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  optionSelected: { backgroundColor: '#3498db', borderColor: '#3498db' },
  optionText: { color: '#555' },
  optionTextSelected: { color: 'white' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  textArea: { height: 120, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#2ecc71', padding: 14, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#95a5a6' },
  submitText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 10 },
  questionCard: { backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 10 },
  questionText: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  metaText: { color: '#666', marginBottom: 6 },
  answerText: { color: '#333' },
});

export default AskVetScreen;
