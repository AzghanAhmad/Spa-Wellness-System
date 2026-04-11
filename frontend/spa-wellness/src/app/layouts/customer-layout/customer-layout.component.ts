import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

interface CustomerNavItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Overlay -->
    @if (mobileMenuOpen()) {
      <div class="mobile-overlay" (click)="mobileMenuOpen.set(false)"></div>
    }

    <!-- Sidebar -->
    <aside class="c-sidebar" [class.mobile-open]="mobileMenuOpen()">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
            <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
            <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
            <circle cx="16" cy="16" r="3" fill="white"/>
          </svg>
        </div>
      </div>

      <nav class="sidebar-nav">
        @for (item of navItems; track item.route) {
          <a class="nav-icon-btn"
             [routerLink]="item.route"
             routerLinkActive="active"
             [title]="item.label"
             (click)="mobileMenuOpen.set(false)">
            <span class="icon-wrap" [innerHTML]="safeHtml(item.icon)"></span>
            <span class="nav-tooltip">{{ item.label }}</span>
            @if (item.badge) {
              <span class="nav-badge">{{ item.badge }}</span>
            }
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <button class="nav-icon-btn" (click)="themeService.toggleTheme()" title="Toggle Theme">
          @if (themeService.isDark()) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          }
        </button>
        <button class="nav-icon-btn" (click)="authService.logout()" title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="c-main">
      <!-- Top Header -->
      <header class="c-header">
        <div class="header-left">
          <button class="mobile-toggle hide-desktop-up" (click)="mobileMenuOpen.set(true)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div class="welcome-text">
            <span class="greeting">{{ getGreeting() }}</span>
            <span class="user-name">{{ userName() }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="search-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span class="hide-mobile">Search services...</span>
          </div>
          <button class="header-icon-btn" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-dot"></span>
          </button>
          <div class="user-avatar-area" (click)="userMenuOpen.set(!userMenuOpen())">
            <div class="avatar-circle">{{ userInitials() }}</div>
            @if (userMenuOpen()) {
              <div class="user-dropdown animate-fade-in-down">
                <div class="dd-user-info">
                  <div class="dd-avatar">{{ userInitials() }}</div>
                  <div>
                    <strong>{{ authService.user()?.firstName }} {{ authService.user()?.lastName }}</strong>
                    <span>{{ authService.user()?.email }}</span>
                  </div>
                </div>
                <div class="dd-divider"></div>
                <a class="dd-item" routerLink="/customer/profile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
                  My Profile
                </a>
                <a class="dd-item" routerLink="/customer/appointments">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  My Appointments
                </a>
                <div class="dd-divider"></div>
                <a class="dd-item danger" (click)="authService.logout()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </a>
              </div>
            }
          </div>
        </div>
      </header>

      <main class="c-content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './customer-layout.component.scss',
})
export class CustomerLayoutComponent {
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  readonly userName = computed(
    () => `${this.authService.user()?.firstName ?? ''} ${this.authService.user()?.lastName ?? ''}`.trim(),
  );

  readonly userInitials = computed(() => {
    const u = this.authService.user();
    if (!u) return '?';
    return (u.firstName[0] + u.lastName[0]).toUpperCase();
  });

  navItems: CustomerNavItem[] = [
    {
      label: 'Dashboard', route: '/customer/dashboard',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    },
    {
      label: 'Book Now', route: '/customer/book',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    },
    {
      label: 'Appointments', route: '/customer/appointments',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      badge: 3,
    },
    {
      label: 'Profile', route: '/customer/profile',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
    },
    {
      label: 'Memberships', route: '/customer/memberships',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    },
    {
      label: 'Gift Vouchers', route: '/customer/vouchers',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8V22"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.68 8C6.55 8 5 6.76 5 5.5S6.55 3 7.68 3c1.65 0 2.76 1.88 4.32 5"/><path d="M16.32 8C17.45 8 19 6.76 19 5.5S17.45 3 16.32 3c-1.65 0-2.76 1.88-4.32 5"/></svg>',
    },
    {
      label: 'Payments', route: '/customer/payments',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    },
    {
      label: 'Timeline', route: '/customer/timeline',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><line x1="12" y1="7" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="17"/></svg>',
    },
  ];

  constructor(
    public readonly authService: AuthService,
    public readonly themeService: ThemeService,
    private readonly sanitizer: DomSanitizer,
  ) {}

  safeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  }
}
