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
import { Question } from '../../../interfaces/types';
import Questions from './components/Questions';
import SelectedQuestion from './components/SelectedQuestion';

interface VetQnAScreenProps {
  navigation: any;
}

const VetQnAScreen = ({ navigation }: VetQnAScreenProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    setLoading(true);
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
      await axios.put(
        `http://192.168.10.126:5000/mongodb/questions/answer/${selectedQuestion._id}`,
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
          <Questions questions={questions} setSelectedQuestion={setSelectedQuestion} />
        )}
      </ScrollView>


      {/* Answer Modal */}
      {selectedQuestion && (
        <SelectedQuestion
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          answer={answer}
          setAnswer={setAnswer}
          handleAnswer={handleAnswer}
          answering={answering}
        />
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
});

export default VetQnAScreen; 