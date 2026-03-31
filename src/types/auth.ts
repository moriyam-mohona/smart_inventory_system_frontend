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
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  ok: boolean;
  message: string;
  session?: AuthSession;
}

export interface DemoCredentials {
  email: string;
  password: string;
}
