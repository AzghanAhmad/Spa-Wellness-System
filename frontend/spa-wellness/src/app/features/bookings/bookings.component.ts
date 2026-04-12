import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { Booking, SpaService, Therapist, Room, BookingStatus } from '../../core/models';

export interface BookingPopup {
  booking: Booking;
  // viewport-relative coords (for position:fixed)
  x: number;
  y: number;
  // reference to the anchor element so we can reposition on scroll
  anchorEl: HTMLElement;
}

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
  activePopup = signal<BookingPopup | null>(null);
  currentDate = signal(new Date());
  calendarView = signal<'month' | 'week' | 'day'>('week');

  newBooking = {
    customerName: '', customerEmail: '', customerPhone: '',
    serviceIds: [] as string[], therapistId: '', roomId: '',
    date: new Date().toISOString().split('T')[0], startTime: '09:00',
    notes: '', isGroupBooking: false, groupSize: 1
  };

  timeSlots = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
               '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

  readonly appointmentStatuses: { value: BookingStatus; label: string }[] = [
    { value: 'expected', label: 'Expected / Unarrived' },
    { value: 'arrived', label: 'Arrived' },
    { value: 'departed', label: 'Departed' },
    { value: 'no-show', label: 'No Show' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

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

  // Month view: all days in the current month
  monthDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // pad start to Sunday
    const startPad = firstDay.getDay();
    const days: (Date | null)[] = Array(startPad).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    // pad end to complete grid rows
    while (days.length % 7 !== 0) days.push(null);
    return days;
  });

  statusCounts = computed(() => {
    const b = this.bookings();
    return {
      total: b.length,
      expected: b.filter(x => x.status === 'expected').length,
      arrived: b.filter(x => x.status === 'arrived').length,
      departed: b.filter(x => x.status === 'departed').length,
      cancelled: b.filter(x => x.status === 'cancelled').length,
      'no-show': b.filter(x => x.status === 'no-show').length,
    };
  });

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService) {}

  ngOnInit(): void {
    this.mockData.getBookings().subscribe(b => { this.bookings.set(b); this.isLoading.set(false); });
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getTherapists().subscribe(t => this.therapists.set(t));
    this.mockData.getRooms().subscribe(r => this.rooms.set(r));
  }

  @HostListener('document:keydown.escape')
  closePopup(): void { this.activePopup.set(null); }

  openPopup(event: MouseEvent, booking: Booking): void {
    event.stopPropagation();
    const el = event.currentTarget as HTMLElement;
    this.activePopup.set({ booking, ...this.calcPopupPos(el), anchorEl: el });
  }

  private calcPopupPos(el: HTMLElement): { x: number; y: number } {
    const rect = el.getBoundingClientRect();
    let x = rect.left;
    let y = rect.bottom + 6;
    // keep within viewport horizontally
    if (x + 316 > window.innerWidth) x = window.innerWidth - 320;
    if (x < 4) x = 4;
    // if popup would go below viewport, show above the block instead
    if (y + 320 > window.innerHeight) y = rect.top - 326;
    return { x, y };
  }

  // Called by (scroll) on .calendar-body and .day-body in the template
  onCalendarScroll(): void {
    const popup = this.activePopup();
    if (!popup) return;
    const pos = this.calcPopupPos(popup.anchorEl);
    this.activePopup.update(p => p ? { ...p, ...pos } : null);
  }

  @HostListener('document:click')
  onDocumentClick(): void { this.activePopup.set(null); }

  getBookingsForSlot(day: Date, time: string): Booking[] {
    const dateStr = day.toISOString().split('T')[0];
    return this.bookings().filter(b => b.date === dateStr && b.startTime === time);
  }

  getBookingsForDay(day: Date): Booking[] {
    const dateStr = day.toISOString().split('T')[0];
    return this.bookings().filter(b => b.date === dateStr && b.status !== 'cancelled');
  }

  getBookingsForTherapistSlot(therapistId: string, time: string): Booking[] {
    const dateStr = this.currentDate().toISOString().split('T')[0];
    return this.bookings().filter(b =>
      b.therapistId === therapistId &&
      b.date === dateStr &&
      b.startTime <= time &&
      b.endTime > time &&
      b.status !== 'cancelled'
    );
  }

  // Status → background color for calendar blocks
  getBlockBg(status: BookingStatus): string {
    const map: Record<string, string> = {
      expected:  '#4a90d9',
      arrived:   '#e8922a',
      departed:  '#27ae60',
      'no-show': '#9b59b6',
      cancelled: '#95a5a6',
      confirmed: '#4a90d9',
      pending:   '#e8922a',
      completed: '#27ae60',
    };
    return map[status] ?? '#8e9fad';
  }

  getStatusLabel(status: BookingStatus): string {
    const found = this.appointmentStatuses.find(s => s.value === status);
    return found ? found.label : status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      expected: 'badge-info', arrived: 'badge-warning', departed: 'badge-success',
      'no-show': 'badge-purple', cancelled: 'badge-danger',
      confirmed: 'badge-success', pending: 'badge-warning', completed: 'badge-info',
    };
    return map[status] ?? 'badge-info';
  }

  getTherapistById(id: string): Therapist | undefined {
    return this.therapists().find(t => t.id === id);
  }

  isTherapistAvailable(therapist: Therapist): boolean {
    const day = this.currentDate().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof therapist.workingHours;
    return therapist.workingHours[day]?.isWorking ?? false;
  }

  isTherapistWorkingAt(therapist: Therapist, time: string): boolean {
    const day = this.currentDate().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof therapist.workingHours;
    const hours = therapist.workingHours[day];
    if (!hours?.isWorking) return false;
    return time >= hours.start && time < hours.end;
  }

  navigate(direction: number): void {
    this.currentDate.update(d => {
      const n = new Date(d);
      if (this.calendarView() === 'month') n.setMonth(n.getMonth() + direction);
      else if (this.calendarView() === 'week') n.setDate(n.getDate() + direction * 7);
      else n.setDate(n.getDate() + direction);
      return n;
    });
  }

  getCalendarTitle(): string {
    const v = this.calendarView();
    if (v === 'month') return this.currentDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (v === 'week') return this.formatMonth(this.currentDate());
    return this.currentDate().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  getBookingSpanRows(booking: Booking): number {
    const [sh, sm] = booking.startTime.split(':').map(Number);
    const [eh, em] = booking.endTime.split(':').map(Number);
    return Math.max(1, Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 30));
  }

  isBookingSlotStart(booking: Booking, time: string): boolean { return booking.startTime === time; }
  isToday(date: Date): boolean { return date.toDateString() === new Date().toDateString(); }
  formatDayName(date: Date): string { return date.toLocaleDateString('en-US', { weekday: 'short' }); }
  formatDayNum(date: Date): string { return date.getDate().toString(); }
  formatMonth(date: Date): string { return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }

  updatePopupStatus(status: BookingStatus): void {
    const popup = this.activePopup();
    if (!popup) return;
    this.bookings.update(list => list.map(b => b.id === popup.booking.id ? { ...b, status } : b));
    // update the popup booking reference too
    this.activePopup.update(p => p ? { ...p, booking: { ...p.booking, status } } : null);
    this.notification.success('Status Updated', `Booking marked as ${this.getStatusLabel(status)}`);
  }

  createBooking(): void {
    this.notification.success('Booking Created', 'New appointment has been scheduled');
    this.showNewBookingModal.set(false);
  }

  hasConflict(therapistId: string, date: string, startTime: string): boolean {
    return this.bookings().some(b => b.therapistId === therapistId && b.date === date && b.startTime === startTime && b.status !== 'cancelled');
  }
}
