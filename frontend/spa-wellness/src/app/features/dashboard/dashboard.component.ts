import { Component, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

type KpiCard = {
  id: string;
  label: string;
  value: string;
  icon: string;
  color?: string;
};

type ActivePanel = 'appointments' | 'collections' | 'booking-source' | 'guest-visits'
  | 'provider-util' | 'products' | 'wait-time' | 'service-addons' | 'revenue' | 'guest-feedback';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

  activeCard = signal<ActivePanel>('appointments');
  viewMode = signal('Day view');
  currentDate = signal('Today, 31st March 2026');

  chartInstance: Chart | null = null;

  kpiCards: KpiCard[] = [
    { id: 'appointments', label: 'Appointments', value: '58', icon: 'calendar' },
    { id: 'collections', label: 'Collections ($)', value: '1,355', icon: 'dollar' },
    { id: 'booking-source', label: 'Booking by source', value: '40', icon: 'source' },
    { id: 'guest-visits', label: 'Guest visits', value: '52', icon: 'guest' },
    { id: 'provider-util', label: 'Provider utilization', value: '68%', icon: 'provider' },
    { id: 'products', label: 'Products ($)', value: '50', icon: 'product' },
    { id: 'wait-time', label: 'Wait time', value: '12 mins', icon: 'clock' },
    { id: 'service-addons', label: 'Service Add-Ons ($)', value: '120', icon: 'addon' },
    { id: 'revenue', label: 'Revenue ($)', value: '855', icon: 'revenue' },
    { id: 'guest-feedback', label: 'Guest feedback', value: '4.2', icon: 'feedback' },
  ];

  // Appointments panel data
  appointmentStats = {
    total: 42, projected: 56, target: 60, progress: 76,
    statuses: [
      { label: 'Pending', value: 44, color: '#1a4b6e' },
      { label: 'In Progress', value: 3, color: '#f5a623' },
      { label: 'Serviced', value: 9, color: '#2ecc71' },
      { label: 'No Show', value: 1, color: '#c0392b' },
      { label: 'Cancelled', value: 3, color: '#e88b9c' },
    ]
  };

  // Collections panel data
  collectionStats = {
    currentSales: 1355, projected: 3800, target: 3500, progress: 76,
    sources: [
      { label: 'Services', achieved: 599, target: 1500, color: '#6c3483' },
      { label: 'Products', achieved: 201, target: 500, color: '#e88b9c' },
      { label: 'Gift cards', achieved: 90, target: 100, color: '#85c1e9' },
      { label: 'Packages', achieved: 210, target: 1400, color: '#1a4b6e' },
      { label: 'Memberships', achieved: 155, target: null, color: '#8e44ad' },
      { label: 'Classes', achieved: 143, target: null, color: '#82e0aa' },
    ]
  };

  // Booking source panel data
  bookingSourceStats = {
    totalBookings: 40,
    online: [
      { label: 'Webstore', value: 10, color: '#95a5a6' },
      { label: 'CMA', value: 4, color: '#2ecc71' },
      { label: 'Client own app', value: 20, color: '#1a4b6e' },
    ],
    offline: [
      { label: 'Walk-in', value: 5, color: '#e67e22' },
      { label: 'Kiosk', value: 1, color: '#8e44ad' },
    ]
  };

  // Guest visits panel data
  guestVisitsStats = {
    totalVisits: 42, projected: 88, target: 80, progress: 76,
    types: [
      { label: 'New', value: 14, color: '#8e44ad' },
      { label: 'Existing', value: 38, color: '#e67e22' },
    ],
    summary: 'Out of 40 serviced guests, 2 rebooked, with an average spend of $66.8 with a target of $80'
  };

  // Provider utilization panel data
  providerUtilStats = {
    utilization: 68,
    target: 75,
    progress: 68,
    providers: [
      { label: 'Emma Wilson', value: 84, color: '#6366f1' },
      { label: 'Olivia Martinez', value: 72, color: '#0ea5e9' },
      { label: 'Sophia Kim', value: 61, color: '#10b981' },
      { label: 'Isabella Davis', value: 78, color: '#f59e0b' },
      { label: 'Mia Johnson', value: 66, color: '#8b5cf6' },
    ],
    summary: '4 out of 5 providers are within the optimal utilization range.',
  };

  // Products panel data
  productsStats = {
    currentSales: 599,
    projected: 1800,
    target: 1500,
    progress: 76,
    categories: [
      { label: 'Skincare', achieved: 260, target: 420, color: '#8e44ad' },
      { label: 'Hair care', achieved: 145, target: 320, color: '#e67e22' },
      { label: 'Body care', achieved: 120, target: 280, color: '#1a4b6e' },
      { label: 'Wellness supplements', achieved: 74, target: 200, color: '#6c3483' },
    ],
  };

  // Wait time panel data
  waitTimeStats = {
    avgWaitMins: 12,
    targetMins: 10,
    progress: 72,
    distribution: [
      { label: '0-5 mins', value: 18, color: '#10b981' },
      { label: '6-10 mins', value: 37, color: '#0ea5e9' },
      { label: '11-15 mins', value: 22, color: '#6366f1' },
      { label: '16+ mins', value: 13, color: '#ef4444' },
    ],
    note: 'Lower wait times correlate with higher guest satisfaction.',
  };

  // Service add-ons panel data
  serviceAddonsStats = {
    currentRevenue: 120,
    projected: 420,
    target: 360,
    progress: 76,
    addons: [
      { label: 'Hot Stone Set', achieved: 34, color: '#f59e0b' },
      { label: 'Aromatherapy Kit', achieved: 29, color: '#0ea5e9' },
      { label: 'LED Light Therapy', achieved: 22, color: '#10b981' },
      { label: 'Body Wrap Kit', achieved: 19, color: '#8b5cf6' },
    ],
  };

  // Revenue panel data
  revenueStats = {
    currentRevenue: 855,
    projected: 1900,
    target: 1650,
    progress: 76,
    breakdown: [
      { label: 'Bookings', achieved: 510, color: '#6366f1' },
      { label: 'Memberships', achieved: 210, color: '#0ea5e9' },
      { label: 'Vouchers', achieved: 90, color: '#10b981' },
      { label: 'Products', achieved: 45, color: '#f59e0b' },
    ],
    lineLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    lineData: [640, 720, 680, 770, 860, 930, 310],
  };

  // Guest feedback panel data
  guestFeedbackStats = {
    averageRating: 4.2,
    totalReviews: 42,
    progress: 84,
    breakdown: [
      { label: '5 stars', value: 26, color: '#10b981' },
      { label: '4 stars', value: 12, color: '#0ea5e9' },
      { label: '3 stars', value: 3, color: '#f59e0b' },
      { label: '2 stars', value: 1, color: '#ef4444' },
    ],
    summary: 'Guests love consistency and therapist expertise. Most feedback requests focus on faster check-ins.',
  };

  constructor(private readonly mockData: MockDataService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderChart();
  }

  selectCard(id: ActivePanel): void {
    this.activeCard.set(id);
    setTimeout(() => this.renderChart(), 50);
  }

  renderChart(): void {
    const canvas = this.chartCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    const active = this.activeCard();

    if (active === 'appointments') {
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.appointmentStats.statuses.map(s => s.label),
          datasets: [{
            data: this.appointmentStats.statuses.map(s => s.value),
            backgroundColor: this.appointmentStats.statuses.map(s => s.color),
            borderRadius: 4, barThickness: 36,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a2a3a', cornerRadius: 8, padding: 10, titleFont: { family: 'Inter' }, bodyFont: { family: 'Inter' } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#5a6d7e', font: { size: 11, family: 'Inter' } } },
            y: { grid: { color: '#eef3f7' }, ticks: { color: '#8e9fad', font: { size: 11, family: 'Inter' } }, title: { display: true, text: 'Appointments', color: '#5a6d7e', font: { size: 12, family: 'Inter' } } }
          }
        }
      });
    } else if (active === 'collections' || active === 'booking-source' || active === 'guest-visits') {
      let labels: string[];
      let data: number[];
      let colors: string[];

      if (active === 'collections') {
        labels = this.collectionStats.sources.map(s => s.label);
        data = this.collectionStats.sources.map(s => s.achieved);
        colors = this.collectionStats.sources.map(s => s.color);
      } else if (active === 'booking-source') {
        const all = [...this.bookingSourceStats.online, ...this.bookingSourceStats.offline];
        labels = all.map(s => s.label);
        data = all.map(s => s.value);
        colors = all.map(s => s.color);
      } else {
        labels = this.guestVisitsStats.types.map(s => s.label);
        data = this.guestVisitsStats.types.map(s => s.value);
        colors = this.guestVisitsStats.types.map(s => s.color);
      }

      this.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }] },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '55%',
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a2a3a', cornerRadius: 8, padding: 10, titleFont: { family: 'Inter' }, bodyFont: { family: 'Inter' } } }
        }
      });
    } else if (active === 'provider-util') {
      const labels = this.providerUtilStats.providers.map((p) => p.label);
      const data = this.providerUtilStats.providers.map((p) => p.value);
      const colors = this.providerUtilStats.providers.map((p) => p.color);

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderRadius: 6,
              barThickness: 30,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a2a3a',
              cornerRadius: 8,
              padding: 10,
              titleFont: { family: 'Inter' },
              bodyFont: { family: 'Inter' },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#5a6d7e', font: { size: 11, family: 'Inter' } } },
            y: { grid: { color: '#eef3f7' }, ticks: { color: '#8e9fad', font: { size: 11, family: 'Inter' } } },
          },
        },
      });
    } else if (active === 'products' || active === 'service-addons' || active === 'guest-feedback' || active === 'revenue') {
      // Use doughnut for most breakdown KPIs to keep the UI consistent.
      let labels: string[] = [];
      let data: number[] = [];
      let colors: string[] = [];

      if (active === 'products') {
        labels = this.productsStats.categories.map((c) => c.label);
        data = this.productsStats.categories.map((c) => c.achieved);
        colors = this.productsStats.categories.map((c) => c.color);
      } else if (active === 'service-addons') {
        labels = this.serviceAddonsStats.addons.map((a) => a.label);
        data = this.serviceAddonsStats.addons.map((a) => a.achieved);
        colors = this.serviceAddonsStats.addons.map((a) => a.color);
      } else if (active === 'guest-feedback') {
        labels = this.guestFeedbackStats.breakdown.map((b) => b.label);
        data = this.guestFeedbackStats.breakdown.map((b) => b.value);
        colors = this.guestFeedbackStats.breakdown.map((b) => b.color);
      } else {
        labels = this.revenueStats.breakdown.map((b) => b.label);
        data = this.revenueStats.breakdown.map((b) => b.achieved);
        colors = this.revenueStats.breakdown.map((b) => b.color);
      }

      // Revenue gets an extra line chart feel: switch to line if it's revenue.
      if (active === 'revenue') {
        this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.revenueStats.lineLabels,
            datasets: [
              {
                label: 'Revenue',
                data: this.revenueStats.lineData,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1a2a3a',
                cornerRadius: 8,
                padding: 10,
                titleFont: { family: 'Inter' },
                bodyFont: { family: 'Inter' },
              },
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#5a6d7e', font: { size: 11, family: 'Inter' } } },
              y: {
                grid: { color: '#eef3f7' },
                ticks: { color: '#8e9fad', font: { size: 11, family: 'Inter' } },
                title: { display: false },
              },
            },
          },
        });
      } else {
        this.chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1a2a3a',
                cornerRadius: 8,
                padding: 10,
                titleFont: { family: 'Inter' },
                bodyFont: { family: 'Inter' },
              },
            },
          },
        });
      }
    } else if (active === 'wait-time') {
      const labels = this.waitTimeStats.distribution.map((d) => d.label);
      const data = this.waitTimeStats.distribution.map((d) => d.value);
      const colors = this.waitTimeStats.distribution.map((d) => d.color);

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderRadius: 6,
              barThickness: 28,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1a2a3a',
              cornerRadius: 8,
              padding: 10,
              titleFont: { family: 'Inter' },
              bodyFont: { family: 'Inter' },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#5a6d7e', font: { size: 11, family: 'Inter' } } },
            y: { grid: { color: '#eef3f7' }, ticks: { color: '#8e9fad', font: { size: 11, family: 'Inter' } } },
          },
        },
      });
    }
  }

  getIconSvg(icon: string): string {
    const icons: Record<string, string> = {
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      source: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      guest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><circle cx="20" cy="8" r="3"/></svg>',
      provider: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      product: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      addon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>',
      revenue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
      feedback: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    };
    return icons[icon] ?? '';
  }
}
