import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { BookingStoreService } from '../../core/services/booking-store.service';
import { CartStoreService } from '../../core/services/cart-store.service';
import { Booking, SpaService, Therapist, Room, BookingStatus } from '../../core/models';

export interface BookingPopup {
  booking: Booking;
  x: number;
  y: number;
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
  calendarView = signal<'month' | 'week' | 'day'>('day');

  // â”€â”€â”€ Drag & Drop state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  draggingBookingId = signal<string | null>(null);
  dragOverCell = signal<string | null>(null); // "date|time" or "therapistId|time"

  newBooking = {
    customerName: '', customerEmail: '', customerPhone: '',
    serviceIds: [] as string[], therapistId: '', roomId: '',
    date: new Date().toISOString().split('T')[0], startTime: '09:00',
    notes: '', isGroupBooking: false, groupSize: 1
  };

  timeSlots = ['08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45',
               '10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45',
               '12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45',
               '14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45',
               '16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00'];

  hoverTime = signal<string | null>(null); // time shown at cursor

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

  monthDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const days: (Date | null)[] = Array(startPad).fill(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
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

  showPaymentDialog = signal<Booking | null>(null);

  constructor(private readonly mockData: MockDataService, private readonly notification: NotificationService, private readonly router: Router, private readonly store: BookingStoreService, private readonly cartStore: CartStoreService) {}

  ngOnInit(): void {
    this.mockData.getBookings().subscribe(b => {
      this.store.init(b);
      // Always read from store so new bookings added elsewhere are visible
      this.bookings.set(this.store.getAll());
      this.isLoading.set(false);
    });
    // If store already initialized (returning from new-booking page), sync immediately
    if (this.store.getAll().length) {
      this.bookings.set(this.store.getAll());
      this.isLoading.set(false);
    }
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getTherapists().subscribe(t => this.therapists.set(t));
    this.mockData.getRooms().subscribe(r => this.rooms.set(r));
  }

  // â”€â”€â”€ Drag & Drop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  onDragStart(event: DragEvent, booking: Booking): void {
    this.activePopup.set(null);
    this.draggingBookingId.set(booking.id);
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', booking.id);
    // slight opacity via class handled in CSS via dragging signal
  }

  onDragEnd(): void {
    this.draggingBookingId.set(null);
    this.dragOverCell.set(null);
  }

  onDragOver(event: DragEvent, cellKey: string): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.dragOverCell.set(cellKey);
  }

  onDragLeave(cellKey: string): void {
    if (this.dragOverCell() === cellKey) this.dragOverCell.set(null);
  }

  // Week view drop: date string + time
  onDropWeek(event: DragEvent, day: Date, time: string): void {
    event.preventDefault();
    this.dragOverCell.set(null);
    const bookingId = event.dataTransfer!.getData('text/plain');
    const booking = this.bookings().find(b => b.id === bookingId);
    if (!booking) return;

    const newDate = day.toISOString().split('T')[0];
    // same slot â€” no-op
    if (booking.date === newDate && booking.startTime === time) { this.draggingBookingId.set(null); return; }

    // calculate new end time
    const newEndTime = this.calcEndTime(time, booking);

    // conflict check: same therapist, same date, overlapping slot (excluding self)
    const conflict = this.bookings().some(b =>
      b.id !== bookingId &&
      b.therapistId === booking.therapistId &&
      b.date === newDate &&
      b.status !== 'cancelled' &&
      b.startTime < newEndTime &&
      b.endTime > time
    );

    if (conflict) {
      const clashWith = this.bookings().find(b =>
        b.id !== bookingId && b.therapistId === booking.therapistId &&
        b.date === newDate && b.status !== 'cancelled' &&
        b.startTime < newEndTime && b.endTime > time
      )!;
      const dropSlotFree = clashWith.startTime > time; // drop slot is free but duration bleeds into clash
      const msg = dropSlotFree
        ? `Cannot place ${booking.customerName} at ${time} — the ${booking.services.reduce((s,x)=>s+x.duration,0)}-min duration would clash with ${clashWith.customerName}'s booking at ${clashWith.startTime}–${clashWith.endTime}.`
        : `${clashWith.customerName} (${clashWith.startTime}–${clashWith.endTime}) already occupies this slot for ${booking.therapistName}.`;
      this.notification.error('Scheduling Conflict', msg);
      this.draggingBookingId.set(null);
      return;
    }

    this.bookings.update(list => list.map(b =>
      b.id === bookingId ? { ...b, date: newDate, startTime: time, endTime: newEndTime } : b
    ));
    this.notification.success('Booking Moved', `${booking.customerName} rescheduled to ${newDate} at ${time}`);
    this.draggingBookingId.set(null);
  }

  // Day view drop: therapistId + time
  onDropDay(event: DragEvent, therapistId: string, time: string): void {
    event.preventDefault();
    this.dragOverCell.set(null);
    const bookingId = event.dataTransfer!.getData('text/plain');
    const booking = this.bookings().find(b => b.id === bookingId);
    if (!booking) return;

    const newDate = this.currentDate().toISOString().split('T')[0];
    if (booking.therapistId === therapistId && booking.date === newDate && booking.startTime === time) {
      this.draggingBookingId.set(null); return;
    }

    const newEndTime = this.calcEndTime(time, booking);

    const conflict = this.bookings().some(b =>
      b.id !== bookingId &&
      b.therapistId === therapistId &&
      b.date === newDate &&
      b.status !== 'cancelled' &&
      b.startTime < newEndTime &&
      b.endTime > time
    );

    if (conflict) {
      const therapist = this.therapists().find(t => t.id === therapistId);
      const therapistName = therapist?.name ?? 'Therapist';
      const clashWith = this.bookings().find(b =>
        b.id !== bookingId && b.therapistId === therapistId &&
        b.date === newDate && b.status !== 'cancelled' &&
        b.startTime < newEndTime && b.endTime > time
      )!;
      const dropSlotFree = clashWith.startTime > time;
      const totalMins = booking.services.reduce((s, x) => s + x.duration, 0);
      const msg = dropSlotFree
        ? `Cannot place ${booking.customerName} at ${time} — the ${totalMins}-min duration would clash with ${clashWith.customerName}'s booking at ${clashWith.startTime}–${clashWith.endTime} with ${therapistName}.`
        : `${clashWith.customerName} (${clashWith.startTime}–${clashWith.endTime}) already occupies this slot with ${therapistName}.`;
      this.notification.error('Scheduling Conflict', msg);
      this.draggingBookingId.set(null);
      return;
    }

    const therapist = this.therapists().find(t => t.id === therapistId);
    this.bookings.update(list => list.map(b =>
      b.id === bookingId
        ? { ...b, date: newDate, startTime: time, endTime: newEndTime, therapistId, therapistName: therapist?.name ?? b.therapistName }
        : b
    ));
    this.notification.success('Booking Moved', `${booking.customerName} moved to ${therapist?.name ?? ''} at ${time}`);
    this.draggingBookingId.set(null);
  }

  private calcEndTime(startTime: string, booking: Booking): string {
    const totalMins = booking.services.reduce((sum, s) => sum + s.duration, 0);
    const [h, m] = startTime.split(':').map(Number);
    const endMins = h * 60 + m + totalMins;
    return `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;
  }

  isDragging(bookingId: string): boolean { return this.draggingBookingId() === bookingId; }
  isDragOver(cellKey: string): boolean { return this.dragOverCell() === cellKey; }
  weekCellKey(day: Date, time: string): string { return `${day.toISOString().split('T')[0]}|${time}`; }
  dayCellKey(therapistId: string, time: string): string { return `${therapistId}|${time}`; }

  // â”€â”€â”€ Popup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    if (x + 316 > window.innerWidth) x = window.innerWidth - 320;
    if (x < 4) x = 4;
    if (y + 320 > window.innerHeight) y = rect.top - 326;
    return { x, y };
  }

  onCalendarScroll(): void {
    const popup = this.activePopup();
    if (!popup) return;
    this.activePopup.update(p => p ? { ...p, ...this.calcPopupPos(p.anchorEl) } : null);
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
      b.therapistId === therapistId && b.date === dateStr &&
      b.startTime <= time && b.endTime > time && b.status !== 'cancelled'
    );
  }

  getBlockBg(status: BookingStatus): string {
    const map: Record<string, string> = { expected: '#4a90d9', arrived: '#e8922a', departed: '#27ae60', 'no-show': '#9b59b6', cancelled: '#95a5a6', confirmed: '#4a90d9', pending: '#e8922a', completed: '#27ae60' };
    return map[status] ?? '#8e9fad';
  }

  getStatusLabel(status: BookingStatus): string {
    return this.appointmentStatuses.find(s => s.value === status)?.label ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { expected: 'badge-info', arrived: 'badge-warning', departed: 'badge-success', 'no-show': 'badge-purple', cancelled: 'badge-danger', confirmed: 'badge-success', pending: 'badge-warning', completed: 'badge-info' };
    return map[status] ?? 'badge-info';
  }

  getTherapistById(id: string): Therapist | undefined { return this.therapists().find(t => t.id === id); }

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

  goToToday(): void { this.currentDate.set(new Date()); }

  onCellMouseEnter(time: string): void { this.hoverTime.set(time); }
  onCellMouseLeave(): void { this.hoverTime.set(null); }

  openNewBooking(therapistId: string, time: string): void {
    const date = this.currentDate().toISOString().split('T')[0];
    this.router.navigate(['/bookings/new'], { queryParams: { therapistId, date, time } });
  }

  openNewBookingWeek(day: Date, time: string): void {
    const date = day.toISOString().split('T')[0];
    this.router.navigate(['/bookings/new'], { queryParams: { date, time } });
  }

  editBooking(booking: Booking): void {
    this.activePopup.set(null);
    this.router.navigate(['/bookings/new'], { queryParams: { editId: booking.id } });
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
    return Math.max(1, Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 15));
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
    this.store.update(popup.booking.id, { status });
    this.activePopup.update(p => p ? { ...p, booking: { ...p.booking, status } } : null);
    this.notification.success('Status Updated', `Booking marked as ${this.getStatusLabel(status)}`);
    // If departed, prompt for payment
    if (status === 'departed') {
      this.showPaymentDialog.set({ ...popup.booking, status });
      this.activePopup.set(null);
    }
  }

  payNow(booking: Booking): void {
    const lines = booking.services.map(svc =>
      this.cartStore.buildLine(booking.id, svc.serviceId, svc.serviceName, booking.therapistId, booking.therapistName, booking.date, booking.startTime, 'Departed', svc.price, 19)
    );
    this.cartStore.openCart(booking.customerId, booking.customerName, lines);
    this.showPaymentDialog.set(null);
    this.router.navigate(['/cart']);
  }

  postponePayment(booking: Booking): void {
    this.notification.success('Payment Postponed', `${booking.customerName}'s payment will be collected later.`);
    this.showPaymentDialog.set(null);
  }

  createBooking(): void {
    this.notification.success('Booking Created', 'New appointment has been scheduled');
    this.showNewBookingModal.set(false);
  }

  hasConflict(therapistId: string, date: string, startTime: string): boolean {
    return this.bookings().some(b => b.therapistId === therapistId && b.date === date && b.startTime === startTime && b.status !== 'cancelled');
  }
}
