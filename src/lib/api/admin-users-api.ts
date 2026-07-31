import type { UserRole } from "../../features/auth/types/auth";
import type { AdminUser } from "../../features/admin/types/admin";
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

    if (
      typeof session.accessToken !== "string" ||
      !session.accessToken
    ) {
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

export function updateAdminUserRoleRequest(
  userId: string,
  role: UserRole,
): Promise<AdminUser> {
  return apiRequest<AdminUser>(
    `/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      accessToken: getStoredAccessToken(),
      body: {
        role,
      },
    },
  );
}
