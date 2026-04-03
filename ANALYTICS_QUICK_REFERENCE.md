# Analytics APIs - Quick Reference Guide

## 🎯 Comparison: Admin vs Manager Analytics

### Admin Dashboard (`GET /api/v1/analytics/admin/dashboard`)

**What Admin Sees**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ANALYTICS & REPORTS                             │
│              Real-time business insights and performance metrics      │
├─────────────────────────────────────────────────────────────────────┤
│ TOTAL ORDERS       │ PENDING ORDERS    │ COMPLETED ORDERS │ REVENUE │
│ 45 (This Month)    │ 12 (Awaiting)     │ 28 (Shipped)     │ $15750  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ STOCK LIFECYCLE                  │ FULFILLMENT STATUS               │
├──────────────────────────────────┼──────────────────────────────────┤
│ • Total Products: 52 (ACTIVE)    │ • Pending Auth: 8               │
│ • Active: 50                     │ • Processing: 34                │
│ • Out of Stock: 2                │ • Completed: 82 (FULFILLED)     │
│ • Low Stock Warnings: 7          │ • Cancellation Rate: 2.36%      │
└──────────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ REVENUE ANALYTICS                │ RESTOCK ANALYTICS               │
├──────────────────────────────────┼─────────────────────────────────┤
│ • This Month: $15,750.50         │ • Queue Items: 7               │
│ • Today: $450.00                 │ • High Priority: 2              │
│ • Avg Daily: $787.53             │ • Restocked (Month): 12         │
│ • Top Products: [list]           │ • Avg Time: 48 hours           │
│ • By Category: [breakdown]       │ • Trend: [chart]               │
└──────────────────────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PRODUCT PERFORMANCE (Top Sellers)                                    │
├─────────────────────────────────────────────────────────────────────┤
│ • Wireless Mouse: 85 units, 188.89% turnover, $2,125 revenue       │
│ • USB-C Cable: 62 units, 155.00% turnover, $1,550 revenue          │
│ • [More products...]                                                 │
└─────────────────────────────────────────────────────────────────────┘

Query Parameter: ?period=month (today|week|month|year)
```

---

### Manager Dashboard (`GET /api/v1/analytics/manager/dashboard`)

**What Manager Sees**:

```
┌─────────────────────────────────────────────────────────────────────┐
│ TODAY'S ORDERS │ PENDING ORDERS │ COMPLETED ORDERS │ LOW STOCK ITEMS
│ 5 orders       │ 3 awaiting     │ 2 delivered      │ 2 need restock
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         REVENUE TODAY                                │
│                          $450.00                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [View Inventory] │ [Manage Orders] │ [Create Order]                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ TODAY'S METRICS                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Orders Created: 5  │ Confirmed: 3 │ Shipped: 2 │ Delivered: 1      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ ORDER OVERVIEW                                                       │
├─────────────────────────────────────────────────────────────────────┤
│ Awaiting Confirmation: 8  │ Awaiting Shipment: 14                  │
│ Awaiting Delivery: 20     │ Delivered: 82                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ LOW STOCK ITEMS                                                      │
├──────────────────────────┬──────────────┬──────────────┬───────────┤
│ Product                  │ Current      │ Min Stock    │ Status    │
├──────────────────────────┼──────────────┼──────────────┼───────────┤
│ USB-C Cable              │ 5            │ 15           │ LOW_STOCK │
│ Laptop Stand             │ 3            │ 10           │ LOW_STOCK │
└──────────────────────────┴──────────────┴──────────────┴───────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ RECENT ACTIVITIES                                                    │
├──────────────────────────────────────────────────────────────────────┤
│ • ORDER_CREATED - Order #456 - 14:30 - $450.00                      │
│ • PRODUCT_RESTOCKED - Laptop Mouse - 13:15 - +20 units             │
│ • ORDER_DELIVERED - Order #445 - 12:00 - $320.00                   │
│ [More activities...]                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Metric Comparison Matrix

| Metric                      | Admin Dashboard                  | Manager Dashboard      |
| --------------------------- | -------------------------------- | ---------------------- |
| **Time Period**             | Flexible (today/week/month/year) | Fixed (today only)     |
| **Order Status Breakdown**  | ✅ Full breakdown                | ✅ Current status only |
| **Revenue Analytics**       | ✅ Full trend, by category       | ✅ Daily total only    |
| **Product Performance**     | ✅ Sales velocity, turnover      | ❌ Not visible         |
| **Restock Trends**          | ✅ Historical trends             | ❌ Not visible         |
| **Month-over-Month Growth** | ✅ Percentage change             | ❌ Not visible         |
| **Customer Count**          | ✅ Total unique customers        | ❌ Not visible         |
| **Top Products**            | ✅ Ranked by revenue             | ❌ Not visible         |
| **Low Stock Alerts**        | ✅ Full context                  | ✅ Limited to top 20   |
| **Recent Activities**       | ❌ Not available                 | ✅ Own actions only    |
| **Cancellation Rate**       | ✅ System-wide                   | ❌ Not visible         |
| **Average Order Value**     | ✅ All time, monthly             | ✅ Today's average     |

---

## 🔄 Data Refresh Frequency

### Recommended Caching Strategy

| Dashboard         | Frequency         | Rationale                                       |
| ----------------- | ----------------- | ----------------------------------------------- |
| Admin Dashboard   | Every 5 minutes   | Admins check frequently for strategic decisions |
| Manager Dashboard | Every 1-2 minutes | Managers need real-time operational data        |

### API Response Times

```
Admin Dashboard (Full aggregation)
├── 7 parallel queries
├── Multiple aggregations
└── Expected: 2-3 seconds

Manager Dashboard (Focused queries)
├── 6 parallel queries
├── Limited aggregations
└── Expected: 1-2 seconds
```

---

## 🛠️ Implementation Code Examples

### cURL Examples

#### Admin Dashboard - Monthly View

```bash
curl -X GET "http://localhost:5000/api/v1/analytics/admin/dashboard?period=month" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

#### Admin Dashboard - Weekly View

```bash
curl -X GET "http://localhost:5000/api/v1/analytics/admin/dashboard?period=week" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

#### manager Dashboard

```bash
curl -X GET "http://localhost:5000/api/v1/analytics/manager/dashboard" \
  -H "Authorization: Bearer YOUR_MANAGER_TOKEN" \
  -H "Content-Type: application/json"
```

### JavaScript/TypeScript Examples

#### Fetch Admin Analytics

```typescript
async function getAdminAnalytics(period: "month" | "week" | "today" | "year") {
  const response = await fetch(
    `/api/v1/analytics/admin/dashboard?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch analytics");
  return await response.json();
}

const adminData = await getAdminAnalytics("month");
console.log(adminData.data.summary);
```

#### Fetch Manager Analytics

```typescript
async function getManagerAnalytics() {
  const response = await fetch("/api/v1/analytics/manager/dashboard", {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch analytics");
  return await response.json();
}

const managerData = await getManagerAnalytics();
console.log(managerData.data.summary.totalOrdersToday);
```

---

## 🔐 Authentication & Authorization

### Admin Role Requirements

- Must have `role: "ADMIN"` in JWT token
- Automatic through `auth("ADMIN")` middleware
- Full access to all metrics

### Manager Role Requirements

- Must have `role: "MANAGER"` or `role: "ADMIN"` in JWT token
- Can access own dashboard only
- Limited to daily metrics

### Error Responses

#### Unauthorized (Missing Token)

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Unauthorized - No token provided"
}
```

#### Forbidden (Wrong Role)

```json
{
  "statusCode": 403,
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

---

## 📈 Metric Formulas

### Revenue Calculations

```
Total Revenue This Month = SUM(order.totalPrice)
                          WHERE status="DELIVERED"
                          AND createdAt >= startOfMonth

Month Over Month Growth = ((currentMonth - previousMonth) / previousMonth) * 100

Average Daily Revenue = Total Revenue / Number of Days in Period

Average Order Value = Total Revenue / Total Orders
```

### Stock Calculations

```
Low Stock Status = stockQuantity < minStockThreshold

Stock Status = "OUT_OF_STOCK" if stockQuantity = 0
             = "LOW_STOCK" if stockQuantity < minStockThreshold
             = "OK" otherwise

Turnover Rate = (Units Sold This Month / Current Stock) * 100
```

### Order Calculations

```
Total Orders = COUNT(orders) with all statuses

Orders by Status = COUNT(orders) WHERE status = [specific status]

Fulfillment Rate = DELIVERED Orders / Total Orders * 100

Cancellation Rate = CANCELLED Orders / Total Orders * 100
```

### Restock Calculations

```
Items in Queue = COUNT(restockQueue.items) WHERE status="OPEN"

High Priority = COUNT(restockQueue.items) WHERE status="OPEN" AND priority="HIGH"

Average Restock Time = AVG(updatedAt - createdAt) for CLOSED items
```

---

## 🧪 Testing Scenarios

### Scenario 1: Admin Checking Monthly Performance

**User**: Admin1  
**Action**: Navigate to admin analytics dashboard with period=month  
**Expected**:

- Summary shows month totals
- Revenue growth percentage calculated
- Top 5 products displayed
- All categories represented

### Scenario 2: Manager Starting Shift

**User**: Manager1  
**Action**: Open manager dashboard at 8 AM  
**Expected**:

- Today's orders: 0
- Today's revenue: $0
- Pending orders: X from yesterday
- Low stock items: Y

### Scenario 3: Manager After First Order

**User**: Manager1  
**Action**: Create first order of the day ($100)  
**Expected** (Refresh dashboard):

- Today's orders: 1
- Today's revenue: $100\*
- Low stock alerts updated

\*If order status is DELIVERED

### Scenario 4: Authorization Failure

**User**: Manager1  
**Action**: Try to access `/api/v1/analytics/admin/dashboard`  
**Expected**:

- Status: 403 Forbidden
- Message: "You do not have permission..."

---

## 📋 Deployment Instructions

### 1. Pre-deployment Checklist

```bash
# Verify build
npm run build

# Check for TypeScript errors (should be empty)
npm run build 2>&1 | grep "error"

# Test the endpoints (after deployment)
curl http://localhost:5000/api/v1/analytics/admin/dashboard \
  -H "Authorization: Bearer <valid_token>"
```

### 2. Database Indexes (Recommended)

```sql
-- Add these MongoDB indexes for optimal performance
db.orders.createIndex({ "createdAt": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "userId": 1 })
db.orderitems.createIndex({ "productId": 1 })
db.activitylogs.createIndex({ "userId": 1 })
db.activitylogs.createIndex({ "createdAt": 1 })
db.activitylogs.createIndex({ "action": 1 })
```

### 3. Environment Configuration

```env
# No additional environment variables needed
# Uses existing database connection and auth setup
```

### 4. Monitoring

- Track response times for both endpoints
- Monitor database query performance
- Set alerts for long-running queries (> 5 seconds)
- Log analytics requests for audit trail

---

## 🎓 Documentation Links

- Full Implementation Report: `ANALYTICS_IMPLEMENTATION_REPORT.md`
- API Testing Guide: `API_TESTING_GUIDE.md`
- Authentication Details: `USER_AUTH_DOCUMENTATION.md`
- Product Implementation Plan: `PRODUCT_IMPLEMENTATION_PLAN.md`
- Order Implementation Plan: `ORDER_IMPLEMENTATION_PLAN.md`

---

**Last Updated**: April 3, 2026  
**Status**: ✅ Production Ready
