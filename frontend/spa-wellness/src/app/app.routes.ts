import { Routes } from '@angular/router';
import { authGuard, adminGuard, customerGuard, publicGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/signup/signup.component').then((m) => m.SignupComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ],
  },
  {
    path: 'public-booking',
    loadComponent: () =>
      import('./features/public-booking/public-booking.component').then(
        (m) => m.PublicBookingComponent,
      ),
  },
  // Staff / shared auth area must be registered BEFORE the admin layout: both use path ''.
  // Otherwise /bookings was matched by DashboardLayout + adminGuard and caused an infinite redirect loop.
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/bookings/bookings.component').then((m) => m.BookingsComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customers.component').then((m) => m.CustomersComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'bookings' },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/bookings/bookings.component').then((m) => m.BookingsComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customers.component').then((m) => m.CustomersComponent),
      },
      {
        path: 'memberships',
        loadComponent: () =>
          import('./features/memberships/memberships.component').then((m) => m.MembershipsComponent),
      },
      {
        path: 'vouchers',
        loadComponent: () =>
          import('./features/vouchers/vouchers.component').then((m) => m.VouchersComponent),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/payments/payments.component').then((m) => m.PaymentsComponent),
      },
      {
        path: 'marketing',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/marketing/marketing.component').then((m) => m.MarketingComponent),
      },
      {
        path: 'forms',
        loadComponent: () =>
          import('./features/forms/forms.component').then((m) => m.FormsComponent),
      },
      {
        path: 'communications',
        loadComponent: () =>
          import('./features/communications/communications.component').then(
            (m) => m.CommunicationsComponent,
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [customerGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/customer-dashboard/customer-dashboard.component').then(
            (m) => m.CustomerDashboardComponent,
          ),
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./features/customer-timeline/customer-timeline.component').then(
            (m) => m.CustomerTimelineComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/customer-profile/customer-profile.component').then(
            (m) => m.CustomerProfileComponent,
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '/bookings' },
];
