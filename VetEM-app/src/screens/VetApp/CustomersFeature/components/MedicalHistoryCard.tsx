import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MedicalRecord } from '../../../../interfaces/types';

interface MedicalHistoryCardProps {
  medicalHistory: MedicalRecord[];
  petId: string;
}

const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({medicalHistory,petId}) => {

  if (!medicalHistory || medicalHistory.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.noHistoryText}>No medical history available for this pet.</Text>
      </View>
    );
  }



  return (
    <FlatList
      data={medicalHistory}
      keyExtractor={(_,index)=>`${petId}-${index}`}
      renderItem={({item,index})=>(
        <View style={styles.card}>
          <Text style={styles.indexTitle} >Record {index + 1 }</Text>

          <Text style={styles.label}>Diagnosos:</Text>
          <Text style={styles.value}>{item.diagnosis}</Text>

          <Text style={styles.label}>Treatment:</Text>
          <Text style={styles.value}>{item.treatment}</Text>

          <Text style={styles.label}>Prescription:</Text>
          <Text style={styles.value}>{item.prescription}</Text>

          {item.notes ? (
            <>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.value}>{item.notes}</Text>
            </>
          ):null}

        </View>
      )}
    
    
    />
  )
}

export default MedicalHistoryCard


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  indexTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    marginTop: 4,
  },
  value: {
    marginLeft: 8,
    marginBottom: 4,
    color: '#333',
  },
  noHistoryText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
});