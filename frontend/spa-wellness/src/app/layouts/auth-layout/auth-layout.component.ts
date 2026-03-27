import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-wrapper">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4"/>
              <path d="M12 8v1m0 6v1m-4-4h1m6 0h1"/>
            </svg>
          </div>
          <h1>Serenity</h1>
          <p>Spa & Wellness Management</p>
        </div>
        <div class="auth-content">
          <router-outlet />
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-visual">
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
          <div class="visual-content">
            <h2>Elevate Your Wellness Business</h2>
            <p>Streamline bookings, manage clients, and grow your spa with our intelligent management platform.</p>
            <div class="visual-stats">
              <div class="stat-item">
                <span class="stat-value">10k+</span>
                <span class="stat-label">Active Spas</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">2M+</span>
                <span class="stat-label">Bookings</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">99%</span>
                <span class="stat-label">Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {}
