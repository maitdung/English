import type {
  ApiUser,
  AuthResponse,
  ChangePasswordPayload,
  LoginCredentials,
  PasswordResetRequestResult,
  RegisterPayload,
  UpdateProfilePayload,
} from "../../features/auth/types/auth";
import { apiRequest } from "./api-client";

function splitFullName(fullName: string): {
  firstName: string | null;
  lastName: string | null;
} {
  const normalizedName = fullName.trim().replace(/\s+/g, " ");

  if (!normalizedName) {
    return {
      firstName: null,
      lastName: null,
    };
  }

  const nameParts = normalizedName.split(" ");

  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      lastName: null,
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

export function updateProfileRequest(
  payload: UpdateProfilePayload,
  accessToken: string,
): Promise<ApiUser> {
  const { firstName, lastName } = splitFullName(payload.fullName);

  return apiRequest<ApiUser>("/auth/me", {
    method: "PATCH",
    accessToken,
    body: {
      email: payload.email.trim().toLowerCase(),
      firstName,
      lastName,
      currentPassword: payload.currentPassword,
    },
  });
}

export function requestPasswordResetRequest(
  email: string,
): Promise<PasswordResetRequestResult> {
  return apiRequest<PasswordResetRequestResult>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: {
        email: email.trim().toLowerCase(),
      },
    },
  );
}

export function resetPasswordRequest(
  token: string,
  password: string,
): Promise<void> {
  return apiRequest<void>("/auth/reset-password", {
    method: "POST",
    body: {
      token: token.trim(),
      password,
    },
  });
}

export function changePasswordRequest(
  payload: ChangePasswordPayload,
  accessToken: string,
): Promise<void> {
  return apiRequest<void>("/auth/change-password", {
    method: "POST",
    accessToken,
    body: payload,
  });
}
