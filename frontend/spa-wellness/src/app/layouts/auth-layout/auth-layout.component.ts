import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
              <circle cx="20" cy="20" r="18" stroke="white" stroke-width="1.5" opacity="0.3"/>
              <circle cx="20" cy="20" r="12" stroke="white" stroke-width="1.5" opacity="0.5"/>
              <circle cx="20" cy="20" r="6" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <h1 class="brand-name">Serenity</h1>
          <p class="brand-tagline">Spa & Wellness Management</p>
          <div class="brand-features">
            <div class="feature-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Booking & Scheduling</span>
            </div>
            <div class="feature-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Client Management</span>
            </div>
            <div class="feature-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Business Analytics</span>
            </div>
            <div class="feature-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Marketing Automation</span>
            </div>
          </div>
        </div>
      </div>
      <div class="auth-form-panel">
        <div class="form-wrapper">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {}
