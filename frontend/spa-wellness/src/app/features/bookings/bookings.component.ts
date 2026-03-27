import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { BookingStateService } from '../../core/services/booking-state.service';
import { Booking, SpaService, Therapist, Room, BookingStatus } from '../../core/models';

type CalendarView = 'day' | 'week' | 'month';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit {
  readonly bookings;
  services = signal<SpaService[]>([]);
  therapists = signal<Therapist[]>([]);
  rooms = signal<Room[]>([]);
  isLoading = signal(true);

  calendarView = signal<CalendarView>('week');
  currentDate = signal(new Date());
  showNewBookingModal = signal(false);
  showBookingDetail = signal<Booking | null>(null);
  searchTerm = signal('');
  statusFilter = signal<BookingStatus | 'all'>('all');

  // New booking form
  newBooking = {
    customerName: '', customerEmail: '', customerPhone: '',
    serviceIds: [] as string[], therapistId: '', roomId: '',
    date: new Date().toISOString().split('T')[0], startTime: '09:00',
    notes: '', isGroupBooking: false, groupSize: 1
  };

  filteredBookings = computed(() => {
    let result = this.bookings();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(b =>
        b.customerName.toLowerCase().includes(search) ||
        b.therapistName.toLowerCase().includes(search) ||
        b.services.some(s => s.serviceName.toLowerCase().includes(search))
      );
    }
    const status = this.statusFilter();
    if (status !== 'all') {
      result = result.filter(b => b.status === status);
    }
    return result;
  });

  weekDays = computed(() => {
    const date = this.currentDate();
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  });

  timeSlots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

  constructor(
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
    private readonly bookingState: BookingStateService
  ) {
    this.bookings = this.bookingState.bookings;
  }

  ngOnInit(): void {
    this.bookingState.loadInitialBookings();
    if (this.bookingState.isLoaded()) {
      this.isLoading.set(false);
    } else {
      this.mockData.getBookings().subscribe(() => this.isLoading.set(false));
    }
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getTherapists().subscribe(t => this.therapists.set(t));
    this.mockData.getRooms().subscribe(r => this.rooms.set(r));
  }

  getBookingsForSlot(day: Date, time: string): Booking[] {
    const dateStr = day.toISOString().split('T')[0];
    return this.bookings().filter(b => b.date === dateStr && b.startTime === time);
  }

  getStatusColor(status: BookingStatus): string {
    const map: Record<string, string> = { confirmed: '#10b981', pending: '#f59e0b', cancelled: '#ef4444', completed: '#3b82f6', 'no-show': '#ef4444' };
    return map[status] ?? '#94a3b8';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'badge-info', 'no-show': 'badge-danger' };
    return map[status] ?? 'badge-info';
  }

  navigateWeek(direction: number): void {
    this.currentDate.update(d => {
      const next = new Date(d);
      next.setDate(next.getDate() + direction * 7);
      return next;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  formatDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  formatDayNum(date: Date): string {
    return date.getDate().toString();
  }

  formatMonth(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  createBooking(): void {
    const selectedServices = this.services().filter((service) =>
      this.newBooking.serviceIds.includes(service.id),
    );
    if (!this.newBooking.customerName || selectedServices.length === 0 || !this.newBooking.therapistId) {
      this.notification.warning('Missing details', 'Please fill client, service, and therapist.');
      return;
    }

    const therapist = this.therapists().find((t) => t.id === this.newBooking.therapistId);
    const room = this.rooms().find((r) => r.id === this.newBooking.roomId);
    const totalDuration = selectedServices.reduce((sum, item) => sum + item.duration, 0);
    const totalPrice = selectedServices.reduce((sum, item) => sum + item.price, 0);
    const [hour, minute] = this.newBooking.startTime.split(':').map(Number);
    const end = new Date(0, 0, 0, hour, minute + totalDuration);
    const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

    const booking: Booking = {
      id: 'b-' + Date.now(),
      customerId: 'new-' + Date.now(),
      customerName: this.newBooking.customerName,
      customerEmail: this.newBooking.customerEmail,
      customerPhone: this.newBooking.customerPhone,
      services: selectedServices.map((service) => ({
        serviceId: service.id,
        serviceName: service.name,
        duration: service.duration,
        price: service.price,
      })),
      therapistId: this.newBooking.therapistId,
      therapistName: therapist?.name ?? 'Unassigned',
      roomId: room?.id,
      roomName: room?.name,
      date: this.newBooking.date,
      startTime: this.newBooking.startTime,
      endTime,
      status: 'pending',
      totalPrice,
      notes: this.newBooking.notes,
      isGroupBooking: this.newBooking.isGroupBooking,
      groupSize: this.newBooking.isGroupBooking ? this.newBooking.groupSize : 1,
      createdAt: new Date().toISOString(),
    };

    this.bookingState.addBooking(booking);
    this.notification.success('Booking Created', 'New appointment has been scheduled');
    this.showNewBookingModal.set(false);
  }

  updateBookingStatus(booking: Booking, status: BookingStatus): void {
    this.bookingState.updateBookingStatus(booking.id, status);
    this.showBookingDetail.set(null);
    this.notification.success('Status Updated', `Booking marked as ${status}`);
  }

  hasConflict(therapistId: string, date: string, startTime: string): boolean {
    return this.bookings().some(b =>
      b.therapistId === therapistId && b.date === date && b.startTime === startTime && b.status !== 'cancelled'
    );
  }
}
