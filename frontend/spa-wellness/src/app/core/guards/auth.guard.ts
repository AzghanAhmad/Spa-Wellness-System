import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Logged in but not admin — staff/customer area (must not redirect to /bookings under admin layout)
  router.navigate(['/bookings']);
  return false;
};

export const customerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isCustomer()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  router.navigate([authService.isAdmin() ? '/dashboard' : '/bookings']);
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  if (authService.isAdmin()) {
    router.navigate(['/dashboard']);
  } else if (authService.isCustomer()) {
    router.navigate(['/customer/dashboard']);
  } else {
    router.navigate(['/bookings']);
  }
  return false;
};
