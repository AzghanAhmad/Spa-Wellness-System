import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BookingStoreService } from '../../../core/services/booking-store.service';
import { Booking, BookingStatus, SpaService, Therapist, Room } from '../../../core/models';

export interface MockCustomer { id: string; name: string; email: string; phone: string; type: string; status: string; }

@Component({
  selector: 'app-new-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-booking.component.html',
  styleUrl: './new-booking.component.scss'
})
export class NewBookingComponent implements OnInit {
  services = signal<SpaService[]>([]);
  therapists = signal<Therapist[]>([]);
  rooms = signal<Room[]>([]);

  // ─── Sidebar state ────────────────────────────────────────────────────────
  serviceSearch = signal('');
  selectedServiceIds = signal<string[]>([]); // multiple services
  filteredServices = computed(() => {
    const q = this.serviceSearch().toLowerCase();
    return this.services().filter(s => !q || s.name.toLowerCase().includes(q));
  });
  selectedServices = computed(() => this.services().filter(s => this.selectedServiceIds().includes(s.id)));
  totalDuration = computed(() => this.selectedServices().reduce((sum, s) => sum + s.duration, 0));
  totalPrice = computed(() => this.selectedServices().reduce((sum, s) => sum + s.price, 0));

  toggleService(id: string): void {
    this.selectedServiceIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }

  // Keep backward compat for canSave
  get selectedServiceId(): string { return this.selectedServiceIds()[0] ?? ''; }

  // ─── Customer search modal ────────────────────────────────────────────────
  showCustomerModal = signal(false);
  customerSearchKeyword = signal('');
  customerSearchEmail = signal('');
  customerSearchPhone = signal('');
  customerSearchStatus = signal('Active');
  selectedCustomer = signal<MockCustomer | null>(null);

  // Reactive search — runs whenever any filter changes
  customerSearchResults = computed(() => {
    const kw = this.customerSearchKeyword().toLowerCase();
    const em = this.customerSearchEmail().toLowerCase();
    const ph = this.customerSearchPhone();
    const st = this.customerSearchStatus();
    if (!kw && !em && !ph) return [];
    return this.mockCustomers.filter(c =>
      (!kw || c.name.toLowerCase().includes(kw)) &&
      (!em || c.email.toLowerCase().includes(em)) &&
      (!ph || c.phone.includes(ph)) &&
      (!st || c.status === st)
    );
  });

  hasSearched = computed(() =>
    this.customerSearchKeyword().length > 0 ||
    this.customerSearchEmail().length > 0 ||
    this.customerSearchPhone().length > 0
  );

  readonly mockCustomers: MockCustomer[] = [
    { id: 'c1', name: 'Alice Thompson', email: 'alice@email.com', phone: '+1-555-0301', type: 'Individual', status: 'Active' },
    { id: 'c2', name: 'Jessica Rivera', email: 'jessica@email.com', phone: '+1-555-0302', type: 'Individual', status: 'Active' },
    { id: 'c3', name: 'Michael Chen', email: 'michael@email.com', phone: '+1-555-0303', type: 'Individual', status: 'Active' },
    { id: 'c4', name: 'Sarah Williams', email: 'sarah@email.com', phone: '+1-555-0304', type: 'Individual', status: 'Active' },
    { id: 'c5', name: 'David Park', email: 'david@email.com', phone: '+1-555-0305', type: 'Individual', status: 'Active' },
    { id: 'c6', name: 'Karen Brown', email: 'karen@email.com', phone: '+1-555-0306', type: 'Individual', status: 'Active' },
  ];

  openCustomerModal(): void {
    this.customerSearchKeyword.set('');
    this.customerSearchEmail.set('');
    this.customerSearchPhone.set('');
    this.customerSearchStatus.set('Active');
    this.showCustomerModal.set(true);
  }

  selectCustomer(c: MockCustomer): void {
    this.selectedCustomer.set(c);
    this.showCustomerModal.set(false);
  }

  // ─── Availability / center panel ──────────────────────────────────────────
  bookingDate = signal(new Date().toISOString().split('T')[0]);
  startTime = signal('09:00');
  selectedTherapistId = signal('');
  selectedRoomId = signal('');

  selectedTherapist = computed(() => this.therapists().find(t => t.id === this.selectedTherapistId()));

  endTime = computed(() => {
    const total = this.totalDuration();
    if (!total) return this.startTime();
    const [h, m] = this.startTime().split(':').map(Number);
    const end = h * 60 + m + total;
    return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
  });

  // Available slots — all selectable, no busy blocking (conflict checked at save)
  availableSlots = computed(() => {
    const total = this.totalDuration();
    if (!total) return [];
    const slots: { time: string; end: string }[] = [];
    for (let h = 8; h <= 18; h++) {
      for (let m = 0; m < 60; m += 15) {
        const time = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        const endMins = h * 60 + m + total;
        if (endMins > 18 * 60) continue;
        const end = `${String(Math.floor(endMins/60)).padStart(2,'0')}:${String(endMins%60).padStart(2,'0')}`;
        slots.push({ time, end });
      }
    }
    return slots;
  });

  selectSlot(time: string): void { this.startTime.set(time); }

  // ─── Right panel ──────────────────────────────────────────────────────────
  notes = signal('');
  status = signal<BookingStatus>('expected');
  source = signal('');
  confirmed = signal(false);
  saleEmployee = signal('');

  readonly statusOptions: { value: BookingStatus; label: string }[] = [
    { value: 'expected', label: 'Expected' }, { value: 'arrived', label: 'Arrived' },
    { value: 'departed', label: 'Departed' }, { value: 'no-show', label: 'No Show' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  readonly sourceOptions = ['Walk-in', 'Phone', 'Online', 'App', 'Referral', 'Hotel', 'Other'];

  canSave = computed(() => !!this.selectedCustomer() && this.selectedServiceIds().length > 0 && !!this.selectedTherapistId());

  isEditMode = signal(false);
  editingBookingId = signal<string | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly mockData: MockDataService,
    private readonly notification: NotificationService,
    private readonly store: BookingStoreService
  ) {}

  ngOnInit(): void {
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getTherapists().subscribe(t => {
      this.therapists.set(t);
      this.loadFromParams();
    });
    this.mockData.getRooms().subscribe(r => this.rooms.set(r));
  }

  private loadFromParams(): void {
    const p = this.route.snapshot.queryParamMap;
    const editId = p.get('editId');

    if (editId) {
      // Edit mode — load existing booking
      const booking = this.store.getAll().find(b => b.id === editId);
      if (booking) {
        this.isEditMode.set(true);
        this.editingBookingId.set(editId);
        this.bookingDate.set(booking.date);
        this.startTime.set(booking.startTime);
        this.selectedTherapistId.set(booking.therapistId);
        this.selectedRoomId.set(booking.roomId ?? '');
        this.notes.set(booking.notes ?? '');
        this.status.set(booking.status);
        this.confirmed.set(false);
        // Set services
        this.mockData.getServices().subscribe(svcs => {
          const ids = booking.services.map(bs => bs.serviceId).filter(id => svcs.some(s => s.id === id));
          this.selectedServiceIds.set(ids);
        });
        // Set customer from mock list
        const cust = this.mockCustomers.find(c => c.id === booking.customerId) ??
          { id: booking.customerId, name: booking.customerName, email: booking.customerEmail ?? '', phone: booking.customerPhone ?? '', type: 'Individual', status: 'Active' };
        this.selectedCustomer.set(cust);
      }
    } else {
      if (p.get('therapistId')) this.selectedTherapistId.set(p.get('therapistId')!);
      if (p.get('date')) this.bookingDate.set(p.get('date')!);
      if (p.get('time')) this.startTime.set(p.get('time')!);
    }
  }

  goToNewCustomer(): void { this.router.navigate(['/configuration'], { queryParams: { page: 'customers' } }); }

  goBack(): void { this.router.navigate(['/bookings']); }

  adjustTime(time: string, part: 'h' | 'm', delta: number): string {
    let [h, m] = time.split(':').map(Number);
    if (part === 'h') { h = Math.max(7, Math.min(21, h + delta)); }
    else { m = (m + delta + 60) % 60; }
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  save(): void {
    if (!this.canSave()) {
      this.notification.error('Validation', 'Please select a customer, at least one service, and a therapist.');
      return;
    }
    const svcs = this.selectedServices();
    const therapist = this.selectedTherapist()!;
    const customer = this.selectedCustomer()!;
    const room = this.rooms().find(r => r.id === this.selectedRoomId());
    const startT = this.startTime();
    const endT = this.endTime();
    const date = this.bookingDate();

    if (this.isEditMode() && this.editingBookingId()) {
      // Update existing booking — skip conflict check against self
      const editId = this.editingBookingId()!;
      const clash = this.store.getAll().find(b =>
        b.id !== editId &&
        b.therapistId === therapist.id &&
        b.date === date &&
        b.status !== 'cancelled' &&
        b.startTime < endT &&
        b.endTime > startT
      );
      if (clash) {
        const msg = clash.startTime > startT
          ? `Cannot reschedule to ${startT} — would run into ${clash.customerName}'s booking at ${clash.startTime}–${clash.endTime}.`
          : `${clash.customerName} (${clash.startTime}–${clash.endTime}) already occupies this slot with ${therapist.name}.`;
        this.notification.error('Scheduling Conflict', msg);
        return;
      }
      this.store.update(editId, {
        customerName: customer.name, customerEmail: customer.email, customerPhone: customer.phone,
        customerId: customer.id,
        services: svcs.map(s => ({ serviceId: s.id, serviceName: s.name, duration: s.duration, price: s.price })),
        therapistId: therapist.id, therapistName: therapist.name,
        roomId: room?.id, roomName: room?.name,
        date, startTime: startT, endTime: endT,
        status: this.status(), totalPrice: this.totalPrice(), notes: this.notes(),
      });
      this.notification.success('Booking Updated', `${customer.name}'s booking has been updated.`);
      this.router.navigate(['/bookings']);
      return;
    }
    // Conflict check: same therapist, same date, overlapping time
    const clash = this.store.getAll().find(b =>
      b.therapistId === therapist.id &&
      b.date === date &&
      b.status !== 'cancelled' &&
      b.startTime < endT &&
      b.endTime > startT
    );

    if (clash) {
      const dropSlotFree = clash.startTime > startT;
      const msg = dropSlotFree
        ? `Cannot book ${customer.name} at ${startT} — the ${this.totalDuration()}-min booking would run into ${clash.customerName}'s booking at ${clash.startTime}–${clash.endTime} with ${therapist.name}.`
        : `${clash.customerName} (${clash.startTime}–${clash.endTime}) already occupies this slot with ${therapist.name}.`;
      this.notification.error('Scheduling Conflict', msg);
      return;
    }

    const newBooking: Booking = {
      id: 'b' + Date.now(),
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      services: svcs.map(s => ({ serviceId: s.id, serviceName: s.name, duration: s.duration, price: s.price })),
      therapistId: therapist.id,
      therapistName: therapist.name,
      roomId: room?.id,
      roomName: room?.name,
      date,
      startTime: startT,
      endTime: endT,
      status: this.status(),
      totalPrice: this.totalPrice(),
      notes: this.notes(),
      isGroupBooking: false,
      groupSize: 1,
      createdAt: new Date().toISOString(),
    };

    this.store.add(newBooking);
    this.notification.success(
      'Booking Created',
      `${customer.name} booked for ${svcs.map(s=>s.name).join(', ')} with ${therapist.name} at ${startT}`
    );
    this.router.navigate(['/bookings']);
  }
}
