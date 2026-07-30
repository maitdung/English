import type {
  ApiUser,
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
} from "../../features/auth/types/auth";
import { apiRequest } from "./api-client";

function splitFullName(fullName: string): {
  firstName?: string;
  lastName?: string;
} {
  const normalizedName = fullName.trim().replace(/\s+/g, " ");

  if (!normalizedName) {
    return {};
  }

  const nameParts = normalizedName.split(" ");

  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
    };
  }

  return {
    lastName: nameParts[0],
    firstName: nameParts.slice(1).join(" "),
  };
}

export function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    },
  });
}

export function registerRequest(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { firstName, lastName } = splitFullName(payload.fullName);

  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      firstName,
      lastName,
    },
  });
}

export function getCurrentUserRequest(
  accessToken: string,
): Promise<ApiUser> {
  return apiRequest<ApiUser>("/auth/me", {
    method: "GET",
    accessToken,
  });
}

export function refreshTokensRequest(
  refreshToken: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}> {
  return apiRequest("/auth/refresh", {
    method: "POST",
    body: {
      refreshToken,
    },
  });
}

export function logoutRequest(
  accessToken: string,
): Promise<void> {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
    accessToken,
  });
}