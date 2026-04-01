import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { Booking, SpaService, Therapist, Room, BookingStatus } from '../../core/models';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  services = signal<SpaService[]>([]);
  therapists = signal<Therapist[]>([]);
  rooms = signal<Room[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');
  statusFilter = signal<BookingStatus | 'all'>('all');
  showNewBookingModal = signal(false);
  showBookingDetail = signal<Booking | null>(null);
  currentDate = signal(new Date());

  newBooking = {
    customerName: '', customerEmail: '', customerPhone: '',
    serviceIds: [] as string[], therapistId: '', roomId: '',
    date: new Date().toISOString().split('T')[0], startTime: '09:00',
    notes: '', isGroupBooking: false, groupSize: 1
  };

  timeSlots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

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
    if (status !== 'all') { result = result.filter(b => b.status === status); }
    return result;
  });

  weekDays = computed(() => {
    const date = this.currentDate();
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  });

  statusCounts = computed(() => {
    const bookings = this.bookings();
    return {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      pending: bookings.filter(b => b.status === 'pending').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  });

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService) {}

  ngOnInit(): void {
    this.mockData.getBookings().subscribe(b => { this.bookings.set(b); this.isLoading.set(false); });
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getTherapists().subscribe(t => this.therapists.set(t));
    this.mockData.getRooms().subscribe(r => this.rooms.set(r));
  }

  getBookingsForSlot(day: Date, time: string): Booking[] {
    const dateStr = day.toISOString().split('T')[0];
    return this.bookings().filter(b => b.date === dateStr && b.startTime === time);
  }

  getStatusColor(status: BookingStatus): string {
    const map: Record<string, string> = { confirmed: '#2ecc71', pending: '#f5a623', cancelled: '#e74c3c', completed: '#3498db', 'no-show': '#e74c3c' };
    return map[status] ?? '#8e9fad';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'badge-info', 'no-show': 'badge-danger' };
    return map[status] ?? 'badge-info';
  }

  navigateWeek(direction: number): void {
    this.currentDate.update(d => { const n = new Date(d); n.setDate(n.getDate() + direction * 7); return n; });
  }

  isToday(date: Date): boolean { return date.toDateString() === new Date().toDateString(); }
  formatDayName(date: Date): string { return date.toLocaleDateString('en-US', { weekday: 'short' }); }
  formatDayNum(date: Date): string { return date.getDate().toString(); }
  formatMonth(date: Date): string { return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }

  createBooking(): void {
    this.notification.success('Booking Created', 'New appointment has been scheduled');
    this.showNewBookingModal.set(false);
  }

  updateBookingStatus(booking: Booking, status: BookingStatus): void {
    this.bookings.update(list => list.map(b => b.id === booking.id ? { ...b, status } : b));
    this.showBookingDetail.set(null);
    this.notification.success('Status Updated', `Booking marked as ${status}`);
  }

  hasConflict(therapistId: string, date: string, startTime: string): boolean {
    return this.bookings().some(b => b.therapistId === therapistId && b.date === date && b.startTime === startTime && b.status !== 'cancelled');
  }
}
