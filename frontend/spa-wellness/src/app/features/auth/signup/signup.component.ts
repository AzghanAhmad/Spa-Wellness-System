import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-form animate-fade-in-up">
      <h2>Create your account</h2>
      <p class="auth-description">Start managing your wellness business today</p>

      <form (ngSubmit)="onSignup()">
        <div class="name-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input id="firstName" type="text" class="input" placeholder="Sarah"
                   [(ngModel)]="firstName" name="firstName" required>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input id="lastName" type="text" class="input" placeholder="Johnson"
                   [(ngModel)]="lastName" name="lastName" required>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" class="input" placeholder="you&#64;example.com"
                 [(ngModel)]="email" name="email" required>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" class="input" placeholder="Create a strong password"
                 [(ngModel)]="password" name="password" required minlength="8">
          <span class="field-hint">Must be at least 8 characters</span>
        </div>

        <div class="form-group">
          <label for="role">Account Type</label>
          <select id="role" class="input" [(ngModel)]="role" name="role" required>
            <option value="admin">Spa Owner / Admin</option>
            <option value="staff">Staff Member</option>
          </select>
        </div>

        <label class="checkbox-label terms">
          <input type="checkbox" [(ngModel)]="agreeTerms" name="terms" required>
          <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
        </label>

        <button type="submit" class="btn-primary btn-lg submit-btn" [disabled]="authService.isLoading()">
          @if (authService.isLoading()) {
            <span class="spinner"></span>
            Creating account...
          } @else {
            Create Account
          }
        </button>
      </form>

      <p class="auth-footer">
        Already have an account? <a routerLink="/auth/login">Sign in</a>
      </p>
    </div>
  `,
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  role: 'admin' | 'staff' = 'admin';
  agreeTerms = false;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly notification: NotificationService
  ) {}

  async onSignup(): Promise<void> {
    try {
      await this.authService.signup({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
      });
      this.notification.success('Account created!', 'Welcome to Serenity Spa');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.notification.error('Signup failed', err.message);
    }
  }
}
