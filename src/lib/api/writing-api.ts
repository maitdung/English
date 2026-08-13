import { apiRequest } from "./api-client";

export const writingTaskTypes = [
  "general",
  "email",
  "essay",
  "toeic",
  "ielts",
] as const;

export const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type WritingTaskType = (typeof writingTaskTypes)[number];
export type CefrLevel = (typeof cefrLevels)[number];

export type WritingReviewRequest = {
  taskType: WritingTaskType;
  level: CefrLevel;
  prompt: string;
  content: string;
  targetWords: number;
  consent: true;
};

export type WritingCriterion = {
  name: string;
  score: number;
  feedbackVi: string;
};

export type WritingCorrection = {
  original: string;
  suggestion: string;
  explanationVi: string;
};

export type WritingVocabularySuggestion = {
  word: string;
  meaningVi: string;
  example: string;
};

export type WritingReview = {
  id: string;
  overallScore: number;
  cefrEstimate: string;
  summaryVi: string;
  criteria: WritingCriterion[];
  corrections: WritingCorrection[];
  strengths: string[];
  priorities: string[];
  improvedVersion: string;
  vocabularySuggestions: WritingVocabularySuggestion[];
  source: string;
  reviewedAt: string;
  taskType?: WritingTaskType;
  level?: CefrLevel;
  prompt?: string;
  content?: string;
  targetWords?: number;
  wordCount?: number;
  aiConsentAt?: string;
  aiConsentVersion?: string;
};

export type WritingHistoryItem = {
  id: string;
  reviewedAt: string;
  taskType?: WritingTaskType;
  level?: CefrLevel;
  prompt?: string;
  wordCount: number;
  overallScore: number;
  cefrEstimate: string;
  source: string;
};

export type WritingHistoryPage = {
  items: WritingHistoryItem[];
  total: number;
  limit: number;
  offset: number;
};

export type WritingPolicy = {
  retentionDays: number;
  consentVersion: string;
  configuredProviders: string[];
  localFallbackAvailable: boolean;
};

export type WritingExport = {
  exportedAt: string;
  retentionDays: number;
  items: WritingReview[];
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

function booleanValue(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function normalizeCriterion(value: unknown): WritingCriterion | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = stringValue(
    value.name,
    stringValue(value.labelVi, stringValue(value.key)),
  );
  const feedbackVi = stringValue(value.feedbackVi, stringValue(value.feedback));

  if (!name || !feedbackVi) {
    return null;
  }

  return {
    name,
    score: numberValue(value.score),
    feedbackVi,
  };
}

function normalizeCorrection(value: unknown): WritingCorrection | null {
  if (!isRecord(value)) {
    return null;
  }

  const original = stringValue(value.original);
  const suggestion = stringValue(
    value.suggestion,
    stringValue(value.corrected),
  );
  const explanationVi = stringValue(
    value.explanationVi,
    stringValue(value.explanation),
  );

  if (!original || !suggestion) {
    return null;
  }

  return { original, suggestion, explanationVi };
}

function normalizeVocabulary(
  value: unknown,
): WritingVocabularySuggestion | null {
  if (!isRecord(value)) {
    return null;
  }

  const word = stringValue(
    value.word,
    stringValue(value.suggestion, stringValue(value.original)),
  );
  const meaningVi = stringValue(value.meaningVi, stringValue(value.meaning));
  const example = stringValue(value.example);

  if (!word) {
    return null;
  }

  return { word, meaningVi, example };
}

function normalizeArray<T>(
  value: unknown,
  normalizeItem: (item: unknown) => T | null,
): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const normalizedItem = normalizeItem(item);
    return normalizedItem ? [normalizedItem] : [];
  });
}

function unwrapRecord(value: unknown): UnknownRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  if (isRecord(value.data)) {
    return value.data;
  }

  if (isRecord(value.review)) {
    return value.review;
  }

  return value;
}

function taskTypeValue(value: unknown): WritingTaskType | undefined {
  return writingTaskTypes.find((item) => item === value);
}

function cefrLevelValue(value: unknown): CefrLevel | undefined {
  return cefrLevels.find((item) => item === value);
}

export function normalizeWritingReview(value: unknown): WritingReview {
  const review = unwrapRecord(value);

  if (!review) {
    throw new Error("Máy chủ trả về kết quả chấm bài không hợp lệ.");
  }

  const reviewedAt = stringValue(
    review.reviewedAt,
    stringValue(review.createdAt, new Date().toISOString()),
  );

  return {
    id: stringValue(review.id, `writing-${reviewedAt}`),
    overallScore: numberValue(review.overallScore, numberValue(review.score)),
    cefrEstimate: stringValue(review.cefrEstimate, "—"),
    summaryVi: stringValue(review.summaryVi, stringValue(review.feedback)),
    criteria: normalizeArray(review.criteria, normalizeCriterion),
    corrections: normalizeArray(review.corrections, normalizeCorrection),
    strengths: stringArray(review.strengths),
    priorities: stringArray(review.priorities),
    improvedVersion: stringValue(review.improvedVersion),
    vocabularySuggestions: normalizeArray(
      review.vocabularySuggestions,
      normalizeVocabulary,
    ),
    source: stringValue(review.source, "fallback"),
    reviewedAt,
    taskType: taskTypeValue(review.taskType),
    level: cefrLevelValue(review.level),
    prompt: stringValue(review.prompt) || undefined,
    content: stringValue(review.content) || undefined,
    targetWords:
      numberValue(review.targetWords) > 0
        ? numberValue(review.targetWords)
        : undefined,
    wordCount:
      numberValue(review.wordCount) >= 0
        ? numberValue(review.wordCount)
        : undefined,
    aiConsentAt: stringValue(review.aiConsentAt) || undefined,
    aiConsentVersion: stringValue(review.aiConsentVersion) || undefined,
  };
}

function normalizeHistoryItem(value: unknown): WritingHistoryItem | null {
  const item = unwrapRecord(value);

  if (!item || !stringValue(item.id)) {
    return null;
  }

  return {
    id: stringValue(item.id),
    reviewedAt: stringValue(item.reviewedAt, stringValue(item.createdAt)),
    taskType: taskTypeValue(item.taskType),
    level: cefrLevelValue(item.level),
    prompt: stringValue(item.prompt) || undefined,
    wordCount: Math.max(0, numberValue(item.wordCount)),
    overallScore: numberValue(item.overallScore, numberValue(item.score)),
    cefrEstimate: stringValue(item.cefrEstimate, "—"),
    source: stringValue(item.source, "fallback"),
  };
}

function normalizeHistoryPage(value: unknown): WritingHistoryPage {
  const page = unwrapRecord(value);

  if (!page) {
    throw new Error("Máy chủ trả về lịch sử không hợp lệ.");
  }

  return {
    items: normalizeArray(page.items, normalizeHistoryItem),
    total: Math.max(0, numberValue(page.total)),
    limit: Math.max(1, numberValue(page.limit, 20)),
    offset: Math.max(0, numberValue(page.offset)),
  };
}

function normalizePolicy(value: unknown): WritingPolicy {
  const policy = unwrapRecord(value);

  if (!policy) {
    throw new Error("Không thể đọc chính sách Writing.");
  }

  return {
    retentionDays: Math.max(1, numberValue(policy.retentionDays, 365)),
    consentVersion: stringValue(policy.consentVersion, "writing-ai-v1"),
    configuredProviders: stringArray(policy.configuredProviders),
    localFallbackAvailable: booleanValue(policy.localFallbackAvailable, true),
  };
}

export async function reviewWritingRequest(
  payload: WritingReviewRequest,
  accessToken: string,
): Promise<WritingReview> {
  const response = await apiRequest<unknown>("/writing/review", {
    method: "POST",
    body: payload,
    accessToken,
  });

  return normalizeWritingReview(response);
}

export async function getWritingHistoryRequest(
  accessToken: string,
  options: { limit?: number; offset?: number } = {},
): Promise<WritingHistoryPage> {
  const limit = Math.min(50, Math.max(1, Math.round(options.limit ?? 20)));
  const offset = Math.max(0, Math.round(options.offset ?? 0));
  const response = await apiRequest<unknown>(
    `/writing/history?limit=${limit}&offset=${offset}`,
    { method: "GET", accessToken },
  );

  return normalizeHistoryPage(response);
}

export async function getWritingReviewRequest(
  id: string,
  accessToken: string,
): Promise<WritingReview> {
  const response = await apiRequest<unknown>(
    `/writing/${encodeURIComponent(id)}`,
    { method: "GET", accessToken },
  );

  return normalizeWritingReview(response);
}

export async function getWritingPolicyRequest(
  accessToken: string,
): Promise<WritingPolicy> {
  const response = await apiRequest<unknown>("/writing/policy", {
    method: "GET",
    accessToken,
  });

  return normalizePolicy(response);
}

export async function deleteWritingReviewRequest(
  id: string,
  accessToken: string,
): Promise<number> {
  const response = await apiRequest<unknown>(
    `/writing/history/${encodeURIComponent(id)}`,
    { method: "DELETE", accessToken },
  );

  const payload = unwrapRecord(response);
  return Math.max(0, numberValue(payload?.deletedCount, 1));
}

export async function deleteWritingHistoryRequest(
  accessToken: string,
): Promise<number> {
  const response = await apiRequest<unknown>("/writing/history", {
    method: "DELETE",
    accessToken,
  });

  const payload = unwrapRecord(response);
  return Math.max(0, numberValue(payload?.deletedCount));
}

export async function exportWritingHistoryRequest(
  accessToken: string,
): Promise<WritingExport> {
  const response = await apiRequest<unknown>("/writing/export", {
    method: "GET",
    accessToken,
  });
  const payload = unwrapRecord(response);

  if (!payload) {
    throw new Error("Máy chủ trả về dữ liệu xuất không hợp lệ.");
  }

  return {
    exportedAt: stringValue(payload.exportedAt, new Date().toISOString()),
    retentionDays: Math.max(1, numberValue(payload.retentionDays, 365)),
    items: normalizeArray(payload.items, (item) => {
      try {
        return normalizeWritingReview(item);
      } catch {
        return null;
      }
    }),
  };
}
