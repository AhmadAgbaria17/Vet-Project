import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Header from '../../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

interface Question {
  _id: string;
  customerId: string;
  customerName: string;
  petName: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  createdAt: string;
}

interface VetQnAScreenProps {
  navigation: any;
}

const VetQnAScreen = ({ navigation }: VetQnAScreenProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('http://192.168.10.126:5000/mongodb/questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load questions',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!selectedQuestion || !answer.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please provide an answer',
      });
      return;
    }

    setAnswering(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      await axios.post(
        `http://192.168.10.126:5000/mongodb/questions/${selectedQuestion._id}/answer`,
        { answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Answer submitted successfully',
      });

      setSelectedQuestion(null);
      setAnswer('');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit answer',
      });
    } finally {
      setAnswering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <Toast />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="chatbubbles-outline" size={24} color="#3498db" />
          <Text style={styles.title}>Pet Health Q&A</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.questionsContainer}>
            {questions.map((question) => (
              <View key={question._id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View>
                    <Text style={styles.customerName}>{question.customerName}</Text>
                    <Text style={styles.petName}>Pet: {question.petName}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          question.status === 'answered' ? '#2ecc71' : '#f1c40f',
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {question.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.timestamp}>
                  Asked on: {formatDate(question.createdAt)}
                </Text>

                <Text style={styles.questionText}>{question.question}</Text>

                {question.answer && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>Your Answer:</Text>
                    <Text style={styles.answerText}>{question.answer}</Text>
                  </View>
                )}

                {question.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.answerButton}
                    onPress={() => setSelectedQuestion(question)}
                  >
                    <Ionicons name="create-outline" size={20} color="white" />
                    <Text style={styles.answerButtonText}>Answer</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Answer Modal */}
      {selectedQuestion && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Answer Question</Text>
            <Text style={styles.modalQuestion}>{selectedQuestion.question}</Text>

            <TextInput
              style={styles.answerInput}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Type your answer here..."
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setSelectedQuestion(null);
                  setAnswer('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAnswer}
                disabled={answering}
              >
                {answering ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  questionsContainer: {
    gap: 15,
  },
  questionCard: {
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
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  petName: {
    fontSize: 14,
    color: '#666',
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
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 15,
  },
  answerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 14,
    color: '#333',
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  answerButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 15,
  },
  modalQuestion: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VetQnAScreen; 