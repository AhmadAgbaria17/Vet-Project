import React from 'react'
import { View , StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


type BackButtonProps = {
  navigation: any;
  targetScreen: string;
  userId?: string; // Optional, if needed for navigation
};


const BackButton: React.FC<BackButtonProps> = ({navigation , targetScreen, userId}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={()=> {
          userId ? navigation.navigate(targetScreen, { userId }) : navigation.navigate(targetScreen);
        }}
        style={styles.button}
        
    >
        <Ionicons name="arrow-back" size={20} color="white" />

      </TouchableOpacity>
    </View>
  )
}

export default BackButton


const styles = StyleSheet.create({
  container:{
    position: 'absolute',
    bottom: 70,
    left: 20,
    zIndex: 999,
  },
  button:{
     flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  }


})