import { JWTUser } from "../interfaces/types";


export type RootDrawerParamList = {
  vetHome: undefined;
  VetClinics: { user: JWTUser | null };
  vetCustomers: undefined;
  VetAddCustomerScreen: undefined;
  VetClientProfileScreen: { userId : string};
  AddMedicalRecord: { petId: string; userId: string };
  VetQnA: undefined;

  
  ClientHome: undefined;
  NearbyVets: undefined;
  MyPets: undefined;
  Appointments: undefined;
};