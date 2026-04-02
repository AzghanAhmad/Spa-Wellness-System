import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile Overlay -->
    @if (mobileMenuOpen()) {
      <div class="mobile-overlay" (click)="mobileMenuOpen.set(false)"></div>
    }

    <!-- Narrow Icon Sidebar -->
    <aside class="icon-sidebar" [class.mobile-open]="mobileMenuOpen()">
      <!-- Nav Icons -->
      <nav class="sidebar-icons-nav">
        @for (item of navItems; track item.route) {
          <a
            class="sidebar-icon-btn"
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            [title]="item.label"
            (click)="mobileMenuOpen.set(false)"
          >
            <span class="icon-wrap" [innerHTML]="safeHtml(item.icon)"></span>
            <span class="icon-tooltip">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Bottom Icons -->
      <div class="sidebar-bottom-icons">
        <button class="sidebar-icon-btn" (click)="themeService.toggleTheme()" title="Toggle Theme">
          @if (themeService.isDark()) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          }
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-area">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <button class="mobile-menu-btn hide-desktop-up" (click)="mobileMenuOpen.set(true)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div class="salon-info">
            <span class="salon-name">Serenity Spa & Wellness</span>
          </div>
        </div>

        <div class="header-right">
          <button class="header-icon" title="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <div class="user-avatar-wrapper" (click)="userMenuOpen.set(!userMenuOpen())">
            <div class="header-avatar">{{ userInitials() }}</div>
            @if (userMenuOpen()) {
              <div class="user-dropdown animate-fade-in-down">
                <div class="dropdown-user-info">
                  <strong>{{ authService.user()?.firstName }} {{ authService.user()?.lastName }}</strong>
                  <span>{{ authService.user()?.email }}</span>
                </div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item danger" (click)="authService.logout()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </a>
              </div>
            }
          </div>
        </div>
      </header>

      <main class="page-content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: '../dashboard-layout/dashboard-layout.component.scss',
})
export class UserLayoutComponent {
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  readonly userInitials = computed(() => {
    const u = this.authService.user();
    if (!u) return '?';
    return (u.firstName[0] + u.lastName[0]).toUpperCase();
  });

  navItems: NavItem[] = [
    {
      label: 'Bookings',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      route: '/bookings',
    },
    {
      label: 'Customers',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      route: '/customers',
    },
  ];

  constructor(
    public readonly authService: AuthService,
    public readonly themeService: ThemeService,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
  ) {}

  safeHtml(html: string): SafeHtml {
    // Icons are passed as inline SVG strings; bypass Angular sanitizer so SVG tags render.
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

