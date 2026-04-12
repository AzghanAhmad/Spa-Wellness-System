export type ServiceCategory = 'massage' | 'facial' | 'body-treatment' | 'nail' | 'hair' | 'wellness' | 'package';

export interface SpaService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  duration: number; // minutes
  price: number;
  image?: string;
  isActive: boolean;
  requiredEquipment?: string[];
}

export interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: string;
  specialties: ServiceCategory[];
  isAvailable: boolean;
  workingHours: WorkingHours;
  rating: number;
  totalBookings: number;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isWorking: boolean;
  start: string; // HH:mm
  end: string;
  breaks?: { start: string; end: string }[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  isAvailable: boolean;
  amenities: string[];
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
}
