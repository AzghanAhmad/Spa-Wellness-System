import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Booking, SpaService, MembershipPlan, GiftVoucher } from '../../core/models';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss',
})
export class CustomerDashboardComponent implements OnInit {
  userName = computed(() => this.authService.user()?.firstName ?? 'Guest');
  bookings = signal<Booking[]>([]);
  services = signal<SpaService[]>([]);
  vouchers = signal<GiftVoucher[]>([]);
  membershipPlans = signal<MembershipPlan[]>([]);
  isLoading = signal(true);

  readonly upcomingBookings = computed(() =>
    this.bookings().filter(b => b.status === 'confirmed' || b.status === 'pending').slice(0, 3)
  );

  readonly completedCount = computed(() =>
    this.bookings().filter(b => b.status === 'completed').length
  );

  readonly totalSpent = computed(() =>
    this.bookings().reduce((sum, b) => sum + b.totalPrice, 0)
  );

  readonly popularServices = computed(() =>
    this.services().slice(0, 4)
  );

  quickActions = [
    { label: 'Book Appointment', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>', route: '/customer/book', color: '#1a6b8a' },
    { label: 'My Appointments', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', route: '/customer/appointments', color: '#2ecc71' },
    { label: 'Gift Vouchers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8V22"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/></svg>', route: '/customer/vouchers', color: '#f5a623' },
    { label: 'View Profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>', route: '/customer/profile', color: '#9b59b6' },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly mockData: MockDataService,
  ) {}

  ngOnInit(): void {
    this.mockData.getBookings().subscribe(b => { this.bookings.set(b); this.isLoading.set(false); });
    this.mockData.getServices().subscribe(s => this.services.set(s));
    this.mockData.getVouchers().subscribe(v => this.vouchers.set(v));
    this.mockData.getMembershipPlans().subscribe(p => this.membershipPlans.set(p));
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { confirmed: 'status-confirmed', pending: 'status-pending', cancelled: 'status-cancelled', completed: 'status-completed' };
    return map[status] ?? '';
  }

  getServiceIcon(category: string): string {
    const icons: Record<string, string> = {
      massage: '💆',
      facial: '✨',
      'body-treatment': '🧖',
      nail: '💅',
      hair: '💇',
      package: '🎁',
    };
    return icons[category] ?? '🌿';
  }
}
