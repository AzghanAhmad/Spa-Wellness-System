import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="toast animate-slide-in-right" [class]="'toast-' + toast.type">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              }
              @case ('info') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              }
            }
          </div>
          <div class="toast-body">
            <span class="toast-title">{{ toast.title }}</span>
            @if (toast.message) {
              <span class="toast-message">{{ toast.message }}</span>
            }
          </div>
          <button class="toast-close" (click)="notificationService.dismiss(toast.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: var(--radius-lg);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
    }
    .toast-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      margin-top: 1px;
    }
    .toast-icon svg { width: 20px; height: 20px; }
    .toast-success .toast-icon { color: var(--color-success); }
    .toast-error .toast-icon { color: var(--color-danger); }
    .toast-warning .toast-icon { color: var(--color-warning); }
    .toast-info .toast-icon { color: var(--color-info); }
    .toast-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .toast-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
    }
    .toast-message {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }
    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: 2px;
      border-radius: 4px;
      display: flex;
    }
    .toast-close:hover { color: var(--text-primary); }
    .toast-close svg { width: 16px; height: 16px; }
  `]
})
export class ToastComponent {
  constructor(public readonly notificationService: NotificationService) {}
}
