export type ObjectId = string;

export type UserRole = "ADMIN" | "MANAGER";

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type RestockPriority = "HIGH" | "MEDIUM" | "LOW";

export type RestockQueueStatus = "OPEN" | "CLOSED";

export type ActivityAction =
  | "USER_SIGNUP"
  | "USER_LOGIN"
  | "CATEGORY_CREATED"
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_STATUS_CHANGED"
  | "ORDER_CREATED"
  | "ORDER_STATUS_UPDATED"
  | "ORDER_CANCELLED"
  | "STOCK_UPDATED"
  | "RESTOCK_QUEUE_ADDED"
  | "RESTOCK_QUEUE_REMOVED";

export interface User {
  id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: ObjectId;
  name: string;
  createdById: ObjectId | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: ObjectId;
  name: string;
  sku: string | null;
  categoryId: ObjectId;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
  status: ProductStatus;
  isActive: boolean;
  createdById: ObjectId | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem extends Product {
  categoryName: string;
}

export interface OrderItem {
  id: ObjectId;
  orderId: ObjectId;
  productId: ObjectId;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
}

export interface Order {
  id: ObjectId;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
  createdById: ObjectId | null;
  cancelledAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface RestockQueue {
  id: ObjectId;
  productId: ObjectId;
  currentStock: number;
  minStockThreshold: number;
  priority: RestockPriority;
  status: RestockQueueStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface ActivityLog {
  id: ObjectId;
  action: ActivityAction;
  message: string;
  entityType: string;
  entityId: string | null;
  userId: ObjectId | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export type StockStatus = "in-stock" | "low" | "out-of-stock";

export interface DashboardSummary {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  activeOrders: number;
  todayRevenue: number;
}

export interface DraftOrderItemInput {
  productId: ObjectId;
  quantity: number;
}

export interface ValidationIssue {
  productId: string;
  code:
    | "NOT_FOUND"
    | "OUT_OF_STOCK"
    | "INSUFFICIENT_STOCK"
    | "INVALID_QUANTITY";
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
}
