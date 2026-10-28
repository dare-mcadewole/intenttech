import type { AccountRole } from './enums.js';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SessionResponse {
  id: string;
  email: string;
  role: AccountRole;
}

export interface RegisterAccountRequest {
  email: string;
  password: string;
  role: AccountRole;
}
