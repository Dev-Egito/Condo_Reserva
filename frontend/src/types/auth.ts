export type Role = "ADMIN" | "RESIDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  user: User;
  token: string;
}
