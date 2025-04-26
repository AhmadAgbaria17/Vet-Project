// src/navigation/AppNavigator.tsx
import React, { useEffect , useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from '@react-navigation/stack'; 
import CustomDrawerContent from '../components/CustomDrawerContent';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VetHomeScreen from '../screens/VetApp/VetHomeScreen';
import ClientHomeScreen from '../screens/ClientApp/ClientHomeScreen';
import VetClinicsScreen from '../screens/VetApp/ClinicsFeature/VetClincsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { jwtDecode } from "jwt-decode"; 
import VetCustomresScreen from '../screens/VetApp/CustomersFeature/VetCustomresScreen';
import VetAddCustomerScreen from '../screens/VetApp/CustomersFeature/VetAddCustomerScreen';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();




const AuthNavigator = ({setIsLoggedIn}:any ) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Stack.Screen>
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);



const AppNavigator = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('authToken');
        if(userToken){
          const decodedUser = jwtDecode(userToken) as any;
          setUser(decodedUser);
          setIsLoggedIn(true);
        }else{
          setIsLoggedIn(false);
          setUser(null);
        }
        
      } catch (error) {
        console.log("Error checking login status:", error);
        setIsLoggedIn(false);
        setUser(null);
      }finally{
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, [])

  if(loading) {
    return null 
  }
  
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Drawer.Navigator 
        drawerContent={(navigation)=> <CustomDrawerContent setIsLoggedIn={setIsLoggedIn} userId={user.userId} navigation={navigation} />}
        screenOptions={{
          headerShown: false,
          drawerPosition:'right',
          drawerType:'slide',
        }}
        >
      

          {/* Vet Screens */}
          {user?.userType === 'vet' && (
            <>
                <Drawer.Screen name="VetHome" component={VetHomeScreen} />
                <Drawer.Screen name="VetClinics" component={VetClinicsScreen} />
                <Drawer.Screen name="vetCustomers" component={VetCustomresScreen}/>
                <Drawer.Screen name="VetAddCustomerScreen" component={VetAddCustomerScreen}/>
              
            </>
          )}

          {/* Client Screens */}
        {user?.userType === 'client' && (
            <Drawer.Screen name="ClientHome" component={ClientHomeScreen} />
          )}
          
        </Drawer.Navigator>
      ):
      (
        <AuthNavigator setIsLoggedIn={setIsLoggedIn} />
      )}
        
    </NavigationContainer>
  );
};

export default AppNavigator;
