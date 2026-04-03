import type { UserRole } from "@/types/inventory";

export interface LoginFormInput {
  email: string;
  password: string;
}

export interface SignupFormInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  ok: boolean;
  message: string;
  session?: AuthSession;
  accessToken?: string;
  refreshToken?: string;
  resetToken?: string;
  email?: string;
}

export interface DemoCredentials {
  email: string;
  password: string;
}
