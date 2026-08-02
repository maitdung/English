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

export async function getSpeakingCoachFeedbackRequest(
  payload: SpeakingCoachFeedbackPayload,
  accessToken?: string | null,
): Promise<SpeakingCoachFeedbackResponse> {
  return apiRequest<SpeakingCoachFeedbackResponse>("/speaking-coach/feedback", {
    method: "POST",
    body: payload,
    accessToken,
  });
}
