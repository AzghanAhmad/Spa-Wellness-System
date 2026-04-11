import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { SpaService, Therapist, Room, Booking } from '../../core/models';

@Component({
  selector: 'app-customer-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-booking.component.html',
  styleUrl: './customer-booking.component.scss',
})
export class CustomerBookingComponent implements OnInit {
  services = signal<SpaService[]>([]);
  therapists = signal<Therapist[]>([]);
  rooms = signal<Room[]>([]);

  currentStep = signal(1);
  selectedCategory = signal('all');
  selectedServiceId = signal('');
  selectedTherapistId = signal('');
  selectedDate = signal(new Date().toISOString().split('T')[0]);
  selectedTime = signal('');
  customerName = signal('Anna Duke');
  customerEmail = signal('annaduke@gmail.com');
  customerPhone = signal('+1-555-0102');
  isGroupBooking = signal(false);
  groupSize = signal(2);
  notes = signal('');
  confirmation = signal('');

  categories = ['all', 'massage', 'facial', 'body-treatment', 'nail', 'hair', 'package'];

  timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00',
  ];

  filteredServices = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.services();
    return this.services().filter(s => s.category === cat);
  });

  selectedService = computed(() =>
    this.services().find(s => s.id === this.selectedServiceId())
  );

  selectedTherapist = computed(() =>
    this.therapists().find(t => t.id === this.selectedTherapistId())
  );

  availableTherapists = computed(() => {
    const service = this.selectedService();
    if (!service) return this.therapists();
    return this.therapists().filter(t => t.isAvailable);
  });

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
    private readonly bookingState: BookingStateService,
  ) {}

  ngOnInit(): void {
    this.bookingState.loadInitialBookings();
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getTherapists().subscribe(t => this.therapists.set(t));
    this.mockData.getRooms().subscribe(r => this.rooms.set(r));
  }

  selectService(id: string): void {
    this.selectedServiceId.set(id);
    this.nextStep();
  }

  selectTherapist(id: string): void {
    this.selectedTherapistId.set(id);
    this.nextStep();
  }

  selectTime(time: string): void {
    this.selectedTime.set(time);
    this.nextStep();
  }

  nextStep(): void {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  isSlotTaken(slot: string): boolean {
    if (!this.selectedTherapistId()) return false;
    const today = this.selectedDate();
    return this.bookingState.bookings().some(
      b => b.therapistId === this.selectedTherapistId() && b.date === today && b.startTime === slot && b.status !== 'cancelled'
    );
  }

  getServiceIcon(category: string): string {
    const icons: Record<string, string> = {
      massage: '💆', facial: '✨', 'body-treatment': '🧖',
      nail: '💅', hair: '💇', package: '🎁',
    };
    return icons[category] ?? '🌿';
  }

  confirmBooking(): void {
    const service = this.selectedService();
    const therapist = this.selectedTherapist();
    if (!service || !therapist || !this.selectedTime()) {
      this.notification.warning('Incomplete', 'Please complete all steps');
      return;
    }

    const [h, m] = this.selectedTime().split(':').map(Number);
    const end = new Date(0, 0, 0, h, m + service.duration);
    const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

    const booking: Booking = {
      id: 'cust-' + Date.now(),
      customerId: 'c-self',
      customerName: this.customerName(),
      customerEmail: this.customerEmail(),
      customerPhone: this.customerPhone(),
      services: [{
        serviceId: service.id, serviceName: service.name,
        duration: service.duration, price: service.price,
      }],
      therapistId: therapist.id, therapistName: therapist.name,
      date: this.selectedDate(), startTime: this.selectedTime(), endTime,
      status: 'confirmed', totalPrice: service.price,
      isGroupBooking: this.isGroupBooking(),
      groupSize: this.isGroupBooking() ? this.groupSize() : 1,
      notes: this.notes(),
      createdAt: new Date().toISOString(),
    };

    this.bookingState.addBooking(booking);
    this.confirmation.set(booking.id);
    this.notification.success('Booking Confirmed!', `Your ${service.name} has been booked.`);
  }

  resetBooking(): void {
    this.currentStep.set(1);
    this.selectedServiceId.set('');
    this.selectedTherapistId.set('');
    this.selectedTime.set('');
    this.notes.set('');
    this.isGroupBooking.set(false);
    this.confirmation.set('');
  }

  formatCategory(cat: string): string {
    return cat === 'all' ? 'All Services' : cat.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
