import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Question } from '../../../../interfaces/types';

interface SelectedQuestionProps {
  selectedQuestion: Question | null;
  setSelectedQuestion?: (question: Question | null) => void;
  answer: string;
  setAnswer: (text: string) => void;
  handleAnswer: () => void;
  answering: boolean;
}

const SelectedQuestion = ({selectedQuestion,setSelectedQuestion
, answer, setAnswer, handleAnswer, answering
}:SelectedQuestionProps) => {
  return (
    <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Answer Question</Text>
                <Text style={styles.modalQuestion}>{selectedQuestion?.questionText}</Text>
    
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
                      setSelectedQuestion?(null): null;
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
  )
}

const styles = StyleSheet.create({
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


export default SelectedQuestion
