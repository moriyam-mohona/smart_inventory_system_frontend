import type {
  Category,
  DraftOrderItemInput,
  DashboardSummary,
  Order,
  Product,
  ProductListItem,
  ProductStatus,
  StockStatus,
  ValidationIssue,
  ValidationResult,
} from "@/types/inventory";

const categories: Category[] = [
  {
    id: "67f0a39cf9f9b2a2503f1001",
    name: "Electronics",
    createdById: "67f0a39cf9f9b2a2503f2001",
    createdAt: "2026-03-10T09:00:00.000Z",
    updatedAt: "2026-03-20T09:00:00.000Z",
  },
  {
    id: "67f0a39cf9f9b2a2503f1002",
    name: "Office",
    createdById: "67f0a39cf9f9b2a2503f2002",
    createdAt: "2026-03-12T09:00:00.000Z",
    updatedAt: "2026-03-22T09:00:00.000Z",
  },
  {
    id: "67f0a39cf9f9b2a2503f1003",
    name: "Warehouse",
    createdById: "67f0a39cf9f9b2a2503f2001",
    createdAt: "2026-03-13T09:00:00.000Z",
    updatedAt: "2026-03-21T09:00:00.000Z",
  },
  {
    id: "67f0a39cf9f9b2a2503f1004",
    name: "Packaging",
    createdById: "67f0a39cf9f9b2a2503f2002",
    createdAt: "2026-03-15T09:00:00.000Z",
    updatedAt: "2026-03-28T09:00:00.000Z",
  },
];

const products: Product[] = [
  {
    id: "67f0a39cf9f9b2a2503f3001",
    name: "Wireless Mouse",
    sku: "ELEC-MOU-001",
    categoryId: "67f0a39cf9f9b2a2503f1001",
    price: 24.99,
    stockQuantity: 53,
    minStockThreshold: 12,
    status: "ACTIVE",
    isActive: true,
    createdById: "67f0a39cf9f9b2a2503f2001",
    createdAt: "2026-03-01T10:12:00.000Z",
    updatedAt: "2026-03-30T10:12:00.000Z",
  },
  {
    id: "67f0a39cf9f9b2a2503f3002",
    name: "Mechanical Keyboard",
    sku: "ELEC-KEY-002",
    categoryId: "67f0a39cf9f9b2a2503f1001",
    price: 89,
    stockQuantity: 8,
    minStockThreshold: 10,
    status: "ACTIVE",
    isActive: true,
    createdById: "67f0a39cf9f9b2a2503f2001",
    createdAt: "2026-03-03T06:45:00.000Z",
    updatedAt: "2026-03-31T06:45:00.000Z",
  },
  {
    id: "67f0a39cf9f9b2a2503f3003",
    name: "Premium Notebook",
    sku: "OFFI-NOT-010",
    categoryId: "67f0a39cf9f9b2a2503f1002",
    price: 5.5,
    stockQuantity: 116,
    minStockThreshold: 25,
    status: "ACTIVE",
    isActive: true,
    createdById: "67f0a39cf9f9b2a2503f2002",
    createdAt: "2026-03-05T14:20:00.000Z",
    updatedAt: "2026-03-29T14:20:00.000Z",
  },
  {
    id: "67f0a39cf9f9b2a2503f3004",
    name: "Shipping Scale",
    sku: "WARE-SCA-120",
    categoryId: "67f0a39cf9f9b2a2503f1003",
    price: 124,
    stockQuantity: 0,
    minStockThreshold: 4,
    status: "OUT_OF_STOCK",
    isActive: true,
    createdById: "67f0a39cf9f9b2a2503f2001",
    createdAt: "2026-03-05T01:00:00.000Z",
    updatedAt: "2026-03-31T01:00:00.000Z",
  },
  {
    id: "67f0a39cf9f9b2a2503f3005",
    name: "Packing Tape (6-pack)",
    sku: "PACK-TAP-030",
    categoryId: "67f0a39cf9f9b2a2503f1004",
    price: 14.5,
    stockQuantity: 34,
    minStockThreshold: 15,
    status: "ACTIVE",
    isActive: true,
    createdById: "67f0a39cf9f9b2a2503f2002",
    createdAt: "2026-03-06T11:00:00.000Z",
    updatedAt: "2026-03-28T11:00:00.000Z",
  },
];

const orders: Order[] = [
  {
    id: "67f0a39cf9f9b2a2503f4001",
    orderNumber: "ORD-20260331-001",
    customerName: "Northwind Stores",
    status: "PENDING",
    totalPrice: 207.94,
    createdById: "67f0a39cf9f9b2a2503f2002",
    cancelledAt: null,
    deliveredAt: null,
    createdAt: "2026-03-31T07:10:00.000Z",
    updatedAt: "2026-03-31T07:10:00.000Z",
    items: [
      {
        id: "67f0a39cf9f9b2a2503f5001",
        orderId: "67f0a39cf9f9b2a2503f4001",
        productId: "67f0a39cf9f9b2a2503f3001",
        quantity: 6,
        unitPrice: 24.99,
        lineTotal: 149.94,
        createdAt: "2026-03-31T07:10:00.000Z",
      },
      {
        id: "67f0a39cf9f9b2a2503f5002",
        orderId: "67f0a39cf9f9b2a2503f4001",
        productId: "67f0a39cf9f9b2a2503f3005",
        quantity: 4,
        unitPrice: 14.5,
        lineTotal: 58,
        createdAt: "2026-03-31T07:10:00.000Z",
      },
    ],
  },
  {
    id: "67f0a39cf9f9b2a2503f4002",
    orderNumber: "ORD-20260331-002",
    customerName: "Harborline Logistics",
    status: "CONFIRMED",
    totalPrice: 178,
    createdById: "67f0a39cf9f9b2a2503f2001",
    cancelledAt: null,
    deliveredAt: null,
    createdAt: "2026-03-31T06:30:00.000Z",
    updatedAt: "2026-03-31T06:45:00.000Z",
    items: [
      {
        id: "67f0a39cf9f9b2a2503f5003",
        orderId: "67f0a39cf9f9b2a2503f4002",
        productId: "67f0a39cf9f9b2a2503f3002",
        quantity: 2,
        unitPrice: 89,
        lineTotal: 178,
        createdAt: "2026-03-31T06:30:00.000Z",
      },
    ],
  },
  {
    id: "67f0a39cf9f9b2a2503f4003",
    orderNumber: "ORD-20260330-003",
    customerName: "Bluebird Retail",
    status: "SHIPPED",
    totalPrice: 110,
    createdById: "67f0a39cf9f9b2a2503f2002",
    cancelledAt: null,
    deliveredAt: null,
    createdAt: "2026-03-30T18:40:00.000Z",
    updatedAt: "2026-03-30T19:00:00.000Z",
    items: [
      {
        id: "67f0a39cf9f9b2a2503f5004",
        orderId: "67f0a39cf9f9b2a2503f4003",
        productId: "67f0a39cf9f9b2a2503f3003",
        quantity: 20,
        unitPrice: 5.5,
        lineTotal: 110,
        createdAt: "2026-03-30T18:40:00.000Z",
      },
    ],
  },
];

function deriveProductStatus(stockQuantity: number): ProductStatus {
  return stockQuantity <= 0 ? "OUT_OF_STOCK" : "ACTIVE";
}

function pause(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getStockStatus(
  stock: number,
  reorderLevel: number,
): StockStatus {
  if (stock <= 0) {
    return "out-of-stock";
  }

  if (stock <= reorderLevel) {
    return "low";
  }

  return "in-stock";
}

export async function getProducts(): Promise<Product[]> {
  await pause(180);
  return products.map((product) => ({
    ...product,
    status: deriveProductStatus(product.stockQuantity),
  }));
}

export async function getProductListItems(): Promise<ProductListItem[]> {
  const catalog = await getProducts();
  return catalog.map((product) => {
    const category = categories.find((item) => item.id === product.categoryId);
    return {
      ...product,
      categoryName: category?.name ?? "Uncategorized",
    };
  });
}

export async function getOrders(): Promise<Order[]> {
  await pause(220);
  return orders;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const allProducts = await getProducts();
  const allOrders = await getOrders();

  const lowStockProducts = allProducts.filter(
    (product) =>
      getStockStatus(product.stockQuantity, product.minStockThreshold) ===
      "low",
  ).length;

  const outOfStockProducts = allProducts.filter(
    (product) =>
      getStockStatus(product.stockQuantity, product.minStockThreshold) ===
      "out-of-stock",
  ).length;

  const todayRevenue = allOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0,
  );

  return {
    totalProducts: allProducts.length,
    lowStockProducts,
    outOfStockProducts,
    activeOrders: allOrders.filter((order) => order.status !== "DELIVERED")
      .length,
    todayRevenue,
  };
}

export function validateOrder(
  items: DraftOrderItemInput[],
  catalog: Product[],
): ValidationResult {
  const issues: ValidationIssue[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      issues.push({
        productId: item.productId,
        code: "INVALID_QUANTITY",
        message: "Quantity must be a positive whole number.",
      });
      continue;
    }

    const product = catalog.find(
      (candidate) => candidate.id === item.productId,
    );

    if (!product) {
      issues.push({
        productId: item.productId,
        code: "NOT_FOUND",
        message: "Product no longer exists in the catalog.",
      });
      continue;
    }

    if (product.stockQuantity <= 0) {
      issues.push({
        productId: item.productId,
        code: "OUT_OF_STOCK",
        message: `${product.name} is currently out of stock.`,
      });
      continue;
    }

    if (item.quantity > product.stockQuantity) {
      issues.push({
        productId: item.productId,
        code: "INSUFFICIENT_STOCK",
        message: `Requested ${item.quantity} units, but only ${product.stockQuantity} are available.`,
      });
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}
