import type { UserRole, UserStatus } from "../../auth/types/auth";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminRoleFilter = UserRole | "ALL";

export type AdminStatusFilter = UserStatus | "ALL";

export type AdminUserSort = "NEWEST" | "LAST_ACTIVE" | "NAME_ASC";

export type AdminMetricTone = "cyan" | "emerald" | "violet" | "amber";

export type AdminCreateUserPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: UserRole;
};

export type AdminUpdateUserPayload = Partial<AdminCreateUserPayload> & {
  status?: UserStatus;
};
