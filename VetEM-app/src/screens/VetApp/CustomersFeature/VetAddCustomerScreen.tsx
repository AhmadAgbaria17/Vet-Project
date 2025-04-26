import React , {useEffect,} from 'react';
import { View,Text , StyleSheet,TextInput,ActivityIndicator,FlatList,Alert } from 'react-native';
import axios from 'axios';
import CustomerCard from './components/CustomerCard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { useRoute, RouteProp } from '@react-navigation/native';




interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string;
  phone: string; 
  pets: string[]; 
}

type VetAddCustomerScreenRouteProp = RouteProp<{
  params: {
    customres: any[]; 
    customersRequests: any[];
    customerWaitingApproval: any[];
  };
}, 'params'>;



const VetAddCustomerScreen = () => {
  const [searchText, setSearchText] = React.useState('');
  const [allCustomers, setAllCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const route = useRoute<VetAddCustomerScreenRouteProp>();

  const { customres, customersRequests, customerWaitingApproval } = route.params;
  




  useEffect(()=>{
    const fetchCustomers = async () =>{
      try {
        const response = await axios.get(`http://192.168.10.126:5000/mongodb/user/customers`);
        setAllCustomers(response.data.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        
      }finally{
        setLoading(false);
      }
    }
    fetchCustomers();
  },[])

  const filterCustomers = allCustomers.filter((customer)=>
    customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone.includes(searchText)
  );

  const handleInviteCustomer = async (customerId:string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(`http://192.168.10.126:5000/mongodb/vetcustomers/${customerId}`,{},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.data.message,
      });
    } catch (error:any) {
      console.error("Error accepting customer:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response.data.message,
      });
    }
  };


  return (
    <View style={styles.container}>  
    
      <View style={styles.emptyHeader}></View>
      <View style={styles.toast}>
                <Toast/>
      </View>
      <Text style={styles.titletxt}>Search for Customers</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Please enter email or phone number"
        placeholderTextColor={'#999'}
        value={searchText}
        onChangeText={setSearchText}
        keyboardType="email-address"
        />

        {loading?(
          <ActivityIndicator size="large" color="#666" style={{ marginTop: 20 }} />
        ):(
          <FlatList 
            data={filterCustomers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CustomerCard
                customer={item}
                  onLongPress={() => {
                                Alert.alert(
                                  "Customer Invite",
                                  `do you want to sent invite to ${item.firstName} ${item.lastName}?`,
                                  [
                
                                    {
                                      text: "Invite",
                                      onPress: () => handleInviteCustomer(item._id),
                                      style: "default",
                                    },
                                    {
                                      text: "Cancel",
                                      style: "cancel"
                                    }
                                  ]
                                )
                              }}
              />
            )}
          />

        )}
    </View>
  )
}

export default VetAddCustomerScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  emptyHeader: {
    height: 30,
    zIndex: 1,
  },
  titletxt: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  input:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize:12,
    color:'#333',
  },
  toast:{
    position:"absolute",
    top:20,
    right:200,
    zIndex:1,
  },
})
