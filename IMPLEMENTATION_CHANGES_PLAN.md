# Implementation Changes Plan

This document explains how the recent backend changes work together across Product, Order, Restock Queue, and Activity Log flows.

## 1. Goal

Keep inventory data consistent while making the operational flow easier to understand:

1. Products create and update stock rules correctly
2. Orders deduct stock and keep restock data in sync
3. Restock Queue tracks low inventory automatically
4. Restock actions increase stock, not overwrite it
5. Activity logs show the right data for the right role

## 2. Overall System Flow

The module interaction works like this:

1. Product is created or updated
2. If stock falls below the minimum threshold, the product is added to the Restock Queue
3. Manager or admin restocks the product from the queue
4. Restock increases the current stock quantity
5. If stock becomes greater than or equal to the threshold, the queue item is removed automatically
6. Orders deduct stock when created
7. Cancelled orders restore stock
8. Every stock movement resyncs the restock queue
9. Activity logs record all important actions

## 3. Product Flow

### Create Product

1. User creates a product with category, stock, and min stock threshold
2. Category must exist and must be active
3. Product is saved with `isActive = true`
4. If initial stock is below threshold, the product is added to the Restock Queue immediately

### Update Product

1. User can update name, category, stock, threshold, SKU, status, or active state
2. Category reassignment is blocked if the target category is banned
3. Stock and threshold changes trigger queue synchronization

### Restock Product

1. Restock increases existing stock instead of replacing it
2. New stock value is computed as `currentStock + restockQuantity`
3. Activity log stores previous stock, restock quantity, and new stock

## 4. Order Flow

### Create Order

1. Validate duplicate items and product availability
2. Ensure each product has enough stock
3. Create order and order items in one transaction
4. Deduct product stock immediately
5. Recalculate product status based on updated stock
6. Sync Restock Queue after stock deduction

### Cancel Order

1. Load the order and its items
2. Prevent cancelling an already cancelled order
3. Restore each product’s stock quantity
4. Recalculate product status after restoration
5. Sync Restock Queue again so queue state matches product stock

### Order Details

1. Single order detail response includes manager info
2. Response includes product details for each order item
3. Response includes timestamps and timeline data
4. Activity logs are used to build a history of order events

## 5. Restock Queue Flow

### Auto Add to Queue

1. Whenever product stock drops below `minStockThreshold`, the product enters Restock Queue
2. Queue item is marked as `OPEN`
3. Priority is calculated from how low the stock is

### Restock From Queue

1. Admin or manager can restock from queue
2. The restock quantity is added to the current product stock
3. If stock is still below threshold, queue item stays open and is updated
4. If stock reaches or exceeds threshold, the queue item is removed automatically

### Queue Listing

1. Restock Queue list defaults to open items
2. Admin and manager both can view the list
3. Filters allow status and priority lookup

## 6. Activity Log Flow

### Logging Rules

1. Product, order, category, and restock actions write activity logs
2. Logs store action, message, entity type, entity id, and optional metadata

### Visibility Rules

1. Admin can view all logs
2. Manager can view only their own logs
3. This is enforced at the service layer using the authenticated user context

### What Gets Logged

1. Product created, updated, deactivated, and stock updated
2. Order created, status updated, and cancelled
3. Restock queue added and removed events

## 7. Data Consistency Rules

1. Restock quantity must be additive
2. Product stock and queue state must always match
3. Queue removal happens automatically when stock is above threshold
4. Cancelled orders must return stock to the product
5. Any stock change must re-run queue synchronization

## 8. Role-Based Access Summary

1. Admin and manager can create and manage products
2. Admin and manager can create and update orders
3. Admin and manager can view Restock Queue
4. Admin and manager can restock from queue
5. Admin can view all activity logs
6. Manager can view only personal activity logs

## 9. Acceptance Criteria

The implementation is correct when all of these are true:

1. A product below threshold appears in Restock Queue automatically
2. Restocking increases stock instead of overwriting it
3. Queue item disappears when stock is back at or above threshold
4. Order creation and cancellation always keep stock in sync
5. Admin sees all activity logs
6. Manager sees only their own activity logs
7. All changes pass type check and build

## 10. Rollout Checklist

1. Apply schema and client updates if needed
2. Test product create/update/restock flows
3. Test order create/cancel flows
4. Test restock queue restock flow
5. Test activity log access as admin and manager
6. Confirm queue removal after restock above threshold
