# Smart Inventory System Frontend

Smart Inventory System Frontend is a Next.js application for managing inventory, orders, restocking, and user access in a role-based business workflow. It provides a polished dashboard experience for administrators and managers, while also supporting the full authentication lifecycle for new users, approved users, and password recovery.

## Project Overview

This repository contains the frontend for a smart inventory platform. The application focuses on operational visibility and control across the full stock lifecycle:

- Authenticate users securely with email/password, OTP verification, and password reset flows.
- Manage products, categories, orders, restock queues, and activity logs from a dashboard.
- Enforce role-based access control for `ADMIN`, `MANAGER`, and `USER` sessions.
- Persist session state across refreshes and automatically refresh expired access tokens.

The UI is built as a modern SaaS-style dashboard with a glassmorphic visual design, responsive layouts, and a structured navigation model that adapts to the signed-in user role.

## Brief Description

The application helps teams track inventory accurately, reduce stockouts, process orders faster, and maintain auditability across inventory operations. It is designed for organizations that need a single web-based control panel for day-to-day stock operations and administrative oversight.

## Problem Statement

Inventory-heavy businesses often struggle with:

- Fragmented stock tracking across spreadsheets, email, and disconnected tools.
- Delayed restocking because low inventory is discovered too late.
- Inconsistent order processing and status tracking.
- Limited visibility into who changed what and when.
- Weak access control between administrators, managers, and regular users.

These gaps lead to stockouts, operational errors, slower fulfillment, and poor accountability.

## Solution Overview

This frontend provides a unified inventory operations console that addresses those issues by combining:

- A dashboard for high-level operational visibility.
- Product and category management for maintaining catalog structure.
- Order management with live stock impact.
- A restock queue for low-stock resolution.
- An activity log for traceability.
- Role-based routing and UI visibility so users only see the sections they should access.

## How the Application Works

1. A user signs up, logs in, or recovers access through the auth flow.
2. After authentication, session details and tokens are stored in Redux and persisted locally.
3. Protected dashboard routes are guarded by client-side auth checks.
4. The dashboard loads role-specific analytics and navigation.
5. Users manage products, categories, orders, low-stock items, and user access through RTK Query-powered API calls.
6. If an access token expires, the app automatically attempts to refresh it using the stored refresh token.
7. If refresh fails, the session is cleared and the user is redirected back to login.

## System Flow

### Authentication Flow

```text
Sign up / Login / Demo login
        ↓
Backend returns user + access token + refresh token
        ↓
Redux stores session state and Redux Persist keeps it across reloads
        ↓
AuthGuard protects dashboard routes
        ↓
API requests include Bearer token automatically
        ↓
On 401, the app requests a refreshed token and retries the original call
```

### Inventory and Operations Flow

```text
Products and categories define the catalog
        ↓
Orders consume stock and generate activity logs
        ↓
Low stock items appear in the restock queue and dashboard alerts
        ↓
Restocking updates product stock and analytics data
        ↓
Activity logs preserve traceability across all major actions
```

## Frontend Architecture

The frontend is organized around the Next.js App Router and separates concerns into route-level pages, reusable UI components, service utilities, and Redux-powered data access.

### Main Frontend Responsibilities

- Render the landing page and authentication pages.
- Protect and structure dashboard access by role.
- Fetch and mutate backend data through RTK Query.
- Persist auth state safely for browser refreshes.
- Provide reusable shells for dashboard layout, modals, and guards.

### Key Frontend Modules

- [src/app](src/app) contains the route hierarchy and page entry points.
- [src/components](src/components) contains reusable UI shells, guards, and layout elements.
- [src/lib](src/lib) contains auth helpers, role access rules, validation, and utility services.
- [src/redux](src/redux) contains the Redux store, persistence setup, auth state, and RTK Query APIs.
- [src/types](src/types) defines the shared data models and form types.

## Backend Structure

This repository does not contain backend source code. Instead, it depends on an external REST API exposed through `NEXT_PUBLIC_API_URL` and expects the following backend domains and responsibilities.

### Backend Modules Used by the Frontend

- `auth` for signup, login, OTP verification, password recovery, token refresh, and user management.
- `products` for product CRUD, product details, deactivation, restocking, and low-stock listing.
- `categories` for category CRUD and category bans.
- `orders` for order creation, order listing, status updates, and cancellation.
- `analytics` for admin and manager dashboards.
- `restock-queue` for handling low-stock work items.
- `activity-logs` for audit history and operational traceability.

### Expected API Responsibilities

- Validate credentials and issue access and refresh tokens.
- Enforce RBAC on protected endpoints.
- Maintain inventory consistency when orders or restocks are created.
- Record activity logs for user and inventory events.
- Return dashboard summaries and filtered collections for the UI.

## Code Structure

### App Routes

- [src/app/page.tsx](src/app/page.tsx) is the landing page and redirects authenticated users into the dashboard.
- [src/app/auth](src/app/auth) contains the login, signup, OTP verification, forgot-password, reset-password, and pending-approval routes.
- [src/app/dashboard](src/app/dashboard) contains the protected app experience, including analytics, products, categories, orders, low-stock, users, and activity routes.
- [src/app/layout.tsx](src/app/layout.tsx) sets the root metadata, typography, top loader, global providers, and application shell.

### Reusable Components

- [src/components/dashboard-layout.tsx](src/components/dashboard-layout.tsx) wraps the authenticated experience in a responsive shell.
- [src/components/dashboard-sidebar.tsx](src/components/dashboard-sidebar.tsx) renders role-aware navigation and logout behavior.
- [src/components/dashboard-topbar.tsx](src/components/dashboard-topbar.tsx) shows page context, user info, and role badges.
- [src/components/form-modal-shell.tsx](src/components/form-modal-shell.tsx) provides a reusable modal container for CRUD forms.
- [src/components/auth/auth-guard.tsx](src/components/auth/auth-guard.tsx) protects dashboard routes.
- [src/components/auth/unauth-guard.tsx](src/components/auth/unauth-guard.tsx) keeps signed-in users out of auth pages.
- [src/components/SessionRedirect.tsx](src/components/SessionRedirect.tsx) sends authenticated users from the landing page to the dashboard.

### Shared Libraries

- [src/lib/auth-service.ts](src/lib/auth-service.ts) contains auth request helpers, demo login credentials, and error handling.
- [src/lib/role-access.ts](src/lib/role-access.ts) defines role normalization, navigation, and route access rules.
- [src/lib/session-store.ts](src/lib/session-store.ts) manages session persistence helpers.
- [src/lib/inventory-service.ts](src/lib/inventory-service.ts) contains local inventory sample data and validation helpers.
- [src/lib/validation/auth.ts](src/lib/validation/auth.ts) defines Zod schemas for login, signup, OTP, and password reset forms.

### Redux and API Layer

- [src/redux/store.ts](src/redux/store.ts) configures the Redux store and Redux Persist.
- [src/redux/ReduxStoreProvider.tsx](src/redux/ReduxStoreProvider.tsx) mounts the store and persist gate in the app tree.
- [src/redux/api/baseApi.ts](src/redux/api/baseApi.ts) defines the shared RTK Query base API, auth header injection, and refresh-token retry behavior.
- [src/redux/features/auth/authSlice.ts](src/redux/features/auth/authSlice.ts) stores the current user and tokens.
- [src/redux/features/auth/authApi.ts](src/redux/features/auth/authApi.ts) handles auth-related API calls and user management.
- [src/redux/features/product/productApi.ts](src/redux/features/product/productApi.ts) manages product queries and mutations.
- [src/redux/features/category/categoryApi.ts](src/redux/features/category/categoryApi.ts) manages category queries and mutations.
- [src/redux/features/order/orderApi.ts](src/redux/features/order/orderApi.ts) manages order workflows.
- [src/redux/features/analytics/analyticsApi.ts](src/redux/features/analytics/analyticsApi.ts) fetches dashboard summaries.
- [src/redux/features/restock/restockApi.ts](src/redux/features/restock/restockApi.ts) manages the restock queue.
- [src/redux/features/activity-log/activityLogApi.ts](src/redux/features/activity-log/activityLogApi.ts) fetches audit log entries.

### Types

- [src/types/inventory.ts](src/types/inventory.ts) defines the inventory domain models, order statuses, restock states, and dashboard summary types.
- [src/types/auth.ts](src/types/auth.ts) defines auth form and session types.
- [src/types/index.ts](src/types/index.ts) centralizes exported shared types.

## Route and Feature Map

### Public and Auth Routes

- `/` landing page with marketing copy and entry points.
- `/auth/login` sign-in page.
- `/auth/signup` registration page.
- `/auth/verify-otp` OTP confirmation page.
- `/auth/forgot-password` password recovery request page.
- `/auth/reset-password` password reset page.
- `/auth/pending-approval` waiting state for accounts that still need approval.

### Protected Dashboard Routes

- `/dashboard` summary view with role-aware analytics.
- `/dashboard/analytics` deeper reporting for admins.
- `/dashboard/products` product catalog and stock management.
- `/dashboard/categories` category management.
- `/dashboard/orders` order creation and status management.
- `/dashboard/low-stock` restock queue and low-stock handling.
- `/dashboard/users` user and manager administration.
- `/dashboard/activity` operational audit trail.

## Data and Permissions

The frontend recognizes these roles:

- `ADMIN` can access the full dashboard, analytics, user management, and activity logs.
- `MANAGER` can access operational tools such as products, categories, orders, and restock management.
- `USER` is supported in the domain model and auth flow, but dashboard access is gated by the route guard and role access rules.

Permission decisions are centralized in [src/lib/role-access.ts](src/lib/role-access.ts) and enforced at the layout level by the auth guard.

## Technologies Used

| Category          | Technology                     |
| ----------------- | ------------------------------ |
| Framework         | Next.js 16.2.1 with App Router |
| UI                | React 19.2.4                   |
| Language          | TypeScript 5                   |
| Styling           | Tailwind CSS 3.4.19, PostCSS   |
| Component Library | Ant Design 6.3.5               |
| State Management  | Redux Toolkit 2.11.2           |
| API Layer         | RTK Query                      |
| Persistence       | redux-persist 6.0.0            |
| Validation        | Zod 4.3.6                      |
| Notifications     | SweetAlert2 11.26.24           |
| Loading Indicator | nextjs-toploader 3.9.17        |
| Linting           | ESLint 9 with Next.js config   |

## Environment Variables

The frontend expects the following environment variables:

- `NEXT_PUBLIC_API_URL` base URL for the backend API.
- `NEXT_PUBLIC_DEMO_EMAIL` demo manager email used by the demo login helper.
- `NEXT_PUBLIC_DEMO_PASSWORD` demo manager password used by the demo login helper.

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Build and run the production version:

```bash
npm run build
npm start
```

Run lint checks:

```bash
npm run lint
```

## Notes for Developers

- The frontend is strongly coupled to the backend API shape, especially for auth, product, order, and dashboard responses.
- Token refresh is handled centrally in [src/redux/api/baseApi.ts](src/redux/api/baseApi.ts), so most feature modules stay focused on domain operations.
- The dashboard navigation is role-aware, so adding a new protected page usually requires updates in both the route tree and [src/lib/role-access.ts](src/lib/role-access.ts).
- If backend response contracts change, update the RTK Query feature modules and the shared types together to keep the UI stable.
