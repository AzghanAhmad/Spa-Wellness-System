import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, AuthState, LoginRequest, SignupRequest, UserRole } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });

  readonly user = computed(() => this.authState().user);
  readonly token = computed(() => this.authState().token);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isLoading = computed(() => this.authState().isLoading);
  readonly userRole = computed(() => this.authState().user?.role ?? null);

  constructor(private readonly router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const token = localStorage.getItem(environment.tokenKey);
      const userJson = localStorage.getItem(environment.userKey);
      if (token && userJson) {
        const user: User = JSON.parse(userJson);
        this.authState.set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch {
      this.clearStorage();
    }
  }

  private saveToStorage(user: User, token: string): void {
    localStorage.setItem(environment.tokenKey, token);
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
  }

  async login(request: LoginRequest): Promise<void> {
    this.authState.update(s => ({ ...s, isLoading: true }));

    // Mock login - simulate API delay
    await new Promise(resolve => setTimeout(resolve, environment.mockApiDelay));

    // Mock: check demo credentials
    const mockUsers: Record<string, User> = {
      'admin@serenity.com': {
        id: 'u1',
        email: 'admin@serenity.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'admin',
        phone: '+1-555-0100',
        createdAt: '2024-01-15',
      },
      'staff@serenity.com': {
        id: 'u2',
        email: 'staff@serenity.com',
        firstName: 'Emily',
        lastName: 'Chen',
        role: 'staff',
        phone: '+1-555-0101',
        createdAt: '2024-03-10',
      },
    };

    const user = mockUsers[request.email];
    if (!user) {
      this.authState.update(s => ({ ...s, isLoading: false }));
      throw new Error('Invalid email or password');
    }

    const token = 'mock-jwt-token-' + Date.now();
    this.saveToStorage(user, token);
    this.authState.set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }

  async signup(request: SignupRequest): Promise<void> {
    this.authState.update(s => ({ ...s, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, environment.mockApiDelay));

    const user: User = {
      id: 'u' + Date.now(),
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      role: request.role,
      createdAt: new Date().toISOString(),
    };

    const token = 'mock-jwt-token-' + Date.now();
    this.saveToStorage(user, token);
    this.authState.set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }

  logout(): void {
    this.clearStorage();
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    this.router.navigate(['/auth/login']);
  }

  hasRole(role: UserRole): boolean {
    return this.user()?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}
