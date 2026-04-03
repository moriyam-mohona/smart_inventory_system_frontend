# Restock Queue Implementation Plan

This plan defines how to implement and mature the Restock Queue module in Smart Inventory System.

## 1. Objective

Ensure low-stock products are tracked, prioritized, and resolved through a predictable workflow that supports both admins and managers.

## 2. Current Endpoints

1. `GET /api/v1/restock-queue`
2. `PATCH /api/v1/restock-queue/:id/resolve`

Access:

1. `ADMIN` and `MANAGER` can list and resolve queue items

## 3. Current Core Behavior

1. Queue list supports pagination and optional status/priority filters
2. Queue list is sorted by `currentStock ASC`, then `createdAt ASC`
3. Resolve endpoint closes an open queue item and sets `resolvedAt`
4. Activity log event is written when queue item is manually resolved
5. Queue creation/removal is also driven by product stock changes via `syncRestockQueue`

## 4. Data Model Rules

Restock item fields:

1. `productId`
2. `currentStock`
3. `minStockThreshold`
4. `priority` (`HIGH`, `MEDIUM`, `LOW`)
5. `status` (`OPEN`, `CLOSED`)
6. `note`
7. `resolvedAt`
8. `createdAt`, `updatedAt`

Rules:

1. If stock is at/below threshold, item should exist as `OPEN`
2. If stock is above threshold, queue item should be removed or closed by sync logic
3. Manual resolve should be idempotent for already-closed items

## 5. Phase Plan

## Phase 1: Stability

1. Keep list and resolve endpoints stable
2. Ensure pagination metadata remains consistent
3. Keep restock queue sync calls in product and order flows

Acceptance:

1. Queue updates correctly after product create/update/restock/order/cancel flows
2. Resolve endpoint behaves safely on missing/closed items

## Phase 2: Visibility and Filtering

1. Add search support by product name/SKU
2. Add optional date range filters
3. Add summary counts (open by priority)

Acceptance:

1. API can power dashboard-level low-stock widgets
2. Queries remain performant

## Phase 3: Workflow Controls

1. Add reopen endpoint for mistakenly resolved entries
2. Add optional reason field for manual resolve/reopen
3. Add SLA fields (days open)

Acceptance:

1. Teams can track and revisit unresolved inventory risks

## 6. Validation and Error Handling

1. Validate queue item id format in resolve routes
2. Return `404` for missing queue items
3. Keep clear messages for already resolved items
4. Ensure invalid filters return validation errors

## 7. Activity Logging Plan

Track and keep:

1. `RESTOCK_QUEUE_ADDED`
2. `RESTOCK_QUEUE_REMOVED`
3. manual resolve action details

Recommended metadata:

1. previous and new stock
2. threshold and priority
3. action source (`AUTO_SYNC` or `MANUAL`)

## 8. Test Matrix

1. Product falls below threshold -> queue entry opens
2. Product restocked above threshold -> queue entry closes/removes
3. Resolve open queue item -> status closed with resolvedAt
4. Resolve closed queue item -> idempotent response
5. List filters by status and priority
6. Pagination meta is correct

## 9. Rollout Checklist

1. Build and type checks pass
2. API tests cover auto-sync and manual resolve
3. Activity logs verified for queue transitions
4. Dashboard low-stock card validated against queue data
