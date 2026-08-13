import type { UserRole, UserStatus } from "../../features/auth/types/auth";
import type {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  AdminUser,
} from "../../features/admin/types/admin";
import { apiRequest } from "./api-client";
import { getStoredAccessToken } from "./session";

export function getAdminUsersRequest(): Promise<AdminUser[]> {
  return apiRequest<AdminUser[]>("/users", {
    method: "GET",
    accessToken: getStoredAccessToken(),
  });
}

export function createAdminUserRequest(
  payload: AdminCreateUserPayload,
): Promise<AdminUser> {
  return apiRequest<AdminUser>("/users", {
    method: "POST",
    accessToken: getStoredAccessToken(),
    body: {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    },
  });
}

export function updateAdminUserRoleRequest(
  userId: string,
  role: UserRole,
): Promise<AdminUser> {
  return updateAdminUserRequest(userId, { role });
}

export function updateAdminUserStatusRequest(
  userId: string,
  status: UserStatus,
): Promise<AdminUser> {
  return updateAdminUserRequest(userId, { status });
}

export function updateAdminUserRequest(
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<AdminUser> {
  return apiRequest<AdminUser>(`/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    accessToken: getStoredAccessToken(),
    body: payload,
  });
}

export function deleteAdminUserRequest(userId: string): Promise<void> {
  return apiRequest<void>(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    accessToken: getStoredAccessToken(),
  });
}
