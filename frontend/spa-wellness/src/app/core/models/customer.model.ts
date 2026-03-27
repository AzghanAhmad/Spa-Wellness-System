export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  preferences: CustomerPreferences;
  notes?: string;
  tags?: string[];
  membershipId?: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: string;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerPreferences {
  preferredTherapist?: string;
  preferredRoom?: string;
  allergies?: string[];
  medicalConditions?: string[];
  favoriteServices?: string[];
  communicationPreference: 'email' | 'sms' | 'both';
  marketingOptIn: boolean;
}

export interface VisitHistory {
  id: string;
  customerId: string;
  date: string;
  services: string[];
  therapist: string;
  totalPaid: number;
  rating?: number;
  feedback?: string;
}
