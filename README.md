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

- Static files: `frontend/spa-wellness/dist/spa-wellness/browser` (this is what Vercel should serve)

## Deploy on Vercel

The Angular app lives under `frontend/spa-wellness`. A `vercel.json` in that folder rewrites all routes to `index.html` so the Angular router works (refreshing `/dashboard`, deep links, etc.).

### Option A: Vercel Dashboard (Git)

1. Push this project to GitHub, GitLab, or Bitbucket.
2. Create a project at [vercel.com](https://vercel.com) and import the repository.
3. **Root Directory**: set to `frontend/spa-wellness` (important).
4. **Framework Preset**: Other (or leave auto-detect if it picks Angular).
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist/spa-wellness/browser`
7. **Install Command**: `npm install` (default)
8. Deploy. Every push to the default branch can trigger a new deploy if you enable it.

### Option B: Vercel CLI (from your machine)

```bash
cd frontend/spa-wellness
npm install
npx vercel
```

Follow the prompts (link to a Vercel account). For production:

```bash
npx vercel --prod
```

Set the same **Root Directory** and **Output Directory** in the project settings on Vercel if the first deploy used the wrong folder.

### Troubleshooting

- **404 on refresh or direct URL** (e.g. `/dashboard`): ensure `vercel.json` is deployed and **Output Directory** is `dist/spa-wellness/browser`, not `dist/spa-wellness`.
- **Wrong app or empty site**: confirm **Root Directory** is `frontend/spa-wellness`, not the repo root.
- **Backend later**: add API rewrites in `vercel.json` or use a separate API host; keep SPA rewrites only for non-API paths.

## Notes

- Data is currently mocked via `MockDataService`.
- API delay is simulated using RxJS `delay(...)`.
- Theme preference is persisted; default theme is light for new users.
- This is a frontend prototype and does not yet include real backend API integration.

