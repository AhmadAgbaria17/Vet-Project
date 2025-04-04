import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Header from '../../components/Header';
import FeatureCard from '../../components/FeatureCard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; 

interface ClientHomeScreenProps {
  navigation: any,
}

const ClientHomeScreen = ({navigation}:ClientHomeScreenProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(()=>{
    const fetchUserInfo =async()=>{
      try {
        const token = await AsyncStorage.getItem("authToken");
        if(!token) return;
        const decodedUser = jwtDecode(token);
        setUser(decodedUser)

      } catch (error) {
        console.error("Error getting user info:", error);
      }
    }

    fetchUserInfo();

  },[])



  return (
    <View style={styles.container}>
      {/* Header */}
      <Header navigation={navigation}/>

      <ScrollView>
        {/*welcome section*/}
        
        <View  style={styles.welcomeSection} >
          <Text>CLient APP</Text>
          <Text onPress={()=> navigation.navigate('Clinics')} style={styles.welcomeTitle} >
            Welcome {user ? `Dr.${user.firstName}`:"!"}!
            </Text>
          <Text style={styles.welcomeSubtitle} >
            Find nearby veterinary clinics, emergency services, and pet care tips.
          </Text>
        </View>
    
        {/*Assists Cards*/}
        <View style={styles.featuresSection}>
        
          
        </View>

        {/* Promo Section */}
        <View style={styles.promoSection}>
          <Image
            source={{ uri: 'https://media.istockphoto.com/id/1353103116/photo/veterinarian-examining-cute-pug-dog-and-cat-in-clinic-closeup-vaccination-day.jpg?s=612x612&w=0&k=20&c=rVYhuc25uTbejkXgkfgfOwGLpTmNJ_zGafejYKgqer0=' }}
            style={styles.promoImage}
          />
          <Text style={styles.promoText}>
            Ensure your pet's health with our trusted veterinary services.
          </Text>
        </View>

      </ScrollView>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container :{
    flex:1,
    backgroundColor:'#f8f9fa'
  },
  welcomeSection :{
    padding:20,
    alignItems:'center',
  },
  welcomeTitle :{
    fontSize:26,
    fontWeight:'bold',
    marginBottom:10,
  },
  welcomeSubtitle :{
    fontSize:16,
    color:'#555',
    textAlign:'center',
  },
  featuresSection:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-around',
    padding:10,
  },
  promoSection: {
    margin: 20,
    alignItems: 'center',
  },
  promoImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  promoText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
});

export default ClientHomeScreen;
