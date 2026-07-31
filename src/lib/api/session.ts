import { ApiError } from "./api-client";

const SESSION_STORAGE_KEY = "mtd-lingo-auth-session";

type StoredAuthSession = {
  accessToken?: unknown;
};

export function getStoredAccessToken(): string {
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
      "Không tìm thấy phiên đăng nhập hợp lệ. Vui lòng đăng nhập lại.",
      401,
      null,
    );
  }
}
