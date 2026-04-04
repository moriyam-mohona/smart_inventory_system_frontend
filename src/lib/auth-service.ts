import type {
  AuthResult,
  DemoCredentials,
  LoginFormInput,
  SignupFormInput,
} from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const DEMO_CREDENTIALS: DemoCredentials = {
  manager: {
    email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@inventory.com",
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo@12345",
  },
  admin: {
    email: "demo.admin@inventory.com",
    password: "Admin@12345",
  },
};

type ApiErrorResponse = {
  message?: string;
  errorMessages?: Array<{ message?: string }>;
};

export type AdminManagedUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  [key: string]: unknown;
};

export type ManagerFullDetails = {
  profile?: Record<string, unknown>;
  categories?: Array<Record<string, unknown>>;
  products?: Array<Record<string, unknown>>;
  orders?: Array<Record<string, unknown>>;
  orderItems?: Array<Record<string, unknown>>;
  activityLogs?: Array<Record<string, unknown>>;
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ManagerCategory = {
  id: string;
  name: string;
  isActive?: boolean;
  _count?: { products: number };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type CreateManagerProductPayload = {
  name: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
  sku?: string;
};

export type UpdateManagerProductPayload = Partial<CreateManagerProductPayload> & {
  status?: string;
  isActive?: boolean;
};

export type ManagerProduct = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
  status: string;
  isActive: boolean;
  categoryId: string;
  category?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};

function extractApiErrorMessage(
  data: ApiErrorResponse,
  fallback: string,
): string {
  const detailedMessage = data?.errorMessages?.find(
    (item) => item?.message,
  )?.message;

  if (detailedMessage) {
    return detailedMessage;
  }

  return data?.message || fallback;
}

function pause(ms = 260) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseApiResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      extractApiErrorMessage(
        data as ApiErrorResponse,
        "Request failed. Please try again.",
      ),
    );
  }
  return data;
}

async function requestWithFallback(
  endpoints: string[],
  init: RequestInit,
): Promise<Response> {
  let lastResponse: Response | null = null;

  for (const endpoint of endpoints) {
    const response = await fetch(`${API_URL}${endpoint}`, init);
    lastResponse = response;

    if (response.status !== 404) {
      return response;
    }
  }

  return (
    lastResponse ??
    new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  );
}

function authHeaders(accessToken: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export function getDemoCredentials(): DemoCredentials {
  return DEMO_CREDENTIALS;
}

export async function loginWithEmail(
  credentials: LoginFormInput,
): Promise<AuthResult> {
  try {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      return {
        ok: false,
        message: "Email and password are required.",
      };
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: extractApiErrorMessage(
          data,
          "Login failed. Please check your credentials.",
        ),
      };
    }

    // console.log(data);

    return {
      ok: true,
      message: "Welcome back. Redirecting to dashboard...",
      session: {
        id: data?.data?.user?.id,
        name: data?.data?.user?.name,
        email: data?.data?.user?.email,
        role: data?.data?.user?.role,
      },
      accessToken: data?.data?.accessToken,
      refreshToken: data?.data?.refreshToken,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export async function signupWithEmail(
  payload: SignupFormInput,
): Promise<AuthResult> {
  try {
    const name = payload.name.trim();
    const email = payload.email.trim().toLowerCase();

    if (name.length < 2) {
      return {
        ok: false,
        message: "Name must be at least 2 characters.",
      };
    }

    if (!email.includes("@")) {
      return {
        ok: false,
        message: "Enter a valid email address.",
      };
    }

    if (payload.password.length < 8) {
      return {
        ok: false,
        message: "Password must be at least 8 characters.",
      };
    }

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password: payload.password,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: extractApiErrorMessage(
          data,
          "Signup failed. Please try again.",
        ),
      };
    }

    return {
      ok: true,
      message:
        "Account created successfully. Please verify your OTP sent to email.",
      email,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export async function verifyOtp(
  email: string,
  otp: string,
  type: "signup" | "reset",
): Promise<{ ok: boolean; message: string; resetToken?: string }> {
  try {
    await pause();

    if (otp.length !== 6) {
      return { ok: false, message: "Invalid OTP format. Must be 6 digits." };
    }

    const endpoint =
      type === "signup"
        ? "/auth/verify-otp"
        : "/auth/verify-forgot-password-otp";

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: extractApiErrorMessage(data, "OTP verification failed."),
      };
    }

    if (type === "signup") {
      return {
        ok: true,
        message: "Verification complete. Request sent to Admin for approval.",
      };
    } else {
      return {
        ok: true,
        message: "Verification complete. Valid token generated.",
        resetToken: data.data.resetToken,
      };
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export async function requestPasswordReset(
  email: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    if (!email.includes("@")) {
      return { ok: false, message: "Enter a valid email address." };
    }

    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: extractApiErrorMessage(
          data,
          "Failed to request password reset.",
        ),
      };
    }

    return {
      ok: true,
      message: "If the email is registered, an OTP has been sent.",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export async function resetPassword(
  email: string,
  newPassword: string,
  resetToken: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    if (newPassword.length < 8) {
      return { ok: false, message: "Password must be at least 8 characters." };
    }

    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, resetToken, newPassword }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: extractApiErrorMessage(data, "Failed to reset password."),
      };
    }

    return {
      ok: true,
      message: "Password updated successfully! Redirecting to login...",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      ok: false,
      message: "Network error. Please check your connection and try again.",
    };
  }
}

export async function getAllUsersAdmin(
  accessToken: string,
): Promise<AdminManagedUser[]> {
  const response = await fetch(`${API_URL}/auth`, {
    method: "GET",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  const data = await parseApiResponse(response);

  console.log(data);
  const payload = (data as { data?: unknown }).data;

  if (Array.isArray(payload)) {
    return payload as AdminManagedUser[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { users?: unknown[] }).users)
  ) {
    return (payload as { users: AdminManagedUser[] }).users;
  }

  return [];
}

export async function createManagerAccount(
  accessToken: string,
  payload: { name: string; email: string; password: string },
): Promise<AdminManagedUser> {
  const response = await fetch(`${API_URL}/auth/manager`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await parseApiResponse(response);
  const created = (data as { data?: unknown }).data;
  return (created ?? {}) as AdminManagedUser;
}

export async function approveUserByAdmin(
  accessToken: string,
  userId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/auth/approve/${userId}`, {
    method: "POST",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  await parseApiResponse(response);
}

export async function restrictUserByAdmin(
  accessToken: string,
  userId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/auth/${userId}/restrict`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  await parseApiResponse(response);
}

export async function deleteUserByAdmin(
  accessToken: string,
  userId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/auth/${userId}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  await parseApiResponse(response);
}

export async function getManagerDetailsByAdmin(
  accessToken: string,
  managerId: string,
): Promise<ManagerFullDetails> {
  const response = await fetch(`${API_URL}/auth/manager/${managerId}/details`, {
    method: "GET",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  const data = await parseApiResponse(response);
  return ((data as { data?: unknown }).data ?? {}) as ManagerFullDetails;
}

function normalizeCategory(item: Record<string, unknown>): ManagerCategory {
  const rawId =
    typeof item.id === "string"
      ? item.id
      : typeof item._id === "string"
        ? item._id
        : "";

  return {
    ...item,
    id: rawId,
    name: typeof item.name === "string" ? item.name : "Unnamed Category",
    isActive: typeof item.isActive === "boolean" ? item.isActive : true,
    _count: typeof item._count === "object" && item._count !== null ? (item._count as { products: number }) : undefined,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : undefined,
  };
}

export async function getCategoriesByManager(
  accessToken: string,
  includeBanned: boolean = false,
): Promise<ManagerCategory[]> {
  const url = includeBanned ? `${API_URL}/categories?includeBanned=true` : `${API_URL}/categories`;
  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  const data = await parseApiResponse(response);
  const payload = (data as { data?: unknown }).data;

  if (Array.isArray(payload)) {
    return payload
      .filter((item): item is Record<string, unknown> => !!item)
      .map(normalizeCategory)
      .filter((item) => item.id);
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { categories?: unknown[] }).categories)
  ) {
    return (payload as { categories: unknown[] }).categories
      .filter((item): item is Record<string, unknown> => !!item)
      .map(normalizeCategory)
      .filter((item) => item.id);
  }

  return [];
}

export async function createCategoryByManager(
  accessToken: string,
  payload: { name: string },
): Promise<ManagerCategory> {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await parseApiResponse(response);
  const category = ((data as { data?: unknown }).data ?? {}) as Record<
    string,
    unknown
  >;
  return normalizeCategory(category);
}

export async function updateCategoryByManager(
  accessToken: string,
  categoryId: string,
  payload: { name: string },
): Promise<ManagerCategory> {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await parseApiResponse(response);
  const category = ((data as { data?: unknown }).data ?? {}) as Record<
    string,
    unknown
  >;
  return normalizeCategory(category);
}

export async function deleteCategoryByManager(
  accessToken: string,
  categoryId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  await parseApiResponse(response);
}

export type CategoryDetails = ManagerCategory & {
  createdBy?: { id: string, name: string, email: string, role: string };
  summary?: { totalProducts: number, activeProducts: number, outOfStockProducts: number };
  productCount?: number;
  totalStock?: number;
  totalValue?: number;
  [key: string]: unknown;
};

export async function getCategoryDetails(
  accessToken: string,
  categoryId: string,
): Promise<CategoryDetails> {
  const response = await fetch(`${API_URL}/categories/${categoryId}/details`, {
    method: "GET",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  const data = await parseApiResponse(response);
  const payload = ((data as { data?: unknown }).data ?? {}) as Record<string, unknown>;
  
  return {
    ...normalizeCategory(payload),
    createdBy: payload.createdBy as CategoryDetails['createdBy'],
    summary: payload.summary as CategoryDetails['summary'],
    productCount: typeof payload.summary === 'object' && payload.summary ? (payload.summary as any).totalProducts : undefined,
    totalStock: typeof payload.totalStock === 'number' ? payload.totalStock : undefined,
    totalValue: typeof payload.totalValue === 'number' ? payload.totalValue : undefined,
  };
}

export async function banCategoryByAdmin(
  accessToken: string,
  categoryId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${categoryId}/ban`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    credentials: "include",
  });

  await parseApiResponse(response);
}

export async function createProductByManager(
  accessToken: string,
  payload: CreateManagerProductPayload,
): Promise<void> {
  const response = await requestWithFallback(["/products", "/product"], {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
    credentials: "include",
  });

  await parseApiResponse(response);
}

export async function getProductsList(accessToken: string, searchTerm?: string): Promise<ManagerProduct[]> {
  const url = new URL(`${API_URL}/products`);
  if (searchTerm) {
    url.searchParams.append("searchTerm", searchTerm);
  }
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: authHeaders(accessToken),
    credentials: "include",
  });
  const data = await parseApiResponse(response);
  const payloadData = (data as { data?: unknown }).data;
  const items = (Array.isArray(payloadData) ? payloadData : []) as ManagerProduct[];
  
  return items.map(item => ({
    ...item,
    id: item.id || (item as any)._id,
  }));
}

export async function updateProductByManager(
  accessToken: string,
  productId: string,
  payload: UpdateManagerProductPayload,
): Promise<void> {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify(payload),
    credentials: "include",
  });
  await parseApiResponse(response);
}

export async function getProductDetails(accessToken: string, productId: string): Promise<ManagerProduct> {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "GET",
    headers: authHeaders(accessToken),
    credentials: "include",
  });
  const data = await parseApiResponse(response);
  const item = (data as any).data;
  return {
    ...item,
    id: item.id || item._id,
  } as ManagerProduct;
}

export async function deactivateProductByAdmin(
  accessToken: string,
  productId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/products/${productId}/deactivate`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    credentials: "include",
  });
  await parseApiResponse(response);
}
