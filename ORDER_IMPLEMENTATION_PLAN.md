# Order Implementation Plan

This plan defines how to build and harden the Order module in Smart Inventory System while preserving stock integrity and clear operational status flow.

## 1. Objective

Implement reliable order operations that support:

1. Creating orders with multiple items
2. Updating order status through delivery lifecycle
3. Cancelling orders with stock restoration
4. Filtering and pagination for order listing
5. Restock queue synchronization and audit logging

## 2. Current Endpoint Baseline

Active order routes:

1. GET /api/v1/orders
2. POST /api/v1/orders
3. PATCH /api/v1/orders/:id/status
4. PATCH /api/v1/orders/:id/cancel

Access:

1. ADMIN and MANAGER can access all current order endpoints

## 3. Core Data and Business Rules

Order fields:

1. orderNumber
2. customerName
3. status
4. totalPrice
5. createdById
6. cancelledAt
7. deliveredAt
8. createdAt and updatedAt

Order item fields:

1. orderId
2. productId
3. quantity
4. unitPrice
5. lineTotal

Rules:

1. Duplicate product entries in same order are blocked
2. Inactive or out-of-stock products cannot be ordered
3. Requested quantity cannot exceed available stock
4. Stock is deducted immediately on order creation
5. Cancelled orders restore stock to products
6. Product status follows stock level after deductions and restorations
7. Every stock change path triggers restock queue synchronization

## 4. Delivery Phases

## Phase 1: Stabilize Current Flows

Deliverables:

1. Keep create, list, status update, and cancel endpoints stable
2. Keep validation centralized for payloads and params
3. Keep pagination metadata consistent in list response

Acceptance criteria:

1. All existing routes compile and run
2. Invalid order id and invalid item payloads return clear validation errors
3. List returns predictable meta and data structure

## Phase 2: Strengthen Order Lifecycle Rules

Deliverables:

1. Enforce allowed status transitions
2. Prevent invalid transitions after cancellation or delivery
3. Keep deliveredAt and cancelledAt updates deterministic

Recommended transition map:

1. PENDING to CONFIRMED or CANCELLED
2. CONFIRMED to SHIPPED or CANCELLED
3. SHIPPED to DELIVERED
4. DELIVERED is terminal
5. CANCELLED is terminal

Acceptance criteria:

1. API rejects disallowed transition paths
2. deliveredAt is only set when status becomes DELIVERED
3. cancelledAt is only set when status becomes CANCELLED

## Phase 3: Add Order Details API

Deliverables:

1. Add GET /api/v1/orders/:id endpoint
2. Return order header, items, product snapshots, and creator info
3. Return computed summary fields for UI convenience

Acceptance criteria:

1. API returns 404 for missing order
2. Response includes full item-level pricing context
3. Response shape remains stable for dashboard and order details page

## Phase 4: Operational Quality and Reporting

Deliverables:

1. Add query support for customerName search and date ranges
2. Add optional status counts summary endpoint for dashboard widgets
3. Expand activity logs with richer metadata for status changes

Acceptance criteria:

1. Query behavior is indexed and performant
2. Monitoring can trace order history from logs
3. Dashboard can consume status metrics without heavy client aggregation

## 5. Validation Plan

Current and recommended validation rules:

1. customerName length and trim checks
2. Minimum one item required in create payload
3. productId must be valid ObjectId
4. quantity must be integer and >= 1
5. status must be one of defined order statuses
6. id route params must be valid ObjectId
7. date filter should be validated as parseable date string

## 6. Stock Consistency Plan

Order create path:

1. Validate products
2. Validate stock availability
3. Create order and deduct stock in one transaction
4. Recalculate product status after deduction
5. Sync restock queue for impacted products

Order cancel path:

1. Ensure order is not already cancelled
2. Set order to CANCELLED in transaction
3. Restore stock for every order item
4. Recalculate product status after restoration
5. Sync restock queue for impacted products

## 7. Activity Log Plan

Log events to preserve:

1. ORDER_CREATED
2. ORDER_STATUS_UPDATED
3. ORDER_CANCELLED

Recommended metadata extensions:

1. fromStatus and toStatus on status updates
2. itemCount and totalPrice on order creation
3. restoredItemsCount on cancellation

## 8. Test Matrix

Minimum tests to execute:

1. Create order with valid products and stock
2. Create order with duplicate products should fail
3. Create order with unavailable product should fail
4. Create order with quantity above stock should fail
5. Cancel order restores stock correctly
6. Cancel already cancelled order should fail
7. Update status with valid transition succeeds
8. Update status with invalid transition fails
9. List orders by status filter
10. List orders by date filter
11. Verify restock queue sync after create and cancel

## 9. Rollout Checklist

1. Run type build and schema checks
2. Run API tests for success and failure cases
3. Verify transaction safety in create and cancel flows
4. Verify activity logs for all mutating paths
5. Validate dashboard integration queries
6. Deploy to staging and run smoke tests
7. Deploy to production with log monitoring

## 10. Next Recommended Order APIs

1. GET /api/v1/orders/:id
2. GET /api/v1/orders/summary/status-counts
3. PATCH /api/v1/orders/:id/items for controlled item-level edits
4. GET /api/v1/orders/export for reporting pipelines
