import {
  reviewWritingRequest,
  type CefrLevel,
  type WritingReview,
  type WritingTaskType,
} from "../lib/api/writing-api";
import { getStoredAccessToken } from "../lib/api/session";

export type AnalyzeWritingOptions = {
  taskType?: WritingTaskType;
  level?: CefrLevel;
  prompt?: string;
  targetWords?: number;
  accessToken?: string;
  /** Must come from a real, unchecked-by-default consent control in the UI. */
  consent?: true;
};

/**
 * Kept for compatibility with older callers. AI requests always go through
 * the authenticated application backend; no provider key is read in-browser.
 */
export async function analyzeWriting(
  content: string,
  options: AnalyzeWritingOptions = {},
): Promise<WritingReview> {
  if (options.consent !== true) {
    throw new Error(
      "Bạn cần đồng ý việc lưu và xử lý bài viết trước khi gửi chấm.",
    );
  }

  return reviewWritingRequest(
    {
      taskType: options.taskType ?? "general",
      level: options.level ?? "B1",
      prompt: options.prompt ?? "Review this English writing.",
      content,
      targetWords: options.targetWords ?? Math.max(30, content.trim().split(/\s+/u).length),
      consent: true,
    },
    options.accessToken ?? getStoredAccessToken(),
  );
}

export type OpenAiResponse = WritingReview;
