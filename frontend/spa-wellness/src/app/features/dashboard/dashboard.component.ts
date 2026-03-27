import { Component, OnInit, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { Booking } from '../../core/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('serviceChart') serviceChartRef!: ElementRef<HTMLCanvasElement>;

  kpis = signal<{
    bookingsToday: number; revenue: number; revenueChange: number;
    activeClients: number; clientsChange: number;
    staffAvailable: number; staffTotal: number; occupancyRate: number;
  } | null>(null);

  recentBookings = signal<Booking[]>([]);
  isLoading = signal(true);

  private revenueChart: Chart | null = null;
  private serviceChart: Chart | null = null;

  constructor(private readonly mockData: MockDataService) {}

  ngOnInit(): void {
    this.mockData.getDashboardKPIs().subscribe(data => {
      this.kpis.set(data);
    });

    this.mockData.getBookings().subscribe(bookings => {
      this.recentBookings.set(bookings.slice(0, 5));
      this.isLoading.set(false);
    });
  }

  ngAfterViewInit(): void {
    this.initRevenueChart();
    this.initServiceChart();
  }

  private initRevenueChart(): void {
    this.mockData.getRevenueChartData().subscribe(data => {
      const ctx = this.revenueChartRef?.nativeElement?.getContext('2d');
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Revenue',
            data: data.data,
            borderColor: '#6366f1',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#6366f1',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1e293b',
              titleFont: { family: "'Inter', sans-serif", size: 12 },
              bodyFont: { family: "'Inter', sans-serif", size: 13 },
              padding: 12,
              cornerRadius: 10,
              displayColors: false,
              callbacks: {
                label: (ctx) => `$${(ctx.parsed.y ?? 0).toLocaleString()}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 12 } }
            },
            y: {
              grid: { color: 'rgba(148, 163, 184, 0.08)' },
              ticks: {
                color: '#94a3b8',
                font: { size: 12 },
                callback: (val) => '$' + Number(val).toLocaleString()
              }
            }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      });
    });
  }

  private initServiceChart(): void {
    this.mockData.getBookingsByServiceData().subscribe(data => {
      const ctx = this.serviceChartRef?.nativeElement?.getContext('2d');
      if (!ctx) return;

      this.serviceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.labels,
          datasets: [{
            data: data.data,
            backgroundColor: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderWidth: 0,
            hoverOffset: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16,
                usePointStyle: true,
                pointStyle: 'circle',
                font: { family: "'Inter', sans-serif", size: 12 },
                color: '#64748b'
              }
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleFont: { family: "'Inter', sans-serif" },
              bodyFont: { family: "'Inter', sans-serif" },
              padding: 12,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
              }
            }
          }
        }
      });
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      cancelled: 'badge-danger',
      completed: 'badge-info',
      'no-show': 'badge-danger',
    };
    return map[status] ?? 'badge-info';
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 0 });
  }
}
