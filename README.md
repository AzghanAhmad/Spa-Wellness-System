# Spa & Wellness Management SaaS Frontend

Modern Angular frontend prototype for an AI-powered Spa & Wellness Management platform.

## Overview

This repository contains the frontend implementation for a spa business management SaaS product, including:

- Internal admin/staff dashboard
- Booking and scheduling workflows
- CRM-style customer management
- Memberships, vouchers, payments, marketing, forms, and communications
- Public-facing online booking flow

The app is built to be ready for future integration with a .NET backend.

## Tech Stack

- Angular (standalone components)
- TypeScript (strict mode)
- Angular Signals (local state)
- RxJS (async streams + mock API delay simulation)
- TailwindCSS + custom SCSS design system
- Chart.js (dashboard analytics)

## Project Structure

```text
project/
├─ frontend/
│  └─ spa-wellness/
│     ├─ src/
│     │  ├─ app/
│     │  │  ├─ core/        # services, guards, interceptors, models
│     │  │  ├─ features/    # feature pages/components
│     │  │  ├─ layouts/     # auth/dashboard layouts
│     │  │  └─ shared/      # reusable UI pieces
│     │  └─ environments/   # environment config
│     ├─ angular.json
│     └─ package.json
└─ README.md
```

## Implemented Feature Areas

- Dashboard (KPIs, charts, recent bookings)
- Bookings & scheduling (calendar view, status updates, conflict checks)
- Customers (list, profile details, history, edit drawer)
- Memberships (plans, active members, usage tracking)
- Vouchers (create, preview, issue list)
- Payments (deposit/full/split, methods, discounts, transaction list)
- Marketing (campaign creation, audience selection, scheduling)
- Consultation/medical forms (builder + responses + restriction visibility)
- Communications (notification settings + message preview)
- Public booking (service/staff/slot selection + confirmation)

## Routing

Key routes include:

- `/auth/login`, `/auth/signup`
- `/dashboard`
- `/bookings`
- `/customers`
- `/memberships`
- `/vouchers`
- `/payments`
- `/marketing` (admin only)
- `/forms`
- `/communications`
- `/public-booking`

## Run Locally

From the Angular app folder:

```bash
cd frontend/spa-wellness
npm install
npm start
```

App default URL:

- [http://localhost:4200](http://localhost:4200)

## Build

```bash
cd frontend/spa-wellness
npm run build
```

Production output:

- `frontend/spa-wellness/dist/spa-wellness`

## Notes

- Data is currently mocked via `MockDataService`.
- API delay is simulated using RxJS `delay(...)`.
- Theme preference is persisted; default theme is light for new users.
- This is a frontend prototype and does not yet include real backend API integration.

