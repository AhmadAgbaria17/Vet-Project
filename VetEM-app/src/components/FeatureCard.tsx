import React from 'react';
import {  Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JWTUser } from '../interfaces/types';

interface FeatureCardProps {
  user:JWTUser|null,
  navigation: any,
  pathName: string|undefined,
  iconName: any,
  iconColor: string,
  textTitle: string,
  textCard: string,
}

const FeatureCard: React.FC<FeatureCardProps> = ({user, navigation , pathName , iconName, iconColor,textTitle,textCard }) => {
  return (
    <TouchableOpacity
      style={styles.featureCard}
      onPress={() => navigation.navigate(pathName, {user})}
    >
      <Ionicons name={iconName} size={40} color={iconColor} />
      <Text style={styles.featureTitle}>{textTitle}</Text>
      <Text style={styles.featureDescription}>{textCard}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  featureCard:{
    backgroundColor:'#fff',
    width:'45%',
    padding:15,
    borderRadius:10,
    alignItems:'center',
    marginBottom:15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  featureTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  featureDescription:{
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  }
});

export default FeatureCard
