export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';

export interface TimeSlot {
  start: string; // ISO datetime
  end: string;
}

export interface BookingService {
  serviceId: string;
  serviceName: string;
  duration: number; // minutes
  price: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  services: BookingService[];
  therapistId: string;
  therapistName: string;
  roomId?: string;
  roomName?: string;
  equipmentIds?: string[];
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  isGroupBooking: boolean;
  groupSize: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  booking: Booking;
}

export interface ConflictWarning {
  type: 'therapist' | 'room' | 'equipment';
  resourceName: string;
  existingBooking: Booking;
  message: string;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  therapistId?: string;
}
