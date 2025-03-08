import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, Image, ScrollView } from 'react-native';
import Header from '../../components/Header';
import FeatureCard from '../../components/FeatureCard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; 

interface VetHomeScreenProps {
  navigation: any,
}

const VetHomeScreen = ({navigation}:VetHomeScreenProps) => {
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
          <Text  style={styles.welcomeTitle} >
            Welcome {user ? `Dr.${user.firstName}`:"Veterinarian"}!
            </Text>
          <Text style={styles.welcomeSubtitle} >
          Manage your clinics, customers, and veterinary services.
          </Text>
        </View>
    
        {/*Assists Cards*/}
        <View style={styles.featuresSection}>
          <FeatureCard 
          user={user}
          navigation={navigation} 
          pathName={"VetClinics"}
          iconName={'business-outline'}
          iconColor={"#3498db"}
          textTitle={"My Clinics"}
          textCard={"Manage your assigned clinics"}
          />

          <FeatureCard 
          user={user}
          navigation={navigation} 
          pathName={"VetCustomers"}
          iconName={'people-outline'}
          iconColor={"#27ae60"}
          textTitle={"My Customers"}
          textCard={"View and assist pet owners"}
          />

          <FeatureCard
          user={user} 
          navigation={navigation} 
          pathName={"VetQnA"}
          iconName={'chatbubbles-outline'}
          iconColor={"#f39c12"}
          textTitle={"Q&A"}
          textCard={"Answer pet health questions"}
          />

          <FeatureCard
            user={user} 
            navigation={navigation} 
            pathName={"Appointments"}
            iconName={'calendar-outline'}
            iconColor={"#9b59b6"}
            textTitle={"Appointments"}
            textCard={"Manage scheduled visits"}
          />

          <FeatureCard 
            user={user}
            navigation={navigation} 
            pathName={"MedicalRecords"}
            iconName={'document-text-outline'}
            iconColor={"#e74c3c"}
            textTitle={"Medical Records"}
            textCard={"Access pet medical histories"}
          />
          
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

export default VetHomeScreen;
