// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from '../components/CustomDrawerContent';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VetHomeScreen from '../screens/VetApp/VetHomeScreen';
import ClientHomeScreen from '../screens/ClientApp/ClientHomeScreen';
import AdminHomeScreen from '../screens/AdminApp/AdminHomeScreen';
import VetClinicsScreen from '../screens/VetApp/VetClincsScreen';

const Drawer = createDrawerNavigator();

const User = {
  name: 'User',
  email: 'a@b.com',
  profileImg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
}



const AppNavigator = () => {
  return (

    <NavigationContainer>
      
        <Drawer.Navigator 
        drawerContent={(navigation)=> <CustomDrawerContent User={User} navigation={navigation} />}
        screenOptions={{
          headerShown: false,
          drawerPosition:'right',
          drawerType:'slide',
        }}
        >
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Signup" component={SignupScreen} />
          <Drawer.Screen name="AdminHome" component={AdminHomeScreen} />
          <Drawer.Screen name="VetHome" component={VetHomeScreen} />
          <Drawer.Screen name="ClientHome" component={ClientHomeScreen} />
          <Drawer.Screen name="VetClinics" component={VetClinicsScreen} />



          
        </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
