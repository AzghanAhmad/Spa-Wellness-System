import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Booking, SpaService, Therapist } from '../../core/models';
import { BookingStateService } from '../../core/services/booking-state.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-public-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="public-wrap">
      <header class="public-header">
        <h1>Book Your Wellness Session</h1>
        <a routerLink="/auth/login" class="btn-ghost">Staff Login</a>
      </header>

      <section class="card panel">
        <h3>1) Service Selection</h3>
        <select class="input" [(ngModel)]="serviceId">
          <option value="">Select service</option>
          @for (service of services(); track service.id) {
            <option [value]="service.id">{{ service.name }} - {{ '$' + service.price }}</option>
          }
        </select>

        <h3>2) Staff Selection</h3>
        <select class="input" [(ngModel)]="therapistId">
          <option value="">Select therapist</option>
          @for (therapist of therapists(); track therapist.id) {
            <option [value]="therapist.id">{{ therapist.name }} @if (!therapist.isAvailable) { (Busy) }</option>
          }
        </select>

        <h3>3) Time Slot</h3>
        <div class="slot-grid">
          @for (slot of slots; track slot) {
            <button class="btn-secondary" [class.disabled]="isSlotTaken(slot)" (click)="startTime = slot">{{ slot }}</button>
          }
        </div>

        <h3>4) Group Booking</h3>
        <label class="checkbox"><input type="checkbox" [(ngModel)]="isGroupBooking" /> Multi-person booking</label>
        @if (isGroupBooking) {
          <input class="input" type="number" min="2" max="10" [(ngModel)]="groupSize" />
        }

        <h3>5) Confirmation</h3>
        <input class="input" placeholder="Full name" [(ngModel)]="customerName" />
        <input class="input" placeholder="Email" [(ngModel)]="customerEmail" />
        <button class="btn-primary" (click)="confirmBooking()">Confirm Booking</button>
        @if (confirmation()) {
          <div class="confirm">Booking confirmed: <strong>{{ confirmation() }}</strong></div>
        }
      </section>
    </div>
  `,
  styles: [`
    .public-wrap { max-width: 920px; margin: 0 auto; padding: 24px; display: grid; gap: 16px; }
    .public-header { display: flex; justify-content: space-between; align-items: center; }
    .public-header h1 { font-size: 1.8rem; font-weight: 700; }
    .panel { padding: 20px; display: grid; gap: 10px; }
    .slot-grid { display: grid; gap: 8px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .checkbox { display: flex; gap: 8px; align-items: center; }
    .confirm { padding: 12px; border-radius: 10px; background: var(--color-success-bg); color: var(--color-success); }
    .disabled { opacity: .4; pointer-events: none; }
    @media (max-width: 760px) { .slot-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `],
})
export class PublicBookingComponent implements OnInit {
  services = signal<SpaService[]>([]);
  therapists = signal<Therapist[]>([]);

  serviceId = '';
  therapistId = '';
  startTime = '10:00';
  isGroupBooking = false;
  groupSize = 2;
  customerName = '';
  customerEmail = '';
  confirmation = signal('');
  slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  readonly today = computed(() => new Date().toISOString().split('T')[0]);

  constructor(
    private readonly mockData: MockDataService,
    private readonly bookingState: BookingStateService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.bookingState.loadInitialBookings();
    this.mockData.getServices().subscribe((services) => this.services.set(services));
    this.mockData.getTherapists().subscribe((therapists) => this.therapists.set(therapists));
  }

  isSlotTaken(slot: string): boolean {
    if (!this.therapistId) return false;
    return this.bookingState
      .bookings()
      .some((booking) => booking.therapistId === this.therapistId && booking.date === this.today() && booking.startTime === slot);
  }

  confirmBooking(): void {
    const service = this.services().find((item) => item.id === this.serviceId);
    const therapist = this.therapists().find((item) => item.id === this.therapistId);
    if (!service || !therapist || !this.customerName || !this.customerEmail) {
      this.notification.warning('Incomplete booking', 'Please complete all required steps.');
      return;
    }

    const [hour, minute] = this.startTime.split(':').map(Number);
    const end = new Date(0, 0, 0, hour, minute + service.duration);
    const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

    const booking: Booking = {
      id: 'pub-' + Date.now(),
      customerId: 'pub-' + Date.now(),
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      services: [{ serviceId: service.id, serviceName: service.name, duration: service.duration, price: service.price }],
      therapistId: therapist.id,
      therapistName: therapist.name,
      date: this.today(),
      startTime: this.startTime,
      endTime,
      status: 'confirmed',
      totalPrice: service.price,
      isGroupBooking: this.isGroupBooking,
      groupSize: this.isGroupBooking ? this.groupSize : 1,
      createdAt: new Date().toISOString(),
    };
    this.bookingState.addBooking(booking);
    this.confirmation.set(booking.id);
    this.notification.success('Booking confirmed', `Reference ${booking.id}`);
  }
}
