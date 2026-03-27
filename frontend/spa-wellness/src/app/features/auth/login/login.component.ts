import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-form animate-fade-in-up">
      <h2>Welcome back</h2>
      <p class="auth-description">Enter your credentials to access your dashboard</p>

      <form (ngSubmit)="onLogin()">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" class="input" placeholder="admin&#64;serenity.com"
                 [(ngModel)]="email" name="email" required autocomplete="email">
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input id="password" [type]="showPassword() ? 'text' : 'password'" class="input"
                   placeholder="Enter password" [(ngModel)]="password" name="password" required>
            <button type="button" class="password-toggle" (click)="showPassword.set(!showPassword())">
              @if (showPassword()) {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>

        @if (errorMessage()) {
          <div class="error-alert animate-fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ errorMessage() }}
          </div>
        }

        <button type="submit" class="btn-primary btn-lg submit-btn" [disabled]="authService.isLoading()">
          @if (authService.isLoading()) {
            <span class="spinner"></span>
            Signing in...
          } @else {
            Sign In
          }
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account? <a routerLink="/auth/signup">Create account</a>
      </p>

      <div class="demo-credentials">
        <p class="demo-title">Demo Credentials</p>
        <div class="demo-item" (click)="fillDemo('admin@serenity.com')">
          <strong>Admin:</strong> admin&#64;serenity.com
        </div>
        <div class="demo-item" (click)="fillDemo('staff@serenity.com')">
          <strong>Staff:</strong> staff&#64;serenity.com
        </div>
        <span class="demo-note">Password: any</span>
      </div>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = signal(false);
  errorMessage = signal('');

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly notification: NotificationService
  ) {}

  async onLogin(): Promise<void> {
    this.errorMessage.set('');
    try {
      await this.authService.login({ email: this.email, password: this.password });
      this.notification.success('Welcome back!', `Signed in as ${this.authService.user()?.firstName}`);
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Login failed');
    }
  }

  fillDemo(email: string): void {
    this.email = email;
    this.password = 'demo123';
  }
}
