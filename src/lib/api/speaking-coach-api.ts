import { apiRequest } from "./api-client";

export type SpeakingCoachFeedbackPayload = {
  topic: string;
  response: string;
};

export type SpeakingCoachFeedbackResponse = {
  score: number;
  feedback: string;
  improvement: string;
  source: "openai" | "xai" | "gemini" | "fallback";
};

export type SpeakingCoachChatMode =
  | "coach"
  | "translate_en_vi"
  | "translate_vi_en";

export type SpeakingCoachChatMessage = {
  role: "assistant" | "user";
  content: string;
};

export type SpeakingCoachChatPayload = {
  topic: string;
  input: string;
  messages: SpeakingCoachChatMessage[];
  mode: SpeakingCoachChatMode;
};

export type SpeakingCoachChatResponse = {
  reply: string;
  translatedText: string;
  correctedText: string;
  source: "openai" | "xai" | "gemini" | "fallback";
  mode: SpeakingCoachChatMode;
};

export async function getSpeakingCoachFeedbackRequest(
  payload: SpeakingCoachFeedbackPayload,
  accessToken?: string | null,
  signal?: AbortSignal,
): Promise<SpeakingCoachFeedbackResponse> {
  return apiRequest<SpeakingCoachFeedbackResponse>("/speaking-coach/feedback", {
    method: "POST",
    body: payload,
    accessToken,
    signal,
  });
}

export async function getSpeakingCoachChatRequest(
  payload: SpeakingCoachChatPayload,
  accessToken?: string | null,
  signal?: AbortSignal,
): Promise<SpeakingCoachChatResponse> {
  return apiRequest<SpeakingCoachChatResponse>("/speaking-coach/chat", {
    method: "POST",
    body: payload,
    accessToken,
    signal,
  });
}
