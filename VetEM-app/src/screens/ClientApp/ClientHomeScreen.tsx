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
        
        <View style={styles.welcomeSection} >
          <Text style={styles.welcomeTitle} >
            Welcome {user ? user.firstName : ""}!
          </Text>
          <Text style={styles.welcomeSubtitle} >
            Find nearby veterinary clinics, emergency services, and pet care tips.
          </Text>
        </View>
    
        {/*Features Cards*/}
        <View style={styles.featuresSection}>
          <FeatureCard 
            user={user}
            navigation={navigation} 
            pathName={"NearbyVets"}
            iconName={'search-outline'}
            iconColor={"#3498db"}
            textTitle={"Find Vets"}
            textCard={"Search for veterinary clinics near you"}
          />
          
          <FeatureCard 
            user={user}
            navigation={navigation} 
            pathName={"MyPets"}
            iconName={'paw-outline'}
            iconColor={"#27ae60"}
            textTitle={"My Pets"}
            textCard={"Manage your pets' profiles and records"}
          />
          
          <FeatureCard 
            user={user}
            navigation={navigation} 
            pathName={"Appointments"}
            iconName={'calendar-outline'}
            iconColor={"#e74c3c"}
            textTitle={"Appointments"}
            textCard={"Schedule and manage vet visits"}
          />
        </View>

        {/* Promo Section */}
        <View style={styles.promoSection}>
          <Image
            source={{ uri: 'https://media.istockphoto.com/id/1353103116/photo/veterinarian-examining-cute-pug-dog-and-cat-in-clinic-closeup-vaccination-day.jpg?s=612x612&w=0&k=20&c=rVYhuc25uTbejkXgfgfOwGLpTmNJ_zGafejYKgqer0=' }}
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
