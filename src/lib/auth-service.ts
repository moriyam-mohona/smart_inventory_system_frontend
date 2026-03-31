import type {
  AuthResult,
  DemoCredentials,
  LoginFormInput,
  SignupFormInput,
} from "@/types/auth";

const DEMO_CREDENTIALS: DemoCredentials = {
  email: "manager@smartinventory.dev",
  password: "Demo@1234",
};

function pause(ms = 260) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDemoCredentials(): DemoCredentials {
  return DEMO_CREDENTIALS;
}

export async function loginWithEmail(
  credentials: LoginFormInput,
): Promise<AuthResult> {
  await pause();

  const email = credentials.email.trim().toLowerCase();
  const password = credentials.password;

  if (!email || !password) {
    return {
      ok: false,
      message: "Email and password are required.",
    };
  }

  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return {
      ok: true,
      message: "Welcome back. Redirecting to dashboard...",
      session: {
        userId: "67f0a39cf9f9b2a2503f2002",
        name: "Demo Manager",
        email: DEMO_CREDENTIALS.email,
        role: "MANAGER",
      },
    };
  }

  return {
    ok: false,
    message: "Invalid credentials. Use Demo Login or check your details.",
  };
}

export async function signupWithEmail(
  payload: SignupFormInput,
): Promise<AuthResult> {
  await pause(320);

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

  return {
    ok: true,
    message: "Account created. Redirecting to dashboard...",
    session: {
      userId: "67f0a39cf9f9b2a2503f2999",
      name,
      email,
      role: payload.role,
    },
  };
}
