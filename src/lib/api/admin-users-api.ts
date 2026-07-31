import type { UserRole, UserStatus } from "../../features/auth/types/auth";
import type {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  AdminUser,
} from "../../features/admin/types/admin";
import { ApiError, apiRequest } from "./api-client";

const SESSION_STORAGE_KEY = "mtd-lingo-auth-session";

type StoredAuthSession = {
  accessToken?: unknown;
};

function getStoredAccessToken(): string {
  try {
    const storedSession =
      window.sessionStorage.getItem(SESSION_STORAGE_KEY) ??
      window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) {
      throw new Error("Missing session");
    }

    const session = JSON.parse(storedSession) as StoredAuthSession;

    if (typeof session.accessToken !== "string" || !session.accessToken) {
      throw new Error("Missing access token");
    }

    return session.accessToken;
  } catch {
    throw new ApiError(
      "Không tìm thấy phiên quản trị hợp lệ. Vui lòng đăng nhập lại.",
      401,
      null,
    );
  }
}

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
