const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3001/api";

type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  readonly status: number;
  readonly payload: ApiErrorPayload | null;

  constructor(
    message: string,
    status: number,
    payload: ApiErrorPayload | null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getErrorMessage(
  payload: ApiErrorPayload | null,
  fallbackMessage: string,
): string {
  if (!payload) {
    return fallbackMessage;
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(" ");
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (typeof payload.error === "string") {
    return payload.error;
  }

  return fallbackMessage;
}

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    accessToken,
    headers: customHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(customHeaders);

  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...requestOptions,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Không thể kết nối tới máy chủ. Hãy kiểm tra backend đang chạy.",
      0,
      null,
    );
  }

  const contentType = response.headers.get("content-type");
  const hasJsonBody = contentType?.includes("application/json");

  let responsePayload: unknown = null;

  if (response.status !== 204) {
    responsePayload = hasJsonBody
      ? await response.json()
      : await response.text();
  }

  if (!response.ok) {
    const errorPayload =
      typeof responsePayload === "object" &&
      responsePayload !== null
        ? (responsePayload as ApiErrorPayload)
        : null;

    throw new ApiError(
      getErrorMessage(
        errorPayload,
        `Yêu cầu thất bại với mã ${response.status}.`,
      ),
      response.status,
      errorPayload,
    );
  }

  return responsePayload as T;
}