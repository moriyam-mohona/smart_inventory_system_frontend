import type {
  AuthResult,
  DemoCredentials,
  LoginFormInput,
  SignupFormInput,
} from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const DEMO_CREDENTIALS: DemoCredentials = {
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@inventory.com",
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo@12345",
};

type ApiErrorResponse = {
  message?: string;
  errorMessages?: Array<{ message?: string }>;
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
