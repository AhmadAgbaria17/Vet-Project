import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Question } from '../../../../interfaces/types';

interface QuestionsProps {
  questions: Question[];
  setSelectedQuestion: (question: Question) => void;
}

const Questions = ({questions,setSelectedQuestion}:QuestionsProps) => {
    
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };


  return (
      <View style={styles.questionsContainer}>
            {questions.map((question) => (
              <View key={question._id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View>
                    <Text style={styles.customerName}>Customer: {question.customerId.firstName} {question.customerId.lastName}</Text>
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

                <Text style={styles.questionText}>{question.questionText}</Text>

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
  )
}

const styles = StyleSheet.create( {
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
  }
});

export default Questions
