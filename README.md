# Smart Inventory & Order Management System (Frontend)

Frontend-only Next.js application for managing products, stock levels, and order workflows.
Backend integration is intentionally deferred and will be connected later.

## Tech Stack

- Next.js App Router (TypeScript)
- React 19
- Server rendering patterns: SSR and ISR
- Light-theme-only custom design system

## Key Frontend Architecture

- Dashboard (`/dashboard` and `/`): SSR-style dynamic rendering for fresh operational data.
- Products (`/products`): ISR with `revalidate = 120` for periodic refresh.
- Orders (`/orders`): SSR-style dynamic rendering for fulfillment visibility.
- New Order (`/orders/new`): Client-side draft builder and conflict validation.
- Login (`/auth/login`): Email/password sign-in screen with demo credential autofill.
- Signup (`/auth/signup`): Frontend account creation form ready for backend wiring.
- Global loading and route loading states via `loading.tsx` files.
- Segment and app-level error boundaries via `error.tsx` and `global-error.tsx`.

## Authentication UX (Frontend-Only)

- Email + password login and signup flows are implemented in the UI.
- Successful login/signup redirects to Dashboard (`/dashboard`).
- Demo Login button pre-fills these credentials:
  - `manager@smartinventory.dev`
  - `Demo@1234`

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

`http://localhost:3000`

## Production Checks

```bash
npm run lint
npm run build
```

## Notes

- No backend API is implemented in this repository.
- Current data layer uses local frontend/server mock data to support UI and flow development.
- Redux is not set up yet by design and can be integrated when backend contracts are finalized.
