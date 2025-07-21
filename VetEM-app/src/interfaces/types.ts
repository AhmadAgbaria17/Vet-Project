export interface MedicalRecord {
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes?: string;
}

export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  medicalHistory: MedicalRecord[];
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImg: string;

  clientInfo?: {
    pets: Pet[];
    clientVet: Customer[];
    clientVetRequests: Customer[]; 
    clientVetWaitApproval: Customer[]; 
  };
}

export interface JWTUser {
  firstName: string;
  userId: string;
  userType: 'client' | 'vet';
}




interface UserInfo{
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Question {
  _id: string;
  questionText: string;
  answer?: string;
  petName: string;
  customerId: UserInfo;
  vetId: UserInfo;
  status: 'pending' | 'answered';
  createdAt: string;
}


export interface Clinic {
  _id?: string;
  name: string;
  openTime: string;
  location: { latitude: number; longitude: number };
  userId: string;
}


