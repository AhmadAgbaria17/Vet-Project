import React , {useEffect,useState} from 'react';
import { View,Text , StyleSheet,TextInput,ActivityIndicator,FlatList,Alert } from 'react-native';
import axios from 'axios';
import CustomerCard from './components/CustomerCard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { useRoute, RouteProp } from '@react-navigation/native';
import BackButton from '../../../components/BackButton';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../../navigation/types';
import { Customer } from '../../../interfaces/types';

type VetAddCustomerScreenRouteProp = RouteProp<{
  params: {
    customers: Customer[]; 
    customerRequests: Customer[];
    customerWaitingApproval: Customer[];
    fetchCustomers: () => Promise<void>;
  };
}, 'params'>;

type VetAddCustomerScreenProps = DrawerScreenProps<
  RootDrawerParamList,
  'VetAddCustomerScreen'
>

const VetAddCustomerScreen:React.FC<VetAddCustomerScreenProps> = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRoute<VetAddCustomerScreenRouteProp>();

  const { customers, customerRequests, customerWaitingApproval ,fetchCustomers} = route.params;
  
    const fetchCustomer = async () =>{
      try {
        setLoading(true);

        const allExcludedIds = [
          ...customers.map(c => c._id),
          ...customerRequests.map(c => c._id),
          ...customerWaitingApproval.map(c => c._id),
        ];


      const response = await axios.get(`http://192.168.10.126:5000/mongodb/user/customers`);
      const filteredCustomers = response.data.customers.filter((customer: Customer) => {
        return !allExcludedIds.includes(customer._id);
      });
        setAllCustomers(filteredCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        
      }finally{
        setLoading(false);
      }
    }


  useEffect(()=>{
    fetchCustomer();
  },[ customers, customerRequests, customerWaitingApproval ]);

  const filterCustomers = allCustomers.filter((customer)=>
    customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone.includes(searchText)
  );

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
        
      {filterCustomers.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No customers found
        </Text>
      )}

        {loading?(
          <ActivityIndicator size="large" color="#666" style={{ marginTop: 20 }} />
        ):(
          <FlatList 
            data={filterCustomers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CustomerCard
                customer={item}
                onPress={() => navigation.navigate("VetClientProfileScreen", {userId:item._id})}
                status='invite'
                fetchCustomers={fetchCustomers}
              />
            )}
          />

        )}
      <BackButton navigation={navigation} targetScreen="vetCustomers" />

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
