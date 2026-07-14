export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  status: "active" | "inactive" | "suspended";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: string[];
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  domain?: string;
  logoUrl?: string;
  timezone: string;
  currency: string;
  language: string;
  plan: string;
  settings: Record<string, any>;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser extends User {
  roles: string[];
  tenant: Tenant;
}
