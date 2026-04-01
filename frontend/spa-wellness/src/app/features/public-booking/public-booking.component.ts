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
        <div class="pub-brand">
          <svg viewBox="0 0 32 32" fill="none" width="28" height="28"><circle cx="16" cy="16" r="14" stroke="#1a6b8a" stroke-width="1.5" opacity="0.4"/><circle cx="16" cy="16" r="8" stroke="#1a6b8a" stroke-width="1.5" opacity="0.6"/><circle cx="16" cy="16" r="3" fill="#1a6b8a"/></svg>
          <h1>Serenity Spa</h1>
        </div>
        <a routerLink="/auth/login" class="btn-secondary btn-sm">Staff Login</a>
      </header>

      <div class="booking-card card">
        <div class="section-head"><h3>Book Your Wellness Session</h3></div>
        <div class="booking-body">
          <div class="step"><span class="step-num">1</span><h4>Select Service</h4></div>
          <select class="input" [(ngModel)]="serviceId"><option value="">Choose a service...</option>
            @for (s of services(); track s.id) { <option [value]="s.id">{{ s.name }} - {{ '$' + s.price }} ({{ s.duration }}min)</option> }
          </select>

          <div class="step"><span class="step-num">2</span><h4>Choose Therapist</h4></div>
          <select class="input" [(ngModel)]="therapistId"><option value="">Any available...</option>
            @for (t of therapists(); track t.id) { <option [value]="t.id">{{ t.name }} @if (!t.isAvailable) { (Busy) }</option> }
          </select>

          <div class="step"><span class="step-num">3</span><h4>Pick a Time</h4></div>
          <div class="slot-grid">
            @for (slot of slots; track slot) {
              <button class="slot-btn" [class.selected]="startTime === slot" [class.taken]="isSlotTaken(slot)" (click)="startTime = slot">{{ slot }}</button>
            }
          </div>

          <div class="step"><span class="step-num">4</span><h4>Your Details</h4></div>
          <div class="form-row">
            <div class="form-group"><label>Full Name</label><input class="input" placeholder="Your name" [(ngModel)]="customerName" /></div>
            <div class="form-group"><label>Email</label><input class="input" type="email" placeholder="your@email.com" [(ngModel)]="customerEmail" /></div>
          </div>
          <label class="cb-label"><input type="checkbox" [(ngModel)]="isGroupBooking" /> Group booking</label>
          @if (isGroupBooking) { <div class="form-group" style="max-width:120px;margin-top:8px"><label>Group Size</label><input class="input" type="number" min="2" max="10" [(ngModel)]="groupSize" /></div> }

          <button class="btn-primary btn-lg" style="width:100%;margin-top:20px" (click)="confirmBooking()">Confirm Booking</button>

          @if (confirmation()) {
            <div class="confirm-msg animate-fade-in-up">✅ Booking confirmed! Reference: <strong>{{ confirmation() }}</strong></div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .public-wrap { max-width: 680px; margin: 0 auto; padding: 24px; }
    .public-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .pub-brand { display: flex; align-items: center; gap: 10px; h1 { font-size: 1.25rem; font-weight: 700; color: var(--color-primary-dark); } }
    .booking-card { overflow: hidden; }
    .section-head { padding: 16px 20px; border-bottom: 1px solid var(--border-color); background: linear-gradient(135deg, rgba(26,107,138,0.04), rgba(33,150,184,0.04)); h3 { font-size: 1.125rem; font-weight: 700; } }
    .booking-body { padding: 24px; }

    .step { display: flex; align-items: center; gap: 10px; margin: 20px 0 10px; &:first-child { margin-top: 0; } }
    .step-num { width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700; flex-shrink: 0; }
    .step h4 { font-size: 0.875rem; font-weight: 600; }

    .slot-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .slot-btn { padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-card); color: var(--text-primary); font-size: 0.8125rem; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); font-family: var(--font-sans);
      &:hover { border-color: var(--color-primary); }
      &.selected { border-color: var(--color-primary); background: var(--color-primary-50); color: var(--color-primary-dark); font-weight: 600; }
      &.taken { opacity: 0.35; pointer-events: none; text-decoration: line-through; }
    }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .form-group { margin-bottom: 8px; label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; } }
    .cb-label { display: flex; align-items: center; gap: 8px; font-size: 0.8125rem; color: var(--text-secondary); cursor: pointer; margin-top: 12px; input { accent-color: var(--color-primary); } }

    .confirm-msg { margin-top: 16px; padding: 14px; border-radius: var(--radius-md); background: var(--color-success-bg); color: var(--color-success); font-size: 0.875rem; }

    @media (max-width: 600px) { .slot-grid { grid-template-columns: repeat(2, 1fr); } .form-row { grid-template-columns: 1fr; } }
  `],
})
export class PublicBookingComponent implements OnInit {
  services = signal<SpaService[]>([]);
  therapists = signal<Therapist[]>([]);
  serviceId = ''; therapistId = ''; startTime = '10:00';
  isGroupBooking = false; groupSize = 2; customerName = ''; customerEmail = '';
  confirmation = signal('');
  slots = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'];
  readonly today = computed(() => new Date().toISOString().split('T')[0]);

  constructor(private readonly mockData: MockDataService, private readonly bookingState: BookingStateService, private readonly notification: NotificationService) {}

  ngOnInit(): void {
    this.bookingState.loadInitialBookings();
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getTherapists().subscribe(t => this.therapists.set(t));
  }

  isSlotTaken(slot: string): boolean {
    if (!this.therapistId) return false;
    return this.bookingState.bookings().some(b => b.therapistId === this.therapistId && b.date === this.today() && b.startTime === slot);
  }

  confirmBooking(): void {
    const service = this.services().find(s => s.id === this.serviceId);
    const therapist = this.therapists().find(t => t.id === this.therapistId);
    if (!service || !therapist || !this.customerName || !this.customerEmail) { this.notification.warning('Incomplete', 'Complete all steps'); return; }
    const [h, m] = this.startTime.split(':').map(Number);
    const end = new Date(0, 0, 0, h, m + service.duration);
    const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
    const booking: Booking = {
      id: 'pub-' + Date.now(), customerId: 'pub-' + Date.now(), customerName: this.customerName, customerEmail: this.customerEmail,
      services: [{ serviceId: service.id, serviceName: service.name, duration: service.duration, price: service.price }],
      therapistId: therapist.id, therapistName: therapist.name, date: this.today(), startTime: this.startTime, endTime,
      status: 'confirmed', totalPrice: service.price, isGroupBooking: this.isGroupBooking, groupSize: this.isGroupBooking ? this.groupSize : 1, createdAt: new Date().toISOString(),
    };
    this.bookingState.addBooking(booking);
    this.confirmation.set(booking.id);
    this.notification.success('Confirmed', `Ref: ${booking.id}`);
  }
}
