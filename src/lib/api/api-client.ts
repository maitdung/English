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
  networkRetryCount?: number;
  networkRetryStatusCodes?: readonly number[];
};

const NETWORK_RETRY_DELAY_MS = 1_500;
const MAX_NETWORK_RETRY_DELAY_MS = 12_000;
const MAX_NETWORK_RETRY_COUNT = 6;

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function createNetworkError(): ApiError {
  return new ApiError(
    "Kết nối tới máy chủ bị gián đoạn. Máy chủ có thể đang khởi động hoặc mạng chưa ổn định; vui lòng đợi một chút rồi thử lại.",
    0,
    null,
  );
}

async function fetchWithNetworkRetry(
  url: string,
  init: RequestInit,
  retryCount: number,
  retryStatusCodes: readonly number[],
): Promise<Response> {
  const normalizedRetryCount = Number.isFinite(retryCount)
    ? Math.min(MAX_NETWORK_RETRY_COUNT, Math.max(0, Math.floor(retryCount)))
    : 0;

  for (let attempt = 0; ; attempt += 1) {
    try {
      const response = await fetch(url, init);

      if (
        attempt >= normalizedRetryCount ||
        !retryStatusCodes.includes(response.status)
      ) {
        return response;
      }

      try {
        await response.body?.cancel();
      } catch {
        // Việc đóng body lỗi không được ngăn lần thử health tiếp theo.
      }
    } catch {
      if (attempt >= normalizedRetryCount || init.signal?.aborted) {
        throw createNetworkError();
      }
    }

    await wait(
      Math.min(
        NETWORK_RETRY_DELAY_MS * 2 ** attempt,
        MAX_NETWORK_RETRY_DELAY_MS,
      ),
    );
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    accessToken,
    networkRetryCount = 0,
    networkRetryStatusCodes = [],
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

  const response = await fetchWithNetworkRetry(
    `${API_URL}${path}`,
    {
      ...requestOptions,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    networkRetryCount,
    networkRetryStatusCodes,
  );

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
      typeof responsePayload === "object" && responsePayload !== null
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
