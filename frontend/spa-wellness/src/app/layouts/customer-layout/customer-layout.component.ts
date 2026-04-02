import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface CustomerNavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="customer-shell">
      <aside class="customer-sidebar">
        <div class="brand">S</div>
        <nav>
          @for (item of navItems; track item.route) {
            <a class="icon-btn" [routerLink]="item.route" routerLinkActive="active" [title]="item.label">
              <span [innerHTML]="item.icon"></span>
            </a>
          }
        </nav>
        <button class="icon-btn bottom" (click)="authService.logout()" title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </aside>

      <div class="main">
        <header class="top">
          <div class="title">Customer Panel</div>
          <div class="user">{{ userName() }}</div>
        </header>
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .customer-shell { display: flex; min-height: 100vh; background: #f5fbff; }
    .customer-sidebar { width: 64px; background: linear-gradient(180deg, #0a4f94 0%, #073f7a 100%); display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 10px; }
    .brand { width: 36px; height: 36px; border-radius: 10px; background: #1f6ec0; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; }
    nav { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
    .icon-btn { width: 36px; height: 36px; border-radius: 9px; border: none; color: #cbe2ff; display: flex; align-items: center; justify-content: center; background: transparent; transition: all .2s ease; text-decoration: none; }
    .icon-btn:hover, .icon-btn.active { background: rgba(255,255,255,.14); color: #fff; transform: translateY(-1px); }
    .icon-btn ::ng-deep svg { width: 19px; height: 19px; }
    .icon-btn.bottom { margin-top: auto; cursor: pointer; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .top { height: 60px; border-bottom: 1px solid #dbeaf7; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
    .title { font-weight: 700; color: #183b56; }
    .user { color: #4a647d; font-size: .9rem; }
    .content { padding: 14px; animation: fadeIn .35s ease; }
  `],
})
export class CustomerLayoutComponent {
  readonly userName = computed(
    () => `${this.authService.user()?.firstName ?? ''} ${this.authService.user()?.lastName ?? ''}`.trim(),
  );

  navItems: CustomerNavItem[] = [
    { label: 'Dashboard', route: '/customer/dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
    { label: 'Timeline', route: '/customer/timeline', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><line x1="12" y1="7" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="17"/></svg>' },
    { label: 'Profile', route: '/customer/profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>' },
  ];

  constructor(public readonly authService: AuthService) {}
}

