import { inject } from '@angular/core';
import { Router, CanActivateFn, CanMatchFn, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Root URL or staff-only top-level paths — must be listed before admin layout in routes. */
export const matchStaffLayout: CanMatchFn = (_route, segments: UrlSegment[]) => {
  if (segments.length === 0) return true;
  const p = segments[0].path;
  return p === 'bookings' || p === 'customers';
};

/** Admin shell routes (same URLs as before; disambiguated from staff via canMatch, not route order alone). */
const ADMIN_ROOT_SEGMENTS = new Set([
  'dashboard',
  'bookings',
  'customers',
  'memberships',
  'vouchers',
  'payments',
  'marketing',
  'forms',
  'communications',
]);

export const matchAdminLayout: CanMatchFn = (_route, segments: UrlSegment[]) => {
  if (segments.length === 0) return false;
  return ADMIN_ROOT_SEGMENTS.has(segments[0].path);
};

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
