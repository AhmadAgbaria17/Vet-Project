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
